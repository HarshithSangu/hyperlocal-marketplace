import React, { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useAdminApprovedSellers } from "../context/AdminApprovedSellersContext";
import { apiCall } from "../api";
import ApprovedSellerCard from "../components/ApprovedSellerCard";

export function Admin() {
  const [shops, setShops] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const { approvedSellers, approvedLoading, approvedError } = useAdminApprovedSellers();
  const navigate = useNavigate();
  const { logout } = useAuth();

  useEffect(() => {
    loadShops();
  }, []);

  const loadShops = async () => {
    try {
      const data = await apiCall("/sellers");
      setShops(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (shopId) => {
    try {
      await apiCall(`/sellers/${shopId}/status`, {
        method: "PATCH",
        body: JSON.stringify({ status: "approved" }),
      });
      loadShops();
    } catch (err) {
      setError(err.message);
    }
  };

  const handleReject = async (shopId) => {
    try {
      await apiCall(`/sellers/${shopId}/status`, {
        method: "PATCH",
        body: JSON.stringify({ status: "rejected" }),
      });
      loadShops();
    } catch (err) {
      setError(err.message);
    }
  };

  const memoizedSellers = useMemo(() => approvedSellers, [approvedSellers]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-indigo-50 to-violet-50">
      {/* HEADER */}
      <header className="sticky top-0 z-50 backdrop-blur-md bg-white/70 border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <h1 className="text-2xl font-bold text-slate-800">Admin Panel</h1>
          <button
            onClick={logout}
            className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white text-sm font-medium rounded-lg transition-all duration-200 ease-in-out hover:shadow-md"
          >
            Logout
          </button>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
            {error}
          </div>
        )}

        <div className="mb-8">
          <h2 className="text-2xl font-bold text-slate-800 mb-2">
            Pending Shop Applications
          </h2>
          <p className="text-slate-600 text-sm">
            {shops.filter((s) => s.status === "pending").length} pending review
          </p>
        </div>

        {loading && (
          <div className="text-center py-12">
            <div className="inline-block animate-spin mb-4">
              <div className="w-8 h-8 border-4 border-indigo-200 border-t-indigo-600 rounded-full"></div>
            </div>
            <p className="text-slate-600">Loading...</p>
          </div>
        )}

        {!loading && shops.length === 0 && (
          <div className="bg-white rounded-2xl shadow-md p-8 text-center border border-slate-100">
            <p className="text-slate-600">No shops in the system</p>
          </div>
        )}

        {!loading && (
          <div className="grid grid-cols-1 gap-4">
            {shops
              .filter((s) => s.status === "pending")
              .map((shop) => (
                <div
                  key={shop._id}
                  className="bg-white rounded-2xl shadow-md hover:shadow-xl transition-all duration-200 ease-in-out p-6 border border-slate-100 hover:border-indigo-200"
                >
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
                    <div>
                      <p className="text-xs text-slate-500 uppercase tracking-wider mb-2">
                        Shop Name
                      </p>
                      <h3 className="text-lg font-semibold text-slate-900">
                        {shop.shopName}
                      </h3>
                    </div>

                    <div>
                      <p className="text-xs text-slate-500 uppercase tracking-wider mb-2">
                        Address
                      </p>
                      <p className="text-slate-700 text-sm">{shop.address}</p>
                    </div>

                    <div>
                      <p className="text-xs text-slate-500 uppercase tracking-wider mb-2">
                        Owner Email
                      </p>
                      <p className="text-slate-700 text-sm">
                        {shop.owner?.email}
                      </p>
                    </div>

                    <div>
                      <p className="text-xs text-slate-500 uppercase tracking-wider mb-2">
                        Applied On
                      </p>
                      <p className="text-slate-700 text-sm">
                        {new Date(shop.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <button
                      onClick={() => handleApprove(shop._id)}
                      className="flex-1 px-4 py-2 bg-green-600 hover:bg-green-700 text-white font-medium rounded-lg transition-all duration-200 ease-in-out hover:shadow-md"
                    >
                      ✓ Approve
                    </button>
                    <button
                      onClick={() => handleReject(shop._id)}
                      className="flex-1 px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-medium rounded-lg transition-all duration-200 ease-in-out hover:shadow-md"
                    >
                      ✗ Reject
                    </button>
                  </div>
                </div>
              ))}
          </div>
        )}

        {!loading &&
          shops.filter((s) => s.status === "pending").length === 0 &&
          shops.length > 0 && (
            <div className="bg-white rounded-2xl shadow-md p-8 text-center border border-slate-100">
              <p className="text-slate-600">
                All pending applications have been reviewed!
              </p>
            </div>
          )}

        {/* Approved Sellers Section */}
        <div className="mt-12">
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-slate-800 mb-2">
              Approved Sellers
            </h2>
            <p className="text-slate-600 text-sm">
              {approvedSellers.length} approved seller
              {approvedSellers.length === 1 ? "" : "s"} in the system
            </p>
          </div>

          {approvedError && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
              {approvedError}
            </div>
          )}

          {approvedLoading && (
            <div className="text-center py-12">
              <div className="inline-block animate-spin mb-4">
                <div className="w-8 h-8 border-4 border-indigo-200 border-t-indigo-600 rounded-full"></div>
              </div>
              <p className="text-slate-600">Loading approved sellers...</p>
            </div>
          )}

          {!approvedLoading && approvedSellers.length === 0 && !approvedError && (
            <div className="bg-white rounded-2xl shadow-md p-8 text-center border border-slate-100">
              <p className="text-slate-600">No approved sellers found yet.</p>
            </div>
          )}

          {!approvedLoading && approvedSellers.length > 0 && !approvedError && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {memoizedSellers.map((seller) => (
                <ApprovedSellerCard
                  key={seller.id}
                  seller={seller}
                  onNavigate={navigate}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
