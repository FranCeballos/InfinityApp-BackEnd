import express from "express";
// import session from "express-session";
// import MongoStore from "connect-mongo";
import { generateAuthToken, auth } from "./jwt.js";

import { Server as HttpServer } from "http";
import { Server as IOServer } from "socket.io";
import { faker } from "@faker-js/faker";
import handlebars from "express-handlebars";
import bodyParser from "body-parser";
// import cookieParser from "cookie-parser";

import Product from "./containers/classNewProduct.js";
import ContainerFiles from "./containers/ContainerFiles.js";
import ContainerFilesMsg from "./containers/ContainerFilesMessages.js";

import path from "path";
import { fileURLToPath } from "url";
const __dirname = path.dirname(fileURLToPath(import.meta.url));

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
/* app.use(cookieParser());
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
); */
//--------------------------------------------

const users = [];

let userName = "";

app.get("/", auth, async (req, res) => {
  // res.sendFile(path.resolve(__dirname + "/../public/index.html"));
});

/* -- REGISTER -- */
app.get("/register", async (req, res) => {
  res.sendFile(path.resolve(__dirname + "/../public/register.html"));
});

app.post("/register", async (req, res) => {
  const userInput = req.body;
  const userFound = users.find((user) => user.username === userInput.username);
  if (userFound) {
    return res.status(400).json({ error: "username already exists" });
  }

  if (!userInput.counter) {
    userInput.counter = 0;
  }
  users.push(userInput);
  const access_token = generateAuthToken(userInput.name);
  console.log("users", users);
  res.json({ access_token });
});

app.get("/register-error", async (req, res) => {
  res.sendFile(path.resolve(__dirname + "/../public/failRegister.html"));
});

/* -- LOGIN -- */
app.get("/login", async (req, res) => {
  res.sendFile(path.resolve(__dirname + "/../public/login.html"));
});

app.post("/login", async (req, res) => {
  const { username, password } = req.body;
  const user = users.find((user) => user.username === username);

  if (!user) {
    return res.json({ error: "user not registered" });
  }

  const validCredentials =
    user.username === username && user.password === password;
  if (!validCredentials) {
    return res.json({ error: "invalid username and/or password" });
  }

  user.counter = 0;
  const access_token = generateAuthToken(username);
  res.json({ username, access_token });
});

app.get("/login-error", async (req, res) => {
  res.sendFile(path.resolve(__dirname + "/../public/failLogin.html"));
});

/* -- LOGOUT -- */
app.get("/logout", (req, res) => {
  res.redirect("/login");
});

/* -- DATA -- */
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
