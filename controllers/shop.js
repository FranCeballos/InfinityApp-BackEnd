const logger = require("../logger.js");
const { faker } = require("@faker-js/faker");
const Product = require("../models/product");
const Order = require("../models/order.js");

exports.getProducts = async (req, res) => {
  logger.info(`${req.method} ${req.originalUrl}`);
  Product.find()
    .then((products) => {
      res.render("./shop/products", {
        list: products,
        pageTitle: "View Products",
        path: "/products",
      });
    })
    .catch((err) => console.log(err));
};

exports.getProductDetail = (req, res) => {
  const prodId = req.params.productId;
  Product.findById(prodId)
    .then((prod) => {
      res.render("./shop/product-detail", {
        pageTitle: prod.name,
        path: "/shop/product-detail",
        prod: prod,
        path: "/products",
      });
    })
    .catch((err) => console.log(err));
};

exports.getCart = (req, res) => {
  req.user
    .populate("cart.items.productId")
    .then((user) => {
      const cartProducts = user.cart.items;
      res.render("./shop/cart", {
        pageTitle: "Cart",
        products: cartProducts,
        path: "/cart",
      });
    })
    .catch((err) => console.log(err));
};

exports.postCart = (req, res) => {
  const prodId = req.body.productId;
  Product.findById(prodId)
    .then((product) => {
      return req.user.addToCart(product);
    })
    .then(() => res.redirect("/cart"))
    .catch((err) => console.log(err));
};

exports.postDeleteCartProduct = (req, res) => {
  const prodId = req.body.productId;
  console.log("Post recieved for deleting product from cart");
  req.user
    .deleteFromCart(prodId)
    .then(() => {
      res.redirect("/cart");
    })
    .catch((err) => console.log(err));
};

exports.getOrders = (req, res) => {
  Order.find({ "user.userId": req.user._id })
    .then((orders) => {
      res.render("./shop/orders", {
        pageTitle: "My Orders",
        orders: orders,
        path: "/orders",
      });
    })
    .catch((err) => console.log(err));
};

exports.postOrder = (req, res) => {
  req.user
    .populate("cart.items.productId")
    .then((user) => {
      const products = user.cart.items.map((i) => {
        return {
          quantity: i.quantity,
          product: { ...i.productId._doc },
        };
      });
      const order = new Order({
        user: {
          name: req.user.name,
          userId: req.user,
        },
        products: products,
      });
      return order.save();
    })
    .then((order) => {
      return req.user.clearCart();
    })
    .then(() => {
      return res.redirect("/orders");
    })
    .catch((err) => console.log(err));
};

exports.getProductsTest = async (req, res) => {
  logger.info(`${req.method} ${req.originalUrl}`);
  const products = [];
  for (let i = 1; i <= 5; i++)
    products.push({
      name: faker.commerce.product(),
      rating: "PG",
      duration: `${faker.random.numeric(3)}min`,
      year: faker.datatype.datetime().getFullYear(),
      strService: faker.company.name(),
      price: faker.commerce.price(1, 50),
      img: faker.image.abstract(),
    });
  res.render("products", { list: products, pageTitle: "Products Test" });
};
