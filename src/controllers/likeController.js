const pool = require("../config/db");

const likePost = async (req, res) => {
  try {
    const postId = req.params.id;
    const userId = req.user.id;

    const existing = await pool.query(
      `
      SELECT *
      FROM post_likes
      WHERE post_id = $1
      AND user_id = $2
      `,
      [postId, userId]
    );

    if (existing.rows.length > 0) {
      return res.status(400).json({
        success: false,
        message: "Post already liked"
      });
    }

    await pool.query(
      `
      INSERT INTO post_likes
      (post_id, user_id)
      VALUES
      ($1, $2)
      `,
      [postId, userId]
    );

    res.json({
      success: true,
      message: "Post liked successfully"
    });

  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Failed to like post"
    });
  }
};

const unlikePost = async (req, res) => {
  try {
    const postId = req.params.id;
    const userId = req.user.id;

    await pool.query(
      `
      DELETE FROM post_likes
      WHERE post_id = $1
      AND user_id = $2
      `,
      [postId, userId]
    );

    res.json({
      success: true,
      message: "Post unliked successfully"
    });

  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Failed to unlike post"
    });
  }
};

const getLikes = async (req, res) => {
  try {
    const postId = req.params.id;

    const result = await pool.query(
      `
      SELECT COUNT(*) AS like_count
      FROM post_likes
      WHERE post_id = $1
      `,
      [postId]
    );

    res.json({
      success: true,
      likes: result.rows[0]
    });

  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch likes"
    });
  }
};

module.exports = {
  likePost,
  unlikePost,
  getLikes
};