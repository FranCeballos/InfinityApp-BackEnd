const nodemailer = require("nodemailer");
const sendgridTransport = require("nodemailer-sendgrid-transport");

const transporter = nodemailer.createTransport(
  sendgridTransport({
    auth: {
      api_key:
        "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",
    },
  })
);

module.exports = transporter;
