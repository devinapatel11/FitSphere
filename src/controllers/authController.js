const jwt = require("jsonwebtoken");
const pool = require("../config/db");
const bcrypt = require("bcrypt");

const signup = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    const existingUser = await pool.query(
      "SELECT * FROM users WHERE email = $1",
      [email]
    );

    if (existingUser.rows.length > 0) {
      return res.status(400).json({
        success: false,
        message: "Email already exists"
      });
    }

    const hashedPassword = await bcrypt.hash(
      password,
      10
    );

    await pool.query(
      `
      INSERT INTO users
      (name,email,password,role)
      VALUES
      ($1,$2,$3,$4)
      `,
      [
        name,
        email,
        hashedPassword,
        role
      ]
    );

    res.status(201).json({
      success: true,
      message: "User created successfully"
    });

  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Server error"
    });
  }
};
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const userResult = await pool.query(
      "SELECT * FROM users WHERE email = $1",
      [email]
    );

    if (userResult.rows.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Invalid credentials"
      });
    }

    const user = userResult.rows[0];

    const isMatch = await bcrypt.compare(
      password,
      user.password
    );

    if (!isMatch) {
      return res.status(400).json({
        success: false,
        message: "Invalid credentials"
      });
    }

    const token = jwt.sign(
      {
        id: user.id,
        email: user.email,
        role: user.role
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "7d"
      }
    );

    res.json({
      success: true,
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });

  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Server error"
    });
  }
};
const profile = async (req, res) => {
  res.json({
    success: true,
    user: req.user
  });
};
module.exports = {
  signup,
  login,
  profile
};