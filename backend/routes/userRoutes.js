const express = require("express");
const User = require("../models/User");

const router = express.Router();

// Create or Update User
router.post("/", async (req, res) => {
  try {
    const { uid, name, email, phone } = req.body;
    let user = await User.findOne({ uid });
    if (user) {
      if (name) user.name = name;
      if (phone) user.phone = phone;
      await user.save();
      return res.status(200).json(user);
    }
    user = new User({ uid, name, email, phone });
    await user.save();
    res.status(201).json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get User Profile
router.get("/profile", async (req, res) => {
  try {
    const { uid } = req.query;
    const user = await User.findOne({ uid });
    if (!user) return res.status(404).json({ message: "User not found" });
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Update User Address
router.put("/address", async (req, res) => {
  try {
    const { address, uid } = req.body;
    if (!uid) return res.status(400).json({ message: "uid is required" });
    const user = await User.findOne({ uid });
    if (!user) return res.status(404).json({ message: "User not found" });
    if (!user.addresses.includes(address)) {
      user.addresses.push(address);
      await user.save();
    }
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get all users
router.get("/", async (req, res) => {
  try {
    const users = await User.find();
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;