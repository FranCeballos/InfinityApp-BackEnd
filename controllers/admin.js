// Core imports
const os = require("os");

// Npm imports
const yargs = require("yargs");
const args = yargs.default({
  PORT: 8080,
}).argv;

//Model imports
const Product = require("../models/product.js");
const Message = require("../models/message.js");

// Utils imports
const logger = require("../logger.js");
const { deleteFile } = require("../utils/file.js");

// CONTROLLERS
exports.getProducts = async (req, res, next) => {
  logger.info(`${req.method} ${req.originalUrl}`);
  try {
    const products = await Product.find({ userId: req.user._id });
    res.render("admin/index", {
      path: "/admin/products",
      pageTitle: "Admin Products",
      name: req.user.firstName,
      products: products,
    });
  } catch (err) {
    console.log(err);
  }
};

exports.getAddProduct = async (req, res, next) => {
  logger.info(`${req.method} ${req.originalUrl}`);
  res.render("admin/edit-product", {
    path: "/admin/products",
    pageTitle: "Add Product",
    editMode: false,
  });
};

exports.postProduct = async (req, res, next) => {
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

  try {
    await product.save();
    return res.redirect("/admin/products");
  } catch (err) {
    console.log(err);
  }
};

exports.getEditProduct = async (req, res, next) => {
  logger.info(`${req.method} ${req.originalUrl}`);
  const productId = req.params.productId;
  const editMode = req.query.edit;
  try {
    const product = await Product.findById(productId);
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

      socket.emit("product", product);

      socket.on("disconnect", () => {
        console.log("User disconnected");
      });
    });
  } catch (err) {
    console.log(err);
  }
};

exports.postEditProduct = async (req, res, next) => {
  logger.info(`${req.method} ${req.originalUrl}`);
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

  try {
    const product = await Product.findById(productId);
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

    await product.save();
    res.redirect("/admin/products");
  } catch (err) {
    console.log(err);
  }
};

exports.postDeleteProduct = async (req, res, next) => {
  logger.info(`${req.method} ${req.originalUrl}`);
  const prodId = req.body.productId;
  try {
    const product = await Product.findById(prodId);
    if (product.userId.toString() !== req.user._id.toString()) {
      return res.redirect("/shop");
    }

    deleteFile(product.img);
    await product.deleteOne({ _id: prodId, userId: req.user._id });
    res.redirect("/admin/products");
  } catch (err) {
    console.log(err);
  }
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

exports.getChat = async (req, res, next) => {
  try {
    res.render("admin/chat", {
      pageTitle: "Chat",
      path: "/chat",
      userId: req.user._id,
    });

    const io = req.app.get("socketio");
    io.once("connection", async (socket) => {
      console.log("User connected");

      socket.emit("messages:read", await Message.find());
      socket.on("messages:answer", async (data) => {
        const question = await Message.findById(data.questionId);
        question.answer = data.answer;
        question.isAnswered = true;
        question.answeredAt = Date.now();
        await question.save();
        console.log(data);
        io.emit("messages:read", await Message.find());
      });

      socket.on("disconnect", () => {
        console.log("User disconnected");
      });
    });
  } catch (err) {
    console.log(err);
  }
};
