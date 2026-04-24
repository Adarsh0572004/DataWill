import express from 'express';
const router = express.Router();
import auth from '../middleware/auth.js';
import { triggerExecution, getExecutionsByUser, getExecutionById } from '../controllers/executionController.js';

router.post('/trigger/:userId', triggerExecution);
router.get('/', auth, getExecutionsByUser);
router.get('/:id', auth, getExecutionById);

export default router;
