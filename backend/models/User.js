const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  uid: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  phone: { type: String },
  addresses: [{ type: String }],
  role: { type: String, enum: ["user", "admin"], default: "user" }
}, { timestamps: true });

module.exports = mongoose.model("User", userSchema);