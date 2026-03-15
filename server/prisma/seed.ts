import 'dotenv/config';
import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { hashPassword } from '../src/auth/utils/password.util';

const ADMIN_EMAIL = 'admin@foodio.com';
const ADMIN_PASSWORD = 'admin123';
const ADMIN_NAME = 'Admin';
const SALT_ROUNDS = 10;

async function main(): Promise<void> {
  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) {
    throw new Error('DATABASE_URL environment variable is not set');
  }

  const adapter = new PrismaPg({
    connectionString,
    ssl: process.env.DB_SSL === 'true' ? { rejectUnauthorized: false } : false,
  });

  const prisma = new PrismaClient({ adapter });

  try {
    const existing = await prisma.user.findUnique({
      where: { email: ADMIN_EMAIL },
    });

    if (existing) {
      console.log(`Admin user already exists: ${ADMIN_EMAIL}`);
      return;
    }

    const hashedPassword = await hashPassword(ADMIN_PASSWORD, SALT_ROUNDS);

    await prisma.user.create({
      data: {
        email: ADMIN_EMAIL,
        name: ADMIN_NAME,
        password: hashedPassword,
        role: 'ADMIN',
      },
    });

    console.log(`Admin user created successfully: ${ADMIN_EMAIL}`);
  } finally {
    await prisma.$disconnect();
  }
}

main().catch((e) => {
  console.error('Seed failed:', e);
  process.exit(1);
});
