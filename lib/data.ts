// ============================================
// УТИЛИТЫ ДЛЯ РАБОТЫ С ДАННЫМИ
// ОБЕРТКА ДЛЯ ОБРАТНОЙ СОВМЕСТИМОСТИ
// Теперь использует Neon PostgreSQL вместо файловой системы
// ============================================

/**
 * @deprecated Используйте функции из lib/db.ts напрямую
 * Этот файл оставлен для обратной совместимости со старым кодом
 */

import * as db from './db';
import type { User, Room, Hotel, Stairs, BookingInfo, Invite } from '@/types';

// Тип для структуры данных (старый формат JSON)
interface DataStructure {
  users: User[];
  rooms: Room[];
  stairs: Stairs[];
  hotels: Hotel[];
  bookings: BookingInfo[];
  invites: Invite[];
}

/**
 * Инициализация данных (больше не нужна, но оставлена для совместимости)
 * @deprecated
 */
export const initData = () => {
  // В PostgreSQL инициализация происходит через schema.sql
  // Эта функция оставлена для обратной совместимости
  console.warn('initData() больше не нужна при использовании PostgreSQL');
};

/**
 * Чтение данных (синхронная версия для обратной совместимости)
 * @deprecated Используйте функции из lib/db.ts
 */
export const readData = (): DataStructure => {
  // Эта функция больше не может быть синхронной, так как использует БД
  // Возвращаем пустую структуру для обратной совместимости
  // ВАЖНО: Все API роуты должны быть обновлены для использования lib/db.ts
  console.warn('readData() устарела. Используйте функции из lib/db.ts');
  return {
    users: [],
    rooms: [],
    stairs: [],
    hotels: [],
    bookings: [],
    invites: [],
  };
};

/**
 * Запись данных (синхронная версия для обратной совместимости)
 * @deprecated Используйте функции из lib/db.ts
 */
export const writeData = (data: unknown): boolean => {
  // Эта функция больше не может быть синхронной, так как использует БД
  // ВАЖНО: Все API роуты должны быть обновлены для использования lib/db.ts
  console.warn('writeData() устарела. Используйте функции из lib/db.ts');
  return false;
};

// Экспортируем функции из db.ts для удобства миграции
export {
  getUsers,
  getUserById,
  getUserByEmail,
  createUser,
  updateUser,
  deleteUser,
  getHotels,
  getHotelById,
  createHotel,
  updateHotel,
  deleteHotel,
  getRooms,
  getRoomById,
  createRoom,
  updateRoom,
  deleteRoom,
  getBookings,
  getBookingById,
  createBooking,
  updateBooking,
  deleteBooking,
  getStairs,
  getStairsById,
  createStairs,
  updateStairs,
  deleteStairs,
  getInvites,
  getInviteById,
  getInviteByToken,
  createInvite,
  updateInvite,
  deleteInvite,
} from './db';
