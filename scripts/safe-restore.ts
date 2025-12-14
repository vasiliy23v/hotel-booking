/**
 * Безопасное восстановление данных из JSON бекапа
 * С проверками и подтверждениями
 */

import * as fs from 'fs';
import * as path from 'path';
import * as dotenv from 'dotenv';

// Загружаем переменные окружения
dotenv.config({ path: '.env.local' });

import { PrismaClient } from '../lib/generated/prisma';
import { PrismaNeon } from '@prisma/adapter-neon';

const connectionString = process.env.DATABASE_URL;
if (!connectionString) {
  console.error('❌ DATABASE_URL не установлена');
  process.exit(1);
}

const adapter = new PrismaNeon({ connectionString });
const prisma = new PrismaClient({ adapter, log: ['error'] });

async function safeRestore(backupFile: string) {
  try {
    console.log('🔍 Проверка бекапа...');
    
    // Проверяем существование файла
    const filepath = path.join(process.cwd(), 'backups', backupFile);
    if (!fs.existsSync(filepath)) {
      console.error(`❌ Файл не найден: ${filepath}`);
      process.exit(1);
    }

    // Читаем и проверяем структуру бекапа
    const backupContent = fs.readFileSync(filepath, 'utf-8');
    const backup = JSON.parse(backupContent);
    
    if (!backup.timestamp || !backup.data) {
      console.error('❌ Неверный формат бекапа');
      process.exit(1);
    }

    console.log(`✅ Бекап найден: ${backup.timestamp}`);
    console.log(`📊 Содержимое:`);
    for (const [table, records] of Object.entries(backup.data)) {
      const count = Array.isArray(records) ? records.length : 0;
      console.log(`   - ${table}: ${count} записей`);
    }

    // Проверяем подключение к БД
    console.log('\n🔍 Проверка подключения к БД...');
    await prisma.$connect();
    console.log('✅ Подключение установлено');

    // Проверяем существующие данные
    console.log('\n📊 Текущее состояние БД:');
    const currentData = {
      users: await prisma.user.count(),
      hotels: await prisma.hotel.count(),
      rooms: await prisma.room.count(),
      bookings: await prisma.booking.count(),
      stairs: await prisma.stairs.count(),
      invites: await prisma.invite.count(),
      feedback: await prisma.feedback.count(),
      registrationTokens: await prisma.registrationToken.count(),
      bookingDateRanges: await prisma.bookingDateRange.count(),
    };

    for (const [table, count] of Object.entries(currentData)) {
      console.log(`   - ${table}: ${count} записей`);
    }

    // Подтверждение
    console.log('\n⚠️  ВНИМАНИЕ: Это удалит все текущие данные и заменит их из бекапа!');
    console.log('Для продолжения установите переменную окружения: CONFIRM_RESTORE=true');
    
    if (process.env.CONFIRM_RESTORE !== 'true') {
      console.log('\n❌ Восстановление отменено (для безопасности требуется CONFIRM_RESTORE=true)');
      await prisma.$disconnect();
      process.exit(0);
    }

    // Очищаем таблицы (в обратном порядке из-за внешних ключей)
    console.log('\n🗑️  Очистка таблиц...');
    await prisma.bookingDateRange.deleteMany();
    await prisma.registrationToken.deleteMany();
    await prisma.feedback.deleteMany();
    await prisma.invite.deleteMany();
    await prisma.booking.deleteMany();
    await prisma.stairs.deleteMany();
    await prisma.room.deleteMany();
    await prisma.hotel.deleteMany();
    await prisma.user.deleteMany();
    console.log('✅ Таблицы очищены');

    // Восстанавливаем данные
    console.log('\n📥 Восстановление данных...');
    
    const restoreOrder = [
      'users',
      'hotels',
      'rooms',
      'stairs',
      'bookings',
      'invites',
      'feedback',
      'registrationTokens',
      'bookingDateRanges',
    ];

    let totalRestored = 0;

    for (const table of restoreOrder) {
      const records = backup.data[table];
      if (!Array.isArray(records) || records.length === 0) {
        console.log(`   ⏭️  ${table}: пропущено (нет данных)`);
        continue;
      }

      // Преобразуем имя таблицы в имя модели Prisma
      // users -> user, hotels -> hotel, rooms -> room, etc.
      const modelNameMap: Record<string, string> = {
        'users': 'user',
        'hotels': 'hotel',
        'rooms': 'room',
        'bookings': 'booking',
        'stairs': 'stairs',
        'invites': 'invite',
        'feedback': 'feedback',
        'registrationTokens': 'registrationToken',
        'bookingDateRanges': 'bookingDateRange',
      };

      const modelName = modelNameMap[table];
      if (!modelName) {
        console.log(`   ⚠️  ${table}: неизвестная таблица, пропускаем`);
        continue;
      }
      const model = (prisma as unknown as Record<string, { create: (args: { data: unknown }) => Promise<unknown> }>)[modelName];

      if (!model) {
        console.log(`   ⚠️  ${table}: модель "${modelName}" не найдена, пропускаем`);
        continue;
      }

      console.log(`   📥 Восстановление ${table}...`);
      let restored = 0;
      let errors = 0;

      for (const record of records) {
        try {
          // Преобразуем данные для Prisma
          const processedRecord = { ...record };
          
          // Обработка поля image для hotels (Buffer из JSON)
          if (table === 'hotels' && processedRecord.image && typeof processedRecord.image === 'object' && !Array.isArray(processedRecord.image)) {
            // Преобразуем объект с числовыми ключами обратно в Buffer
            const imageObj = processedRecord.image as Record<string, number>;
            const imageArray = Object.keys(imageObj)
              .map(k => parseInt(k, 10))
              .sort((a, b) => a - b)
              .map(k => imageObj[k]);
            processedRecord.image = Buffer.from(imageArray);
          }
          
          await model.create({ data: processedRecord });
          restored++;
        } catch (error: unknown) {
          errors++;
          const errorMessage = error instanceof Error ? error.message : String(error);
          if (errors <= 3) { // Показываем только первые 3 ошибки
            console.log(`      ⚠️  Ошибка записи: ${errorMessage.substring(0, 100)}`);
          }
        }
      }

      totalRestored += restored;
      if (errors > 0) {
        console.log(`   ⚠️  ${table}: ${restored}/${records.length} записей восстановлено, ${errors} ошибок`);
      } else {
        console.log(`   ✅ ${table}: ${restored} записей восстановлено`);
      }
    }

    console.log(`\n✅ Восстановление завершено!`);
    console.log(`📊 Всего восстановлено записей: ${totalRestored}`);

    // Проверяем результат
    console.log('\n🔍 Проверка восстановленных данных:');
    const restoredData = {
      users: await prisma.user.count(),
      hotels: await prisma.hotel.count(),
      rooms: await prisma.room.count(),
      bookings: await prisma.booking.count(),
      stairs: await prisma.stairs.count(),
      invites: await prisma.invite.count(),
      feedback: await prisma.feedback.count(),
      registrationTokens: await prisma.registrationToken.count(),
      bookingDateRanges: await prisma.bookingDateRange.count(),
    };

    for (const [table, count] of Object.entries(restoredData)) {
      const expected = Array.isArray(backup.data[table]) ? backup.data[table].length : 0;
      const status = count === expected ? '✅' : '⚠️';
      console.log(`   ${status} ${table}: ${count} (ожидалось: ${expected})`);
    }

  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Неизвестная ошибка';
    console.error(`\n❌ Ошибка восстановления: ${errorMessage}`);
    console.error(error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

// Запуск
const backupFile = process.argv[2] || 'backup_2025-12-13T13-35-12.json';
console.log(`🗄️  Безопасное восстановление из бекапа: ${backupFile}\n`);
safeRestore(backupFile);

