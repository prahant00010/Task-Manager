const ApiResponse = require("../utils/ApiResponse");

function notFound(req, res) {
  ApiResponse.error(res, `Route ${req.originalUrl} not found`, 404);
}

function errorHandler(err, req, res, _next) {
  if (process.env.NODE_ENV !== "production") {
    console.error(err);
  }

  if (err.name === "ValidationError") {
    const messages = Object.values(err.errors).map((e) => e.message);
    return ApiResponse.error(res, messages.join(", "), 400);
  }

  if (err.code === 11000) {
    const field = Object.keys(err.keyValue || {})[0] || "field";
    return ApiResponse.error(res, `${field} already exists`, 409);
  }

  if (err.name === "CastError") {
    return ApiResponse.error(res, "Invalid resource id", 400);
  }

  const statusCode = err.statusCode || 500;
  const message = err.message || "Internal server error";
  return ApiResponse.error(res, message, statusCode);
}

module.exports = { notFound, errorHandler };
