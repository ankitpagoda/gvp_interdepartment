/**
 * Database Layer — JSON file-based persistent store.
 *
 * Implements the same interface as the SQLite version but uses a JSON file
 * for zero-dependency operation on Windows without Visual Studio build tools.
 *
 * For production: swap this with better-sqlite3 or PostgreSQL.
 * The service layer is completely decoupled from this implementation.
 */
const fs   = require('fs');
const path = require('path');
const bcrypt = require('bcryptjs');

const DATA_DIR = path.join(__dirname, '../../data');
const DB_FILE  = path.join(DATA_DIR, 'gvp_rbac.json');

// Ensure data directory exists
if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });

// ── In-memory store ───────────────────────────────────────────────────────────
let _db = {
  departments: [],
  roles: [],
  permissions: [],
  role_permissions: [],   // [{ role_id, permission_id }]
  users: [],
  user_roles: [],         // [{ user_id, role_id }]
  user_departments: [],   // [{ user_id, department_id }]
  password_reset_requests: [] // [{ id, user_id, identifier, requested_at }]
};

let _nextId = { departments: 1, roles: 1, permissions: 1, users: 1, reset_requests: 1 };

// ── Persistence helpers ───────────────────────────────────────────────────────

function load() {
  if (fs.existsSync(DB_FILE)) {
    try {
      const raw = JSON.parse(fs.readFileSync(DB_FILE, 'utf8'));
      _db = { ..._db, ...(raw.data || {}) };
      _nextId = { ..._nextId, ...(raw.nextId || {}) };
      return true; // already seeded
    } catch { /* corrupt file fallback */ }
  }
  return false;
}

function save() {
  fs.writeFileSync(DB_FILE, JSON.stringify({ data: _db, nextId: _nextId }, null, 2));
}

function nextId(table) {
  const id = _nextId[table];
  _nextId[table]++;
  return id;
}

// ── Schema / Seed ─────────────────────────────────────────────────────────────

function seed() {
  // Permissions
  const permissions = [
    { key: 'ADD_MEMBER',        description: 'Create / invite a new member account' },
    { key: 'VIEW_USER_BASIC',   description: 'View basic user information & member list' },
    { key: 'ASSIGN_DEPARTMENT', description: "Assign or change a user's department" },
    { key: 'ASSIGN_ROLE',       description: 'Grant or revoke roles for a user' },
    { key: 'VIEW_EMPLOYEE_ID',  description: 'View confidential employee ID values' },
    { key: 'VIEW_PROFILE',      description: "View own and others' profile details" },
    { key: 'VIEW_DEPARTMENT',   description: 'View department listings' },
    { key: 'VIEW_TODAY_REPORT', description: "Access today's operational report" },
    { key: 'DELETE_MEMBER',     description: 'Delete a member account' },
    { key: 'EDIT_MEMBER',       description: 'Edit member details' },
  ];
  for (const p of permissions) {
    if (!_db.permissions.find(x => x.key === p.key)) {
      _db.permissions.push({ id: nextId('permissions'), ...p });
    }
  }

  // Roles
  for (const name of ['Admin', 'Manager', 'Staff']) {
    if (!_db.roles.find(r => r.name === name)) {
      _db.roles.push({ id: nextId('roles'), name });
    }
  }

  // Role-Permission mapping
  const getRole = (name) => _db.roles.find(r => r.name === name);
  const getPerm = (key)  => _db.permissions.find(p => p.key === key);
  const linkRP  = (rid, pid) => {
    if (!_db.role_permissions.find(x => x.role_id === rid && x.permission_id === pid)) {
      _db.role_permissions.push({ role_id: rid, permission_id: pid });
    }
  };

  const admin   = getRole('Admin');
  const manager = getRole('Manager');
  const staff   = getRole('Staff');

  // Admin gets ALL
  for (const p of _db.permissions) linkRP(admin.id, p.id);

  // Manager
  for (const key of ['VIEW_USER_BASIC','VIEW_PROFILE','VIEW_DEPARTMENT','VIEW_TODAY_REPORT']) {
    const p = getPerm(key);
    if (p) linkRP(manager.id, p.id);
  }

  // Staff
  for (const key of ['VIEW_PROFILE','VIEW_TODAY_REPORT']) {
    const p = getPerm(key);
    if (p) linkRP(staff.id, p.id);
  }

  // Departments
  const depts = [
    'Dhamma-Pattana','Food-Court','Souvenir','Dhammalay',
    'Library','Academic','Pariyatti','Archive','Conservation',
    'Preservation','Publication','Reception','Museum','PR',
    'Maintains','Electrical','Water','Civil','Kitchen',
    'One-Day','Garden','Housekeeping','Security','Accounts',
    'IT','Purchase','Store'
  ];
  for (const name of depts) {
    if (!_db.departments.find(d => d.name === name)) {
      _db.departments.push({ id: nextId('departments'), name });
    }
  }

  // Default users
  const defaultUsers = [
    { name:'GVP Admin',   email:'admin@gvp.org',   mobile:'9000000001', employee_id:'GVP-ADMIN-001', depts:['IT'],        password:'admin@123',   role:'Admin'   },
    { name:'Amit Sharma', email:'manager@gvp.org', mobile:'9000000002', employee_id:'GVP-IT-001',    depts:['IT', 'Purchase', 'Store'], password:'manager@123', role:'Manager' },
    { name:'Priya Staff', email:'staff@gvp.org',   mobile:'9000000003', employee_id:'GVP-REC-001',   depts:['Reception'], password:'staff@123',   role:'Staff'   },
  ];

  for (const u of defaultUsers) {
    if (_db.users.find(x => x.email === u.email)) continue;
    const primaryDeptStr = u.depts[0];
    const primaryDept = _db.departments.find(d => d.name === primaryDeptStr);
    const hash = bcrypt.hashSync(u.password, 10);
    const uid  = nextId('users');
    
    _db.users.push({
      id: uid,
      name: u.name,
      email: u.email,
      mobile: u.mobile,
      employee_id: u.employee_id,
      department_id: primaryDept ? primaryDept.id : null,
      primary_department_id: primaryDept ? primaryDept.id : null,
      password_hash: hash,
      created_at: new Date().toISOString()
    });

    // Assign all specified departments
    for (const dname of u.depts) {
      const d = _db.departments.find(x => x.name === dname);
      if (d) {
        _db.user_departments.push({ user_id: uid, department_id: d.id });
      }
    }

    const role = getRole(u.role);
    if (role) _db.user_roles.push({ user_id: uid, role_id: role.id });
    
    // Default profile sections (all visible by default for new users)
    _db.users[_db.users.length - 1].profile_sections = [
      'My Task', 'Unified Request', 'Task Status', 'Bill Submit', 'Room Form', 
      'Meditator Request', 'Course Summary', 'Schedule', 'Meditation', 'Survey', 
      'Purchase Order', 'Pay-slip', 'Announcements', 'Feedback', 'Suggestion', 
      'Chat', 'Leave', 'Movement'
    ];

    // Default department sections (all visible by default for new users)
    _db.users[_db.users.length - 1].department_sections = [
      'Task Status', 'Staff Status', 'Meditation Done', 'Received Request', 
      'Store Dashboard', 'Reception Bills', 'Purchase Order', 'Feedback', 
      'Survey', 'Announcements', 'CCTV', 'Policies'
    ];

    // Default report sections (all visible by default for new users)
    _db.users[_db.users.length - 1].report_sections = [
      'Visitor:Dhamalay', 'Visitor:Anapana', 'Visitor:Museum', 'Visitor:GVP',
      'Staff/DS:VRI', 'Staff/DS:DPVT', 'Staff/DS:SVCT', 'Staff/DS:GVP',
      'Vouchers:VRI', 'Vouchers:DPVT', 'Vouchers:SVCT', 'Vouchers:GVP',
      'Task:VRI', 'Task:DPVT', 'Task:SVCT', 'Task:GVP',
      'Maintenance:Electrician', 'Maintenance:Water Man', 'Maintenance:Construction', 'Maintenance:Driver',
      'Water Con.:VRI', 'Water Con.:DPVT', 'Water Con.:SVCT', 'Water Con.:GVP',
      'Power Con.:VRI', 'Power Con.:DPVT', 'Power Con.:SVCT', 'Power Con.:GVP'
    ];

    // Default assignment sections (all visible by default for new users)
    _db.users[_db.users.length - 1].assignment_sections = [
      'DPVT:Dhamma-Pattana', 
      'SVCT:Food-Court', 'SVCT:Souvenir', 'SVCT:Dhammalay',
      'VRI:Library', 'VRI:Academic', 'VRI:Pariyatti', 'VRI:Archive', 'VRI:Conservation', 'VRI:Preservation', 'VRI:Publication',
      'GVP:Reception', 'GVP:Museum', 'GVP:PR', 'GVP:Maintains', 'GVP:Electrical', 'GVP:Water', 'GVP:Civil', 'GVP:Kitchen', 'GVP:One-Day', 'GVP:Garden', 'GVP:Housekeeping', 'GVP:Security', 'GVP:Accounts', 'GVP:IT', 'GVP:Purchase', 'GVP:Store'
    ];
  }

  save();
}

// ── Initialize ────────────────────────────────────────────────────────────────
const alreadySeeded = load();
if (!alreadySeeded) seed();

// ── Query API (mimics SQLite synchronous interface) ───────────────────────────

const db = {
  // Raw access
  get data() { return _db; },

  // Department
  getDepartments: () => [..._db.departments].sort((a,b) => a.name.localeCompare(b.name)),
  getDepartmentById: (id) => _db.departments.find(d => d.id === id) || null,

  // Roles
  getRoles: () => [..._db.roles],
  getRoleById: (id) => _db.roles.find(r => r.id === id) || null,
  getRoleByName: (name) => _db.roles.find(r => r.name === name) || null,

  // Permissions
  getPermissionsForUser: (userId) => {
    const roleIds = _db.user_roles.filter(ur => ur.user_id === userId).map(ur => ur.role_id);
    const permIds = _db.role_permissions.filter(rp => roleIds.includes(rp.role_id)).map(rp => rp.permission_id);
    const unique  = [...new Set(permIds)];
    return unique.map(pid => _db.permissions.find(p => p.id === pid)).filter(Boolean).map(p => p.key);
  },

  getRolesForUser: (userId) => {
    const roleIds = _db.user_roles.filter(ur => ur.user_id === userId).map(ur => ur.role_id);
    return roleIds.map(rid => _db.roles.find(r => r.id === rid)).filter(Boolean).map(r => r.name);
  },

  // Users
  getUserByEmail: (email) => _db.users.find(u => u.email === email) || null,

  getUserById: (id) => {
    const u = _db.users.find(u => u.id === id);
    if (!u) return null;
    const primaryDeptId = u.primary_department_id || u.department_id;
    const dept = primaryDeptId ? _db.departments.find(d => d.id === primaryDeptId) : null;
    
    // Get all assigned departments
    const assignedDeptIds = _db.user_departments.filter(ud => ud.user_id === u.id).map(ud => ud.department_id);
    const assignedDepts = assignedDeptIds.map(did => _db.departments.find(d => d.id === did)).filter(Boolean);

    return { 
      ...u, 
      department_name: dept ? dept.name : null,
      primary_department_id: primaryDeptId,
      assigned_departments: assignedDepts.map(d => ({ id: d.id, name: d.name })),
      profile_sections: u.profile_sections || [],
      department_sections: u.department_sections || [],
      report_sections: u.report_sections || [],
      assignment_sections: u.assignment_sections || [],
      cctv_sections: u.cctv_sections || []
    };
  },

  getAllUsers: () => {
    return _db.users.map(u => {
      const primaryDeptId = u.primary_department_id || u.department_id;
      const dept  = primaryDeptId ? _db.departments.find(d => d.id === primaryDeptId) : null;
      const roles = _db.user_roles
        .filter(ur => ur.user_id === u.id)
        .map(ur => _db.roles.find(r => r.id === ur.role_id))
        .filter(Boolean)
        .map(r => r.name);
      
      const assignedDeptIds = _db.user_departments.filter(ud => ud.user_id === u.id).map(ud => ud.department_id);
      const assignedDeptsNames = assignedDeptIds.map(did => _db.departments.find(d => d.id === did)).filter(Boolean).map(d => d.name);

      const { password_hash, ...safe } = u;
      return { 
        ...safe, 
        department: dept ? dept.name : null, 
        roles: roles.join(', '),
        assigned_departments: assignedDeptsNames.join(', '),
        profile_sections: u.profile_sections || [],
        department_sections: u.department_sections || [],
        report_sections: u.report_sections || [],
        assignment_sections: u.assignment_sections || [],
        cctv_sections: u.cctv_sections || []
      };
    }).sort((a,b) => new Date(b.created_at) - new Date(a.created_at));
  },

  createUser: ({ name, email, mobile, employee_id, department_id, password_hash }) => {
    const id = nextId('users');
    const user = {
      id, name, email, mobile: mobile || null,
      employee_id: employee_id || null,
      department_id: department_id || null,
      password_hash,
      created_at: new Date().toISOString()
    };
    _db.users.push(user);
    save();
    return id;
  },

  updateUser: (id, fields) => {
    const idx = _db.users.findIndex(u => u.id === id);
    if (idx === -1) return false;
    _db.users[idx] = { ..._db.users[idx], ...fields };
    save();
    return true;
  },

  deleteUser: (id) => {
    _db.users = _db.users.filter(u => u.id !== id);
    _db.user_roles = _db.user_roles.filter(ur => ur.user_id !== id);
    save();
  },

  // User-Role mapping
  assignRole: (userId, roleId) => {
    if (!_db.user_roles.find(ur => ur.user_id === userId && ur.role_id === roleId)) {
      _db.user_roles.push({ user_id: userId, role_id: roleId });
      save();
    }
  },

  removeAllRoles: (userId) => {
    _db.user_roles = _db.user_roles.filter(ur => ur.user_id !== userId);
    save();
  },

  // User-Department mapping
  assignDepartment: (userId, departmentId) => {
    if (!_db.user_departments.find(ud => ud.user_id === userId && ud.department_id === departmentId)) {
      _db.user_departments.push({ user_id: userId, department_id: departmentId });
      save();
    }
  },

  removeAllDepartments: (userId) => {
    _db.user_departments = _db.user_departments.filter(ud => ud.user_id !== userId);
    save();
  },

  setPrimaryDepartment: (userId, departmentId) => {
    const idx = _db.users.findIndex(u => u.id === userId);
    if (idx !== -1) {
      _db.users[idx].primary_department_id = departmentId;
      _db.users[idx].department_id = departmentId; // for legacy compat
      save();
    }
  },

  // Password Reset Requests
  createPasswordResetRequest: (userId, identifier) => {
    const id = nextId('reset_requests');
    const req = {
      id,
      user_id: userId,
      identifier,
      requested_at: new Date().toISOString()
    };
    _db.password_reset_requests.push(req);
    save();
    return id;
  },

  getPasswordResetRequests: () => {
    return _db.password_reset_requests.map(r => {
      const user = _db.users.find(u => u.id === r.user_id);
      return {
        ...r,
        user_name: user ? user.name : 'Unknown User',
        user_email: user ? user.email : 'Unknown Email'
      };
    });
  },

  deletePasswordResetRequest: (id) => {
    _db.password_reset_requests = _db.password_reset_requests.filter(r => r.id !== id);
    save();
  },

  updateUserPassword: (userId, passwordHash) => {
    const idx = _db.users.findIndex(u => u.id === userId);
    if (idx !== -1) {
      _db.users[idx].password_hash = passwordHash;
      save();
      return true;
    }
    return false;
  }
};

module.exports = db;
