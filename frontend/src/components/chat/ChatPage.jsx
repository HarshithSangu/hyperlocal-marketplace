import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { apiCall } from "../../api";
import { useChat } from "../../context/ChatContext";
import { ChatSidebar } from "./ChatSidebar";
import { ChatWindow } from "./ChatWindow";

export function ChatPage() {
  const { conversationId } = useParams();
  const navigate = useNavigate();
  const { socket, resetUnread } = useChat();

  const [conversations, setConversations] = useState([]);
  const [messages, setMessages] = useState([]);
  const [activeId, setActiveId] = useState(conversationId);
  const [typingInfo, setTypingInfo] = useState(null);

  // Presence state for the current active conversation
  const [participantName, setParticipantName] = useState("");
  const [participantOnline, setParticipantOnline] = useState(false);
  const [participantLastSeen, setParticipantLastSeen] = useState(null);

  const handleBackClick = () => {
    navigate("/search");
  };

  useEffect(() => {
    apiCall("/chat/conversations")
      .then(setConversations)
      .catch((err) => console.error("Failed to load conversations", err));
  }, []);

  /* ---------------- UPDATE PARTICIPANT PRESENCE FROM ACTIVE CONVERSATION ---------------- */

  useEffect(() => {
    if (!activeId || conversations.length === 0) return;

    const activeConversation = conversations.find((c) => c.id === activeId);
    if (!activeConversation) return;

    // Determine which participant we're talking to
    // This will be the "other" participant (not the current user's role)
    const {
      userName,
      userOnline,
      userLastSeen,
      sellerName,
      sellerOnline,
      sellerLastSeen,
    } = activeConversation;

    // In ChatPage, current user is a "user" role, so we display the seller
    setParticipantName(sellerName);
    setParticipantOnline(sellerOnline);
    setParticipantLastSeen(sellerLastSeen);
  }, [activeId, conversations]);

  /* ---------------- LOAD MESSAGES ---------------- */

  useEffect(() => {
    if (!activeId) return;

    apiCall(`/chat/messages/${activeId}`)
      .then((data) => {
        setMessages(data);
        resetUnread();

        if (socket) {
          socket.emit("join_conversation", { conversationId: activeId });
          socket.emit("message_read", { conversationId: activeId });
        }
      })
      .catch((err) => console.error("Failed to load messages", err));
  }, [activeId, socket, resetUnread]);

  /* ---------------- SOCKET LISTENERS FOR PRESENCE ---------- ----*/

  useEffect(() => {
    if (!socket) return;

    const handleUserOnline = (payload) => {
      const { userId } = payload;

      setConversations((prev) => {
        const updated = prev.map((c) => {
          if (c.sellerId === userId) {
            return { ...c, sellerOnline: true };
          }
          return c;
        });

        if (activeId) {
          const activeConversation = updated.find((c) => c.id === activeId);
          if (activeConversation?.sellerId === userId) {
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
          if (c.sellerId === userId) {
            return { ...c, sellerOnline: false, sellerLastSeen: lastSeen };
          }
          return c;
        });

        if (activeId) {
          const activeConversation = updated.find((c) => c.id === activeId);
          if (activeConversation?.sellerId === userId) {
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
