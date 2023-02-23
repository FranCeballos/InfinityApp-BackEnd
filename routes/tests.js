const express = require("express");
const { fork } = require("child_process");

const controllerTests = require("../controllers/test.js");

const router = express.Router();

// router.get("/generate-randoms", controllerTests.getGenerateRandom);

// router.post("/generate-randoms", controllerTests.postGenerateRandoms);

module.exports = router;
