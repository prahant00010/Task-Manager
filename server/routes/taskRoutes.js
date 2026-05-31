const express = require("express");
const {
  getTasks,
  createTask,
  updateTask,
  deleteTask,
  addComment
} = require("../controllers/taskController");
const { authMiddleware } = require("../middleware/auth");
const validate = require("../middleware/validate");
const {
  createTaskValidator,
  updateTaskValidator,
  taskIdValidator,
  addCommentValidator
} = require("../validators/taskValidators");
const asyncHandler = require("../utils/asyncHandler");

const router = express.Router();

router.use(authMiddleware);

router.get("/", asyncHandler(getTasks));
router.post("/", createTaskValidator, validate, asyncHandler(createTask));
router.put("/:id", updateTaskValidator, validate, asyncHandler(updateTask));
router.patch("/:id", updateTaskValidator, validate, asyncHandler(updateTask));
router.delete("/:id", taskIdValidator, validate, asyncHandler(deleteTask));
router.post("/:id/comments", addCommentValidator, validate, asyncHandler(addComment));

module.exports = router;
