import express from 'express';
import { body } from 'express-validator';
const router = express.Router();
import auth from '../middleware/auth.js';
import validate from '../middleware/validate.js';
import { createRule, getRules, getRulesByAsset, updateRule, deleteRule } from '../controllers/ruleController.js';

router.use(auth);

router.post('/', validate([
  body('assetId').notEmpty().withMessage('Asset is required'),
  body('action').isIn(['transfer', 'delete', 'archive', 'memorialize', 'schedule-message'])
    .withMessage('Invalid action type')
]), createRule);

router.get('/', getRules);
router.get('/asset/:assetId', getRulesByAsset);
router.put('/:id', updateRule);
router.delete('/:id', deleteRule);

export default router;
