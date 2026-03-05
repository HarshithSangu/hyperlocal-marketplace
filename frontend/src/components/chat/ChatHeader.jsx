import React from "react";
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

export function ChatHeader({ name, isOnline, lastSeen, onBack }) {
  return (
    <div className="px-6 py-4 border-b border-gray-200 bg-white flex items-center justify-between shadow-sm">
      <div className="flex items-center gap-3">
        {/* Back Button */}
        {onBack && (
          <button
            onClick={onBack}
            className="p-2 hover:bg-gray-100 rounded-full transition duration-200 flex-shrink-0"
            title="Go back"
          >
            <svg
              className="w-5 h-5 text-gray-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
          </button>
        )}

        {/* Avatar */}
        <div
          className={`w-10 h-10 ${getAvatarColor(name)} rounded-full flex items-center justify-center text-white font-semibold text-sm`}
        >
          {getInitials(name)}
        </div>

        {/* Name and Status */}
        <div>
          <h2 className="font-semibold text-gray-900 text-base">{name}</h2>
          <span
            className={`inline-flex items-center gap-1 text-xs ${
              isOnline ? "text-green-600" : "text-gray-500"
            }`}
          >
            {isOnline ? (
              <>
                <span className="h-2 w-2 bg-green-500 rounded-full"></span>
                Online
              </>
            ) : (
              formatLastSeen(lastSeen)
            )}
          </span>
        </div>
      </div>

      {/* Action buttons */}
      <div className="flex items-center gap-2">
        <button className="p-2 hover:bg-gray-100 rounded-full transition">
          <svg
            className="w-5 h-5 text-gray-600"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
        </button>
      </div>
    </div>
  );
}
