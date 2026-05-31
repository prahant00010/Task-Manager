const express = require("express");
const { getUsers, getUserById } = require("../controllers/userController");
const { authMiddleware } = require("../middleware/auth");
const asyncHandler = require("../utils/asyncHandler");

const router = express.Router();

router.use(authMiddleware);
router.get("/", asyncHandler(getUsers));
router.get("/:id", asyncHandler(getUserById));

module.exports = router;
