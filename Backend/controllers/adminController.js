const Shop = require("../models/Shop");
const ShopProduct = require("../models/ShopProduct");

// GET /api/admin/approved-sellers
exports.getApprovedSellers = async (req, res, next) => {
  try {
    const shops = await Shop.find({ status: "approved" }).populate(
      "owner",
      "name email",
    );

    const result = shops.map((shop) => ({
      id: shop._id,
      shopName: shop.shopName,
      ownerName: shop.owner?.name || "",
      email: shop.owner?.email || "",
      imageUrl: shop.imageUrl || "",
      rating: typeof shop.rating === "number" ? shop.rating : 0,
      status: shop.adminStatus || "active",
      approvedAt: shop.approvedAt || shop.createdAt,
    }));

    res.json(result);
  } catch (err) {
    next(err);
  }
};

// GET /api/admin/seller/:id
exports.getSellerProfile = async (req, res, next) => {
  try {
    const { id } = req.params;

    const shop = await Shop.findById(id).populate("owner", "name email");
    if (!shop) {
      return res.status(404).json({ message: "Seller not found" });
    }

    const shopProducts = await ShopProduct.find({ shop: shop._id }).populate(
      "product",
      "name",
    );

    const totalProducts = shopProducts.length;
    const totalUpdates = shopProducts.filter((sp) => sp.oldPrice != null).length;

    let lastProductUpdate = null;
    for (const sp of shopProducts) {
      if (!lastProductUpdate || sp.lastUpdated > lastProductUpdate) {
        lastProductUpdate = sp.lastUpdated;
      }
    }

    const lastActive =
      shop.lastActive ||
      lastProductUpdate ||
      shop.updatedAt ||
      shop.createdAt;

    const products = shopProducts.map((sp) => ({
      id: sp._id,
      productName: sp.product?.name || "",
      price: sp.price,
      updatedAt: sp.lastUpdated,
    }));

    res.json({
      id: shop._id,
      shopName: shop.shopName,
      imageUrl: shop.imageUrl || "",
      ownerName: shop.owner?.name || "",
      email: shop.owner?.email || "",
      phone: shop.phone || "",
      address: shop.address || "",
      rating: typeof shop.rating === "number" ? shop.rating : 0,
      openTime: shop.openTime || "09:00",
      closeTime: shop.closeTime || "21:00",
      status: shop.adminStatus || "active",
      totalProducts,
      totalUpdates,
      totalOrders: 0,
      lastActive,
      approvedAt: shop.approvedAt || shop.createdAt,
      products,
    });
  } catch (err) {
    next(err);
  }
};

const updateAdminStatus = async (req, res, next, status) => {
  try {
    const { id } = req.params;
    const shop = await Shop.findByIdAndUpdate(
      id,
      { adminStatus: status },
      { new: true },
    );

    if (!shop) {
      return res.status(404).json({ message: "Seller not found" });
    }

    res.json({
      id: shop._id,
      adminStatus: shop.adminStatus,
    });
  } catch (err) {
    next(err);
  }
};

// PATCH /api/admin/seller/:id/disable
exports.disableSeller = (req, res, next) =>
  updateAdminStatus(req, res, next, "disabled");

// PATCH /api/admin/seller/:id/enable
exports.enableSeller = (req, res, next) =>
  updateAdminStatus(req, res, next, "active");

// PATCH /api/admin/seller/:id/ban
exports.banSeller = (req, res, next) =>
  updateAdminStatus(req, res, next, "banned");

// PATCH /api/admin/seller/:id/unban
exports.unbanSeller = (req, res, next) =>
  updateAdminStatus(req, res, next, "active");

// DELETE /api/admin/seller/:id
exports.deleteSeller = async (req, res, next) => {
  try {
    const { id } = req.params;

    await ShopProduct.deleteMany({ shop: id });
    const shop = await Shop.findByIdAndDelete(id);

    if (!shop) {
      return res.status(404).json({ message: "Seller not found" });
    }

    res.json({ message: "Seller deleted successfully" });
  } catch (err) {
    next(err);
  }
};

// POST /api/admin/seller/:id/reset-password
// NOTE: This is a stub endpoint. In a real system, you'd trigger an email
// or set a temporary password for the seller's user account.
exports.resetSellerPassword = async (req, res, next) => {
  try {
    res.json({
      message:
        "Password reset request acknowledged. Implement actual reset logic here.",
    });
  } catch (err) {
    next(err);
  }
};

