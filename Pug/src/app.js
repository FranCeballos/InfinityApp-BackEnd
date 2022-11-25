const express = require("express");
const bodyParser = require("body-parser");

const Product = require("../api/classNewProduct");
const Files = require("../api/containerFiles");
const movies = new Files("./src/products.json");

const app = express();

//middleware
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));
app.set("view engine", "pug");
app.set("views", "./views");

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
  await movies.create(newProduct);
  res.redirect("/");
});

app.get("/products", async (req, res) => {
  const products = await movies.read();
  res.render("main", { list: products });
});

//--------------------------------------------
const PORT = 8060;
const server = app.listen(PORT, () => {
  console.log(`Servidor http escuchando en el puerto ${server.address().port}`);
});
server.on("error", (error) => console.log(`Error en servidor ${error}`));
