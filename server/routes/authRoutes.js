const express = require("express");
const { register, login, getMe } = require("../controllers/authController");
const { authMiddleware } = require("../middleware/auth");
const validate = require("../middleware/validate");
const { registerValidator, loginValidator } = require("../validators/authValidators");
const asyncHandler = require("../utils/asyncHandler");

const router = express.Router();

router.post("/register", registerValidator, validate, asyncHandler(register));
router.post("/signup", registerValidator, validate, asyncHandler(register));
router.post("/login", loginValidator, validate, asyncHandler(login));
router.get("/me", authMiddleware, asyncHandler(getMe));

module.exports = router;
