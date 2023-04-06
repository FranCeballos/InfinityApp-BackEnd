const express = require("express");
const router = express.Router();
const isAuth = require("../utils/is-auth.js");
const { uploadAvatarImage } = require("../utils/multerConfig.js");

const controllerLogIn = require("../controllers/auth.js");

/* -- REGISTER -- */
router.get("/register", controllerLogIn.getRegister);

router.post(
  "/register",
  uploadAvatarImage.single("avatar"),
  controllerLogIn.postRegister
);

router.get("/register-success", controllerLogIn.getRegisterSuccess);

/* -- LOGIN -- */
router.get("/login", controllerLogIn.getLogIn);

router.post("/login", controllerLogIn.postLogIn);

/* -- LOGOUT -- */
router.post("/logout", isAuth, controllerLogIn.postLogout);

module.exports = router;
