const mongoose = require("mongoose");

const ShopProductSchema = new mongoose.Schema({
  shop: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Shop",
    required: true,
    index: true,
  },
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Product",
    required: true,
    index: true,
  },
  price: { type: Number, required: true },
  oldPrice: { type: Number }, // Store previous price for updates feed
  availabilityStatus: {
    type: String,
    enum: ["likely", "low", "unknown"],
    default: "unknown",
  },
  lastUpdated: { type: Date, default: Date.now },
});

ShopProductSchema.index({ shop: 1, product: 1 }, { unique: true });

module.exports = mongoose.model("ShopProduct", ShopProductSchema);
