// Core imports
const path = require("path");
const os = require("os");
const { Server: HttpServer } = require("http");

// Npm imports
const express = require("express");
const cluster = require("cluster");
const bodyParser = require("body-parser");
const compression = require("compression");
const { Server: IOServer } = require("socket.io");
const logger = require("./logger.js");
// const cookieParser = require("cookie-parser");
// const session = require("express-session");
// const MongoStore = require("connect-mongo");

const PORT = parseInt(process.argv[2]) || 8080;
const modoCluster = process.argv[3] === "CLUSTER";

// Routers imports
const routerLogIn = require("./routes/login.js");
const routerAdmin = require("./routes/admin.js");
const routerShop = require("./routes/shop.js");
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
  app.set("view options", { layout: "productTest" });
  app.set("socketio", io);
  app.use(compression());
  app.use(express.json());
  app.use(bodyParser.urlencoded({ extended: true }));
  app.use(express.static("public"));

  //Routes
  app.use(routerLogIn);
  app.use("/admin", routerAdmin);
  app.use(routerShop);
  app.use("/tests", routerTests);
  app.use(controllerErrors.getError404);

  /* app.use(cookieParser());
  app.use(
    session({
      store: MongoStore.create({
        mongoUrl:
          process.env.MONGO_URL,
        mongoOptions: advancedOptions,
      }),
      secret: "secret",
      resave: false,
      saveUninitialized: false,
      cookie: {
        maxAge: 600000,
      },
    })
  ); */

  //--------------------------------------------

  const server = httpServer.listen(PORT, () => {
    console.log(
      `Http server listening on port: ${server.address().port} - PID Worker ${
        process.pid
      }`
    );
    logger.info("Server started");
  });

  server.on("error", (error) => console.log(`Error en servidor ${error}`));
}
