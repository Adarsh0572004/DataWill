import express from 'express';
const router = express.Router();
import auth from '../middleware/auth.js';
import AuditLog from '../models/AuditLog.js';

router.get('/', auth, async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 25;
    const skip = (page - 1) * limit;

    const [logs, total] = await Promise.all([
      AuditLog.find({ userId: req.user._id }).sort({ timestamp: -1 }).skip(skip).limit(limit),
      AuditLog.countDocuments({ userId: req.user._id })
    ]);

    res.json({ logs, total, page, pages: Math.ceil(total / limit) });
  } catch (error) { next(error); }
});

export default router;
