/**
 * Role-Based Access Control Middleware
 * @param  {...string} allowedRoles - e.g. 'admin', 'owner', 'tenant'
 */
const requireRole = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required before checking permissions.'
      });
    }

    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: `Forbidden: Access restricted to [${allowedRoles.join(', ')}]. Your role is '${req.user.role}'.`
      });
    }

    next();
  };
};

module.exports = {
  requireRole
};
