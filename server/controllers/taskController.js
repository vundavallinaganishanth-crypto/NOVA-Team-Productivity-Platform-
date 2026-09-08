const Task = require("../models/Task");
const Project = require("../models/Project");

// Create Task
const createTask = async (req, res) => {
  try {
    const {
      title,
      description,
      status,
      priority,
      dueDate,
      project,
      assignedTo,
    } = req.body;

    // Validate title
    if (!title) {
      return res.status(400).json({
        message: "Task title is required",
      });
    }

    // Validate project
    if (!project) {
      return res.status(400).json({
        message: "Project is required",
      });
    }

    // Check project exists
    const projectData = await Project.findById(project);

    if (!projectData) {
      return res.status(404).json({
        message: "Project not found",
      });
    }

    // Check user has access to project
    const isOwner =
      projectData.owner.toString() === req.user._id.toString();

    const isMember = projectData.members.some(
      (member) =>
        member.toString() === req.user._id.toString()
    );

    if (!isOwner && !isMember) {
      return res.status(403).json({
        message: "You do not have access to this project",
      });
    }

    // Create task
    const task = await Task.create({
      title,
      description,
      status,
      priority,
      dueDate,
      project,
      assignedTo,
      createdBy: req.user._id,
    });

    const populatedTask = await Task.findById(task._id)
      .populate("assignedTo", "name email")
      .populate("createdBy", "name email")
      .populate("project", "name");

    res.status(201).json({
      message: "Task created successfully",
      task: populatedTask,
    });
  } catch (error) {
    console.error("Create task error:", error);

    res.status(500).json({
      message: "Server error",
    });
  }
};


// Get All Tasks for a Project
const getTasks = async (req, res) => {
  try {
    const { projectId } = req.params;

    // Check project exists
    const project = await Project.findById(projectId);

    if (!project) {
      return res.status(404).json({
        message: "Project not found",
      });
    }

    // Check access
    const isOwner =
      project.owner.toString() === req.user._id.toString();

    const isMember = project.members.some(
      (member) =>
        member.toString() === req.user._id.toString()
    );

    if (!isOwner && !isMember) {
      return res.status(403).json({
        message: "You do not have access to this project",
      });
    }

    // Get tasks
    const tasks = await Task.find({
      project: projectId,
    })
      .populate("assignedTo", "name email")
      .populate("createdBy", "name email")
      .sort({ createdAt: -1 });

    res.json({
      tasks,
    });
  } catch (error) {
    console.error("Get tasks error:", error);

    res.status(500).json({
      message: "Server error",
    });
  }
};


// Get Single Task
const getTask = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id)
      .populate("assignedTo", "name email")
      .populate("createdBy", "name email")
      .populate("project", "name");

    if (!task) {
      return res.status(404).json({
        message: "Task not found",
      });
    }

    // Check project access
    const project = await Project.findById(task.project._id);

    if (!project) {
      return res.status(404).json({
        message: "Project not found",
      });
    }

    const isOwner =
      project.owner.toString() === req.user._id.toString();

    const isMember = project.members.some(
      (member) =>
        member.toString() === req.user._id.toString()
    );

    if (!isOwner && !isMember) {
      return res.status(403).json({
        message: "You do not have access to this task",
      });
    }

    res.json({
      task,
    });
  } catch (error) {
    console.error("Get task error:", error);

    res.status(500).json({
      message: "Server error",
    });
  }
};


// Update Task
const updateTask = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).json({
        message: "Task not found",
      });
    }

    // Check project
    const project = await Project.findById(task.project);

    if (!project) {
      return res.status(404).json({
        message: "Project not found",
      });
    }

    // Check access
    const isOwner =
      project.owner.toString() === req.user._id.toString();

    const isMember = project.members.some(
      (member) =>
        member.toString() === req.user._id.toString()
    );

    if (!isOwner && !isMember) {
      return res.status(403).json({
        message: "You do not have access to update this task",
      });
    }

    const {
      title,
      description,
      status,
      priority,
      dueDate,
      assignedTo,
    } = req.body;

    task.title = title ?? task.title;
    task.description = description ?? task.description;
    task.status = status ?? task.status;
    task.priority = priority ?? task.priority;
    task.dueDate = dueDate ?? task.dueDate;
    task.assignedTo = assignedTo ?? task.assignedTo;

    const updatedTask = await task.save();

    const populatedTask = await Task.findById(updatedTask._id)
      .populate("assignedTo", "name email")
      .populate("createdBy", "name email")
      .populate("project", "name");

    res.json({
      message: "Task updated successfully",
      task: populatedTask,
    });
  } catch (error) {
    console.error("Update task error:", error);

    res.status(500).json({
      message: "Server error",
    });
  }
};


// Delete Task
const deleteTask = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).json({
        message: "Task not found",
      });
    }

    // Check project
    const project = await Project.findById(task.project);

    if (!project) {
      return res.status(404).json({
        message: "Project not found",
      });
    }

    // Only project owner can delete
    if (
      project.owner.toString() !==
      req.user._id.toString()
    ) {
      return res.status(403).json({
        message: "Only the project owner can delete tasks",
      });
    }

    await task.deleteOne();

    res.json({
      message: "Task deleted successfully",
    });
  } catch (error) {
    console.error("Delete task error:", error);

    res.status(500).json({
      message: "Server error",
    });
  }
};


module.exports = {
  createTask,
  getTasks,
  getTask,
  updateTask,
  deleteTask,
};