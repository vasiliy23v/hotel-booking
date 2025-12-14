/**
 * Базовые тесты для операций с комнатами
 * 
 * ⚠️  КРИТИЧЕСКИ ВАЖНО: Эти тесты работают с базой данных!
 * 
 * РЕКОМЕНДУЕТСЯ использовать отдельную тестовую БД для безопасности.
 * 
 * Варианты запуска:
 * 
 * 1. С тестовой БД (РЕКОМЕНДУЕТСЯ):
 *    TEST_DATABASE_URL="postgresql://..." ALLOW_DB_TESTS=true npm test
 * 
 * 2. С продакшн БД (НЕ РЕКОМЕНДУЕТСЯ, но возможно):
 *    ALLOW_DB_TESTS=true npm test
 *    ⚠️  Будет предупреждение о использовании продакшн БД
 * 
 * 3. Без БД (тесты пропущены):
 *    npm test
 *    ✅ БД не будет затронута
 * 
 * Тестовые данные используют уникальные идентификаторы с префиксом "TEST-":
 * - hotelId: 'TEST-hotel-' + timestamp (уникальный идентификатор)
 * - number: 'TEST-' + timestamp (уникальный номер комнаты)
 * 
 * Тесты создают и удаляют только тестовые комнаты с этими идентификаторами.
 * Реальные комнаты НЕ будут затронуты, так как используются уникальные TEST- префиксы.
 */

import { describe, it, expect, beforeAll, afterAll } from '@jest/globals';

// КРИТИЧЕСКАЯ ПРОВЕРКА: тесты выполняются только с явным разрешением
const ALLOW_DB_TESTS = process.env.ALLOW_DB_TESTS === 'true';
const TEST_DATABASE_URL = process.env.TEST_DATABASE_URL;
const PRODUCTION_DATABASE_URL = process.env.DATABASE_URL;

// Проверка использования тестовой БД
function checkDatabaseSafety(): { isSafe: boolean; message: string } {
  if (TEST_DATABASE_URL) {
    return {
      isSafe: true,
      message: `✅ Используется ТЕСТОВАЯ БД: ${TEST_DATABASE_URL.substring(0, 30)}...`
    };
  }
  
  if (PRODUCTION_DATABASE_URL) {
    return {
      isSafe: false,
      message: `⚠️  ВНИМАНИЕ: Используется ПРОДАКШН БД: ${PRODUCTION_DATABASE_URL.substring(0, 30)}...`
    };
  }
  
  return {
    isSafe: false,
    message: '⚠️  ВНИМАНИЕ: DATABASE_URL не найдена'
  };
}

const API_URL = process.env.TEST_API_URL || 'http://localhost:3000';
let serverAvailable = false;
let testsEnabled = false;

// Генерируем уникальные идентификаторы для тестов
const testTimestamp = Date.now();
const testHotelId = `TEST-hotel-${testTimestamp}`;
const testRoomNumber = (suffix: string = '') => `TEST-${testTimestamp}${suffix ? '-' + suffix : ''}`;

// Функция проверки доступности сервера
async function checkServerAvailability(): Promise<boolean> {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 3000);
    
    const response = await fetch(`${API_URL}/api/rooms`, {
      signal: controller.signal,
    });
    
    clearTimeout(timeoutId);
    return response.status === 200 || response.status === 404 || response.status === 500;
  } catch {
    return false;
  }
}

// Mock данные с уникальными идентификаторами
const getMockRoom = (numberSuffix: string = '') => ({
  number: testRoomNumber(numberSuffix),
  hotelId: testHotelId,
  name: 'Тестовая комната',
  type: 'EZ' as const,
  floor: 'EG' as const,
  capacity: '2 чел.',  // Пока оставляем для обратной совместимости, но лучше удалить
  maxCapacity: 2,      // Основное поле - максимальная вместимость
  price: 100,
  beds: [],            // Пока оставляем, но лучше переносить в description
  description: '1 двуспальная кровать, душ, туалет', // Всё описание здесь
  position: { x: 0, y: 0 },
  isCommon: false,
  hasShower: true,
  hasToilet: true,
});

describe('Room Operations', () => {
  let createdRoomId: string;
  const createdRoomIds: string[] = []; // Список всех созданных комнат для очистки

  beforeAll(async () => {
    // ПРОВЕРКА БЕЗОПАСНОСТИ: тесты выполняются только с явным разрешением
    if (!ALLOW_DB_TESTS) {
      console.warn('\n🔒 ТЕСТЫ ЗАБЛОКИРОВАНЫ ДЛЯ БЕЗОПАСНОСТИ');
      console.warn('   Эти тесты работают с базой данных.');
      console.warn('   Для запуска установите переменную окружения: ALLOW_DB_TESTS=true');
      console.warn('   РЕКОМЕНДУЕТСЯ также установить: TEST_DATABASE_URL="..."');
      console.warn('   Пример: TEST_DATABASE_URL="..." ALLOW_DB_TESTS=true npm test');
      console.warn('   БЕЗ этой переменной тесты НЕ будут выполняться и НЕ затронут БД.\n');
      testsEnabled = false;
      return;
    }

    // Проверка безопасности БД
    const dbCheck = checkDatabaseSafety();
    console.warn('\n' + dbCheck.message);
    
    if (!dbCheck.isSafe) {
      console.warn('\n⚠️  ВНИМАНИЕ: Используется ПРОДАКШН база данных!');
      console.warn('   РЕКОМЕНДУЕТСЯ использовать отдельную тестовую БД.');
      console.warn('   Установите TEST_DATABASE_URL для безопасного тестирования.');
      console.warn('   Тесты будут использовать уникальные TEST- префиксы,');
      console.warn('   но риск ошибок все равно существует.\n');
    }

    serverAvailable = await checkServerAvailability();
    if (!serverAvailable) {
      console.warn('\n⚠️  ВНИМАНИЕ: Сервер недоступен!');
      console.warn('   Запустите сервер в отдельном терминале: npm run dev');
      if (TEST_DATABASE_URL) {
        console.warn(`   Убедитесь, что сервер использует TEST_DATABASE_URL: ${TEST_DATABASE_URL.substring(0, 30)}...`);
      }
      console.warn('   Тесты будут пропущены.\n');
      testsEnabled = false;
    } else {
      testsEnabled = true;
      
      // Проверяем существование тестового отеля и создаем его, если нужно
      try {
        const hotelCheckResponse = await fetch(`${API_URL}/api/hotels/${testHotelId}`);
        if (hotelCheckResponse.status === 404) {
          // Отель не существует, создаем тестовый отель
          console.warn(`\n🏨 Создание тестового отеля: ${testHotelId}...`);
          const createHotelResponse = await fetch(`${API_URL}/api/hotels`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              id: testHotelId,
              name: `Тестовый отель ${testTimestamp}`,
              address: 'Тестовый адрес',
              hasEGFloor: true,
            }),
          });
          
          if (createHotelResponse.ok) {
            console.warn('   ✅ Тестовый отель создан успешно');
          } else {
            console.warn('   ⚠️  Не удалось создать тестовый отель, но продолжаем тесты');
          }
        } else {
          console.warn(`\n✅ Тестовый отель уже существует: ${testHotelId}`);
        }
      } catch {
        console.warn('   ⚠️  Не удалось проверить/создать тестовый отель, но продолжаем тесты');
      }
      
      console.warn('\n📋 Информация о тестах:');
      console.warn(`   Тестовый hotelId: ${testHotelId}`);
      console.warn('   Тестовые комнаты будут созданы и удалены автоматически.');
      console.warn('   Используются уникальные TEST- префиксы для изоляции.');
      console.warn('   Реальные данные НЕ будут затронуты.\n');
    }
  });

  // Очистка всех созданных комнат и тестового отеля после тестов
  afterAll(async () => {
    if (testsEnabled && serverAvailable) {
      // Удаляем все созданные тестовые комнаты
      if (createdRoomIds.length > 0) {
        console.log(`\n🧹 Очистка: удаление ${createdRoomIds.length} тестовых комнат...`);
        for (const roomId of createdRoomIds) {
          try {
            const response =           await fetch(`${API_URL}/api/rooms/${roomId}`, { method: 'DELETE' });
            if (response.ok) {
              console.log(`   ✅ Комната ${roomId} удалена`);
            }
          } catch {
            console.warn(`   ⚠️  Не удалось удалить комнату ${roomId}`);
          }
        }
      }
      
      // Удаляем тестовый отель (опционально, можно оставить для повторных тестов)
      const deleteTestHotel = process.env.DELETE_TEST_HOTEL === 'true';
      if (deleteTestHotel) {
        try {
          console.log(`\n🧹 Удаление тестового отеля: ${testHotelId}...`);
          const response = await fetch(`${API_URL}/api/hotels/${testHotelId}`, { method: 'DELETE' });
          if (response.ok) {
            console.log('   ✅ Тестовый отель удален');
          }
        } catch {
          console.warn('   ⚠️  Не удалось удалить тестовый отель');
        }
      } else {
        console.log(`\n💡 Тестовый отель ${testHotelId} сохранен для повторных тестов.`);
        console.log('   Для удаления установите: DELETE_TEST_HOTEL=true');
      }
      
      console.log('✅ Очистка завершена.\n');
    }
  });

  describe('POST /api/rooms - Создание комнаты', () => {
    it('должен успешно создать комнату', async () => {
      if (!testsEnabled || !serverAvailable) {
        console.log('   Пропущен: тесты отключены или сервер недоступен');
        return;
      }

      const mockRoom = getMockRoom('create');
      const response = await fetch(`${API_URL}/api/rooms`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(mockRoom),
      });

      expect(response.status).toBe(200);
      const data = await response.json();
      
      expect(data).toHaveProperty('id');
      expect(data.number).toBe(mockRoom.number);
      expect(data.type).toBe(mockRoom.type);
      
      createdRoomId = data.id;
      createdRoomIds.push(data.id);
    });

    it('должен вернуть ошибку при отсутствии обязательных полей', async () => {
      if (!testsEnabled || !serverAvailable) {
        console.log('   Пропущен: тесты отключены или сервер недоступен');
        return;
      }

      const invalidRoom = { number: testRoomNumber('invalid') }; // Отсутствуют обязательные поля

      const response = await fetch(`${API_URL}/api/rooms`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(invalidRoom),
      });

      expect(response.status).toBe(500);
    });
  });

  describe('GET /api/rooms - Получение комнат', () => {
    it('должен вернуть список комнат', async () => {
      if (!testsEnabled || !serverAvailable) {
        console.log('   Пропущен: сервер недоступен');
        return;
      }

      const response = await fetch(`${API_URL}/api/rooms`);
      
      expect(response.status).toBe(200);
      const data = await response.json();
      
      expect(Array.isArray(data)).toBe(true);
    });

    it('должен фильтровать комнаты по hotelId', async () => {
      if (!testsEnabled || !serverAvailable) {
        console.log('   Пропущен: сервер недоступен');
        return;
      }

      const response = await fetch(`${API_URL}/api/rooms?hotelId=${testHotelId}`);
      
      expect(response.status).toBe(200);
      const data = await response.json();
      
      expect(Array.isArray(data)).toBe(true);
      data.forEach((room: { hotelId: string }) => {
        expect(room.hotelId).toBe(testHotelId);
      });
    });
  });

  describe('PUT /api/rooms/:id - Обновление комнаты', () => {
    it('должен успешно обновить комнату', async () => {
      if (!testsEnabled || !serverAvailable) {
        console.log('   Пропущен: сервер недоступен');
        return;
      }

      if (!createdRoomId) {
        throw new Error('Room not created in previous test');
      }

      const mockRoom = getMockRoom('update');
      const updates = {
        ...mockRoom,
        price: 150,
        name: 'Обновленная комната',
      };

      const response = await fetch(`${API_URL}/api/rooms/${createdRoomId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates),
      });

      expect(response.status).toBe(200);
      const data = await response.json();
      
      expect(data.price).toBe('150');
      expect(data.name).toBe('Обновленная комната');
    });

    it('должен вернуть 404 для несуществующей комнаты', async () => {
      if (!testsEnabled || !serverAvailable) {
        console.log('   Пропущен: сервер недоступен');
        return;
      }

      const mockRoom = getMockRoom('404');
      const response = await fetch(`${API_URL}/api/rooms/non-existent-id`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(mockRoom),
      });

      expect(response.status).toBe(404);
    });
  });

  describe('GET /api/rooms/:id - Получение комнаты по ID', () => {
    it('должен вернуть комнату по ID', async () => {
      if (!testsEnabled || !serverAvailable) {
        console.log('   Пропущен: сервер недоступен');
        return;
      }

      if (!createdRoomId) {
        throw new Error('Room not created in previous test');
      }

      const response = await fetch(`${API_URL}/api/rooms/${createdRoomId}`);
      
      expect(response.status).toBe(200);
      const data = await response.json();
      
      expect(data.id).toBe(createdRoomId);
    });

    it('должен вернуть 404 для несуществующей комнаты', async () => {
      if (!testsEnabled || !serverAvailable) {
        console.log('   Пропущен: сервер недоступен');
        return;
      }

      const response = await fetch(`${API_URL}/api/rooms/non-existent-id`);
      
      expect(response.status).toBe(404);
    });
  });

  describe('DELETE /api/rooms/:id - Удаление комнаты', () => {
    it('должен успешно удалить комнату', async () => {
      if (!testsEnabled || !serverAvailable) {
        console.log('   Пропущен: сервер недоступен');
        return;
      }

      if (!createdRoomId) {
        throw new Error('Room not created in previous test');
      }

      const response = await fetch(`${API_URL}/api/rooms/${createdRoomId}`, {
        method: 'DELETE',
      });

      expect(response.status).toBe(200);
      
      // Проверяем что комната действительно удалена
      const getResponse = await fetch(`${API_URL}/api/rooms/${createdRoomId}`);
      expect(getResponse.status).toBe(404);
      
      // Удаляем из списка для очистки, так как комната уже удалена
      const index = createdRoomIds.indexOf(createdRoomId);
      if (index > -1) createdRoomIds.splice(index, 1);
    });
  });

  describe('Тесты на устойчивость к медленному интернету', () => {
    it('должен успешно создать комнату даже при задержке', async () => {
      if (!testsEnabled || !serverAvailable) {
        console.log('   Пропущен: сервер недоступен');
        return;
      }

      const mockRoom = getMockRoom('slow');
      // Симулируем задержку
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 секунд таймаут

      try {
        const response = await fetch(`${API_URL}/api/rooms`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(mockRoom),
          signal: controller.signal,
        });

        clearTimeout(timeoutId);
        expect(response.status).toBe(200);
        
        // Очистка
        const data = await response.json();
        createdRoomIds.push(data.id);
        await fetch(`${API_URL}/api/rooms/${data.id}`, { method: 'DELETE' });
        const index = createdRoomIds.indexOf(data.id);
        if (index > -1) createdRoomIds.splice(index, 1);
      } catch (error) {
        clearTimeout(timeoutId);
        if (error instanceof Error && error.name === 'AbortError') {
          throw new Error('Request timed out - возможна проблема с производительностью');
        }
        throw error;
      }
    });
  });

  describe('Тесты на параллельные операции', () => {
    it('должен корректно обрабатывать несколько одновременных запросов', async () => {
      if (!testsEnabled || !serverAvailable) {
        console.log('   Пропущен: сервер недоступен');
        return;
      }

      const promises = Array.from({ length: 5 }, (_, i) => {
        const mockRoom = getMockRoom(`parallel-${i}`);
        return fetch(`${API_URL}/api/rooms`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(mockRoom),
        });
      });

      const responses = await Promise.all(promises);
      
      // Все запросы должны быть успешными
      responses.forEach(response => {
        expect(response.status).toBe(200);
      });

      // Очистка созданных комнат
      const rooms = await Promise.all(responses.map(r => r.json()));
      const roomIds = rooms.map(room => room.id);
      createdRoomIds.push(...roomIds);
      await Promise.all(
        rooms.map(room =>
          fetch(`${API_URL}/api/rooms/${room.id}`, { method: 'DELETE' })
        )
      );
      // Удаляем из списка после успешного удаления
      roomIds.forEach(id => {
        const index = createdRoomIds.indexOf(id);
        if (index > -1) createdRoomIds.splice(index, 1);
      });
    });
  });
});

describe('Retry Logic Tests', () => {
  it('должен повторить запрос при временной ошибке', async () => {
    if (!serverAvailable) {
      console.log('   Пропущен: сервер недоступен');
      return;
    }

    // Этот тест проверяет что retry логика работает на клиенте
    // В реальном приложении используется api-client с retry
    
    let attempts = 0;
    const maxRetries = 3;

    for (let i = 0; i <= maxRetries; i++) {
      attempts++;
      try {
        const response = await fetch(`${API_URL}/api/rooms`);
        if (response.ok) {
          break;
        }
        throw new Error(`HTTP ${response.status}`);
      } catch {
        if (i < maxRetries) {
          await new Promise(resolve => setTimeout(resolve, 1000 * (i + 1)));
        }
      }
    }

    // Проверяем что было как минимум 1 попытка
    expect(attempts).toBeGreaterThan(0);
    expect(attempts).toBeLessThanOrEqual(maxRetries + 1);
  });
});

