const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },

  pin: {
    type: String,
    required: true,
    minlength: 4,
    maxlength: 4
  },

  role: {
    type: String,
    enum: ["admin", "staff"],
    required: true
  }
});

module.exports = mongoose.model("User", userSchema);