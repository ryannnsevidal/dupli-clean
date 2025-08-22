import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding database...');

  // Create a test user
  const user = await prisma.user.upsert({
    where: { email: 'test@example.com' },
    update: {},
    create: {
      email: 'test@example.com',
      name: 'Test User',
    },
  });

  console.log('Created user:', user.email);

  // Create a default project
  const project = await prisma.project.upsert({
    where: { 
      ownerId_name: { 
        ownerId: user.id, 
        name: 'default' 
      } 
    },
    update: {},
    create: {
      ownerId: user.id,
      name: 'default',
    },
  });

  console.log('Created project:', project.name);

  console.log('Database seeded successfully');
}

main()
  .catch((e) => {
    console.error('Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
