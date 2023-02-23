const express = require("express");
const router = express.Router();

const controllerShop = require("../controllers/shop.js");

router.get("/products", controllerShop.getProducts);

router.get("/products-test", controllerShop.getProductsTest);

module.exports = router;
