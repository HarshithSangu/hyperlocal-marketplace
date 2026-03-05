const mongoose = require("mongoose");
const Conversation = require("../models/Conversation");
const Message = require("../models/Message");

function ensureAuth(req, res) {
  if (!req.user) {
    res.status(401).json({ message: "Authentication required" });
    return false;
  }
  return true;
}

/* ---------------- CREATE CONVERSATION ---------------- */

exports.createConversation = async (req, res, next) => {
  try {
    if (!ensureAuth(req, res)) return;

    const { sellerId } = req.body;

    if (!sellerId || !mongoose.Types.ObjectId.isValid(sellerId)) {
      return res.status(400).json({ message: "Invalid sellerId" });
    }

    const userId = req.user.id;

    if (userId === sellerId) {
      return res
        .status(400)
        .json({ message: "Cannot start conversation with yourself" });
    }

    let conversation = await Conversation.findOne({ userId, sellerId });

    if (!conversation) {
      conversation = await Conversation.create({ userId, sellerId });
    }

    res.json({
      conversationId: conversation._id.toString(),
    });
  } catch (err) {
    next(err);
  }
};

/* ---------------- GET CONVERSATIONS ---------------- */

exports.getConversations = async (req, res, next) => {
  try {
    if (!ensureAuth(req, res)) return;

    const userId = req.user.id;
    const role = req.user.role;

    const filter =
      role === "seller" ? { sellerId: userId } : { userId };

    const conversations = await Conversation.find(filter)
      .sort({ updatedAt: -1 })
      .populate("userId", "name isOnline lastSeen")
      .populate("sellerId", "name isOnline lastSeen");

    res.json(
      conversations.map((c) => ({
        id: c._id,
        userId: c.userId?._id,
        userName: c.userId?.name || "User",
        userOnline: c.userId?.isOnline || false,
        userLastSeen: c.userId?.lastSeen || null,
        sellerId: c.sellerId?._id,
        sellerName: c.sellerId?.name || "Seller",
        sellerOnline: c.sellerId?.isOnline || false,
        sellerLastSeen: c.sellerId?.lastSeen || null,
        lastMessage: c.lastMessage || "",
        updatedAt: c.updatedAt,
      }))
    );
  } catch (err) {
    next(err);
  }
};

/* ---------------- GET MESSAGES ---------------- */

exports.getMessages = async (req, res, next) => {
  try {
    if (!ensureAuth(req, res)) return;

    const { conversationId } = req.params;

    if (!conversationId || !mongoose.Types.ObjectId.isValid(conversationId)) {
      return res.status(400).json({ message: "Invalid conversationId" });
    }

    const conversation = await Conversation.findById(conversationId);

    if (!conversation) {
      return res.status(404).json({ message: "Conversation not found" });
    }

    const userId = req.user.id;

    const isParticipant =
      conversation.userId.toString() === userId ||
      conversation.sellerId.toString() === userId;

    if (!isParticipant) {
      return res.status(403).json({ message: "Not part of this conversation" });
    }

    const messages = await Message.find({ conversationId })
      .sort({ createdAt: 1 })
      .lean();

    res.json(
      messages.map((m) => ({
        id: m._id,
        conversationId: m.conversationId,
        senderId: m.senderId,
        receiverId: m.receiverId,
        message: m.message,
        read: m.read,
        createdAt: m.createdAt,
      }))
    );
  } catch (err) {
    next(err);
  }
};

/* ---------------- SEND MESSAGE ---------------- */

exports.sendMessage = async (req, res, next) => {
  try {
    if (!ensureAuth(req, res)) return;

    const { conversationId, message } = req.body;

    if (!conversationId || !mongoose.Types.ObjectId.isValid(conversationId)) {
      return res.status(400).json({ message: "Invalid conversationId" });
    }

    if (!message || message.trim() === "") {
      return res.status(400).json({ message: "Message cannot be empty" });
    }

    const conversation = await Conversation.findById(conversationId);

    if (!conversation) {
      return res.status(404).json({ message: "Conversation not found" });
    }

    const senderId = req.user.id;

    const receiverId =
      conversation.userId.toString() === senderId
        ? conversation.sellerId
        : conversation.userId;

    const newMessage = await Message.create({
      conversationId,
      senderId,
      receiverId,
      message,
      read: false,
    });

    conversation.lastMessage = message;
    conversation.updatedAt = newMessage.createdAt;
    await conversation.save();

    res.json({
      id: newMessage._id,
      conversationId,
      senderId,
      receiverId,
      message,
      read: false,
      createdAt: newMessage.createdAt,
    });

  } catch (err) {
    next(err);
  }
};