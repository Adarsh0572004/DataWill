import CheckIn from '../models/CheckIn.js';

// @desc    Get check-in status (auto-create if not exists)
export const getCheckInStatus = async (req, res, next) => {
  try {
    let checkIn = await CheckIn.findOne({ userId: req.user._id });
    if (!checkIn) {
      checkIn = await CheckIn.create({ userId: req.user._id });
    }

    // Calculate if overdue
    const now = new Date();
    const lastDate = new Date(checkIn.lastCheckIn);
    const daysSince = Math.floor((now - lastDate) / (1000 * 60 * 60 * 24));
    const thresholdDays = checkIn.frequency === 'monthly' ? 30 : 90;

    if (checkIn.snoozedUntil && now < new Date(checkIn.snoozedUntil)) {
      checkIn.status = 'snoozed';
    } else if (daysSince > thresholdDays) {
      checkIn.status = 'overdue';
      checkIn.missedCount = Math.floor(daysSince / thresholdDays);
    } else {
      checkIn.status = 'active';
    }
    await checkIn.save();

    res.json({ ...checkIn.toObject(), daysSince, thresholdDays });
  } catch (error) { next(error); }
};

// @desc    Perform check-in
export const performCheckIn = async (req, res, next) => {
  try {
    let checkIn = await CheckIn.findOne({ userId: req.user._id });
    if (!checkIn) checkIn = await CheckIn.create({ userId: req.user._id });

    checkIn.lastCheckIn = new Date();
    checkIn.missedCount = 0;
    checkIn.status = 'active';
    checkIn.snoozedUntil = null;
    await checkIn.save();

    res.json({ message: 'Check-in successful', checkIn });
  } catch (error) { next(error); }
};

// @desc    Update frequency
export const updateFrequency = async (req, res, next) => {
  try {
    const { frequency } = req.body;
    let checkIn = await CheckIn.findOne({ userId: req.user._id });
    if (!checkIn) checkIn = await CheckIn.create({ userId: req.user._id });

    checkIn.frequency = frequency;
    await checkIn.save();
    res.json(checkIn);
  } catch (error) { next(error); }
};

// @desc    Snooze check-in
export const snoozeCheckIn = async (req, res, next) => {
  try {
    const { days = 7 } = req.body;
    let checkIn = await CheckIn.findOne({ userId: req.user._id });
    if (!checkIn) checkIn = await CheckIn.create({ userId: req.user._id });

    const snoozeDate = new Date();
    snoozeDate.setDate(snoozeDate.getDate() + days);
    checkIn.snoozedUntil = snoozeDate;
    checkIn.status = 'snoozed';
    await checkIn.save();

    res.json({ message: `Snoozed for ${days} days`, checkIn });
  } catch (error) { next(error); }
};
