const express = require("express");
const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");
const roleMiddleware = require("../middleware/roleMiddleware");

const {
  createCommunity,
  getCommunities,
  getCommunityById,
  joinCommunity,
  leaveCommunity
} = require("../controllers/communityController");

// Public Routes
router.get("/", getCommunities);
router.get("/:id", getCommunityById);

// Protected Routes
router.post(
  "/",
  authMiddleware,
  roleMiddleware("trainer", "admin"),
  createCommunity
);

router.post(
  "/:id/join",
  authMiddleware,
  joinCommunity
);

router.delete(
  "/:id/leave",
  authMiddleware,
  leaveCommunity
);

module.exports = router;