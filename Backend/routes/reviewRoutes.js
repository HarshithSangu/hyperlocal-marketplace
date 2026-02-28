const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const { createReview, deleteReview } = require("../controllers/reviewController");

router.post("/", auth, createReview);
router.delete("/:id", auth, deleteReview);

module.exports = router;
