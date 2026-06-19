const express = require("express");
const router = express.Router();

const authMiddleware = require(
  "../middleware/authMiddleware"
);

const {
  addNutritionLog,
  getNutritionLogs,
  deleteNutritionLog
} = require(
  "../controllers/nutritionController"
);

router.post(
  "/",
  authMiddleware,
  addNutritionLog
);

router.get(
  "/",
  authMiddleware,
  getNutritionLogs
);

router.delete(
  "/:id",
  authMiddleware,
  deleteNutritionLog
);

module.exports = router;