import DeathReport from '../models/DeathReport.js';
import Contact from '../models/Contact.js';

// @desc    File a death report
export const fileReport = async (req, res, next) => {
  try {
    const { userId, reportedByContactId, certificateUrl } = req.body;
    const deadline = new Date();
    deadline.setHours(deadline.getHours() + 72); // 72h challenge window

    const report = await DeathReport.create({
      userId,
      reportedBy: reportedByContactId,
      certificateUrl,
      challengeDeadline: deadline,
      confirmations: [{ contactId: reportedByContactId }]
    });

    res.status(201).json(report);
  } catch (error) { next(error); }
};

// @desc    Confirm a death report (by trusted contact)
export const confirmReport = async (req, res, next) => {
  try {
    const report = await DeathReport.findById(req.params.id);
    if (!report) return res.status(404).json({ message: 'Report not found' });
    if (report.status !== 'pending') return res.status(400).json({ message: `Report is ${report.status}` });

    const { contactId } = req.body;
    const alreadyConfirmed = report.confirmations.some(c => c.contactId.toString() === contactId);
    if (alreadyConfirmed) return res.status(400).json({ message: 'Already confirmed by this contact' });

    report.confirmations.push({ contactId });

    // Check quorum (2 of 3 trusted contacts)
    const trustedContacts = await Contact.countDocuments({
      userId: report.userId,
      role: { $in: ['trusted-contact', 'both'] }
    });
    const quorum = Math.min(2, trustedContacts);

    if (report.confirmations.length >= quorum) {
      report.status = 'confirmed';
    }
    await report.save();
    res.json(report);
  } catch (error) { next(error); }
};

// @desc    Challenge (cancel) a death report — the user is alive
export const challengeReport = async (req, res, next) => {
  try {
    const report = await DeathReport.findById(req.params.id);
    if (!report) return res.status(404).json({ message: 'Report not found' });

    report.status = 'cancelled';
    await report.save();
    res.json({ message: 'Report cancelled. Glad you\'re okay!', report });
  } catch (error) { next(error); }
};

// @desc    Get report status
export const getReportStatus = async (req, res, next) => {
  try {
    const report = await DeathReport.findById(req.params.id)
      .populate('reportedBy', 'name email')
      .populate('confirmations.contactId', 'name email');
    if (!report) return res.status(404).json({ message: 'Report not found' });
    res.json(report);
  } catch (error) { next(error); }
};

// @desc    Get reports for a user
export const getReportsByUser = async (req, res, next) => {
  try {
    const reports = await DeathReport.find({ userId: req.user._id })
      .populate('reportedBy', 'name email').sort({ createdAt: -1 });
    res.json(reports);
  } catch (error) { next(error); }
};
