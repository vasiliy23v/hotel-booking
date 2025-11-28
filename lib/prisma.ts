// ============================================
// PRISMA CLIENT INSTANCE
// Singleton для использования Prisma Client в Next.js
// ============================================

import { PrismaClient } from './generated/prisma/index.js';
import { PrismaNeon } from '@prisma/adapter-neon';

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

/**
 * Получить строку подключения к базе данных
 * Next.js автоматически загружает переменные из .env.local
 */
function getConnectionString(): string {
  const connectionString = process.env.DATABASE_URL;
  
  if (!connectionString) {
    throw new Error(
      'DATABASE_URL не установлена. Пожалуйста, установите переменную окружения DATABASE_URL в .env.local'
    );
  }
  
  return connectionString;
}

/**
 * Получить Prisma Client (singleton)
 * Использует ленивую инициализацию для правильной загрузки переменных окружения
 */
function createPrismaClient(): PrismaClient {
  try {
    const connectionString = getConnectionString();
    
    // Создаем адаптер с connectionString (PrismaNeon сам создаст Pool внутри)
    const adapter = new PrismaNeon({ connectionString });
    
    const client = new PrismaClient({ 
      adapter,
      log: process.env.NODE_ENV === 'development' ? ['error', 'warn'] : ['error'],
    });
    
    return client;
  } catch (error) {
    console.error('Error creating Prisma Client:', error);
    throw error;
  }
}

export const prisma =
  globalForPrisma.prisma ?? createPrismaClient();

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma;
}

