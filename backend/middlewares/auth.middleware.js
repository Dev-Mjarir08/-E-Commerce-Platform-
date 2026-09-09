import User from '../models/User.js';
import { verifyAccessToken } from '../utils/token.utils.js';

/**
 * Protect routes - Verify JWT Access Token
 */
export const protect = async (req, res, next) => {
  let token;

  // Extract from Authorization header: Bearer <token>
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return res.status(401).json({
      success: false,
      message: 'Access denied. Authentication token is missing.'
    });
  }

  try {
    const decoded = verifyAccessToken(token);

    const user = await User.findById(decoded.id);

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'The user belonging to this token no longer exists.'
      });
    }

    if (user.status === 'banned' || user.status === 'suspended') {
      return res.status(403).json({
        success: false,
        message: `Your account has been ${user.status}. Please contact platform support.`
      });
    }

    req.user = user;
    next();
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({
        success: false,
        message: 'Authentication token has expired. Please refresh token.',
        isExpired: true
      });
    }

    return res.status(401).json({
      success: false,
      message: 'Invalid authentication token.'
    });
  }
};

/**
 * Authorize specific roles
 */
export const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Not authenticated.'
      });
    }

    // Treat 'seller' and 'vendor' as equivalent if either is specified
    const allowedRoles = [...roles];
    if (allowedRoles.includes('vendor') && !allowedRoles.includes('seller')) {
      allowedRoles.push('seller');
    }
    if (allowedRoles.includes('seller') && !allowedRoles.includes('vendor')) {
      allowedRoles.push('vendor');
    }

    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: `User role '${req.user.role}' is not authorized to access this resource.`
      });
    }

    next();
  };
};
