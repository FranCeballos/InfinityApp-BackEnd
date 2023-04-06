const express = require("express");
const router = express.Router();

const isAuth = require("../utils/is-auth.js");

const { uploadProductImage } = require("../utils/multerConfig.js");

const controllerAdmin = require("../controllers/admin.js");

router.get("/products", isAuth, controllerAdmin.getProducts);

router.get("/add-product", isAuth, controllerAdmin.getAddProduct);

router.post(
  "/add-product",
  isAuth,
  uploadProductImage.single("img"),
  controllerAdmin.postProduct
);

router.get("/edit-product/:productId", isAuth, controllerAdmin.getEditProduct);

router.post(
  "/edit-product/:productId",
  isAuth,
  uploadProductImage.single("img"),
  controllerAdmin.postEditProduct
);

router.post("/product-delete", isAuth, controllerAdmin.postDeleteProduct);

router.get("/info", isAuth, controllerAdmin.getInfo);

module.exports = router;
