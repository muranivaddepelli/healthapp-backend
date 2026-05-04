const service = require("./user.service");
const cloudinary = require("../../config/cloudinary");
const Appointment=require("../../models/appointment");
const DiagnosticTest = require("../../models/diagnosticTest");
const TestSlot = require("../../models/testSlot");
const Prescription = require("../../models/prescription");
const User = require("../../models/user");
const Wallet = require("../../models/wallet");
const WalletTransaction = require("../../models/walletTransaction");
const PDFDocument = require("pdfkit");

exports.getProfile = async (req, res) => {
const moment = require("moment");

  try {

    const userId = req.user._id || req.user.id;

    const data = await service.getProfile(userId);

    res.json(data);

  } catch (err) {

    res.status(500).json({
      message: err.message
    });

  }

};

exports.updateProfile = async (req, res) => {

  try {

    const userId = req.user.id;

    const data = await service.updateProfile(
      userId,
      req.body
    );

    res.json(data);

  } catch (err) {

    res.status(500).json({
      message: err.message
    });

  }

};


exports.uploadProfilePhoto = async (req, res) => {
  try {

    if (!req.file) {
      return res.status(400).json({
        message: "No image uploaded"
      });
    }

    const userId = req.user.id;

    const user = await service.getProfile(userId);

    if (user.profilePhoto) {

      const parts = user.profilePhoto.split("/");
      const filename = parts[parts.length - 1];
      const publicId = "user_profiles/" + filename.split(".")[0];

      await cloudinary.uploader.destroy(publicId);

    }

    const photoUrl = req.file.path;

    const updatedUser = await service.updateProfile(userId, {
      profilePhoto: photoUrl
    });

    res.json({
      message: "Profile photo updated successfully",
      profilePhoto: photoUrl,
      user: updatedUser
    });

  } catch (err) {

    res.status(500).json({
      message: err.message
    });

  }
};




exports.deleteProfilePhoto = async (req, res) => {
  try {

    const userId = req.user.id;

    const user = await service.getProfile(userId);

    if (!user.profilePhoto) {
      return res.status(404).json({
        message: "No profile photo found"
      });
    }

    const parts = user.profilePhoto.split("/");
    const filename = parts[parts.length - 1];
    const publicId = "user_profiles/" + filename.split(".")[0];

    await cloudinary.uploader.destroy(publicId);

    await service.updateProfile(userId, {
      profilePhoto: null
    });

    res.json({
      message: "Profile photo deleted successfully"
    });

  } catch (err) {

    res.status(500).json({
      message: err.message
    });

  }
};



exports.getNearbyHospitals = async (req, res) => {

  try {

    const hospitals = await service.getNearbyHospitals(
      req.params.addressId
    );

    res.json({
      success: true,
      data: hospitals
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message
    });

  }

};



exports.getDoctors = async (req, res) => {

  try {

    const { specialization, location,type } = req.query;

    if (location && !Array.isArray(location)) {
  location = [location];
}

    const doctors = await service.getDoctors(
      specialization,
      location,
      type
    );

    res.json({
      success: true,
      data: doctors
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message
    });

  }

};



exports.getDoctorDetails = async (req, res) => {
  try {

    const { doctorId } = req.params;

    const data = await service.getDoctorDetails(doctorId);

    res.json({
      success: true,
      data
    });

  } catch (err) {

    res.status(500).json({
      success: false,
      message: err.message
    });

  }
};


exports.getDoctorSlots = async (req, res) => {
  try {

    const { doctorId } = req.params;
    const { date } = req.query;

    if (!date) {
      return res.status(400).json({
        success: false,
        message: "Date is required"
      });
    }

    const slots = await service.getDoctorSlots(doctorId, date);

    res.json({
      success: true,
      data: slots
    });

  } catch (err) {

    res.status(500).json({
      success: false,
      message: err.message
    });

  }
};


exports.addToCart = async (req, res) => {
  try {
    const data = await service.addToCart(req.user.id, req.body);
    res.json({ success: true, data });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.getCart = async (req, res) => {
  try {
    const data = await service.getCart(req.user.id);
    res.json({ success: true, data });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.updateQuantity = async (req, res) => {
  try {
    const data = await service.updateQuantity(
      req.user.id,
      req.params.id,
      req.body.quantity
    );
    res.json({ success: true, data });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.deleteCart = async (req, res) => {
  try {
    await service.deleteCart(req.user.id, req.params.id);
    res.json({ success: true, message: "Item removed" });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.checkout = async (req, res) => {
  try {
    const data = await service.checkout(req.user.id, req.body);
    res.json({ success: true, data });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};


exports.getUserAppointments = async (req, res) => {
  try {
    const userId = req.user.id;

    const appointments = await Appointment.find({ userId })
      .populate("doctorId", "username specialization")
.populate("hospitalId", "hospitalName address location")    
  .sort({ date: 1, time: 1 });

    const formatted = appointments.map((a) => ({
      _id: a._id,

      doctorName: a.doctorId
        ? ` ${a.doctorId.username}`   
        : null,
      specialization: a.doctorId?.specialization,
      hospitalName: a.hospitalId?.hospitalName, 
address: a.hospitalId?.address,
      date: a.date,
      time: a.time,
      status: a.status,
      paymentStatus: a.paymentStatus,
      consultationFee: a.consultationFee
    }));

    res.status(200).json({
      success: true,
      count: formatted.length,
      data: formatted
    });

  } catch (error) {
    console.error("Error fetching user appointments:", error);

    res.status(500).json({
      success: false,
      message: "Server Error"
    });
  }
};



exports.getTests = async (req, res) => {
  try {
    const { type } = req.query;

    let filter = {};

    if (type === "home") {
      filter.type = { $in: ["home", "both"] };
    }

    if (type === "walk-in") {
      filter.type = { $in: ["walk-in", "both"] };
    }

    const tests = await DiagnosticTest.find(filter);

const enrichedTests = await Promise.all(
  tests.map(async (test) => {

    const slotCount = await TestSlot.countDocuments({
      testId: test._id,
      isBooked: false
    });

    const nextSlot = await TestSlot.findOne({
      testId: test._id,
      isBooked: false
    }).sort({ date: 1, time: 1 });

    return {
      ...test.toObject(),
      availableSlots: slotCount,

      nextAvailableSlot: nextSlot
        ? {
            date: nextSlot.date,
            time: nextSlot.time
          }
        : null
    };
  })
);

res.json({
  success: true,
  data: enrichedTests
});
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message
    });
  }
};

exports.getSlotsByTest = async (req, res) => {
  try {
    const { testId, mode, date } = req.query;

    if (!testId || !mode) {
      return res.status(400).json({ message: "testId and mode are required" });
    }

    if (!["home", "walk-in"].includes(mode)) {
      return res.status(400).json({ message: "Invalid mode" });
    }

    const query = {
      testId,
      mode,
      isBooked: false
    };

    if (date) {
      const start = new Date(date);
      start.setHours(0, 0, 0, 0);

      const end = new Date(date);
      end.setHours(23, 59, 59, 999);

      const today = new Date();
      today.setHours(0, 0, 0, 0);

      if (start < today) {
        return res.status(400).json({ message: "Cannot fetch past slots" });
      }

      query.date = { $gte: start, $lte: end };
    }

    const slots = await TestSlot.find(query).sort({ date: 1 });

    const grouped = {};

    const formatTo12Hour = (time) => {
      const [hour, minute] = time.split(":");
      let h = parseInt(hour);

      const ampm = h >= 12 ? "PM" : "AM";
      h = h % 12 || 12;

      return `${h.toString().padStart(2, "0")}:${minute} ${ampm}`;
    };

    slots.forEach(slot => {
      const d = slot.date.toISOString().split("T")[0];

      if (!grouped[d]) grouped[d] = [];

      grouped[d].push({
        time: formatTo12Hour(slot.time), 
        rawTime: slot.time,              
        slotId: slot._id
      });
    });

    Object.keys(grouped).forEach(d => {
      grouped[d].sort((a, b) => a.rawTime.localeCompare(b.rawTime));
    });

    const result = Object.keys(grouped).map(date => ({
      date,
      slots: grouped[date].map(({ time, slotId }) => ({
        time,
        slotId
      }))
    }));

    res.json({
      success: true,
      data: result
    });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
exports.getMedicines = async (req, res) => {
  const data = await service.getMedicines(req.query.search || "");
  res.json({ success: true, data });
};

exports.addPharmacyCart = async (req, res) => {
  const data = await service.addPharmacyCart(req.user.id, req.body);
  res.json({ success: true, data });
};

exports.getPharmacyCart = async (req, res) => {
  const data = await service.getPharmacyCart(req.user.id);
  res.json({ success: true, data });
};

exports.checkoutPharmacy = async (req, res) => {
  try {
    const data = await service.checkoutPharmacy(
      req.user.id,
      req.body.body
    );
    res.json({ success: true, data });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.addReview = async (req, res) => {
  await service.addReview(req.user.id, req.body);
  res.json({ success: true });
};




exports.uploadPrescription = async (req, res) => {
  try {

    if (!req.file) {
      return res.status(400).json({
        message: "Prescription file required"
      });
    }

    const allowedTypes = [
      "application/pdf",
      "image/jpeg",
      "image/png",
      "image/jpg"
    ];

    if (!allowedTypes.includes(req.file.mimetype)) {
      return res.status(400).json({
        message: "Only PDF and Image files allowed"
      });
    }

    const filename = req.file.originalname;
    const publicId = `${Date.now()}_${filename.replace(/[^a-zA-Z0-9]/g, '_')}`;

    const isPDF = req.file.mimetype === "application/pdf";

    const result = await new Promise((resolve, reject) => {

      const stream = cloudinary.uploader.upload_stream(
        {
          folder: "prescriptions",
          public_id: publicId,

          resource_type: isPDF ? "raw" : "image",

          ...(isPDF && { format: "pdf" })
        },
        (error, result) => {
          if (error) reject(error);
          else resolve(result);
        }
      );

      stream.end(req.file.buffer);
    });

    const data = await service.uploadPrescription(
      req.user.id,
      result.secure_url,
      result.public_id,
      filename,
      req.body.notes,

      isPDF ? "pdf" : "image"
    );

    res.json({ success: true, data });

  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message
    });
  }
};



exports.viewPrescription = async (req, res) => {
  try {
    const prescription = await Prescription.findById(req.params.id);

    if (!prescription) {
      return res.status(404).json({ message: "Prescription not found" });
    }

    const response = await axios.get(prescription.file, {
      responseType: "stream"
    });

    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", "inline");

    response.data.pipe(res);

  } catch (error) {
    return res.status(500).json({
      message: error.message
    });
  }
};


exports.searchPatient = async (req, res) => {
  try {
    const { query } = req.query;

    if (!query) {
      return res.status(400).json({ message: "Search query is required" });
    }

    const patients = await User.find({
      $or: [
        { name: { $regex: query, $options: "i" } },   
        { phone: { $regex: query, $options: "i" } }   
      ]
    })
      .select("name phone age gender dob")
      .limit(10); 

    res.json(patients);

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


exports.getWallet = async (req, res) => {
  const wallet = await Wallet.findOne({ userId: req.user.id });

  res.json({
    success: true,
    balance: wallet?.balance || 0
  });
};


exports.getWalletTransactions = async (req, res) => {
  try {
    const { type } = req.query; 

    let filter = { userId: req.user.id };

    if (type === "earn") {
      filter.type = "earn";
    }

    if (type === "redeem") {
      filter.type = "redeem";
    }

    const data = await WalletTransaction.find(filter)
      .sort({ createdAt: -1 });

    const grouped = {};

    data.forEach(item => {
      let label;

      if (moment(item.createdAt).isSame(moment(), "day")) {
        label = "Today";
      } else if (
        moment(item.createdAt).isSame(moment().subtract(1, "day"), "day")
      ) {
        label = "Yesterday";
      } else {
        label = moment(item.createdAt).format("DD MMM YYYY");
      }

      if (!grouped[label]) grouped[label] = [];

      grouped[label].push(item);
    });

    res.json({ success: true, data: grouped });

  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.getClinics = async (req, res) => {
  try {

    const data = await service.getClinics();

    res.json({
      success: true,
      data
    });

  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message
    });
  }
};


exports.getPrescriptions = async (req, res) => {
  const data = await service.getPrescriptions(req.user.id);
  res.json({ success: true, data });
};


exports.getAllBills = async (req, res) => {

  const data = await service.getAllBills(req.user.id);

  const grouped = {};

  data.forEach(item => {
    let label;

    if (moment(item.date).isSame(moment(), "day")) {
      label = "Today";
    } else if (moment(item.date).isSame(moment().subtract(1, "day"), "day")) {
      label = "Yesterday";
    } else {
      label = moment(item.date).format("DD MMM YYYY");
    }

    if (!grouped[label]) grouped[label] = [];

    grouped[label].push(item);
  });

  res.json({ success: true, data: grouped });
};


exports.getPharmacyBills = async (req, res) => {
  try {
    const data = await service.getPharmacyBills(req.user.id);

    res.json({
      success: true,
      data
    });

  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message
    });
  }
};


exports.getReports = async (req, res) => {
  try {
    const { type } = req.query;

    const data = await service.getReports(req.user.id, type);

    res.json({
      success: true,
      data
    });

  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message
    });
  }
};

exports.getPharmacyBills = async (userId) => {

  const orders = await PharmacyOrder.find({ userId })
    .sort({ createdAt: -1 });

  return orders.map(o => ({
    id: o._id,

    invoiceId: `INV-${o._id.toString().slice(-6)}`, 

    date: o.createdAt,

    amount: o.finalAmount,

    type: o.paymentMethod === "home"
      ? "Home Delivery"
      : "Picked up",

    viewUrl: `/api/user/pharmacy-bill/${o._id}`,   
    downloadUrl: `/api/user/pharmacy-bill/${o._id}/download` 
  }));
};


exports.getPharmacyBillById = async (req, res) => {
  try {
    const order = await PharmacyOrder.findById(req.params.id)
      .populate("items.medicineId", "name price");

    if (!order) {
      return res.status(404).json({ message: "Bill not found" });
    }

    res.json({
      success: true,
      data: order
    });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


exports.downloadPharmacyBill = async (req, res) => {
  try {
    const order = await PharmacyOrder.findById(req.params.id);

    if (!order) {
      return res.status(404).json({ message: "Bill not found" });
    }

    const doc = new PDFDocument();

    res.setHeader("Content-Type", "application/pdf");
    res.setHeader(
      "Content-Disposition",
      `attachment; filename=bill-${order._id}.pdf`
    );

    doc.pipe(res);

    doc.text("Pharmacy Bill", { align: "center" });
    doc.moveDown();

    doc.text(`Invoice ID: ${order._id}`);
    doc.text(`Total: ₹${order.finalAmount}`);
    doc.text(`Date: ${order.createdAt}`);

    doc.end();

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};



exports.getOrders = async (req, res) => {
  try {
    const { type = "all" } = req.query;

    const data = await service.getAllOrders(req.user.id, type);

    res.json({
      success: true,
      data
    });

  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message
    });
  }
};