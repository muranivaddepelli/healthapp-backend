const mongoose = require("mongoose");

const addressSchema = new mongoose.Schema(
{
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
    index: true
  },

  addressName: {
    type: String,
    required: true
  },

  addressType: {
    type: String,
    enum: ["home", "work", "custom"],
    required: true
  },

  house: {
    type: String,
    required: true
  },

  area: {
    type: String,
    required: true
  },

  locality: {
    type: String,
    required: true
  },

  pincode: {
    type: String,
    required: true,
    index: true
  },

  latitude: Number,
  longitude: Number,

  isDefault: {
    type: Boolean,
    default: false
  },

  isDeleted: {
    type: Boolean,
    default: false
  }

},
{ timestamps: true }
);

addressSchema.index({ userId: 1, isDefault: 1 });

module.exports = mongoose.model("Address", addressSchema);