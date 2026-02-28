const Review = require("../models/Review");
const Shop = require("../models/Shop");

/**
 * POST /api/reviews
 * Create or update a review for a shop
 */
exports.createReview = async (req, res, next) => {
  try {
    const { shopId, rating, comment } = req.body;
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({ message: "Authentication required" });
    }

    if (!shopId) {
      return res.status(400).json({ message: "Shop ID is required" });
    }

    const ratingNum = parseInt(rating, 10);
    if (isNaN(ratingNum) || ratingNum < 1 || ratingNum > 5) {
      return res.status(400).json({ message: "Rating must be between 1 and 5" });
    }

    const shop = await Shop.findById(shopId);
    if (!shop) {
      return res.status(404).json({ message: "Shop not found" });
    }

    const User = require("../models/User");
    const user = await User.findById(userId).select("name");
    const userName = user?.name || "Anonymous";

    const existing = await Review.findOne({ shop: shopId, user: userId });

    const reviewData = {
      rating: ratingNum,
      comment: String(comment || "").trim(),
      userName,
    };

    let review;
    if (existing) {
      review = await Review.findByIdAndUpdate(
        existing._id,
        reviewData,
        { new: true },
      );
    } else {
      review = await Review.create({
        shop: shopId,
        user: userId,
        ...reviewData,
      });
    }

    // Update shop's average rating
    const reviews = await Review.find({ shop: shopId });
    const avgRating =
      reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length;
    await Shop.findByIdAndUpdate(shopId, {
      rating: Math.round(avgRating * 10) / 10,
    });

    res.status(201).json({
      id: review._id,
      shopId,
      rating: review.rating,
      comment: review.comment,
      createdAt: review.createdAt,
    });
  } catch (err) {
    next(err);
  }
};

/**
 * DELETE /api/reviews/:id
 * Delete a review (only own review)
 */
exports.deleteReview = async (req, res, next) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ message: "Authentication required" });
    }

    const { id } = req.params;
    const review = await Review.findById(id);
    if (!review) {
      return res.status(404).json({ message: "Review not found" });
    }

    if (review.user.toString() !== userId) {
      return res.status(403).json({ message: "Not authorized to delete this review" });
    }

    const shopId = review.shop;
    await Review.findByIdAndDelete(id);

    // Update shop's average rating
    const reviews = await Review.find({ shop: shopId });
    const avgRating =
      reviews.length > 0
        ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
        : 0;
    await Shop.findByIdAndUpdate(shopId, {
      rating: Math.round(avgRating * 10) / 10,
    });

    res.json({ message: "Review deleted" });
  } catch (err) {
    next(err);
  }
};
