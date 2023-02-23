const express = require("express");
const router = express.Router();

const controllerAdmin = require("../controllers/admin.js");

router.get("/products", controllerAdmin.getProducts);

router.post("/products", controllerAdmin.postProducts);

router.get("/info", controllerAdmin.getInfo);

module.exports = router;
