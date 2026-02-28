const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const {
  search,
  getNearbyShops,
  getRecentUpdates,
} = require("../controllers/searchController");

router.post("/", auth, search);
router.get("/nearby", auth, getNearbyShops);
router.get("/updates/nearby", auth, getRecentUpdates);

module.exports = router;
