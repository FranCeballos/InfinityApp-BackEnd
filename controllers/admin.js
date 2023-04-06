const os = require("os");
const logger = require("../logger.js");
const Product = require("../models/product.js");

// Utils
const { deleteFile } = require("../utils/file.js");

const yargs = require("yargs");
const args = yargs.default({
  PORT: 8080,
}).argv;

exports.getProducts = (req, res, next) => {
  logger.info(`${req.method} ${req.originalUrl}`);
  Product.find({ userId: req.user._id }).then((products) => {
    res.render("admin/index", {
      path: "/admin/products",
      pageTitle: "Admin Products",
      name: req.user.firstName,
      products: products,
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

      socket.on("disconnect", () => {
        console.log("User disconnected");
      });
    });
  });
};

exports.getAddProduct = (req, res, next) => {
  res.render("admin/edit-product", {
    path: "/admin/products",
    pageTitle: "Add Product",
    editMode: false,
  });
};

exports.postProduct = (req, res, next) => {
  logger.info(`${req.method} ${req.originalUrl}`);
  const info = req.body;
  const img = req.file;
  const imgPath = img.path;
  const product = new Product({
    name: info.name,
    rating: info.rating,
    duration: `${info.hours}h ${info.minutes}m`,
    year: info.year,
    strService: info.strService,
    price: info.price,
    img: imgPath,
    userId: req.user,
  });
  product
    .save()
    .then((result) => {
      console.log("Product saved");
      return res.redirect("/admin/products");
    })
    .catch((err) => console.log(err));
};

exports.getEditProduct = (req, res, next) => {
  const productId = req.params.productId;
  const editMode = req.query.edit;
  Product.findById(productId)
    .then((product) => {
      if (!product) {
        return res.redirect("/admin/products");
      }
      if (product.userId.toString() !== req.user._id.toString()) {
        return res.redirect("/shop");
      }
      const duration = product.duration;
      const hourDuration = duration.split(" ")[0].replace("h", "");
      const minuteDuration = duration.split(" ")[1].replace("m", "");
      res.render("admin/edit-product", {
        path: "/admin/products",
        pageTitle: "Edit Product",
        product: product,
        editMode: editMode,
        hours: hourDuration,
        minutes: minuteDuration,
      });

      const io = req.app.get("socketio");
      io.once("connection", (socket) => {
        console.log("User connected");

        socket.emit("products", product);

        socket.on("disconnect", () => {
          console.log("User disconnected");
        });
      });
    })
    .catch((err) => console.log(err));
};

exports.postEditProduct = (req, res, next) => {
  const productId = req.params.productId;
  const body = req.body;
  const name = body.name;
  const rating = body.rating;
  const hours = body.hours;
  const minutes = body.minutes;
  const year = body.year;
  const strService = body.strService;
  const img = req.file;
  const imgPath = img?.path;

  Product.findById(productId)
    .then((product) => {
      if (product.userId.toString() !== req.user._id.toString()) {
        return res.redirect("/shop");
      }
      product.name = name;
      product.rating = rating;
      product.duration = `${hours}h ${minutes}m`;
      product.year = year;
      product.strService = strService;
      if (img) {
        deleteFile(product.img);
        product.img = imgPath;
      }
      return product.save().then(() => {
        console.log("Updated product!");
        res.redirect("/admin/products");
      });
    })
    .catch((err) => console.log(err));
};

exports.postDeleteProduct = (req, res, next) => {
  const prodId = req.body.productId;
  Product.findById(prodId)
    .then((product) => {
      if (product.userId.toString() !== req.user._id.toString()) {
        return res.redirect("/shop");
      }
      deleteFile(product.img);
      return product.deleteOne({ _id: prodId, userId: req.user._id });
    })
    .then(() => {
      return res.redirect("/admin/products");
    })
    .catch((err) => console.log(err));
};

exports.getInfo = (req, res, next) => {
  logger.info(`${req.method} ${req.originalUrl}`);
  res.render("admin/info", {
    processObj: process,
    os,
    args: args,
    pageTitle: "Info",
    path: "/admin/info",
  });
};
