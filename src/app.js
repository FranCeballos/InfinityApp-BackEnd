import express from "express";
import session from "express-session";
import MongoStore from "connect-mongo";

import { Server as HttpServer } from "http";
import { Server as IOServer } from "socket.io";
import { faker } from "@faker-js/faker";
import handlebars from "express-handlebars";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";

import Product from "./containers/classNewProduct.js";
import ContainerFiles from "./containers/ContainerFiles.js";
import ContainerFilesMsg from "./containers/ContainerFilesMessages.js";

import { dirname } from "path";
import { fileURLToPath } from "url";
const __dirname = dirname(fileURLToPath(import.meta.url));

const productsApi = new ContainerFiles("./DB/products.json");
const messagesApi = new ContainerFilesMsg("./DB/messages.json");
const advancedOptions = { useNewUrlParser: true, useUnifiedTopology: true };

//server, socket and api configuration
const app = express();
const httpServer = new HttpServer(app);
const io = new IOServer(httpServer);

//Set engine
app.engine(
  "hbs",
  handlebars.engine({
    extname: ".hbs",
    defaultLayout: "index.hbs",
    layoutsDir: __dirname + "/views/layouts/",
    partialsDir: __dirname + "/views/partials/",
  })
);

//middleware
app.set("view engine", "hbs");
app.set("views", "./views");
app.set("view options", { layout: "productTest" });
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));
app.use(cookieParser());
app.use(
  session({
    store: MongoStore.create({
      mongoUrl:
        "mongodb+srv://FranCeballos:asd456@cluster0.avhkc47.mongodb.net/?retryWrites=true&w=majority",
      mongoOptions: advancedOptions,
    }),
    secret: "secret",
    resave: false,
    saveUninitialized: false,
    cookie: {
      maxAge: 600000,
    },
  })
);

// auth middleware
function auth(req, res, next) {
  if (req.session?.user === "coderhouse" && req.session?.admin) {
    return next();
  }
  return res.redirect("/login");
}
//--------------------------------------------

let userName = "";

app.get("/", async (req, res) => {
  res.sendFile(path.join(__dirname + "index.html"));
});

app.get("/login", async (req, res) => {
  res.render("login");
});

app.post("/login", async (req, res) => {
  const { username } = req.body;
  userName = username;
  // if (username !== "coderhouse") return res.send("Login failed.");
  req.session.user = username;
  req.session.admin = true;
  console.log("User on session:", req.session.user);
  res.redirect("/");
});

app.get("/logout", (req, res) => {
  req.session.destroy((err) => {
    if (err) return res.json({ status: "Logout ERROR", body: err });
  });
  res.redirect("/login");
});

app.post("/products", async (req, res) => {
  const info = req.body;
  const newProduct = new Product(
    info.name,
    info.rating,
    info.hours,
    info.minutes,
    info.year,
    info.strService,
    info.price,
    info.img
  );
  console.log(newProduct);
  await productsApi.create(newProduct);
  res.redirect("/");
});

app.get("/products", async (req, res) => {
  const products = await productsApi.readAll();
  console.log(products);
  res.render("main", { list: products });
});

app.get("/products-test", async (req, res) => {
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
  res.render("main", { list: products });
});
//--------------------------------------------

const PORT = 8070;
const server = httpServer.listen(PORT, () => {
  console.log(`Servidor http escuchando en el puerto ${server.address().port}`);
});

server.on("error", (error) => console.log(`Error en servidor ${error}`));

io.on("connection", async (socket) => {
  console.log("User connected");

  socket.emit("messages", await messagesApi.readAll());

  socket.on("message", async (data) => {
    console.log("Recieved msg:,", data);
    await messagesApi.create(data);
    io.sockets.emit("messages", await messagesApi.readAll());
  });

  socket.emit("products", await productsApi.readAll());

  socket.emit("username", { username: userName });

  socket.on("disconnect", () => {
    console.log("User disconnected");
  });
});
