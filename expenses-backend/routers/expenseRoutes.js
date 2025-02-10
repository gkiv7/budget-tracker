const express = require("express");
const router = express.Router();
const {
  getExpenses,
  addExpense,
  deleteExpense,
  getExpenseById,
  deleteExpenseById,
} = require("../controllers/expenseControllers");
const verifyToken = require("../middleware/verifyToken");

// GET all expenses (για τον εκάστοτε χρήστη)
router.get("/", verifyToken, getExpenses);
router.get("/:id", verifyToken, getExpenseById);

// POST a new expense
router.post("/", verifyToken, addExpense);

// DELETE an expense
router.delete("/:id", verifyToken, deleteExpenseById);

module.exports = router;
