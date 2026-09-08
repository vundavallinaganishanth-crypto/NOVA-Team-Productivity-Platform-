const express = require("express");

const {
  createProject,
  getProjects,
  getProject,
  updateProject,
  deleteProject,
} = require("../controllers/projectController");

const protect = require("../middleware/authMiddleware");

const router = express.Router();

// All project routes require login
router.use(protect);

// Create project
router.post("/", createProject);

// Get all projects
router.get("/", getProjects);

// Get single project
router.get("/:id", getProject);

// Update project
router.put("/:id", updateProject);

// Delete project
router.delete("/:id", deleteProject);

module.exports = router;