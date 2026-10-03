const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const Notification = require('../models/Notification');

// Helper to extract user identifier from query or Bearer token
function getUserIdentifier(req) {
  if (req.query.userId) return req.query.userId.trim();

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      const token = req.headers.authorization.split(' ')[1];
      const secret = process.env.JWT_SECRET || 'beyond_barriers_super_secret_jwt_key_2026';
      const decoded = jwt.verify(token, secret);
      return decoded.identifier || decoded.id;
    } catch (e) {}
  }
  return null;
}

// 1. GET /notifications - Fetch notifications for active user
router.get('/', async (req, res) => {
  try {
    const userId = getUserIdentifier(req);

    let query = {};
    if (userId) {
      query = {
        $or: [
          { userId: userId },
          { userId: userId.toUpperCase() }
        ]
      };
    }

    let notifications = await Notification.find(query).sort({ timestamp: -1 }).limit(20);

    // If empty, generate a welcome notification
    if (notifications.length === 0 && userId) {
      const isTeacher = userId.startsWith('FAC') || userId.includes('TEACH');
      const welcome = await Notification.create({
        userId,
        title: isTeacher ? 'Advisory Dashboard Active' : 'Personalized Support Active',
        message: isTeacher
          ? 'Welcome to the Beyond Barriers Faculty portal. Student cohort is synced with MongoDB.'
          : 'Welcome to Beyond Barriers. Your profile is connected to institutional support & career tracks.',
        type: 'system',
        read: false,
        timestamp: new Date()
      });
      notifications = [welcome];
    }

    const unreadCount = notifications.filter(n => !n.read).length;

    return res.json({
      notifications,
      unreadCount
    });
  } catch (err) {
    console.error('Fetch notifications error:', err);
    return res.status(500).json({ message: 'Server error fetching notifications', error: err.message });
  }
});

// 2. PATCH /notifications/:id/read - Mark individual notification as read
router.patch('/:id/read', async (req, res) => {
  try {
    const notif = await Notification.findByIdAndUpdate(
      req.params.id,
      { read: true },
      { new: true }
    );
    if (!notif) {
      return res.status(404).json({ message: 'Notification not found' });
    }
    return res.json({ message: 'Notification marked as read', notification: notif });
  } catch (err) {
    console.error('Update notification error:', err);
    return res.status(500).json({ message: 'Server error updating notification', error: err.message });
  }
});

// 3. POST /notifications/read-all - Mark all notifications as read
router.post('/read-all', async (req, res) => {
  try {
    const userId = getUserIdentifier(req) || req.body.userId;
    const query = userId ? { userId } : {};

    await Notification.updateMany(query, { read: true });
    return res.json({ message: 'All notifications marked as read' });
  } catch (err) {
    console.error('Mark all read error:', err);
    return res.status(500).json({ message: 'Server error marking notifications read', error: err.message });
  }
});

// 4. POST /notifications - Create notification manually
router.post('/', async (req, res) => {
  try {
    const { userId, title, message, type } = req.body;
    if (!userId || !title || !message) {
      return res.status(400).json({ message: 'userId, title, and message are required' });
    }

    const notif = await Notification.create({
      userId: userId.trim(),
      title: title.trim(),
      message: message.trim(),
      type: type || 'system',
      read: false,
      timestamp: new Date()
    });

    return res.status(201).json(notif);
  } catch (err) {
    console.error('Create notification error:', err);
    return res.status(500).json({ message: 'Server error creating notification', error: err.message });
  }
});

module.exports = router;
