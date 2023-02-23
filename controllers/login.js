const { generateAuthToken, auth } = require("../jwt.js");
const logger = require("../logger.js");

const users = [];
let userName = "";

exports.getRegister = async (req, res) => {
  logger.info(`${req.method} ${req.originalUrl}`);
  res.render("login/register");
};

exports.postRegister = async (req, res) => {
  logger.info(`${req.method} ${req.originalUrl}`);
  const userInput = req.body;
  const userFound = users.find((user) => user.username === userInput.username);
  if (userFound) {
    return res
      .status(400)
      .render("login/failRegister", { error: "Username already exists" });
  }

  if (!userInput.counter) {
    userInput.counter = 0;
  }
  users.push(userInput);
  const access_token = generateAuthToken(userInput.name);
  console.log("users", users, access_token);
  res.redirect("/register-success");
};

exports.getRegisterSuccess = async (req, res) => {
  logger.info(`${req.method} ${req.originalUrl}`);
  res.render("login/successRegister");
};

exports.getRegisterError = async (req, res) => {
  logger.info(`${req.method} ${req.originalUrl}`);
  res.render("login/failRegister");
};

exports.getLogIn = async (req, res) => {
  logger.info(`${req.method} ${req.originalUrl}`);
  res.render("login/login");
};

exports.postLogIn = async (req, res) => {
  logger.info(`${req.method} ${req.originalUrl}`);
  const { username, password } = req.body;
  const user = users.find((user) => user.username === username);

  if (!user) {
    return res.render("login/failLogin", { error: "User not registered" });
  }

  const validCredentials =
    user.username === username && user.password === password;
  if (!validCredentials) {
    return res.render("login/failLogin", {
      error: "Invalid username and/or password",
    });
  }

  user.counter = 0;
  const access_token = generateAuthToken(username);
  res.json({ username, access_token });
};

exports.getLogInError = async (req, res) => {
  logger.info(`${req.method} ${req.originalUrl}`);
  res.render("login/failLogin");
};

exports.getLogOut = (req, res) => {
  logger.info(`${req.method} ${req.originalUrl}`);
  res.redirect("/login");
};
