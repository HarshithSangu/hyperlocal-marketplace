const SearchLog = require("../models/SearchLog");
const Shop = require("../models/Shop");

// Seller analytics: top searched texts within 3km in last 24 hours
exports.topSearchesNearby = async (req, res, next) => {
  try {
    const ownerId = req.user.id;
    const shop = await Shop.findOne({ owner: ownerId });
    if (!shop) return res.status(404).json({ message: "Shop not found" });
    const coords = shop.location.coordinates || [0, 0];
    const since = new Date(Date.now() - 24 * 60 * 60 * 1000);

    const results = await SearchLog.aggregate([
      {
        $geoNear: {
          near: { type: "Point", coordinates: coords },
          distanceField: "distance",
          spherical: true,
          maxDistance: 3000,
          query: { createdAt: { $gte: since } },
        },
      },
      { $group: { _id: "$text", count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 20 },
    ]);

    res.json(results.map((r) => ({ text: r._id, count: r.count })));
  } catch (err) {
    next(err);
  }
};
