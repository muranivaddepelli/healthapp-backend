require("dotenv").config();

const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const Admin = require("../models/admin");

const MONGO_URI = process.env.MONGO_URI;

const createAdmin = async () => {

  try {

    await mongoose.connect(MONGO_URI);

    const hashedPassword = await bcrypt.hash("admin123", 10);

    const admin = await Admin.create({
      username: "admin",
      password: hashedPassword
    });

    console.log("Admin created successfully");
    console.log(admin);

    process.exit();

  } catch (error) {

    console.error(error);
    process.exit(1);

  }

};

createAdmin();