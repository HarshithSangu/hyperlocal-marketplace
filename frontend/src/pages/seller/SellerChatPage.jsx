import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { apiCall } from "../../api";
import { useChat } from "../../context/ChatContext";
import { ChatSidebar } from "../../components/chat/ChatSidebar";
import { ChatWindow } from "../../components/chat/ChatWindow";

export function SellerChatPage() {
  const navigate = useNavigate();
  const { socket, resetUnread } = useChat();

  const [conversations, setConversations] = useState([]);
  const [messages, setMessages] = useState([]);
  const [activeId, setActiveId] = useState(null);
  const [typingInfo, setTypingInfo] = useState(null);
  const [loading, setLoading] = useState(true);

  // Presence state for the current active conversation
  const [participantName, setParticipantName] = useState("");
  const [participantOnline, setParticipantOnline] = useState(false);
  const [participantLastSeen, setParticipantLastSeen] = useState(null);

  const handleBackClick = () => {
    navigate("/seller");
  };

  useEffect(() => {
    const loadConversations = async () => {
      try {
        setLoading(true);
        const data = await apiCall("/chat/conversations");
        setConversations(data);
      } catch (err) {
        console.error("Failed to load conversations", err);
      } finally {
        setLoading(false);
      }
    };

    loadConversations();
  }, []);

  /* ---------------- UPDATE PARTICIPANT PRESENCE FROM ACTIVE CONVERSATION ---------------- */

  useEffect(() => {
    if (!activeId || conversations.length === 0) return;

    const activeConversation = conversations.find((c) => c.id === activeId);
    if (!activeConversation) return;

    // In SellerChatPage, current user is a "seller" role, so we display the user
    const { userName, userOnline, userLastSeen } = activeConversation;

    setParticipantName(userName);
    setParticipantOnline(userOnline);
    setParticipantLastSeen(userLastSeen);
  }, [activeId, conversations]);

  /* ---------------- LOAD MESSAGES ---------------- */

  useEffect(() => {
    if (!activeId) return;

    const loadMessages = async () => {
      try {
        const data = await apiCall(`/chat/messages/${activeId}`);
        setMessages(data);
        resetUnread();

        if (socket) {
          socket.emit("join_conversation", { conversationId: activeId });
          socket.emit("message_read", { conversationId: activeId });
        }
      } catch (err) {
        console.error("Failed to load messages", err);
      }
    };

    loadMessages();
  }, [activeId, socket, resetUnread]);

  /* ---------------- SOCKET LISTENERS FOR PRESENCE ---------- ----*/

  useEffect(() => {
    if (!socket) return;

    const handleUserOnline = (payload) => {
      const { userId } = payload;

      setConversations((prev) => {
        const updated = prev.map((c) => {
          if (c.userId === userId) {
            return { ...c, userOnline: true };
          }
          return c;
        });

        if (activeId) {
          const activeConversation = updated.find((c) => c.id === activeId);
          if (activeConversation?.userId === userId) {
            setParticipantOnline(true);
          }
        }
        return updated;
      });
    };

    const handleUserOffline = (payload) => {
      const { userId, lastSeen } = payload;

      setConversations((prev) => {
        const updated = prev.map((c) => {
          if (c.userId === userId) {
            return { ...c, userOnline: false, userLastSeen: lastSeen };
          }
          return c;
        });

        if (activeId) {
          const activeConversation = updated.find((c) => c.id === activeId);
          if (activeConversation?.userId === userId) {
            setParticipantOnline(false);
            setParticipantLastSeen(lastSeen);
          }
        }
        return updated;
      });
    };

    socket.on("user_online", handleUserOnline);
    socket.on("user_offline", handleUserOffline);

    return () => {
      socket.off("user_online", handleUserOnline);
      socket.off("user_offline", handleUserOffline);
    };
  }, [socket, activeId, conversations]);

  /* ---------------- SOCKET LISTENERS FOR MESSAGES ---------- ----*/

  useEffect(() => {
    if (!socket) return;

    const handleReceive = (msg) => {
      if (msg.conversationId === activeId) {
        setMessages((prev) => [...prev, msg]);
      }
    };

    const handleTyping = (payload) => {
      if (payload.conversationId === activeId) {
        setTypingInfo(payload);
      }
    };

    socket.on("receive_message", handleReceive);
    socket.on("typing", handleTyping);

    return () => {
      socket.off("receive_message", handleReceive);
      socket.off("typing", handleTyping);
    };
  }, [socket, activeId]);

  /* ---------------- SEND MESSAGE ---------------- */

  const handleSend = async (text) => {
    if (!activeId || !text.trim()) return;

    try {
      // 1️⃣ Save message in backend database
      const savedMessage = await apiCall("/chat/message", {
        method: "POST",
        body: JSON.stringify({
          conversationId: activeId,
          message: text.trim(),
        }),
      });

      // 2️⃣ Update UI instantly
      setMessages((prev) => [...prev, savedMessage]);

      // 3️⃣ Notify other user through socket
      if (socket) {
        socket.emit("send_message", savedMessage);
      }
    } catch (err) {
      console.error("Failed to send message", err);
    }
  };

  /* ---------------- UI ---------------- */

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin mb-4">
            <div className="w-8 h-8 border-4 border-indigo-200 border-t-indigo-600 rounded-full"></div>
          </div>
          <p className="text-gray-600 font-medium">Loading conversations...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen bg-white flex overflow-hidden">
      <ChatSidebar
        conversations={conversations}
        activeId={activeId}
        onSelect={setActiveId}
      />

      <ChatWindow
        messages={messages}
        onSend={handleSend}
        typingInfo={typingInfo}
        participantName={participantName}
        isOnline={participantOnline}
        lastSeen={participantLastSeen}
        onBack={handleBackClick}
      />
    </div>
  );
}
