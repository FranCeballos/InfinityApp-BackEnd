const express = require("express");
const { fork } = require("child_process");

const router = express.Router();

router.get("/generate-randoms", (req, res) => {
  const amount = Number(req.query.amount);
  const forked = fork("./src/scripts/generateRandoms.js", [amount]);
  forked.send("start");
  forked.on("message", (data) => {
    res.render("randomInput", {
      pageTitle: "Generate Random Numbers",
      numObj: data,
    });
  });
});

router.post("/generate-randoms", (req, res) => {
  const amountOfNum = Number(req.body.amount);
  res.redirect(`/api/generate-randoms?amount=${amountOfNum}`);
});

module.exports = router;
