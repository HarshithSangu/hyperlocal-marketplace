import React from "react";

const STATUS_STYLES = {
  active: "bg-green-100 text-green-800",
  disabled: "bg-yellow-100 text-yellow-800",
  banned: "bg-red-100 text-red-800",
};

const formatDate = (dateString) => {
  if (!dateString) return "-";
  const d = new Date(dateString);
  if (Number.isNaN(d.getTime())) return dateString;
  return d.toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

const formatRating = (rating) =>
  typeof rating === "number" ? rating.toFixed(1) : "-";

function ApprovedSellerCard({ seller, onNavigate }) {
  return (
    <button
      type="button"
      onClick={() => onNavigate(`/admin/seller/${seller.id}`)}
      className="text-left bg-white rounded-2xl shadow-md hover:shadow-xl transition-all duration-200 ease-in-out p-5 border border-slate-100 hover:border-indigo-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
    >
      <div className="flex items-center gap-4 mb-4">
        <img
          src={seller.imageUrl}
          alt={seller.shopName}
          loading="lazy"
          className="w-14 h-14 rounded-full object-cover border border-slate-200"
        />
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold text-slate-900 truncate">
            {seller.shopName}
          </p>
          <p className="text-xs text-slate-600 truncate">{seller.ownerName}</p>
          <p className="text-xs text-slate-500 truncate">{seller.email}</p>
        </div>
        <span
          className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
            STATUS_STYLES[seller.status] || "bg-slate-100 text-slate-800"
          }`}
        >
          {seller.status === "active"
            ? "Active"
            : seller.status === "disabled"
            ? "Disabled"
            : "Banned"}
        </span>
      </div>

      <div className="flex items-center justify-between text-xs text-slate-600 mb-2">
        <div className="flex items-center gap-1">
          <span className="text-yellow-500">⭐</span>
          <span className="font-medium">{formatRating(seller.rating)}</span>
        </div>
        <span>Approved: {formatDate(seller.approvedAt)}</span>
      </div>
    </button>
  );
}

export default React.memo(ApprovedSellerCard);
