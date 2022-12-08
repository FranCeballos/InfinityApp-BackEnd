const express = require("express");

const { Router } = express;
const productsRouter = new Router();

// import container class
const containerFiles = require("../containers/containerFiles");
const classProduct = require("../containers/classNewProduct");

// use container class
const ProductsFile = new containerFiles("./db/dbProducts.json");

// funcion Error
function crearErrorNoEsAdmin(ruta, metodo) {
  const error = {
    error: -1,
  };
  if (ruta && metodo) {
    error.descripcion = `ruta '${ruta}' metodo '${metodo}' no autorizado`;
  } else {
    error.descripcion = "no autorizado";
  }
  return error;
}

// middleware for admin
const esAdmin = true;

function soloAdmins(req, res, next) {
  if (!esAdmin) {
    res.json(crearErrorNoEsAdmin(req.url, req.method));
  } else {
    next();
  }
}

// endpoints
productsRouter.get("/", async (req, res) => {
  res.json(await ProductsFile.read());
});

productsRouter.get("/:id", async (req, res) => {
  const id = parseInt(req.params.id);
  res.json((await ProductsFile.readById(id)) || "Product not registered");
});

productsRouter.post("/", soloAdmins, async (req, res) => {
  const info = req.body;
  const newProduct = new classProduct(
    info.name,
    info.rating,
    info.hours,
    info.minutes,
    info.year,
    info.strService,
    info.price,
    info.img
  );
  await ProductsFile.create(newProduct);
  res.redirect("/api/products");
});

productsRouter.put("/:id", soloAdmins, async (req, res) => {
  const info = req.body;
  const id = parseInt(req.params.id);

  await ProductsFile.updateById(id, info);
  res.redirect("/");
});

productsRouter.delete("/:id", soloAdmins, async (req, res) => {
  const id = parseInt(req.params.id);
  res.json(await ProductsFile.deleteById(id));
});

module.exports = productsRouter;
