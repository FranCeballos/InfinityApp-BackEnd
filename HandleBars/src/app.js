const express = require("express");
const handlebars = require("express-handlebars");
const bodyParser = require("body-parser");

const Product = require("../api/classNewProduct");
const Files = require("../api/containerFiles");
const movies = new Files("./src/products.json");

const app = express();

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
  await movies.create(newProduct);
  res.redirect("/");
});

app.get("/products", async (req, res) => {
  const products = await movies.read();
  res.render("main", { list: products });
});

//--------------------------------------------
const PORT = 8070;
const server = app.listen(PORT, () => {
  console.log(`Servidor http escuchando en el puerto ${server.address().port}`);
});
server.on("error", (error) => console.log(`Error en servidor ${error}`));
