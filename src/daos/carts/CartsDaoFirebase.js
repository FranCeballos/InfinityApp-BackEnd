import ContainerFirebase from "../../containers/ContainerFirebase.js";

class CartsDaoFirebase extends ContainerFirebase {
  constructor() {
    super("carts");
  }

  async create(cart = { products: [] }) {
    await super.create(cart);
  }
}

export default CartsDaoFirebase;
