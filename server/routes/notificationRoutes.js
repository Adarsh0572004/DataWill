import express from 'express';
const router = express.Router();
import auth from '../middleware/auth.js';
import Notification from '../models/Notification.js';

router.get('/', auth, async (req, res, next) => {
  try {
    const notifications = await Notification.find({ userId: req.user._id }).sort({ createdAt: -1 }).limit(50);
    res.json(notifications);
  } catch (error) { next(error); }
});

router.put('/:id/read', auth, async (req, res, next) => {
  try {
    const notif = await Notification.findOneAndUpdate(
      { _id: req.params.id, userId: req.user._id },
      { read: true },
      { new: true }
    );
    if (!notif) return res.status(404).json({ message: 'Notification not found' });
    res.json(notif);
  } catch (error) { next(error); }
});

export default router;
