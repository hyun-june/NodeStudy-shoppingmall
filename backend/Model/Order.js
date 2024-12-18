const mongoose = require("mongoose");
const User = require("./User.js");
const Product = require("./Product.js");
const Cart = require("./Cart.js");
const Schema = mongoose.Schema;
const orderSchema = Schema(
  {
    shipTo: { type: Object, required: true },
    contact: { type: Object, required: true },
    orderNum: { type: String },
    userId: { type: mongoose.ObjectId, ref: User, required: true },
    status: { type: String, default: "preparing" },
    totalPrice: { type: Number, required: true, default: 0 },
    items: [
      {
        productId: { type: mongoose.ObjectId, ref: Product, required: true },
        size: { type: String, required: true },
        qty: { type: Number, default: 1, required: true },
        price: { type: Number, required: true },
      },
    ],
  },
  { timestamps: true }
);
orderSchema.methods.toJSON = function () {
  const obj = this._doc;
  delete obj.__v;
  delete obj.updatedAt;
  // delete obj.createdAt;
  return obj;
};

orderSchema.post("save", async function () {
  // 카트를 비워주자
  const cart = await Cart.findOne({ userId: this.userId });
  if (cart) {
    cart.items = [];
    await cart.save();
  }
});

const Order = mongoose.model("Order", orderSchema);
module.exports = Order;
