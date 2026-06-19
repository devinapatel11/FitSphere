const pool = require("../config/db");

const addProgressRecord = async (req, res) => {
  try {
    const userId = req.user.id;

    const {
      weight,
      chest,
      waist,
      hips,
      notes
    } = req.body;

    const result = await pool.query(
      `
      INSERT INTO progress_records
      (
        user_id,
        weight,
        chest,
        waist,
        hips,
        notes
      )
      VALUES
      ($1,$2,$3,$4,$5,$6)
      RETURNING *
      `,
      [
        userId,
        weight,
        chest,
        waist,
        hips,
        notes
      ]
    );

    res.status(201).json({
      success: true,
      progress: result.rows[0]
    });

  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Failed to add progress record"
    });
  }
};

const getProgressRecords = async (req, res) => {
  try {
    const userId = req.user.id;

    const result = await pool.query(
      `
      SELECT *
      FROM progress_records
      WHERE user_id = $1
      ORDER BY created_at DESC
      `,
      [userId]
    );

    res.json({
      success: true,
      progressRecords: result.rows
    });

  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch progress records"
    });
  }
};

const deleteProgressRecord = async (req, res) => {
  try {
    const recordId = req.params.id;
    const userId = req.user.id;

    const result = await pool.query(
      `
      DELETE FROM progress_records
      WHERE id = $1
      AND user_id = $2
      RETURNING *
      `,
      [recordId, userId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Progress record not found"
      });
    }

    res.json({
      success: true,
      message: "Progress record deleted successfully"
    });

  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Failed to delete progress record"
    });
  }
};

module.exports = {
  addProgressRecord,
  getProgressRecords,
  deleteProgressRecord
};