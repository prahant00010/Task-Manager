const express = require("express");
const {
  getProjects,
  getProjectById,
  createProject,
  updateProject,
  deleteProject,
  addMember
} = require("../controllers/projectController");
const { authMiddleware, requireRole } = require("../middleware/auth");
const validate = require("../middleware/validate");
const {
  createProjectValidator,
  updateProjectValidator,
  projectIdValidator,
  addMemberValidator
} = require("../validators/projectValidators");
const asyncHandler = require("../utils/asyncHandler");

const router = express.Router();

router.use(authMiddleware);

router.get("/", asyncHandler(getProjects));
router.post("/", requireRole("admin"), createProjectValidator, validate, asyncHandler(createProject));
router.get("/:id", projectIdValidator, validate, asyncHandler(getProjectById));
router.put("/:id", updateProjectValidator, validate, asyncHandler(updateProject));
router.delete("/:id", projectIdValidator, validate, asyncHandler(deleteProject));
router.post("/:id/members", addMemberValidator, validate, asyncHandler(addMember));

module.exports = router;
