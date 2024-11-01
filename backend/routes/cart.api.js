const express = require("express");
const router = express.Router();
const authController = require("./../controllers/auth.controller");

router.post("/", authController.authenticate, cartController.addItemToCart);

module.exports = router;
