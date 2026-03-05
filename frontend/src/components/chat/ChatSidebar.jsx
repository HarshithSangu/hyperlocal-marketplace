import React from "react";
import { useAuth } from "../../context/AuthContext";
import { formatLastSeen } from "../../utils/formatTime";

function getInitials(name) {
  return (
    name
      ?.split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase() || "?"
  );
}

function getAvatarColor(name) {
  const colors = [
    "bg-red-500",
    "bg-blue-500",
    "bg-green-500",
    "bg-purple-500",
    "bg-yellow-500",
    "bg-pink-500",
    "bg-indigo-500",
  ];
  const index = (name?.charCodeAt(0) || 0) % colors.length;
  return colors[index];
}

export function ChatSidebar({ conversations, activeId, onSelect }) {
  const { user } = useAuth();

  const renderStatus = (c) => {
    if (!user) return null;
    const isUser = user.role === "user";
    const online = isUser ? c.sellerOnline : c.userOnline;
    const lastSeen = isUser ? c.sellerLastSeen : c.userLastSeen;

    if (online) {
      return (
        <div className="text-green-600 text-xs flex items-center gap-1">
          <span className="h-2.5 w-2.5 bg-green-500 rounded-full" />
          Online
        </div>
      );
    }
    if (lastSeen) {
      return (
        <div className="text-slate-500 text-xs">{formatLastSeen(lastSeen)}</div>
      );
    }
    return null;
  };

  const getParticipantName = (c) => c.sellerName || c.userName;

  return (
    <aside className="w-80 border-r border-gray-200 bg-white flex flex-col shadow-sm">
      {/* Header */}
      <div className="px-6 py-4 border-b border-gray-100 bg-white">
        <h1 className="text-2xl font-bold text-gray-900">Messages</h1>
      </div>

      {/* Search bar */}
      <div className="px-4 py-3 border-b border-gray-100">
        <input
          type="text"
          placeholder="Search conversations..."
          className="w-full px-3 py-2 bg-gray-100 rounded-full text-sm outline-none focus:bg-gray-200 transition"
        />
      </div>

      {/* Conversations list */}
      <div className="flex-1 overflow-y-auto">
        {conversations.map((c) => {
          const name = getParticipantName(c);
          return (
            <button
              key={c.id}
              type="button"
              onClick={() => onSelect(c.id)}
              className={`w-full px-4 py-3 flex items-start gap-3 hover:bg-gray-50 transition duration-150 border-b border-gray-50 ${
                activeId === c.id
                  ? "bg-indigo-50 border-l-4 border-l-indigo-500"
                  : "bg-white"
              }`}
            >
              {/* Avatar */}
              <div className="relative flex-shrink-0 mt-0.5">
                <div
                  className={`w-12 h-12 ${getAvatarColor(name)} rounded-full flex items-center justify-center text-white font-semibold text-sm`}
                >
                  {getInitials(name)}
                </div>
                {/* Online indicator */}
                {user && user.role === "user" && c.sellerOnline && (
                  <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></span>
                )}
                {user && user.role === "seller" && c.userOnline && (
                  <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></span>
                )}
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-1">
                  <h3 className="font-500 text-gray-900 text-sm">{name}</h3>
                  <span className="text-xs text-gray-500 ml-2 flex-shrink-0">
                    {renderStatus(c)}
                  </span>
                </div>
                {c.lastMessage && (
                  <p className="text-xs text-gray-500 truncate">
                    {c.lastMessage}
                  </p>
                )}
              </div>
            </button>
          );
        })}

        {conversations.length === 0 && (
          <div className="flex items-center justify-center h-64 text-gray-400">
            <div className="text-center">
              <p className="text-sm">No conversations yet</p>
            </div>
          </div>
        )}
      </div>
    </aside>
  );
}
