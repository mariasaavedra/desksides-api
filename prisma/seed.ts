import { faker } from '@faker-js/faker';
import * as bcryptjs from 'bcryptjs';
import { User, PrismaClient } from '@prisma/client';
import { industries, publications } from './constant';
import { profile } from 'console';
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
    const users: Array<any> = [];
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
        profile: {
          affliate_url: 'http://www.example.com',
          preferred_datetime: new Date(),
          preferred_medium: 'Digital',
          preferred_time: '1PM',
          quarterly_goal: 3,
          stories_per_month: 1,
          years_of_exp: 10,
        },
      });

      users.forEach(async (user) => {
        const { profile, ...details } = user;
        try {
          const existingRecord = await prisma.user.findUnique({
            where: { email: user.email },
          });
          if (existingRecord) {
            return;
          }
          const userWithProfile = await prisma.user.create({
            data: {
              ...details,
              Profile: {
                create: { ...user.profile },
              },
            },
            include: {
              Profile: true,
            },
          });
        } catch (e) {
          console.log('Failed to create user', e);
        }
      });
    }
    // try {
    //   await prisma.user.createMany({ data: users, skipDuplicates: true });
    // } catch (e) {
    //   console.log(`Error: ${e}`);
    // }
  };
  await seedAdmins();
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
