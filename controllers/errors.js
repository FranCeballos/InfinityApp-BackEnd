// Utils imports
const logger = require("../logger.js");

// CONTROLLERS
exports.getError404 = (req, res) => {
  logger.warn(`${req.method} ${req.originalUrl}`);
  res.render("error404", { path: "/error", pageTitle: "Page Not Found" });
};
