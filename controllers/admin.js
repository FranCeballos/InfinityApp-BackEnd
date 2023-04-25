// Core imports
const os = require("os");

// Npm imports
const yargs = require("yargs");
const args = yargs.default({
  PORT: 8080,
}).argv;
const { validationResult } = require("express-validator");

//Model imports
const Product = require("../models/product.js");
const Message = require("../models/message.js");

// Utils imports
const logger = require("../logger.js");
const { deleteFile } = require("../utils/file.js");
const { renderAddOrEditProductView } = require("../utils/viewRenderer.js");
const { next500error } = require("../utils/next500error.js");

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
    next500error(next, err);
  }
};

exports.getAddProduct = async (req, res, next) => {
  logger.info(`${req.method} ${req.originalUrl}`);
  renderAddOrEditProductView(
    res,
    200,
    {},
    {
      name: "",
      rating: "",
      hours: "",
      minutes: "",
      year: "",
      strService: "",
      price: "",
    },
    "",
    [],
    false
  );
};

exports.postProduct = async (req, res, next) => {
  logger.info(`${req.method} ${req.originalUrl}`);
  const body = req.body;
  const name = body.name;
  const rating = body.rating;
  const hours = body.hours;
  const minutes = body.minutes;
  const year = body.year;
  const strService = body.strService;
  const price = body.price;
  const img = req.file;
  const imgPath = img?.path;

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return renderAddOrEditProductView(
      res,
      422,
      {},
      {
        name,
        rating,
        hours,
        minutes,
        year,
        strService,
        price,
      },
      errors.array()[0].msg,
      errors.array(),
      false
    );
  }

  const product = new Product({
    name: name,
    rating: rating,
    duration: `${hours}h ${minutes}m`,
    year: year,
    strService: strService,
    price: price,
    img: imgPath,
    userId: req.user,
  });

  try {
    await product.save();
    return res.redirect("/admin/products");
  } catch (err) {
    next500error(next, err);
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

    renderAddOrEditProductView(
      res,
      200,
      product,
      {
        name: "",
        rating: "",
        hours: "",
        minutes: "",
        year: "",
        strService: "",
        price: "",
      },
      "",
      [],
      editMode
    );

    const io = req.app.get("socketio");
    io.once("connection", (socket) => {
      console.log("User connected");

      socket.emit("product", product);

      socket.on("disconnect", () => {
        console.log("User disconnected");
      });
    });
  } catch (err) {
    next500error(next, err);
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
    next500error(next, err);
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
    next500error(next, err);
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
    next500error(next, err);
  }
};
