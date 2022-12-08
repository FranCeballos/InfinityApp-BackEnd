class Files {
  constructor(path) {
    this.path = path;
    this.products = [];
    this.fs = require("fs").promises;
  }

  async create(product) {
    this.products = await this.read();

    const arrayOfIds = this.products?.map((product) => product.id);
    if (arrayOfIds) {
      const maxId = Math.max(...arrayOfIds);
      product.id = maxId + 1;
    }
    this.products.push(product);

    try {
      await this.fs.writeFile(
        this.path,
        JSON.stringify(this.products, null, 2),
        "utf-8"
      );
      console.log(`Product saved.`);
      console.log(this.products);
      return product;
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
      const productsArr = JSON.parse(productsStr);
      this.products = productsArr;
      return productsArr;
    } catch (error) {
      console.log(error);
    }
  }

  async updateById(id, obj) {
    try {
      await this.read();
      const foundProduct = this.products.find((product) => product.id === id);

      if (foundProduct) {
        const filteredProducts = this.products.filter(
          (product) => product.id !== id
        );

        const newProduct = { ...obj, id };
        this.products = [...filteredProducts, newProduct];
        await this.fs.writeFile(
          this.path,
          JSON.stringify(this.products, null, 2),
          "utf-8"
        );
        return newProduct;
      }
    } catch (error) {
      console.log(error);
    }
  }

  async deleteById(id) {
    try {
      const productsArr = await this.read();
      const restProducts = productsArr.filter((product) => product.id !== id);
      this.fs.writeFile(this.path, JSON.stringify(restProducts), "utf-8");
      this.products = restProducts;
      console.log("Deleted by ID", this.products);
    } catch (error) {
      console.log(error);
    }
  }

  async deleteAll() {
    try {
      await this.fs.unlink(this.path);
      this.products = [];
      console.log("Deleted All", this.products);
    } catch (error) {
      console.error(error);
    }
  }
}

module.exports = Files;
