import React, {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { io } from "socket.io-client";
import { useAuth } from "./AuthContext";

const ChatContext = createContext(null);

export function ChatProvider({ children }) {
  const { user } = useAuth();

  const socketRef = useRef(null);
  const [socket, setSocket] = useState(null);

  const [unreadCount, setUnreadCount] = useState(0);
  const [lastNotification, setLastNotification] = useState(null);

  useEffect(() => {
    if (!user) {
      if (socketRef.current) {
        socketRef.current.disconnect();
        socketRef.current = null;
      }

      setSocket(null);
      setUnreadCount(0);
      setLastNotification(null);
      return;
    }

    const token = localStorage.getItem("token");

    const s = io(import.meta.env.VITE_API_URL, {
      auth: { token },
      transports: ["websocket"],
    });

    socketRef.current = s;
    setSocket(s);

    s.on("connect", () => {
      console.log("✅ Socket connected:", s.id);
    });

    s.on("connect_error", (err) => {
      console.error("Socket connect error:", err.message);
    });

    s.on("new_message_notification", (payload) => {
      setUnreadCount((c) => c + 1);
      setLastNotification(payload);
    });

    return () => {
      s.disconnect();
    };
  }, [user]);

  const resetUnread = () => setUnreadCount(0);

  return (
    <ChatContext.Provider
      value={{ socket, unreadCount, resetUnread, lastNotification }}
    >
      {children}
    </ChatContext.Provider>
  );
}

export function useChat() {
  const ctx = useContext(ChatContext);
  if (!ctx) throw new Error("useChat must be used within ChatProvider");
  return ctx;
}
