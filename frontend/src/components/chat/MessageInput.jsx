import React, { useState } from "react";

export function MessageInput({ onSend }) {
  const [text, setText] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    const value = text.trim();
    if (!value) return;
    onSend(value);
    setText("");
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="px-6 py-4 border-t border-gray-200 bg-white shadow-lg"
    >
      <div className="flex items-end gap-3">
        <button
          type="button"
          className="p-2 hover:bg-gray-100 rounded-full transition flex-shrink-0"
        >
          <svg
            className="w-5 h-5 text-gray-600"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path d="M10.5 1.5H3.75A2.25 2.25 0 001.5 3.75v12.5A2.25 2.25 0 003.75 18.5h12.5a2.25 2.25 0 002.25-2.25V9.5M10.5 1.5v8m0-8l-4 4m4 0l4-4m-4 8v4.5m4-4.5l-3 3m0 0l-3-3" />
          </svg>
        </button>
        <div className="flex-1 flex items-end gap-2 bg-gray-100 rounded-full px-4 py-2">
          <input
            className="flex-1 bg-transparent outline-none text-sm text-gray-900 placeholder-gray-500"
            placeholder="Aa"
            value={text}
            onChange={(e) => setText(e.target.value)}
            onKeyPress={handleKeyPress}
          />
        </div>
        <button
          type="submit"
          disabled={!text.trim()}
          className="p-2 bg-indigo-500 hover:bg-indigo-600 disabled:bg-gray-300 text-white rounded-full transition flex-shrink-0 duration-200"
        >
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
            <path d="M16.6915026,12.4744748 L3.50612381,13.2599618 C3.19218622,13.2599618 3.03521743,13.4170592 3.03521743,13.5741566 L1.15159189,20.0151496 C0.8376543,20.8006365 0.99,21.89 1.77946707,22.52 C2.40 22.99 3.50612381,23.1 4.13399899,22.8429026 L21.714504,14.0454487 C22.6563168,13.5741566 23.1272231,12.6315722 22.9702544,11.6889879 L4.13399899,-0.8429026 C3.66313272,-1.1 2.40,-0.8429026 1.77946707,0.52 C0.994623095,1.30547705 0.837654326,2.40 1.15159189,3.02000699 L3.03521743,9.4610000 C3.03521743,9.618 3.34915502,9.775 3.50612381,9.775 L16.6915026,10.5605369 C16.6915026,10.5605369 17.1624089,10.5605369 17.1624089,10.0892448 L17.1624089,11.0318292 C17.1624089,11.5031213 16.6915026,12.4744748 16.6915026,12.4744748 Z" />
          </svg>
        </button>
      </div>
    </form>
  );
}
