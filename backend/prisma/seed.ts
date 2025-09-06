import { PrismaClient } from '@prisma/client';
import { hashPassword } from '../src/utils/auth.js';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database...');

  const categories = await Promise.all([
    prisma.category.upsert({
      where: { name: 'Electronics' },
      update: {},
      create: { name: 'Electronics' }
    }),
    prisma.category.upsert({
      where: { name: 'Clothing' },
      update: {},
      create: { name: 'Clothing' }
    }),
    prisma.category.upsert({
      where: { name: 'Books' },
      update: {},
      create: { name: 'Books' }
    }),
    prisma.category.upsert({
      where: { name: 'Home & Garden' },
      update: {},
      create: { name: 'Home & Garden' }
    }),
    prisma.category.upsert({
      where: { name: 'Sports' },
      update: {},
      create: { name: 'Sports' }
    }),
    prisma.category.upsert({
      where: { name: 'Toys & Games' },
      update: {},
      create: { name: 'Toys & Games' }
    })
  ]);

  console.log(`✅ Created ${categories.length} categories`);

  // Create test users
  const users = await Promise.all([
    prisma.user.upsert({
      where: { email: 'john@example.com' },
      update: {},
      create: {
        email: 'john@example.com',
        passwordHash: await hashPassword('password123'),
        username: 'john_doe',
        fullName: 'John Doe',
        phone: '+1234567890',
        address: '123 Main St, City, State'
      }
    }),
    prisma.user.upsert({
      where: { email: 'jane@example.com' },
      update: {},
      create: {
        email: 'jane@example.com',
        passwordHash: await hashPassword('password123'),
        username: 'jane_smith',
        fullName: 'Jane Smith',
        phone: '+1234567891',
        address: '456 Oak Ave, City, State'
      }
    }),
    prisma.user.upsert({
      where: { email: 'mike@example.com' },
      update: {},
      create: {
        email: 'mike@example.com',
        passwordHash: await hashPassword('password123'),
        username: 'mike_wilson',
        fullName: 'Mike Wilson',
        phone: '+1234567892',
        address: '789 Pine St, City, State'
      }
    })
  ]);

  console.log(`✅ Created ${users.length} users`);

  // Create test products
  const products = await Promise.all([
    prisma.product.create({
      data: {
        title: 'iPhone 13 Pro',
        description: 'Excellent condition iPhone 13 Pro with all accessories',
        price: 699.99,
        categoryId: categories[0].id, // Electronics
        condition: 'like_new',
        sellerId: users[0].id, // John
        imageUrls: ['https://example.com/iphone1.jpg']
      }
    }),
    prisma.product.create({
      data: {
        title: 'MacBook Air M2',
        description: 'Barely used MacBook Air with M2 chip',
        price: 999.99,
        categoryId: categories[0].id, // Electronics
        condition: 'like_new',
        sellerId: users[1].id, // Jane
        imageUrls: ['https://example.com/macbook1.jpg']
      }
    }),
    prisma.product.create({
      data: {
        title: 'Nike Running Shoes',
        description: 'Size 10 Nike running shoes in great condition',
        price: 89.99,
        categoryId: categories[1].id, // Clothing
        condition: 'good',
        sellerId: users[2].id, // Mike
        imageUrls: ['https://example.com/shoes1.jpg']
      }
    })
  ]);

  console.log(`✅ Created ${products.length} products`);
  console.log('🌱 Database seeded successfully!');
}

main()
  .catch((e) => {
    console.error('❌ Seeding failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
