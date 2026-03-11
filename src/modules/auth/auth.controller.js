const service = require("./auth.service");
const jwt = require("jsonwebtoken");
const { generateAccessToken } = require("../../utils/token");
const sendOtpToEmail = require("../../utils/sendOtp");
const repo = require("./auth.repository");

exports.signup = async (req, res) => {
  try {

    const data = await service.signup(req.body);

    res.json({
      success: true,
      message: data.message
    });

  } catch (err) {

    res.status(err.statusCode || 400).json({
      success: false,
      message: err.message
    });

  }
};

exports.verifyOtp = async (req, res) => {
  try {

    const { email, otp } = req.body;

    const data = await service.verifyOtp(email, otp);

    res.json({
      success: true,
      message: data.message
    });

  } catch (err) {

    res.status(err.statusCode || 400).json({
      success: false,
      message: err.message
    });

  }
};

exports.login = async (req, res) => {
  try {

    const { email, password } = req.body;

    const data = await service.login(email, password);

    res.json({
      success: true,
      ...data
    });

  } catch (err) {

    res.status(err.statusCode || 400).json({
      success: false,
      message: err.message
    });

  }
};

exports.forgotPassword = async (req, res) => {
  try {

    const { email } = req.body;

    const data = await service.forgotPassword(email);

    res.json({
      success: true,
      message: data.message
    });

  } catch (err) {

    res.status(err.statusCode || 400).json({
      success: false,
      message: err.message
    });

  }
};

exports.verifyResetOtp = async (req, res) => {
  try {

    const { email, otp } = req.body;

    const data = await service.verifyResetOtp(email, otp);

    res.json({
      success: true,
      message: data.message
    });

  } catch (err) {

    res.status(err.statusCode || 400).json({
      success: false,
      message: err.message
    });

  }
};

exports.resetPassword = async (req, res) => {
  try {

    const { email, otp, newPassword:password } = req.body;

    const data = await service.resetPassword(email, otp, password);

    res.json({
      success: true,
      message: data.message
    });

  } catch (err) {

    res.status(err.statusCode || 400).json({
      success: false,
      message: err.message
    });

  }
};

exports.resendOtp = async (req, res) => {
  try {

const { email, purpose: type } = req.body;

const data = await service.resendOtp(email, type);
    res.json({
      success: true,
      message: "OTP resent successfully"
    });

  } catch (err) {

    res.status(err.statusCode || 400).json({
      success: false,
      message: err.message
    });

  }
};

exports.logout = async (req, res) => {
  try {

    res.json({
      success: true,
      message: "Logged out successfully"
    });

  } catch (err) {

    res.status(400).json({
      success: false,
      message: err.message
    });

  }
};

exports.refreshToken = async (req, res) => {

  try {

    const { refreshToken } = req.body;

    if (!refreshToken) {
      return res.status(401).json({
        success: false,
        message: "Refresh token is required"
      });
    }

    const storedToken = await repo.findRefreshToken(refreshToken);

    if (!storedToken) {
      return res.status(403).json({
        success: false,
        message: "Invalid refresh token"
      });
    }

    const decoded = jwt.verify(
      refreshToken,
      process.env.JWT_REFRESH_SECRET
    );

    const accessToken = generateAccessToken({
      id: decoded.id,
      role: "user"
    });

    res.json({
      success: true,
      accessToken
    });

  } catch (err) {

    res.status(401).json({
      success: false,
      message: "Invalid or expired refresh token"
    });

  }

};