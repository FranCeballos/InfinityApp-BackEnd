const User = require("../models/user.js");
const logger = require("../logger.js");
const bcrypt = require("bcryptjs");
const transporter = require("../utils/mailer.js");
const fetch = (...args) =>
  import("node-fetch").then(({ default: fetch }) => fetch(...args));

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
  const avatarImgPath = avatarImg.path;

  User.findOne({ email: email })
    .then((user) => {
      if (user) {
        req.flash("error", "Email already registered. Use other email.");
        return res.redirect("/register");
      }
      return bcrypt
        .hash(password, 12)
        .then((hashedPassword) => {
          const newUser = new User({
            firstName: body.firstName,
            lastName: body.lastName,
            email: email,
            age: body.age,
            phoneCharacteristic: body.phoneCharacteristic
              .trim()
              .replaceAll("+", ""),
            phone: body.phone,
            country: body.country,
            password: hashedPassword,
            avatar: avatarImgPath,
            cart: { items: [] },
          });
          return newUser.save();
        })
        .then(() => {
          res.redirect("/register-success");
          transporter.sendMail({
            to: process.env.ADMIN_EMAIL,
            from: "shop.company.proyect@gmail.com",
            subject: "New SignUp Registered on Movie Proyect",
            html: `<h1>New SignUp Registered</h1>`,
          });
        });
    })
    .catch((err) => console.log(err));
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

  User.findOne({ email: email })
    .then((user) => {
      if (!user) {
        req.flash("error", "Email and/or password incorrect.");
        res.redirect("/login");
      }
      bcrypt.compare(password, user.password).then((doMatch) => {
        if (doMatch) {
          req.session.user = user;
          req.session.isLoggedIn = true;
          return req.session.save((err) => {
            console.log(err);
            res.redirect("/shop");
          });
        }
        req.flash("error", "Email and/or password incorrect.");
        res.redirect("/login");
      });
    })
    .catch((err) => console.log(err));
};

exports.postLogout = (req, res, next) => {
  logger.info(`${req.method} ${req.originalUrl}`);
  req.session.destroy();
  res.redirect("/shop");
};
