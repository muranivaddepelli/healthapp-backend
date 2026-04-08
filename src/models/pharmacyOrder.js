const mongoose = require("mongoose");

const schema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },

    items: [
      {
        medicineId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Medicine"
        },
        quantity: Number,
        price: Number
      }
    ],

    totalAmount: Number,
    paymentMethod: String,

    orderType: {
      type: String,
      default: "pharmacy"
    },

    location: String,

    deliveryAddress: String,

    status: {
      type: String,
      enum: ["placed", "packed", "shipped", "delivered"],
      default: "placed"
    },

    packedAt: Date,
    outForDeliveryAt: Date,
    deliveredAt: Date,

    deliveryPartner: {
      name: String,
      phone: String,
      vehicle: String,
      trackingId: String
    },

    currentLocation: {
      lat: Number,
      lng: Number
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("PharmacyOrder", schema);