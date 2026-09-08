const Project = require("../models/Project");

// Create project
const createProject = async (req, res) => {
  try {
    const {
      name,
      description,
      status,
      priority,
      dueDate,
    } = req.body;

    if (!name) {
      return res.status(400).json({
        message: "Project name is required",
      });
    }

    const project = await Project.create({
      name,
      description,
      status,
      priority,
      dueDate,
      owner: req.user._id,
      members: [req.user._id],
    });

    res.status(201).json({
      message: "Project created successfully",
      project,
    });
  } catch (error) {
    console.error("Create project error:", error);

    res.status(500).json({
      message: "Server error",
    });
  }
};

// Get all projects for logged-in user
const getProjects = async (req, res) => {
  try {
    const projects = await Project.find({
      $or: [
        { owner: req.user._id },
        { members: req.user._id },
      ],
    })
      .populate("owner", "name email")
      .populate("members", "name email")
      .sort({ createdAt: -1 });

    res.json({
      projects,
    });
  } catch (error) {
    console.error("Get projects error:", error);

    res.status(500).json({
      message: "Server error",
    });
  }
};

// Get single project
const getProject = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id)
      .populate("owner", "name email")
      .populate("members", "name email");

    if (!project) {
      return res.status(404).json({
        message: "Project not found",
      });
    }

    // Check access
    const isOwner =
      project.owner._id.toString() === req.user._id.toString();

    const isMember = project.members.some(
      (member) =>
        member._id.toString() === req.user._id.toString()
    );

    if (!isOwner && !isMember) {
      return res.status(403).json({
        message: "You do not have access to this project",
      });
    }

    res.json({
      project,
    });
  } catch (error) {
    console.error("Get project error:", error);

    res.status(500).json({
      message: "Server error",
    });
  }
};

// Update project
const updateProject = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);

    if (!project) {
      return res.status(404).json({
        message: "Project not found",
      });
    }

    // Only owner can update
    if (
      project.owner.toString() !==
      req.user._id.toString()
    ) {
      return res.status(403).json({
        message: "Only the project owner can update it",
      });
    }

    const {
      name,
      description,
      status,
      priority,
      dueDate,
    } = req.body;

    project.name = name ?? project.name;
    project.description =
      description ?? project.description;
    project.status = status ?? project.status;
    project.priority = priority ?? project.priority;
    project.dueDate = dueDate ?? project.dueDate;

    const updatedProject = await project.save();

    res.json({
      message: "Project updated successfully",
      project: updatedProject,
    });
  } catch (error) {
    console.error("Update project error:", error);

    res.status(500).json({
      message: "Server error",
    });
  }
};

// Delete project
const deleteProject = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);

    if (!project) {
      return res.status(404).json({
        message: "Project not found",
      });
    }

    // Only owner can delete
    if (
      project.owner.toString() !==
      req.user._id.toString()
    ) {
      return res.status(403).json({
        message: "Only the project owner can delete it",
      });
    }

    await project.deleteOne();

    res.json({
      message: "Project deleted successfully",
    });
  } catch (error) {
    console.error("Delete project error:", error);

    res.status(500).json({
      message: "Server error",
    });
  }
};

module.exports = {
  createProject,
  getProjects,
  getProject,
  updateProject,
  deleteProject,
};