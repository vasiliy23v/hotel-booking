/**
 * Безопасная миграция данных о кроватях и вместимости
 * 
 * Этапы:
 * 1. Анализ существующих данных
 * 2. Перенос в description (без удаления старых полей)
 * 3. Проверка результата
 * 4. Только после подтверждения - удаление старых полей
 */

import { prisma } from '../lib/prisma';
import { createInterface } from 'readline';

// Типы для миграции
type RoomForMigration = {
  id: string;
  number: string;
  name: string | null;
  capacity: string;
  maxCapacity: number;
  beds: unknown; // JSON поле из Prisma
  description: string | null;
};

type MigrationError = {
  roomId: string;
  roomNumber: string;
  error: string;
};

// Цвета для консоли
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  red: '\x1b[31m',
};

function log(message: string, color: keyof typeof colors = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

/**
 * Шаг 1: Анализ существующих данных
 */
async function analyzeData() {
  log('\n=== ШАГ 1: АНАЛИЗ СУЩЕСТВУЮЩИХ ДАННЫХ ===\n', 'bright');

  const rooms = await prisma.room.findMany({
    select: {
      id: true,
      number: true,
      name: true,
      capacity: true,
      maxCapacity: true,
      beds: true,
      description: true,
    },
  });

  log(`Всего комнат: ${rooms.length}`, 'blue');

  let needsMigration = 0;
  let hasDescription = 0;
  let emptyBeds = 0;

  rooms.forEach(room => {
    const beds = Array.isArray(room.beds) ? room.beds : [];
    const hasBedsData = beds.length > 0 || (room.capacity && room.capacity !== '');
    const hasDesc = room.description && room.description.trim() !== '';

    if (hasBedsData) needsMigration++;
    if (hasDesc) hasDescription++;
    if (beds.length === 0) emptyBeds++;
  });

  log(`\nСтатистика:`, 'yellow');
  log(`  - Комнат с данными о кроватях/вместимости: ${needsMigration}`);
  log(`  - Комнат с описанием: ${hasDescription}`);
  log(`  - Комнат без кроватей: ${emptyBeds}`);

  // Показываем примеры
  log(`\n📋 Примеры данных (первые 5 комнат):`, 'yellow');
  rooms.slice(0, 5).forEach(room => {
    const beds = Array.isArray(room.beds) ? room.beds : [];
    log(`\n  Комната ${room.number}${room.name ? ` (${room.name})` : ''}:`, 'blue');
    log(`    capacity: "${room.capacity}"`);
    log(`    maxCapacity: ${room.maxCapacity}`);
    log(`    beds: [${beds.map(b => `"${b}"`).join(', ')}]`);
    log(`    description: ${room.description ? `"${room.description.substring(0, 50)}..."` : 'null'}`);
  });

  return rooms;
}

/**
 * Шаг 2: Формирование нового описания
 */
function buildNewDescription(room: RoomForMigration): string {
  const parts: string[] = [];
  const beds = Array.isArray(room.beds) ? (room.beds as string[]) : [];

  // Добавляем информацию о вместимости
  if (room.capacity && room.capacity.trim() !== '') {
    parts.push(`Вместимость: ${room.capacity}`);
  } else if (room.maxCapacity) {
    parts.push(`Вместимость: до ${room.maxCapacity} чел.`);
  }

  // Добавляем информацию о кроватях
  if (beds.length > 0) {
    const bedsStr = beds.map((bed: string) => bed.trim()).filter((b: string) => b).join(', ');
    if (bedsStr) {
      parts.push(`Кровати: ${bedsStr}`);
    }
  }

  // Добавляем существующее описание (если есть)
  if (room.description && room.description.trim() !== '') {
    parts.push(room.description.trim());
  }

  return parts.join('\n');
}

/**
 * Шаг 3: Превью миграции (без сохранения)
 */
async function previewMigration(rooms: RoomForMigration[]) {
  log('\n=== ШАГ 2: ПРЕВЬЮ МИГРАЦИИ ===\n', 'bright');
  log('Показываем как будут выглядеть данные после миграции:\n', 'yellow');

  const preview = rooms.slice(0, 10).map(room => {
    const newDescription = buildNewDescription(room);
    return {
      room: `${room.number}${room.name ? ` (${room.name})` : ''}`,
      old: {
        capacity: room.capacity,
        beds: Array.isArray(room.beds) ? room.beds : [],
        description: room.description,
      },
      new: {
        description: newDescription,
      },
    };
  });

  preview.forEach((item, index) => {
    log(`\n${index + 1}. Комната ${item.room}:`, 'blue');
    log(`   БЫЛО:`, 'red');
    log(`     capacity: "${item.old.capacity}"`);
    log(`     beds: [${item.old.beds.map((b: string) => `"${b}"`).join(', ')}]`);
    log(`     description: ${item.old.description ? `"${item.old.description}"` : 'null'}`);
    log(`   СТАНЕТ:`, 'green');
    log(`     description: "${item.new.description}"`);
  });

  const roomsToUpdate = rooms.filter(room => {
    const beds = Array.isArray(room.beds) ? room.beds : [];
    return beds.length > 0 || (room.capacity && room.capacity !== '');
  });

  log(`\n📊 Будет обновлено комнат: ${roomsToUpdate.length} из ${rooms.length}`, 'yellow');
}

/**
 * Шаг 4: Выполнение миграции
 */
async function executeMigration(dryRun: boolean = true) {
  if (dryRun) {
    log('\n=== РЕЖИМ ТЕСТИРОВАНИЯ (DRY RUN) ===\n', 'yellow');
    log('Данные НЕ будут изменены. Это только проверка.\n');
  } else {
    log('\n=== ВЫПОЛНЕНИЕ МИГРАЦИИ ===\n', 'bright');
    log('⚠️  ВНИМАНИЕ: Данные БУДУТ изменены!\n', 'red');
  }

  const rooms = await prisma.room.findMany();
  let updated = 0;
  let skipped = 0;
  const errors: MigrationError[] = [];

  for (const room of rooms) {
    try {
      const beds = Array.isArray(room.beds) ? room.beds : [];
      const hasData = beds.length > 0 || (room.capacity && room.capacity !== '');

      if (!hasData) {
        skipped++;
        continue;
      }

      const newDescription = buildNewDescription(room);

      if (!dryRun) {
        await prisma.room.update({
          where: { id: room.id },
          data: { description: newDescription },
        });
      }

      updated++;
      log(`✓ Обновлена комната ${room.number}`, 'green');
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Неизвестная ошибка';
      errors.push({ roomId: room.id, roomNumber: room.number, error: errorMessage });
      log(`✗ Ошибка для комнаты ${room.number}: ${errorMessage}`, 'red');
    }
  }

  log(`\n📊 Результаты:`, 'yellow');
  log(`  ✓ Обновлено: ${updated}`);
  log(`  - Пропущено: ${skipped}`);
  log(`  ✗ Ошибок: ${errors.length}`);

  if (errors.length > 0) {
    log(`\n⚠️  Ошибки:`, 'red');
    errors.forEach(e => log(`  - Комната ${e.roomNumber}: ${e.error}`));
  }

  if (dryRun) {
    log(`\n💡 Это был тестовый запуск. Данные НЕ изменены.`, 'yellow');
    log(`Чтобы выполнить миграцию реально, запустите:`, 'yellow');
    log(`  npm run migrate:capacity:execute\n`, 'blue');
  } else {
    log(`\n✅ Миграция завершена!`, 'green');
    log(`\n⚠️  ВАЖНО: Старые поля (capacity, beds) НЕ удалены.`, 'yellow');
    log(`Они остались в БД для безопасности.`, 'yellow');
    log(`После проверки можете удалить их вручную.\n`);
  }
}

/**
 * Шаг 5: Проверка результатов
 */
async function verifyMigration() {
  log('\n=== ШАГ 3: ПРОВЕРКА РЕЗУЛЬТАТОВ ===\n', 'bright');

  const rooms = await prisma.room.findMany({
    select: {
      id: true,
      number: true,
      name: true,
      capacity: true,
      beds: true,
      description: true,
    },
  });

  let hasDescription = 0;
  let stillHasBeds = 0;

  rooms.forEach(room => {
    const beds = Array.isArray(room.beds) ? room.beds : [];
    if (room.description && room.description.trim() !== '') hasDescription++;
    if (beds.length > 0) stillHasBeds++;
  });

  log(`Всего комнат: ${rooms.length}`, 'blue');
  log(`Комнат с описанием: ${hasDescription}`, 'green');
  log(`Комнат со старыми данными beds: ${stillHasBeds}`, 'yellow');

  // Показываем примеры
  log(`\n📋 Примеры после миграции (первые 5 комнат):`, 'yellow');
  rooms.slice(0, 5).forEach(room => {
    const beds = Array.isArray(room.beds) ? room.beds : [];
    log(`\n  Комната ${room.number}${room.name ? ` (${room.name})` : ''}:`, 'blue');
    log(`    description: "${room.description || 'пусто'}"`);
    log(`    [старое] capacity: "${room.capacity}"`);
    log(`    [старое] beds: [${beds.map(b => `"${b}"`).join(', ')}]`);
  });

  log(`\n✅ Проверка завершена!`, 'green');
  if (stillHasBeds > 0) {
    log(`\n💡 Старые данные остались в БД для безопасности.`, 'yellow');
    log(`После финальной проверки можете удалить их.`, 'yellow');
  }
}

/**
 * Шаг 6: Удаление старых колонок (только после подтверждения)
 */
async function dropOldColumns() {
  log('\n=== ШАГ 4: УДАЛЕНИЕ СТАРЫХ КОЛОНОК ===\n', 'bright');
  log('⚠️  ВНИМАНИЕ: Это необратимая операция!\n', 'red');

  // Проверяем что все данные перенесены
  const rooms = await prisma.room.findMany({
    select: {
      id: true,
      number: true,
      capacity: true,
      beds: true,
      description: true,
    },
  });

  const needsMigration = rooms.filter(room => {
    const beds = Array.isArray(room.beds) ? room.beds : [];
    const hasData = beds.length > 0 || (room.capacity && room.capacity !== '');
    const hasDescription = room.description && room.description.trim() !== '';
    return hasData && !hasDescription;
  });

  if (needsMigration.length > 0) {
    log('❌ ОШИБКА: Найдены комнаты с данными которые НЕ перенесены!\n', 'red');
    log(`Комнат требующих миграции: ${needsMigration.length}`, 'red');
    log('\nПримеры:', 'yellow');
    needsMigration.slice(0, 5).forEach(room => {
      const beds = Array.isArray(room.beds) ? room.beds : [];
      log(`  - Комната ${room.number}: capacity="${room.capacity}", beds=[${beds.join(', ')}], description="${room.description || 'пусто'}"`);
    });
    log('\n💡 Сначала выполните миграцию командой:', 'yellow');
    log('   npm run migrate:capacity execute\n', 'blue');
    return;
  }

  log('✅ Все данные перенесены в description\n', 'green');
  log('Статистика:', 'yellow');
  log(`  - Всего комнат: ${rooms.length}`);
  log(`  - С описанием: ${rooms.filter(r => r.description).length}`);

  const readline = createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  readline.question(
    '\n⚠️  Вы ТОЧНО уверены что хотите удалить колонки capacity и beds? (yes/no): ',
    async (answer: string) => {
      if (answer.toLowerCase() === 'yes') {
        log('\n🔥 Удаление колонок...', 'yellow');
        
        try {
          // Удаляем через raw SQL так как Prisma migrate требует изменения schema
          await prisma.$executeRaw`ALTER TABLE rooms DROP COLUMN IF EXISTS capacity`;
          await prisma.$executeRaw`ALTER TABLE rooms DROP COLUMN IF EXISTS beds`;
          
          log('\n✅ Колонки успешно удалены!', 'green');
          log('\n📝 Что делать дальше:', 'yellow');
          log('  1. Обновите prisma/schema.prisma (уберите capacity и beds)');
          log('  2. Запустите: npx prisma generate');
          log('  3. Обновите types/index.ts (уберите capacity и beds)');
          log('  4. Обновите UI компоненты');
          log('  5. Перезапустите приложение\n');
        } catch (error: unknown) {
          const errorMessage = error instanceof Error ? error.message : 'Неизвестная ошибка';
          log(`\n❌ Ошибка при удалении: ${errorMessage}`, 'red');
        }
      } else {
        log('\nУдаление отменено. Колонки оставлены в БД.', 'yellow');
      }
      readline.close();
      await prisma.$disconnect();
    }
  );
}

/**
 * Основная функция
 */
async function main() {
  const args = process.argv.slice(2);
  const command = args[0];

  try {
    switch (command) {
      case 'analyze':
        await analyzeData();
        break;

      case 'preview':
        const rooms = await analyzeData();
        await previewMigration(rooms);
        break;

      case 'dry-run':
        await executeMigration(true);
        break;

      case 'execute':
        const readline = createInterface({
          input: process.stdin,
          output: process.stdout,
        });

        readline.question(
          '\n⚠️  Вы уверены что хотите выполнить миграцию? (yes/no): ',
          async (answer: string) => {
            if (answer.toLowerCase() === 'yes') {
              await executeMigration(false);
            } else {
              log('\nМиграция отменена.', 'yellow');
            }
            readline.close();
            await prisma.$disconnect();
          }
        );
        return; // Не отключаемся сразу, ждем ответа

      case 'verify':
        await verifyMigration();
        break;

      case 'drop-columns':
        await dropOldColumns();
        return; // Не отключаемся сразу, ждем ответа

      default:
        log('\n📖 Использование скрипта миграции:\n', 'bright');
        log('  npm run migrate:capacity analyze      - Анализ текущих данных');
        log('  npm run migrate:capacity preview      - Превью изменений');
        log('  npm run migrate:capacity dry-run      - Тестовый запуск');
        log('  npm run migrate:capacity execute      - Реальное выполнение');
        log('  npm run migrate:capacity verify       - Проверка результатов');
        log('  npm run migrate:capacity drop-columns - Удалить старые колонки\n');
        log('⚠️  Рекомендуемый порядок:', 'yellow');
        log('  1. analyze      - посмотреть что есть');
        log('  2. preview      - увидеть как будет');
        log('  3. dry-run      - протестировать');
        log('  4. execute      - ПЕРЕНЕСТИ ДАННЫЕ');
        log('  5. verify       - проверить результат');
        log('  6. [Подождать несколько дней]');
        log('  7. verify       - еще раз проверить');
        log('  8. drop-columns - УДАЛИТЬ старые колонки (необратимо!)\n');
        log('💡 Между шагом 5 и 8 должно пройти время для проверки!', 'red');
    }
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Неизвестная ошибка';
    log(`\n❌ Ошибка: ${errorMessage}`, 'red');
    console.error(error);
  } finally {
    if (command !== 'execute' && command !== 'drop-columns') {
      await prisma.$disconnect();
    }
  }
}

main();

