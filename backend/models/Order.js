const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({
  customerId: {
    type: String,
    required: true
  },
  customerName: {
    type: String
  },
  customerEmail: {
    type: String
  },
  items: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Pizza"
    }
  ],
  totalAmount: {
    type: Number,
    required: true
  },
  status: {
    type: String,
    enum: [
      "pending",
      "placed", // Added to fix the Mongoose enum validation error!
      "confirmed",
      "preparing",
      "out_for_delivery",
      "delivered",
      "cancelled"
    ],
    default: "pending"
  },
  deliveryAddress: {
    type: String,
    required: true
  },
  // Added so Mongoose can safely record the Razorpay transaction references
  paymentDetails: {
    razorpay_payment_id: { type: String },
    razorpay_order_id: { type: String },
    razorpay_signature: { type: String }
  }
}, {
  timestamps: true
});

module.exports = mongoose.model("Order", orderSchema);