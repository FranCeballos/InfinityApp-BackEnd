const fs = require("fs");
const path = require("path");
const logger = require("../logger.js");

const p = path.join(path.dirname(require.main.filename), "DB", "products.json");

const getProductsFromFile = (cb) => {
  fs.readFile(p, (error, data) => {
    if (error) {
      logger.error("Can't get products from file");
      return cb([]);
    }
    return cb(JSON.parse(data));
  });
};

class Products {
  constructor(id, name, rating, hours, minutes, year, strService, price, img) {
    this.id = id;
    this.name = name;
    this.rating = rating;
    this.duration = `${hours}h ${minutes}min`;
    this.year = parseInt(year);
    this.strService = strService;
    this.price = parseInt(price);
    this.img = img;
  }

  save() {
    getProductsFromFile((products) => {
      if (this.id) {
        const existingProductIndex = products.findIndex(
          (prod) => prod.id === this.id
        );
        const updatedProducts = [...products];
        updatedProducts[existingProductIndex] = this;
        fs.writeFile(p, JSON.stringify(updatedProducts), (error) => {
          console.log(error);
        });
      } else {
        this.id = Math.random().toString();
        products.push(this);
        fs.writeFile(p, JSON.stringify(products), (error) => {
          console.log(error);
        });
      }
    });
  }

  static readAll(cb) {
    getProductsFromFile(cb);
  }

  static readOne(id, cb) {
    getProductsFromFile((products) => {
      const prod = products.find((prod) => prod.id === id);
      cb(prod);
    });
  }

  static async deleteOne(id) {
    try {
      const productsArr = await this.readAll();
      const restProducts = productsArr.filter((product) => product.id !== id);
      this.fs.writeFile(this.path, JSON.stringify(restProducts), "utf-8");
      this.products = restProducts;
      console.log("Deleted by ID", this.products);
    } catch (error) {
      logger.error("Can't delete product from file");
    }
  }

  static async deleteAll() {
    try {
      await this.fs.unlink(this.path);
      this.products = [];
      console.log("Deleted All", this.products);
    } catch (error) {
      logger.error("Can't delete products from file");
    }
  }
}

module.exports = Products;
