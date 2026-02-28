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

const renderStars = (rating) => {
  const stars = [];
  const r = Math.min(5, Math.max(0, Math.round(rating || 0)));
  for (let i = 0; i < 5; i++) {
    stars.push(
      <span key={i} className={i < r ? "text-yellow-500" : "text-slate-200"}>
        ⭐
      </span>
    );
  }
  return stars;
};

export default function ReviewCard({
  review,
  onEdit,
  onDelete,
  isDeleting,
}) {
  const shopId = review?.shopId ?? review?.shop?._id ?? review?.shop?.id;
  const shopName = review?.shopName ?? review?.shop?.shopName ?? "Shop";
  const imageUrl = review?.shopImageUrl ?? review?.shop?.imageUrl;

  return (
    <div className="bg-white rounded-2xl shadow-md hover:shadow-lg border border-slate-100 overflow-hidden transition-all duration-200">
      <div className="flex flex-col sm:flex-row">
        <div className="sm:w-24 h-24 sm:h-auto min-h-[96px] bg-slate-100 flex-shrink-0">
          {imageUrl ? (
            <img
              src={imageUrl}
              alt={shopName}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-indigo-100 to-violet-100 flex items-center justify-center">
              <span className="text-3xl text-indigo-300">🏪</span>
            </div>
          )}
        </div>
        <div className="flex-1 p-4">
          <div className="flex flex-wrap items-center justify-between gap-2">
            {shopId ? (
              <Link
                to={`/shop/${shopId}`}
                className="font-semibold text-slate-900 hover:text-indigo-600 transition-colors"
              >
                {shopName}
              </Link>
            ) : (
              <span className="font-semibold text-slate-900">{shopName}</span>
            )}
            <div className="flex items-center gap-1">
              {renderStars(review?.rating)}
              <span className="text-sm text-slate-600 ml-1">
                {review?.rating?.toFixed?.(1) ?? "—"}
              </span>
            </div>
          </div>
          <p className="text-slate-600 mt-2 text-sm line-clamp-2">
            {review?.reviewText ?? review?.comment ?? "—"}
          </p>
          <p className="text-xs text-slate-500 mt-2">
            {formatDate(review?.createdAt ?? review?.date)}
          </p>
          <div className="flex gap-2 mt-3">
            <button
              onClick={() => onEdit?.(review)}
              className="px-3 py-1.5 text-sm font-medium rounded-lg border border-slate-200 text-slate-700 hover:bg-slate-50 transition-colors"
            >
              Edit
            </button>
            <button
              onClick={() => onDelete?.(review)}
              disabled={isDeleting}
              className="px-3 py-1.5 text-sm font-medium rounded-lg border border-red-200 text-red-600 hover:bg-red-50 transition-colors disabled:opacity-50"
            >
              {isDeleting ? "Deleting..." : "Delete"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
