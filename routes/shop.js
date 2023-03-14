const express = require("express");
const router = express.Router();

const shopController = require("../controllers/shop.js");

module.exports = (passport) => {
  router.get(
    "/products",
    passport.authenticate("login", { failureRedirect }),
    shopController.getProducts
  );

  router.get("/products-test", shopController.getProductsTest);

  router.get("/products/:productId", shopController.getProductDetail);

  router.get("/cart", shopController.getCart);

  router.post("/cart", shopController.postCart);

  router.post("/cart-delete-item", shopController.postDeleteCartProduct);

  router.get("/orders", shopController.getOrders);

  router.post("/create-order", shopController.postOrder);

  return router;
};
