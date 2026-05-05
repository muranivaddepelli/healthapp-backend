mongoose = require("mongoose");
const phlebotomistSchema = new mongoose.Schema({
  hospitalId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Hospital"
  },
  labId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Lab"
  },
  name: String,
  role: {
    type: String,
    default: "phlebotomist"
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, { timestamps: true });

module.exports = mongoose.model("Phlebotomist", phlebotomistSchema);