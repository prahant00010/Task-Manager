const jwt = require("jsonwebtoken");
const User = require("../models/User");
const ApiResponse = require("../utils/ApiResponse");
const asyncHandler = require("../utils/asyncHandler");

const authMiddleware = asyncHandler(async (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader?.startsWith("Bearer ")) {
    return ApiResponse.error(res, "Missing or invalid authorization header", 401);
  }

  try {
    const token = authHeader.slice(7);
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id);
    if (!user) {
      return ApiResponse.error(res, "User not found", 401);
    }
    req.user = user;
    next();
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      return ApiResponse.error(res, "Token expired", 401);
    }
    return ApiResponse.error(res, "Invalid token", 401);
  }
});

function requireRole(...roles) {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return ApiResponse.error(res, "Forbidden", 403);
    }
    next();
  };
}

module.exports = { authMiddleware, requireRole };
