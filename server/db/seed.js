import { PrismaClient } from '@prisma/client';
import dotenv from 'dotenv';

dotenv.config();

const prisma = new PrismaClient();

async function main() {
  try {
    console.log('Starting to seed the database...');

    // Create categories
    const kitchenCategory = await prisma.category.create({
      data: {
        name: 'Kitchen Cabinets',
        description: 'Kitchen cabinet collection'
      }
    });

    // Create materials
    const woodMaterial = await prisma.material.create({
      data: {
        name: 'Solid Wood',
        description: 'Premium solid wood material'
      }
    });

    // Create products
    await prisma.product.create({
      data: {
        name: 'Base Cabinet',
        type: 'base',
        unitCost: 299.99,
        description: 'Standard base cabinet',
        categoryId: kitchenCategory.id,
        materials: {
          connect: [{ id: woodMaterial.id }]
        }
      }
    });

    console.log('Database seeded successfully');
  } catch (error) {
    console.error('Seeding error:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

main();