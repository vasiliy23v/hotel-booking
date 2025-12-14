// Глобальная настройка для Jest тестов
// Этот файл выполняется перед каждым тестом

// Увеличиваем таймаут для тестов, которые делают HTTP запросы
jest.setTimeout(30000);

// Моки для окружения Next.js
// Используем type assertion для обхода read-only ограничения TypeScript
if (!process.env.NODE_ENV) {
  (process.env as { NODE_ENV?: string }).NODE_ENV = 'test';
}


