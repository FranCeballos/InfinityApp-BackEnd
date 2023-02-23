const os = require("os");
const logger = require("../logger.js");
const Product = require("../models/Product.js");

const yargs = require("yargs");
const args = yargs.default({
  PORT: 8080,
}).argv;

exports.getProducts = async (req, res) => {
  logger.info(`${req.method} ${req.originalUrl}`);
  Product.readAll((products) => {
    res.render("index");

    const io = req.app.get("socketio");
    io.once("connection", async (socket) => {
      console.log("User connected");
      //TODO
      /* socket.emit("messages", await messagesApi.readAll());

      socket.on("message", async (data) => {
        console.log("Recieved msg:,", data);
        await messagesApi.create(data);
        io.sockets.emit("messages", await messagesApi.readAll());
      }); */

      socket.emit("products", products);
      //TODO
      socket.emit("username", { username: "" });

      socket.on("disconnect", () => {
        console.log("User disconnected");
      });
    });
  });
};

exports.postProducts = async (req, res) => {
  logger.info(`${req.method} ${req.originalUrl}`);
  const info = req.body;
  const newProduct = new Product(
    null,
    info.name,
    info.rating,
    info.hours,
    info.minutes,
    info.year,
    info.strService,
    info.price,
    info.img
  );
  newProduct.save();
  console.log(newProduct);
  res.redirect("/");
};

exports.getInfo = async (req, res) => {
  logger.info(`${req.method} ${req.originalUrl}`);
  res.render("info", {
    processObj: process,
    os,
    args: args,
    pageTitle: "Info",
  });
};
