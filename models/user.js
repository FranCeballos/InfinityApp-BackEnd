const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const Schema = mongoose.Schema;

const userSchema = new Schema({
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  firstName: {
    type: String,
    required: true,
  },
  lastName: {
    type: String,
    required: true,
  },
  age: {
    type: Number,
    required: true,
  },
  phone: {
    type: Number,
    required: true,
  },
  country: {
    type: String,
    required: true,
  },
  avatar: {
    type: String,
    required: true,
  },
  cart: {
    items: [
      {
        productId: {
          type: mongoose.Types.ObjectId,
          ref: "Product",
          required: true,
        },
        quantity: { type: Number, required: true },
      },
    ],
  },
});

userSchema.pre("save", async function (next) {
  try {
    const user = this;
    if (!user.isModified("password")) next();
    this.password = await bcrypt.hash(
      this.password,
      bcrypt.genSaltSync(10),
      null
    );
    next();
  } catch (error) {
    return next(error);
  }
});

userSchema.methods.isValidPassword = async function (password) {
  try {
    return await bcrypt.compare(password, this.password);
  } catch (error) {
    throw new Error(error);
  }
};

userSchema.methods.addToCart = function (product) {
    const cartProductIndex = this.cart.items.findIndex((cp) => {
      return cp.productId.toString() === product._id.toString();
    });
    let newQuantity = 1;
    const updatedCartItems = [...this.cart.items];
    if (cartProductIndex >= 0) {
      newQuantity = this.cart.items[cartProductIndex].quantity + 1;
      updatedCartItems[cartProductIndex].quantity = newQuantity;
    } else {
      updatedCartItems.push({
        productId: product._id,
        quantity: newQuantity,
      });
    }
    const updatedCart = {
      items: updatedCartItems,
    };
    this.cart = updatedCart;
    return this.save();
  };
  
  userSchema.methods.deleteFromCart = function (prodId) {
    const updatedCartItems = this.cart.items.filter(
      (item) => item.productId.toString() !== prodId.toString()
    );
    this.cart.items = updatedCartItems;
    return this.save();
  };
  
  userSchema.methods.addOrder = function () {
    const updatedOrders = this.orders;
    const order = {
      items: this.cart.items,
      userId: this._id,
    };
    updatedOrders.push(order);
    this.orders = updatedOrders;
    this.cart = { items: [] };
    return this.save();
  };
  
  userSchema.methods.clearCart = function () {
    this.cart = { items: [] };
    return this.save();
  };

module.exports = mongoose.model("User", userSchema);
