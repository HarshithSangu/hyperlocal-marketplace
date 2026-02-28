import React from "react";
import { useNavigate } from "react-router-dom";

/**
 * Clickable shop card that navigates to /shop/:id.
 * Renders the same UI as ShopCard; avoids import to prevent "ShopCard is not defined" errors.
 * Preserves Directions and Items buttons.
 */
export default function ShopCardLink({ shop, openDirections, onItemsClick }) {
  const navigate = useNavigate();
  const shopId = shop?.shopId ?? shop?.id ?? shop?._id;

  const isShopOpen = (openTime = "09:00", closeTime = "21:00") => {
    const now = new Date();
    const current = now.getHours() * 60 + now.getMinutes();
    const [openH, openM] = (openTime || "09:00").split(":").map(Number);
    const [closeH, closeM] = (closeTime || "21:00").split(":").map(Number);
    const openMinutes = openH * 60 + (openM || 0);
    const closeMinutes = closeH * 60 + (closeM || 0);
    return current >= openMinutes && current <= closeMinutes;
  };

  const handleCardClick = (e) => {
    if (!shopId) return;
    if (e.target.closest("button")) return;
    navigate(`/shop/${shopId}`);
  };

  return (
    <div
      onClick={handleCardClick}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if ((e.key === "Enter" || e.key === " ") && shopId) {
          e.preventDefault();
          navigate(`/shop/${shopId}`);
        }
      }}
      className="cursor-pointer"
    >
      <div className="bg-white rounded-2xl shadow-md hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 hover:scale-105 overflow-hidden flex flex-col">
        <div className="w-full h-40 bg-gray-100 flex items-center justify-center overflow-hidden">
          {shop?.imageUrl ? (
            <img
              src={shop.imageUrl}
              alt={shop.shopName}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-indigo-100 to-violet-100 flex items-center justify-center">
              <span className="text-5xl text-indigo-300">🏪</span>
            </div>
          )}
        </div>
        <div className="p-4 flex flex-col flex-1">
          <h4 className="font-semibold text-gray-800 text-base">
            {shop?.shopName}
          </h4>
          <div className="flex items-center gap-1 mt-1">
            <span className="text-yellow-500">⭐</span>
            <span className="text-sm font-medium text-gray-700">
              {shop?.rating?.toFixed?.(1) || "4.2"}
            </span>
            <span className="text-xs text-gray-500">
              ({shop?.totalReviews ?? 20})
            </span>
          </div>
          <div className="mt-2">
            {isShopOpen(shop?.openTime, shop?.closeTime) ? (
              <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full">
                Open Now
              </span>
            ) : (
              <span className="text-xs bg-red-100 text-red-600 px-2 py-1 rounded-full">
                Closed
              </span>
            )}
          </div>
          <p className="text-sm text-gray-500 mt-2">{shop?.address}</p>
          <p className="text-sm text-gray-600 mt-2">
            {shop?.distanceMeters != null
              ? (shop.distanceMeters / 1000).toFixed(2)
              : "—"} km away
          </p>
          <div className="flex gap-2 mt-4">
            <button
              onClick={(e) => {
                e.stopPropagation();
                onItemsClick?.(shop);
              }}
              className="flex-1 border border-gray-300 text-gray-700 py-2 rounded-lg text-sm hover:bg-gray-100"
            >
              Items
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                openDirections?.(shop?.latitude, shop?.longitude);
              }}
              className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white py-2 rounded-lg text-sm"
            >
              Directions
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
