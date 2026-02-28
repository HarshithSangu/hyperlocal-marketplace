const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const allowRoles = require("../middleware/roles");
const {
  applyShop,
  getShopByOwner,
  setShopStatus,
  getAllShops,
} = require("../controllers/sellerController");

router.post("/apply", auth, allowRoles("seller"), applyShop);
router.get("/mine", auth, allowRoles("seller"), getShopByOwner);

// admin routes
router.get("/", auth, allowRoles("admin"), getAllShops);
router.patch("/:shopId/status", auth, allowRoles("admin"), setShopStatus);

module.exports = router;
