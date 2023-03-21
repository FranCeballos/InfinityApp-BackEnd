const express = require("express");
const router = express.Router();

const isAuth = require("../utils/is-auth.js");

const controllerAdmin = require("../controllers/admin.js");

router.get("/products", isAuth, controllerAdmin.getProducts);

router.post("/products", isAuth, controllerAdmin.postProduct);

router.post("/product-delete", isAuth, controllerAdmin.postDeleteProduct);

router.get("/info", isAuth, controllerAdmin.getInfo);

module.exports = router;
