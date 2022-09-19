const { Schema, model } = require("mongoose");

const userSchema = new Schema({
  name: {
    type: String,
    requires: true,
  },
  username: {
    type: String,
    unique: true,
    required: [true, "Username is required."],
  },
  password: {
    type: String,
    required: [true, "Password is required."],
  },
});

const User = model("User", userSchema);

module.exports = User;
