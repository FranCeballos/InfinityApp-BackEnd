import { isObjectIdOrHexString } from "mongoose";
import ContainerMongoDb from "../../containers/ContainerMongoDb.js";

class ContainerDaoMongoDb extends ContainerMongoDb {
  constructor() {
    super("products", {
      name: { type: String, required: true },
      rating: { type: String, required: true },
      duration: { type: String, required: true },
      year: { type: Number, required: true },
      strService: { type: String, required: true },
      price: { type: Number, required: true },
      img: { type: String, required: true },
    });
  }
}

export default ContainerDaoMongoDb;
