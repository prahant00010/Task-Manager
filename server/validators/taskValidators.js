const { body, param } = require("express-validator");

const createTaskValidator = [
  body("title").trim().notEmpty().withMessage("Title is required"),
  body("description").optional().isString(),
  body("projectId").isMongoId().withMessage("Valid projectId is required"),
  body("assignedTo").optional({ values: "null" }).isMongoId().withMessage("Invalid assignee id"),
  body("dueDate").optional({ values: "null" }).isISO8601().withMessage("Invalid due date"),
  body("priority").optional().isIn(["low", "medium", "high"]).withMessage("Invalid priority"),
  body("status").optional().isIn(["todo", "in_progress", "done"]).withMessage("Invalid status")
];

const updateTaskValidator = [
  param("id").isMongoId().withMessage("Invalid task id"),
  body("title").optional().trim().notEmpty().withMessage("Title cannot be empty"),
  body("description").optional().isString(),
  body("assignedTo").optional({ values: "null" }).isMongoId().withMessage("Invalid assignee id"),
  body("dueDate").optional({ values: "null" }).isISO8601().withMessage("Invalid due date"),
  body("priority").optional().isIn(["low", "medium", "high"]).withMessage("Invalid priority"),
  body("status").optional().isIn(["todo", "in_progress", "done"]).withMessage("Invalid status")
];

const taskIdValidator = [param("id").isMongoId().withMessage("Invalid task id")];

const addCommentValidator = [
  param("id").isMongoId().withMessage("Invalid task id"),
  body("text").trim().notEmpty().withMessage("Comment text is required")
];

module.exports = {
  createTaskValidator,
  updateTaskValidator,
  taskIdValidator,
  addCommentValidator
};
