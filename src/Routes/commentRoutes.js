const express = require("express");
const router = express.Router();

const authMiddleware = require(
  "../middleware/authMiddleware"
);

const {
  createComment,
  getComments,
  deleteComment
} = require("../controllers/commentController");

router.post(
  "/posts/:id/comment",
  authMiddleware,
  createComment
);

router.get(
  "/posts/:id/comments",
  getComments
);

router.delete(
  "/comments/:id",
  authMiddleware,
  deleteComment
);

module.exports = router;