const ShopVisit = require("../models/ShopVisit");
const Shop = require("../models/Shop");

/**
 * POST /api/visits
 * Log a shop visit (called when user opens ShopDetails)
 */
exports.createVisit = async (req, res, next) => {
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

    const existing = await ShopVisit.findOne({
      user: userId,
      shop: shopId,
    });

    if (existing) {
      await ShopVisit.findByIdAndUpdate(existing._id, {
        visitedAt: new Date(),
      });
      return res.status(200).json({ message: "Visit updated" });
    }

    await ShopVisit.create({
      user: userId,
      shop: shopId,
    });

    res.status(201).json({ message: "Visit logged" });
  } catch (err) {
    next(err);
  }
};
