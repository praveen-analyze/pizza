const express = require("express");
const Razorpay = require("razorpay");
const crypto = require("crypto");

const Order = require("../models/Order");

const verifyFirebaseToken = require("../middleware/verifyFirebaseToken");
const isAdmin = require("../middleware/isAdmin");

const router = express.Router();

// Initialize Razorpay
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

// CREATE RAZORPAY ORDER
router.post("/create-razorpay-order", verifyFirebaseToken, async (req, res) => {
  try {
    const { amount } = req.body;
    if (!amount) return res.status(400).json({ message: "Amount is required" });

    const options = {
      amount: amount * 100,
      currency: "INR",
      receipt: `receipt_order_${Date.now()}`,
    };

    const order = await razorpay.orders.create(options);
    res.status(200).json(order);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Failed to create Razorpay order" });
  }
});

// VERIFY RAZORPAY PAYMENT
router.post("/verify-razorpay-payment", verifyFirebaseToken, async (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

    const body = razorpay_order_id + "|" + razorpay_payment_id;
    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET || "dummySecret1234567890abc")
      .update(body.toString())
      .digest("hex");

    const isAuthentic = expectedSignature === razorpay_signature;

    if (isAuthentic) {
      res.status(200).json({ message: "Payment verified successfully" });
    } else {
      res.status(400).json({ message: "Invalid payment signature" });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Verification failed" });
  }
});

// CREATE ORDER — no token required (works for both COD and Razorpay)
router.post("/", async (req, res) => {
  try {
    const order = new Order(req.body);
    const savedOrder = await order.save();
    res.status(201).json(savedOrder);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// GET ALL ORDERS (ADMIN)
router.get("/", verifyFirebaseToken, isAdmin, async (req, res) => {
  try {
    const orders = await Order.find().populate("items");
    res.status(200).json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// GET MY ORDERS
router.get("/my/:customerId", verifyFirebaseToken, async (req, res) => {
  try {
    const orders = await Order.find({
      customerId: req.params.customerId,
    }).populate("items");
    res.status(200).json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// UPDATE STATUS (ADMIN)
router.put("/:id/status", verifyFirebaseToken, isAdmin, async (req, res) => {
  try {
    const updatedOrder = await Order.findByIdAndUpdate(
      req.params.id,
      { status: req.body.status },
      { new: true }
    );
    res.status(200).json(updatedOrder);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// DELETE ORDER (ADMIN)
router.delete("/:id", verifyFirebaseToken, isAdmin, async (req, res) => {
  try {
    await Order.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "Order deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;