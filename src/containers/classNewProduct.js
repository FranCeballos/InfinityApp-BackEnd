"use-strict";

class Product {
  constructor(name, rating, hours, minutes, year, strService, price, img) {
    this.name = name;
    this.rating = rating;
    this.duration = `${hours}h ${minutes}min`;
    this.year = parseInt(year);
    this.strService = strService;
    this.price = parseInt(price);
    this.img = img;
  }
}

module.exports = Product;
