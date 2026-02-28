const mongoose = require("mongoose");

const SearchLogSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", default: null },
  text: { type: String, required: true },
  location: {
    type: { type: String, enum: ["Point"], default: "Point" },
    coordinates: { type: [Number], default: [0, 0] }, // [lng, lat]
  },
  createdAt: { type: Date, default: Date.now, index: true },
});

// expire after 7 days
SearchLogSchema.index(
  { createdAt: 1 },
  { expireAfterSeconds: 7 * 24 * 60 * 60 },
);
SearchLogSchema.index({ location: "2dsphere" });

module.exports = mongoose.model("SearchLog", SearchLogSchema);
