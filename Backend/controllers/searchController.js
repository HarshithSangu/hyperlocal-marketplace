const Product = require("../models/Product");
const Shop = require("../models/Shop");
const SearchLog = require("../models/SearchLog");
const ShopProduct = require("../models/ShopProduct");
const mongoose = require("mongoose");

/* ============================================================
   POST /search
   Product search near user location
============================================================ */
exports.search = async (req, res, next) => {
  try {
    const { text, latitude, longitude } = req.body;
    const userId = req.user?.id || null;

    const lat = parseFloat(latitude);
    const lng = parseFloat(longitude);

    if (isNaN(lat) || isNaN(lng)) return res.json([]);

    // Save search history (only when user is logged in)
    if (userId) {
      await SearchLog.create({
        user: userId,
        text,
        location: { type: "Point", coordinates: [lng, lat] },
      });
    }

    // Find matching products
    const products = await Product.find({
      name: { $regex: text, $options: "i" },
    }).select("_id name");

    if (!products.length) return res.json([]);

    const productIds = products.map((p) => new mongoose.Types.ObjectId(p._id));

    // Expanding search radius: 5km → 10km → 20km
    const radiuses = [5000, 10000, 20000];
    let results = [];

    for (const radius of radiuses) {
      results = await Shop.aggregate([
        {
          $geoNear: {
            near: { type: "Point", coordinates: [lng, lat] },
            distanceField: "distance",
            spherical: true,
            maxDistance: radius,
            query: { status: "approved" },
          },
        },

        {
          $lookup: {
            from: "shopproducts",
            let: { shopId: "$_id" },
            pipeline: [
              {
                $match: {
                  $expr: {
                    $and: [
                      { $eq: ["$shop", "$$shopId"] },
                      { $in: ["$product", productIds] },
                    ],
                  },
                },
              },
            ],
            as: "items",
          },
        },

        { $unwind: "$items" },

        {
          $lookup: {
            from: "products",
            localField: "items.product",
            foreignField: "_id",
            as: "productInfo",
          },
        },

        { $unwind: "$productInfo" },

        {
          $project: {
            shopId: "$_id",
            shopName: 1,
            address: 1,

            // map markers
            longitude: { $arrayElemAt: ["$location.coordinates", 0] },
            latitude: { $arrayElemAt: ["$location.coordinates", 1] },

            distanceMeters: { $round: ["$distance", 0] },

            price: "$items.price",
            availability: "$items.availabilityStatus",
            productName: "$productInfo.name",
            lastUpdated: "$items.lastUpdated",
          },
        },

        { $sort: { distanceMeters: 1, price: 1 } },
      ]);

      if (results.length) break;
    }

    res.json(results);
  } catch (err) {
    next(err);
  }
};

/* ============================================================
   GET /search/nearby
   Nearby shops cards (homepage feature)
============================================================ */
exports.getNearbyShops = async (req, res, next) => {
  try {
    const { lat, lng } = req.query;
    const latitude = parseFloat(lat);
    const longitude = parseFloat(lng);

    if (isNaN(latitude) || isNaN(longitude)) return res.json([]);

    const results = await Shop.aggregate([
      {
        $geoNear: {
          near: { type: "Point", coordinates: [longitude, latitude] },
          distanceField: "distanceMeters",
          spherical: true,
          maxDistance: 5000,
          query: { status: "approved" },
        },
      },

      { $sort: { distanceMeters: 1 } },
      { $limit: 10 },

      {
        $project: {
          shopId: { $toString: "$_id" },
          id: { $toString: "$_id" },
          shopName: 1,
          address: 1,
          trustScore: 1,
          imageUrl: 1,
          openTime: 1,
          closeTime: 1,
          rating: 1,

          longitude: { $arrayElemAt: ["$location.coordinates", 0] },
          latitude: { $arrayElemAt: ["$location.coordinates", 1] },

          distanceMeters: 1,
          distanceKm: { $divide: ["$distanceMeters", 1000] },
        },
      },
    ]);

    res.json(results);
  } catch (err) {
    next(err);
  }
};

/* ============================================================
   GET /search/updates/nearby
   Recent price changes near user (24 hours)
============================================================ */
exports.getRecentUpdates = async (req, res, next) => {
  try {
    const { lat, lng } = req.query;
    const latitude = parseFloat(lat);
    const longitude = parseFloat(lng);

    if (isNaN(latitude) || isNaN(longitude)) return res.json([]);

    const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);

    const results = await Shop.aggregate([
      {
        $geoNear: {
          near: { type: "Point", coordinates: [longitude, latitude] },
          distanceField: "distanceMeters",
          spherical: true,
          maxDistance: 5000,
          query: { status: "approved" },
        },
      },

      {
        $lookup: {
          from: "shopproducts",
          localField: "_id",
          foreignField: "shop",
          as: "items",
        },
      },

      { $unwind: "$items" },

      {
        $match: {
          "items.lastUpdated": { $gte: oneDayAgo },
        },
      },

      {
        $lookup: {
          from: "products",
          localField: "items.product",
          foreignField: "_id",
          as: "productInfo",
        },
      },

      { $unwind: "$productInfo" },

      {
        $project: {
          shopName: "$shopName",
          productName: "$productInfo.name",
          oldPrice: "$items.oldPrice",
          newPrice: "$items.price",
          availabilityStatus: "$items.availabilityStatus",
          updatedAt: "$items.lastUpdated",
          distanceKm: { $divide: ["$distanceMeters", 1000] },
        },
      },

      { $sort: { updatedAt: -1 } },
      { $limit: 20 },
    ]);

    res.json(results);
  } catch (err) {
    next(err);
  }
};
