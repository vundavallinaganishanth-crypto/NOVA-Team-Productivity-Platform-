const Project = require("../models/Project");
const Task = require("../models/Task");

const getDashboardStats = async (req, res) => {
  try {
    const userId = req.user._id;

    const projects = await Project.find({
      $or: [
        { owner: userId },
        { members: userId },
      ],
    });

    const projectIds = projects.map((project) => project._id);

    const tasks = await Task.find({
      project: { $in: projectIds },
    });

    const stats = {
      projects: projects.length,
      tasks: tasks.length,
      inProgress: tasks.filter(
        (task) => task.status === "In Progress"
      ).length,
      completed: tasks.filter(
        (task) => task.status === "Completed"
      ).length,
    };

    res.status(200).json(stats);
  } catch (error) {
    console.error("Dashboard stats error:", error.message);

    res.status(500).json({
      message: "Failed to fetch dashboard statistics",
    });
  }
};

module.exports = {
  getDashboardStats,
};