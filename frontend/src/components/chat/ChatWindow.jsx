import React, { useEffect, useRef } from "react";
import { MessageBubble } from "./MessageBubble";
import { MessageInput } from "./MessageInput";
import { ChatHeader } from "./ChatHeader";

export function ChatWindow({
  messages,
  onSend,
  typingInfo,
  participantName,
  isOnline,
  lastSeen,
  onBack,
}) {
  const bottomRef = useRef(null);

  useEffect(() => {
    if (bottomRef.current) {
      bottomRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, typingInfo]);

  // Show empty state if no participant selected
  if (!participantName) {
    return (
      <section className="flex-1 flex flex-col bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="flex items-center justify-center h-full">
          <div className="text-center text-gray-400">
            <div className="mb-4">
              <svg
                className="w-16 h-16 mx-auto text-gray-300"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                />
              </svg>
            </div>
            <p className="text-lg font-medium">
              Select a conversation to start chatting
            </p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="flex-1 flex flex-col bg-white">
      <ChatHeader
        name={participantName}
        isOnline={isOnline}
        lastSeen={lastSeen}
        onBack={onBack}
      />
      <div className="flex-1 overflow-y-auto p-6 bg-gray-50 space-y-4">
        {messages.length === 0 && (
          <div className="flex items-center justify-center h-full text-gray-400">
            <p className="text-sm">No messages yet. Start a conversation!</p>
          </div>
        )}
        {messages.map((m) => (
          <MessageBubble key={m.id} message={m} />
        ))}
        {typingInfo?.isTyping && (
          <div className="text-xs text-gray-500 mb-2 animate-pulse">
            <span className="inline-block">Typing</span>
            <span className="inline-flex gap-1 ml-1">
              <span className="w-1.5 h-1.5 bg-gray-400 rounded-full"></span>
              <span className="w-1.5 h-1.5 bg-gray-400 rounded-full"></span>
              <span className="w-1.5 h-1.5 bg-gray-400 rounded-full"></span>
            </span>
          </div>
        )}
        <div ref={bottomRef} />
      </div>
      <MessageInput onSend={onSend} />
    </section>
  );
}
