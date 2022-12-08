const express = require("express");

const productsRouter = require("./routers/products.Router");
const cartsRouter = require("./routers/cart.Router");
//--------------------------------------------

const app = express();

//--------------------------------------------

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));

app.use("/api/products", productsRouter);
app.use("/api/carts", cartsRouter);

app.get("/", function (req, res) {});
app.get("*", function (req, res) {
  res.send({
    status: "error",
    description: `Route ${req.url} method ${req.method} not implemented`,
  });
});

module.exports = app;
