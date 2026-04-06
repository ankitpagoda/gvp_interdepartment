/**
 * GVP RBAC Backend Server
 * Entry point — Express app with clean architecture.
 */
const express = require('express');
const cors    = require('cors');
const path    = require('path');

// Initialize DB + seed data on startup
require('./src/models/db');

const authRoutes    = require('./src/routes/auth');
const membersRoutes = require('./src/routes/members');
const { authenticate } = require('./src/middleware/authMiddleware');
const authController = require('./src/controllers/authController');

const app  = express();
const PORT = process.env.PORT || 3001;

// ── Middleware ────────────────────────────────────────────────────────────────
app.use(cors({
  origin: ['http://localhost:5173', 'http://localhost:5174', 'http://127.0.0.1:5173'],
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Simple request logger (dev only)
app.use((req, _res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.path}`);
  next();
});

// ── Routes ────────────────────────────────────────────────────────────────────
app.use('/auth', authRoutes);
app.get('/me', authenticate, authController.getMe);
app.use('/members', membersRoutes);

// Health check
app.get('/health', (_req, res) => res.json({ status: 'ok', time: new Date().toISOString() }));

// 404 handler
app.use((_req, res) => {
  res.status(404).json({ error: 'NOT_FOUND', message: 'Endpoint does not exist.' });
});

// Global error handler
app.use((err, _req, res, _next) => {
  console.error('[UNHANDLED ERROR]', err);
  res.status(500).json({ error: 'INTERNAL_ERROR', message: 'An unexpected error occurred.' });
});

// ── Start ─────────────────────────────────────────────────────────────────────
app.listen(PORT, () => {
  console.log(`\n ✅ GVP RBAC Server running on http://localhost:${PORT}`);
  console.log(`    Health: http://localhost:${PORT}/health`);
  console.log(`    Login:  POST http://localhost:${PORT}/auth/login`);
  console.log(`\n Default accounts:`);
  console.log(`    Admin:   admin@gvp.org    / admin@123`);
  console.log(`    Manager: manager@gvp.org  / manager@123`);
  console.log(`    Staff:   staff@gvp.org    / staff@123\n`);
});

module.exports = app;
