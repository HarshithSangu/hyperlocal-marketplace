const { Server } = require("socket.io");
const jwt = require("jsonwebtoken");
const Conversation = require("../models/Conversation");
const Message = require("../models/Message");
const User = require("../models/User");

function setupChatSocket(server) {
  const io = new Server(server, {
    cors: {
      origin: process.env.CLIENT_ORIGIN || "*",
      methods: ["GET", "POST"],
    },
  });

  const userSockets = new Map();

  io.use(async (socket, next) => {
    try {
      const token =
        socket.handshake.auth?.token || socket.handshake.query?.token;
      if (!token) return next(new Error("No token"));

      const payload = jwt.verify(token, process.env.JWT_SECRET);
      const user = await User.findById(payload.id).select("role name");
      if (!user) return next(new Error("Invalid user"));

      socket.user = {
        id: user._id.toString(),
        role: user.role,
        name: user.name,
      };
      next();
    } catch (err) {
      next(new Error("Authentication error"));
    }
  });

  io.on("connection", async (socket) => {
    const { id: userId } = socket.user;

    console.log(`User ${userId} connected`);

    if (!userSockets.has(userId)) userSockets.set(userId, new Set());
    userSockets.get(userId).add(socket.id);

    socket.join(`user:${userId}`);

    // Mark user as online
    try {
      await User.findByIdAndUpdate(userId, { isOnline: true });
      console.log(`User ${userId} marked as online`);
      io.emit("user_online", { userId });
    } catch (error) {
      console.error(`Error updating user ${userId} online status:`, error);
    }

    socket.on("join_conversation", ({ conversationId }) => {
      if (!conversationId) return;
      socket.join(`conversation:${conversationId}`);
    });

    socket.on("send_message", async ({ conversationId, message }) => {
      if (!message || !conversationId) return;

      const conversation = await Conversation.findById(conversationId);
      if (!conversation) return;

      const senderId = socket.user.id;
      const isParticipant =
        conversation.userId.toString() === senderId ||
        conversation.sellerId.toString() === senderId;
      if (!isParticipant) return;

      const receiverId =
        conversation.userId.toString() === senderId
          ? conversation.sellerId.toString()
          : conversation.userId.toString();

      const msg = await Message.create({
        conversationId,
        senderId,
        receiverId,
        message,
      });

      conversation.lastMessage = message;
      await conversation.save();

      const payload = {
        id: msg._id.toString(),
        conversationId: conversationId.toString(),
        senderId,
        receiverId,
        message,
        read: false,
        createdAt: msg.createdAt,
      };

      io.to(`conversation:${conversationId}`).emit("receive_message", payload);

      io.to(`user:${receiverId}`).emit("new_message_notification", {
        senderId,
        senderName: socket.user.name,
        conversationId: conversationId.toString(),
        messagePreview: message.slice(0, 80),
      });
    });

    socket.on("typing", ({ conversationId, isTyping }) => {
      if (!conversationId) return;
      socket.to(`conversation:${conversationId}`).emit("typing", {
        conversationId,
        userId: socket.user.id,
        isTyping: !!isTyping,
      });
    });

    socket.on("message_read", async ({ conversationId }) => {
      if (!conversationId) return;

      const readerId = socket.user.id;

      await Message.updateMany(
        {
          conversationId,
          receiverId: readerId,
          read: false,
        },
        { $set: { read: true } },
      );

      socket.to(`conversation:${conversationId}`).emit("message_read", {
        conversationId,
        userId: readerId,
      });
    });

    socket.on("disconnect", async () => {
      console.log(`User ${userId} socket disconnected`);
      const sockets = userSockets.get(userId);
      if (sockets) {
        sockets.delete(socket.id);
        if (sockets.size === 0) {
          userSockets.delete(userId);
          // Mark user as offline and update lastSeen
          const lastSeenDate = new Date();
          try {
            await User.findByIdAndUpdate(userId, {
              isOnline: false,
              lastSeen: lastSeenDate,
            });
            console.log(`User ${userId} marked as offline at ${lastSeenDate}`);
            io.emit("user_offline", { userId, lastSeen: lastSeenDate });
          } catch (error) {
            console.error(
              `Error updating user ${userId} offline status:`,
              error,
            );
          }
        }
      }
    });
  });
}

module.exports = { setupChatSocket };
