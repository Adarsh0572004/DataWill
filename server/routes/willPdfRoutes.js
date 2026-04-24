import express from 'express';
const router = express.Router();
import auth from '../middleware/auth.js';
import { generateWillPDF } from '../services/pdfService.js';

router.get('/', auth, async (req, res, next) => {
  try {
    const doc = await generateWillPDF(req.user._id);
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', 'attachment; filename=DataWill_Summary.pdf');
    doc.pipe(res);
  } catch (error) { next(error); }
});

export default router;
