const express = require('express');
const router = express.Router();
const db = require('../config/db');
const { protect, restrictTo } = require('../middleware/auth');

// POST - Create new waste report (citizens only) - UPDATED WITH POINTS
router.post(
  '/',
  protect,
  restrictTo('citizen'),
  async (req, res) => {
    const { location, waste_type, description } = req.body;
    const reporter_id = req.user.id;

    if (!location || !waste_type) {
      return res.status(400).json({ error: 'Location and waste type are required' });
    }

    try {
      // Start a transaction to ensure both operations succeed or fail together
      const connection = await db.getConnection();
      await connection.beginTransaction();

      try {
        // 1. Insert the waste report
        const [reportResult] = await connection.query(
          `INSERT INTO waste_reports 
           (reporter_id, location, waste_type, description) 
           VALUES (?, ?, ?, ?)`,
          [reporter_id, location, waste_type, description || null]
        );

        // 2. Award points to the user (10 points per report)
        await connection.query(
          `UPDATE users SET points = COALESCE(points, 0) + 10 WHERE id = ?`,
          [reporter_id]
        );

        // 3. Get the updated user points
        const [userRows] = await connection.query(
          `SELECT points FROM users WHERE id = ?`,
          [reporter_id]
        );

        // 4. Log the activity (optional but recommended)
        await connection.query(
          `INSERT INTO user_activities 
           (user_id, activity_type, description, points_earned) 
           VALUES (?, 'report_submitted', ?, 10)`,
          [
            reporter_id,
            `Reported ${waste_type} waste at ${location}` + 
            (description ? `: ${description}` : '')
          ]
        );

        // 5. Add notification for the user
        await connection.query(
          `INSERT INTO user_notifications 
           (user_id, message, type) 
           VALUES (?, '10 points earned for reporting waste', 'points')`,
          [reporter_id]
        );

        // Commit the transaction
        await connection.commit();
        connection.release();

        res.status(201).json({
          message: 'Waste report submitted successfully',
          reportId: reportResult.insertId,
          pointsAwarded: 10,
          currentPoints: userRows[0]?.points || 0
        });

      } catch (err) {
        // Rollback the transaction if any error occurs
        await connection.rollback();
        connection.release();
        throw err;
      }
    } catch (err) {
      console.error('Report submission error:', err);
      
      if (err.code === 'ER_NO_SUCH_TABLE') {
        return res.status(500).json({ 
          error: 'Database tables not set up properly',
          hint: 'Run the SQL commands to create user_activities and user_notifications tables'
        });
      }
      
      res.status(500).json({ error: 'Failed to submit report' });
    }
  }
);

// GET - Get all my reports (for the logged-in citizen)
router.get(
  '/my-reports',
  protect,
  restrictTo('citizen'),
  async (req, res) => {
    const userId = req.user.id;

    try {
      const [reports] = await db.query(
        `SELECT id, location, waste_type, description, status, created_at
         FROM waste_reports 
         WHERE reporter_id = ?
         ORDER BY created_at DESC`,
        [userId]
      );

      res.json(reports);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Failed to fetch reports' });
    }
  }
);

// GET - Get all reports (Admin/Collector view)
router.get(
  '/',
  protect,
  restrictTo('admin', 'collector'),
  async (req, res) => {
    try {
      const [reports] = await db.query(
        `SELECT r.id, r.location, r.waste_type, r.status, r.created_at,
                u.full_name AS reporter_name, u.points AS reporter_points
         FROM waste_reports r
         JOIN users u ON r.reporter_id = u.id
         ORDER BY r.created_at DESC`
      );
      res.json(reports);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Failed to fetch all reports' });
    }
  }
);

// NEW: GET - Get report statistics for the logged-in user
router.get(
  '/stats',
  protect,
  restrictTo('citizen'),
  async (req, res) => {
    const userId = req.user.id;

    try {
      const [stats] = await db.query(
        `SELECT 
          COUNT(*) as total_reports,
          SUM(CASE WHEN status = 'pending' THEN 1 ELSE 0 END) as pending_reports,
          SUM(CASE WHEN status = 'resolved' THEN 1 ELSE 0 END) as resolved_reports,
          SUM(CASE WHEN status = 'cancelled' THEN 1 ELSE 0 END) as cancelled_reports,
          MAX(created_at) as last_report_date
         FROM waste_reports 
         WHERE reporter_id = ?`,
        [userId]
      );

      // Get user's current points
      const [userRows] = await db.query(
        `SELECT points FROM users WHERE id = ?`,
        [userId]
      );

      res.json({
        ...stats[0],
        currentPoints: userRows[0]?.points || 0
      });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Failed to fetch report statistics' });
    }
  }
);

// NEW: GET - Get recent activity for the user
router.get(
  '/recent-activity',
  protect,
  async (req, res) => {
    const userId = req.user.id;
    const limit = parseInt(req.query.limit) || 5;

    try {
      // Get recent reports
      const [reports] = await db.query(
        `SELECT 'report' as type, location, waste_type, status, created_at
         FROM waste_reports 
         WHERE reporter_id = ?
         ORDER BY created_at DESC
         LIMIT ?`,
        [userId, limit]
      );

      // Format the response
      const activities = reports.map(report => ({
        type: report.type,
        description: `Reported ${report.waste_type} waste at ${report.location}`,
        status: report.status,
        date: report.created_at,
        icon: '📝'
      }));

      res.json(activities);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Failed to fetch recent activity' });
    }
  }
);

module.exports = router;