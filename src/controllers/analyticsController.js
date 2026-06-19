const pool = require("../config/db");

const getWeightAnalytics = async (req, res) => {
  try {

    const userId = req.user.id;

    const result = await pool.query(
      `
      SELECT
      weight,
      created_at
      FROM progress_records
      WHERE user_id = $1
      ORDER BY created_at ASC
      `,
      [userId]
    );

    res.json({
      success: true,
      weightTrend: result.rows
    });

  } catch (error) {

    console.error(error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch weight analytics"
    });

  }
};

const getNutritionAnalytics = async (req, res) => {
  try {

    const userId = req.user.id;

    const result = await pool.query(
      `
      SELECT
      SUM(calories) AS total_calories,
      SUM(protein) AS total_protein,
      SUM(carbs) AS total_carbs,
      SUM(fat) AS total_fat
      FROM nutrition_logs
      WHERE user_id = $1
      `,
      [userId]
    );

    res.json({
      success: true,
      nutritionStats: result.rows[0]
    });

  } catch (error) {

    console.error(error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch nutrition analytics"
    });

  }
};

const getCommunityAnalytics = async (req, res) => {
  try {

    const communities = await pool.query(
      `
      SELECT COUNT(*) AS total_communities
      FROM communities
      `
    );

    const members = await pool.query(
      `
      SELECT COUNT(*) AS total_memberships
      FROM community_members
      `
    );

    const posts = await pool.query(
      `
      SELECT COUNT(*) AS total_posts
      FROM posts
      `
    );

    res.json({
      success: true,
      analytics: {
        communities:
          communities.rows[0].total_communities,
        memberships:
          members.rows[0].total_memberships,
        posts:
          posts.rows[0].total_posts
      }
    });

  } catch (error) {

    console.error(error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch community analytics"
    });

  }
};

const getChallengeAnalytics = async (req, res) => {
  try {

    const challenges = await pool.query(
      `
      SELECT COUNT(*) AS total_challenges
      FROM challenges
      `
    );

    const participants = await pool.query(
      `
      SELECT COUNT(*) AS total_participants
      FROM challenge_participants
      `
    );

    res.json({
      success: true,
      analytics: {
        challenges:
          challenges.rows[0].total_challenges,
        participants:
          participants.rows[0].total_participants
      }
    });

  } catch (error) {

    console.error(error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch challenge analytics"
    });

  }
};

module.exports = {
  getWeightAnalytics,
  getNutritionAnalytics,
  getCommunityAnalytics,
  getChallengeAnalytics
};