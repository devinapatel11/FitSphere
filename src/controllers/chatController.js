const pool = require("../config/db");

const getCommunityMessages = async (req, res) => {
  try {
    const communityId = req.params.communityId;

    const result = await pool.query(
      `
      SELECT
        cm.id,
        cm.message,
        cm.created_at,
        u.id AS user_id,
        u.name
      FROM community_messages cm
      JOIN users u
      ON cm.user_id = u.id
      WHERE cm.community_id = $1
      ORDER BY cm.created_at ASC
      `,
      [communityId]
    );

    res.json({
      success: true,
      messages: result.rows
    });

  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch messages"
    });
  }
};

module.exports = {
  getCommunityMessages
};