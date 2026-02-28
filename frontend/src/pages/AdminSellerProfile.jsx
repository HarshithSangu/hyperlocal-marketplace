import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { apiCall } from "../api";

const STATUS_STYLES = {
  active: "bg-green-100 text-green-800",
  disabled: "bg-yellow-100 text-yellow-800",
  banned: "bg-red-100 text-red-800",
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

const formatCurrency = (value) => {
  if (typeof value !== "number") return "-";
  return value.toLocaleString(undefined, {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
  });
};

const formatRating = (rating) =>
  typeof rating === "number" ? rating.toFixed(1) : "-";

// Assumes "HH:mm" 24h strings for open/close
const isOpenNow = (openTime, closeTime) => {
  if (!openTime || !closeTime) return null;
  try {
    const now = new Date();
    const [openH, openM] = openTime.split(":").map(Number);
    const [closeH, closeM] = closeTime.split(":").map(Number);

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

export function AdminSellerProfile() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { logout } = useAuth();

  const [seller, setSeller] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [actionLoading, setActionLoading] = useState(false);
  const [actionMessage, setActionMessage] = useState("");

  const loadSeller = async () => {
    try {
      setLoading(true);
      setError("");
      const data = await apiCall(`/admin/seller/${id}`);
      setSeller(data);
    } catch (err) {
      setError(err.message || "Failed to load seller details");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSeller();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const runAction = async (endpoint, options, successText, onSuccessNavigate) => {
    try {
      setActionLoading(true);
      setActionMessage("");
      await apiCall(endpoint, options);
      setActionMessage(successText);
      if (onSuccessNavigate) {
        onSuccessNavigate();
      } else {
        await loadSeller();
      }
    } catch (err) {
      setActionMessage(err.message || "Something went wrong");
    } finally {
      setActionLoading(false);
    }
  };

  const handleDisable = () =>
    runAction(
      `/admin/seller/${id}/disable`,
      { method: "PATCH" },
      "Seller disabled successfully."
    );

  const handleEnable = () =>
    runAction(
      `/admin/seller/${id}/enable`,
      { method: "PATCH" },
      "Seller enabled successfully."
    );

  const handleBan = () =>
    runAction(
      `/admin/seller/${id}/ban`,
      { method: "PATCH" },
      "Seller banned successfully."
    );

  const handleUnban = () =>
    runAction(
      `/admin/seller/${id}/unban`,
      { method: "PATCH" },
      "Seller unbanned successfully."
    );

  const handleDelete = () => {
    const confirmed = window.confirm(
      "Are you sure you want to permanently delete this seller? This cannot be undone."
    );
    if (!confirmed) return;

    runAction(
      `/admin/seller/${id}`,
      { method: "DELETE" },
      "Seller deleted successfully.",
      () => navigate("/admin")
    );
  };

  const handleResetPassword = () =>
    runAction(
      `/admin/seller/${id}/reset-password`,
      { method: "POST" },
      "Password reset successfully. The seller will receive instructions."
    );

  const openStatus = seller
    ? isOpenNow(seller.openTime, seller.closeTime)
    : null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-indigo-50 to-violet-50">
      {/* HEADER */}
      <header className="sticky top-0 z-50 backdrop-blur-md bg-white/70 border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <h1 className="text-2xl font-bold text-slate-800">
              Seller Profile
            </h1>
            <button
              onClick={() => navigate("/admin")}
              className="px-3 py-1.5 text-xs font-medium rounded-lg border border-slate-200 text-slate-700 bg-white hover:bg-slate-50 transition-all"
            >
              ← Back to Admin
            </button>
          </div>
          <button
            onClick={logout}
            className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white text-sm font-medium rounded-lg transition-all duration-200 ease-in-out hover:shadow-md"
          >
            Logout
          </button>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {actionMessage && (
          <div className="mb-6">
            <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 px-4 py-3 rounded-lg text-sm">
              {actionMessage}
            </div>
          </div>
        )}

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
            {error}
          </div>
        )}

        {loading && (
          <div className="text-center py-12">
            <div className="inline-block animate-spin mb-4">
              <div className="w-8 h-8 border-4 border-indigo-200 border-t-indigo-600 rounded-full"></div>
            </div>
            <p className="text-slate-600">Loading seller details...</p>
          </div>
        )}

        {!loading && !seller && !error && (
          <div className="bg-white rounded-2xl shadow-md p-8 text-center border border-slate-100">
            <p className="text-slate-600">Seller not found.</p>
          </div>
        )}

        {!loading && seller && (
          <>
            {/* TOP SECTION */}
            <section className="bg-white rounded-2xl shadow-md p-6 border border-slate-100 mb-8">
              <div className="flex flex-col md:flex-row gap-6">
                {/* Image */}
                <div className="flex-shrink-0">
                  <img
                    src={seller.imageUrl}
                    alt={seller.shopName}
                    loading="lazy"
                    className="w-40 h-40 rounded-2xl object-cover border border-slate-200 shadow-sm"
                  />
                </div>

                {/* Info */}
                <div className="flex-1 space-y-3">
                  <div className="flex flex-wrap items-center gap-3">
                    <h2 className="text-2xl font-bold text-slate-900">
                      {seller.shopName}
                    </h2>
                    <span
                      className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                        STATUS_STYLES[seller.status] ||
                        "bg-slate-100 text-slate-800"
                      }`}
                    >
                      {seller.status === "active"
                        ? "Active"
                        : seller.status === "disabled"
                        ? "Disabled"
                        : "Banned"}
                    </span>
                    {openStatus !== null && (
                      <span
                        className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                          openStatus
                            ? "bg-emerald-100 text-emerald-800"
                            : "bg-slate-100 text-slate-800"
                        }`}
                      >
                        {openStatus ? "Open Now" : "Closed"}
                      </span>
                    )}
                  </div>

                  <div className="flex flex-wrap items-center gap-4 text-sm text-slate-700">
                    <div className="flex items-center gap-1">
                      <span className="text-yellow-500">⭐</span>
                      <span className="font-semibold">
                        {formatRating(seller.rating)}
                      </span>
                    </div>
                    <span className="text-slate-400">•</span>
                    <span>
                      {seller.openTime} - {seller.closeTime}
                    </span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-slate-700 mt-2">
                    <div>
                      <p className="text-xs text-slate-500 uppercase tracking-wider mb-1">
                        Owner
                      </p>
                      <p className="font-medium">{seller.ownerName}</p>
                      <p className="text-slate-600 break-all">{seller.email}</p>
                      <p className="text-slate-600">{seller.phone}</p>
                    </div>
                    <div>
                      <p className="text-xs text-slate-500 uppercase tracking-wider mb-1">
                        Shop Details
                      </p>
                      <p className="text-slate-700">{seller.address}</p>
                      <p className="text-slate-500 text-xs mt-1">
                        Approved: {formatDate(seller.approvedAt)}
                      </p>
                      <p className="text-slate-500 text-xs">
                        Last Active: {formatDateTime(seller.lastActive)}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* ADMIN ACTION BUTTONS */}
              <div className="mt-6 flex flex-wrap gap-3">
                <button
                  type="button"
                  onClick={handleDisable}
                  disabled={actionLoading}
                  className="px-4 py-2 rounded-lg text-sm font-medium bg-yellow-50 text-yellow-800 border border-yellow-200 hover:bg-yellow-100 disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  Disable Seller
                </button>
                <button
                  type="button"
                  onClick={handleEnable}
                  disabled={actionLoading}
                  className="px-4 py-2 rounded-lg text-sm font-medium bg-emerald-50 text-emerald-800 border border-emerald-200 hover:bg-emerald-100 disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  Enable Seller
                </button>
                <button
                  type="button"
                  onClick={handleBan}
                  disabled={actionLoading}
                  className="px-4 py-2 rounded-lg text-sm font-medium bg-red-50 text-red-800 border border-red-200 hover:bg-red-100 disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  Ban Seller
                </button>
                <button
                  type="button"
                  onClick={handleUnban}
                  disabled={actionLoading}
                  className="px-4 py-2 rounded-lg text-sm font-medium bg-white text-slate-800 border border-slate-200 hover:bg-slate-50 disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  Unban Seller
                </button>
                <button
                  type="button"
                  onClick={handleResetPassword}
                  disabled={actionLoading}
                  className="px-4 py-2 rounded-lg text-sm font-medium bg-indigo-50 text-indigo-800 border border-indigo-200 hover:bg-indigo-100 disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  Reset Password
                </button>
                <button
                  type="button"
                  onClick={handleDelete}
                  disabled={actionLoading}
                  className="px-4 py-2 rounded-lg text-sm font-medium bg-red-600 text-white border border-red-700 hover:bg-red-700 disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  Delete Seller
                </button>
              </div>
            </section>

            {/* MIDDLE SECTION: SUMMARY CARDS */}
            <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
              <div className="bg-white rounded-2xl shadow-md p-5 border border-slate-100">
                <p className="text-xs text-slate-500 uppercase tracking-wider">
                  Total Products
                </p>
                <p className="mt-2 text-2xl font-bold text-slate-900">
                  {seller.totalProducts ?? 0}
                </p>
              </div>
              <div className="bg-white rounded-2xl shadow-md p-5 border border-slate-100">
                <p className="text-xs text-slate-500 uppercase tracking-wider">
                  Total Updates
                </p>
                <p className="mt-2 text-2xl font-bold text-slate-900">
                  {seller.totalUpdates ?? 0}
                </p>
              </div>
              <div className="bg-white rounded-2xl shadow-md p-5 border border-slate-100">
                <p className="text-xs text-slate-500 uppercase tracking-wider">
                  Total Orders
                </p>
                <p className="mt-2 text-2xl font-bold text-slate-900">
                  {seller.totalOrders ?? 0}
                </p>
              </div>
              <div className="bg-white rounded-2xl shadow-md p-5 border border-slate-100">
                <p className="text-xs text-slate-500 uppercase tracking-wider">
                  Last Active
                </p>
                <p className="mt-2 text-sm font-medium text-slate-900">
                  {formatDateTime(seller.lastActive)}
                </p>
              </div>
            </section>

            {/* BOTTOM SECTION: PRODUCTS TABLE */}
            <section className="bg-white rounded-2xl shadow-md p-6 border border-slate-100">
              <div className="flex items-center justify-between mb  -4">
                <h3 className="text-lg font-semibold text-slate-900">
                  Products
                </h3>
                <p className="text-xs text-slate-500">
                  Latest products and update activity
                </p>
              </div>

              {(!seller.products || seller.products.length === 0) && (
                <p className="text-slate-600 text-sm mt-4">
                  This seller has no products yet.
                </p>
              )}

              {seller.products && seller.products.length > 0 && (
                <div className="mt-4 max-h-80 overflow-y-auto rounded-xl border border-slate-100">
                  <table className="min-w-full divide-y divide-slate-100 text-sm">
                    <thead className="bg-slate-50">
                      <tr>
                        <th className="px-4 py-2 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">
                          Product Name
                        </th>
                        <th className="px-4 py-2 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">
                          Price
                        </th>
                        <th className="px-4 py-2 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">
                          Last Updated
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 bg-white">
                      {seller.products.map((product) => (
                        <tr key={product.id}>
                          <td className="px-4 py-2 text-slate-900">
                            {product.productName}
                          </td>
                          <td className="px-4 py-2 text-slate-700">
                            {formatCurrency(product.price)}
                          </td>
                          <td className="px-4 py-2 text-slate-500">
                            {formatDateTime(product.updatedAt)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </section>
          </>
        )}
      </div>
    </div>
  );
}

