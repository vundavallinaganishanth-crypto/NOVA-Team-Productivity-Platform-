const express = require("express");

const {
  addMember,
  removeMember,
  getMembers,
} = require("../controllers/teamController");

const protect = require("../middleware/authMiddleware");

const router = express.Router();

// All team routes require login
router.use(protect);

// Add member
router.post("/:projectId/members", addMember);

// Get project members
router.get("/:projectId/members", getMembers);

// Remove member
router.delete(
  "/:projectId/members/:userId",
  removeMember
);

module.exports = router;