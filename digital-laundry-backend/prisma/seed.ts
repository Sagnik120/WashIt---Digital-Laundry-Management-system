
import { PrismaClient, Role, ActiveStatus } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  const adminEmail = 'admin@laundry.local';
  const passwordHash = await bcrypt.hash('admin123', 10);

  await prisma.user.upsert({
    where: { email: adminEmail },
    update: {},
    create: {
      email: adminEmail,
      passwordHash,
      role: Role.ADMIN,
      emailVerified: true,
    },
  });

  await prisma.hostel.upsert({
    where: { hostelCode: 'H1' },
    update: {},
    create: { hostelName: 'Alpha Hostel', hostelCode: 'H1', status: ActiveStatus.ACTIVE },
  });
  await prisma.hostel.upsert({
    where: { hostelCode: 'H2' },
    update: {},
    create: { hostelName: 'Beta Hostel', hostelCode: 'H2', status: ActiveStatus.ACTIVE },
  });

  await prisma.staffCode.upsert({
    where: { code: 'STAFF001' },
    update: {},
    create: { code: 'STAFF001', staffNameHint: 'Front Desk', status: ActiveStatus.INACTIVE, claimed: false },
  });

  console.log('Seeded admin, hostels, staff codes.');
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
}).finally(async () => {
  await prisma.$disconnect();
});
