const express = require("express");
const router = express.Router();

const authMiddleware = require(
  "../middleware/authMiddleware"
);

const {
  createCommunity,
  getCommunities,
  joinCommunity
} = require(
  "../controllers/communityController"
);

// Public Route
router.get("/", getCommunities);

// Protected Routes
router.post(
  "/",
  authMiddleware,
  createCommunity
);

router.post(
  "/:id/join",
  authMiddleware,
  joinCommunity
);

module.exports = router;