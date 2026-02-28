const mongoose = require("mongoose");
const User = require("../models/User");
const Review = require("../models/Review");
const Favorite = require("../models/Favorite");
const ShopVisit = require("../models/ShopVisit");
const SearchLog = require("../models/SearchLog");
const Shop = require("../models/Shop");

/**
 * GET /api/users/me
 * Current user profile with activity counts
 */
exports.getMe = async (req, res, next) => {
  try {
    if (!req.user?.id) {
      return res.status(401).json({ message: "Authentication required" });
    }
    const userId = req.user.id;

    const user = await User.findById(userId).select("name email createdAt");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const [totalReviews, totalFavorites, totalVisits, totalSearches] =
      await Promise.all([
        Review.countDocuments({ user: userId }),
        Favorite.countDocuments({ user: userId }),
        ShopVisit.countDocuments({ user: userId }),
        SearchLog.countDocuments({ user: userId }),
      ]);

    res.json({
      name: user.name,
      email: user.email,
      joinedAt: user.createdAt,
      createdAt: user.createdAt,
      totalReviews,
      totalFavorites,
      totalVisits,
      totalSearches,
    });
  } catch (err) {
    next(err);
  }
};

/**
 * GET /api/users/me/reviews
 */
exports.getMyReviews = async (req, res, next) => {
  try {
    if (!req.user?.id) {
      return res.status(401).json({ message: "Authentication required" });
    }
    const userId = req.user.id;

    const reviews = await Review.find({ user: userId })
      .populate("shop", "shopName imageUrl rating")
      .sort({ createdAt: -1 })
      .lean();

    const result = reviews.map((r) => ({
      id: r._id,
      _id: r._id,
      shopId: r.shop?._id,
      shopName: r.shop?.shopName,
      shopImageUrl: r.shop?.imageUrl,
      rating: r.rating,
      reviewText: r.comment,
      comment: r.comment,
      createdAt: r.createdAt,
    }));

    res.json(result);
  } catch (err) {
    next(err);
  }
};

/**
 * GET /api/users/me/favorites
 */
exports.getMyFavorites = async (req, res, next) => {
  try {
    if (!req.user?.id) {
      return res.status(401).json({ message: "Authentication required" });
    }
    const userId = req.user.id;

    const favorites = await Favorite.find({ user: userId })
      .populate("shop", "shopName imageUrl rating")
      .sort({ createdAt: -1 })
      .lean();

    const result = favorites.map((f) => ({
      id: f._id,
      _id: f._id,
      shopId: f.shop?._id,
      shopName: f.shop?.shopName,
      shopImageUrl: f.shop?.imageUrl,
      imageUrl: f.shop?.imageUrl,
      rating: f.shop?.rating,
      shop: f.shop,
    }));

    res.json(result);
  } catch (err) {
    next(err);
  }
};

/**
 * GET /api/users/me/visits
 */
exports.getMyVisits = async (req, res, next) => {
  try {
    if (!req.user?.id) {
      return res.status(401).json({ message: "Authentication required" });
    }
    const userId = req.user.id;

    const visits = await ShopVisit.find({ user: userId })
      .populate("shop", "shopName")
      .sort({ visitedAt: -1 })
      .lean();

    const result = visits.map((v) => ({
      id: v._id,
      _id: v._id,
      shopId: v.shop?._id,
      shopName: v.shop?.shopName,
      visitedAt: v.visitedAt,
      createdAt: v.visitedAt,
    }));

    res.json(result);
  } catch (err) {
    next(err);
  }
};

/**
 * GET /api/users/me/search-history
 */
exports.getMySearchHistory = async (req, res, next) => {
  try {
    if (!req.user?.id) {
      return res.status(401).json({ message: "Authentication required" });
    }
    const userId = req.user.id;

    const logs = await SearchLog.find({ user: userId })
      .sort({ createdAt: -1 })
      .limit(50)
      .lean();

    const result = logs.map((s) => ({
      id: s._id,
      _id: s._id,
      query: s.text,
      searchQuery: s.text,
      text: s.text,
      createdAt: s.createdAt,
    }));

    res.json(result);
  } catch (err) {
    next(err);
  }
};

/**
 * POST /api/users/me/favorites
 * Add shop to favorites
 */
exports.addFavorite = async (req, res, next) => {
  try {
    if (!req.user?.id) {
      return res.status(401).json({ message: "Authentication required" });
    }
    const userId = req.user.id;
    const { shopId } = req.body;

    if (!shopId) {
      return res.status(400).json({ message: "Shop ID is required" });
    }

    const shop = await Shop.findById(shopId);
    if (!shop) {
      return res.status(404).json({ message: "Shop not found" });
    }

    const existing = await Favorite.findOne({ user: userId, shop: shopId });
    if (existing) {
      return res.status(200).json({ message: "Already in favorites" });
    }

    await Favorite.create({ user: userId, shop: shopId });
    res.status(201).json({ message: "Added to favorites" });
  } catch (err) {
    next(err);
  }
};

/**
 * DELETE /api/users/me/favorites/:shopId
 */
exports.removeFavorite = async (req, res, next) => {
  try {
    if (!req.user?.id) {
      return res.status(401).json({ message: "Authentication required" });
    }
    const userId = req.user.id;
    const { shopId } = req.params;

    const deleted = await Favorite.findOneAndDelete({
      user: userId,
      shop: shopId,
    });

    if (!deleted) {
      return res.status(404).json({ message: "Favorite not found" });
    }

    res.json({ message: "Removed from favorites" });
  } catch (err) {
    next(err);
  }
};
