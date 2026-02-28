import MapView from "../components/MapView";
import ShopCardLink from "../components/ShopCardLink";
import React, { useState, useEffect, useMemo, useRef } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { apiCall } from "../api";

let cachedLocation = null;
let cachedNearbyShops = null;
let cachedUpdates = null;

function SearchComponent() {
  const [searchText, setSearchText] = useState("");
  const [selectedShop, setSelectedShop] = useState(null);
  const [shops, setShops] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [location, setLocation] = useState(cachedLocation);
  const { user, logout } = useAuth();

  const [nearbyShops, setNearbyShops] = useState(cachedNearbyShops || []);
  const [updates, setUpdates] = useState(cachedUpdates || []);
  const initialFetchDoneRef = useRef(false);

  const [selectedShopItems, setSelectedShopItems] = useState([]);
  const [showItemsModal, setShowItemsModal] = useState(false);
  const [currentShopName, setCurrentShopName] = useState("");

  /* ================= LOCATION ================= */
  useEffect(() => {
    if (cachedLocation) {
      setLocation(cachedLocation);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const loc = {
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
        };
        cachedLocation = loc;
        setLocation(loc);
      },
      () => setError("Please allow location access"),
    );
  }, []);

  useEffect(() => {
    if (!location) return;

    if (
      cachedLocation &&
      cachedLocation.lat === location.lat &&
      cachedLocation.lng === location.lng &&
      cachedNearbyShops &&
      cachedUpdates
    ) {
      setNearbyShops(cachedNearbyShops);
      setUpdates(cachedUpdates);
      return;
    }

    if (initialFetchDoneRef.current) return;
    initialFetchDoneRef.current = true;

    fetchNearbyShops();
    fetchUpdates();
  }, [location]);

  /* ================= DIRECTIONS ================= */
  const openDirections = async (shopLat, shopLng) => {
    try {
      const pos = await new Promise((resolve, reject) =>
        navigator.geolocation.getCurrentPosition(resolve, reject),
      );

      const url = `https://www.google.com/maps/dir/?api=1&origin=${pos.coords.latitude},${pos.coords.longitude}&destination=${shopLat},${shopLng}`;
      window.open(url, "_blank");
    } catch {
      alert("Location permission required for directions");
    }
  };

  /* ================= FETCH ================= */
  const fetchNearbyShops = async () => {
    const data = await apiCall(
      `/search/nearby?lat=${location.lat}&lng=${location.lng}`,
    );
    setNearbyShops(data);
     cachedNearbyShops = data;
     cachedLocation = location || cachedLocation;
  };

  const fetchUpdates = async () => {
    const data = await apiCall(
      `/search/updates/nearby?lat=${location.lat}&lng=${location.lng}`,
    );
    setUpdates(data);
    cachedUpdates = data;
    cachedLocation = location || cachedLocation;
  };

  const fetchShopItems = async (shop) => {
    const data = await apiCall(`/products?shopId=${shop.id}`);
    setSelectedShopItems(data);
    setCurrentShopName(shop.shopName);
    setShowItemsModal(true);
  };

  /* ================= SEARCH ================= */
  const handleSearch = async (e) => {
    e.preventDefault();
    if (!searchText.trim() || !location) return;

    setLoading(true);
    try {
      const data = await apiCall("/search", {
        method: "POST",
        body: JSON.stringify({
          text: searchText,
          latitude: location.lat,
          longitude: location.lng,
        }),
      });
      setShops(data);
    } finally {
      setLoading(false);
    }
  };

  /* ================= BACK BUTTON ================= */
  const handleBackToDiscovery = () => {
    setShops([]);
    setSearchText("");
    setSelectedShop(null);
  };

  const getTimeAgo = (date) => {
    const seconds = Math.floor((new Date() - new Date(date)) / 1000);
    if (seconds < 60) return "just now";
    if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
    if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
    return `${Math.floor(seconds / 86400)}d ago`;
  };

  const memoizedShops = useMemo(() => shops, [shops]);
  const showSearchResults = shops.length > 0;

  /* ================= SEARCH RESULTS ================= */
  const SearchResultsContent = () => (
    <>
      {/* Back Button */}
      <div className="mb-6">
        <button
          onClick={handleBackToDiscovery}
          className="px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded-lg text-sm font-medium"
        >
          ← Back to Discovery
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-10">
        <div className="lg:col-span-2 space-y-4 max-h-[500px] overflow-y-auto pr-2">
          {shops.map((shop, i) => (
            <div
              key={i}
              className="bg-white p-5 rounded-xl shadow flex items-center gap-4"
            >
              <div className="flex-1 min-w-0">
                <h4 className="font-semibold">{shop.shopName}</h4>
                <p className="text-sm text-gray-500">{shop.address}</p>
                <p>
                  {shop.productName} — ₹{shop.price}
                </p>
                <p className="text-sm text-gray-600">
                  {(shop.distanceMeters / 1000).toFixed(2)} km away
                </p>
              </div>

              <div className="flex gap-2 shrink-0">
                <button
                  onClick={() => openDirections(shop.latitude, shop.longitude)}
                  className="bg-indigo-600 text-white px-4 py-2 rounded-lg"
                >
                  Directions
                </button>
                <button
                  onClick={() =>
                    setSelectedShop({
                      lat: shop.latitude,
                      lng: shop.longitude,
                    })
                  }
                  className="bg-gray-800 text-white px-4 py-2 rounded-lg"
                >
                  Show
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className="sticky top-24">
          <MapView
            shops={memoizedShops}
            userLocation={location}
            selectedShop={selectedShop}
          />
        </div>
      </div>
    </>
  );

  /* ================= RENDER ================= */
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-indigo-50 to-violet-50">
      {/* HEADER */}
      <header className="sticky top-0 z-50 backdrop-blur-md bg-white/70 border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <h1 className="text-2xl font-bold text-slate-800">
            Hyperlocal Discovery
          </h1>
          <div className="flex items-center gap-4">
            <span className="text-sm text-slate-600">
              Welcome, <span className="font-semibold">{user?.email}</span>
            </span>
            <Link
              to="/profile"
              className="px-4 py-2 text-indigo-600 hover:text-indigo-700 font-medium"
            >
              Profile
            </Link>
            <button
              onClick={logout}
              className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg"
            >
              Logout
            </button>
          </div>
        </div>
      </header>

      {/* SEARCH BAR */}
      <div className="bg-gradient-to-r from-indigo-600 to-violet-600 py-12">
        <div className="max-w-3xl mx-auto px-6 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            Find Products Near You
          </h2>

          <form
            onSubmit={handleSearch}
            className="bg-white rounded-2xl shadow-xl p-2 flex gap-2"
          >
            <input
              type="text"
              placeholder="Search milk, rice, charger..."
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              className="flex-1 px-4 py-3 rounded-xl outline-none"
            />
            <button className="px-6 py-3 rounded-xl bg-indigo-600 text-white">
              {loading ? "Searching..." : "Search"}
            </button>
          </form>
        </div>
      </div>

      {/* MAIN CONTENT */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div
          className={`transition-opacity duration-200 ${showSearchResults ? "block" : "hidden"}`}
        >
          <SearchResultsContent />
        </div>
        <div
          className={`transition-opacity duration-200 ${!showSearchResults ? "block" : "hidden"}`}
        >
          {/* Nearby */}
          <h3 className="text-2xl font-bold mb-6">Nearby Shops</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {nearbyShops.map((shop, i) => (
                <ShopCardLink
                  key={i}
                  shop={shop}
                  openDirections={openDirections}
                  onItemsClick={fetchShopItems}
                />
              ))}
            </div>

            {/* Updates */}
            <h3 className="text-xl font-bold mt-10 mb-4">Recent Updates</h3>
            <div className="max-h-[150px] overflow-y-auto pr-2 border rounded-xl p-2 bg-slate-50">
              <div className="space-y-3">
                {updates.map((u, i) => (
                  <div
                    key={i}
                    className="bg-white p-4 rounded-lg shadow border-l-4 border-indigo-500"
                  >
                    <p className="font-medium">
                      {u.shopName} updated {u.productName} → ₹{u.newPrice}
                    </p>
                    <p className="text-xs text-gray-500">
                      {getTimeAgo(u.updatedAt)} • {u.distanceKm} km away
                    </p>
                  </div>
                ))}
              </div>
            </div>
        </div>
      </div>
    </div>
  );
}

export const Search = React.memo(SearchComponent);
