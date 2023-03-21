const express = require("express");
const router = express.Router();
const passport = require("passport");

const controllerLogIn = require("../controllers/auth.js");

/* -- REGISTER -- */
router.get("/register", controllerLogIn.getRegister);

router.post("/register", controllerLogIn.postRegister);

router.get("/register-success", controllerLogIn.getRegisterSuccess);

/* -- LOGIN -- */
router.get("/login", controllerLogIn.getLogIn);

router.post("/login", controllerLogIn.postLogIn);

/* -- LOGOUT -- */
router.post("/logout", controllerLogIn.postLogout);

module.exports = router;
