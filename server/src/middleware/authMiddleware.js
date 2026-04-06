/**
 * Authentication Middleware
 * Validates JWT from Authorization header, attaches decoded user to req.user.
 */
const { verifyToken } = require('../services/authService');

function authenticate(req, res, next) {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({
      error: 'UNAUTHORIZED',
      message: 'No authentication token provided.'
    });
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = verifyToken(token);
    req.user = decoded; // { sub, email, roles, permissions }
    next();
  } catch (err) {
    if (err.name === 'TokenExpiredError') {
      return res.status(401).json({ error: 'TOKEN_EXPIRED', message: 'Session expired, please log in again.' });
    }
    return res.status(401).json({ error: 'INVALID_TOKEN', message: 'Invalid authentication token.' });
  }
}

module.exports = { authenticate };
