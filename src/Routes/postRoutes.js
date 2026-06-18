const express = require("express");
const router = express.Router();

const authMiddleware = require(
  "../middleware/authMiddleware"
);

const {
  createPost,
  getCommunityPosts,
  deletePost
} = require("../controllers/postController");

// Protected Routes
router.post(
  "/",
  authMiddleware,
  createPost
);

router.delete(
  "/:id",
  authMiddleware,
  deletePost
);

// Public Route
router.get(
  "/community/:communityId",
  getCommunityPosts
);

module.exports = router;