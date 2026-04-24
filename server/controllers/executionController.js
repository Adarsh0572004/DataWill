import Execution from '../models/Execution.js';
import Rule from '../models/Rule.js';

// @desc    Trigger execution of all rules for a user
export const triggerExecution = async (req, res, next) => {
  try {
    const { userId } = req.params;
    const rules = await Rule.find({ userId });

    if (rules.length === 0) {
      return res.status(400).json({ message: 'No rules found for this user' });
    }

    const executions = await Promise.all(
      rules.map(rule => Execution.create({
        userId,
        ruleId: rule._id,
        status: 'pending'
      }))
    );

    // Simulate execution (in production, this would be async job queue)
    for (const exec of executions) {
      exec.status = 'completed';
      exec.executedAt = new Date();
      exec.result = `Rule ${exec.ruleId} executed successfully (simulated)`;
      await exec.save();
    }

    res.status(201).json({ message: `${executions.length} rules executed`, executions });
  } catch (error) { next(error); }
};

// @desc    Get all executions for current user
export const getExecutionsByUser = async (req, res, next) => {
  try {
    const executions = await Execution.find({ userId: req.user._id })
      .populate({ path: 'ruleId', populate: { path: 'assetId', select: 'name icon' } })
      .sort({ createdAt: -1 });
    res.json(executions);
  } catch (error) { next(error); }
};

// @desc    Get single execution
export const getExecutionById = async (req, res, next) => {
  try {
    const execution = await Execution.findById(req.params.id)
      .populate({ path: 'ruleId', populate: { path: 'assetId', select: 'name icon' } });
    if (!execution) return res.status(404).json({ message: 'Execution not found' });
    res.json(execution);
  } catch (error) { next(error); }
};
