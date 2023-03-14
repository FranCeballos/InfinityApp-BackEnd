const express = require("express");
const router = express.Router();

const controllerAdmin = require("../controllers/admin.js");

module.exports = (passport) => {
  router.get(
    "/products",
    passport.authenticate("login", { session: false }),
    controllerAdmin.getProducts
  );

  router.post(
    "/products",
    passport.authenticate("login", { session: false }),
    controllerAdmin.postProduct
  );

  router.post(
    "/product-delete",
    passport.authenticate("login", { session: false }),
    controllerAdmin.postDeleteProduct
  );

  router.get(
    "/info",
    passport.authenticate("login", { session: false }),
    controllerAdmin.getInfo
  );

  return router;
};
