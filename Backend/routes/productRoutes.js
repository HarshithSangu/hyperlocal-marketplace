const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const allowRoles = require("../middleware/roles");
const {
  addOrUpdateShopProduct,
  getShopProducts,
  updateShopProduct,
  deleteShopProduct,
} = require("../controllers/productController");

router.post("/shop", auth, allowRoles("seller"), addOrUpdateShopProduct);
router.get("/shop/:shopId", getShopProducts);

// Seller product management
router.put("/:id", auth, allowRoles("seller"), updateShopProduct);
router.delete("/:id", auth, allowRoles("seller"), deleteShopProduct);

module.exports = router;
