const express = require("express");
const router = express.Router();

const authMiddleware = require(
  "../middleware/authMiddleware"
);

const {
  getWeightAnalytics,
  getNutritionAnalytics,
  getCommunityAnalytics,
  getChallengeAnalytics
} = require(
  "../controllers/analyticsController"
);

router.get(
  "/weight",
  authMiddleware,
  getWeightAnalytics
);

router.get(
  "/nutrition",
  authMiddleware,
  getNutritionAnalytics
);

router.get(
  "/community",
  authMiddleware,
  getCommunityAnalytics
);

router.get(
  "/challenge",
  authMiddleware,
  getChallengeAnalytics
);

module.exports = router;