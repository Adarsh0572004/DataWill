import Contact from '../models/Contact.js';

// @desc    Create a contact
// @route   POST /api/contacts
export const createContact = async (req, res, next) => {
  try {
    const contact = await Contact.create({
      ...req.body,
      userId: req.user._id
    });
    res.status(201).json(contact);
  } catch (error) {
    next(error);
  }
};

// @desc    Get all contacts for current user
// @route   GET /api/contacts
export const getContacts = async (req, res, next) => {
  try {
    const contacts = await Contact.find({ userId: req.user._id }).sort({ createdAt: -1 });
    res.json(contacts);
  } catch (error) {
    next(error);
  }
};

// @desc    Update a contact
// @route   PUT /api/contacts/:id
export const updateContact = async (req, res, next) => {
  try {
    const contact = await Contact.findOneAndUpdate(
      { _id: req.params.id, userId: req.user._id },
      req.body,
      { new: true, runValidators: true }
    );
    if (!contact) return res.status(404).json({ message: 'Contact not found' });
    res.json(contact);
  } catch (error) {
    next(error);
  }
};

// @desc    Delete a contact
// @route   DELETE /api/contacts/:id
export const deleteContact = async (req, res, next) => {
  try {
    const contact = await Contact.findOneAndDelete({ _id: req.params.id, userId: req.user._id });
    if (!contact) return res.status(404).json({ message: 'Contact not found' });
    res.json({ message: 'Contact removed' });
  } catch (error) {
    next(error);
  }
};
