const pool = require("../config/db");

const createComment = async (req, res) => {
  try {
    const postId = req.params.id;
    const userId = req.user.id;
    const { content } = req.body;

    const result = await pool.query(
      `
      INSERT INTO comments
      (post_id, user_id, content)
      VALUES
      ($1, $2, $3)
      RETURNING *
      `,
      [postId, userId, content]
    );

    res.status(201).json({
      success: true,
      comment: result.rows[0]
    });

  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Failed to create comment"
    });
  }
};

const getComments = async (req, res) => {
  try {
    const postId = req.params.id;

    const result = await pool.query(
      `
      SELECT
        c.*,
        u.name
      FROM comments c
      JOIN users u
      ON c.user_id = u.id
      WHERE c.post_id = $1
      ORDER BY c.created_at ASC
      `,
      [postId]
    );

    res.json({
      success: true,
      comments: result.rows
    });

  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch comments"
    });
  }
};

const deleteComment = async (req, res) => {
  try {
    const commentId = req.params.id;
    const userId = req.user.id;

    const result = await pool.query(
      `
      DELETE FROM comments
      WHERE id = $1
      AND user_id = $2
      RETURNING *
      `,
      [commentId, userId]
    );

    if (result.rows.length === 0) {
      return res.status(403).json({
        success: false,
        message: "You can only delete your own comments"
      });
    }

    res.json({
      success: true,
      message: "Comment deleted successfully"
    });

  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Failed to delete comment"
    });
  }
};

module.exports = {
  createComment,
  getComments,
  deleteComment
};