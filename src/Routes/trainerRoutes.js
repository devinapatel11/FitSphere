const express = require("express");
const router = express.Router();

const authMiddleware = require(
  "../middleware/authMiddleware"
);

const roleMiddleware = require(
  "../middleware/roleMiddleware"
);

const {
  getMembers,
  getMemberProgress,
  getMemberNutrition
} = require(
  "../controllers/trainerController"
);

router.get(
  "/members",
  authMiddleware,
  roleMiddleware("trainer", "admin"),
  getMembers
);

router.get(
  "/member/:userId/progress",
  authMiddleware,
  roleMiddleware("trainer", "admin"),
  getMemberProgress
);

router.get(
  "/member/:userId/nutrition",
  authMiddleware,
  roleMiddleware("trainer", "admin"),
  getMemberNutrition
);

module.exports = router;