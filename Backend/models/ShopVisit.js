const mongoose = require("mongoose");

const ShopVisitSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
    index: true,
  },
  shop: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Shop",
    required: true,
    index: true,
  },
  visitedAt: { type: Date, default: Date.now, index: true },
});

ShopVisitSchema.index({ user: 1, shop: 1 });

module.exports = mongoose.model("ShopVisit", ShopVisitSchema);
