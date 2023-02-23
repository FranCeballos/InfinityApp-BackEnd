const logger = require("../logger.js");
const { faker } = require("@faker-js/faker");
const Product = require("../models/Product");

exports.getProducts = async (req, res) => {
  logger.info(`${req.method} ${req.originalUrl}`);
  Product.readAll((products) => {
    res.render("products", { list: products, pageTitle: "View Products" });
  });
};

exports.getProductsTest = async (req, res) => {
  logger.info(`${req.method} ${req.originalUrl}`);
  const products = [];
  for (let i = 1; i <= 5; i++)
    products.push({
      name: faker.commerce.product(),
      rating: "PG",
      duration: `${faker.random.numeric(3)}min`,
      year: faker.datatype.datetime().getFullYear(),
      strService: faker.company.name(),
      price: faker.commerce.price(1, 50),
      img: faker.image.abstract(),
    });
  res.render("products", { list: products, pageTitle: "Products Test" });
};
