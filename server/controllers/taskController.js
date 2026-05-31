const Task = require("../models/Task");
const Project = require("../models/Project");
const ApiResponse = require("../utils/ApiResponse");
const { getProjectIfMember, isAssigneeInProject } = require("../utils/projectHelpers");

function formatTask(task) {
  return {
    id: task._id,
    title: task.title,
    description: task.description,
    status: task.status,
    priority: task.priority,
    dueDate: task.dueDate,
    projectId: task.projectId?._id || task.projectId,
    projectName: task.projectId?.name,
    createdBy: task.createdBy?._id || task.createdBy,
    createdByName: task.createdBy?.name,
    assignedTo: task.assignedTo?._id || task.assignedTo,
    assignedToName: task.assignedTo?.name,
    comments: (task.comments || []).map((c) => ({
      id: c._id,
      text: c.text,
      authorId: c.author?._id || c.author,
      authorName: c.author?.name,
      createdAt: c.createdAt
    })),
    createdAt: task.createdAt,
    updatedAt: task.updatedAt
  };
}

async function getUserProjectIds(userId) {
  const projects = await Project.find({ "members.user": userId }).select("_id");
  return projects.map((p) => p._id);
}

async function getTasks(req, res) {
  const projectIds = await getUserProjectIds(req.user._id);
  const filter = { projectId: { $in: projectIds } };

  if (req.query.status) filter.status = req.query.status;
  if (req.query.priority) filter.priority = req.query.priority;
  if (req.query.projectId) filter.projectId = req.query.projectId;
  if (req.query.search) {
    filter.title = { $regex: req.query.search, $options: "i" };
  }

  const sortField = req.query.sortBy || "createdAt";
  const sortOrder = req.query.order === "asc" ? 1 : -1;

  const tasks = await Task.find(filter)
    .populate("projectId", "name")
    .populate("createdBy", "name")
    .populate("assignedTo", "name")
    .populate("comments.author", "name")
    .sort({ [sortField]: sortOrder });

  return ApiResponse.success(res, { tasks: tasks.map(formatTask) });
}

async function createTask(req, res) {
  const {
    title,
    description = "",
    projectId,
    assignedTo = null,
    dueDate = null,
    priority = "medium",
    status = "todo"
  } = req.body;

  const { project, error } = await getProjectIfMember(projectId, req.user._id);
  if (error === "not_found") return ApiResponse.error(res, "Project not found", 404);
  if (error === "forbidden") return ApiResponse.error(res, "Not project member", 403);

  if (assignedTo) {
    const validAssignee = await isAssigneeInProject(projectId, assignedTo);
    if (!validAssignee) {
      return ApiResponse.error(
        res,
        "Assignee must be added to this project first (Projects → Add Member)",
        400
      );
    }
  }

  const task = await Task.create({
    title,
    description,
    projectId,
    createdBy: req.user._id,
    assignedTo: assignedTo || null,
    dueDate: dueDate || null,
    priority,
    status
  });

  await task.populate("projectId", "name");
  await task.populate("assignedTo", "name");
  return ApiResponse.success(res, { task: formatTask(task) }, 201);
}

async function updateTask(req, res) {
  const task = await Task.findById(req.params.id);
  if (!task) return ApiResponse.error(res, "Task not found", 404);

  const { error } = await getProjectIfMember(task.projectId, req.user._id);
  if (error === "forbidden") return ApiResponse.error(res, "Not project member", 403);

  const fields = ["title", "description", "status", "priority", "dueDate", "assignedTo"];
  for (const field of fields) {
    if (req.body[field] !== undefined) {
      if (field === "assignedTo" && req.body.assignedTo) {
        const valid = await isAssigneeInProject(task.projectId, req.body.assignedTo);
        if (!valid) {
          return ApiResponse.error(
            res,
            "Assignee must be added to this project first (Projects → Add Member)",
            400
          );
        }
      }
      task[field] = req.body[field];
    }
  }

  await task.save();
  await task.populate("projectId", "name");
  await task.populate("assignedTo", "name");
  await task.populate("comments.author", "name");

  return ApiResponse.success(res, { task: formatTask(task) });
}

async function deleteTask(req, res) {
  const task = await Task.findById(req.params.id);
  if (!task) return ApiResponse.error(res, "Task not found", 404);

  const { error } = await getProjectIfMember(task.projectId, req.user._id);
  if (error === "forbidden") return ApiResponse.error(res, "Not project member", 403);

  await task.deleteOne();
  return ApiResponse.success(res, { message: "Task deleted" });
}

async function addComment(req, res) {
  const task = await Task.findById(req.params.id);
  if (!task) return ApiResponse.error(res, "Task not found", 404);

  const { error } = await getProjectIfMember(task.projectId, req.user._id);
  if (error === "forbidden") return ApiResponse.error(res, "Not project member", 403);

  task.comments.push({ text: req.body.text, author: req.user._id });
  await task.save();
  await task.populate("comments.author", "name");

  return ApiResponse.success(res, { task: formatTask(task) });
}

module.exports = { getTasks, createTask, updateTask, deleteTask, addComment };
