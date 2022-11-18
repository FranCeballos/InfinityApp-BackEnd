const express = require("express");

const router = express.Router();

const Product = require("../container/classNewProduct");
const Files = require("../container/containerFiles");
const movies = new Files("./src/products.json");

//routes

router.get("/", async (req, res) => {
  const arrProducts = await movies.read();
  res.json({ arrProducts });
});

router.get("/:id", async (req, res) => {
  const arrProducts = await movies.read();
  const product = arrProducts.find(
    (product) => product.id === parseInt(req.params.id)
  );
  if (!product) {
    res.json({ error: "product not found" });
  }
  res.json({ product });
});

router.post("/", async (req, res) => {
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
  res.json(newProduct);
});

router.put("/:id", async (req, res) => {
  const id = parseInt(req.params.id);
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
  newProduct.id = id;
  await movies.updateById(id, newProduct);
  res.json(newProduct);
});

router.delete("/:id", async (req, res) => {
  const id = parseInt(req.params.id);
  await movies.deleteById(id);
  res.json({ message: `deleted by id: ${id}` });
});

module.exports = router;
