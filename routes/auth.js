// Npm imports
const express = require("express");

// Utils imports
const isAuth = require("../utils/is-auth.js");
const { validateSignUp, validateLogIn } = require("../utils/validator.js");
const { uploadAvatarImage } = require("../utils/multerConfig.js");

// Controller import
const controllerLogIn = require("../controllers/auth.js");

// Routes
const router = express.Router();

/* -- REGISTER -- */
router.get("/register", controllerLogIn.getRegister);

router.post(
  "/register",
  uploadAvatarImage.single("avatar"),
  validateSignUp,
  controllerLogIn.postRegister
);

router.get("/register-success", controllerLogIn.getRegisterSuccess);

/* -- LOGIN -- */
router.get("/login", controllerLogIn.getLogIn);

router.post("/login", validateLogIn, controllerLogIn.postLogIn);

/* -- LOGOUT -- */
router.post("/logout", isAuth, controllerLogIn.postLogout);

module.exports = router;
