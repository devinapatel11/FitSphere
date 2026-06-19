const pool = require("../config/db");

const grantPermission = async (req, res) => {
  try {
    const userId = req.user.id;

    const {
      trainer_id,
      allow_progress,
      allow_nutrition
    } = req.body;

    const result = await pool.query(
      `
      INSERT INTO user_permissions
      (
        user_id,
        trainer_id,
        allow_progress,
        allow_nutrition
      )
      VALUES
      ($1,$2,$3,$4)
      RETURNING *
      `,
      [
        userId,
        trainer_id,
        allow_progress,
        allow_nutrition
      ]
    );

    res.status(201).json({
      success: true,
      permission: result.rows[0]
    });

  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Failed to grant permission"
    });
  }
};

const getPermissions = async (req, res) => {
  try {
    const userId = req.user.id;

    const result = await pool.query(
      `
      SELECT *
      FROM user_permissions
      WHERE user_id = $1
      `,
      [userId]
    );

    res.json({
      success: true,
      permissions: result.rows
    });

  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch permissions"
    });
  }
};

const updatePermission = async (req, res) => {
  try {
    const permissionId = req.params.id;
    const userId = req.user.id;

    const {
      allow_progress,
      allow_nutrition
    } = req.body;

    const result = await pool.query(
      `
      UPDATE user_permissions
      SET
      allow_progress = $1,
      allow_nutrition = $2
      WHERE id = $3
      AND user_id = $4
      RETURNING *
      `,
      [
        allow_progress,
        allow_nutrition,
        permissionId,
        userId
      ]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Permission not found"
      });
    }

    res.json({
      success: true,
      permission: result.rows[0]
    });

  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Failed to update permission"
    });
  }
};

const deletePermission = async (req, res) => {
  try {
    const permissionId = req.params.id;
    const userId = req.user.id;

    const result = await pool.query(
      `
      DELETE FROM user_permissions
      WHERE id = $1
      AND user_id = $2
      RETURNING *
      `,
      [permissionId, userId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Permission not found"
      });
    }

    res.json({
      success: true,
      message: "Permission removed successfully"
    });

  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Failed to delete permission"
    });
  }
};

module.exports = {
  grantPermission,
  getPermissions,
  updatePermission,
  deletePermission
};