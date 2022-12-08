const express = require("express");

const { Router } = express;
const cartsRouter = new Router();

// import class container
const containerFilesCart = require("../containers/containerFilesCart");

// use container
const CartFile = new containerFilesCart("./db/dbCarts.json");

// endpoints
cartsRouter.post("/", async (req, res) => {
  const cart = await CartFile.createCart();
  const newId = cart[-1];

  res.json({ newCartId: newId });
});

cartsRouter.delete("/:id_cart", async (req, res) => {
  const id = parseInt(req.params.id_cart);

  await CartFile.deleteCartById(id);
});

cartsRouter.get("/:id_cart/products", async (req, res) => {
  const id = parseInt(req.params.id_cart);

  res.json(await CartFile.readProductsInCartById(id));
});

cartsRouter.post("/:id_cart/products/:id_prod", async (req, res) => {
  const cartId = parseInt(req.params.id_cart);
  const productId = parseInt(req.params.id_prod);

  await CartFile.addToCartById(cartId, productId);
});

cartsRouter.delete("/:id_cart/products/:id_prod", async (req, res) => {
  const cartId = parseInt(req.params.id_cart);
  const prodId = parseInt(req.params.id_prod);

  res.json(await CartFile.deleteCartProductById(cartId, prodId));
});

module.exports = cartsRouter;
