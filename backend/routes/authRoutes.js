const express = require('express');
const router  = express.Router();
const jwt     = require('jsonwebtoken');
const bcrypt  = require('bcryptjs');
const User    = require('../models/User');

const JWT_SECRET = process.env.JWT_SECRET || 'hxnix_grid_secret_2026';

// ── LOGIN (Open Entry) ─────────────────────────────────
// Any name + any password → auto-creates account if needed
router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ success: false, message: 'Enter both Operator ID and Access Key' });
    }

    // Check if user exists
    let user = await User.findByUsername(username);

    if (!user) {
      // Auto-create the account with whatever password they typed
      user = await User.createUser(username, password);
      console.log(`[Auth] 🆕 New operator registered: ${username}`);
    }

    // Grant access regardless of password (demo mode)
    const token = jwt.sign({ id: user.id, username: user.username }, JWT_SECRET, { expiresIn: '7d' });

    res.json({
      success: true,
      token,
      user: { id: user.id, username: user.username }
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// ── REGISTER (also open) ──────────────────────────────
router.post('/register', async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || username.length < 3) {
      return res.status(400).json({ success: false, message: 'ID must be at least 3 characters' });
    }

    const existing = await User.findByUsername(username);
    if (existing) return res.status(400).json({ success: false, message: 'Identity taken — try logging in' });

    const user = await User.createUser(username, password || 'hxnix_default');
    const token = jwt.sign({ id: user.id, username: user.username }, JWT_SECRET, { expiresIn: '7d' });

    res.status(201).json({ success: true, token, user });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;
