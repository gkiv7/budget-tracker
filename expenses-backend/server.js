const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const connectDB = require("./config/db");
const expenseRoutes = require("./routers/expenseRoutes");
const authRoutes = require("./routers/authRoutes");
const dataRoutes = require("./routers/dataRoutes");

dotenv.config();

// Initialize the app
const app = express();

// Middleware
app.use(express.json());
app.use(cors());

// Connect to DB
connectDB();

// Use routes
app.use("/api/expenses", expenseRoutes);

app.use("/api/auth", authRoutes);

app.use("/api/data", dataRoutes);

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port: ${PORT}`);
});
