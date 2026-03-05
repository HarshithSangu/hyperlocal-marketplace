require("dotenv").config();
const express = require("express");
const http = require("http");
const cors = require("cors"); // ⭐ added
const { connectDB } = require("./config/db");
const authRoutes = require("./routes/authRoutes");
const sellerRoutes = require("./routes/sellerRoutes");
const productRoutes = require("./routes/productRoutes");
const searchRoutes = require("./routes/searchRoutes");
const analyticsRoutes = require("./routes/analyticsRoutes");
const adminRoutes = require("./routes/adminRoutes");
const shopRoutes = require("./routes/shopRoutes");
const reviewRoutes = require("./routes/reviewRoutes");
const userRoutes = require("./routes/userRoutes");
const visitRoutes = require("./routes/visitRoutes");
const errorHandler = require("./middleware/errorHandler");
const chatRoutes = require("./routes/chatRoutes");
const { setupChatSocket } = require("./sockets/chatSocket");

const app = express();

app.use(cors()); // ⭐ allow frontend requests
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/sellers", sellerRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/shops", shopRoutes);
app.use("/api/reviews", reviewRoutes);
app.use("/api/users", userRoutes);
app.use("/api/visits", visitRoutes);
app.use("/api/products", productRoutes);
app.use("/api/search", searchRoutes);
app.use("/api/analytics", analyticsRoutes);
app.use("/api/chat", chatRoutes);

app.get("/", (req, res) => res.send("Hyperlocal discovery API"));

app.use(errorHandler);

const PORT = process.env.PORT || 5000;

const start = async () => {
  await connectDB();

  const server = http.createServer(app);
  setupChatSocket(server);

  server.listen(PORT, () =>
    console.log(`Server with Socket.IO running on port ${PORT}`)
  );
};

start().catch((err) => {
  console.error("Failed to start", err);
  process.exit(1);
});
