import React from "react";
import { useAuth } from "../../context/AuthContext";

export function MessageBubble({ message }) {
  const { user } = useAuth();
  const currentId = user?.id || user?._id;
  const isMine = message.senderId === currentId;

  const formatTime = (date) => {
    return new Date(date).toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  };

  return (
    <div
      className={`flex gap-2 ${
        isMine ? "justify-end" : "justify-start"
      } animate-fade-in`}
    >
      <div
        className={`max-w-[60%] px-4 py-2.5 rounded-2xl text-sm break-words shadow-sm transition duration-200 ${
          isMine
            ? "bg-indigo-500 text-white rounded-br-none hover:bg-indigo-600"
            : "bg-white text-gray-900 border border-gray-200 rounded-bl-none hover:shadow-md"
        }`}
      >
        <p>{message.message}</p>
        <p
          className={`text-xs mt-1 ${
            isMine ? "text-indigo-100" : "text-gray-500"
          }`}
        >
          {formatTime(message.createdAt)}
        </p>
      </div>
    </div>
  );
}
