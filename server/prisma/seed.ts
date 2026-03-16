import 'dotenv/config';
import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import * as bcrypt from 'bcrypt';

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
    console.log('🌱 Starting Foodio database seed...\n');

    // ─── Clean Slate (respect foreign key order) ─────────────────────────────
    console.log('Cleaning existing data...');
    await prisma.orderItem.deleteMany();
    await prisma.order.deleteMany();
    await prisma.menuItem.deleteMany();
    await prisma.category.deleteMany();
    await prisma.user.deleteMany();
    console.log('Existing data cleared.\n');

    // ─── Seed Users ──────────────────────────────────────────────────────────
    // eslint-disable-next-line
    const hashedPassword = await bcrypt.hash('password123', SALT_ROUNDS);

    const admin = await prisma.user.create({
      data: {
        name: 'Foodio Admin',
        email: 'admin@foodio.com',
        // eslint-disable-next-line
        password: hashedPassword,
        role: 'ADMIN',
      },
    });
    console.log(`✓ Admin user created: ${admin.email}`);

    const user = await prisma.user.create({
      data: {
        name: 'Test User',
        email: 'user@foodio.com',
        // eslint-disable-next-line
        password: hashedPassword,
        role: 'USER',
      },
    });
    console.log(`✓ Test user created: ${user.email}\n`);

    // ─── Seed Categories & Menu Items ───────────────────────────────────────
    const categoriesData = [
      {
        name: 'Starters',
        description: 'Light bites and appetizers to begin your meal.',
        imageUrl:
          'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=800&q=80',
        menuItems: [
          {
            name: 'Caesar Salad',
            description:
              'Crisp romaine lettuce with parmesan, croutons, and our signature Caesar dressing.',
            price: 8.99,
            imageUrl:
              'https://images.unsplash.com/photo-1546793665-c74683f339c1?w=800&q=80',
          },
          {
            name: 'Bruschetta',
            description:
              'Toasted artisan bread topped with fresh tomatoes, basil, garlic, and extra virgin olive oil.',
            price: 7.49,
            imageUrl:
              'https://images.unsplash.com/photo-1572695157366-5e585ab2b69f?w=800&q=80',
          },
          {
            name: 'Soup of the Day',
            description:
              "Chef's daily selection of seasonal soup, served with warm bread.",
            price: 6.99,
            imageUrl:
              'https://images.unsplash.com/photo-1547592166-23ac45744acd?w=800&q=80',
          },
        ],
      },
      {
        name: 'Main Courses',
        description: 'Hearty mains made with quality ingredients.',
        imageUrl:
          'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=800&q=80',
        menuItems: [
          {
            name: 'Grilled Salmon',
            description:
              'Atlantic salmon fillet with lemon butter, seasonal vegetables, and herb rice.',
            price: 22.99,
            imageUrl:
              'https://images.unsplash.com/photo-1467003909585-2f8a72700288?w=800&q=80',
          },
          {
            name: 'Ribeye Steak',
            description:
              '12oz prime ribeye, cooked to your preference, with peppercorn sauce and truffle fries.',
            price: 28.99,
            imageUrl:
              'https://images.unsplash.com/photo-1558030006-450675393462?w=800&q=80',
          },
          {
            name: 'Creamy Mushroom Pasta',
            description:
              'Fettuccine in a rich wild mushroom and cream sauce with parmesan and fresh herbs.',
            price: 16.99,
            imageUrl:
              'https://images.unsplash.com/photo-1473093295043-cdd812d0e601?w=800&q=80',
          },
        ],
      },
      {
        name: 'Desserts',
        description: 'Sweet endings to your dining experience.',
        imageUrl:
          'https://images.unsplash.com/photo-1551024506-0bccd828d307?w=800&q=80',
        menuItems: [
          {
            name: 'Chocolate Lava Cake',
            description:
              'Warm chocolate cake with a molten centre, served with vanilla ice cream.',
            price: 9.99,
            imageUrl:
              'https://images.unsplash.com/photo-1624353365286-3f8d62daad51?w=800&q=80',
          },
          {
            name: 'Tiramisu',
            description:
              'Classic Italian layers of mascarpone, espresso-soaked ladyfingers, and cocoa.',
            price: 8.49,
            imageUrl:
              'https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?w=800&q=80',
          },
          {
            name: 'Berry Panna Cotta',
            description:
              'Silky vanilla panna cotta with fresh seasonal berries and mint.',
            price: 7.99,
            imageUrl:
              'https://images.unsplash.com/photo-1488477181946-6428a0291777?w=800&q=80',
          },
        ],
      },
    ];

    for (const cat of categoriesData) {
      const category = await prisma.category.create({
        data: {
          name: cat.name,
          description: cat.description,
          imageUrl: cat.imageUrl,
        },
      });
      console.log(`✓ Category created: ${category.name}`);

      for (const item of cat.menuItems) {
        await prisma.menuItem.create({
          data: {
            name: item.name,
            description: item.description,
            price: item.price,
            imageUrl: item.imageUrl,
            availability: true,
            categoryId: category.id,
          },
        });
        console.log(`  → Menu item: ${item.name}`);
      }
      console.log('');
    }

    console.log('✅ Foodio database seed completed successfully.');
  } finally {
    await prisma.$disconnect();
  }
}

main().catch((error: unknown) => {
  if (error instanceof Error) {
    console.error('Seed failed:', error.message);
  } else {
    console.error('Seed failed with non-error value:', error);
  }
  process.exit(1);
});
