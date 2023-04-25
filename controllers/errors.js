// Utils imports
const logger = require("../logger.js");

// CONTROLLERS
exports.getError404 = (req, res) => {
  logger.warn(`${req.method} ${req.originalUrl}`);
  res.render("404", { path: "/404", pageTitle: "Page Not Found" });
};
