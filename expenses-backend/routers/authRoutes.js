const express = require("express");
const router = express.Router();
const { signUp, login } = require("../controllers/authController");

// Route for SignUp
router.post("/signup", signUp);

// Route for Login
router.post("/login", login);

module.exports = router;
