// Npm imports
const express = require("express");

// Utils imports
const isAuth = require("../utils/is-auth.js");
const isAdmin = require("../utils/is-admin.js");
const { uploadProductImage } = require("../utils/multerConfig.js");
const { validateAddOrEditProduct } = require("../utils/validator.js");

// Controller import
const controllerAdmin = require("../controllers/admin.js");

// Routes
const router = express.Router();

router.get("/products", isAuth, isAdmin, controllerAdmin.getProducts);

router.get("/add-product", isAuth, isAdmin, controllerAdmin.getAddProduct);

router.post(
  "/add-product",
  isAuth,
  uploadProductImage.single("img"),
  validateAddOrEditProduct,
  controllerAdmin.postProduct
);

router.get(
  "/edit-product/:productId",
  isAuth,
  isAdmin,
  controllerAdmin.getEditProduct
);

router.post(
  "/edit-product/:productId",
  isAuth,
  uploadProductImage.single("img"),
  validateAddOrEditProduct,
  controllerAdmin.postEditProduct
);

router.post(
  "/product-delete",
  isAuth,
  isAdmin,
  controllerAdmin.postDeleteProduct
);

router.get("/chat", isAuth, isAdmin, controllerAdmin.getChat);

router.get("/info", isAuth, isAdmin, controllerAdmin.getInfo);

module.exports = router;
