const express = require("express");
const router = express.Router();
const {
  getUserExpenses,
  createExpense,
  updateExpense,
  deleteExpense,
} = require("../controllers/dataController");

const authMiddleware = require("../middleware/authMiddleware");

// Routes for user expenses
router.get("/", authMiddleware, getUserExpenses);
router.post("/", authMiddleware, createExpense);
router.put("/:id", authMiddleware, updateExpense);
router.delete("/:id", authMiddleware, deleteExpense);

module.exports = router;
