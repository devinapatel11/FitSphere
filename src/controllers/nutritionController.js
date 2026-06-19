const pool = require("../config/db");

const addNutritionLog = async (req, res) => {
  try {
    const userId = req.user.id;

    const {
      meal_type,
      food_name,
      quantity,
      calories,
      protein,
      carbs,
      fat,
      fiber
    } = req.body;

    const result = await pool.query(
      `
      INSERT INTO nutrition_logs
      (
        user_id,
        meal_type,
        food_name,
        quantity,
        calories,
        protein,
        carbs,
        fat,
        fiber
      )
      VALUES
      ($1,$2,$3,$4,$5,$6,$7,$8,$9)
      RETURNING *
      `,
      [
        userId,
        meal_type,
        food_name,
        quantity,
        calories,
        protein,
        carbs,
        fat,
        fiber
      ]
    );

    res.status(201).json({
      success: true,
      nutritionLog: result.rows[0]
    });

  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Failed to add nutrition log"
    });
  }
};

const getNutritionLogs = async (req, res) => {
  try {
    const userId = req.user.id;

    const result = await pool.query(
      `
      SELECT *
      FROM nutrition_logs
      WHERE user_id = $1
      ORDER BY created_at DESC
      `,
      [userId]
    );

    res.json({
      success: true,
      nutritionLogs: result.rows
    });

  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch nutrition logs"
    });
  }
};

const deleteNutritionLog = async (req, res) => {
  try {
    const logId = req.params.id;
    const userId = req.user.id;

    const result = await pool.query(
      `
      DELETE FROM nutrition_logs
      WHERE id = $1
      AND user_id = $2
      RETURNING *
      `,
      [logId, userId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Nutrition log not found"
      });
    }

    res.json({
      success: true,
      message: "Nutrition log deleted successfully"
    });

  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Failed to delete nutrition log"
    });
  }
};

module.exports = {
  addNutritionLog,
  getNutritionLogs,
  deleteNutritionLog
};