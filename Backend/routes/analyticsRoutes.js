const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const allowRoles = require("../middleware/roles");
const { topSearchesNearby } = require("../controllers/analyticsController");

router.get(
  "/seller/top-searches",
  auth,
  allowRoles("seller"),
  topSearchesNearby,
);

module.exports = router;
