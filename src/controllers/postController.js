const pool = require("../config/db");

const createPost = async (req, res) => {
  try {
    const { community_id, content } = req.body;

    const userId = req.user.id;

    const result = await pool.query(
      `
      INSERT INTO posts
      (community_id, user_id, content)
      VALUES
      ($1, $2, $3)
      RETURNING *
      `,
      [community_id, userId, content]
    );

    res.status(201).json({
      success: true,
      post: result.rows[0]
    });

  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Failed to create post"
    });
  }
};

const getCommunityPosts = async (req, res) => {
  try {
    const communityId = req.params.communityId;

    const result = await pool.query(
      `
      SELECT
        p.*,
        u.name
      FROM posts p
      JOIN users u
      ON p.user_id = u.id
      WHERE p.community_id = $1
      ORDER BY p.created_at DESC
      `,
      [communityId]
    );

    res.json({
      success: true,
      posts: result.rows
    });

  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch posts"
    });
  }
};

const deletePost = async (req, res) => {
  try {
    const postId = req.params.id;
    const userId = req.user.id;

    const result = await pool.query(
      `
      DELETE FROM posts
      WHERE id = $1
      AND user_id = $2
      RETURNING *
      `,
      [postId, userId]
    );

    if (result.rows.length === 0) {
      return res.status(403).json({
        success: false,
        message: "You can only delete your own posts"
      });
    }

    res.json({
      success: true,
      message: "Post deleted successfully"
    });

  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Failed to delete post"
    });
  }
};

module.exports = {
  createPost,
  getCommunityPosts,
  deletePost
};