/**
 * Auth Controller — handles HTTP request/response for auth routes.
 */
const authService = require('../services/authService');

/**
 * POST /auth/login
 * Body: { email, password }
 * Returns: { token, user, roles, permissions }
 */
async function login(req, res) {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({
      error: 'VALIDATION_ERROR',
      message: 'Email and password are required.'
    });
  }

  try {
    const result = authService.login(email.trim().toLowerCase(), password);
    return res.status(200).json({
      success: true,
      ...result
    });
  } catch (err) {
    if (err.message === 'USER_NOT_FOUND' || err.message === 'INVALID_PASSWORD') {
      return res.status(401).json({
        error: 'AUTH_FAILED',
        message: 'Invalid email or password.'
      });
    }
    console.error('[authController.login]', err);
    return res.status(500).json({ error: 'INTERNAL_ERROR', message: 'Login failed.' });
  }
}

/**
 * GET /me
 * Returns full user profile + roles + permissions (re-fetched from DB).
 * Requires: authenticate middleware
 */
async function getMe(req, res) {
  try {
    const result = authService.getMe(req.user.sub);
    return res.status(200).json({ success: true, ...result });
  } catch (err) {
    if (err.message === 'USER_NOT_FOUND') {
      return res.status(404).json({ error: 'NOT_FOUND', message: 'User not found.' });
    }
    console.error('[authController.getMe]', err);
    return res.status(500).json({ error: 'INTERNAL_ERROR' });
  }
}

async function forgotPassword(req, res) {
  const { identifier } = req.body;
  if (!identifier) {
    return res.status(400).json({ error: 'VALIDATION_ERROR', message: 'Email or User ID is required.' });
  }

  try {
    const membersService = require('../services/membersService');
    const result = membersService.requestPasswordReset(identifier.trim());
    return res.status(200).json({ success: true, message: 'Password reset requested successfully.' });
  } catch (err) {
    if (err.message === 'USER_NOT_FOUND') {
      return res.status(404).json({ error: 'NOT_FOUND', message: 'User not found.' });
    }
    console.error('[authController.forgotPassword]', err);
    return res.status(500).json({ error: 'INTERNAL_ERROR' });
  }
}

async function resetPassword(req, res) {
  const { identifier, tempPassword, newPassword } = req.body;
  if (!identifier || !tempPassword || !newPassword) {
    return res.status(400).json({ error: 'VALIDATION_ERROR', message: 'All fields are required.' });
  }

  try {
    const membersService = require('../services/membersService');
    membersService.verifyAndResetPassword(identifier.trim(), tempPassword, newPassword);
    return res.status(200).json({ success: true, message: 'Password reset successful. You can now login.' });
  } catch (err) {
    if (err.message === 'USER_NOT_FOUND') {
      return res.status(404).json({ error: 'NOT_FOUND', message: 'User not found.' });
    }
    if (err.message === 'INVALID_CURRENT_PASSWORD') {
      return res.status(401).json({ error: 'AUTH_FAILED', message: 'Invalid temporary password.' });
    }
    console.error('[authController.resetPassword]', err);
    return res.status(500).json({ error: 'INTERNAL_ERROR' });
  }
}

module.exports = { login, getMe, forgotPassword, resetPassword };
