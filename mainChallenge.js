"use-strict";

////////////// Desafío -> Manejo de Archivos en Javascript //////////////

const fs = require("fs").promises;

class Producto {
  constructor(
    name = null,
    rating = null,
    duration = null,
    year = null,
    strService = null,
    price = null,
    img = null
  ) {
    this.name = name;
    this.rating = rating;
    this.duration = duration;
    this.year = year;
    this.strService = strService;
    this.price = price;
    this.img = img;
  }
}

class Contenedor {
  constructor(path) {
    this.path = path;
    this.products = [];
  }

  async save(product) {
    try {
      const productsStr = await fs.readFile(this.path, "utf-8");
      const productsArr = JSON.parse(productsStr);
      let id;
      productsArr.length === 0
        ? (id = 1)
        : (id = productsArr[productsArr.length - 1].id + 1);
      const newProduct = { ...product, id };
      productsArr.push(newProduct);
      await fs.writeFile(
        this.path,
        JSON.stringify(productsArr, null, 2),
        "utf-8"
      );
      return newProduct.id;
    } catch (err) {
      console.error(err);
    }
  }
  async getById(id) {
    try {
      const productsStr = await fs.readFile(this.path, "utf-8");
      const productsArr = JSON.parse(productsStr);
      const foundProduct = productsArr.find((product) => product.id === id);
      return foundProduct ? foundProduct : null;
    } catch (error) {
      console.log(error);
    }
  }

  async getAll() {
    try {
      const productsStr = await fs.readFile(this.path, "utf-8");
      return JSON.parse(productsStr);
    } catch (error) {
      console.log(error);
    }
  }

  async deleteById(id) {
    try {
      const productsStr = await fs.readFile(this.path, "utf-8");
      const productsArr = JSON.parse(productsStr);
      const restProducts = productsArr.filter((product) => product.id !== id);
      fs.writeFile(this.path, JSON.stringify(restProducts), "utf-8");
    } catch (error) {
      console.log(error);
    }
  }

  async deleteAll() {
    try {
      await fs.writeFile(this.path, "[]", "utf-8");
    } catch (error) {
      console.error(error);
    }
  }
}

async function execute() {
  const producto1 = new Producto("Encanto", "pg", "1:49", 2021, "Disney+", 12);
  const producto2 = new Producto(
    "Lightyear",
    "pg",
    "1:45",
    2022,
    "Disney+",
    12
  );
  const producto3 = new Producto("Soul", "g", "1:40", 2020, "Disney+", 12);
  const producto4 = new Producto("Coco", "g", "1:45", 2017, "Disney+", 12);

  const movies = new Contenedor("./products.json");
  await movies.deleteAll();
  await movies.save(producto1).then((id) => console.log(id));
  await movies.save(producto2).then((id) => console.log(id));
  await movies.save(producto3).then((id) => console.log(id));
  await movies.save(producto4).then((id) => console.log(id));
  await movies.getById(2).then((id) => console.log(id));
  await movies.getAll().then((all) => console.log(all));
  await movies.deleteById(2);
  await movies.getAll().then((all) => console.log(all));
}

execute();
