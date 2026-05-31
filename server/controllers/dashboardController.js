const Task = require("../models/Task");
const Project = require("../models/Project");
const ApiResponse = require("../utils/ApiResponse");

async function getDashboard(req, res) {
  const projectIds = await Project.find({ "members.user": req.user._id }).distinct("_id");
  const tasks = await Task.find({ projectId: { $in: projectIds } });

  const now = new Date();
  const stats = {
    total: tasks.length,
    todo: tasks.filter((t) => t.status === "todo").length,
    inProgress: tasks.filter((t) => t.status === "in_progress").length,
    done: tasks.filter((t) => t.status === "done").length,
    overdue: tasks.filter(
      (t) => t.dueDate && new Date(t.dueDate) < now && t.status !== "done"
    ).length,
    byPriority: {
      low: tasks.filter((t) => t.priority === "low").length,
      medium: tasks.filter((t) => t.priority === "medium").length,
      high: tasks.filter((t) => t.priority === "high").length
    }
  };

  return ApiResponse.success(res, { stats });
}

module.exports = { getDashboard };
