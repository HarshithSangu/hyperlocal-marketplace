const mongoose = require("mongoose");

const ShopSchema = new mongoose.Schema({
  shopName: { type: String, required: true },
  address: { type: String },
  location: {
    type: { type: String, enum: ["Point"], default: "Point" },
    coordinates: { type: [Number], default: [0, 0] }, // [lng, lat]
  },
  owner: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  status: {
    type: String,
    enum: ["pending", "approved", "rejected"],
    default: "pending",
  },
  // Admin-facing status for seller management (active/disabled/banned)
  adminStatus: {
    type: String,
    enum: ["active", "disabled", "banned"],
    default: "active",
  },
  // Optional metadata used by the admin panel UI
  imageUrl: { type: String },
  phone: { type: String },
  openTime: { type: String },
  closeTime: { type: String },
  rating: { type: Number, default: 0 },
  lastActive: { type: Date },
  approvedAt: { type: Date },
  trustScore: { type: Number, default: 100 },
  createdAt: { type: Date, default: Date.now },
});

ShopSchema.index({ location: "2dsphere" });

module.exports = mongoose.model("Shop", ShopSchema);
