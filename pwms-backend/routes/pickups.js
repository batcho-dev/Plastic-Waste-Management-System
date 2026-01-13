const express = require('express');
const router = express.Router();
const db = require('../config/db');
const { protect, restrictTo } = require('../middleware/auth');

// POST - Create new pickup request (citizens only)
// CHANGED FROM '/' TO '/schedule' TO MATCH FRONTEND
router.post(
  '/schedule',
  protect,
  restrictTo('citizen'),
  async (req, res) => {
    const { pickup_date, pickup_time, address, notes } = req.body;
    const user_id = req.user.id;

    if (!pickup_date || !pickup_time || !address) {
      return res.status(400).json({
        error: 'Pickup date, time and address are required'
      });
    }

    try {
      const [result] = await db.query(
        `INSERT INTO pickup_requests 
         (user_id, pickup_date, pickup_time, address, notes) 
         VALUES (?, ?, ?, ?, ?)`,
        [user_id, pickup_date, pickup_time, address, notes || null]
      );

      res.status(201).json({
        message: 'Pickup request created successfully',
        pickupId: result.insertId
      });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Failed to create pickup request' });
    }
  }
);

// GET - Get my pickup requests (citizen view)
// Your frontend expects: GET /api/pickups/my-pickups
router.get(
  '/my-pickups',
  protect,
  restrictTo('citizen'),
  async (req, res) => {
    const userId = req.user.id;

    try {
      const [pickups] = await db.query(
        `SELECT id, pickup_date, pickup_time, address, status, points_earned, created_at
         FROM pickup_requests
         WHERE user_id = ?
         ORDER BY created_at DESC`,
        [userId]
      );

      res.json(pickups);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Failed to fetch your pickups' });
    }
  }
);

// GET - Get pending pickups (for collectors)
router.get(
  '/pending',
  protect,
  restrictTo('collector'),
  async (req, res) => {
    try {
      const [pickups] = await db.query(
        `SELECT p.id, p.pickup_date, p.pickup_time, p.address, p.notes, p.status,
                u.full_name AS citizen_name, u.phone AS citizen_phone
         FROM pickup_requests p
         JOIN users u ON p.user_id = u.id
         WHERE p.status = 'pending'
         ORDER BY p.created_at ASC`
      );

      res.json(pickups);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Failed to fetch pending pickups' });
    }
  }
);

// ADD THIS NEW ENDPOINT - Your frontend might need it
// GET - Get available pickups for collectors (alternative to /pending)
router.get(
  '/available',
  protect,
  restrictTo('collector', 'admin'),
  async (req, res) => {
    try {
      const [pickups] = await db.query(
        `SELECT p.id, p.pickup_date, p.pickup_time, p.address, p.notes, p.status,
                u.full_name AS citizen_name, u.phone AS citizen_phone
         FROM pickup_requests p
         JOIN users u ON p.user_id = u.id
         WHERE p.status = 'pending' AND p.collector_id IS NULL
         ORDER BY p.created_at ASC`
      );

      res.json(pickups);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Failed to fetch available pickups' });
    }
  }
);

module.exports = router;