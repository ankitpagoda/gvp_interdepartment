/**
 * Members Service — CRUD operations on users/members using JSON DB.
 */
const db = require('../models/db');
const bcrypt = require('bcryptjs');

/**
 * List all members with their department and roles.
 */
function listMembers() {
  return db.getAllUsers();
}

/**
 * Get a single member by ID.
 */
function getMemberById(id) {
  const user = db.getUserById(id);
  if (!user) return null;

  const roles = db.getRolesForUser(id);
  return { ...user, roles };
}

/**
 * Create a new member account.
 */
function createMember(data) {
  const { name, email, mobile, employee_id, department_id, role_id, password } = data;

  // Validate uniqueness
  if (db.getUserByEmail(email)) throw new Error('EMAIL_EXISTS');

  if (employee_id) {
    const existing = db.data.users.find(u => u.employee_id === employee_id);
    if (existing) throw new Error('EMPLOYEE_ID_EXISTS');
  }

  // Default password = first part of email + "@gvp"
  const finalPassword = password || (email.split('@')[0] + '@gvp');
  const password_hash = bcrypt.hashSync(finalPassword, 10);

  const userId = db.createUser({
    name, email, mobile, employee_id, department_id, password_hash
  });

  // Assign role if provided
  if (role_id) {
    db.assignRole(userId, role_id);
  }

  return getMemberById(userId);
}

/**
 * Update member's department and/or role.
 */
function updateMember(id, data) {
  const member = db.getUserById(id);
  if (!member) throw new Error('MEMBER_NOT_FOUND');

  const { name, mobile, employee_id, department_id, role_id } = data;

  // Update core fields
  const fields = {};
  if (name !== undefined) fields.name = name;
  if (mobile !== undefined) fields.mobile = mobile;
  if (employee_id !== undefined) fields.employee_id = employee_id;
  if (department_id !== undefined) fields.department_id = department_id;

  if (Object.keys(fields).length > 0) {
    db.updateUser(id, fields);
  }

  // Replace role if provided
  if (role_id !== undefined) {
    db.removeAllRoles(id);
    if (role_id) {
      db.assignRole(id, role_id);
    }
  }

  return getMemberById(id);
}

/**
 * Delete a member by ID.
 */
function deleteMember(id) {
  const member = db.getUserById(id);
  if (!member) throw new Error('MEMBER_NOT_FOUND');
  db.deleteUser(id);
  return { deleted: true, id };
}

/**
 * Metadata helpers
 */
function getDepartments() {
  return db.getDepartments();
}

function getRoles() {
  return db.getRoles();
}

/**
 * Update a user's department mappings and profile sections.
 */
function updateMemberDepartments(id, { departmentIds, primaryDepartmentId, profileSections, departmentSections, reportSections, assignmentSections, cctvSections }) {
  const member = db.getUserById(id);
  if (!member) throw new Error('MEMBER_NOT_FOUND');

  // Replace all department assignments
  if (departmentIds !== undefined) {
    db.removeAllDepartments(id);
    for (const did of departmentIds) {
      db.assignDepartment(id, Number(did));
    }
  }

  // Set primary department
  if (primaryDepartmentId !== undefined) {
    db.setPrimaryDepartment(id, Number(primaryDepartmentId));
  }

  // Update profile sections if provided
  if (profileSections !== undefined) {
    db.updateUser(id, { profile_sections: profileSections });
  }

  // Update department sections if provided
  if (departmentSections !== undefined) {
    db.updateUser(id, { department_sections: departmentSections });
  }

  // Update report sections if provided
  if (reportSections !== undefined) {
    db.updateUser(id, { report_sections: reportSections });
  }

  // Update assignment sections if provided
  if (assignmentSections !== undefined) {
    db.updateUser(id, { assignment_sections: assignmentSections });
  }

  // Update cctv sections if provided
  if (cctvSections !== undefined) {
    db.updateUser(id, { cctv_sections: cctvSections });
  }

  return getMemberById(id);
}

module.exports = {
  listMembers,
  getMemberById,
  createMember,
  updateMember,
  deleteMember,
  getDepartments,
  getRoles,
  updateMemberDepartments,
  resetMemberPassword: (id, newPassword) => {
    const password_hash = bcrypt.hashSync(newPassword, 10);
    const success = db.updateUserPassword(id, password_hash);
    if (!success) throw new Error('MEMBER_NOT_FOUND');
    // Clear any existing requests for this user
    const requests = db.getPasswordResetRequests();
    const userReqs = requests.filter(r => r.user_id === id);
    userReqs.forEach(r => db.deletePasswordResetRequest(r.id));
    return true;
  },
  requestPasswordReset: (identifier) => {
    const user = db.data.users.find(u => u.email === identifier || u.employee_id === identifier);
    if (!user) throw new Error('USER_NOT_FOUND');
    
    // Check for existing request to prevent spam
    const existing = db.getPasswordResetRequests().find(r => r.user_id === user.id);
    if (existing) return existing;

    return db.createPasswordResetRequest(user.id, identifier);
  },
  listPasswordResetRequests: () => {
    return db.getPasswordResetRequests();
  },
  resolvePasswordResetRequest: (id) => {
    db.deletePasswordResetRequest(id);
    return true;
  },
  verifyAndResetPassword: (identifier, currentPassword, newPassword) => {
    const user = db.data.users.find(u => u.email === identifier || u.employee_id === identifier);
    if (!user) throw new Error('USER_NOT_FOUND');

    // Verify current (temp) password
    const isValid = bcrypt.compareSync(currentPassword, user.password_hash);
    if (!isValid) throw new Error('INVALID_CURRENT_PASSWORD');

    // Hash and update new password
    const password_hash = bcrypt.hashSync(newPassword, 10);
    db.updateUserPassword(user.id, password_hash);

    // Clear any pending reset requests
    const requests = db.getPasswordResetRequests();
    const userReqs = requests.filter(r => r.user_id === user.id);
    userReqs.forEach(r => db.deletePasswordResetRequest(r.id));

    return true;
  }
};
