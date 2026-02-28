const express = require("express");
const router = express.Router();
const { getShopById } = require("../controllers/shopController");

// Public route - shop details viewable without auth
router.get("/:id", getShopById);

module.exports = router;
