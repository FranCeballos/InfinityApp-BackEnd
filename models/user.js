const mongoose = require("mongoose");

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
  phoneCharacteristic: {
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
      },
    ],
  },
  orders: [
    {
      orderId: {
        type: mongoose.Types.ObjectId,
        ref: "Order",
        required: true,
      },
    },
  ],
  bought: [
    {
      productId: {
        type: mongoose.Types.ObjectId,
        ref: "Product",
        required: true,
      },
    },
  ],
});

userSchema.methods.addToCart = function (product) {
  const updatedCartItems = [...this.cart.items];
  updatedCartItems.push({
    productId: product._id,
  });

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

userSchema.methods.addOrder = function (orderData) {
  const updatedOrders = [...this.orders];
  const newOrderId = {
    orderId: orderData._id,
  };
  updatedOrders.push(newOrderId);
  this.orders = updatedOrders;
  return this.save();
};

userSchema.methods.addItemsToBought = function () {
  const updatedBought = [...this.bought, ...this.cart.items];
  this.bought = updatedBought;
  return this.save();
};

userSchema.methods.isOwnedById = function (productId) {
  return [...this.bought].some(
    (item) => item.productId.toString() === productId.toString()
  );
};

userSchema.methods.isInCartById = function (productId) {
  return [...this.cart.items].some(
    (item) => item.productId.toString() === productId.toString()
  );
};

userSchema.methods.clearCart = function () {
  this.cart = { items: [] };
  return this.save();
};

module.exports = mongoose.model("User", userSchema);

// 642db02983c6cceda13dd346
