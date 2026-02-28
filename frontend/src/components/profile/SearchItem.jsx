import React from "react";

const formatDate = (dateString) => {
  if (!dateString) return "—";
  const d = new Date(dateString);
  if (Number.isNaN(d.getTime())) return dateString;
  return d.toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

export default function SearchItem({ item, onSearchAgain }) {
  const query = item?.query ?? item?.searchQuery ?? item?.search ?? "—";
  const createdAt = item?.createdAt ?? item?.date;

  return (
    <div className="flex items-center justify-between gap-4 p-4 bg-white rounded-2xl shadow-md hover:shadow-lg border border-slate-100 transition-all duration-200">
      <div className="min-w-0 flex-1">
        <p className="font-medium text-slate-900 truncate">"{query}"</p>
        <p className="text-sm text-slate-500 mt-0.5">
          {formatDate(createdAt)}
        </p>
      </div>
      <button
        onClick={() => onSearchAgain?.(query)}
        className="flex-shrink-0 px-4 py-2 text-sm font-medium bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-colors"
      >
        Search Again
      </button>
    </div>
  );
}
