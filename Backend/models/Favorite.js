const mongoose = require("mongoose");

const FavoriteSchema = new mongoose.Schema({
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
  createdAt: { type: Date, default: Date.now },
});

FavoriteSchema.index({ user: 1, shop: 1 }, { unique: true });

module.exports = mongoose.model("Favorite", FavoriteSchema);
