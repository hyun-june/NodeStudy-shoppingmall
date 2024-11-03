const express = require("express");
const router = express.Router();
const authController = require("./../controllers/auth.controller");
const cartController = require("./../controllers/cart.controller");

router.post("/", authController.authenticate, cartController.addItemToCart);
router.get("/", authController.authenticate, cartController.getCart);
router.delete(
  "/:id",
  authController.authenticate,
  cartController.deleteCartItem
);
router.get("/qty", authController.authenticate, cartController.getCartQty);
router.put("/:id", authController.authenticate, cartController.editCartItem);

module.exports = router;
