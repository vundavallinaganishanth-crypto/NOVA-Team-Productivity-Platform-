const Project = require("../models/Project");
const User = require("../models/User");

// Add member to project
const addMember = async (req, res) => {
  try {
    const { projectId } = req.params;
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        message: "Member email is required",
      });
    }

    // Find project
    const project = await Project.findById(projectId);

    if (!project) {
      return res.status(404).json({
        message: "Project not found",
      });
    }

    // Only owner can add members
    if (
      project.owner.toString() !==
      req.user._id.toString()
    ) {
      return res.status(403).json({
        message: "Only the project owner can add members",
      });
    }

    // Find user by email
    const user = await User.findOne({
      email: email.toLowerCase().trim(),
    });

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    // Check if already a member
    const alreadyMember = project.members.some(
      (member) =>
        member.toString() === user._id.toString()
    );

    if (alreadyMember) {
      return res.status(400).json({
        message: "User is already a project member",
      });
    }

    // Add member
    project.members.push(user._id);

    await project.save();

    const updatedProject = await Project.findById(projectId)
      .populate("owner", "name email")
      .populate("members", "name email");

    res.json({
      message: "Member added successfully",
      project: updatedProject,
    });
  } catch (error) {
    console.error("Add member error:", error);

    res.status(500).json({
      message: "Server error",
    });
  }
};


// Remove member from project
const removeMember = async (req, res) => {
  try {
    const { projectId, userId } = req.params;

    // Find project
    const project = await Project.findById(projectId);

    if (!project) {
      return res.status(404).json({
        message: "Project not found",
      });
    }

    // Only owner can remove members
    if (
      project.owner.toString() !==
      req.user._id.toString()
    ) {
      return res.status(403).json({
        message: "Only the project owner can remove members",
      });
    }

    // Cannot remove project owner
    if (
      project.owner.toString() === userId
    ) {
      return res.status(400).json({
        message: "Project owner cannot be removed",
      });
    }

    // Check member exists
    const isMember = project.members.some(
      (member) =>
        member.toString() === userId
    );

    if (!isMember) {
      return res.status(404).json({
        message: "User is not a project member",
      });
    }

    // Remove member
    project.members = project.members.filter(
      (member) =>
        member.toString() !== userId
    );

    await project.save();

    const updatedProject = await Project.findById(projectId)
      .populate("owner", "name email")
      .populate("members", "name email");

    res.json({
      message: "Member removed successfully",
      project: updatedProject,
    });
  } catch (error) {
    console.error("Remove member error:", error);

    res.status(500).json({
      message: "Server error",
    });
  }
};


// Get project members
const getMembers = async (req, res) => {
  try {
    const { projectId } = req.params;

    const project = await Project.findById(projectId)
      .populate("owner", "name email")
      .populate("members", "name email");

    if (!project) {
      return res.status(404).json({
        message: "Project not found",
      });
    }

    // Check access
    const isOwner =
      project.owner._id.toString() ===
      req.user._id.toString();

    const isMember = project.members.some(
      (member) =>
        member._id.toString() ===
        req.user._id.toString()
    );

    if (!isOwner && !isMember) {
      return res.status(403).json({
        message: "You do not have access to this project",
      });
    }

    res.json({
      owner: project.owner,
      members: project.members,
    });
  } catch (error) {
    console.error("Get members error:", error);

    res.status(500).json({
      message: "Server error",
    });
  }
};


module.exports = {
  addMember,
  removeMember,
  getMembers,
};