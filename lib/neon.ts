// ============================================
// NEON POSTGRESQL КЛИЕНТ
// Оптимизирован для serverless окружения (Next.js)
// ============================================

import { neon } from '@neondatabase/serverless';
import { Pool } from '@neondatabase/serverless';

/**
 * Получить строку подключения к базе данных
 * Использует ленивую инициализацию для поддержки загрузки переменных окружения через dotenv
 */
function getDatabaseUrl(): string {
  const databaseUrlEnv = process.env.NEON_DATABASE_URL;
  
  if (!databaseUrlEnv) {
    throw new Error(
      'NEON_DATABASE_URL не установлена. Пожалуйста, установите переменную окружения NEON_DATABASE_URL в .env.local'
    );
  }
  
  return databaseUrlEnv;
}

// Создаем пул соединений для serverless окружения
// В serverless окружении каждый запрос может быть в отдельном процессе,
// поэтому используем connection pooling для эффективного управления соединениями
let pool: Pool | null = null;

/**
 * Получить пул соединений с базой данных
 * Использует singleton паттерн для переиспользования пула
 */
export function getPool(): Pool {
  if (!pool) {
    pool = new Pool({
      connectionString: getDatabaseUrl(),
      // Настройки пула для serverless
      max: 1, // В serverless окружении ограничиваем количество соединений
    });
  }
  return pool;
}

/**
 * Получить SQL клиент для выполнения запросов
 * Используется для простых запросов без транзакций
 */
export function getSql() {
  return neon(getDatabaseUrl());
}

/**
 * Выполнить запрос с использованием пула соединений
 * Автоматически закрывает соединение после выполнения
 */
export async function query<T = unknown>(sql: string, params?: unknown[]): Promise<T[]> {
  const pool = getPool();
  const client = await pool.connect();
  
  try {
    const result = await client.query(sql, params);
    return result.rows as T[];
  } finally {
    client.release();
  }
}

/**
 * Выполнить транзакцию
 * Все операции выполняются атомарно
 */
export async function transaction<T>(
  callback: (sql: ReturnType<typeof getSql>) => Promise<T>
): Promise<T> {
  const pool = getPool();
  const client = await pool.connect();
  
  try {
    await client.query('BEGIN');
    const sqlClient = neon(getDatabaseUrl());
    const result = await callback(sqlClient);
    await client.query('COMMIT');
    return result;
  } catch (error) {
    await client.query('ROLLBACK');
    throw error;
  } finally {
    client.release();
  }
}

/**
 * Закрыть все соединения (используется при завершении приложения)
 */
export async function closePool(): Promise<void> {
  if (pool) {
    await pool.end();
    pool = null;
  }
}

