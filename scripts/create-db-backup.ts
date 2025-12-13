/**
 * Автоматическое создание backup базы данных
 * 
 * Поддерживает:
 * - JSON export через Prisma (быстро, всегда работает)
 * - SQL dump через pg_dump (полный backup, если установлен PostgreSQL)
 * - Neon API snapshot (если на Neon хостинге)
 */

// Загружаем переменные окружения СНАЧАЛА
import * as dotenv from 'dotenv';
import * as path from 'path';
import * as fs from 'fs';
import { exec } from 'child_process';
import { promisify } from 'util';
import * as readline from 'readline';
import { PrismaClient } from '../lib/generated/prisma';
import { PrismaNeon } from '@prisma/adapter-neon';

// Пытаемся загрузить из разных файлов (в порядке приоритета)
const envFiles = ['.env.local', '.env'];
let loaded = false;

for (const envFile of envFiles) {
  const envPath = path.join(process.cwd(), envFile);
  if (fs.existsSync(envPath)) {
    console.log(`📄 Загрузка переменных из ${envFile}...`);
    dotenv.config({ path: envPath });
    loaded = true;
    break;
  }
}

if (!loaded) {
  console.error('❌ Не найден ни .env.local ни .env файл!');
  console.log('💡 Создайте .env файл с DATABASE_URL');
  process.exit(1);
}

// Проверяем что DATABASE_URL загружен
if (!process.env.DATABASE_URL) {
  console.error('❌ DATABASE_URL не найден в переменных окружения!');
  console.log('💡 Добавьте DATABASE_URL в .env или .env.local файл');
  process.exit(1);
}

console.log('✅ DATABASE_URL загружен');

// Создаем Prisma клиент ПОСЛЕ загрузки переменных (с Neon адаптером)
const connectionString = process.env.DATABASE_URL;
const adapter = new PrismaNeon({ connectionString });
const prisma = new PrismaClient({
  adapter,
  log: ['error', 'warn'],
});

console.log('✅ Prisma клиент создан\n');

const execAsync = promisify(exec);

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
 * Создать директорию для backups если не существует
 */
function ensureBackupDir(): string {
  const backupDir = path.join(process.cwd(), 'backups');
  if (!fs.existsSync(backupDir)) {
    fs.mkdirSync(backupDir, { recursive: true });
  }
  return backupDir;
}

/**
 * Метод 1: JSON export через Prisma (всегда работает)
 */
async function createJsonBackup(backupDir: string): Promise<string> {
  log('\n📦 Создание JSON backup через Prisma...', 'blue');

  const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, -5);
  const filename = `backup_${timestamp}.json`;
  const filepath = path.join(backupDir, filename);

  try {
    // Получаем все данные из всех таблиц
    const data = {
      timestamp: new Date().toISOString(),
      version: '1.0',
      data: {
        users: await prisma.user.findMany(),
        hotels: await prisma.hotel.findMany(),
        rooms: await prisma.room.findMany(),
        bookings: await prisma.booking.findMany(),
        stairs: await prisma.stairs.findMany(),
        invites: await prisma.invite.findMany(),
        feedback: await prisma.feedback.findMany(),
        registrationTokens: await prisma.registrationToken.findMany(),
        bookingDateRanges: await prisma.bookingDateRange.findMany(),
      },
    };

    // Подсчет записей
    const totalRecords = Object.values(data.data).reduce(
      (sum, table) => sum + (Array.isArray(table) ? table.length : 0),
      0
    );

    // Сохраняем в файл
    fs.writeFileSync(filepath, JSON.stringify(data, null, 2), 'utf-8');

    const fileSize = (fs.statSync(filepath).size / 1024 / 1024).toFixed(2);

    log(`\n✅ JSON backup создан!`, 'green');
    log(`   Файл: ${filename}`);
    log(`   Путь: ${filepath}`);
    log(`   Размер: ${fileSize} MB`);
    log(`   Записей: ${totalRecords}`);
    log(`\n   Содержимое:`, 'yellow');
    
    Object.entries(data.data).forEach(([table, records]) => {
      if (Array.isArray(records)) {
        log(`     - ${table}: ${records.length} записей`);
      }
    });

    return filepath;
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Неизвестная ошибка';
    log(`\n❌ Ошибка создания JSON backup: ${errorMessage}`, 'red');
    throw error;
  }
}

/**
 * Метод 2: SQL dump через pg_dump (если установлен PostgreSQL)
 */
async function createSqlBackup(backupDir: string): Promise<string | null> {
  log('\n💾 Создание SQL dump через pg_dump...', 'blue');

  const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, -5);
  const filename = `backup_${timestamp}.sql`;
  const filepath = path.join(backupDir, filename);

  try {
    // Проверяем что pg_dump установлен
    try {
      await execAsync('pg_dump --version');
    } catch {
      log('⚠️  pg_dump не установлен, пропускаем SQL backup', 'yellow');
      log('   Для установки: https://www.postgresql.org/download/', 'yellow');
      return null;
    }

    const databaseUrl = process.env.DATABASE_URL;
    if (!databaseUrl) {
      log('⚠️  DATABASE_URL не найден в переменных окружения', 'yellow');
      return null;
    }

    // Создаем SQL dump
    log('   Выполняется pg_dump... (может занять время)', 'yellow');
    await execAsync(`pg_dump "${databaseUrl}" > "${filepath}"`);

    const fileSize = (fs.statSync(filepath).size / 1024 / 1024).toFixed(2);

    log(`\n✅ SQL dump создан!`, 'green');
    log(`   Файл: ${filename}`);
    log(`   Путь: ${filepath}`);
    log(`   Размер: ${fileSize} MB`);

    return filepath;
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Неизвестная ошибка';
    log(`\n⚠️  Ошибка создания SQL dump: ${errorMessage}`, 'yellow');
    return null;
  }
}

/**
 * Метод 3: Создание snapshot через Neon API (если на Neon)
 */
async function createNeonSnapshot(): Promise<boolean> {
  log('\n☁️  Попытка создания snapshot через Neon API...', 'blue');

  const databaseUrl = process.env.DATABASE_URL || '';
  
  if (!databaseUrl.includes('neon.tech')) {
    log('⚠️  Не Neon хостинг, пропускаем', 'yellow');
    return false;
  }

  log('\n💡 Для создания snapshot в Neon:', 'yellow');
  log('   1. Откройте https://console.neon.tech');
  log('   2. Выберите ваш проект');
  log('   3. Перейдите в Settings → Backups');
  log('   4. Нажмите "Create Snapshot"');
  log('\n   Это создаст полный snapshot на уровне сервера!');

  return false;
}

/**
 * Список всех backups
 */
function listBackups(backupDir: string) {
  log('\n📋 Существующие backups:', 'bright');

  const files = fs.readdirSync(backupDir)
    .filter(f => f.startsWith('backup_') && (f.endsWith('.json') || f.endsWith('.sql')))
    .sort()
    .reverse(); // Новые сверху

  if (files.length === 0) {
    log('   Нет backups', 'yellow');
    return;
  }

  files.forEach(file => {
    const filepath = path.join(backupDir, file);
    const stats = fs.statSync(filepath);
    const size = (stats.size / 1024 / 1024).toFixed(2);
    const date = stats.mtime.toLocaleString('ru-RU');
    const type = file.endsWith('.json') ? 'JSON' : 'SQL';
    
    log(`\n   📄 ${file}`, 'blue');
    log(`      Тип: ${type}`);
    log(`      Размер: ${size} MB`);
    log(`      Дата: ${date}`);
  });

  log(`\n   Всего backups: ${files.length}`, 'green');
}

/**
 * Восстановление из JSON backup
 */
async function restoreFromJson(filepath: string) {
  log(`\n🔄 Восстановление из JSON backup...`, 'yellow');
  log(`⚠️  ВНИМАНИЕ: Это удалит все текущие данные!`, 'red');

  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  rl.question('\nВы уверены? (yes/no): ', async (answer: string) => {
    if (answer.toLowerCase() !== 'yes') {
      log('\nВосстановление отменено', 'yellow');
      rl.close();
      await prisma.$disconnect();
      return;
    }

    try {
      // Читаем backup
      const backup = JSON.parse(fs.readFileSync(filepath, 'utf-8'));
      log(`\n📅 Backup от: ${backup.timestamp}`, 'blue');

      // Очищаем таблицы (в обратном порядке из-за внешних ключей)
      log('\n🗑️  Очистка таблиц...', 'yellow');
      await prisma.bookingDateRange.deleteMany();
      await prisma.registrationToken.deleteMany();
      await prisma.feedback.deleteMany();
      await prisma.invite.deleteMany();
      await prisma.booking.deleteMany();
      await prisma.stairs.deleteMany();
      await prisma.room.deleteMany();
      await prisma.hotel.deleteMany();
      await prisma.user.deleteMany();

      // Восстанавливаем данные
      log('\n📥 Восстановление данных...', 'blue');
      
      for (const [table, records] of Object.entries(backup.data)) {
        if (!Array.isArray(records) || records.length === 0) continue;

        const modelName = table.charAt(0).toLowerCase() + table.slice(1);
        const model = (prisma as unknown as Record<string, { create: (args: { data: unknown }) => Promise<unknown> }>)[modelName];

        if (!model) {
          log(`   ⚠️  Таблица ${table} не найдена, пропускаем`, 'yellow');
          continue;
        }

        log(`   Восстановление ${table}...`);
        for (const record of records) {
          await model.create({ data: record });
        }
        log(`   ✓ ${table}: ${records.length} записей`, 'green');
      }

      log(`\n✅ Восстановление завершено!`, 'green');
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Неизвестная ошибка';
      log(`\n❌ Ошибка восстановления: ${errorMessage}`, 'red');
      console.error(error);
    } finally {
      rl.close();
      await prisma.$disconnect();
    }
  });
}

/**
 * Главная функция
 */
async function main() {
  const args = process.argv.slice(2);
  const command = args[0];

  log('\n═══════════════════════════════════════', 'bright');
  log('   🗄️  DATABASE BACKUP MANAGER', 'bright');
  log('═══════════════════════════════════════\n', 'bright');

  const backupDir = ensureBackupDir();

  try {
    switch (command) {
      case 'create':
      case 'backup':
        log('Создание полного backup базы данных...', 'yellow');
        log(`Директория: ${backupDir}\n`);

        // Метод 1: JSON (всегда работает)
        const jsonPath = await createJsonBackup(backupDir);

        // Метод 2: SQL dump (если установлен pg_dump)
        const sqlPath = await createSqlBackup(backupDir);

        // Метод 3: Neon snapshot (информация)
        await createNeonSnapshot();

        log('\n═══════════════════════════════════════', 'bright');
        log('✅ BACKUP ЗАВЕРШЕН!', 'green');
        log('═══════════════════════════════════════\n', 'bright');

        log('📁 Созданные файлы:', 'yellow');
        log(`   JSON: ${jsonPath}`);
        if (sqlPath) log(`   SQL:  ${sqlPath}`);

        log('\n💾 Рекомендации по хранению:', 'yellow');
        log('   1. Скопируйте backups/ в безопасное место');
        log('   2. Загрузите на Google Drive / Dropbox / S3');
        log('   3. Не храните только локально!');
        log('   4. Проверьте backup можно восстановить\n');
        break;

      case 'list':
        listBackups(backupDir);
        log('');
        break;

      case 'restore':
        const filename = args[1];
        if (!filename) {
          log('❌ Укажите файл для восстановления', 'red');
          log('Пример: npm run backup restore backup_2024-01-13.json\n', 'yellow');
          break;
        }

        const filepath = path.join(backupDir, filename);
        if (!fs.existsSync(filepath)) {
          log(`❌ Файл не найден: ${filepath}`, 'red');
          log('\nДоступные backups:', 'yellow');
          listBackups(backupDir);
          break;
        }

        if (filename.endsWith('.json')) {
          await restoreFromJson(filepath);
          return; // Не отключаемся, ждем подтверждения
        } else {
          log('⚠️  SQL восстановление через psql:', 'yellow');
          log(`   psql $DATABASE_URL < ${filepath}\n`);
        }
        break;

      default:
        log('📖 Использование:\n', 'bright');
        log('  npm run backup create           - Создать backup');
        log('  npm run backup list             - Список backups');
        log('  npm run backup restore <file>   - Восстановить из backup\n');
        log('Примеры:', 'yellow');
        log('  npm run backup create');
        log('  npm run backup list');
        log('  npm run backup restore backup_2024-01-13.json\n');
        log('💡 Перед миграцией ОБЯЗАТЕЛЬНО создайте backup!', 'red');
        log('   npm run backup create\n');
    }
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Неизвестная ошибка';
    log(`\n❌ Ошибка: ${errorMessage}`, 'red');
    console.error(error);
  } finally {
    if (command !== 'restore') {
      await prisma.$disconnect();
    }
  }
}

main();

