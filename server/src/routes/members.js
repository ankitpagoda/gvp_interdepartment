/**
 * Members Routes — all routes protected by authenticate + RBAC middleware.
 *
 * GET    /members/departments — list departments (requires VIEW_DEPARTMENT)
 * GET    /members/roles       — list roles (requires VIEW_USER_BASIC)
 * GET    /members             — list members (requires VIEW_USER_BASIC)
 * GET    /members/:id         — get member (requires VIEW_USER_BASIC)
 * POST   /members             — create member (requires ADD_MEMBER)
 * PUT    /members/:id         — update member (requires ASSIGN_ROLE or ASSIGN_DEPARTMENT)
 * DELETE /members/:id         — delete member (requires DELETE_MEMBER)
 */
const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/membersController');
const { authenticate } = require('../middleware/authMiddleware');
const { checkPermission, checkAnyPermission } = require('../middleware/rbacMiddleware');

// All members routes require authentication
router.use(authenticate);

// Reference data endpoints (used by forms)
router.get('/departments', checkPermission('VIEW_DEPARTMENT'), ctrl.getDepartments);
router.get('/roles',       checkPermission('VIEW_USER_BASIC'), ctrl.getRoles);

// Member CRUD
router.get('/',    checkPermission('VIEW_USER_BASIC'),  ctrl.list);
router.get('/:id', checkPermission('VIEW_USER_BASIC'),  ctrl.getById);
router.post('/',   checkPermission('ADD_MEMBER'),        ctrl.create);
router.put('/:id', checkAnyPermission('ASSIGN_ROLE', 'ASSIGN_DEPARTMENT'), ctrl.update);
router.post('/:id/departments', checkPermission('ASSIGN_DEPARTMENT'), ctrl.updateDepartments);
router.delete('/:id', checkPermission('DELETE_MEMBER'), ctrl.remove);

// Password Reset Routes (Admin Only)
router.post('/:id/reset-password', checkPermission('RESET_PASSWORD'), ctrl.resetPassword);
router.get('/reset-requests',      checkPermission('VIEW_USER_BASIC'), ctrl.listResetRequests);
router.delete('/reset-requests/:id', checkPermission('RESET_PASSWORD'), ctrl.resolveResetRequest);

module.exports = router;
