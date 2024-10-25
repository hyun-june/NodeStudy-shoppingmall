const mongoose = require("mongoose");
const User = requrie("./User.js");
const Product = requrie("./Product.js");
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
  delete obj.updateAt;
  delete obj.createAt;
  return obj;
};

const Order = mongoose.model("Order", orderSchema);
module.exports = Order;
