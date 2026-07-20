import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { apiCall } from "../api";
import RatingModal from "../components/RatingModal";

const isShopOpen = (openTime = "09:00", closeTime = "21:00") => {
  try {
    const now = new Date();
    const [openH, openM] = openTime.split(":").map(Number);
    const [closeH, closeM] = closeTime.split(":").map(Number);

    const openMinutes = openH * 60 + openM;
    const closeMinutes = closeH * 60 + closeM;
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
  return d.toLocaleString();
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
  const [creatingConversation, setCreatingConversation] = useState(false);

  /* ---------------- LOAD SHOP ---------------- */

  const loadShop = async () => {
    try {
      setLoading(true);
      setError("");

      const data = await apiCall(`/shops/${id}`);

      console.log("FULL API RESPONSE:", data);
      console.log("SELLER ID:", data?.sellerId);

      setShop(data);
    } catch (err) {
      console.error(err);
      setError(err.message || "Failed to load shop details");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadShop();
  }, [id]);

  /* ---------------- VISIT TRACKING ---------------- */

  useEffect(() => {
    if (!id) return;

    apiCall("/visits", {
      method: "POST",
      body: JSON.stringify({ shopId: id }),
    }).catch(() => {});
  }, [id]);

  /* ---------------- DIRECTIONS ---------------- */

  const openDirections = () => {
    if (!shop?.latitude || !shop?.longitude) return;

    const url = `https://www.openstreetmap.org/directions?engine=fossgis_osrm_car&to=${shop.latitude},${shop.longitude}`;
    window.open(url, "_blank");
  };

  /* ---------------- START CHAT ---------------- */

  const startChat = async () => {

    if (!shop || !shop.sellerId) {
      console.log("Shop state:", shop);
      alert("Shop still loading. Please try again.");
      return;
    }

    try {
      setCreatingConversation(true);

      const data = await apiCall("/chat/conversation", {
        method: "POST",
        body: JSON.stringify({
          sellerId: shop.sellerId,
        }),
      });

      console.log("CHAT RESPONSE:", data);

      if (data?.conversationId) {
        navigate(`/chat/${data.conversationId}`);
      }

    } catch (err) {
      console.error("Chat start failed:", err);
    } finally {
      setCreatingConversation(false);
    }
  };

  const handleReviewSubmitted = () => {
    setShowRatingModal(false);
    loadShop();
  };

  const openStatus = shop ? isShopOpen(shop.openTime, shop.closeTime) : null;

  /* ---------------- UI ---------------- */

  if (loading) {
    return (
      <div className="text-center py-20 text-gray-600">
        Loading shop details...
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-20 text-red-500">
        {error}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">

      {/* HEADER */}
      <header className="bg-white border-b p-4">
        <button
          onClick={() => navigate(-1)}
          className="px-3 py-1 border rounded"
        >
          ← Back
        </button>
      </header>

      <div className="max-w-6xl mx-auto p-6">

        {shop && (
          <>
            {/* SHOP INFO */}
            <div className="bg-white rounded-xl shadow p-6 mb-6">

              <h1 className="text-3xl font-bold">
                {shop.shopName}
              </h1>

              <p className="text-gray-600 mt-2">
                {shop.address}
              </p>

              <div className="mt-2">
                ⭐ {(shop.rating ?? 0).toFixed(1)} ({shop.totalReviews} reviews)
              </div>

              {openStatus !== null && (
                <div className="mt-2">
                  {openStatus ? "🟢 Open Now" : "🔴 Closed"}
                </div>
              )}

              <div className="flex gap-3 mt-4">

                <button
                  onClick={openDirections}
                  className="px-4 py-2 bg-indigo-600 text-white rounded"
                >
                  📍 Directions
                </button>

                <button
                  onClick={startChat}
                  disabled={!shop?.sellerId || creatingConversation}
                  className="px-4 py-2 bg-emerald-600 text-white rounded disabled:opacity-50"
                >
                  💬 {creatingConversation ? "Starting..." : "Chat with Seller"}
                </button>

              </div>
            </div>

            {/* PRODUCTS */}
            <div className="bg-white rounded-xl shadow p-6 mb-6">

              <h3 className="text-xl font-semibold mb-4">
                Products
              </h3>

              {(!shop.products || shop.products.length === 0) && (
                <p>No products listed yet.</p>
              )}

              {shop.products?.map((p) => (
                <div
                  key={p.id}
                  className="flex justify-between py-2 border-b"
                >
                  <span>{p.productName}</span>
                  <span>{formatCurrency(p.price)}</span>
                </div>
              ))}

            </div>

            {/* REVIEWS */}
            <div className="bg-white rounded-xl shadow p-6">

              <div className="flex justify-between mb-4">

                <h3 className="text-xl font-semibold">
                  Reviews
                </h3>

                <button
                  onClick={() => setShowRatingModal(true)}
                  className="px-4 py-2 bg-indigo-600 text-white rounded"
                >
                  Write Review
                </button>

              </div>

              {(!shop.reviews || shop.reviews.length === 0) && (
                <p>No reviews yet.</p>
              )}

              {shop.reviews?.map((r) => (
                <div key={r.id} className="py-3 border-b">

                  <div className="flex justify-between">
                    <span>{r.userName}</span>
                    <span>⭐ {r.rating}</span>
                  </div>

                  <p className="text-sm">
                    {r.comment}
                  </p>

                  <p className="text-xs text-gray-500">
                    {formatDateTime(r.createdAt)}
                  </p>

                </div>
              ))}

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