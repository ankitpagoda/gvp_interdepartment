/**
 * Members Controller — HTTP layer for member management.
 */
const membersService = require('../services/membersService');

/** GET /members — list all members (requires VIEW_USER_BASIC) */
async function list(req, res) {
  try {
    const members = membersService.listMembers();
    return res.json({ success: true, members });
  } catch (err) {
    console.error('[membersController.list]', err);
    return res.status(500).json({ error: 'INTERNAL_ERROR' });
  }
}

/** GET /members/:id — get one member */
async function getById(req, res) {
  try {
    const member = membersService.getMemberById(Number(req.params.id));
    if (!member) return res.status(404).json({ error: 'NOT_FOUND' });
    return res.json({ success: true, member });
  } catch (err) {
    console.error('[membersController.getById]', err);
    return res.status(500).json({ error: 'INTERNAL_ERROR' });
  }
}

/** POST /members — create member (requires ADD_MEMBER) */
async function create(req, res) {
  const { name, email, mobile, employee_id, department_id, role_id, password } = req.body;

  if (!name || !email) {
    return res.status(400).json({
      error: 'VALIDATION_ERROR',
      message: 'Name and email are required.'
    });
  }

  // Basic email format validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({
      error: 'VALIDATION_ERROR',
      message: 'Invalid email format.'
    });
  }

  try {
    const member = membersService.createMember({
      name: name.trim(),
      email: email.trim().toLowerCase(),
      mobile: mobile?.trim(),
      employee_id: employee_id?.trim(),
      department_id: department_id ? Number(department_id) : null,
      role_id: role_id ? Number(role_id) : null,
      password: password // Optional
    });
    return res.status(201).json({ success: true, member });
  } catch (err) {
    if (err.message === 'EMAIL_EXISTS') {
      return res.status(409).json({ error: 'CONFLICT', message: 'Email already registered.' });
    }
    if (err.message === 'EMPLOYEE_ID_EXISTS') {
      return res.status(409).json({ error: 'CONFLICT', message: 'Employee ID already used.' });
    }
    console.error('[membersController.create]', err);
    return res.status(500).json({ error: 'INTERNAL_ERROR' });
  }
}

/** PUT /members/:id — update member (requires ASSIGN_ROLE or ASSIGN_DEPARTMENT) */
async function update(req, res) {
  const id = Number(req.params.id);
  const { name, mobile, employee_id, department_id, role_id } = req.body;

  // Prevent updating own record through this endpoint to avoid privilege escalation
  if (req.user.sub === id && role_id !== undefined) {
    return res.status(403).json({
      error: 'FORBIDDEN',
      message: 'Cannot change your own role.'
    });
  }

  try {
    const member = membersService.updateMember(id, {
      name, mobile, employee_id,
      department_id: department_id !== undefined ? Number(department_id) : undefined,
      role_id: role_id !== undefined ? Number(role_id) : undefined
    });
    return res.json({ success: true, member });
  } catch (err) {
    if (err.message === 'MEMBER_NOT_FOUND') {
      return res.status(404).json({ error: 'NOT_FOUND', message: 'Member not found.' });
    }
    console.error('[membersController.update]', err);
    return res.status(500).json({ error: 'INTERNAL_ERROR' });
  }
}

/** DELETE /members/:id — delete member (requires DELETE_MEMBER) */
async function remove(req, res) {
  const id = Number(req.params.id);

  if (req.user.sub === id) {
    return res.status(403).json({
      error: 'FORBIDDEN',
      message: 'Cannot delete your own account.'
    });
  }

  try {
    const result = membersService.deleteMember(id);
    return res.json({ success: true, ...result });
  } catch (err) {
    if (err.message === 'MEMBER_NOT_FOUND') {
      return res.status(404).json({ error: 'NOT_FOUND', message: 'Member not found.' });
    }
    console.error('[membersController.remove]', err);
    return res.status(500).json({ error: 'INTERNAL_ERROR' });
  }
}

/** GET /members/departments — list all departments */
async function getDepartments(req, res) {
  try {
    const departments = membersService.getDepartments();
    return res.json({ success: true, departments });
  } catch (err) {
    return res.status(500).json({ error: 'INTERNAL_ERROR' });
  }
}

/** GET /members/roles — list all roles */
async function getRoles(req, res) {
  try {
    const roles = membersService.getRoles();
    return res.json({ success: true, roles });
  } catch (err) {
    return res.status(500).json({ error: 'INTERNAL_ERROR' });
  }
}

/** POST /members/:id/departments — update member department assignments */
async function updateDepartments(req, res) {
  const id = Number(req.params.id);
  const { departmentIds, primaryDepartmentId, profileSections, departmentSections, reportSections, assignmentSections, cctvSections } = req.body;

  try {
    const member = membersService.updateMemberDepartments(id, { 
      departmentIds, 
      primaryDepartmentId,
      profileSections,
      departmentSections,
      reportSections,
      assignmentSections,
      cctvSections
    });
    return res.json({ success: true, member });
  } catch (err) {
    if (err.message === 'MEMBER_NOT_FOUND') {
      return res.status(404).json({ error: 'NOT_FOUND', message: 'Member not found.' });
    }
    console.error('[membersController.updateDepartments]', err);
    return res.status(500).json({ error: 'INTERNAL_ERROR' });
  }
}

/** POST /members/:id/reset-password — admin resets user password */
async function resetPassword(req, res) {
  const id = Number(req.params.id);
  const { newPassword } = req.body;

  if (!newPassword || newPassword.length < 4) {
    return res.status(400).json({ error: 'VALIDATION_ERROR', message: 'Password must be at least 4 characters.' });
  }

  try {
    membersService.resetMemberPassword(id, newPassword);
    return res.json({ success: true, message: 'Password reset successful.' });
  } catch (err) {
    if (err.message === 'MEMBER_NOT_FOUND') {
      return res.status(404).json({ error: 'NOT_FOUND', message: 'Member not found.' });
    }
    console.error('[membersController.resetPassword]', err);
    return res.status(500).json({ error: 'INTERNAL_ERROR' });
  }
}

/** GET /members/reset-requests — list all pending forgot password requests */
async function listResetRequests(req, res) {
  try {
    const requests = membersService.listPasswordResetRequests();
    return res.json({ success: true, requests });
  } catch (err) {
    console.error('[membersController.listResetRequests]', err);
    return res.status(500).json({ error: 'INTERNAL_ERROR' });
  }
}

/** DELETE /members/reset-requests/:id — resolve/remove a request */
async function resolveResetRequest(req, res) {
  const id = Number(req.params.id);
  try {
    membersService.resolvePasswordResetRequest(id);
    return res.json({ success: true });
  } catch (err) {
    console.error('[membersController.resolveResetRequest]', err);
    return res.status(500).json({ error: 'INTERNAL_ERROR' });
  }
}

module.exports = { 
  list, getById, create, update, remove, 
  getDepartments, getRoles, updateDepartments,
  resetPassword, listResetRequests, resolveResetRequest 
};
