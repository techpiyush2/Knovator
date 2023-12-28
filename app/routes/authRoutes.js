const express = require("express");
const passport = require("passport");
const authController = require("../controllers/authController");

const router = express.Router();

// Register user
router.post("/register", authController.register);

// Login user
router.post("/login", authController.login);

module.exports = router;
