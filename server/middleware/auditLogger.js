import AuditLog from '../models/AuditLog.js';

const auditLogger = (action, detailsFn) => {
  return async (req, res, next) => {
    // Store original json method
    const originalJson = res.json.bind(res);
    res.json = function (data) {
      // Only log on successful operations
      if (res.statusCode < 400 && req.user) {
        const details = typeof detailsFn === 'function' ? detailsFn(req, data) : (detailsFn || '');
        AuditLog.create({
          userId: req.user._id,
          action,
          details,
          ipAddress: req.ip || req.connection?.remoteAddress || ''
        }).catch(err => console.error('Audit log error:', err.message));
      }
      return originalJson(data);
    };
    next();
  };
};

export default auditLogger;
