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
  const data = await service.searchOpenFDA(req.query.search);
  res.json({ success: true, data });
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


exports.logout = logout; 