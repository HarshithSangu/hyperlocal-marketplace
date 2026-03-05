const mongoose = require("mongoose");
const Shop = require("../models/Shop");
const ShopProduct = require("../models/ShopProduct");
const Review = require("../models/Review");

exports.getShopById = async (req, res, next) => {
  try {
    const { id } = req.params;

    // Validate ObjectId
    if (!id || !mongoose.Types.ObjectId.isValid(id)) {
      return res.status(404).json({ message: "Shop not found" });
    }

    const shop = await Shop.findById(id);

    if (!shop) {
      return res.status(404).json({ message: "Shop not found" });
    }

    if (shop.status !== "approved") {
      return res.status(404).json({ message: "Shop not approved" });
    }

    // Seller ID
    const sellerId = shop.owner ? shop.owner.toString() : null;

    // Fetch products and reviews in parallel
    const [shopProducts, reviews] = await Promise.all([
      ShopProduct.find({ shop: shop._id }).populate("product", "name"),
      Review.find({ shop: shop._id }).sort({ createdAt: -1 }),
    ]);

    // Format products
    const products = shopProducts.map((sp) => ({
      id: sp._id,
      productName: sp.product?.name || "",
      price: sp.price,
      updatedAt: sp.lastUpdated,
    }));

    // Format reviews
    const formattedReviews = reviews.map((r) => ({
      id: r._id,
      userName: r.userName,
      rating: r.rating,
      comment: r.comment || "",
      createdAt: r.createdAt,
    }));

    // Calculate rating
    const avgRating =
      reviews.length > 0
        ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
        : shop.rating || 0;

    // Location
    const [longitude, latitude] = shop.location?.coordinates || [0, 0];

    res.json({
      id: shop._id.toString(),

      // IMPORTANT FOR CHAT
      sellerId: sellerId,

      shopName: shop.shopName,
      imageUrl: shop.imageUrl || "",
      address: shop.address || "",
      phone: shop.phone || "",

      rating: Math.round(avgRating * 10) / 10,
      totalReviews: reviews.length,

      openTime: shop.openTime || "09:00",
      closeTime: shop.closeTime || "21:00",

      latitude,
      longitude,

      products,
      reviews: formattedReviews,
    });

  } catch (err) {
    console.error("Error in getShopById:", err);
    next(err);
  }
};