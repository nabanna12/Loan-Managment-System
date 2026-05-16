import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from '../models/User';

dotenv.config();

const seedUsers = [
  { name: 'Admin User',        email: 'admin@lms.com',        password: 'Admin@123',        role: 'admin' },
  { name: 'Sales Executive',   email: 'sales@lms.com',        password: 'Sales@123',        role: 'sales' },
  { name: 'Sanction Officer',  email: 'sanction@lms.com',     password: 'Sanction@123',     role: 'sanction' },
  { name: 'Disburse Officer',  email: 'disburse@lms.com',     password: 'Disburse@123',     role: 'disbursement' },
  { name: 'Collection Agent',  email: 'collection@lms.com',   password: 'Collection@123',   role: 'collection' },
  { name: 'Test Borrower',     email: 'borrower@lms.com',     password: 'Borrower@123',     role: 'borrower' },
];

const seed = async () => {
  await mongoose.connect(process.env.MONGODB_URI as string);
  console.log('Connected to MongoDB');

  for (const u of seedUsers) {
    const exists = await User.findOne({ email: u.email });
    if (!exists) {
      await User.create(u);
      console.log(`✅ Created: ${u.email} [${u.role}]`);
    } else {
      console.log(`⏭️  Exists: ${u.email}`);
    }
  }

  console.log('\n📋 SEED CREDENTIALS:\n');
  seedUsers.forEach(u => console.log(`  ${u.role.padEnd(12)} | ${u.email.padEnd(25)} | ${u.password}`));
  await mongoose.disconnect();
};

seed().catch(console.error);