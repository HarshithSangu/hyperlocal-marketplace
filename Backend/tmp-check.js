const mongoose = require("mongoose");
require("dotenv").config();
const SearchLog = require("./models/SearchLog");
const Shop = require("./models/Shop");

(async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    const ownerId = "69a32c4f4d11d2cac1a9ee35";
    const shop = await Shop.findOne({ owner: ownerId }).lean();
    const coords =
      shop && shop.location && shop.location.coordinates
        ? shop.location.coordinates
        : [0, 0];
    const since = new Date(Date.now() - 24 * 60 * 60 * 1000);

    console.log("SHOP", !!shop, "COORDS", coords);

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

    console.log(JSON.stringify(results, null, 2));
  } catch (e) {
    console.error(e);
  } finally {
    await mongoose.disconnect();
  }
})();
