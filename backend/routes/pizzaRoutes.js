const express = require("express");
const Pizza = require("../models/Pizza");
const { protect, admin } = require("../middleware/authMiddleware");

const router = express.Router();

// GET ALL PIZZAS
router.get("/", async (req, res) => {
  try {
    const pizzas = await Pizza.find();
    res.json(pizzas);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// GET SINGLE PIZZA
router.get("/:id", async (req, res) => {
  try {
    const pizza = await Pizza.findById(req.params.id);

    if (!pizza) {
      return res.status(404).json({ message: "Pizza not found" });
    }

    res.json(pizza);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// CREATE PIZZA
router.post("/", protect, admin, async (req, res) => {
  try {
    const { name } = req.body;
    if (!name) {
      return res.status(400).json({ message: "Pizza name is required" });
    }
    
    // Case-insensitive check to prevent duplicate pizza names
    const existingPizza = await Pizza.findOne({ 
      name: { $regex: new RegExp("^" + name.trim() + "$", "i") } 
    });
    
    if (existingPizza) {
      return res.status(400).json({ message: "A pizza with this name already exists!" });
    }

    const pizza = new Pizza(req.body);
    const savedPizza = await pizza.save();

    res.status(201).json(savedPizza);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// UPDATE PIZZA
router.put("/:id", protect, admin, async (req, res) => {
  try {
    const pizza = await Pizza.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    res.json(pizza);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// DELETE PIZZA
router.delete("/:id", protect, admin, async (req, res) => {
  try {
    await Pizza.findByIdAndDelete(req.params.id);

    res.json({ message: "Pizza deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// CLEANUP DUPLICATE PIZZAS (keeps first occurrence of each unique name)
router.post("/cleanup", protect, admin, async (req, res) => {
  try {
    const pizzas = await Pizza.find();
    const seen = new Set();
    const duplicateIds = [];

    for (const pizza of pizzas) {
      if (!pizza.name) continue;
      const normalized = pizza.name.trim().toLowerCase();
      if (seen.has(normalized)) {
        duplicateIds.push(pizza._id);
      } else {
        seen.add(normalized);
      }
    }

    if (duplicateIds.length > 0) {
      await Pizza.deleteMany({ _id: { $in: duplicateIds } });
      res.json({ message: `Successfully removed ${duplicateIds.length} duplicate pizzas!` });
    } else {
      res.json({ message: "No duplicates found. Database is already clean!" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;