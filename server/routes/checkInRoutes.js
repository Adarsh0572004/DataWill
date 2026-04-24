import express from 'express';
const router = express.Router();
import auth from '../middleware/auth.js';
import { getCheckInStatus, performCheckIn, updateFrequency, snoozeCheckIn } from '../controllers/checkInController.js';

router.use(auth);
router.get('/', getCheckInStatus);
router.post('/', performCheckIn);
router.put('/frequency', updateFrequency);
router.post('/snooze', snoozeCheckIn);

export default router;
