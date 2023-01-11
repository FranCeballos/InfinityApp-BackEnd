import mongoose from "mongoose";
import config from "../config.js";

mongoose.set("strictQuery", false);
await mongoose.connect(config.mongodb.cnxStr, config.mongodb.options);

class ContainerMongoDb {
  constructor(collectionName, schema) {
    this.collection = mongoose.model(collectionName, schema);
  }

  async readOne(id) {
    try {
      return this.collection.find({ id: id });
    } catch (err) {
      console.error(err);
    }
  }

  async readAll() {
    try {
      return this.collection.find({}).lean();
    } catch (err) {
      console.error(err);
    }
  }

  async create(newEl) {
    try {
      console.log(newEl);
      this.collection.insertMany({
        name: newEl.name,
        rating: newEl.rating,
        duration: newEl.duration,
        year: newEl.year,
        strService: newEl.strService,
        price: newEl.price,
        img: newEl.img,
      });
    } catch (err) {
      console.error(err);
    }
  }

  async updateOne(name, newEl) {
    try {
      console.log(newEl);
      this.collection.updateOne(
        { name: name },
        {
          $set: {
            name: newEl.name,
            rating: newEl.rating,
            duration: newEl.duration,
            year: newEl.year,
            strService: newEl.strService,
            price: newEl.price,
            img: newEl.img,
          },
        }
      );
    } catch (err) {
      console.error(err);
    }
  }

  async deleteOne(name) {
    try {
      this.collection.deleteOne({ name: name });
    } catch (err) {
      console.error(err);
    }
  }

  async deleteAll() {
    try {
      this.collection.deleteMany({});
    } catch (err) {
      console.error(err);
    }
  }
}

export default ContainerMongoDb;
