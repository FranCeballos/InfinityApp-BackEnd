// Core imports

// Npm imports
const client = require("twilio")(
  process.env.TWILIO_ACCOUNT_SID,
  process.env.TWILIO_AUTH_TOKEN
);

// Models imports
const Product = require("../models/product");
const Order = require("../models/order.js");
const Message = require("../models/message.js");

// Utils imports
const logger = require("../logger.js");
const transporter = require("../utils/mailer.js");

// CONTROLLERS
exports.getHome = (req, res, next) => {
  logger.info(`${req.method} ${req.originalUrl}`);
  if (req.user) {
    return res.redirect("/shop");
  }
  res.redirect("/login");
};

exports.getProducts = async (req, res, next) => {
  logger.info(`${req.method} ${req.originalUrl}`);
  try {
    const products = await Product.find();
    res.render("shop/products", {
      list: products,
      pageTitle: "Shop",
      path: "/products",
    });
  } catch (err) {
    console.log(err);
  }
};

exports.getProductDetail = async (req, res, next) => {
  logger.info(`${req.method} ${req.originalUrl}`);
  const prodId = req.params.productId;
  try {
    const isOwned = req.user.isOwnedById(prodId);
    const isInCart = req.user.isInCartById(prodId);
    const product = await Product.findById(prodId);
    res.render("shop/product-detail", {
      pageTitle: product.name,
      path: "/shop/product-detail",
      item: product,
      path: "/products",
      isOwned: isOwned,
      isInCart: isInCart,
    });
  } catch (err) {
    console.log(err);
  }
};

exports.getCart = async (req, res, next) => {
  logger.info(`${req.method} ${req.originalUrl}`);
  try {
    const user = await req.user.populate("cart.items.productId");
    const cartProducts = user.cart.items;
    res.render("shop/cart", {
      pageTitle: "Cart",
      products: cartProducts,
      path: "/cart",
    });
  } catch (err) {
    console.log(err);
  }
};

exports.postCart = async (req, res, next) => {
  logger.info(`${req.method} ${req.originalUrl}`);
  const prodId = req.body.productId;
  const isOwned = req.user.isOwnedById(prodId);
  const isInCart = req.user.isInCartById(prodId);
  try {
    if (!isOwned && !isInCart) {
      const product = await Product.findById(prodId);
      await req.user.addToCart(product);
    }
    res.redirect("/cart");
  } catch (err) {
    console.log(err);
  }
};

exports.postDeleteCartProduct = async (req, res, next) => {
  logger.info(`${req.method} ${req.originalUrl}`);
  const prodId = req.body.productId;
  const isOwned = req.user.isOwnedById(prodId);
  const isInCart = req.user.isInCartById(prodId);
  try {
    if (!isOwned && isInCart) {
      await req.user.deleteFromCart(prodId);
    }
    res.redirect("/cart");
  } catch (err) {
    console.log(err);
  }
};

exports.getOrders = async (req, res, next) => {
  logger.info(`${req.method} ${req.originalUrl}`);
  try {
    const orders = await Order.find({ "user.userId": req.user._id });
    res.render("shop/orders", {
      pageTitle: "My Orders",
      orders: orders,
      path: "/orders",
    });
  } catch (err) {
    console.log(err);
  }
};

exports.postOrder = async (req, res, next) => {
  logger.info(`${req.method} ${req.originalUrl}`);
  let orderProducts = [];
  try {
    const user = await req.user.populate("cart.items.productId");
    const products = user.cart.items.map((i) => {
      return {
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
    const newOrder = await order.save();
    await req.user.addOrder(newOrder);
    await req.user.addItemsToBought();
    await req.user.clearCart();

    res.redirect("/orders");

    const productListMail = orderProducts
      .map((i) => {
        return `<li>${i.product.name} (${i.quantity})</li>`;
      })
      .join("");
    const html = `<h1>New order from:</h1>
        <p>Name: ${req.user.firstName}</p>
        <p>Email: ${req.user.email}</p>
        <ul>
        ${productListMail}</ul>`;
    await transporter.sendMail({
      to: process.env.ADMIN_EMAIL,
      from: "shop.company.proyect@gmail.com",
      subject: "New order on Movie Proyect",
      html: html,
    });

    const productListWhatsApp = orderProducts
      .map((i) => {
        return `- ${i.product.name} (${i.quantity})`;
      })
      .join(" ");
    const body = `Your order from Movies & Series has been confirmed:
                      User information:
                      - Name: ${req.user.firstName}
                      - Email: ${req.user.email}
                      
                      Details:
                      ${productListWhatsApp}`;

    await client.messages
      .create({
        body: body,
        from: "whatsapp:+14155238886",
        to: `whatsapp:+${req.user.phoneCharacteristic}9${req.user.phone}`,
      })
      .then((message) => console.log(message.sid));
  } catch (err) {
    console.log(err);
  }
};

exports.getProductsByCategory = async (req, res, next) => {
  logger.info(`${req.method} ${req.originalUrl}`);
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

  try {
    const products = await Product.find({ strService: categoryName });
    res.render(`shop/productsCategory`, {
      list: products,
      pageTitle: categoryName,
      productCategory: categoryName,
      heroImagePath: categoryImagePath,
      path: "/products",
    });
  } catch (err) {
    console.log(err);
  }
};

exports.getChat = async (req, res, next) => {
  logger.info(`${req.method} ${req.originalUrl}`);
  try {
    res.render("shop/chat", {
      pageTitle: "Chat",
      path: "/chat",
      userId: req.user._id,
    });

    const io = req.app.get("socketio");
    io.once("connection", async (socket) => {
      console.log("User connected");

      socket.emit(
        "messages:read",
        await Message.find({ userId: req.user._id }).limit(50)
      );
      socket.on("messages:create", async (data) => {
        console.log(data);

        const newMessage = new Message({
          userId: req.user._id,
          name: req.user.firstName,
          email: req.user.email,
          question: data.question,
          answer: "Not answered",
          isAnswered: false,
          answeredAt: Date.now(),
        });
        await newMessage.save();

        io.emit(
          "messages:read",
          await Message.find({ userId: req.user._id }).limit(50)
        );
      });

      socket.on("disconnect", () => {
        console.log("User disconnected");
      });
    });
  } catch (err) {
    console.log(err);
  }
};
