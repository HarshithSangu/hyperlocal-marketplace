import React from "react";
import { Link } from "react-router-dom";

export default function FavoriteCard({ favorite, onRemove, isRemoving }) {
  const shopId = favorite?.shopId ?? favorite?.shop?._id ?? favorite?.shop?.id ?? favorite?.id;
  const shopName = favorite?.shopName ?? favorite?.shop?.shopName ?? "Shop";
  const imageUrl = favorite?.shopImageUrl ?? favorite?.shop?.imageUrl ?? favorite?.imageUrl;
  const rating = favorite?.rating ?? favorite?.shop?.rating ?? "—";

  return (
    <div className="bg-white rounded-2xl shadow-md hover:shadow-lg border border-slate-100 overflow-hidden transition-all duration-200 hover:-translate-y-0.5">
      <div className="h-36 bg-slate-100">
        {imageUrl ? (
          <img
            src={imageUrl}
            alt={shopName}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-indigo-100 to-violet-100 flex items-center justify-center">
            <span className="text-5xl text-indigo-300">🏪</span>
          </div>
        )}
      </div>
      <div className="p-4">
        <h4 className="font-semibold text-slate-900 truncate">{shopName}</h4>
        <div className="flex items-center gap-1 mt-1">
          <span className="text-yellow-500">⭐</span>
          <span className="text-sm text-slate-600">
            {typeof rating === "number" ? rating.toFixed(1) : rating}
          </span>
        </div>
        <div className="flex gap-2 mt-3">
          {shopId && (
            <Link
              to={`/shop/${shopId}`}
              className="flex-1 text-center py-2 text-sm font-medium bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-colors"
            >
              View Shop
            </Link>
          )}
          <button
            onClick={() => onRemove?.(favorite)}
            disabled={isRemoving}
            className="px-3 py-2 text-sm font-medium rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 transition-colors disabled:opacity-50"
          >
            {isRemoving ? "..." : "Remove"}
          </button>
        </div>
      </div>
    </div>
  );
}
