const { body, check } = require("express-validator");
const User = require("../models/user.js");

exports.validateSignUp = [
  body("firstName", "First Name must have a minimum of 3 characters")
    .isString()
    .isLength({ min: 3 })
    .trim(),
  body("lastName", "Last Name must be have a minimum of 3 characters")
    .isString()
    .isLength({ min: 3 })
    .trim(),
  check("email")
    .isEmail()
    .withMessage("Please enter a valid email.")
    .custom((value, { req }) => {
      return User.findOne({ email: value }).then((userDoc) => {
        if (userDoc) {
          return Promise.reject(
            "E-Mail exists already, please pick a different one."
          );
        }
      });
    })
    .normalizeEmail(),
  body("age", "Enter valid age").isNumeric().notEmpty(),
  body("phoneCharacteristic", "Enter valid Phone Characteristic")
    .isNumeric()
    .notEmpty(),
  body("phone", "Enter valid Phone Number").isMobilePhone().notEmpty(),
  body(
    "password",
    "Please enter a password with only numbers and text and at least 5 characters."
  )
    .isLength({ min: 5 })
    .isAlphanumeric()
    .trim(),
  body("passwordConfirm")
    .trim()
    .custom((value, { req }) => {
      if (value !== req.body.password) {
        throw new Error("Passwords have to match.");
      }
      return true;
    }),
];

exports.validateLogIn = [
  body("email")
    .isEmail()
    .withMessage("Please enter a valid email address.")
    .normalizeEmail(),
  body("password", "Password has to be valid.")
    .isLength({ min: 5 })
    .isAlphanumeric()
    .trim(),
];

exports.validateNewPassword = [
  body("password", "Password has to be valid.")
    .isLength({ min: 5 })
    .isAlphanumeric()
    .trim(),
  body("passwordConfirm")
    .trim()
    .custom((value, { req }) => {
      if (value !== req.body.password) {
        throw new Error("Passwords have to match.");
      }
      return true;
    }),
];

exports.validateAddOrEditProduct = [
  body("name", "Name must be have a minimum of 3 characters")
    .isString()
    .isLength({ min: 3 })
    .trim(),
  body("rating", "Select rating option").notEmpty(),
  body("hours", "Select hours option").notEmpty(),
  body("minutes", "Select minutes option").notEmpty(),
  body("year", "Select year option").notEmpty(),
  body("strService", "Select Streaming Service option").notEmpty(),
  body("price").isFloat(),
  body("img").custom((value, { req }) => {
    if (!req.file) {
      throw new Error("Invalid image extension. Use jpg, jpeg or webp");
    }
    return true;
  }),
];
