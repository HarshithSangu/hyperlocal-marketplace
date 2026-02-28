const Product = require("../models/Product");
const Shop = require("../models/Shop");
const ShopProduct = require("../models/ShopProduct");

// seller adds or updates product listing for their shop
exports.addOrUpdateShopProduct = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { shopId, name, category, brand, price, availabilityStatus } =
      req.body;

    const shop = await Shop.findById(shopId);
    if (!shop) return res.status(404).json({ message: "Shop not found" });
    if (shop.owner.toString() !== userId)
      return res.status(403).json({ message: "Not owner of shop" });
    if (shop.status !== "approved")
      return res.status(403).json({ message: "Shop not approved" });

    // find or create product master
    let product = await Product.findOne({
      name: new RegExp("^" + name + "$", "i"),
      brand: brand || "",
    });
    if (!product) product = await Product.create({ name, category, brand });

    // Store old price before update
    const existingProduct = await ShopProduct.findOne({
      shop: shopId,
      product: product._id,
    });
    const oldPrice = existingProduct ? existingProduct.price : null;

    const update = {
      price,
      availabilityStatus,
      lastUpdated: new Date(),
      oldPrice: oldPrice || null,
    };
    const shopProduct = await ShopProduct.findOneAndUpdate(
      { shop: shopId, product: product._id },
      { $set: update },
      { upsert: true, new: true, setDefaultsOnInsert: true },
    );
    res.json({ shopProduct, product });
  } catch (err) {
    next(err);
  }
};

exports.getShopProducts = async (req, res, next) => {
  try {
    const { shopId } = req.params;
    const list = await ShopProduct.find({ shop: shopId }).populate("product");
    res.json(list);
  } catch (err) {
    next(err);
  }
};

// PUT /seller/product/:id - Update product (price, availability)
exports.updateShopProduct = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { id } = req.params;
    const { price, availabilityStatus } = req.body;

    const shopProduct = await ShopProduct.findById(id).populate("shop");
    if (!shopProduct) return res.status(404).json({ message: "Product not found" });

    const shop = shopProduct.shop;
    if (shop.owner.toString() !== userId)
      return res.status(403).json({ message: "Not owner of shop" });

    // Store old price
    const oldPrice = shopProduct.price;

    const update = {};
    if (price !== undefined) update.price = price;
    if (availabilityStatus !== undefined) update.availabilityStatus = availabilityStatus;
    update.lastUpdated = new Date();
    update.oldPrice = oldPrice;

    const updated = await ShopProduct.findByIdAndUpdate(id, update, {
      new: true,
    }).populate("product");

    res.json(updated);
  } catch (err) {
    next(err);
  }
};

// DELETE /seller/product/:id - Delete product
exports.deleteShopProduct = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { id } = req.params;

    const shopProduct = await ShopProduct.findById(id).populate("shop");
    if (!shopProduct) return res.status(404).json({ message: "Product not found" });

    const shop = shopProduct.shop;
    if (shop.owner.toString() !== userId)
      return res.status(403).json({ message: "Not owner of shop" });

    await ShopProduct.findByIdAndDelete(id);
    res.json({ message: "Product deleted" });
  } catch (err) {
    next(err);
  }
};
