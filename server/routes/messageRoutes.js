import express from 'express';
const router = express.Router();
import auth from '../middleware/auth.js';
import Message from '../models/Message.js';

router.use(auth);

router.post('/', async (req, res, next) => {
  try {
    const msg = await Message.create({ ...req.body, userId: req.user._id });
    res.status(201).json(msg);
  } catch (error) { next(error); }
});

router.get('/', async (req, res, next) => {
  try {
    const messages = await Message.find({ userId: req.user._id })
      .populate('recipientContactId', 'name email').sort({ createdAt: -1 });
    res.json(messages);
  } catch (error) { next(error); }
});

router.put('/:id', async (req, res, next) => {
  try {
    const msg = await Message.findOneAndUpdate(
      { _id: req.params.id, userId: req.user._id }, req.body, { new: true, runValidators: true }
    );
    if (!msg) return res.status(404).json({ message: 'Message not found' });
    res.json(msg);
  } catch (error) { next(error); }
});

router.delete('/:id', async (req, res, next) => {
  try {
    const msg = await Message.findOneAndDelete({ _id: req.params.id, userId: req.user._id });
    if (!msg) return res.status(404).json({ message: 'Message not found' });
    res.json({ message: 'Message removed' });
  } catch (error) { next(error); }
});

export default router;
