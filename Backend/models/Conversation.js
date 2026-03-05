const mongoose = require("mongoose");

const ConversationSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    sellerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    lastMessage: { type: String, default: "" },
  },
  { timestamps: true }
);

ConversationSchema.index({ userId: 1, sellerId: 1 }, { unique: true });

module.exports = mongoose.model("Conversation", ConversationSchema);

