import express from 'express';
import { body } from 'express-validator';
const router = express.Router();
import auth from '../middleware/auth.js';
import validate from '../middleware/validate.js';
import { createContact, getContacts, updateContact, deleteContact } from '../controllers/contactController.js';

router.use(auth);

router.post('/', validate([
  body('name').trim().notEmpty().withMessage('Contact name is required'),
  body('email').isEmail().withMessage('Please enter a valid email'),
  body('role').optional().isIn(['trusted-contact', 'beneficiary', 'both'])
    .withMessage('Invalid contact role')
]), createContact);

router.get('/', getContacts);
router.put('/:id', updateContact);
router.delete('/:id', deleteContact);

export default router;
