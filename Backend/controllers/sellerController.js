const Shop = require("../models/Shop");

exports.applyShop = async (req, res, next) => {
  try {
    const { shopName, address, latitude, longitude } = req.body;
    const owner = req.user.id;
    const shop = await Shop.create({
      shopName,
      address,
      owner,
      location: {
        type: "Point",
        coordinates: [parseFloat(longitude), parseFloat(latitude)],
      },
    });
    res.status(201).json(shop);
  } catch (err) {
    next(err);
  }
};

exports.getShopByOwner = async (req, res, next) => {
  try {
    const shop = await Shop.findOne({ owner: req.user.id });
    res.json(shop);
  } catch (err) {
    next(err);
  }
};

exports.getAllShops = async (req, res, next) => {
  try {
    const shops = await Shop.find().populate("owner", "email name");
    res.json(shops);
  } catch (err) {
    next(err);
  }
};
exports.setShopStatus = async (req, res, next) => {
  try {
    const { shopId } = req.params;
    const { status } = req.body;

    if (!["approved", "rejected", "pending"].includes(status)) {
      return res.status(400).json({ message: "Invalid status" });
    }

    const shop = await Shop.findById(shopId);
    if (!shop) {
      return res.status(404).json({ message: "Shop not found" });
    }

    shop.status = status;
    if (status === "approved" && !shop.approvedAt) {
      shop.approvedAt = new Date();
    }

    await shop.save();

    res.json(shop);
  } catch (err) {
    next(err);
  }
};
