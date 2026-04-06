/**
 * Auth Routes
 * POST /auth/login
 * GET  /me  (protected)
 */
const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { authenticate } = require('../middleware/authMiddleware');

// Public routes — no auth required
router.post('/login', authController.login);
router.post('/forgot-password', authController.forgotPassword);
router.post('/reset-password', authController.resetPassword);

// Protected route — returns full profile from DB
router.get('/me', authenticate, authController.getMe);

module.exports = router;
