import React from "react";

const formatDate = (dateString) => {
  if (!dateString) return "—";
  const d = new Date(dateString);
  if (Number.isNaN(d.getTime())) return dateString;
  return d.toLocaleDateString(undefined, {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};

export default function ProfileHeader({ user, stats, loading }) {
  if (loading) {
    return (
      <div className="bg-white rounded-2xl shadow-lg overflow-hidden border border-slate-100">
        <div className="h-32 bg-gradient-to-r from-indigo-500 via-violet-500 to-purple-600 animate-pulse" />
        <div className="p-6 -mt-16 relative">
          <div className="w-24 h-24 rounded-full bg-slate-200 animate-pulse mx-auto" />
          <div className="mt-4 h-6 bg-slate-200 rounded w-48 mx-auto animate-pulse" />
          <div className="mt-2 h-4 bg-slate-100 rounded w-64 mx-auto animate-pulse" />
        </div>
      </div>
    );
  }

  const displayName = user?.name || "User";
  const displayEmail = user?.email || "—";
  const joinedDate = formatDate(user?.createdAt || user?.joinedAt);

  const statItems = [
    { label: "Total Reviews", value: stats?.totalReviews ?? 0, icon: "⭐" },
    { label: "Favorite Shops", value: stats?.favoriteShops ?? 0, icon: "❤️" },
    { label: "Shops Visited", value: stats?.shopsVisited ?? 0, icon: "🏪" },
    { label: "Total Searches", value: stats?.totalSearches ?? 0, icon: "🔍" },
  ];

  return (
    <div className="bg-white rounded-2xl shadow-lg overflow-hidden border border-slate-100">
      {/* Gradient header */}
      <div className="h-32 bg-gradient-to-r from-indigo-500 via-violet-500 to-purple-600" />

      <div className="px-6 pb-6 -mt-16 relative">
        {/* Profile image */}
        <div className="flex justify-center">
          <div className="w-28 h-28 rounded-full border-4 border-white shadow-xl overflow-hidden bg-gradient-to-br from-indigo-100 to-violet-100 flex items-center justify-center">
            {user?.profileImage || user?.avatar ? (
              <img
                src={user.profileImage || user.avatar}
                alt={displayName}
                className="w-full h-full object-cover"
              />
            ) : (
              <span className="text-5xl text-indigo-400">👤</span>
            )}
          </div>
        </div>

        {/* Name & email */}
        <div className="text-center mt-4">
          <h1 className="text-2xl md:text-3xl font-bold text-slate-900">
            {displayName}
          </h1>
          <p className="text-slate-600 mt-1">{displayEmail}</p>
          <p className="text-sm text-slate-500 mt-1">Joined {joinedDate}</p>
        </div>

        {/* Quick stats badges */}
        <div className="mt-6 flex flex-wrap justify-center gap-3">
          {statItems.map(({ label, value, icon }) => (
            <div
              key={label}
              className="flex items-center gap-2 px-4 py-2 bg-slate-50 hover:bg-slate-100 rounded-xl border border-slate-100 transition-colors duration-200"
            >
              <span className="text-lg">{icon}</span>
              <span className="font-semibold text-slate-800">{value}</span>
              <span className="text-sm text-slate-600">{label}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
