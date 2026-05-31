class ApiResponse {
  static success(res, data, statusCode = 200) {
    return res.status(statusCode).json({ success: true, ...data });
  }

  static error(res, message, statusCode = 500, errors = null) {
    const body = { success: false, message };
    if (errors) body.errors = errors;
    return res.status(statusCode).json(body);
  }
}

module.exports = ApiResponse;
