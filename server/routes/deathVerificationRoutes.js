import express from 'express';
const router = express.Router();
import auth from '../middleware/auth.js';
import { fileReport, confirmReport, challengeReport, getReportStatus, getReportsByUser } from '../controllers/deathVerificationController.js';

router.post('/', fileReport);
router.post('/:id/confirm', confirmReport);
router.post('/:id/challenge', auth, challengeReport);
router.get('/:id', getReportStatus);
router.get('/', auth, getReportsByUser);

export default router;
