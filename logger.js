const pino = require("pino");
const fs = require("fs");

const levels = {
  fatal: 60,
  error: 50,
  warn: 40,
  info: 30,
  debug: 20,
  trace: 10,
};

const streams = Object.keys(levels).map((level) => {
  return {
    level: level,
    stream: fs.createWriteStream(`${__dirname}/logs/app-${level}.log`),
  };
});

module.exports = pino(
  { level: "trace" },
  pino.multistream(streams, {
    levels,
    dedupe: true,
  })
);
