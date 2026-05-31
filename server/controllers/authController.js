const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const ApiResponse = require("../utils/ApiResponse");

function signToken(user) {
  return jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || "7d"
  });
}

async function register(req, res) {
  const { name, email, password, role = "member" } = req.body;

  const existing = await User.findOne({ email });
  if (existing) {
    return ApiResponse.error(res, "Email already exists", 409);
  }

  const passwordHash = await bcrypt.hash(password, 10);
  const user = await User.create({ name, email, passwordHash, role });
  const token = signToken(user);

  return ApiResponse.success(res, { user: user.toSafeJSON(), token }, 201);
}

async function login(req, res) {
  const { email, password } = req.body;

  const user = await User.findOne({ email }).select("+passwordHash");
  if (!user) {
    return ApiResponse.error(res, "Invalid credentials", 401);
  }

  const ok = await bcrypt.compare(password, user.passwordHash);
  if (!ok) {
    return ApiResponse.error(res, "Invalid credentials", 401);
  }

  const token = signToken(user);
  return ApiResponse.success(res, { user: user.toSafeJSON(), token });
}

async function getMe(req, res) {
  return ApiResponse.success(res, { user: req.user.toSafeJSON() });
}

module.exports = { register, login, getMe };
