const User = require("../models/User");
const ApiResponse = require("../utils/ApiResponse");

async function getUsers(_req, res) {
  const users = await User.find().sort({ createdAt: -1 });
  return ApiResponse.success(res, {
    users: users.map((u) => u.toSafeJSON())
  });
}

async function getUserById(req, res) {
  const user = await User.findById(req.params.id);
  if (!user) {
    return ApiResponse.error(res, "User not found", 404);
  }
  return ApiResponse.success(res, { user: user.toSafeJSON() });
}

module.exports = { getUsers, getUserById };
