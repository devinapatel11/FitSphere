const pool = require("../config/db");

const getMembers = async (req, res) => {
  try {
    const trainerId = req.user.id;

    const result = await pool.query(
      `
      SELECT
      u.id,
      u.name,
      u.email,
      up.allow_progress,
      up.allow_nutrition
      FROM user_permissions up
      JOIN users u
      ON up.user_id = u.id
      WHERE up.trainer_id = $1
      `,
      [trainerId]
    );

    res.json({
      success: true,
      members: result.rows
    });

  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch members"
    });
  }
};

const getMemberProgress = async (req, res) => {
  try {
    const trainerId = req.user.id;
    const memberId = req.params.userId;

    const permission = await pool.query(
      `
      SELECT *
      FROM user_permissions
      WHERE trainer_id = $1
      AND user_id = $2
      AND allow_progress = true
      `,
      [trainerId, memberId]
    );

    if (permission.rows.length === 0) {
      return res.status(403).json({
        success: false,
        message: "Access denied"
      });
    }

    const result = await pool.query(
      `
      SELECT *
      FROM progress_records
      WHERE user_id = $1
      ORDER BY created_at DESC
      `,
      [memberId]
    );

    res.json({
      success: true,
      progress: result.rows
    });

  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch progress"
    });
  }
};

const getMemberNutrition = async (req, res) => {
  try {
    const trainerId = req.user.id;
    const memberId = req.params.userId;

    const permission = await pool.query(
      `
      SELECT *
      FROM user_permissions
      WHERE trainer_id = $1
      AND user_id = $2
      AND allow_nutrition = true
      `,
      [trainerId, memberId]
    );

    if (permission.rows.length === 0) {
      return res.status(403).json({
        success: false,
        message: "Access denied"
      });
    }

    const result = await pool.query(
      `
      SELECT *
      FROM nutrition_logs
      WHERE user_id = $1
      ORDER BY created_at DESC
      `,
      [memberId]
    );

    res.json({
      success: true,
      nutrition: result.rows
    });

  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch nutrition"
    });
  }
};

module.exports = {
  getMembers,
  getMemberProgress,
  getMemberNutrition
};