const express = require("express");
const { Server: HttpServer } = require("http");
const { Server: IOServer } = require("socket.io");
const handlebars = require("express-handlebars");
const bodyParser = require("body-parser");
const Product = require("./containers/classNewProduct");

const ContainerSQL = require("./containers/ContainerSQL.js");

const config = require("./config.js");

const app = express();

//socket and api configuration
const httpServer = new HttpServer(app);
const io = new IOServer(httpServer);

const productsApi = new ContainerSQL(config.mariaDb, "products");
const messagesApi = new ContainerSQL(config.sqlite3, "messages");

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
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

//--------------------------------------------

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
  const products = await productsApi.read();
  console.log(products);
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

  socket.emit("messages", await messagesApi.read());

  socket.on("message", async (data) => {
    const messageData = { socketid: socket.id, message: data };
    messagesApi.create(messageData);
    io.sockets.emit("messages", await messagesApi.read());
  });

  socket.emit("products", await productsApi.read());

  socket.on("disconnect", () => {
    console.log("User disconnected");
  });
});
