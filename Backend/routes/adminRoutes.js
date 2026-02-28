const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const allowRoles = require("../middleware/roles");
const {
  getApprovedSellers,
  getSellerProfile,
  disableSeller,
  enableSeller,
  banSeller,
  unbanSeller,
  deleteSeller,
  resetSellerPassword,
} = require("../controllers/adminController");

// All admin routes require an authenticated admin user
router.use(auth, allowRoles("admin"));

router.get("/approved-sellers", getApprovedSellers);
router.get("/seller/:id", getSellerProfile);
router.patch("/seller/:id/disable", disableSeller);
router.patch("/seller/:id/enable", enableSeller);
router.patch("/seller/:id/ban", banSeller);
router.patch("/seller/:id/unban", unbanSeller);
router.delete("/seller/:id", deleteSeller);
router.post("/seller/:id/reset-password", resetSellerPassword);

module.exports = router;

