const mongoose = require("mongoose");
require("dotenv").config();

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 5000, // timeout για σύνδεση
    });
    console.log("MongoDB connected");
  } catch (err) {
    console.log(`Error connecting to MongoDB: ${err.message}`);
    process.exit(1); // Έξοδος αν αποτύχει η σύνδεση
  }
};

module.exports = connectDB;
