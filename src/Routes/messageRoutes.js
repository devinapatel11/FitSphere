const express = require("express");
const router = express.Router();

const authMiddleware = require(
  "../middleware/authMiddleware"
);

const {
  getConversation
} = require(
  "../controllers/messageController"
);

router.get(
  "/:userId",
  authMiddleware,
  getConversation
);

module.exports = router;