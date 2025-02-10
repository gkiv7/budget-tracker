const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
});

// userSchema.pre("save", async function (next) {
//   const user = this;
//   if (!user.isModified("password")) return next();

//   console.log("Original Password:", user.password);

//   const salt = await bcrypt.genSalt(10);
//   user.password = await bcrypt.hash(user.password, salt);

//   console.log("Hashed password", user.password);
//   next();
// });

const User = mongoose.model("User", userSchema);

module.exports = User;
