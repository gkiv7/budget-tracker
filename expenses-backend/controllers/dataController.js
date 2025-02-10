const Expense = require("../models/expenseModel");

// Get all expenses for a user
const getUserExpenses = async (req, res) => {
  try {
    const userId = req.userId; // To userId θα προέρχεται από το token
    const expenses = await Expense.find({ user: userId });
    res.json(expenses);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error fetching user expenses" });
  }
};

// Create a new expense for a user
const createExpense = async (req, res) => {
  try {
    const userId = req.userId;
    const { title, amount, date } = req.body;
    
    if (!title || !amount || !date) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const expense = new Expense({
      title,
      amount,
      date,
      user: userId,
    });

    await expense.save();
    res.status(201).json(expense);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error creating expense" });
  }
};

// Update an existing expense
const updateExpense = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, amount, date } = req.body;

    const updatedExpense = await Expense.findByIdAndUpdate(
      id,
      { title, amount, date },
      { new: true }
    );

    if (!updatedExpense) {
      return res.status(404).json({ message: "Expense not found" });
    }

    res.json(updatedExpense);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error updating expense" });
  }
};

// Delete an expense
const deleteExpense = async (req, res) => {
  try {
    const { id } = req.params;

    const deletedExpense = await Expense.findByIdAndDelete(id);

    if (!deletedExpense) {
      return res.status(404).json({ message: "Expense not found" });
    }

    res.json({ message: "Expense deleted succesfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error deleting expense" });
  }
};

module.exports = {
  getUserExpenses,
  createExpense,
  updateExpense,
  deleteExpense,
};
