const service = require("./pharmacy.service");
const { logout } = require("../../utils/logout");

exports.login = async (req, res) => {

  try {

    const { hospitalName, username, password } = req.body;

    const data = await service.login(
      hospitalName,
      username,
      password
    );

    res.json(data);

  } catch (err) {

    res.status(err.statusCode || 500).json({
      message: err.message
    });

  }

};



exports.searchOpenFDA = async (req, res) => {
  try {

    let search = req.query.search;

    if (!search) {
      return res.status(400).json({
        success: false,
        message: "Search query required"
      });
    }

    search = search.replace(/\d+\s*(mg|ml|g)/gi, "").trim();


    const axios = require("axios");

    const response = await axios.get(
      `https://api.fda.gov/drug/label.json?search=openfda.generic_name:${search}`
    );

    const results = response.data.results || [];

    const data = results.map(item => ({
      name: item.openfda?.generic_name?.[0] || "",
      manufacturer: item.openfda?.manufacturer_name?.[0] || "",
      dosage: item.dosage_and_administration?.[0] || "",
      usage: item.indications_and_usage?.[0] || ""
    }));

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

exports.addMedicine = async (req, res) => {
  try {

    console.log("BODY:", req.body);

    const name = req.body.name || req.body.Name;
    const price = req.body.price || req.body.Price;
    const stock = req.body.stock || req.body.Stock;

    if (!name || !price || !stock) {
      throw new Error("Name, price, stock are required");
    }

    const data = await service.addMedicine(req.user.id, {
      ...req.body,
      name,
      price: Number(price),
      stock: Number(stock),
      image: req.file?.path
    });

    res.json({ success: true, data });

  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};


exports.updateMedicine = async (req, res) => {
  const data = await service.updateMedicine(
    req.params.id,
    req.user.id,
    req.body
  );
  res.json({ success: true, data });
};

exports.getMyMedicines = async (req, res) => {
  const data = await service.getMyMedicines(req.user.id);
  res.json({ success: true, data });
};


exports.getPrescriptions = async (req, res) => {
  try {

    const data = await service.getPrescriptions();

    res.json({ success: true, data });

  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.approvePrescription = async (req, res) => {
  try {

    const data = await service.approvePrescription(
      req.params.id,
      req.body
    );

    res.json({ success: true, data });

  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.rejectPrescription = async (req, res) => {
  try {
    const data = await service.rejectPrescription(req.params.id);
    res.json({ success: true, data });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};


exports.searchMedicines = async (req, res) => {
  try {

    let search = req.query.search;

    if (!search) {
      return res.status(400).json({
        success: false,
        message: "Search query required"
      });
    }

    const regex = /([a-zA-Z\s]+)\s*(\d+\s*(mg|ml|g))?/i;
    const match = search.match(regex);

    const name = match?.[1]?.trim();
    const strength = match?.[2]?.replace(/\s+/g, " ").trim();

    let medicines = await service.searchMedicines(req.user.id, name, strength);

    if (medicines.length === 0) {

      const axios = require("axios");

      const cleanName = name;

      const openfdaRes = await axios.get(
  `http://localhost:5000/api/pharmacy/openfda?search=${cleanName}`
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


exports.logout = logout; 