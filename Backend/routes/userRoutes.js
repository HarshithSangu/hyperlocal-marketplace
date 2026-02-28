const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const {
  getMe,
  getMyReviews,
  getMyFavorites,
  getMyVisits,
  getMySearchHistory,
  addFavorite,
  removeFavorite,
} = require("../controllers/userController");

router.get("/me", auth, getMe);
router.post("/me/favorites", auth, addFavorite);
router.get("/me/reviews", auth, getMyReviews);
router.get("/me/favorites", auth, getMyFavorites);
router.get("/me/visits", auth, getMyVisits);
router.get("/me/search-history", auth, getMySearchHistory);
router.delete("/me/favorites/:shopId", auth, removeFavorite);

module.exports = router;
