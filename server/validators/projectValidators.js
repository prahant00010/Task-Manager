const { body, param } = require("express-validator");

const createProjectValidator = [
  body("name").trim().notEmpty().withMessage("Project name is required"),
  body("description").optional().isString()
];

const updateProjectValidator = [
  param("id").isMongoId().withMessage("Invalid project id"),
  body("name").optional().trim().notEmpty().withMessage("Name cannot be empty"),
  body("description").optional().isString()
];

const projectIdValidator = [param("id").isMongoId().withMessage("Invalid project id")];

const addMemberValidator = [
  param("id").isMongoId().withMessage("Invalid project id"),
  body("userEmail").isEmail().withMessage("Valid user email is required"),
  body("role").optional().isIn(["admin", "member"]).withMessage("Invalid member role")
];

module.exports = {
  createProjectValidator,
  updateProjectValidator,
  projectIdValidator,
  addMemberValidator
};
