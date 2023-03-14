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
// const cookieParser = require("cookie-parser");
const session = require("express-session");
const passport = require("passport");
// const MongoStore = require("connect-mongo");

const PORT = parseInt(process.argv[2]) || 8080;
const modoCluster = process.argv[3] === "CLUSTER";

// File imports
const logger = require("./logger.js");
const passportConfig = require("./utils/passportConfig.js")(passport);

// Routers imports
const routerLogIn = require("./routes/login.js");
const routerAdmin = require("./routes/admin.js")(passport);
const routerShop = require("./routes/shop.js")(passport);
const routerTests = require("./routes/tests.js");
const controllerErrors = require("./controllers/errors.js");

// const advancedOptions = { useNewUrlParser: true, useUnifiedTopology: true };

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
  const httpServer = new HttpServer(app);
  const io = new IOServer(httpServer);

  //Middleware
  app.set("view engine", "ejs");
  app.set("views", "./views");
  app.set("socketio", io);
  app.use(compression());
  app.use(express.json());
  app.use(bodyParser.urlencoded({ extended: true }));
  app.use(express.static("public"));

  // Sesion
  app.use(
    session({
      secret: process.env.SECRET_KEY,
      resave: false,
      saveUninitialized: true,
    })
  );
  app.use(passport.initialize());
  app.use(passport.session());

  //Routes
  app.use(routerLogIn);
  app.use("/admin", routerAdmin);
  app.use(routerShop);
  app.use("/tests", routerTests);
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
