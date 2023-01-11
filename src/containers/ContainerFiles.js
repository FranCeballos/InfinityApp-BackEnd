import fs from "fs";

class ContainerFiles {
  constructor(path) {
    this.path = path;
    this.products = [];
    this.fs = fs.promises;
  }

  async create(product) {
    try {
      this.products = await this.readAll();

      const arrayOfIds = this.products?.map((product) => product.id);
      if (arrayOfIds) {
        const maxId = Math.max(...arrayOfIds);
        product.id = maxId + 1;
      }
      this.products.push(product);

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

  async readOne(id) {
    try {
      const productsArr = await this.readAll();
      const foundProduct = productsArr.find((product) => product.id === id);
      return foundProduct ? foundProduct : null;
    } catch (error) {
      console.log(error);
    }
  }

  async readAll() {
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

  async updateOne(id, obj) {
    try {
      await this.readAll();
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

  async deleteOne(id) {
    try {
      const productsArr = await this.readAll();
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

export default ContainerFiles;
