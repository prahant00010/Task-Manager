const Project = require("../models/Project");

async function getProjectIfMember(projectId, userId) {
  const project = await Project.findById(projectId);
  if (!project) return { project: null, error: "not_found" };
  if (!project.isMember(userId)) return { project: null, error: "forbidden" };
  return { project, error: null };
}

async function isAssigneeInProject(projectId, assigneeId) {
  const project = await Project.findById(projectId);
  if (!project) return false;
  return project.isMember(assigneeId);
}

module.exports = { getProjectIfMember, isAssigneeInProject };
