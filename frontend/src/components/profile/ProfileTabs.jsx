import React from "react";

const TABS = [
  { id: "reviews", label: "My Reviews" },
  { id: "favorites", label: "Favorites" },
  { id: "visited", label: "Visited Shops" },
  { id: "search-history", label: "Search History" },
];

export default function ProfileTabs({ activeTab, onTabChange }) {
  return (
    <div className="flex flex-wrap gap-2">
      {TABS.map((tab) => {
        const isActive = activeTab === tab.id;
        return (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            className={`px-4 py-2.5 rounded-xl font-medium text-sm transition-all duration-200 ${
              isActive
                ? "bg-indigo-600 text-white shadow-md"
                : "bg-slate-100 text-slate-600 hover:bg-slate-200"
            }`}
          >
            {tab.label}
          </button>
        );
      })}
    </div>
  );
}
