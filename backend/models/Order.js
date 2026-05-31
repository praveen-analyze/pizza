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
      type:
      mongoose.Schema.Types.ObjectId,

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
  }

}, {
  timestamps: true
});

module.exports =
  mongoose.model("Order", orderSchema);