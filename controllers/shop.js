const logger = require("../logger.js");
const Product = require("../models/product");
const Order = require("../models/order.js");
const transporter = require("../utils/mailer.js");

// Twilio
const client = require("twilio")(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);

exports.getProducts = async (req, res) => {
  logger.info(`${req.method} ${req.originalUrl}`);
  Product.find()
    .then((products) => {
      res.render("shop/products", {
        list: products,
        pageTitle: "Shop",
        path: "/products",
      });
    })
    .catch((err) => console.log(err));
};

exports.getProductDetail = (req, res) => {
  const prodId = req.params.productId;
  Product.findById(prodId)
    .then((prod) => {
      res.render("shop/product-detail", {
        pageTitle: prod.name,
        path: "/shop/product-detail",
        item: prod,
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
      res.render("shop/cart", {
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
      res.render("shop/orders", {
        pageTitle: "My Orders",
        orders: orders,
        path: "/orders",
      });
    })
    .catch((err) => console.log(err));
};

exports.postOrder = (req, res) => {
  let orderProducts = [];
  req.user
    .populate("cart.items.productId")
    .then((user) => {
      const products = user.cart.items.map((i) => {
        return {
          quantity: i.quantity,
          product: { ...i.productId._doc },
        };
      });
      orderProducts = [...products];
      const order = new Order({
        user: {
          name: req.user.firstName,
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
    .then(() => {
      const productList = orderProducts
        .map((i) => {
          return `<li>${i.product.name} (${i.quantity})</li>`;
        })
        .join("");
      const html = `<h1>New order from:</h1>
      <p>Name: ${req.user.firstName}</p>
      <p>Email: ${req.user.email}</p>
      <ul>
      ${productList}</ul>`;
      return transporter.sendMail({
        to: process.env.ADMIN_EMAIL,
        from: "shop.company.proyect@gmail.com",
        subject: "New order on Movie Proyect",
        html: html,
      });
    })
    .then(() => {
      const productList = orderProducts
        .map((i) => {
          return `- ${i.product.name} (${i.quantity})`;
        })
        .join(" ");
      const body = `Your order from Movies & Series has been confirmed:
                    User information:
                    - Name: ${req.user.firstName}
                    - Email: ${req.user.email}
                    
                    Details:
                    ${productList}`;
      return client.messages
        .create({
          body: body,
          from: "whatsapp:+14155238886",
          to: `whatsapp:+${req.user.phoneCharacteristic}9${req.user.phone}`,
        })
        .then((message) => console.log(message.sid));
    })
    .catch((err) => console.log(err));
};

exports.getProductsByCategory = async (req, res) => {
  const categoryParam = req.params.categoryName;
  let categoryName = "";
  let categoryImagePath = "";

  switch (categoryParam) {
    case "disney+":
      categoryName = "Disney+";
      categoryImagePath = "/images/categories/disney-hero.webp";
      break;
    case "netflix":
      categoryName = "Netflix";
      categoryImagePath = "/images/categories/netflix-hero.webp";
      break;
    case "hbomax":
      categoryName = "HBO Max";
      categoryImagePath = "/images/categories/hbomax-hero.webp";
      break;
    case "primevideo":
      categoryName = "Prime Video";
      categoryImagePath = "/images/categories/primevideo-hero.webp";
      break;
    case "paramount+":
      categoryName = "Paramount+";
      categoryImagePath = "/images/categories/paramount-hero.webp";
      break;
    default:
      categoryName = categoryParam;
  }

  Product.find({ strService: categoryName })
    .then((products) => {
      res.render(`shop/productsCategory`, {
        list: products,
        pageTitle: categoryName,
        productCategory: categoryName,
        heroImagePath: categoryImagePath,
        path: "/products",
      });
    })
    .catch((err) => console.log(err));
};
