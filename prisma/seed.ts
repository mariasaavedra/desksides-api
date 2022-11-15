import * as bcryptjs from 'bcryptjs';
import { PrismaClient } from '@prisma/client';
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
      token: '',
    },
  });
  console.log('seed user...', maria);
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
