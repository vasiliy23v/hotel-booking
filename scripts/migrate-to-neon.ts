// ============================================
// МИГРАЦИОННЫЙ СКРИПТ: JSON -> Neon PostgreSQL
// Переносит данные из data/data.json в Neon PostgreSQL
// ============================================

// ВАЖНО: Загружаем переменные окружения ПЕРЕД импортом lib/neon
import { config } from 'dotenv';
import path from 'path';
config({ path: path.join(process.cwd(), '.env.local') });

import fs from 'fs';
import { query } from '../lib/neon';
import type { User, Room, Hotel, Stairs, BookingInfo, Invite } from '../types';

/**
 * Преобразует данные из JSON формата в формат БД
 */
async function migrateData() {
  console.log('🚀 Начало миграции данных...');

  // Читаем исходный JSON файл
  const dataPath = path.join(process.cwd(), 'data', 'data.json');
  if (!fs.existsSync(dataPath)) {
    console.error('❌ Файл data/data.json не найден!');
    process.exit(1);
  }

  const jsonData = JSON.parse(fs.readFileSync(dataPath, 'utf-8'));
  console.log('✅ JSON файл прочитан');

  try {
    // Миграция пользователей
    if (jsonData.users && jsonData.users.length > 0) {
      console.log(`📦 Миграция ${jsonData.users.length} пользователей...`);
      for (const user of jsonData.users as User[]) {
        try {
          await query(
            `INSERT INTO users (id, email, name, password, phone, role, created_at)
             VALUES ($1, $2, $3, $4, $5, $6, NOW())
             ON CONFLICT (id) DO NOTHING`,
            [user.id, user.email, user.name, user.password || null, user.phone || null, user.role]
          );
        } catch (error) {
          console.error(`Ошибка при миграции пользователя ${user.id}:`, error);
        }
      }
      console.log('✅ Пользователи мигрированы');
    }

    // Миграция отелей
    if (jsonData.hotels && jsonData.hotels.length > 0) {
      console.log(`📦 Миграция ${jsonData.hotels.length} отелей...`);
      for (const hotel of jsonData.hotels as Hotel[]) {
        try {
          await query(
            `INSERT INTO hotels (id, name, address, description, floors, image, created_at)
             VALUES ($1, $2, $3, $4, $5, $6, NOW())
             ON CONFLICT (id) DO NOTHING`,
            [
              hotel.id,
              hotel.name,
              hotel.address,
              hotel.description || null,
              hotel.floors || null,
              hotel.image || null,
            ]
          );
        } catch (error) {
          console.error(`Ошибка при миграции отеля ${hotel.id}:`, error);
        }
      }
      console.log('✅ Отели мигрированы');
    }

    // Миграция комнат
    if (jsonData.rooms && jsonData.rooms.length > 0) {
      console.log(`📦 Миграция ${jsonData.rooms.length} комнат...`);
      for (const room of jsonData.rooms as Room[]) {
        try {
          await query(
            `INSERT INTO rooms (
              id, number, hotel_id, name, type, capacity, max_capacity, beds, floor,
              price, position, width, height, is_common, z_index, description, created_at
            ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, NOW())
            ON CONFLICT (id) DO NOTHING`,
            [
              room.id,
              room.number,
              room.hotelId,
              room.name || null,
              room.type,
              room.capacity,
              room.maxCapacity,
              JSON.stringify(room.beds || []),
              room.floor,
              room.price,
              JSON.stringify(room.position),
              room.width || null,
              room.height || null,
              room.isCommon || false,
              room.zIndex || 1,
              room.description || null,
            ]
          );
        } catch (error) {
          console.error(`Ошибка при миграции комнаты ${room.id}:`, error);
        }
      }
      console.log('✅ Комнаты мигрированы');
    }

    // Миграция бронирований
    if (jsonData.bookings && jsonData.bookings.length > 0) {
      console.log(`📦 Миграция ${jsonData.bookings.length} бронирований...`);
      for (const booking of jsonData.bookings as BookingInfo[]) {
        try {
          await query(
            `INSERT INTO bookings (
              id, room_id, booked_by, booked_date, email, phone, check_in, check_out,
              guests, notes, is_confirmed, confirmed_by, confirmed_date,
              is_paid, payment_method, payment_date, paid_by, amount, created_at
            ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, NOW())
            ON CONFLICT (id) DO NOTHING`,
            [
              booking.id,
              booking.roomId,
              booking.bookedBy,
              booking.bookedDate,
              booking.email,
              booking.phone,
              booking.checkIn,
              booking.checkOut,
              JSON.stringify(booking.guests || []),
              booking.notes || null,
              booking.isConfirmed || false,
              booking.confirmedBy || null,
              booking.confirmedDate || null,
              booking.isPaid || false,
              booking.paymentMethod || null,
              booking.paymentDate || null,
              booking.paidBy || null,
              booking.amount || null,
            ]
          );
        } catch (error) {
          console.error(`Ошибка при миграции бронирования ${booking.id}:`, error);
        }
      }
      console.log('✅ Бронирования мигрированы');
    }

    // Миграция лестниц
    if (jsonData.stairs && jsonData.stairs.length > 0) {
      console.log(`📦 Миграция ${jsonData.stairs.length} лестниц...`);
      for (const stairs of jsonData.stairs as Stairs[]) {
        try {
          await query(
            `INSERT INTO stairs (
              id, hotel_id, floor, position, width, height, direction, target_floor, created_at
            ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, NOW())
            ON CONFLICT (id) DO NOTHING`,
            [
              stairs.id,
              stairs.hotelId,
              stairs.floor,
              JSON.stringify(stairs.position),
              stairs.width,
              stairs.height,
              stairs.direction,
              stairs.targetFloor || null,
            ]
          );
        } catch (error) {
          console.error(`Ошибка при миграции лестницы ${stairs.id}:`, error);
        }
      }
      console.log('✅ Лестницы мигрированы');
    }

    // Миграция приглашений
    if (jsonData.invites && jsonData.invites.length > 0) {
      console.log(`📦 Миграция ${jsonData.invites.length} приглашений...`);
      for (const invite of jsonData.invites as Invite[]) {
        try {
          await query(
            `INSERT INTO invites (
              id, token, created_by, created_at, expires_at, used, name, used_by, used_at
            ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
            ON CONFLICT (id) DO NOTHING`,
            [
              invite.id,
              invite.token,
              invite.createdBy,
              invite.createdAt,
              invite.expiresAt,
              invite.used,
              invite.name,
              invite.usedBy || null,
              invite.usedAt || null,
            ]
          );
        } catch (error) {
          console.error(`Ошибка при миграции приглашения ${invite.id}:`, error);
        }
      }
      console.log('✅ Приглашения мигрированы');
    }

    console.log('🎉 Миграция завершена успешно!');
  } catch (error) {
    console.error('❌ Ошибка при миграции:', error);
    process.exit(1);
  }
}

// Запуск миграции
if (require.main === module) {
  migrateData()
    .then(() => {
      console.log('✅ Скрипт миграции выполнен');
      process.exit(0);
    })
    .catch((error) => {
      console.error('❌ Критическая ошибка:', error);
      process.exit(1);
    });
}

export { migrateData };


