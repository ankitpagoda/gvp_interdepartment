const db = require('./src/models/db');
const bcrypt = require('bcryptjs');

async function createTestMember() {
  console.log('Creating test member...');
  
  const testUser = {
    name: 'Test Member',
    email: 'test@gvp.org',
    mobile: '9999999999',
    employee_id: 'GVP-TEST-001',
    password: 'test@123'
  };

  const existing = db.getUserByEmail(testUser.email);
  if (existing) {
    console.log('Test member already exists.');
    process.exit(0);
  }

  const hash = bcrypt.hashSync(testUser.password, 10);
  const uid = db.createUser({
    name: testUser.name,
    email: testUser.email,
    mobile: testUser.mobile,
    employee_id: testUser.employee_id,
    password_hash: hash
  });

  // Assign Staff role 
  const roles = db.getRoles();
  const staffRole = roles.find(r => r.name === 'Staff');
  if (staffRole) {
    db.assignRole(uid, staffRole.id);
  }

  // Assign IT department 
  const departments = db.getDepartments();
  const itDept = departments.find(d => d.name === 'IT');
  if (itDept) {
    db.assignDepartment(uid, itDept.id);
    db.setPrimaryDepartment(uid, itDept.id);
  }

  // Add sections
  db.updateUser(uid, {
    profile_sections: ['My Task', 'Chat', 'Leave'],
    department_sections: ['Task Status', 'Policies'],
    report_sections: [],
    assignment_sections: []
  });

  console.log(`Test member created successfully!`);
  console.log(`Email: ${testUser.email}`);
  console.log(`Password: ${testUser.password}`);
}

createTestMember().catch(err => {
  console.error(err);
  process.exit(1);
});
