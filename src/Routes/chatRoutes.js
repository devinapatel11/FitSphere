const express = require("express");
const router = express.Router();

const {
  getCommunityMessages
} = require("../controllers/chatController");

router.get(
  "/community/:communityId",
  getCommunityMessages
);

module.exports = router;