import { PrismaClient } from '@prisma/client';

let prisma: PrismaClient;

try {
  prisma = new PrismaClient();
  // Test connection or prepare
} catch (error) {
  console.warn('Prisma client initialization failed. Please make sure DATABASE_URL is configured in your .env file.', error);
  // Fallback placeholder to prevent crashes
  prisma = new Proxy({} as PrismaClient, {
    get: () => {
      throw new Error('Database is not initialized. Please verify your DATABASE_URL in .env.');
    }
  });
}

export { prisma };
