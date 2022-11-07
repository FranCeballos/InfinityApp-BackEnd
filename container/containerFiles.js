class Files {
  constructor(path) {
    this.path = path;
    this.products = [];
    this.fs = require("fs").promises;
  }

  async save(product) {
    this.products = await this.read();

    product.id = this.products.length + 1;
    this.products.push(product);

    try {
      await this.fs.writeFile(
        this.path,
        JSON.stringify(products, null, 2),
        "utf-8"
      );
      console.log(`Product saved.`);
      return this.products[-1].id;
    } catch (err) {
      console.error(`Error on save: ${err}`);
    }
  }
  async readById(id) {
    try {
      const productsArr = await this.read();
      const foundProduct = productsArr.find((product) => product.id === id);
      return foundProduct ? foundProduct : null;
    } catch (error) {
      console.log(error);
    }
  }

  async read() {
    try {
      const productsStr = await this.fs.readFile(
        this.path,
        "utf-8",
        (_, data) => {
          return data;
        }
      );
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
      await this.fs.unlink(this.path);
    } catch (error) {
      console.error(error);
    }
  }
}

module.exports = Files;
