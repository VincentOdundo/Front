const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  browsingHistory: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "News",
    },
  ],
  // Add any other fields you need for your users
});

module.exports = mongoose.model("User", UserSchema);
