// Core imports
const crypto = require("crypto");
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
  renderNewPasswordView,
} = require("../utils/viewRenderer.js");
const { deleteFile } = require("../utils/file.js");
const { next500error } = require("../utils/next500error.js");

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

  const oldInput = {
    firstName,
    lastName,
    email,
    age,
    phoneCharacteristic,
    phone,
    country,
    password,
    passwordConfirm,
  };

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    deleteFile(avatarImgPath);
    return renderSignUpView(
      res,
      422,
      oldInput,
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
    transporter.sendMail({
      to: process.env.ADMIN_EMAIL,
      from: "shop.company.proyect@gmail.com",
      subject: "New SignUp Registered on Movie Proyect",
      html: `<h1>New SignUp Registered</h1>`,
    });
    transporter.sendMail({
      to: newUser.email,
      from: "shop.company.proyect@gmail.com",
      subject: "Welcome to Infinity App",
      html: `
        <h1>Welcome to Infinity App</h1>
        <p>Your account has been successfully created</p>
        <p>Click this <a href="http://localhost:3000/login">link</a> to log in.</p>
        `,
    });
  } catch (err) {
    next500error(next, err);
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
    next500error(next, err);
  }
};

exports.postLogout = async (req, res, next) => {
  logger.info(`${req.method} ${req.originalUrl}`);
  req.session.destroy();
  res.redirect("/shop");
};

exports.getReset = async (req, res, next) => {
  logger.info(`${req.method} ${req.originalUrl}`);
  res.render("login/reset", {
    path: "/reset",
    pageTitle: "Reset Password",
    oldInput: {
      email: "",
    },
    errorMessage: "",
    validationErrors: [],
  });
};

exports.postReset = async (req, res, next) => {
  logger.info(`${req.method} ${req.originalUrl}`);
  crypto.randomBytes(32, async (err, buffer) => {
    try {
      if (err) {
        console.log(err);
        return res.redirect("/reset");
      }
      const token = buffer.toString("hex");
      const emailInput = req.body.email;
      const user = await User.findOne({ email: emailInput });
      if (!user) {
        return res.render("login/reset", {
          path: "/reset",
          pageTitle: "Reset Password",
          oldInput: {
            email: emailInput,
          },
          errorMessage: `No user registered with email "${emailInput}".`,
          validationErrors: [],
        });
      }
      user.resetToken = token;
      user.resetTokenExpiration = Date.now() + 3600000;
      await user.save();
      renderLogInView(
        res,
        202,
        { email: "", password: "" },
        "Email sent for reseting password",
        []
      );
      transporter.sendMail({
        to: emailInput,
        from: "shop.company.proyect@gmail.com",
        subject: "Password Reset",
        html: `
          <h1>Reset your Infinity Password</h1>
          <p>Click this <a href="http://localhost:3000/reset/${token}">link</a> to continue reseting your password.</p>
          `,
      });
    } catch (err) {
      next500error(next, err);
    }
  });
};

exports.getNewPassword = async (req, res, next) => {
  logger.info(`${req.method} ${req.originalUrl}`);
  const token = req.params.token;
  const userWithToken = await User.findOne({
    resetToken: token,
    resetTokenExpiration: { $gt: Date.now() },
  });

  if (!userWithToken) {
    return res.render("login/reset", {
      path: "/reset",
      pageTitle: "Reset Password",
      oldInput: {
        email: "",
      },
      errorMessage: "Token not valid or expired.",
      validationErrors: [],
    });
  }

  renderNewPasswordView(
    res,
    200,
    userWithToken._id.toString(),
    token,
    { password: "", passwordConfirm: "" },
    "",
    []
  );
};

exports.postNewPassword = async (req, res, next) => {
  const newPassword = req.body.password;
  const newPasswordConfirm = req.body.passwordConfirm;
  const userId = req.body.userId;
  const token = req.body.passwordToken;

  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return renderNewPasswordView(
        res,
        422,
        userId,
        token,
        { password: newPassword, passwordConfirm: newPasswordConfirm },
        errors.array()[0].msg,
        errors.array()
      );
    }

    const user = await User.findOne({
      resetToken: token,
      resetTokenExpiration: { $gt: Date.now() },
      _id: userId,
    });
    const hashedPassword = await bcrypt.hash(newPassword, 12);

    user.password = hashedPassword;
    user.resetToken = undefined;
    user.resetTokenExpiration = undefined;
    await user.save();
    renderLogInView(
      res,
      200,
      { email: "", password: "" },
      "Password updated.",
      []
    );
    transporter.sendMail({
      to: user.email,
      from: "shop.company.proyect@gmail.com",
      subject: "Password Updated",
      html: `
        <h1>Your Infinity Password has been updated successfully</h1>
        <p>Click this <a href="http://localhost:3000/login">link</a> to log in with your new password.</p>
        `,
    });
  } catch (err) {
    next500error(next, err);
  }
};
