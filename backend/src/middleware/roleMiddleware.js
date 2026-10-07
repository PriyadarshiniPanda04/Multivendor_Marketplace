/**
 * Role-based Authorization Middleware
 * Verifies that the authenticated user possesses the required role(s).
 */

/**
 * Restrict access to specified roles
 * @param  {...string} roles - Permitted roles e.g. 'admin', 'vendor', 'customer'
 */
const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required'
      });
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: `Forbidden: User role '${req.user.role}' is not authorized to access this resource`
      });
    }

    next();
  };
};

/**
 * Shorthand middleware for Admin-only routes
 */
const isAdmin = authorize('admin');

/**
 * Shorthand middleware for Vendor-only routes
 */
const isVendor = authorize('vendor');

/**
 * Shorthand middleware for Customer-only routes
 */
const isCustomer = authorize('customer');

module.exports = {
  authorize,
  isAdmin,
  isVendor,
  isCustomer
};
