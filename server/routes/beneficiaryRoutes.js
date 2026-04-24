import express from 'express';
const router = express.Router();
import jwt from 'jsonwebtoken';
import Execution from '../models/Execution.js';
import Rule from '../models/Rule.js';
import Contact from '../models/Contact.js';

// @desc    Get beneficiary portal data via token
// @route   GET /api/beneficiary/portal/:token
router.get('/portal/:token', async (req, res, next) => {
  try {
    const decoded = jwt.verify(req.params.token, process.env.JWT_SECRET);
    const { userId, contactId } = decoded;

    const contact = await Contact.findById(contactId);
    if (!contact) return res.status(404).json({ message: 'Beneficiary not found' });

    // Get all rules where this contact is the beneficiary
    const rules = await Rule.find({ userId, beneficiaryId: contactId })
      .populate('assetId', 'name icon platform type');

    // Get execution status for those rules
    const executions = await Promise.all(rules.map(async (rule) => {
      const exec = await Execution.findOne({ ruleId: rule._id });
      return {
        assetName: rule.assetId?.name || 'Unknown Asset',
        assetIcon: rule.assetId?.icon || '📦',
        action: rule.action,
        description: rule.description,
        status: exec?.status || 'pending',
        executedAt: exec?.executedAt || null
      };
    }));

    res.json({
      beneficiary: { name: contact.name, email: contact.email },
      executions
    });
  } catch (error) {
    if (error.name === 'JsonWebTokenError' || error.name === 'TokenExpiredError') {
      return res.status(401).json({ message: 'This link has expired or is invalid.' });
    }
    next(error);
  }
});

export default router;
