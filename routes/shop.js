const express = require("express");
const router = express.Router();

const isAuth = require("../utils/is-auth.js");

const shopController = require("../controllers/shop.js");

// Routes
router.get("/", shopController.getHome);

router.get("/shop", shopController.getProducts);

router.get(
  "/shop/category/:categoryName",
  shopController.getProductsByCategory
);

router.get("/shop/:productId", shopController.getProductDetail);

router.get("/cart", isAuth, shopController.getCart);

router.post("/cart", isAuth, shopController.postCart);

router.post("/cart-delete-item", isAuth, shopController.postDeleteCartProduct);

router.get("/orders", isAuth, shopController.getOrders);

router.post("/create-order", isAuth, shopController.postOrder);

router.get("/chat", isAuth, shopController.getChat);

module.exports = router;
