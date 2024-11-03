const express = require("express");
const router = express.Router();
const authController = require("./../controllers/auth.controller");
const cartController = require("./../controllers/cart.controller");

router.post("/", authController.authenticate, cartController.addItemToCart);
router.get("/", authController.authenticate, cartController.getCart);

module.exports = router;
