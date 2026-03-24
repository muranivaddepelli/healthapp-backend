const Medicine = require("../models/Medicine");
const axios = require("axios");

function parseSearch(search) {
  const regex = /([a-zA-Z\s]+)\s*(\d+\s*(mg|ml|g))?/i;
  const match = search.match(regex);

  return {
    name: match?.[1]?.trim(),
    strength: match?.[2]?.replace(/\s+/g, " ").trim()
  };
}

exports.searchMedicines = async (req, res) => {
  try {
    const { search } = req.query;

    if (!search) {
      return res.status(400).json({
        success: false,
        message: "Search query required"
      });
    }

    const { name, strength } = parseSearch(search);

    let query = {};

    if (name) {
      query.name = { $regex: name, $options: "i" };
    }

    if (strength) {
      query.dosageStrength = { $regex: strength, $options: "i" };
    }

    let medicines = await Medicine.find(query);

    if (medicines.length === 0) {

      const cleanName = name;

      const openfdaRes = await axios.get(
        `http://localhost:5000/pharmacy/openfda?search=${cleanName}`
      );

      return res.json({
        success: true,
        source: "openfda",
        data: openfdaRes.data.data
      });
    }

    res.json({
      success: true,
      data: medicines
    });

  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message
    });
  }
};

exports.addMedicine = async (req, res) => {
  try {
    const med = await Medicine.create(req.body);

    res.json({
      success: true,
      data: med
    });

  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message
    });
  }
};