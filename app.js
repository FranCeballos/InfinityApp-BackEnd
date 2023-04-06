// Core imports
const os = require("os");
const { Server: HttpServer } = require("http");

// Npm imports
require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cluster = require("cluster");
const bodyParser = require("body-parser");
const compression = require("compression");
const { Server: IOServer } = require("socket.io");
const session = require("express-session");
const MongoStore = require("connect-mongodb-session")(session);
const csrf = require("csurf");
const flash = require("connect-flash");
const multer = require("multer");
const {
  fileStorageProductImages,
  fileStorageAvatars,
  fileFilter,
} = require("./utils/multerConfig.js");

const PORT = parseInt(process.argv[2]) || 8080;
const modoCluster = process.argv[3] === "CLUSTER";

// File imports
const logger = require("./logger.js");
const User = require("./models/user.js");

// Routers imports
const routerLogIn = require("./routes/auth.js");
const routerAdmin = require("./routes/admin.js");
const routerShop = require("./routes/shop.js");
const controllerErrors = require("./controllers/errors.js");

//Server, socket and api configuration
if (modoCluster && cluster.isPrimary) {
  const numCPUs = os.cpus().length;

  console.log(`Number of cpus: ${numCPUs}`);
  console.log(`PID MASTER ${process.pid}`);

  for (let i = 0; i < numCPUs; i++) {
    cluster.fork();
  }

  cluster.on("exit", (worker) => {
    console.log(
      `Worker ${worker.process.pid} died ${new Date().toLocaleString()}`
    );
    cluster.fork();
  });
} else {
  const app = express();
  const store = new MongoStore({
    uri: process.env.MONGO_URL,
    collection: "sessions",
  });
  const csrfProtection = csrf();
  const httpServer = new HttpServer(app);
  const io = new IOServer(httpServer);

  //Middleware
  app.set("view engine", "ejs");
  app.set("views", "./views");
  app.set("socketio", io);
  app.use(compression());
  app.use(express.json());
  app.use(bodyParser.urlencoded({ extended: false }));
  app.use(express.static(__dirname + "/public"));
  app.use("/images", express.static(__dirname + "/images"));

  // Sesion
  app.use(
    session({
      secret: process.env.SECRET_KEY,
      resave: false,
      saveUninitialized: false,
      store: store,
    })
  );
  app.use(csrfProtection);
  app.use(flash());

  app.use((req, res, next) => {
    if (!req.session.user) {
      return next();
    }
    User.findById(req.session.user._id)
      .then((user) => {
        req.user = user;
        res.locals.avatarImg = req.user.avatar;
        res.locals.userFirstName = req.user.firstName;
        next();
      })
      .catch((err) => console.log(err));
  });

  app.use((req, res, next) => {
    res.locals.isAuthenticated = req.session.isLoggedIn;
    res.locals.csrfToken = req.csrfToken();
    next();
  });

  //Routes
  app.use(routerLogIn);
  app.use("/admin", routerAdmin);
  app.use(routerShop);
  app.use(controllerErrors.getError404);

  mongoose
    .connect(process.env.MONGO_URL)
    .then((result) => {
      return httpServer.listen(PORT, () => {
        console.log(`MongoDb connected and Server started on Port: ${PORT}`);
        logger.info("Server started");
      });
    })
    .catch((err) => console.log(err));
}
