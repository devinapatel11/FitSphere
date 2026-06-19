const pool = require("../config/db");

const getConversation = async (req, res) => {
  try {
    const currentUserId = req.user.id;
    const otherUserId = req.params.userId;

    const result = await pool.query(
      `
      SELECT *
      FROM direct_messages
      WHERE
      (
        sender_id = $1
        AND receiver_id = $2
      )
      OR
      (
        sender_id = $2
        AND receiver_id = $1
      )
      ORDER BY created_at ASC
      `,
      [currentUserId, otherUserId]
    );

    res.json({
      success: true,
      messages: result.rows
    });

  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch conversation"
    });
  }
};

module.exports = {
  getConversation
};