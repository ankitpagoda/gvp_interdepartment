const db = require('./server/src/models/db');
const bcrypt = require('bcryptjs');

async function test() {
  console.log('--- DB Check ---');
  const user = db.getUserByEmail('admin@gvp.org');
  if (!user) {
    console.error('FAIL: admin@gvp.org not found in DB');
    return;
  }
  console.log('User found:', user.email);
  
  const password = 'admin@123';
  const valid = bcrypt.compareSync(password, user.password_hash);
  console.log('Password valid:', valid);
  
  if (!valid) {
    console.log('DB hash:', user.password_hash);
    const newHash = bcrypt.hashSync(password, 10);
    console.log('Calculated hash:', newHash);
  }

  const full = db.getUserById(user.id);
  console.log('Full user data:', JSON.stringify(full, null, 2));
}

test();
