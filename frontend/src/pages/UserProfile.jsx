import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { apiCall } from "../api";
import { useAuth } from "../context/AuthContext";
import ProfileHeader from "../components/profile/ProfileHeader";
import ProfileTabs from "../components/profile/ProfileTabs";
import ReviewCard from "../components/profile/ReviewCard";
import FavoriteCard from "../components/profile/FavoriteCard";
import VisitedItem from "../components/profile/VisitedItem";
import SearchItem from "../components/profile/SearchItem";

const EmptyState = ({ icon, title, message }) => (
  <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
    <span className="text-6xl mb-4 opacity-60">{icon}</span>
    <h3 className="text-lg font-semibold text-slate-700">{title}</h3>
    <p className="text-slate-500 mt-1 max-w-sm">{message}</p>
  </div>
);

function UserProfileComponent() {
  const navigate = useNavigate();
  const { user: authUser } = useAuth();
  const [activeTab, setActiveTab] = useState("reviews");

  const [profileUser, setProfileUser] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [visits, setVisits] = useState([]);
  const [searchHistory, setSearchHistory] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [deletingReviewId, setDeletingReviewId] = useState(null);
  const [removingFavoriteId, setRemovingFavoriteId] = useState(null);

  const fetchProfile = async () => {
    try {
      const data = await apiCall("/users/me");
      setProfileUser(data);
      return data;
    } catch (err) {
      setProfileUser(authUser ? { ...authUser, createdAt: authUser.createdAt } : null);
      return null;
    }
  };

  const fetchReviews = async () => {
    try {
      const data = await apiCall("/users/me/reviews");
      setReviews(Array.isArray(data) ? data : data?.reviews ?? []);
    } catch {
      setReviews([]);
    }
  };

  const fetchFavorites = async () => {
    try {
      const data = await apiCall("/users/me/favorites");
      setFavorites(Array.isArray(data) ? data : data?.favorites ?? []);
    } catch {
      setFavorites([]);
    }
  };

  const fetchVisits = async () => {
    try {
      const data = await apiCall("/users/me/visits");
      setVisits(Array.isArray(data) ? data : data?.visits ?? []);
    } catch {
      setVisits([]);
    }
  };

  const fetchSearchHistory = async () => {
    try {
      const data = await apiCall("/users/me/search-history");
      setSearchHistory(Array.isArray(data) ? data : data?.searchHistory ?? data?.searches ?? []);
    } catch {
      setSearchHistory([]);
    }
  };

  useEffect(() => {
    let cancelled = false;

    const load = async () => {
      setLoading(true);
      setError("");
      try {
        const profile = await fetchProfile();
        await Promise.all([
          fetchReviews(),
          fetchFavorites(),
          fetchVisits(),
          fetchSearchHistory(),
        ]);

        if (!cancelled && profile) {
          setProfileUser(profile);
        }
      } catch (err) {
        if (!cancelled) {
          setError(err.message || "Failed to load profile");
          setProfileUser(authUser ? { ...authUser } : null);
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    load();
    return () => { cancelled = true; };
  }, []);

  const handleDeleteReview = async (review) => {
    const id = review?.id ?? review?._id;
    if (!id) return;
    setDeletingReviewId(id);
    try {
      await apiCall(`/reviews/${id}`, { method: "DELETE" });
      setReviews((prev) => prev.filter((r) => (r.id ?? r._id) !== id));
    } catch (err) {
      alert(err.message || "Failed to delete review");
    } finally {
      setDeletingReviewId(null);
    }
  };

  const handleRemoveFavorite = async (favorite) => {
    const shopId = favorite?.shopId ?? favorite?.shop?._id ?? favorite?.shop?.id;
    if (!shopId) return;
    setRemovingFavoriteId(shopId);
    try {
      await apiCall(`/users/me/favorites/${shopId}`, { method: "DELETE" });
      setFavorites((prev) =>
        prev.filter(
          (f) =>
            (f.shopId ?? f.shop?._id ?? f.shop?.id)?.toString() !==
            shopId?.toString()
        )
      );
    } catch (err) {
      alert(err.message || "Failed to remove favorite");
    } finally {
      setRemovingFavoriteId(null);
    }
  };

  const handleSearchAgain = (query) => {
    navigate(`/search?q=${encodeURIComponent(query)}`);
  };

  const user = profileUser ?? authUser;
  const stats = {
    totalReviews: profileUser?.totalReviews ?? reviews.length,
    favoriteShops: profileUser?.totalFavorites ?? favorites.length,
    shopsVisited: profileUser?.totalVisits ?? visits.length,
    totalSearches: profileUser?.totalSearches ?? searchHistory.length,
  };

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
          <h2 className="text-lg font-semibold text-slate-800">Profile</h2>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-6 py-8">
        {error && (
          <div className="mb-6 bg-amber-50 border border-amber-200 text-amber-800 px-4 py-3 rounded-xl">
            {error}
          </div>
        )}

        {/* Profile Header */}
        <section className="mb-8">
          <ProfileHeader user={user} stats={stats} loading={loading} />
        </section>

        {/* Tab Navigation */}
        <section className="mb-6">
          <ProfileTabs activeTab={activeTab} onTabChange={setActiveTab} />
        </section>

        {/* Tab Content */}
        <section className="bg-white rounded-2xl shadow-md border border-slate-100 p-6">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-16">
              <div className="animate-spin w-10 h-10 border-4 border-indigo-200 border-t-indigo-600 rounded-full" />
              <p className="text-slate-600 mt-4">Loading...</p>
            </div>
          ) : (
            <>
              {/* My Reviews */}
              {activeTab === "reviews" && (
                <div className="space-y-4">
                  {reviews.length === 0 ? (
                    <EmptyState
                      icon="⭐"
                      title="No reviews yet"
                      message="Your reviews will appear here once you rate a shop."
                    />
                  ) : (
                    reviews.map((r) => (
                      <ReviewCard
                        key={r.id ?? r._id}
                        review={r}
                        onDelete={handleDeleteReview}
                        isDeleting={deletingReviewId === (r.id ?? r._id)}
                      />
                    ))
                  )}
                </div>
              )}

              {/* Favorites */}
              {activeTab === "favorites" && (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {favorites.length === 0 ? (
                    <div className="col-span-full">
                      <EmptyState
                        icon="❤️"
                        title="No favorites yet"
                        message="Shops you favorite will appear here."
                      />
                    </div>
                  ) : (
                    favorites.map((f) => (
                      <FavoriteCard
                        key={f.id ?? f._id ?? f.shopId ?? f.shop?._id}
                        favorite={f}
                        onRemove={handleRemoveFavorite}
                        isRemoving={
                          removingFavoriteId ===
                          (f.shopId ?? f.shop?._id ?? f.shop?.id)?.toString()
                        }
                      />
                    ))
                  )}
                </div>
              )}

              {/* Visited Shops */}
              {activeTab === "visited" && (
                <div className="space-y-3">
                  {visits.length === 0 ? (
                    <EmptyState
                      icon="🏪"
                      title="No visited shops"
                      message="Shops you visit will appear here."
                    />
                  ) : (
                    visits.map((v, i) => (
                      <VisitedItem
                        key={v.id ?? v._id ?? v.shopId ?? i}
                        visit={v}
                      />
                    ))
                  )}
                </div>
              )}

              {/* Search History */}
              {activeTab === "search-history" && (
                <div className="space-y-3">
                  {searchHistory.length === 0 ? (
                    <EmptyState
                      icon="🔍"
                      title="No search history"
                      message="Your recent searches will appear here."
                    />
                  ) : (
                    searchHistory.map((s, i) => (
                      <SearchItem
                        key={s.id ?? s._id ?? i}
                        item={s}
                        onSearchAgain={handleSearchAgain}
                      />
                    ))
                  )}
                </div>
              )}
            </>
          )}
        </section>
      </div>
    </div>
  );
}

export const UserProfile = React.memo(UserProfileComponent);
