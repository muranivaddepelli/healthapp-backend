exports.logout = async (req, res) => {
  try {
    return res.json({
      message: "Logged out successfully"
    });

  } catch (err) {

    res.status(400).json({
      message: err.message
    });

  }

};