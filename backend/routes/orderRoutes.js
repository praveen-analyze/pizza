const express = require("express");
const Razorpay = require("razorpay");
const crypto = require("crypto");
const Order = require("../models/Order");
const { protect, admin } = require("../middleware/authMiddleware");

const router = express.Router();

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

// 1. CREATE RAZORPAY ORDER
router.post("/create-razorpay-order", async (req, res) => {
  try {
    const { amount } = req.body;
    if (!amount) return res.status(400).json({ message: "Amount is required" });
    
    const options = {
      amount: Math.round(amount * 100), // Ensure it is an integer
      currency: "INR",
      receipt: `receipt_order_${Date.now()}`,
    };
    
    const order = await razorpay.orders.create(options);
    res.status(200).json(order);
  } catch (error) {
    console.error("Razorpay Order Creation Error:", error);
    res.status(500).json({ message: "Failed to create Razorpay order" });
  }
});

// 2. VERIFY PAYMENT AND SAVE ORDER TO ADMIN/DATABASE
router.post("/verify-and-create", protect, async (req, res) => {
  try {
    const { 
      razorpay_order_id, 
      razorpay_payment_id, 
      razorpay_signature,
      customerId,
      customerName,
      customerEmail,
      items,
      totalAmount,
      deliveryAddress 
    } = req.body;

    // Validate incoming data structures
    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return res.status(400).json({ message: "Missing required Razorpay payment details" });
    }

    // Cryptographically verify the payment signature
    const body = razorpay_order_id + "|" + razorpay_payment_id;
    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(body.toString())
      .digest("hex");
      
    const isAuthentic = expectedSignature === razorpay_signature;

    if (!isAuthentic) {
      return res.status(400).json({ message: "Invalid payment signature. Transaction rejected." });
    }

    // Create and populate the official database record
    const order = new Order({
      customerId,
      customerName,
      customerEmail,
      items,
      totalAmount,
      deliveryAddress,
      status: "placed", // Set directly to placed/paid since verification succeeded
      paymentDetails: {
        razorpay_payment_id,
        razorpay_order_id,
        razorpay_signature
      }
    });

    const savedOrder = await order.save();
    res.status(201).json({ message: "Payment verified & order saved successfully", order: savedOrder });
  } catch (error) {
    console.error("Critical Verification/Save Error:", error);
    res.status(500).json({ message: "Internal server error saving transaction records" });
  }
});

// 3. GET ALL ORDERS (For Admin Dashboard)
router.get("/", protect, admin, async (req, res) => {
  try {
    const orders = await Order.find().populate("items");
    res.status(200).json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// 4. GET MY ORDERS (For Customers)
router.get("/my/:customerId", protect, async (req, res) => {
  try {
    const orders = await Order.find({
      customerId: req.params.customerId,
    }).populate("items");
    res.status(200).json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// 5. UPDATE STATUS (For Admin Management)
router.put("/:id/status", protect, admin, async (req, res) => {
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

// 6. DELETE ORDER
router.delete("/:id", protect, admin, async (req, res) => {
  try {
    await Order.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "Order deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;