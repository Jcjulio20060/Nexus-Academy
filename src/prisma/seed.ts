import 'dotenv/config';
import { db } from './db';
import { hashPassword } from '../lib/auth';

async function main() {
  await db.connect();

  const email = process.env['ADMIN_EMAIL'] ?? 'admin@example.com';
  const password = process.env['ADMIN_PASSWORD'] ?? 'Admin123!';
  const username = process.env['ADMIN_USERNAME'] ?? 'admin';
  const name = process.env['ADMIN_NAME'] ?? 'Administrator';

  const existingAdmin = await db.orm.public.User.where({ email }).first();
  if (existingAdmin) {
    console.log(`Admin already exists: ${email}`);
    await db.close();
    return;
  }

  const passwordHash = await hashPassword(password);
  const admin = await db.orm.public.User.create({
    email,
    username,
    passwordHash,
    name,
    role: 'ADMIN',
  });

  console.log('Admin user created:', { id: admin.id, email: admin.email, role: admin.role });
  await db.close();
}

main().catch(async (error) => {
  console.error('Seed failed:', error);
  try {
    await db.close();
  } catch {
    // ignore
  }
  process.exit(1);
});
