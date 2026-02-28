import React from "react";
import { Link } from "react-router-dom";

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

export default function VisitedItem({ visit }) {
  const shopId = visit?.shopId ?? visit?.shop?._id ?? visit?.shop?.id;
  const shopName = visit?.shopName ?? visit?.shop?.shopName ?? "Shop";
  const visitedAt = visit?.visitedAt ?? visit?.createdAt ?? visit?.date;

  return (
    <div className="flex items-center justify-between gap-4 p-4 bg-white rounded-2xl shadow-md hover:shadow-lg border border-slate-100 transition-all duration-200">
      <div className="min-w-0 flex-1">
        <h4 className="font-semibold text-slate-900 truncate">{shopName}</h4>
        <p className="text-sm text-slate-500 mt-0.5">
          Visited {formatDate(visitedAt)}
        </p>
      </div>
      {shopId && (
        <Link
          to={`/shop/${shopId}`}
          className="flex-shrink-0 px-4 py-2 text-sm font-medium bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-colors"
        >
          View Again
        </Link>
      )}
    </div>
  );
}
