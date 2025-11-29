// Скрипт для применения EXCLUDE constraint к таблице bookings
// Запуск: npx tsx scripts/apply-booking-constraint.ts

import { PrismaClient } from '../lib/generated/prisma';
import { PrismaNeon } from '@prisma/adapter-neon';
import { neon } from '@neondatabase/serverless';

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  console.error('DATABASE_URL не установлена');
  process.exit(1);
}

async function applyConstraint() {
  const sql = neon(connectionString);
  
  try {
    console.log('Создание расширения btree_gist...');
    await sql`CREATE EXTENSION IF NOT EXISTS btree_gist`;
    console.log('✓ Расширение создано');

    console.log('Удаление существующего constraint (если есть)...');
    await sql`
      DO $$ 
      BEGIN
          IF EXISTS (
              SELECT 1 FROM pg_constraint 
              WHERE conname = 'bookings_no_overlap'
          ) THEN
              ALTER TABLE bookings DROP CONSTRAINT bookings_no_overlap;
          END IF;
      END $$;
    `;
    console.log('✓ Старый constraint удален (если был)');

    console.log('Создание EXCLUDE constraint...');
    await sql`
      ALTER TABLE bookings 
      ADD CONSTRAINT bookings_no_overlap 
      EXCLUDE USING gist (
          room_id WITH =,
          daterange(check_in, check_out, '[]') WITH &&
      );
    `;
    console.log('✓ Constraint создан');

    console.log('Добавление комментария...');
    await sql`
      COMMENT ON CONSTRAINT bookings_no_overlap ON bookings IS 
      'Предотвращает создание бронирований с пересекающимися датами для одной комнаты. Использует daterange для проверки пересечений.';
    `;
    console.log('✓ Комментарий добавлен');

    console.log('\n✅ EXCLUDE constraint успешно применен!');
    console.log('Теперь база данных будет автоматически предотвращать создание пересекающихся бронирований.');
  } catch (error) {
    console.error('Ошибка при применении constraint:', error);
    process.exit(1);
  }
}

applyConstraint();

