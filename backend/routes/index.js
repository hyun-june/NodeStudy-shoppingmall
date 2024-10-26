const express = require("express");
const router = express.Router();
const userApi = require("./user.api");
const authApi = require("./auth.api");

router.use("/user", userApi);
router.use("/auth", authApi);

module.exports = router;
