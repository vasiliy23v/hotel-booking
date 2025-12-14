/**
 * Безопасное восстановление из JSON бекапа
 * Автоматически подтверждает восстановление
 */

import * as fs from 'fs';
import * as path from 'path';
import * as dotenv from 'dotenv';
import { PrismaClient } from '../lib/generated/prisma';
import { PrismaNeon } from '@prisma/adapter-neon';

// Загружаем переменные окружения
dotenv.config({ path: '.env.local' });

const connectionString = process.env.DATABASE_URL;
if (!connectionString) {
  console.error('❌ DATABASE_URL не установлена');
  process.exit(1);
}

const adapter = new PrismaNeon({ connectionString });
const prisma = new PrismaClient({
  adapter,
  log: ['error', 'warn'],
});

async function restoreFromJson(filepath: string) {
  try {
    console.log('\n🔄 Восстановление из JSON backup...');
    console.log(`📁 Файл: ${filepath}\n`);

    // Проверяем существование файла
    if (!fs.existsSync(filepath)) {
      console.error(`❌ Файл не найден: ${filepath}`);
      process.exit(1);
    }

    // Читаем backup
    console.log('📖 Чтение бекапа...');
    const backup = JSON.parse(fs.readFileSync(filepath, 'utf-8'));
    console.log(`📅 Backup от: ${backup.timestamp}\n`);

    // Проверяем структуру бекапа
    if (!backup.data || typeof backup.data !== 'object') {
      console.error('❌ Неверный формат бекапа: отсутствует поле data');
      process.exit(1);
    }

    // Показываем статистику
    console.log('📊 Статистика бекапа:');
    for (const [table, records] of Object.entries(backup.data)) {
      const count = Array.isArray(records) ? records.length : 0;
      console.log(`   ${table}: ${count} записей`);
    }
    console.log('');

    // Очищаем таблицы (в обратном порядке из-за внешних ключей)
    console.log('🗑️  Очистка таблиц...');
    await prisma.bookingDateRange.deleteMany();
    await prisma.registrationToken.deleteMany();
    await prisma.feedback.deleteMany();
    await prisma.invite.deleteMany();
    await prisma.booking.deleteMany();
    await prisma.stairs.deleteMany();
    await prisma.room.deleteMany();
    await prisma.hotel.deleteMany();
    await prisma.user.deleteMany();
    console.log('   ✓ Таблицы очищены\n');

    // Восстанавливаем данные в правильном порядке (с учетом внешних ключей)
    console.log('📥 Восстановление данных...\n');
    
    const modelMap: Record<string, string> = {
      users: 'user',
      hotels: 'hotel',
      rooms: 'room',
      bookings: 'booking',
      stairs: 'stairs',
      invites: 'invite',
      feedback: 'feedback',
      registrationTokens: 'registrationToken',
      bookingDateRanges: 'bookingDateRange',
    };

    // Порядок восстановления: сначала независимые таблицы, потом зависимые
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
      if (!records) continue;
      if (!Array.isArray(records) || records.length === 0) {
        console.log(`   ⚠️  ${table}: пропущено (пусто)`);
        continue;
      }

      const modelName = modelMap[table] || table.charAt(0).toLowerCase() + table.slice(1);
      const model = (prisma as unknown as Record<string, { create: (args: { data: unknown }) => Promise<unknown> }>)[modelName];

      if (!model) {
        console.log(`   ⚠️  ${table}: модель не найдена, пропускаем`);
        continue;
      }

      console.log(`   Восстановление ${table}...`);
      let restored = 0;
      let errors = 0;

      for (const record of records) {
        try {
          await model.create({ data: record });
          restored++;
          if (table === 'hotels' && restored <= 3) {
            console.log(`      ✓ Hotel восстановлен: ${(record as { id?: string }).id || 'unknown'}`);
          }
        } catch (error: unknown) {
          errors++;
          const errorMessage = error instanceof Error ? error.message : String(error);
          if (errors <= 5 || table === 'hotels') {
            console.log(`      ⚠️  Ошибка записи ${table}: ${errorMessage.substring(0, 150)}`);
            if (table === 'hotels') {
              console.log(`         Record ID: ${(record as { id?: string }).id || 'unknown'}`);
            }
          }
        }
      }

      if (errors > 0) {
        console.log(`   ⚠️  ${table}: ${restored}/${records.length} записей восстановлено, ${errors} ошибок`);
      } else {
        console.log(`   ✓ ${table}: ${restored} записей восстановлено`);
      }
      totalRestored += restored;
    }

    console.log(`\n✅ Восстановление завершено!`);
    console.log(`   Всего восстановлено записей: ${totalRestored}\n`);
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Неизвестная ошибка';
    console.error(`\n❌ Ошибка восстановления: ${errorMessage}`);
    console.error(error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

// Главная функция
async function main() {
  const args = process.argv.slice(2);
  const filename = args[0];

  if (!filename) {
    console.error('❌ Укажите файл для восстановления');
    console.error('Пример: npx tsx scripts/restore-backup-safe.ts backup_2025-12-13T13-35-12.json');
    process.exit(1);
  }

  const backupDir = path.join(process.cwd(), 'backups');
  const filepath = path.join(backupDir, filename);

  await restoreFromJson(filepath);
}

main().catch((error) => {
  console.error('Критическая ошибка:', error);
  process.exit(1);
});

