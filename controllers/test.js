const logger = require("../logger.js");

exports.getGenerateRandom = (req, res) => {
  logger.info(`${req.method} ${req.originalUrl}`);
  const amount = Number(req.query.amount);
  const forked = fork("./src/scripts/generateRandoms.js", [amount]);
  forked.send("start");
  forked.on("message", (data) => {
    res.render("randomInput", {
      pageTitle: "Generate Random Numbers",
      numObj: data,
    });
  });
};

exports.postGenerateRandoms = (req, res) => {
  logger.info(`${req.method} ${req.originalUrl}`);
  const amountOfNum = Number(req.body.amount);
  res.redirect(`/api/generate-randoms?amount=${amountOfNum}`);
};
