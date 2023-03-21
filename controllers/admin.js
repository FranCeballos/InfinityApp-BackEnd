const os = require("os");
const logger = require("../logger.js");
const Product = require("../models/product.js");

const yargs = require("yargs");
const args = yargs.default({
  PORT: 8080,
}).argv;

exports.getProducts = (req, res) => {
  logger.info(`${req.method} ${req.originalUrl}`);
  Product.find().then((products) => {
    res.render("admin/index", {
      path: "/admin/products",
      pageTitle: "Admin Products",
      name: req.user.firstName,
    });

    const io = req.app.get("socketio");
    io.once("connection", (socket) => {
      console.log("User connected");
      //TODO
      /* socket.emit("messages", await messagesApi.readAll());

      socket.on("message", (data) => {
        console.log("Recieved msg:,", data);
        await messagesApi.create(data);
        io.sockets.emit("messages", await messagesApi.readAll());
      }); */

      socket.emit("products", products);

      socket.on("disconnect", () => {
        console.log("User disconnected");
      });
    });
  });
};

exports.postProduct = (req, res) => {
  logger.info(`${req.method} ${req.originalUrl}`);
  const info = req.body;
  const product = new Product({
    name: info.name,
    rating: info.rating,
    duration: `${info.hours}h ${info.minutes}m`,
    year: info.year,
    strService: info.strService,
    price: info.price,
    img: info.img,
  });
  product
    .save()
    .then((result) => {
      return console.log("Product saved");
    })
    .catch((err) => console.log(err));
  res.redirect("/admin/products");
};

exports.postDeleteProduct = (req, res) => {
  const prodId = req.body.productId;
  Product.findByIdAndRemove(prodId)
    .then(() => {
      return res.redirect("/admin/products");
    })
    .catch((err) => console.log(err));
};

exports.getInfo = (req, res) => {
  logger.info(`${req.method} ${req.originalUrl}`);
  res.render("admin/info", {
    processObj: process,
    os,
    args: args,
    pageTitle: "Info",
    path: "/admin/info"
  });
};
