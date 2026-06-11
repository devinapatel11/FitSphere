const pool = require("../config/db");

const createCommunity = async (req, res) => {
  try {
    const { name, description } = req.body;

    const trainerId = req.user.id;

    const result = await pool.query(
      `
      INSERT INTO communities
      (name, description, trainer_id)
      VALUES
      ($1, $2, $3)
      RETURNING *
      `,
      [name, description, trainerId]
    );

    res.status(201).json({
      success: true,
      community: result.rows[0]
    });

  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Failed to create community"
    });
  }
};

const getCommunities = async (req, res) => {
  try {
    const result = await pool.query(
      `
      SELECT *
      FROM communities
      ORDER BY created_at DESC
      `
    );

    res.json({
      success: true,
      communities: result.rows
    });

  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch communities"
    });
  }
};

const joinCommunity = async (req, res) => {
  try {
    const communityId = req.params.id;
    const userId = req.user.id;

    const existing = await pool.query(
      `
      SELECT *
      FROM community_members
      WHERE community_id = $1
      AND user_id = $2
      `,
      [communityId, userId]
    );

    if (existing.rows.length > 0) {
      return res.status(400).json({
        success: false,
        message: "Already joined"
      });
    }

    await pool.query(
      `
      INSERT INTO community_members
      (community_id, user_id)
      VALUES
      ($1, $2)
      `,
      [communityId, userId]
    );

    res.json({
      success: true,
      message: "Community joined successfully"
    });

  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Failed to join community"
    });
  }
};


module.exports = {
  createCommunity,
  getCommunities,
  joinCommunity
};