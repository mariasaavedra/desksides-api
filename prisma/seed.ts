import { faker } from '@faker-js/faker';
import * as bcryptjs from 'bcryptjs';
import { User, PrismaClient } from '@prisma/client';
import { industries, publications } from './constant';
const prisma = new PrismaClient();
async function main() {
  const password = await bcryptjs.hash('password', 10);
  const maria = await prisma.user.upsert({
    where: { email: 'msaav3@gmail.com' },
    update: {},
    create: {
      email: 'msaav3@gmail.com',
      first_name: 'Maria',
      last_name: 'Saavedra',
      password: password,
      is_verified: new Date(),
      is_approved: new Date(),
      role: 'ADMIN',
      token: '',
      stripe_customer_id: '',
    },
  });
  console.log('seed user...', maria);

  const seedAdmins = async () => {
    const users: Array<Omit<User, 'id' | 'created_at'>> = [];
    for (let i = 0; i < 10; i++) {
      users.push({
        first_name: faker.name.firstName(),
        last_name: faker.name.lastName(),
        email: `admin-${i}@example.com`,
        password: password,
        is_verified: new Date(),
        is_approved: new Date(),
        role: 'ADMIN',
        token: '',
        stripe_customer_id: '',
        updated_at: new Date(),
      });
    }
    try {
      await prisma.user.createMany({ data: users, skipDuplicates: true });
    } catch (e) {
      console.log(`Error: ${e}`);
    }
  };

  // seed brand users.
  const seedBrands = async () => {
    const users: Array<Omit<User, 'id' | 'created_at'>> = [];
    for (let i = 0; i < 10; i++) {
      users.push({
        first_name: faker.name.firstName(),
        last_name: faker.name.lastName(),
        email: `brand-${i}@example.com`,
        password: password,
        is_verified: new Date(),
        is_approved: new Date(),
        role: 'BRAND',
        token: '',
        stripe_customer_id: '',
        updated_at: new Date(),
      });
    }
    try {
      await prisma.user.createMany({ data: users, skipDuplicates: true });
    } catch (e) {
      console.log(`Error: ${e}`);
    }
  };

  // seed journalists.
  const seedJournalists = async () => {
    // create user.
    const users: Array<Omit<User, 'id' | 'created_at'>> = [];
    for (let i = 0; i < 10; i++) {
      users.push({
        first_name: faker.name.firstName(),
        last_name: faker.name.lastName(),
        email: `journalist-${i}@example.com`,
        password: password,
        is_verified: new Date(),
        is_approved: new Date(),
        role: 'JOURNALIST',
        token: '',
        stripe_customer_id: '',
        updated_at: new Date(),
      });
    }
    try {
      // save users.
      await prisma.user.createMany({
        data: users,
        skipDuplicates: true,
      });
    } catch (e) {
      throw new Error(`Failed to seed journalists: ${e}`);
    }
  };

  // seed industries.
  const seedIndustries = async () => {
    try {
      await prisma.industry.createMany({
        data: industries,
        skipDuplicates: true,
      });
    } catch (e) {
      console.log(`Error: ${e}`);
    }
  };

  // seed industries.
  const seedPublications = async () => {
    try {
      await prisma.industry.createMany({
        data: publications,
        skipDuplicates: true,
      });
    } catch (e) {
      console.log(`Error: ${e}`);
    }
  };

  await seedAdmins();
  await seedBrands();
  await seedJournalists();
  await seedIndustries();
  await seedPublications();
}
main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
