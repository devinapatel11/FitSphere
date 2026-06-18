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

const getCommunityById = async (req, res) => {
  try {
    const communityId = req.params.id;

    const result = await pool.query(
      `
      SELECT
        c.*,
        COUNT(cm.user_id) AS member_count
      FROM communities c
      LEFT JOIN community_members cm
      ON c.id = cm.community_id
      WHERE c.id = $1
      GROUP BY c.id
      `,
      [communityId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Community not found"
      });
    }

    res.json({
      success: true,
      community: result.rows[0]
    });

  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch community"
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

const leaveCommunity = async (req, res) => {
  try {
    const communityId = req.params.id;
    const userId = req.user.id;

    const result = await pool.query(
      `
      DELETE FROM community_members
      WHERE community_id = $1
      AND user_id = $2
      RETURNING *
      `,
      [communityId, userId]
    );

    if (result.rows.length === 0) {
      return res.status(400).json({
        success: false,
        message: "You are not a member of this community"
      });
    }

    res.json({
      success: true,
      message: "Community left successfully"
    });

  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Failed to leave community"
    });
  }
};

module.exports = {
  createCommunity,
  getCommunities,
  getCommunityById,
  joinCommunity,
  leaveCommunity
};