import express from 'express';
const router = express.Router();
import auth from '../middleware/auth.js';
import WillVersion from '../models/WillVersion.js';
import Rule from '../models/Rule.js';

router.use(auth);

// Get all versions
router.get('/', async (req, res, next) => {
  try {
    const versions = await WillVersion.find({ userId: req.user._id }).sort({ version: -1 });
    res.json(versions);
  } catch (error) { next(error); }
});

// Get single version
router.get('/:id', async (req, res, next) => {
  try {
    const ver = await WillVersion.findOne({ _id: req.params.id, userId: req.user._id });
    if (!ver) return res.status(404).json({ message: 'Version not found' });
    res.json(ver);
  } catch (error) { next(error); }
});

// Manually create a snapshot
router.post('/snapshot', async (req, res, next) => {
  try {
    const rules = await Rule.find({ userId: req.user._id }).populate('assetId', 'name').populate('beneficiaryId', 'name email');
    const lastVersion = await WillVersion.findOne({ userId: req.user._id }).sort({ version: -1 });
    const newVersion = (lastVersion?.version || 0) + 1;

    const ver = await WillVersion.create({
      userId: req.user._id,
      version: newVersion,
      snapshot: rules,
      changeSummary: req.body.changeSummary || `Manual snapshot v${newVersion}`
    });
    res.status(201).json(ver);
  } catch (error) { next(error); }
});

export default router;
