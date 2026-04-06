/**
 * Auth Service — pure business logic, no HTTP concerns.
 */
const db = require('../models/db');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'gvp_rbac_secret_change_in_production';
const JWT_EXPIRES = '8h';

function getUserRolesAndPermissions(userId) {
  const roles       = db.getRolesForUser(userId);
  const permissions = db.getPermissionsForUser(userId);
  return { roles, permissions };
}

/**
 * POST /auth/login
 */
function login(email, password) {
  const user = db.getUserByEmail(email);
  if (!user) throw new Error('USER_NOT_FOUND');

  const valid = bcrypt.compareSync(password, user.password_hash);
  if (!valid) throw new Error('INVALID_PASSWORD');

  const { roles, permissions } = getUserRolesAndPermissions(user.id);

  const payload = { sub: user.id, email: user.email, roles, permissions };
  const token   = jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES });

  const fullUser = db.getUserById(user.id);

  return {
    token,
    user: {
      id: fullUser.id,
      name: fullUser.name,
      email: fullUser.email,
      mobile: fullUser.mobile,
      employee_id: fullUser.employee_id,
      department: fullUser.department_name,
      department_id: fullUser.department_id,
      primary_department_id: fullUser.primary_department_id,
      assigned_departments: fullUser.assigned_departments,
      profile_sections: fullUser.profile_sections,
      department_sections: fullUser.department_sections,
      report_sections: fullUser.report_sections,
      assignment_sections: fullUser.assignment_sections,
      cctv_sections: fullUser.cctv_sections,
      created_at: fullUser.created_at
    },
    roles,
    permissions
  };
}

function verifyToken(token) {
  return jwt.verify(token, JWT_SECRET);
}

/**
 * GET /me
 */
function getMe(userId) {
  const user = db.getUserById(userId);
  if (!user) throw new Error('USER_NOT_FOUND');

  const { roles, permissions } = getUserRolesAndPermissions(userId);

  return {
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      mobile: user.mobile,
      employee_id: user.employee_id,
      department: user.department_name,
      department_id: user.department_id,
      primary_department_id: user.primary_department_id,
      assigned_departments: user.assigned_departments,
      profile_sections: user.profile_sections,
      department_sections: user.department_sections,
      report_sections: user.report_sections,
      assignment_sections: user.assignment_sections,
      cctv_sections: user.cctv_sections,
      created_at: user.created_at
    },
    roles,
    permissions
  };
}

module.exports = { login, verifyToken, getMe, getUserRolesAndPermissions };
