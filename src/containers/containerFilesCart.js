const containerFiles = require("./containerFiles");
const productFiles = new containerFiles("./db/dbProducts.json");

class Files {
  constructor(path) {
    this.path = path;
    this.carts = [];
    this.fs = require("fs").promises;
  }

  async createCart() {
    this.carts = await this.readCarts();

    let newId = 1;
    const arrayOfIds = this.carts?.map((cart) => cart.id);

    if (arrayOfIds.length) {
      const maxId = Math.max(...arrayOfIds);
      newId = maxId + 1;
    }

    const newCart = {
      id: newId,
      timestamp: Date.now(),
      products: [],
    };

    this.carts.push(newCart);

    try {
      await this.fs.writeFile(
        this.path,
        JSON.stringify(this.carts, null, 2),
        "utf-8"
      );
      console.log(`Cart created`);
      console.log(this.carts);
      return newId;
    } catch (err) {
      console.error(`Error creating cart: ${err}`);
    }
  }

  async addToCartById(id_cart, id_prod) {
    this.carts = await this.readCarts();
    const product = await productFiles.readById(id_prod);

    const cartIndex = this.carts.findIndex((cart) => cart.id === id_cart);
    console.log(cartIndex);
    if (cartIndex !== -1) {
      if (product) {
        this.carts[cartIndex].products?.push(product);
        console.log(
          `Product with ID: ${id_prod} saved in cart ID: ${id_cart}.`
        );
      } else {
        console.log(`Product with ID: ${id_prod} not found!`);
      }
    } else {
      console.log(`Cart with ID: ${id_cart} not found!`);
    }

    try {
      await this.fs.writeFile(
        this.path,
        JSON.stringify(this.carts, null, 2),
        "utf-8"
      );
      console.log(this.carts);
      return product;
    } catch (err) {
      console.error(`Error on save: ${err}`);
    }
  }

  async readProductsInCartById(id) {
    try {
      const cartsArr = await this.readCarts();
      const foundCart = cartsArr.find((cart) => cart.id === id);
      return foundCart ? foundCart.products : null;
    } catch (error) {
      console.log(error);
    }
  }

  async readCarts() {
    try {
      const productsStr = await this.fs.readFile(
        this.path,
        "utf-8",
        (_, data) => {
          return data;
        }
      );
      const productsArr = JSON.parse(productsStr);
      this.carts = productsArr;
      return productsArr;
    } catch (error) {
      console.log(error);
    }
  }

  async deleteCartById(id) {
    try {
      const cartsArr = await this.readCarts();
      const restCarts = cartsArr.filter((cart) => cart.id !== id);
      this.carts = restCarts;
      this.fs.writeFile(this.path, JSON.stringify(restCarts), "utf-8");
      console.log("Cart deleted by ID", this.carts);
    } catch (error) {
      console.log(error);
    }
  }

  async deleteCartProductById(id_cart, id_prod) {
    this.carts = await this.readCarts();

    const cartIndex = this.carts.findIndex((cart) => cart.id === id_cart);
    const prodsInCart = this.carts[cartIndex].products;
    const filteredProducts = prodsInCart.filter((prod) => prod.id !== id_prod);

    this.carts[cartIndex].products = filteredProducts;

    try {
      await this.fs.writeFile(this.path, JSON.stringify(this.carts));
      console.log(this.carts);
      return this.carts;
    } catch (err) {
      console.log(err);
    }
  }

  async deleteAll() {
    try {
      await this.fs.unlink(this.path);
      this.carts = [];
      console.log("Deleted All", this.carts);
    } catch (error) {
      console.error(error);
    }
  }
}

module.exports = Files;
