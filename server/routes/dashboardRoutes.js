const express = require("express");
const { getDashboard } = require("../controllers/dashboardController");
const { authMiddleware } = require("../middleware/auth");
const asyncHandler = require("../utils/asyncHandler");

const router = express.Router();

router.get("/", authMiddleware, asyncHandler(getDashboard));

module.exports = router;
