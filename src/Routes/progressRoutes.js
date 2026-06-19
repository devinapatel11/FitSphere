const express = require("express");
const router = express.Router();

const authMiddleware = require(
  "../middleware/authMiddleware"
);

const {
  addProgressRecord,
  getProgressRecords,
  deleteProgressRecord
} = require(
  "../controllers/progressController"
);

router.post(
  "/",
  authMiddleware,
  addProgressRecord
);

router.get(
  "/",
  authMiddleware,
  getProgressRecords
);

router.delete(
  "/:id",
  authMiddleware,
  deleteProgressRecord
);

module.exports = router;