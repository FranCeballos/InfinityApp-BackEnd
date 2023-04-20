// Core imports

// Npm imports
const bcrypt = require("bcryptjs");

// Model imports
const User = require("../models/user.js");

// Utils imports
const logger = require("../logger.js");
const transporter = require("../utils/mailer.js");

// CONTROLLERS
exports.getRegister = async (req, res, next) => {
  logger.info(`${req.method} ${req.originalUrl}`);
  res.render("login/register", {
    pageTitle: "Signup",
    path: "/register",
    messageError: req.flash("error"),
  });
};

exports.postRegister = async (req, res, next) => {
  logger.info(`${req.method} ${req.originalUrl}`);
  const email = req.body.email;
  const password = req.body.password;
  const body = req.body;
  const avatarImg = req.file;
  const avatarImgPath = avatarImg?.path;

  try {
    const user = await User.findOne({ email: email });

    if (user) {
      req.flash("error", "Email already registered. Use other email.");
      return res.redirect("/register");
    }

    const hashedPassword = await bcrypt.hash(password, 12);
    const newUser = new User({
      firstName: body.firstName,
      lastName: body.lastName,
      email: email,
      age: body.age,
      phoneCharacteristic: body.phoneCharacteristic.trim().replaceAll("+", ""),
      phone: body.phone,
      country: body.country,
      password: hashedPassword,
      avatar: avatarImgPath,
      cart: { items: [] },
    });
    await newUser.save();

    res.redirect("/register-success");
    await transporter.sendMail({
      to: process.env.ADMIN_EMAIL,
      from: "shop.company.proyect@gmail.com",
      subject: "New SignUp Registered on Movie Proyect",
      html: `<h1>New SignUp Registered</h1>`,
    });
  } catch (err) {
    console.log(err);
  }
};

exports.getRegisterSuccess = async (req, res, next) => {
  logger.info(`${req.method} ${req.originalUrl}`);
  res.render("login/successRegister", {
    pageTitle: "SignUp Successful",
    path: "",
  });
};

exports.getLogIn = async (req, res, next) => {
  logger.info(`${req.method} ${req.originalUrl}`);
  res.render("login/login", {
    pageTitle: "Login",
    path: "/login",
    messageError: req.flash("error"),
  });
};

exports.postLogIn = async (req, res, next) => {
  logger.info(`${req.method} ${req.originalUrl}`);
  const email = req.body.email;
  const password = req.body.password;

  try {
    const user = await User.findOne({ email: email });
    if (!user) {
      req.flash("error", "Email and/or password incorrect.");
      res.redirect("/login");
    }

    const passwordMatches = await bcrypt.compare(password, user.password);
    if (passwordMatches) {
      req.session.user = user;
      req.session.isLoggedIn = true;
      return req.session.save((err) => {
        console.log(err);
        res.redirect("/shop");
      });
    }

    req.flash("error", "Email and/or password incorrect.");
    res.redirect("/login");
  } catch (err) {
    console.log(err);
  }
};

exports.postLogout = async (req, res, next) => {
  logger.info(`${req.method} ${req.originalUrl}`);
  req.session.destroy();
  res.redirect("/shop");
};
