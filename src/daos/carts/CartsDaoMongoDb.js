import ContainerMongoDb from "../../containers/ContainerMongoDb.js";

class CartsDaoMongoDb extends ContainerMongoDb {
  constructor() {
    super("carts", {
      products: { type: [], required: true },
    });
  }

  async create(cart = { products: [] }) {
    return super.create(cart);
  }
}

export default CartsDaoMongoDb;
