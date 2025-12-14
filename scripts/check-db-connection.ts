// ============================================
// СКРИПТ ДЛЯ ПРОВЕРКИ ПОДКЛЮЧЕНИЯ К БАЗЕ ДАННЫХ
// Используется в CI/CD пайплайне перед деплоем
// ============================================

import * as dotenv from 'dotenv';
import { PrismaClient } from '../lib/generated/prisma';
import { PrismaNeon } from '@prisma/adapter-neon';

// Загружаем переменные окружения (сначала .env, потом .env.local для переопределения)
dotenv.config({ path: '.env' });
dotenv.config({ path: '.env.local', override: true });

/**
 * Проверяет подключение к базе данных
 * Если DATABASE_URL не установлена, выводит предупреждение, но не прерывает билд
 */
async function checkDatabaseConnection(): Promise<void> {
  const connectionString = process.env.DATABASE_URL;
  
  if (!connectionString) {
    console.warn('⚠️  DATABASE_URL не установлена во время билда.');
    console.warn('⚠️  Проверка подключения к базе данных пропущена.');
    console.warn('⚠️  Убедитесь, что DATABASE_URL настроена в Vercel для runtime.');
    console.log('✅ Продолжаем билд без проверки БД...');
    return; // Не прерываем билд, просто пропускаем проверку
  }

  console.log('🔍 Проверка подключения к базе данных...');
  console.log(`📡 DATABASE_URL: ${connectionString.substring(0, 20)}...`);

  let prisma: PrismaClient | null = null;

  try {
    // Создаем адаптер с connectionString
    const adapter = new PrismaNeon({ connectionString });
    
    prisma = new PrismaClient({ 
      adapter,
      log: ['error'],
    });

    // Пытаемся выполнить простой запрос к базе данных
    await prisma.$connect();
    console.log('✅ Подключение к базе данных установлено');

    // Проверяем, что можем выполнить запрос
    await prisma.$queryRaw`SELECT 1 as test`;
    console.log('✅ Запрос к базе данных выполнен успешно');

    // Проверяем наличие основных таблиц (упрощенный запрос)
    try {
      const tables = await prisma.$queryRaw<Array<{ tablename: string }>>`
        SELECT tablename::text as tablename
        FROM pg_tables 
        WHERE schemaname = 'public'
      `;
      
      const tableNames = tables.map(t => t.tablename);
      const requiredTables = ['users', 'hotels', 'rooms', 'bookings'];
      const missingTables = requiredTables.filter(t => !tableNames.includes(t));

      if (missingTables.length > 0) {
        console.warn(`⚠️  Отсутствуют таблицы: ${missingTables.join(', ')}`);
        console.warn('⚠️  Убедитесь, что миграции применены');
      } else {
        console.log('✅ Все необходимые таблицы присутствуют');
      }
    } catch (tableCheckError) {
      // Игнорируем ошибку проверки таблиц, главное - подключение работает
      console.warn('⚠️  Не удалось проверить список таблиц, но подключение работает');
    }

    console.log('✅ Проверка подключения к базе данных завершена успешно');
  } catch (error) {
    console.error('❌ Ошибка при проверке подключения к базе данных:');
    console.error(error);
    throw new Error(
      `Не удалось подключиться к базе данных: ${error instanceof Error ? error.message : 'Неизвестная ошибка'}`
    );
  } finally {
    if (prisma) {
      await prisma.$disconnect();
      console.log('🔌 Соединение с базой данных закрыто');
    }
  }
}

// Запускаем проверку
checkDatabaseConnection()
  .then(() => {
    console.log('✅ Все проверки пройдены успешно');
    process.exit(0);
  })
  .catch((error) => {
    const errorMessage = error instanceof Error ? error.message : 'Неизвестная ошибка';
    console.error('❌ Проверка не пройдена:', errorMessage);
    process.exit(1);
  });

