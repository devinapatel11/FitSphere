const pool = require("../config/db");

const createChallenge = async (req, res) => {
  try {
    const { title, description, start_date, end_date } =
      req.body;

    const createdBy = req.user.id;

    const result = await pool.query(
      `
      INSERT INTO challenges
      (
        title,
        description,
        start_date,
        end_date,
        created_by
      )
      VALUES
      ($1,$2,$3,$4,$5)
      RETURNING *
      `,
      [
        title,
        description,
        start_date,
        end_date,
        createdBy
      ]
    );

    res.status(201).json({
      success: true,
      challenge: result.rows[0]
    });

  } catch (error) {

    console.error(error);

    res.status(500).json({
      success: false,
      message: "Failed to create challenge"
    });

  }
};

const getChallenges = async (req, res) => {
  try {

    const result = await pool.query(
      `
      SELECT *
      FROM challenges
      ORDER BY created_at DESC
      `
    );

    res.json({
      success: true,
      challenges: result.rows
    });

  } catch (error) {

    console.error(error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch challenges"
    });

  }
};

const joinChallenge = async (req, res) => {
  try {

    const challengeId = req.params.id;
    const userId = req.user.id;

    const existing = await pool.query(
      `
      SELECT *
      FROM challenge_participants
      WHERE challenge_id = $1
      AND user_id = $2
      `,
      [challengeId, userId]
    );

    if (existing.rows.length > 0) {
      return res.status(400).json({
        success: false,
        message: "Already joined challenge"
      });
    }

    await pool.query(
      `
      INSERT INTO challenge_participants
      (
        challenge_id,
        user_id
      )
      VALUES
      ($1,$2)
      `,
      [challengeId, userId]
    );

    res.json({
      success: true,
      message: "Challenge joined successfully"
    });

  } catch (error) {

    console.error(error);

    res.status(500).json({
      success: false,
      message: "Failed to join challenge"
    });

  }
};

const getParticipants = async (req, res) => {
  try {

    const challengeId = req.params.id;

    const result = await pool.query(
      `
      SELECT
      u.id,
      u.name,
      u.email
      FROM challenge_participants cp
      JOIN users u
      ON cp.user_id = u.id
      WHERE cp.challenge_id = $1
      `,
      [challengeId]
    );

    res.json({
      success: true,
      participants: result.rows
    });

  } catch (error) {

    console.error(error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch participants"
    });

  }
};

const getLeaderboard = async (req, res) => {
  try {

    const challengeId = req.params.id;

    const result = await pool.query(
      `
      SELECT
      u.id,
      u.name,
      COUNT(cp.user_id) AS score
      FROM challenge_participants cp
      JOIN users u
      ON cp.user_id = u.id
      WHERE cp.challenge_id = $1
      GROUP BY u.id, u.name
      ORDER BY score DESC
      `,
      [challengeId]
    );

    res.json({
      success: true,
      leaderboard: result.rows
    });

  } catch (error) {

    console.error(error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch leaderboard"
    });

  }
};

module.exports = {
  createChallenge,
  getChallenges,
  joinChallenge,
  getParticipants,
  getLeaderboard
};