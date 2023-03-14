const User = require("../models/user.js");
const logger = require("../logger.js");
const jwt = require("jsonwebtoken");

exports.getRegister = async (req, res) => {
  logger.info(`${req.method} ${req.originalUrl}`);
  res.render("login/register");
};

exports.postRegister = async (req, res) => {
  logger.info(`${req.method} ${req.originalUrl}`);
  const body = req.body;
  const user = new User({
    firstName: body.firstName,
    lastName: body.lastName,
    username: body.email,
    age: body.age,
    phoneCharacteristic: body.phoneCharacteristic,
    phone: body.phone,
    country: body.country,
    password: body.password,
    avatar: body.avatar,
  });
  user
    .save()
    .then(() => res.redirect("/register-success"))
    .catch((err) => res.render("login/failRegister", { error: err }));
};

exports.getRegisterSuccess = async (req, res) => {
  logger.info(`${req.method} ${req.originalUrl}`);
  res.render("login/successRegister");
};

exports.getRegisterError = async (req, res) => {
  logger.info(`${req.method} ${req.originalUrl}`);
  res.render("login/failRegister", { error: req.session.messages });
};

exports.getLogIn = async (req, res) => {
  if (req.isAuthenticated()) {
    logger.info(`${req.method} ${req.originalUrl}`);
    res.redirect("/products");
  } else {
    console.log("User not logged");
    res.render("login/login");
  }
};

exports.postLogIn = async (req, res) => {
  logger.info(`${req.method} ${req.originalUrl}`);
  jwt.sign(
    { user: req.user },
    process.env.SECRET_KEY,
    { expiresIn: "1h" },
    (err, token) => {
      if (err) {
        return res.json({
          message: "Failed to login",
          token: null,
        });
      }
      res.json({ token });
    }
  );
};

exports.getLogInError = async (req, res) => {
  logger.info(`${req.method} ${req.originalUrl}`);
  res.render("login/failLogin", { error: req.session.messages });
};

exports.getLogOut = (req, res, next) => {
  logger.info(`${req.method} ${req.originalUrl}`);
  req.logout((err) => {
    if (err) {
      return next(err);
    }
    res.redirect("/login");
  });
};
