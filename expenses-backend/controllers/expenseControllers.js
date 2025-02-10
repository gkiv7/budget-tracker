const Expense = require("../models/expenseModel");

const getExpenses = async (req, res) => {
  try {
    const userId = req.user._id; // Ανάκτηση του userId από τον authenticated χρήστη
    
    // Λήψη παραμέτρων για σελιδοποίηση από το query string
    const page = parseInt(req.query.page) || 1;  // Προεπιλογή σελίδας 1 αν δεν υπάρχει
    const limit = parseInt(req.query.limit) || 10;  // Προεπιλογή όριο 10 αν δεν υπάρχει
    const skip = (page - 1) * limit;  // Υπολογισμός του αριθμού των εγγραφών που πρέπει να παραλειφθούν

    // Εύρεση των εξόδων με βάση το userId και σελιδοποίηση
    const expenses = await Expense.find({ userId })
      .skip(skip)
      .limit(limit);

    // Υπολογισμός του συνολικού αριθμού εξόδων για τον χρήστη
    const totalExpenses = await Expense.countDocuments({  userId });

    // Επιστροφή των εξόδων και του συνολικού αριθμού
    res.status(200).json({
      totalExpenses,
      expenses,
      currentPage: page,
      totalPages: Math.ceil(totalExpenses / limit),
    });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// POST a new expense
const addExpense = async (req, res) => {
  const { description, amount, category, userId } = req.body;
  const userIdFromToken = req.user._id;
  if (userId !== userIdFromToken.toString()) {
    return res
      .status(403)
      .json({ message: "Not authorized to add this expense" });
  }

  if (!userId) {
    return res.status(400).json({ message: "userId is required" });
  }

  const expense = new Expense({
    description,
    amount,
    category,
    userId,
  });

  try {
    const newExpense = await expense.save();
    console.log(newExpense);

    res.status(201).json(newExpense);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// DELETE an expense
const deleteExpense = async (req, res) => {
  try {
    const expense = await Expense.findById(req.params.id);

    if (!expense) {
      return res.status(404).json({ message: "Expense not found" });
    }

    // Ελέγχουμε αν ο χρήστης είναι ο ιδιοκτήτης της εξόδου
    if (expense.userId.toString() !== req.user._id.toString()) {
      return res
        .status(403)
        .json({ message: "Not authorized to delete this expense" });
    }

    await expense.remove(); // Διαγραφή του εξόδου
    res.status(200).json({ message: "Expense deleted successfully" });
  } catch (err) {
    console.error(err); // Logging του σφάλματος για καλύτερη διάγνωση
    res.status(500).json({ message: "Server error" });
  }
};

const deleteExpenseById = async (req, res) => {
  const { id } = req.params;
  const userId = req.user._id; // Χρησιμοποιούμε το _id από το token

  console.log("User trying to delete: ", userId);

  try {
    const expense = await Expense.findById(id);
    if (!expense) {
      return res.status(404).json({ message: "Expense not found" });
    }

    // Ελέγχουμε αν ο χρήστης είναι ο ιδιοκτήτης της εξόδου
    if (expense.userId.toString() !== userId.toString()) {
      // Συγκρίνουμε ως string για να εξασφαλίσουμε ότι είναι ίδιο
      return res
        .status(403)
        .json({ message: "Not authorized to delete this expense" });
    }

    await Expense.findByIdAndDelete(id); // Διαγραφή του εξόδου
    res.status(200).json({ message: "Expense deleted successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

const getExpenseById = async (req, res) => {
  try {
    const expense = await Expense.findOne({
      _id: req.params.id,
      userId: req.user._id, // Προσθήκη ελέγχου για να ανήκει στον σωστό χρήστη
    });

    if (!expense) {
      return res.status(404).json({ message: "Expense not found" });
    }

    res.status(200).json(expense);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

module.exports = {
  getExpenses,
  addExpense,
  deleteExpense,
  getExpenseById,
  deleteExpenseById,
};
