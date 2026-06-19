const express = require("express");
const router = express.Router();

const authMiddleware = require(
  "../middleware/authMiddleware"
);

const {
  grantPermission,
  getPermissions,
  updatePermission,
  deletePermission
} = require(
  "../controllers/permissionController"
);

router.post(
  "/",
  authMiddleware,
  grantPermission
);

router.get(
  "/",
  authMiddleware,
  getPermissions
);

router.put(
  "/:id",
  authMiddleware,
  updatePermission
);

router.delete(
  "/:id",
  authMiddleware,
  deletePermission
);

module.exports = router;