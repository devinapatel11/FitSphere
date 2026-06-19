const express = require("express");
const router = express.Router();

const authMiddleware = require(
  "../middleware/authMiddleware"
);

const {
  createChallenge,
  getChallenges,
  joinChallenge,
  getParticipants,
  getLeaderboard
} = require(
  "../controllers/challengeController"
);

router.post(
  "/",
  authMiddleware,
  createChallenge
);

router.get(
  "/",
  getChallenges
);

router.post(
  "/:id/join",
  authMiddleware,
  joinChallenge
);

router.get(
  "/:id/participants",
  getParticipants
);

router.get(
  "/:id/leaderboard",
  getLeaderboard
);

module.exports = router;