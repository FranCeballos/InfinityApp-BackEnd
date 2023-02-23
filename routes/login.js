const express = require("express");
const router = express.Router();

const controllerLogIn = require("../controllers/login.js");

/* -- REGISTER -- */
router.get("/register", controllerLogIn.getRegister);

router.post("/register", controllerLogIn.postRegister);

router.get("/register-success", controllerLogIn.getRegisterSuccess);

router.get("/register-error", controllerLogIn.getRegisterError);

/* -- LOGIN -- */
router.get("/login", controllerLogIn.getLogIn);

router.post("/login", controllerLogIn.postLogIn);

router.get("/login-error", controllerLogIn.getLogInError);

/* -- LOGOUT -- */
router.get("/logout", controllerLogIn.getLogOut);

module.exports = router;
