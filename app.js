// Core imports
const { createServer } = require("http");

// Npm imports
require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const compression = require("compression");
const { Server: ioServer } = require("socket.io");
const session = require("express-session");
const MongoStore = require("connect-mongodb-session")(session);
const csrf = require("csurf");
const flash = require("connect-flash");
const helmet = require("helmet");

// Models imports
const User = require("./models/user.js");

// Utils imports
const logger = require("./logger.js");

// Routers imports
const routerLogIn = require("./routes/auth.js");
const routerAdmin = require("./routes/admin.js");
const routerShop = require("./routes/shop.js");
const controllerErrors = require("./controllers/errors.js");

// APP
const app = express();
const httpServer = createServer(app);
const io = new ioServer(httpServer);
const store = new MongoStore({
  uri: process.env.MONGO_URL,
  collection: "sessions",
});
const csrfProtection = csrf();

//Middleware
app.set("view engine", "ejs");
app.set("views", "./views");
app.set("socketio", io);

app.use(helmet());
app.use(compression());
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(__dirname + "/public"));
app.use("/images", express.static(__dirname + "/images"));
app.use(flash());

// Session
app.use(
  session({
    secret: process.env.SECRET_KEY,
    resave: false,
    saveUninitialized: false,
    store: store,
  })
);
app.use(csrfProtection);

app.use((req, res, next) => {
  res.locals.isAuthenticated = req.session.isLoggedIn;
  res.locals.csrfToken = req.csrfToken();
  const isAdmin = req.session.user?.email === process.env.ADMIN_EMAIL;
  res.locals.isAdmin = isAdmin;
  req.session.isAdmin = isAdmin;
  next();
});

app.use(async (req, res, next) => {
  if (!req.session.user) {
    return next();
  }
  try {
    const user = await User.findById(req.session.user._id);
    req.user = user;
    res.locals.avatarImg = req.user.avatar;
    res.locals.userFirstName = req.user.firstName;
    next();
  } catch (err) {
    next(err);
  }
});

//Routes
app.use(routerLogIn);
app.use("/admin", routerAdmin);
app.use(routerShop);
app.use(controllerErrors.getError404);

app.use((error, req, res, next) => {
  res.status(error.serverStatusCode).render("500", {
    path: "/500",
    pageTitle: "Server Error",
    isAuthenticated: req.session.isLoggedIn,
  });
});

// DB connection and Server StartUp
const PORT = process.env.PORT || 3000;
mongoose
  .connect(process.env.MONGO_URL)
  .then((result) => {
    httpServer.listen(PORT, () => {
      console.log(`MongoDb connected and Server started on Port: ${PORT}`);
      logger.info("Server started");
    });
  })
  .catch((err) => console.log(err));
