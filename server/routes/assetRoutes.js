import express from 'express';
import { body } from 'express-validator';
const router = express.Router();
import auth from '../middleware/auth.js';
import validate from '../middleware/validate.js';
import { createAsset, getAssets, getAssetById, updateAsset, deleteAsset } from '../controllers/assetController.js';

// All routes are protected
router.use(auth);

router.post('/', validate([
  body('name').trim().notEmpty().withMessage('Asset name is required'),
  body('type').optional().isIn(['social', 'storage', 'financial', 'creative', 'communication', 'other'])
    .withMessage('Invalid asset type')
]), createAsset);

router.get('/', getAssets);
router.get('/:id', getAssetById);
router.put('/:id', updateAsset);
router.delete('/:id', deleteAsset);

export default router;
