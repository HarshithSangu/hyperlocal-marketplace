import MapPicker from "../components/MapPicker";

import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { apiCall } from "../api";

export function SellerDashboard() {
  const [shop, setShop] = useState(null);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [tab, setTab] = useState("shop");
  const { logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    loadShop();
  }, []);

  const loadShop = async () => {
    try {
      const data = await apiCall("/sellers/mine");
      setShop(data);
      if (data && data._id) loadProducts(data._id);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const loadProducts = async (shopId) => {
    try {
      const data = await apiCall(`/products/shop/${shopId}`);
      setProducts(data);
    } catch (err) {
      console.error(err);
    }
  };

  if (loading)
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-indigo-50 to-violet-50 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin mb-4">
            <div className="w-8 h-8 border-4 border-indigo-200 border-t-indigo-600 rounded-full"></div>
          </div>
          <p className="text-slate-600">Loading...</p>
        </div>
      </div>
    );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-indigo-50 to-violet-50">
      {/* HEADER */}
      <header className="sticky top-0 z-50 backdrop-blur-md bg-white/70 border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <h1 className="text-2xl font-bold text-slate-800">
            Seller Dashboard
          </h1>
          <button
            onClick={logout}
            className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white text-sm font-medium rounded-lg transition-all duration-200 ease-in-out hover:shadow-md"
          >
            Logout
          </button>
        </div>
      </header>

      {error && (
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
            {error}
          </div>
        </div>
      )}

      {/* TABS */}
      <div className="max-w-7xl mx-auto px-6 py-6">
        <div className="flex gap-2 mb-8">
          <button
            onClick={() => setTab("shop")}
            className={`px-6 py-2 rounded-full font-medium transition-all duration-200 ease-in-out ${
              tab === "shop"
                ? "bg-indigo-600 text-white shadow-mg"
                : "bg-white text-slate-700 border border-slate-200 hover:bg-slate-50"
            }`}
          >
            My Shop
          </button>
          <button
            onClick={() => setTab("products")}
            className={`px-6 py-2 rounded-full font-medium transition-all duration-200 ease-in-out ${
              tab === "products"
                ? "bg-indigo-600 text-white shadow-md"
                : "bg-white text-slate-700 border border-slate-200 hover:bg-slate-50"
            }`}
          >
            Products
          </button>
          <button
            onClick={() => navigate("/seller/messages")}
            className={`px-6 py-2 rounded-full font-medium transition-all duration-200 ease-in-out bg-white text-slate-700 border border-slate-200 hover:bg-slate-50`}
          >
            Messages
          </button>
        </div>

        {tab === "shop" && <ShopTab shop={shop} onShopCreated={loadShop} />}
        {tab === "products" && (
          <ProductsTab
            shop={shop}
            products={products}
            onRefresh={loadProducts}
          />
        )}
      </div>
    </div>
  );
}

function ShopTab({ shop, onShopCreated }) {
  const [shopName, setShopName] = useState("");
  const [address, setAddress] = useState("");
  const [latitude, setLatitude] = useState(null);
  const [longitude, setLongitude] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleApply = async (e) => {
    e.preventDefault();
    setError("");

    // 🚨 Important validation
    if (!latitude || !longitude) {
      setError("Please select shop location on map");
      return;
    }

    setLoading(true);
    try {
      await apiCall("/sellers/apply", {
        method: "POST",
        body: JSON.stringify({
          shopName,
          address,
          latitude,
          longitude,
        }),
      });

      setShopName("");
      setAddress("");
      setLatitude(null);
      setLongitude(null);
      onShopCreated();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Already applied shop
  if (shop && shop._id) {
    return (
      <div className="bg-white rounded-2xl shadow-md p-8 border border-slate-100">
        <h2 className="text-2xl font-bold text-slate-900 mb-6">
          {shop.shopName}
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <p className="text-xs text-slate-500 uppercase tracking-wider mb-2">
              Address
            </p>
            <p className="text-slate-900 font-medium">{shop.address}</p>
          </div>

          <div>
            <p className="text-xs text-slate-500 uppercase tracking-wider mb-2">
              Status
            </p>
            <span
              className={`inline-block px-4 py-2 text-sm font-semibold rounded-full ${
                shop.status === "approved"
                  ? "bg-green-100 text-green-700"
                  : shop.status === "pending"
                    ? "bg-yellow-100 text-yellow-700"
                    : "bg-red-100 text-red-700"
              }`}
            >
              {shop.status.charAt(0).toUpperCase() + shop.status.slice(1)}
            </span>
          </div>

          <div>
            <p className="text-xs text-slate-500 uppercase tracking-wider mb-2">
              Trust Score
            </p>
            <p className="text-slate-900 font-semibold text-lg">
              {shop.trustScore}
            </p>
          </div>

          <div>
            <p className="text-xs text-slate-500 uppercase tracking-wider mb-2">
              Status Message
            </p>
            <p className="text-slate-700 text-sm">
              {shop.status === "pending" && "⏳ Waiting for admin approval..."}
              {shop.status === "approved" &&
                "✓ Your shop is approved! You can add products."}
              {shop.status === "rejected" && "✗ Your application was rejected."}
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Apply form
  return (
    <form
      onSubmit={handleApply}
      className="max-w-2xl bg-white rounded-2xl shadow-md p-8 border border-slate-100"
    >
      <h2 className="text-2xl font-bold text-slate-900 mb-6">Apply for Shop</h2>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6 text-sm">
          {error}
        </div>
      )}

      <div className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">
            Shop Name
          </label>
          <input
            type="text"
            value={shopName}
            onChange={(e) => setShopName(e.target.value)}
            required
            disabled={loading}
            className="w-full px-4 py-2 border border-slate-300 rounded-lg bg-white text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all disabled:opacity-50"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">
            Address
          </label>
          <input
            type="text"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            placeholder="Area / landmark"
            required
            disabled={loading}
            className="w-full px-4 py-2 border border-slate-300 rounded-lg bg-white text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all disabled:opacity-50"
          />
        </div>

        {/* 🗺 MAP PICKER */}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">
            Select Shop Location on Map
          </label>
          <div className="bg-slate-50 rounded-2xl overflow-hidden border-2 border-dashed border-slate-300">
            <MapPicker
              onSelect={(lat, lng) => {
                setLatitude(lat);
                setLongitude(lng);
              }}
            />
          </div>
          {latitude && (
            <p className="text-green-600 text-sm font-medium mt-2">
              ✓ Location selected
            </p>
          )}
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-lg transition-all duration-200 ease-in-out disabled:opacity-50 hover:shadow-lg"
        >
          {loading ? "Applying..." : "Apply for Shop"}
        </button>
      </div>
    </form>
  );
}

function ProductsTab({ shop, products, onRefresh }) {
  const [name, setName] = useState("");
  const [category, setCategory] = useState("");
  const [brand, setBrand] = useState("");
  const [price, setPrice] = useState("");
  const [availability, setAvailability] = useState("likely");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  if (!shop || shop.status !== "approved") {
    return (
      <div className="bg-white rounded-2xl shadow-md p-8 border border-slate-100">
        <p className="text-slate-600 text-center">
          Approve your shop first to add products.
        </p>
      </div>
    );
  }

  const handleAddProduct = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await apiCall("/products/shop", {
        method: "POST",
        body: JSON.stringify({
          shopId: shop._id,
          name,
          category,
          brand,
          price: parseFloat(price),
          availabilityStatus: availability,
        }),
      });
      setName("");
      setCategory("");
      setBrand("");
      setPrice("");
      setAvailability("likely");
      onRefresh(shop._id);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      {/* LEFT - FORM */}
      <div className="lg:col-span-1 bg-white rounded-2xl shadow-md p-8 border border-slate-100 h-fit">
        <h3 className="text-xl font-bold text-slate-900 mb-6">Add Product</h3>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6 text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleAddProduct} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Product Name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              disabled={loading}
              className="w-full px-4 py-2 border border-slate-300 rounded-lg bg-white text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all disabled:opacity-50"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Category
            </label>
            <input
              type="text"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              disabled={loading}
              className="w-full px-4 py-2 border border-slate-300 rounded-lg bg-white text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all disabled:opacity-50"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Brand
            </label>
            <input
              type="text"
              value={brand}
              onChange={(e) => setBrand(e.target.value)}
              disabled={loading}
              className="w-full px-4 py-2 border border-slate-300 rounded-lg bg-white text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all disabled:opacity-50"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Price (₹)
            </label>
            <input
              type="number"
              step="0.01"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              required
              disabled={loading}
              className="w-full px-4 py-2 border border-slate-300 rounded-lg bg-white text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all disabled:opacity-50"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Availability
            </label>
            <select
              value={availability}
              onChange={(e) => setAvailability(e.target.value)}
              disabled={loading}
              className="w-full px-4 py-2 border border-slate-300 rounded-lg bg-white text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all disabled:opacity-50"
            >
              <option value="likely">Likely</option>
              <option value="low">Low</option>
              <option value="unknown">Unknown</option>
            </select>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-lg transition-all duration-200 ease-in-out disabled:opacity-50 hover:shadow-lg"
          >
            {loading ? "Adding..." : "Add Product"}
          </button>
        </form>
      </div>

      {/* RIGHT - PRODUCT LIST */}
      <div className="lg:col-span-2">
        <div className="bg-white rounded-2xl shadow-md p-8 border border-slate-100">
          <h3 className="text-xl font-bold text-slate-900 mb-6">
            Your Products{" "}
            <span className="text-slate-500 font-normal text-lg">
              ({products.length})
            </span>
          </h3>

          {products.length === 0 && (
            <p className="text-slate-500 text-center py-8">
              No products added yet.
            </p>
          )}

          <div className="grid grid-cols-1 gap-4">
            {products.map((prod, idx) => (
              <ProductListItem
                key={idx}
                product={prod}
                onDeleteSuccess={() => onRefresh(shop._id)}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function ProductListItem({ product, onDeleteSuccess }) {
  const [isEditing, setIsEditing] = useState(false);
  const [editPrice, setEditPrice] = useState(product.price);
  const [editAvailability, setEditAvailability] = useState(
    product.availabilityStatus,
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleUpdate = async () => {
    setError("");
    setLoading(true);
    try {
      await apiCall(`/products/${product._id}`, {
        method: "PUT",
        body: JSON.stringify({
          price: parseFloat(editPrice),
          availabilityStatus: editAvailability,
        }),
      });
      setIsEditing(false);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm("Are you sure you want to delete this product?"))
      return;
    setLoading(true);
    try {
      await apiCall(`/products/${product._id}`, {
        method: "DELETE",
      });
      onDeleteSuccess();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (isEditing) {
    return (
      <div className="border border-indigo-200 rounded-xl p-4 bg-indigo-50">
        {error && (
          <div className="bg-red-50 text-red-700 text-sm p-2 rounded mb-3">
            {error}
          </div>
        )}
        <div className="space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-medium text-slate-700">
                Price
              </label>
              <input
                type="number"
                step="0.01"
                value={editPrice}
                onChange={(e) => setEditPrice(e.target.value)}
                disabled={loading}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm"
              />
            </div>
            <div>
              <label className="text-xs font-medium text-slate-700">
                Availability
              </label>
              <select
                value={editAvailability}
                onChange={(e) => setEditAvailability(e.target.value)}
                disabled={loading}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm"
              >
                <option value="likely">Likely</option>
                <option value="low">Low</option>
                <option value="unknown">Unknown</option>
              </select>
            </div>
          </div>
          <div className="flex gap-2">
            <button
              onClick={handleUpdate}
              disabled={loading}
              className="flex-1 px-3 py-2 bg-green-600 hover:bg-green-700 text-white text-sm font-medium rounded-lg transition-all disabled:opacity-50"
            >
              Save
            </button>
            <button
              onClick={() => setIsEditing(false)}
              disabled={loading}
              className="flex-1 px-3 py-2 bg-gray-400 hover:bg-gray-500 text-white text-sm font-medium rounded-lg transition-all disabled:opacity-50"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="border border-slate-200 rounded-xl p-4 hover:bg-slate-50 transition-all duration-200">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <h4 className="text-base font-semibold text-slate-900">
            {product.product?.name}
          </h4>
          <div className="grid grid-cols-3 gap-4 mt-3">
            <div>
              <p className="text-xs text-slate-500 mb-1">Price</p>
              <p className="text-sm font-semibold text-slate-900">
                ₹{product.price}
              </p>
            </div>
            <div>
              <p className="text-xs text-slate-500 mb-1">Availability</p>
              <span
                className={`inline-block px-3 py-1 text-xs font-semibold rounded-full ${
                  product.availabilityStatus === "likely"
                    ? "bg-green-100 text-green-700"
                    : product.availabilityStatus === "low"
                      ? "bg-yellow-100 text-yellow-700"
                      : "bg-gray-100 text-gray-700"
                }`}
              >
                {product.availabilityStatus}
              </span>
            </div>
            <div>
              <p className="text-xs text-slate-500 mb-1">Brand</p>
              <p className="text-sm text-slate-700">{product.brand || "N/A"}</p>
            </div>
          </div>
        </div>
        <div className="flex gap-2 ml-4">
          <button
            onClick={() => setIsEditing(true)}
            className="px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-medium rounded-lg transition-all"
          >
            Edit
          </button>
          <button
            onClick={handleDelete}
            disabled={loading}
            className="px-3 py-2 bg-red-600 hover:bg-red-700 text-white text-xs font-medium rounded-lg transition-all disabled:opacity-50"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}
