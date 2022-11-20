import { faker } from '@faker-js/faker';
import * as bcryptjs from 'bcryptjs';
import { PrismaClient, User } from '@prisma/client';
import { industries, publications } from './constant';
import { match } from 'node:assert';
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

  const seedIndustries = async () => {
    await prisma.industry.createMany({
      data: industries,
      skipDuplicates: true,
    });
  };

  const seedPublications = async () => {
    await prisma.industry.createMany({
      data: publications,
      skipDuplicates: true,
    });
  };

  const seedBrands = async () => {
    for (let i = 0; i < 10; i++) {
      try {
        const user = await prisma.user.create({
          data: {
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
            Profile: {
              create: {
                affliate_url: 'http://www.example.com',
                preferred_datetime: new Date(),
                preferred_medium: 'Digital',
                preferred_time: 'Noon',
                quarterly_goal: 10,
                stories_per_month: 3,
                years_of_exp: 5,
              },
            },
          },
          include: {
            Profile: true, // Include all posts in the returned object
            Match: true,
          },
        });
      } catch (e) {
        console.log('Failed to seed brand', e);
      }
    }
  };

  const seedJournalists = async () => {
    for (let i = 0; i < 10; i++) {
      try {
        const user = await prisma.user.create({
          data: {
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
            Profile: {
              create: {
                affliate_url: 'http://www.example.com',
                preferred_datetime: new Date(),
                preferred_medium: 'Digital',
                preferred_time: 'Noon',
                quarterly_goal: 10,
                stories_per_month: 3,
                years_of_exp: 5,
              },
            },
          },
          include: {
            Profile: true, // Include all posts in the returned object
            Match: true,
          },
        });
      } catch (e) {
        console.log('Failed to seed journalist', e);
      }
    }
  };

  const seedMatches = async () => {
    const journalists = await prisma.user.findMany({
      where: {
        role: 'JOURNALIST',
      },
    });
    const brands = await prisma.user.findMany({
      where: {
        role: 'BRAND',
      },
    });

    journalists.forEach(async (j, index) => {
      try {
        const match = await prisma.match.create({
          data: {
            brand_id: brands[index].id,
            journalist_id: journalists[index].id,
          },
        });
        // update journalist
        const updateJournalist = await prisma.user.update({
          where: {
            id: journalists[index].id,
          },
          data: {
            Match: {
              connect: {
                id: match.id,
              },
            },
          },
        });
        // update brand
        const updateBrand = await prisma.user.update({
          where: {
            id: brands[index].id,
          },
          data: {
            Match: {
              connect: {
                id: match.id,
              },
            },
          },
        });
      } catch (e) {
        console.log('Failed to create match', e);
      }
    });
  };

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
      });

      try {
        await prisma.user.createMany({ data: users, skipDuplicates: true });
      } catch (e) {
        console.log('Failed to create users', e);
      }
    }
  };

  await seedIndustries();
  await seedPublications();
  await seedAdmins();
  await seedJournalists();
  await seedBrands();
  await seedMatches();
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
