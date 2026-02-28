import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { apiCall } from "../api";
import RatingModal from "../components/RatingModal";

const isShopOpen = (openTime = "09:00", closeTime = "21:00") => {
  try {
    const now = new Date();
    const [openH, openM] = (openTime || "09:00").split(":").map(Number);
    const [closeH, closeM] = (closeTime || "21:00").split(":").map(Number);
    const openMinutes = openH * 60 + (openM || 0);
    const closeMinutes = closeH * 60 + (closeM || 0);
    const nowMinutes = now.getHours() * 60 + now.getMinutes();
    if (openMinutes <= closeMinutes) {
      return nowMinutes >= openMinutes && nowMinutes <= closeMinutes;
    }
    return nowMinutes >= openMinutes || nowMinutes <= closeMinutes;
  } catch {
    return null;
  }
};

const formatDateTime = (dateString) => {
  if (!dateString) return "-";
  const d = new Date(dateString);
  if (Number.isNaN(d.getTime())) return dateString;
  return d.toLocaleString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

const formatCurrency = (value) => {
  if (typeof value !== "number") return "-";
  return value.toLocaleString(undefined, {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
  });
};

function ShopDetailsComponent() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [shop, setShop] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showRatingModal, setShowRatingModal] = useState(false);

  const loadShop = async () => {
    try {
      setLoading(true);
      setError("");
      const data = await apiCall(`/shops/${id}`);
      setShop(data);
    } catch (err) {
      setError(err.message || "Failed to load shop details");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadShop();
  }, [id]);

  useEffect(() => {
    if (!id) return;
    apiCall("/visits", {
      method: "POST",
      body: JSON.stringify({ shopId: id }),
    }).catch(() => {});
  }, [id]);

  const openDirections = () => {
    if (!shop?.latitude || !shop?.longitude) return;
    const url = `https://www.google.com/maps/dir/?api=1&destination=${shop.latitude},${shop.longitude}`;
    window.open(url, "_blank");
  };

  const handleReviewSubmitted = () => {
    setShowRatingModal(false);
    loadShop();
  };

  const openStatus = shop ? isShopOpen(shop.openTime, shop.closeTime) : null;

  // Rating breakdown (5 to 1 stars)
  const getRatingCounts = () => {
    if (!shop?.reviews?.length) return { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
    const counts = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
    shop.reviews.forEach((r) => {
      const star = Math.min(5, Math.max(1, Math.round(r.rating)));
      counts[star] = (counts[star] || 0) + 1;
    });
    return counts;
  };

  const ratingCounts = getRatingCounts();
  const maxCount = Math.max(...Object.values(ratingCounts), 1);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-indigo-50 to-violet-50">
      <header className="sticky top-0 z-50 backdrop-blur-md bg-white/70 border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <button
            onClick={() => navigate(-1)}
            className="px-3 py-1.5 text-sm font-medium rounded-lg border border-slate-200 text-slate-700 bg-white hover:bg-slate-50"
          >
            ← Back
          </button>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {loading && (
          <div className="text-center py-16">
            <div className="inline-block animate-spin w-10 h-10 border-4 border-indigo-200 border-t-indigo-600 rounded-full mb-4" />
            <p className="text-slate-600">Loading shop details...</p>
          </div>
        )}

        {error && !loading && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
            {error}
          </div>
        )}

        {!loading && !error && shop && (
          <>
            {/* TOP SECTION */}
            <section className="bg-white rounded-2xl shadow-md overflow-hidden border border-slate-100 mb-8">
              <div className="flex flex-col md:flex-row">
                <div className="md:w-1/3 h-64 md:h-auto min-h-[280px] bg-slate-100">
                  {shop.imageUrl ? (
                    <img
                      src={shop.imageUrl}
                      alt={shop.shopName}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-indigo-100 to-violet-100 flex items-center justify-center">
                      <span className="text-6xl text-indigo-300">🏪</span>
                    </div>
                  )}
                </div>
                <div className="flex-1 p-6 md:p-8">
                  <h1 className="text-2xl md:text-3xl font-bold text-slate-900">
                    {shop.shopName}
                  </h1>

                  <div className="flex flex-wrap items-center gap-3 mt-2">
                    <div className="flex items-center gap-1">
                      <span className="text-yellow-500">⭐</span>
                      <span className="font-semibold text-slate-800">
                        {(shop.rating ?? 0).toFixed(1)}
                      </span>
                      <span className="text-slate-500 text-sm">
                        ({shop.totalReviews ?? 0} reviews)
                      </span>
                    </div>
                    {openStatus !== null && (
                      <span
                        className={`inline-flex px-3 py-0.5 rounded-full text-xs font-medium ${
                          openStatus
                            ? "bg-green-100 text-green-800"
                            : "bg-red-100 text-red-700"
                        }`}
                      >
                        {openStatus ? "Open Now" : "Closed"}
                      </span>
                    )}
                  </div>

                  <p className="text-slate-600 mt-2">{shop.address}</p>
                  {shop.phone && (
                    <p className="text-slate-600 mt-1">{shop.phone}</p>
                  )}

                  <button
                    onClick={openDirections}
                    className="mt-4 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-sm font-medium flex items-center gap-2"
                  >
                    📍 Directions
                  </button>
                </div>
              </div>
            </section>

            {/* MIDDLE SECTION - RATING SUMMARY */}
            <section className="bg-white rounded-2xl shadow-md p-6 border border-slate-100 mb-8">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div className="flex items-center gap-6">
                  <div className="text-center">
                    <p className="text-4xl font-bold text-slate-900">
                      {(shop.rating ?? 0).toFixed(1)}
                    </p>
                    <div className="flex items-center justify-center gap-1 mt-1">
                      <span className="text-yellow-500">⭐</span>
                      <span className="text-sm text-slate-600">
                        {shop.totalReviews ?? 0} reviews
                      </span>
                    </div>
                  </div>
                  <div className="space-y-1 min-w-[160px]">
                    {[5, 4, 3, 2, 1].map((star) => (
                      <div
                        key={star}
                        className="flex items-center gap-2 text-sm"
                      >
                        <span className="text-slate-600 w-8">
                          {star}⭐
                        </span>
                        <div className="flex-1 h-2 bg-slate-100 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-yellow-500 rounded-full"
                            style={{
                              width: `${(ratingCounts[star] / maxCount) * 100}%`,
                            }}
                          />
                        </div>
                        <span className="text-slate-500 w-6">
                          {ratingCounts[star] || 0}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
                <button
                  onClick={() => setShowRatingModal(true)}
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-sm font-medium shrink-0"
                >
                  Write a Review
                </button>
              </div>
            </section>

            {/* BOTTOM SECTION */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* PRODUCTS */}
              <section className="bg-white rounded-2xl shadow-md p-6 border border-slate-100">
                <h3 className="text-lg font-semibold text-slate-900 mb-4">
                  Products
                </h3>
                {(!shop.products || shop.products.length === 0) && (
                  <p className="text-slate-500 text-sm">
                    No products listed yet.
                  </p>
                )}
                {shop.products && shop.products.length > 0 && (
                  <div className="max-h-64 overflow-y-auto space-y-3">
                    {shop.products.map((p) => (
                      <div
                        key={p.id}
                        className="flex justify-between items-center py-2 border-b border-slate-100 last:border-0"
                      >
                        <span className="font-medium text-slate-800">
                          {p.productName}
                        </span>
                        <div className="flex items-center gap-3 text-sm">
                          <span className="text-slate-700">
                            {formatCurrency(p.price)}
                          </span>
                          <span className="text-slate-400 text-xs">
                            {formatDateTime(p.updatedAt)}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </section>

              {/* REVIEWS */}
              <section className="bg-white rounded-2xl shadow-md p-6 border border-slate-100">
                <h3 className="text-lg font-semibold text-slate-900 mb-4">
                  Reviews
                </h3>
                {(!shop.reviews || shop.reviews.length === 0) && (
                  <p className="text-slate-500 text-sm">
                    No reviews yet. Be the first to review!
                  </p>
                )}
                {shop.reviews && shop.reviews.length > 0 && (
                  <div className="max-h-64 overflow-y-auto space-y-4">
                    {shop.reviews.map((r) => (
                      <div
                        key={r.id}
                        className="py-3 border-b border-slate-100 last:border-0"
                      >
                        <div className="flex items-center justify-between mb-1">
                          <span className="font-medium text-slate-800">
                            {r.userName}
                          </span>
                          <div className="flex items-center gap-1">
                            <span className="text-yellow-500">⭐</span>
                            <span className="text-sm font-medium">
                              {r.rating?.toFixed(1)}
                            </span>
                          </div>
                        </div>
                        {r.comment && (
                          <p className="text-slate-600 text-sm">{r.comment}</p>
                        )}
                        <p className="text-slate-400 text-xs mt-1">
                          {formatDateTime(r.createdAt)}
                        </p>
                      </div>
                    ))}
                  </div>
                )}
              </section>
            </div>
          </>
        )}
      </div>

      {showRatingModal && (
        <RatingModal
          shopId={shop?.id ?? id}
          onClose={() => setShowRatingModal(false)}
          onSuccess={handleReviewSubmitted}
        />
      )}
    </div>
  );
}

export const ShopDetails = React.memo(ShopDetailsComponent);
