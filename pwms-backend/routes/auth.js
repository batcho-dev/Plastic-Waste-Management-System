const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../config/db');

router.post('/signup', async (req, res) => {
  const { full_name, email, password, phone, role } = req.body;

  try {
    const hashed = await bcrypt.hash(password, 10);

    const [result] = await db.query(
      "INSERT INTO users (full_name, email, password, phone, role) VALUES (?,?,?,?,?)",
      [full_name, email, hashed, phone || null, role || 'citizen']
    );

    res.status(201).json({ message: "Account created", userId: result.insertId });
  } catch (err) {
    console.error(err);
    if (err.code === 'ER_DUP_ENTRY') {
      return res.status(400).json({ error: "Email or phone already exists" });
    }
    res.status(500).json({ error: "Server error" });
  }
});

router.post('/login', async (req, res) => {
  const { email, password, role } = req.body; // Added role parameter

  try {
    const [rows] = await db.query("SELECT * FROM users WHERE email = ?", [email]);
    if (rows.length === 0) return res.status(401).json({ error: "Invalid credentials" });

    const user = rows[0];
    
    // Check role if specified (your frontend sends role)
    if (role && user.role !== role) {
      return res.status(403).json({
        error: `User is not a ${role}. Please select correct role.`
      });
    }

    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(401).json({ error: "Invalid credentials" });

    const token = jwt.sign(
      { id: user.id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.json({
      message: "Login successful",
      token,
      user: {
        id: user.id,
        name: user.full_name,
        role: user.role,
        points: user.points
      }
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

module.exports = router;