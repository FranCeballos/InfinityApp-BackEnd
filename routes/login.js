const express = require("express");
const router = express.Router();
const passport = require("passport");

const controllerLogIn = require("../controllers/login.js");

/* -- REGISTER -- */
router.get("/register", controllerLogIn.getRegister);

router.post(
  "/register",
  passport.authenticate("signup", {
    successRedirect: "/register-success",
    failureRedirect: "/register-error",
    failureMessage: true,
  }),
  controllerLogIn.postRegister
);

router.get("/register-success", controllerLogIn.getRegisterSuccess);

router.get("/register-error", controllerLogIn.getRegisterError);

/* -- LOGIN -- */
router.get("/login", controllerLogIn.getLogIn);

router.post(
  "/login",
  passport.authenticate("login", {
    successRedirect: "/products",
    failureRedirect: "/login-error",
    failureMessage: true,
  }),
  controllerLogIn.postLogIn
);

router.get("/login-error", controllerLogIn.getLogInError);

/* -- LOGOUT -- */
router.get("/logout", controllerLogIn.getLogOut);

module.exports = router;
