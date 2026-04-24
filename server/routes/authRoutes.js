import express from 'express';
import { body } from 'express-validator';
const router = express.Router();
import { register, login, getMe } from '../controllers/authController.js';
import auth from '../middleware/auth.js';
import validate from '../middleware/validate.js';

// @route   POST /api/auth/register
router.post('/register', validate([
  body('name').trim().notEmpty().withMessage('Name is required'),
  body('email').isEmail().withMessage('Please enter a valid email'),
  body('password')
    .isLength({ min: 8 }).withMessage('Password must be at least 8 characters')
    .matches(/[A-Z]/).withMessage('Password must contain at least one uppercase letter')
    .matches(/[0-9]/).withMessage('Password must contain at least one number')
]), register);

// @route   POST /api/auth/login
router.post('/login', validate([
  body('email').isEmail().withMessage('Please enter a valid email'),
  body('password').notEmpty().withMessage('Password is required')
]), login);

// @route   GET /api/auth/me
router.get('/me', auth, getMe);

export default router;
