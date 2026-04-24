import Rule from '../models/Rule.js';
import Asset from '../models/Asset.js';

// @desc    Create a rule
// @route   POST /api/rules
export const createRule = async (req, res, next) => {
  try {
    const rule = await Rule.create({
      ...req.body,
      userId: req.user._id
    });

    // Update asset status to 'rule-set'
    await Asset.findOneAndUpdate(
      { _id: rule.assetId, userId: req.user._id },
      { status: 'rule-set' }
    );

    res.status(201).json(rule);
  } catch (error) {
    next(error);
  }
};

// @desc    Get all rules for current user
// @route   GET /api/rules
export const getRules = async (req, res, next) => {
  try {
    const rules = await Rule.find({ userId: req.user._id })
      .populate('assetId', 'name platform icon')
      .populate('beneficiaryId', 'name email')
      .sort({ createdAt: -1 });
    res.json(rules);
  } catch (error) {
    next(error);
  }
};

// @desc    Get rules by asset
// @route   GET /api/rules/asset/:assetId
export const getRulesByAsset = async (req, res, next) => {
  try {
    const rules = await Rule.find({
      userId: req.user._id,
      assetId: req.params.assetId
    }).populate('beneficiaryId', 'name email');
    res.json(rules);
  } catch (error) {
    next(error);
  }
};

// @desc    Update a rule
// @route   PUT /api/rules/:id
export const updateRule = async (req, res, next) => {
  try {
    const rule = await Rule.findOneAndUpdate(
      { _id: req.params.id, userId: req.user._id },
      req.body,
      { new: true, runValidators: true }
    );
    if (!rule) return res.status(404).json({ message: 'Rule not found' });
    res.json(rule);
  } catch (error) {
    next(error);
  }
};

// @desc    Delete a rule
// @route   DELETE /api/rules/:id
export const deleteRule = async (req, res, next) => {
  try {
    const rule = await Rule.findOneAndDelete({ _id: req.params.id, userId: req.user._id });
    if (!rule) return res.status(404).json({ message: 'Rule not found' });

    // Check if asset still has rules, if not reset to needs-rule
    const remaining = await Rule.countDocuments({ assetId: rule.assetId });
    if (remaining === 0) {
      await Asset.findByIdAndUpdate(rule.assetId, { status: 'needs-rule' });
    }

    res.json({ message: 'Rule removed' });
  } catch (error) {
    next(error);
  }
};
