const Project = require("../models/Project");
const User = require("../models/User");
const Task = require("../models/Task");
const ApiResponse = require("../utils/ApiResponse");
const { getProjectIfMember } = require("../utils/projectHelpers");

function formatProject(project, userId) {
  const memberRole = project.getMemberRole(userId);
  return {
    id: project._id,
    name: project.name,
    description: project.description,
    ownerId: project.owner,
    memberRole,
    members: project.members.map((m) => ({
      userId: m.user._id || m.user,
      name: m.user.name,
      email: m.user.email,
      role: m.role
    })),
    createdAt: project.createdAt,
    updatedAt: project.updatedAt
  };
}

async function getProjects(req, res) {
  const projects = await Project.find({ "members.user": req.user._id })
    .populate("owner", "name email")
    .populate("members.user", "name email")
    .sort({ createdAt: -1 });

  return ApiResponse.success(res, {
    projects: projects.map((p) => formatProject(p, req.user._id))
  });
}

async function getProjectById(req, res) {
  const { project, error } = await getProjectIfMember(req.params.id, req.user._id);
  if (error === "not_found") return ApiResponse.error(res, "Project not found", 404);
  if (error === "forbidden") return ApiResponse.error(res, "Not project member", 403);

  await project.populate("owner", "name email");
  await project.populate("members.user", "name email");

  return ApiResponse.success(res, { project: formatProject(project, req.user._id) });
}

async function createProject(req, res) {
  const { name, description = "" } = req.body;

  const project = await Project.create({
    name,
    description,
    owner: req.user._id,
    members: [{ user: req.user._id, role: "admin" }]
  });

  return ApiResponse.success(res, { project: formatProject(project, req.user._id) }, 201);
}

async function updateProject(req, res) {
  const { project, error } = await getProjectIfMember(req.params.id, req.user._id);
  if (error === "not_found") return ApiResponse.error(res, "Project not found", 404);
  if (error === "forbidden") return ApiResponse.error(res, "Not project member", 403);

  const isProjectAdmin = project.getMemberRole(req.user._id) === "admin";
  const isGlobalAdmin = req.user.role === "admin";
  if (!isProjectAdmin && !isGlobalAdmin) {
    return ApiResponse.error(res, "Only project admin can update project", 403);
  }

  if (req.body.name !== undefined) project.name = req.body.name;
  if (req.body.description !== undefined) project.description = req.body.description;
  await project.save();

  await project.populate("members.user", "name email");
  return ApiResponse.success(res, { project: formatProject(project, req.user._id) });
}

async function deleteProject(req, res) {
  const project = await Project.findById(req.params.id);
  if (!project) return ApiResponse.error(res, "Project not found", 404);

  const isOwner = project.owner.toString() === req.user._id.toString();
  const isProjectAdmin = project.getMemberRole(req.user._id) === "admin";
  if (!isOwner && !isProjectAdmin && req.user.role !== "admin") {
    return ApiResponse.error(res, "Forbidden", 403);
  }

  await Task.deleteMany({ projectId: project._id });
  await project.deleteOne();

  return ApiResponse.success(res, { message: "Project deleted" });
}

async function addMember(req, res) {
  const project = await Project.findById(req.params.id);
  if (!project) return ApiResponse.error(res, "Project not found", 404);

  const isProjectAdmin = project.getMemberRole(req.user._id) === "admin";
  if (!isProjectAdmin && req.user.role !== "admin") {
    return ApiResponse.error(res, "Only project admin can add members", 403);
  }

  const { userEmail, role = "member" } = req.body;
  const memberUser = await User.findOne({ email: userEmail.toLowerCase() });
  if (!memberUser) return ApiResponse.error(res, "User not found", 404);

  const existingIndex = project.members.findIndex(
    (m) => m.user.toString() === memberUser._id.toString()
  );

  if (existingIndex >= 0) {
    project.members[existingIndex].role = role;
  } else {
    project.members.push({ user: memberUser._id, role });
  }

  await project.save();
  return ApiResponse.success(res, { message: "Member added" }, 201);
}

module.exports = {
  getProjects,
  getProjectById,
  createProject,
  updateProject,
  deleteProject,
  addMember
};
