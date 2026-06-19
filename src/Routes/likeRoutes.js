const express = require("express");
const router = express.Router();

const authMiddleware = require(
  "../middleware/authMiddleware"
);

const {
  likePost,
  unlikePost,
  getLikes
} = require("../controllers/likeController");

router.post(
  "/posts/:id/like",
  authMiddleware,
  likePost
);

router.delete(
  "/posts/:id/like",
  authMiddleware,
  unlikePost
);

router.get(
  "/posts/:id/likes",
  getLikes
);

module.exports = router;