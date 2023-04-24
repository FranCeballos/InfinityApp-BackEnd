// Core imports

// Npm imports
const bcrypt = require("bcryptjs");
const { validationResult } = require("express-validator");

// Model imports
const User = require("../models/user.js");

// Utils imports
const logger = require("../logger.js");
const transporter = require("../utils/mailer.js");
const {
  renderSignUpView,
  renderLogInView,
} = require("../utils/viewRenderer.js");

// CONTROLLERS
exports.getRegister = async (req, res, next) => {
  logger.info(`${req.method} ${req.originalUrl}`);
  renderSignUpView(
    res,
    200,
    {
      firstName: "",
      lastName: "",
      email: "",
      age: "",
      phoneCharacteristic: "",
      phone: "",
      country: "",
      password: "",
      passwordConfirm: "",
    },
    req.flash("error"),
    []
  );
};

exports.postRegister = async (req, res, next) => {
  logger.info(`${req.method} ${req.originalUrl}`);
  const body = req.body;
  const firstName = body.firstName;
  const lastName = body.lastName;
  const email = body.email;
  const age = body.age;
  const phoneCharacteristic = body.phoneCharacteristic;
  const phone = body.phone;
  const country = body.country;
  const password = body.password;
  const passwordConfirm = body.passwordConfirm;
  const avatarImg = req.file;
  const avatarImgPath = avatarImg?.path;

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return renderSignUpView(
      res,
      422,
      {
        firstName,
        lastName,
        email,
        age,
        phoneCharacteristic,
        phone,
        country,
        password,
        passwordConfirm,
      },
      errors.array()[0].msg,
      errors.array()
    );
  }
  try {
    const user = await User.findOne({ email: email });

    if (user) {
      return renderSignUpView(
        res,
        409,
        {
          firstName,
          lastName,
          email,
          age,
          phoneCharacteristic,
          phone,
          country,
          password,
          passwordConfirm,
        },
        "Email already registered. Use other email.",
        []
      );
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

  renderLogInView(
    res,
    200,
    { email: "", password: "" },
    req.flash("error"),
    []
  );
};

exports.postLogIn = async (req, res, next) => {
  logger.info(`${req.method} ${req.originalUrl}`);
  const email = req.body.email;
  const password = req.body.password;

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return renderLogInView(
      res,
      422,
      {
        email,
        password,
      },
      errors.array()[0].msg,
      errors.array()
    );
  }

  try {
    const user = await User.findOne({ email: email });
    if (!user) {
      return renderLogInView(
        res,
        401,
        { email, password },
        "Invalid email and/or password",
        errors.array()
      );
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

    return renderLogInView(
      res,
      401,
      { email, password },
      "Invalid email and/or password",
      errors.array()
    );
  } catch (err) {
    console.log(err);
  }
};

exports.postLogout = async (req, res, next) => {
  logger.info(`${req.method} ${req.originalUrl}`);
  req.session.destroy();
  res.redirect("/shop");
};
