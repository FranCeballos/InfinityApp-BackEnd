"use-strict";

const express = require("express");
const app = express();
const PORT = 8080;
const Files = require("./container/containerFiles");

const movies = new Files("./products.json");

app.get("/products", async (_, res) => {
  const arrProducts = await movies.read();
  res.end(`<p>${JSON.stringify(arrProducts)}</p>`);
});

app.get("/randomProduct", async (_, res) => {
  const arrProducts = await movies.read();
  const randomId = Math.floor(Math.random() * arrProducts.length);
  console.log(randomId);
  res.end(`<p>${JSON.stringify(arrProducts[randomId])}</p>`);
});

const server = app.listen(PORT, () => {
  console.log(`HTTP server listening on port ${server.address().port}`);
});

server.on("error", (error) => console.log(`Error on server: ${error}`));
