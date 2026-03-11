const service = require("./frontdesk.service");
const {logout} = require("../../utils/logout");

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
exports.logout = logout;