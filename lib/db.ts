// ============================================
// ТИПИЗИРОВАННЫЕ ХЕЛПЕРЫ ДЛЯ РАБОТЫ С БАЗОЙ ДАННЫХ
// Использует Prisma для работы с Neon PostgreSQL
// ============================================

import { prisma } from './prisma';
import type { User, Room, Hotel, Stairs, BookingInfo, Invite, RegistrationToken, BookingDateRange } from '@/types';
import type { Prisma } from './generated/prisma';
import { $Enums } from './generated/prisma';
import { normalizePhone } from './phone';

// ============================================
// ВСПОМОГАТЕЛЬНЫЕ ФУНКЦИИ ДЛЯ ПРЕОБРАЗОВАНИЯ ДАННЫХ
// ============================================

/**
 * Преобразует enum FloorType из Prisma в формат приложения
 */
function transformFloor(floor: string): 'EG' | '1OG' | '2OG' | '3OG' | '4OG' | '5OG' | '6OG' {
  // Обрабатываем значения enum из Prisma
  if (floor === 'EG') return 'EG';
  if (floor === 'oneOG' || floor === '1OG') return '1OG';
  if (floor === 'twoOG' || floor === '2OG') return '2OG';
  if (floor === 'threeOG' || floor === '3OG') return '3OG';
  if (floor === 'fourOG' || floor === '4OG') return '4OG';
  if (floor === 'fiveOG' || floor === '5OG') return '5OG';
  if (floor === 'sixOG' || floor === '6OG') return '6OG';
  // По умолчанию возвращаем EG
  console.warn(`Unknown floor value: ${floor}, defaulting to EG`);
  return 'EG';
}

/**
 * Преобразует формат приложения в enum FloorType для Prisma
 */
function transformFloorToPrisma(floor: 'EG' | '1OG' | '2OG' | '3OG' | '4OG' | '5OG' | '6OG'): 'EG' | 'oneOG' | 'twoOG' | 'threeOG' | 'fourOG' | 'fiveOG' | 'sixOG' {
  if (floor === 'EG') return 'EG';
  if (floor === '1OG') return 'oneOG';
  if (floor === '2OG') return 'twoOG';
  if (floor === '3OG') return 'threeOG';
  if (floor === '4OG') return 'fourOG';
  if (floor === '5OG') return 'fiveOG';
  if (floor === '6OG') return 'sixOG';
  return 'EG';
}

/**
 * Преобразует данные комнаты из Prisma в формат приложения
 */
function transformRoom(room: Prisma.RoomGetPayload<Record<string, never>>): Room {
  return {
    id: room.id,
    number: room.number,
    hotelId: room.hotelId,
    name: room.name,
    type: room.type as Room['type'],
    capacity: room.capacity,
    maxCapacity: room.maxCapacity,
    beds: (typeof room.beds === 'string' ? JSON.parse(room.beds) : room.beds) as string[],
    floor: transformFloor(room.floor),
    price: Number(room.price),
    position: typeof room.position === 'string' ? JSON.parse(room.position) : room.position,
    width: room.width,
    height: room.height,
    isCommon: room.isCommon || false,
    zIndex: room.zIndex || 1,
    description: room.description,
    hasShower: room.hasShower || false,
    hasToilet: room.hasToilet || false,
    pricePerPerson: room.pricePerPerson || false,
    textVertical: room.textVertical || false,
  };
}

/**
 * Преобразует данные бронирования из Prisma в формат приложения
 */
function transformBooking(booking: Prisma.BookingGetPayload<Record<string, never>>): BookingInfo {
  return {
    id: booking.id,
    roomId: booking.roomId,
    bookedBy: booking.bookedBy,
    bookedDate: booking.bookedDate.toISOString(),
    email: booking.email || undefined,
    phone: booking.phone,
    checkIn: booking.checkIn.toISOString().split('T')[0],
    checkOut: booking.checkOut.toISOString().split('T')[0],
    guests: (typeof booking.guests === 'string' ? JSON.parse(booking.guests) : booking.guests) as BookingInfo['guests'],
    notes: booking.notes || undefined,
    isConfirmed: booking.isConfirmed || false,
    confirmedBy: booking.confirmedBy || undefined,
    confirmedDate: booking.confirmedDate?.toISOString() || undefined,
    isPaid: booking.isPaid || false,
    paymentMethod: booking.paymentMethod as BookingInfo['paymentMethod'] || undefined,
    paymentDate: booking.paymentDate?.toISOString() || undefined,
    paidBy: booking.paidBy || undefined,
    amount: booking.amount ? Number(booking.amount) : undefined,
  };
}

/**
 * Преобразует данные лестницы из Prisma в формат приложения
 */
function transformStairs(stairs: Prisma.StairsGetPayload<Record<string, never>>): Stairs {
  return {
    id: stairs.id,
    hotelId: stairs.hotelId,
    floor: transformFloor(stairs.floor),
    position: typeof stairs.position === 'string' ? JSON.parse(stairs.position) : stairs.position,
    width: stairs.width,
    height: stairs.height,
    direction: stairs.direction as Stairs['direction'],
    targetFloor: stairs.targetFloor ? transformFloor(stairs.targetFloor) : null,
  };
}

/**
 * Преобразует данные приглашения из Prisma в формат приложения
 */
function transformInvite(invite: Prisma.InviteGetPayload<Record<string, never>>): Invite {
  return {
    id: invite.id,
    token: invite.token,
    createdBy: invite.createdBy,
    createdAt: invite.createdAt.toISOString(),
    expiresAt: invite.expiresAt.toISOString(),
    used: invite.used,
    name: invite.name,
    usedBy: invite.usedBy ?? null,
    usedAt: invite.usedAt?.toISOString() ?? null,
  };
}

// ============================================
// USERS (Пользователи)
// ============================================

/**
 * Получить всех пользователей
 * @returns Массив пользователей без паролей
 */
export async function getUsers(): Promise<Omit<User, 'password'>[]> {
  const users = await prisma.user.findMany({
    select: {
      id: true,
      email: true,
      name: true,
      phone: true,
      role: true,
      isProfileComplete: true,
      createdAt: true,
    },
    orderBy: {
      createdAt: 'desc',
    },
  });
  
  return users.map(u => ({
    id: u.id,
    email: u.email,
    name: u.name,
    phone: u.phone,
    role: u.role as User['role'],
    isProfileComplete: u.isProfileComplete,
    createdAt: u.createdAt?.toISOString() ?? new Date().toISOString(),
  }));
}

/**
 * Получить пользователя по ID
 */
export async function getUserById(id: string): Promise<User | null> {
  const user = await prisma.user.findUnique({
    where: { id },
  });
  
  if (!user) return null;
  
  return {
    id: user.id,
    email: user.email,
    name: user.name,
    password: user.password,
    phone: user.phone,
    role: user.role as User['role'],
    createdAt: user.createdAt?.toISOString() ?? new Date().toISOString(),
    isProfileComplete: user.isProfileComplete,
  };
}

/**
 * Получить пользователя по email
 */
export async function getUserByEmail(email: string | null | undefined): Promise<User | null> {
  if (!email) return null;
  
  // Убираем пробелы
  const trimmedEmail = email.trim();
  
  // Ищем пользователя по точному совпадению email
  const user = await prisma.user.findUnique({
    where: { email: trimmedEmail },
  });
  
  if (!user) return null;
  
  return {
    id: user.id,
    email: user.email,
    name: user.name,
    password: user.password,
    phone: user.phone,
    role: user.role as User['role'],
    createdAt: user.createdAt?.toISOString() ?? new Date().toISOString(),
    isProfileComplete: user.isProfileComplete,
  };
}

/**
 * Получить пользователя по телефону
 */
export async function getUserByPhone(phone: string | null | undefined): Promise<User | null> {
  if (!phone) return null;
  
  const normalizedPhone = normalizePhone(phone);
  if (!normalizedPhone) return null;
  
  // Используем findFirst вместо findUnique, так как phone может быть nullable
  const user = await prisma.user.findFirst({
    where: { phone: normalizedPhone },
  });
  
  if (!user) return null;
  
  return {
    id: user.id,
    email: user.email,
    name: user.name,
    password: user.password,
    phone: user.phone,
    role: user.role as User['role'],
    createdAt: user.createdAt?.toISOString() ?? new Date().toISOString(),
    isProfileComplete: user.isProfileComplete,
  };
}

/**
 * Получить пользователя по email или телефону
 */
export async function getUserByEmailOrPhone(identifier: string | null | undefined): Promise<User | null> {
  if (!identifier) return null;
  
  // Пробуем найти по email
  const userByEmail = await getUserByEmail(identifier);
  if (userByEmail) return userByEmail;
  
  // Если не нашли по email, пробуем по телефону
  return await getUserByPhone(identifier);
}

/**
 * Создать нового пользователя
 */
export async function createUser(user: Omit<User, 'id'> & { id?: string }): Promise<User> {
  const userId = user.id || `user-${Date.now()}`;
  
  // Нормализуем телефон перед сохранением
  const normalizedPhone = user.phone ? normalizePhone(user.phone) : null;
  
  const newUser = await prisma.user.create({
    data: {
      id: userId,
      email: user.email || null,
      name: user.name,
      password: user.password || null,
      phone: normalizedPhone,
      role: user.role,
      isProfileComplete: user.isProfileComplete ?? false,
    },
  });
  
  return {
    id: newUser.id,
    email: newUser.email,
    name: newUser.name,
    password: newUser.password,
    phone: newUser.phone,
    role: newUser.role as User['role'],
    createdAt: newUser.createdAt?.toISOString() ?? new Date().toISOString(),
    isProfileComplete: newUser.isProfileComplete,
  };
}

/**
 * Обновить пользователя
 */
export async function updateUser(id: string, updates: Partial<User>): Promise<User> {
  const updateData: Prisma.UserUpdateInput = {};
  
  if (updates.email !== undefined) updateData.email = updates.email || null;
  if (updates.name !== undefined) updateData.name = updates.name;
  if (updates.password !== undefined) updateData.password = updates.password || null;
  if (updates.phone !== undefined) {
    // Нормализуем телефон перед сохранением
    updateData.phone = updates.phone ? normalizePhone(updates.phone) : null;
  }
  if (updates.role !== undefined) updateData.role = updates.role;
  if (updates.isProfileComplete !== undefined) updateData.isProfileComplete = updates.isProfileComplete;
  
  const updatedUser = await prisma.user.update({
    where: { id },
    data: updateData,
  });
  
  return {
    id: updatedUser.id,
    email: updatedUser.email,
    name: updatedUser.name,
    password: updatedUser.password,
    phone: updatedUser.phone,
    role: updatedUser.role as User['role'],
    createdAt: updatedUser.createdAt?.toISOString() ?? new Date().toISOString(),
    isProfileComplete: updatedUser.isProfileComplete,
  };
}

/**
 * Удалить пользователя
 */
export async function deleteUser(id: string): Promise<void> {
  await prisma.user.delete({
    where: { id },
  });
}

// ============================================
// HOTELS (Отели)
// ============================================

/**
 * Конвертирует Buffer изображения в base64 data URL
 */
function imageBufferToBase64(buffer: Uint8Array | Buffer | null): string | undefined {
  if (!buffer) return undefined;
  // Если это Uint8Array (из Prisma), конвертируем в Buffer
  const nodeBuffer = Buffer.isBuffer(buffer) ? buffer : Buffer.from(buffer);
  return `data:image/webp;base64,${nodeBuffer.toString('base64')}`;
}

/**
 * Конвертирует base64 data URL в Buffer для сохранения в БД
 * Возвращает Buffer, который совместим с Uint8Array Prisma
 */
function base64ToImageBuffer(base64: string | undefined): Buffer | null {
  if (!base64) return null;
  
  // Если это data URL, извлекаем base64 часть
  if (base64.startsWith('data:')) {
    const base64Data = base64.split(',')[1];
    return Buffer.from(base64Data, 'base64');
  }
  
  // Если это просто base64 строка
  return Buffer.from(base64, 'base64');
}

/**
 * Получить все отели
 */
export async function getHotels(): Promise<Hotel[]> {
  const hotels = await prisma.hotel.findMany({
    orderBy: [
      { displayOrder: 'asc' },
      { createdAt: 'desc' },
    ],
  });
  
  return hotels.map(h => ({
    id: h.id,
    name: h.name,
    address: h.address,
    description: h.description,
    floors: h.floors,
    hasEGFloor: h.hasEGFloor,
    image: imageBufferToBase64(h.image) ?? null,
    displayOrder: h.displayOrder,
  }));
}

/**
 * Получить отель по ID
 */
export async function getHotelById(id: string): Promise<Hotel | null> {
  const hotel = await prisma.hotel.findUnique({
    where: { id },
  });
  
  if (!hotel) return null;
  
  return {
    id: hotel.id,
    name: hotel.name,
    address: hotel.address,
    description: hotel.description,
    floors: hotel.floors,
    hasEGFloor: hotel.hasEGFloor,
    image: imageBufferToBase64(hotel.image) ?? null,
    displayOrder: hotel.displayOrder,
  };
}

/**
 * Создать новый отель
 */
export async function createHotel(hotel: Omit<Hotel, 'id'> & { id?: string }): Promise<Hotel> {
  const hotelId = hotel.id || `hotel-${Date.now()}`;
  const imageInput = typeof hotel.image === 'string' ? hotel.image : undefined;
  const imageBuffer = base64ToImageBuffer(imageInput);
  
  const newHotel = await prisma.hotel.create({
    data: {
      id: hotelId,
      name: hotel.name,
      address: hotel.address,
      description: hotel.description || null,
      floors: hotel.floors || null,
      hasEGFloor: hotel.hasEGFloor !== undefined ? hotel.hasEGFloor : true,
      // Buffer наследуется от Uint8Array, приводим для совместимости типов
      image: imageBuffer as Prisma.Bytes | null,
      displayOrder: hotel.displayOrder || null,
    },
  });
  
  return {
    id: newHotel.id,
    name: newHotel.name,
    address: newHotel.address,
    description: newHotel.description,
    floors: newHotel.floors,
    hasEGFloor: newHotel.hasEGFloor,
    image: imageBufferToBase64(newHotel.image) ?? null,
    displayOrder: newHotel.displayOrder,
  };
}

/**
 * Обновить отель
 */
/**
 * Миграция этажей при изменении hasEGFloor
 * При отключении EG: EG -> 1OG, 1OG -> 2OG, 2OG -> 3OG
 * При включении EG: 1OG -> EG, 2OG -> 1OG, 3OG -> 2OG
 */
async function migrateHotelFloors(hotelId: string, newHasEGFloor: boolean): Promise<void> {
  // Получаем текущий отель
  const hotel = await prisma.hotel.findUnique({
    where: { id: hotelId },
    include: { rooms: true, stairs: true },
  });
  
  if (!hotel) {
    throw new Error('Отель не найден');
  }
  
  const oldHasEGFloor = hotel.hasEGFloor;
  
  // Если значение не изменилось, миграция не нужна
  if (oldHasEGFloor === newHasEGFloor) {
    return;
  }
  
  // Определяем маппинг этажей
  const floorMapping: Partial<Record<$Enums.FloorType, $Enums.FloorType>> = {};
  
  if (!oldHasEGFloor && newHasEGFloor) {
    // Включаем EG: 1OG -> EG, 2OG -> 1OG, 3OG -> 2OG
    floorMapping[$Enums.FloorType.oneOG] = $Enums.FloorType.EG;
    floorMapping[$Enums.FloorType.twoOG] = $Enums.FloorType.oneOG;
    floorMapping[$Enums.FloorType.threeOG] = $Enums.FloorType.twoOG;
  } else if (oldHasEGFloor && !newHasEGFloor) {
    // Отключаем EG: EG -> 1OG, 1OG -> 2OG, 2OG -> 3OG
    floorMapping[$Enums.FloorType.EG] = $Enums.FloorType.oneOG;
    floorMapping[$Enums.FloorType.oneOG] = $Enums.FloorType.twoOG;
    floorMapping[$Enums.FloorType.twoOG] = $Enums.FloorType.threeOG;
  }
  
  // Мигрируем комнаты
  for (const room of hotel.rooms) {
    const newFloor = floorMapping[room.floor as $Enums.FloorType];
    if (newFloor) {
      await prisma.room.update({
        where: { id: room.id },
        data: { floor: newFloor },
      });
    }
  }
  
  // Мигрируем ступени
  for (const stair of hotel.stairs) {
    const newFloor = floorMapping[stair.floor as $Enums.FloorType];
    const newTargetFloor = stair.targetFloor ? floorMapping[stair.targetFloor as $Enums.FloorType] : undefined;
    
    const updateData: Prisma.StairsUpdateInput = {};
    if (newFloor) {
      updateData.floor = newFloor;
    }
    if (newTargetFloor) {
      updateData.targetFloor = newTargetFloor;
    }
    
    if (Object.keys(updateData).length > 0) {
      await prisma.stairs.update({
        where: { id: stair.id },
        data: updateData,
      });
    }
  }
}

export async function updateHotel(id: string, updates: Partial<Hotel>): Promise<Hotel> {
  // Получаем текущий отель для проверки изменения hasEGFloor
  const currentHotel = await prisma.hotel.findUnique({
    where: { id },
  });
  
  if (!currentHotel) {
    throw new Error('Отель не найден');
  }
  
  // Проверяем, изменился ли hasEGFloor
  const hasEGFloorChanged = updates.hasEGFloor !== undefined && 
                            updates.hasEGFloor !== currentHotel.hasEGFloor;
  
  // Если hasEGFloor изменился, сначала выполняем миграцию
  if (hasEGFloorChanged) {
    await migrateHotelFloors(id, updates.hasEGFloor!);
  }
  
  const updateData: Prisma.HotelUpdateInput = {};
  
  if (updates.name !== undefined) updateData.name = updates.name;
  if (updates.address !== undefined) updateData.address = updates.address;
  if (updates.description !== undefined) updateData.description = updates.description || null;
  if (updates.floors !== undefined) updateData.floors = updates.floors || null;
  if (updates.hasEGFloor !== undefined) updateData.hasEGFloor = updates.hasEGFloor;
  if (updates.image !== undefined) {
    // Buffer наследуется от Uint8Array, совместимы на уровне выполнения
    const imageInput = typeof updates.image === 'string' ? updates.image : undefined;
    const buffer = base64ToImageBuffer(imageInput);
    updateData.image = buffer as Prisma.Bytes | null;
  }
  if (updates.displayOrder !== undefined) updateData.displayOrder = updates.displayOrder || null;
  
  const updatedHotel = await prisma.hotel.update({
    where: { id },
    data: updateData,
  });
  
  return {
    id: updatedHotel.id,
    name: updatedHotel.name,
    address: updatedHotel.address,
    description: updatedHotel.description,
    floors: updatedHotel.floors,
    hasEGFloor: updatedHotel.hasEGFloor,
    image: imageBufferToBase64(updatedHotel.image) ?? null,
    displayOrder: updatedHotel.displayOrder,
  };
}

/**
 * Удалить отель
 */
export async function deleteHotel(id: string): Promise<void> {
  await prisma.hotel.delete({
    where: { id },
  });
}

// ============================================
// ROOMS (Комнаты)
// ============================================

/**
 * Получить все комнаты (с опциональной фильтрацией по отелю)
 * Автоматически загружает активные бронирования для каждой комнаты
 */
export async function getRooms(hotelId?: string): Promise<Room[]> {
  const where = hotelId ? { hotelId } : {};
  
  const rooms = await prisma.room.findMany({
    where,
    orderBy: [
      { floor: 'asc' },
      { number: 'asc' },
    ],
  });
  
  // Загружаем активные бронирования для каждой комнаты
  const roomsWithBookings = await Promise.all(
    rooms.map(async (room) => {
      const transformedRoom = transformRoom(room);
      const activeBookings = await getActiveBookingsForRoom(room.id);
      if (activeBookings.length > 0) {
        (transformedRoom as Room & { bookings?: BookingInfo[]; booking?: BookingInfo }).bookings = activeBookings;
        // Для обратной совместимости оставляем первое бронирование в booking
        (transformedRoom as Room & { bookings?: BookingInfo[]; booking?: BookingInfo }).booking = activeBookings[0];
      }
      return transformedRoom;
    })
  );
  
  return roomsWithBookings;
}

/**
 * Получить комнату по ID
 */
export async function getRoomById(id: string): Promise<Room | null> {
  const room = await prisma.room.findUnique({
    where: { id },
  });
  
  if (!room) return null;
  
  return transformRoom(room);
}

/**
 * Создать новую комнату
 */
export async function createRoom(room: Omit<Room, 'id'> & { id?: string }): Promise<Room> {
  const roomId = room.id || `room-${Date.now()}`;
  const newRoom = await prisma.room.create({
    data: {
      id: roomId,
      number: room.number,
      hotelId: room.hotelId,
      name: room.name || null,
      type: room.type,
      capacity: room.capacity,
      maxCapacity: room.maxCapacity,
      beds: (room.beds || []) as Prisma.InputJsonValue,
      floor: transformFloorToPrisma(room.floor) as $Enums.FloorType,
      price: room.price,
      position: room.position as Prisma.InputJsonValue,
      width: room.width || null,
      height: room.height || null,
      isCommon: room.isCommon || false,
      zIndex: room.zIndex || 1,
      description: room.description || null,
      hasShower: room.hasShower || false,
      hasToilet: room.hasToilet || false,
      pricePerPerson: room.pricePerPerson || false,
      ...(room.textVertical !== undefined && { textVertical: room.textVertical }),
    },
  });
  
  const transformedRoom = transformRoom(newRoom);
  // Загружаем активные бронирования для комнаты, если есть
  const activeBookings = await getActiveBookingsForRoom(roomId);
  if (activeBookings.length > 0) {
    (transformedRoom as Room & { bookings?: BookingInfo[]; booking?: BookingInfo }).bookings = activeBookings;
    // Для обратной совместимости оставляем первое бронирование в booking
    (transformedRoom as Room & { bookings?: BookingInfo[]; booking?: BookingInfo }).booking = activeBookings[0];
  }
  return transformedRoom;
}

/**
 * Обновить комнату
 */
export async function updateRoom(id: string, updates: Partial<Room>): Promise<Room> {
  const updateData: Prisma.RoomUpdateInput = {};
  
  if (updates.number !== undefined) updateData.number = updates.number;
  // hotelId не обновляется напрямую, так как это связь через relation
  // if (updates.hotelId !== undefined) updateData.hotelId = updates.hotelId;
  if (updates.name !== undefined) updateData.name = updates.name;
  if (updates.type !== undefined) updateData.type = updates.type;
  if (updates.capacity !== undefined) updateData.capacity = updates.capacity;
  if (updates.maxCapacity !== undefined) updateData.maxCapacity = updates.maxCapacity;
  if (updates.beds !== undefined) updateData.beds = updates.beds as Prisma.InputJsonValue;
  if (updates.floor !== undefined) updateData.floor = transformFloorToPrisma(updates.floor) as $Enums.FloorType;
  if (updates.price !== undefined) updateData.price = updates.price;
  if (updates.position !== undefined) updateData.position = updates.position as Prisma.InputJsonValue;
  if (updates.width !== undefined) updateData.width = updates.width;
  if (updates.height !== undefined) updateData.height = updates.height;
  if (updates.isCommon !== undefined) updateData.isCommon = updates.isCommon;
  if (updates.zIndex !== undefined) updateData.zIndex = updates.zIndex;
  if (updates.description !== undefined) updateData.description = updates.description;
  
  // Обработка полей hasShower и hasToilet
  if (updates.hasShower !== undefined) {
    updateData.hasShower = Boolean(updates.hasShower);
  }
  if (updates.hasToilet !== undefined) {
    updateData.hasToilet = Boolean(updates.hasToilet);
  }
  if (updates.pricePerPerson !== undefined) {
    updateData.pricePerPerson = Boolean(updates.pricePerPerson);
  }
  if (updates.textVertical !== undefined) {
    updateData.textVertical = Boolean(updates.textVertical);
  }
  
  console.log('updateRoom: updateData:', JSON.stringify(updateData, null, 2));
  
  const updatedRoom = await prisma.room.update({
    where: { id },
    data: updateData,
  });
  
  return transformRoom(updatedRoom);
}

/**
 * Удалить комнату
 */
export async function deleteRoom(id: string): Promise<void> {
  await prisma.room.delete({
    where: { id },
  });
}

// ============================================
// BOOKINGS (Бронирования)
// ============================================

/**
 * Получить все бронирования (с опциональной фильтрацией)
 */
export async function getBookings(roomId?: string, hotelId?: string): Promise<BookingInfo[]> {
  const where: Prisma.BookingWhereInput = {};
  
  if (roomId) {
    where.roomId = roomId;
  } else if (hotelId) {
    // Фильтруем по hotelId через связь с room
    where.room = {
      hotelId: hotelId,
    };
  }
  
  const bookings = await prisma.booking.findMany({
    where,
    include: {
      room: true, // Включаем данные комнаты для проверки hotelId
    },
    orderBy: {
      bookedDate: 'desc',
    },
  });
  
  return bookings.map(transformBooking);
}

/**
 * Получить бронирование по ID
 */
export async function getBookingById(id: string): Promise<BookingInfo | null> {
  const booking = await prisma.booking.findUnique({
    where: { id },
  });
  
  if (!booking) return null;
  
  return transformBooking(booking);
}

/**
 * Получить активное бронирование для комнаты (для обратной совместимости)
 * @deprecated Используйте getActiveBookingsForRoom для получения всех активных бронирований
 */
export async function getActiveBookingForRoom(roomId: string): Promise<BookingInfo | null> {
  const bookings = await getActiveBookingsForRoom(roomId);
  return bookings.length > 0 ? bookings[0] : null;
}

/**
 * Получить все активные бронирования для комнаты
 */
export async function getActiveBookingsForRoom(roomId: string): Promise<BookingInfo[]> {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  const bookings = await prisma.booking.findMany({
    where: {
      roomId,
      checkOut: {
        gte: today,
      },
    },
    orderBy: {
      checkIn: 'asc',
    },
  });
  
  return bookings.map(transformBooking);
}

/**
 * Проверить доступность комнаты в указанный период
 * Возвращает true, если комната доступна, false если занята
 */
export async function isRoomAvailable(
  roomId: string,
  checkIn: Date,
  checkOut: Date,
  excludeBookingId?: string
): Promise<boolean> {
  // Проверяем пересечения дат
  // Пересечение происходит если: existingCheckIn < newCheckOut AND existingCheckOut > newCheckIn
  // Это означает, что комната занята, если существующее бронирование начинается до даты выезда нового
  // И заканчивается после даты заезда нового
  // Если existingCheckOut = newCheckIn, то конфликта нет (комната свободна с даты выезда)
  // Если existingCheckIn = newCheckOut, то конфликта нет (комната свободна до даты заезда)
  const conflictingBooking = await prisma.booking.findFirst({
    where: {
      roomId,
      id: excludeBookingId ? { not: excludeBookingId } : undefined,
      // Проверяем пересечение дат: существующее бронирование пересекается с новым,
      // если existingCheckIn < newCheckOut AND existingCheckOut > newCheckIn
      AND: [
        {
          checkIn: {
            lt: checkOut, // existingCheckIn < newCheckOut
          },
        },
        {
          checkOut: {
            gt: checkIn, // existingCheckOut > newCheckIn
          },
        },
      ] as Prisma.BookingWhereInput['AND'],
    },
  });

  return conflictingBooking === null;
}

/**
 * Создать новое бронирование
 * EXCLUDE constraint на уровне базы данных предотвращает пересекающиеся бронирования
 */
export async function createBooking(
  booking: Omit<BookingInfo, 'id'> & { id?: string }
): Promise<BookingInfo> {
  const checkInDate = new Date(booking.checkIn);
  const checkOutDate = new Date(booking.checkOut);

  // Валидация дат
  if (checkInDate >= checkOutDate) {
    throw new Error('Дата заезда должна быть раньше даты выезда');
  }

  // ТРОЙНАЯ ЗАЩИТА от race condition для наплыва в 100+ человек:
  // 1. Advisory lock - блокирует комнату на уровне приложения
  // 2. SELECT FOR UPDATE - блокирует строки на уровне БД
  // 3. EXCLUDE constraint - финальная защита на уровне БД
  const maxRetries = 5;
  let lastError: Error | null = null;
  
  for (let attempt = 0; attempt < maxRetries; attempt++) {
    try {
      const result = await prisma.$transaction(async (tx) => {
        // 1. Advisory lock - блокируем комнату на уровне приложения
        // Используем более надежный способ генерации lock ID
        const roomHash = booking.roomId.split('').reduce((acc, char, idx) => {
          return acc + (char.charCodeAt(0) * (idx + 1));
        }, 0);
        const lockId = Math.abs(roomHash) % 2147483647; // PostgreSQL advisory lock range
        
        // Блокируем комнату с помощью advisory lock
        // При наплыве в 100 человек, все остальные будут ждать освобождения блокировки
        await tx.$executeRawUnsafe(
          `SELECT pg_advisory_xact_lock($1)`,
          lockId
        );
        
        // 2. SELECT FOR UPDATE - блокируем существующие бронирования на уровне БД
        // Это гарантирует, что между проверкой и созданием не появится новое бронирование
        const conflictingBookings = await tx.$queryRawUnsafe<Array<{ id: string; check_in: Date; check_out: Date }>>(
          `SELECT id, check_in, check_out 
           FROM bookings 
           WHERE room_id = $1 
           AND check_in < $2 
           AND check_out > $3 
           FOR UPDATE`,
          booking.roomId,
          checkOutDate.toISOString().split('T')[0],
          checkInDate.toISOString().split('T')[0]
        );
        
        if (conflictingBookings && conflictingBookings.length > 0) {
          const conflicting = conflictingBookings[0];
          const existingCheckIn = new Date(conflicting.check_in).toLocaleDateString('ru-RU');
          const existingCheckOut = new Date(conflicting.check_out).toLocaleDateString('ru-RU');
          throw new Error(
            `К сожалению, кто-то забронировал эту комнату раньше вас на период ${existingCheckIn} - ${existingCheckOut}. Пожалуйста, выберите другие даты.`
          );
        }

        // 3. Создаем бронирование внутри той же транзакции
        // EXCLUDE constraint на уровне базы данных дополнительно предотвратит пересечения
        const bookingId = booking.id || `booking-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
        
        // Обработка bookedDate: если не передан или невалиден, используем текущую дату
        let bookedDateValue: Date;
        if (booking.bookedDate) {
          const parsedDate = new Date(booking.bookedDate);
          if (isNaN(parsedDate.getTime())) {
            bookedDateValue = new Date();
          } else {
            bookedDateValue = parsedDate;
          }
        } else {
          bookedDateValue = new Date();
        }
        
        const newBooking = await tx.booking.create({
          data: {
            id: bookingId,
            roomId: booking.roomId,
            bookedBy: booking.bookedBy,
            bookedDate: bookedDateValue,
            email: booking.email || null,
            phone: booking.phone,
            checkIn: checkInDate,
            checkOut: checkOutDate,
            guests: (booking.guests || []) as unknown as Prisma.InputJsonValue,
            notes: booking.notes || null,
            isConfirmed: booking.isConfirmed || false,
            confirmedBy: booking.confirmedBy || null,
            confirmedDate: booking.confirmedDate ? new Date(booking.confirmedDate) : null,
            isPaid: booking.isPaid || false,
            paymentMethod: booking.paymentMethod || null,
            paymentDate: booking.paymentDate ? new Date(booking.paymentDate) : null,
            paidBy: booking.paidBy || null,
            amount: booking.amount || null,
          },
        });

        return transformBooking(newBooking);
      }, {
        // Используем уровень изоляции Serializable для максимальной защиты
        // При наплыве в 100 человек это гарантирует строгую сериализацию
        isolationLevel: 'Serializable',
        timeout: 30000, // Увеличенный таймаут для обработки очереди из 100 человек
        maxWait: 30000, // Максимальное время ожидания начала транзакции
      });

      return result;
    } catch (error: unknown) {
      const errorObj = error instanceof Error ? error : new Error(String(error));
      
      // Обрабатываем ошибки сериализации - повторяем попытку
      const errorCode = (error as { code?: string })?.code;
      const errorMessage = errorObj.message || '';
      
      // PostgreSQL код ошибки для serialization failure
      if (errorCode === '40001' || errorMessage.includes('serialization failure') || errorMessage.includes('could not serialize')) {
        lastError = errorObj;
        // Экспоненциальная задержка перед повтором
        const delay = Math.min(100 * Math.pow(2, attempt), 2000);
        if (attempt < maxRetries - 1) {
          await new Promise(resolve => setTimeout(resolve, delay));
          continue; // Повторяем попытку
        }
      }
      
      // Обрабатываем ошибку constraint от PostgreSQL
      if (errorCode === '23P01' || errorMessage.includes('bookings_no_overlap') || errorMessage.includes('violates exclusion constraint')) {
        // Получаем информацию о конфликтующем бронировании для более понятного сообщения
        try {
          const conflicting = await prisma.booking.findFirst({
            where: {
              roomId: booking.roomId,
              AND: [
                {
                  checkIn: {
                    lt: checkOutDate,
                  },
                },
                {
                  checkOut: {
                    gt: checkInDate,
                  },
                },
              ],
            },
            orderBy: {
              checkIn: 'asc',
            },
          });

          if (conflicting) {
            throw new Error(
              `К сожалению, кто-то забронировал эту комнату раньше вас. Пожалуйста, выберите другую комнату.`
            );
          }
        } catch {
          // Если не удалось получить информацию, используем общее сообщение
        }
        throw new Error('К сожалению, кто-то забронировал эту комнату раньше вас. Пожалуйста, выберите другую комнату.');
      }
      
      // Если это не ошибка сериализации или закончились попытки, пробрасываем ошибку
      throw errorObj;
    }
  }
  
  // Если все попытки исчерпаны
  if (lastError) {
    throw lastError;
  }
  
  throw new Error('Не удалось создать бронирование после нескольких попыток');
}

/**
 * Обновить бронирование с проверкой доступности комнаты
 */
export async function updateBooking(
  id: string,
  updates: Partial<BookingInfo>
): Promise<BookingInfo> {
  // Получаем текущее бронирование
  const currentBooking = await prisma.booking.findUnique({
    where: { id },
  });

  if (!currentBooking) {
    throw new Error('Бронирование не найдено');
  }

  // Определяем, нужно ли проверять доступность
  const needsAvailabilityCheck = 
    updates.checkIn !== undefined || 
    updates.checkOut !== undefined || 
    updates.roomId !== undefined;

  // Если изменяются даты или комната, проверяем валидацию
  if (needsAvailabilityCheck) {
    const checkInDate = updates.checkIn ? new Date(updates.checkIn) : new Date(currentBooking.checkIn);
    const checkOutDate = updates.checkOut ? new Date(updates.checkOut) : new Date(currentBooking.checkOut);

    // Валидация дат - разрешаем одинаковые даты (бронирование на одну ночь)
    // Блокируем только если дата выезда раньше даты заезда
    if (checkInDate > checkOutDate) {
      throw new Error('Дата заезда не может быть позже даты выезда');
    }

    // EXCLUDE constraint автоматически проверит пересечения при обновлении
    // Но нужно временно исключить текущее бронирование из проверки
    // Для этого используем частичный индекс или просто полагаемся на constraint
    // Constraint проверит все бронирования, но при UPDATE текущее бронирование будет заменено новыми данными
  }

  // Подготавливаем данные для обновления
  const updateData: Prisma.BookingUpdateInput = {};
  
  if (updates.roomId !== undefined) {
    updateData.room = { connect: { id: updates.roomId } };
  }
  if (updates.bookedBy !== undefined) updateData.bookedBy = updates.bookedBy;
  if (updates.bookedDate !== undefined) updateData.bookedDate = new Date(updates.bookedDate);
  if (updates.email !== undefined) updateData.email = updates.email;
  if (updates.phone !== undefined) updateData.phone = updates.phone;
  if (updates.checkIn !== undefined) updateData.checkIn = new Date(updates.checkIn);
  if (updates.checkOut !== undefined) updateData.checkOut = new Date(updates.checkOut);
  if (updates.guests !== undefined) updateData.guests = updates.guests as unknown as Prisma.InputJsonValue;
  if (updates.notes !== undefined) updateData.notes = updates.notes;
  if (updates.isConfirmed !== undefined) updateData.isConfirmed = updates.isConfirmed;
  if (updates.confirmedBy !== undefined) updateData.confirmedBy = updates.confirmedBy;
  if (updates.confirmedDate !== undefined) updateData.confirmedDate = updates.confirmedDate ? new Date(updates.confirmedDate) : null;
  if (updates.isPaid !== undefined) updateData.isPaid = updates.isPaid;
  if (updates.paymentMethod !== undefined) updateData.paymentMethod = updates.paymentMethod;
  if (updates.paymentDate !== undefined) updateData.paymentDate = updates.paymentDate ? new Date(updates.paymentDate) : null;
  if (updates.paidBy !== undefined) updateData.paidBy = updates.paidBy;
  if (updates.amount !== undefined) updateData.amount = updates.amount;
  
  try {
    // EXCLUDE constraint автоматически проверит пересечения при обновлении
    const updatedBooking = await prisma.booking.update({
      where: { id },
      data: updateData,
    });
    
    return transformBooking(updatedBooking);
  } catch (error: unknown) {
    // Обрабатываем ошибку constraint от PostgreSQL
    if ((error as { code?: string; message?: string }).code === '23P01' || (error as { message?: string }).message?.includes('bookings_no_overlap') || (error as { message?: string }).message?.includes('violates exclusion constraint')) {
      // Получаем информацию о конфликтующем бронировании
      const checkInDate = updates.checkIn ? new Date(updates.checkIn) : new Date(currentBooking.checkIn);
      const checkOutDate = updates.checkOut ? new Date(updates.checkOut) : new Date(currentBooking.checkOut);
      const roomId = updates.roomId || currentBooking.roomId;

      try {
        const conflicting = await prisma.booking.findFirst({
          where: {
            roomId,
            id: { not: id }, // Исключаем текущее бронирование
            AND: [
              {
                checkIn: {
                  lt: checkOutDate,
                },
              },
              {
                checkOut: {
                  gt: checkInDate,
                },
              },
            ],
          },
          orderBy: {
            checkIn: 'asc',
          },
        });

        if (conflicting) {
          const existingCheckIn = new Date(conflicting.checkIn).toLocaleDateString('ru-RU');
          const existingCheckOut = new Date(conflicting.checkOut).toLocaleDateString('ru-RU');
          throw new Error(
            `Комната уже забронирована на период ${existingCheckIn} - ${existingCheckOut}. Пожалуйста, выберите другие даты.`
          );
        }
      } catch {
        // Если не удалось получить информацию, используем общее сообщение
      }
      throw new Error('Комната уже забронирована на выбранные даты. Пожалуйста, выберите другие даты.');
    }
    // Пробрасываем другие ошибки
    throw error;
  }
}

/**
 * Удалить бронирование
 */
export async function deleteBooking(id: string): Promise<void> {
  await prisma.booking.delete({
    where: { id },
  });
}

// ============================================
// STAIRS (Лестницы)
// ============================================

/**
 * Получить все лестницы (с опциональной фильтрацией по отелю)
 */
export async function getStairs(hotelId?: string): Promise<Stairs[]> {
  const where = hotelId ? { hotelId } : {};
  
  const stairs = await prisma.stairs.findMany({
    where,
    orderBy: {
      floor: 'asc',
    },
  });
  
  return stairs.map(transformStairs);
}

/**
 * Получить лестницу по ID
 */
export async function getStairsById(id: string): Promise<Stairs | null> {
  const stairs = await prisma.stairs.findUnique({
    where: { id },
  });
  
  if (!stairs) return null;
  
  return transformStairs(stairs);
}

/**
 * Создать новую лестницу
 */
export async function createStairs(
  stairs: Omit<Stairs, 'id'> & { id?: string }
): Promise<Stairs> {
  const stairsId = stairs.id || `stairs-${Date.now()}`;
  const newStairs = await prisma.stairs.create({
    data: {
      id: stairsId,
      hotelId: stairs.hotelId,
      floor: transformFloorToPrisma(stairs.floor) as $Enums.FloorType,
      position: stairs.position as Prisma.InputJsonValue,
      width: stairs.width,
      height: stairs.height,
      direction: stairs.direction,
      targetFloor: stairs.targetFloor ? (transformFloorToPrisma(stairs.targetFloor) as $Enums.FloorType) : null,
    },
  });
  
  return transformStairs(newStairs);
}

/**
 * Обновить лестницу
 */
export async function updateStairs(id: string, updates: Partial<Stairs>): Promise<Stairs> {
  const updateData: Prisma.StairsUpdateInput = {};
  
  if (updates.hotelId !== undefined) {
    updateData.hotel = { connect: { id: updates.hotelId } };
  }
  if (updates.floor !== undefined) updateData.floor = transformFloorToPrisma(updates.floor) as $Enums.FloorType;
  if (updates.position !== undefined) updateData.position = updates.position as Prisma.InputJsonValue;
  if (updates.width !== undefined) updateData.width = updates.width;
  if (updates.height !== undefined) updateData.height = updates.height;
  if (updates.direction !== undefined) updateData.direction = updates.direction;
  if (updates.targetFloor !== undefined) updateData.targetFloor = updates.targetFloor ? (transformFloorToPrisma(updates.targetFloor) as $Enums.FloorType) : null;
  
  const updatedStairs = await prisma.stairs.update({
    where: { id },
    data: updateData,
  });
  
  return transformStairs(updatedStairs);
}

/**
 * Удалить лестницу
 */
export async function deleteStairs(id: string): Promise<void> {
  await prisma.stairs.delete({
    where: { id },
  });
}

// ============================================
// INVITES (Приглашения)
// ============================================

/**
 * Получить все приглашения
 */
export async function getInvites(): Promise<Omit<Invite, 'token'>[]> {
  const invites = await prisma.invite.findMany({
    select: {
      id: true,
      createdBy: true,
      createdAt: true,
      expiresAt: true,
      used: true,
      name: true,
      usedBy: true,
      usedAt: true,
    },
    orderBy: {
      createdAt: 'desc',
    },
  });
  
  return invites.map(i => ({
    id: i.id,
    createdBy: i.createdBy,
    createdAt: i.createdAt.toISOString(),
    expiresAt: i.expiresAt.toISOString(),
    used: i.used,
    name: i.name,
    usedBy: i.usedBy ?? null,
    usedAt: i.usedAt?.toISOString() ?? null,
  }));
}

/**
 * Получить приглашение по ID
 */
export async function getInviteById(id: string): Promise<Invite | null> {
  const invite = await prisma.invite.findUnique({
    where: { id },
  });
  
  if (!invite) return null;
  
  return transformInvite(invite);
}

/**
 * Получить приглашение по токену (хэшированному)
 */
export async function getInviteByToken(hashedToken: string): Promise<Invite | null> {
  const invite = await prisma.invite.findUnique({
    where: { token: hashedToken },
  });
  
  if (!invite) return null;
  
  return transformInvite(invite);
}

/**
 * Создать новое приглашение
 */
export async function createInvite(
  invite: Omit<Invite, 'id'> & { id?: string }
): Promise<Invite> {
  const inviteId = invite.id || `invite-${Date.now()}`;
  const newInvite = await prisma.invite.create({
    data: {
      id: inviteId,
      token: invite.token,
      createdBy: invite.createdBy,
      createdAt: new Date(invite.createdAt),
      expiresAt: new Date(invite.expiresAt),
      used: invite.used,
      name: invite.name,
      usedBy: invite.usedBy || null,
      usedAt: invite.usedAt ? new Date(invite.usedAt) : null,
    },
  });
  
  return transformInvite(newInvite);
}

/**
 * Обновить приглашение
 */
export async function updateInvite(id: string, updates: Partial<Invite>): Promise<Invite> {
  const updateData: Prisma.InviteUpdateInput = {};
  
  if (updates.used !== undefined) updateData.used = updates.used;
  if (updates.usedBy !== undefined) {
    updateData.user = updates.usedBy ? { connect: { id: updates.usedBy } } : { disconnect: true };
  }
  if (updates.usedAt !== undefined) updateData.usedAt = updates.usedAt ? new Date(updates.usedAt) : null;
  
  const updatedInvite = await prisma.invite.update({
    where: { id },
    data: updateData,
  });
  
  return transformInvite(updatedInvite);
}

/**
 * Удалить приглашение
 */
export async function deleteInvite(id: string): Promise<void> {
  await prisma.invite.delete({
    where: { id },
  });
}

// ============================================
// FEEDBACK (Отзывы и баг-репорты)
// ============================================

export interface Feedback {
  id: string;
  userName: string;
  userEmail?: string;
  userRole: string;
  comment: string;
  screenshot?: string;
  userAgent?: string;
  isProcessed?: boolean;
  createdAt: string;
  updatedAt?: string;
}

/**
 * Получить все отзывы
 */
export async function getFeedbacks(): Promise<Feedback[]> {
  const feedbacks = await prisma.feedback.findMany({
    orderBy: {
      createdAt: 'desc',
    },
  });

  return feedbacks.map(f => ({
    id: f.id,
    userName: f.userName,
    userEmail: f.userEmail || undefined,
    userRole: f.userRole,
    comment: f.comment,
    screenshot: f.screenshot || undefined,
    userAgent: f.userAgent || undefined,
    isProcessed: (f as { isProcessed?: boolean }).isProcessed || false,
    createdAt: f.createdAt.toISOString(),
    updatedAt: f.updatedAt.toISOString(),
  }));
}

/**
 * Получить отзыв по ID
 */
export async function getFeedbackById(id: string): Promise<Feedback | null> {
  const feedback = await prisma.feedback.findUnique({
    where: { id },
  });

  if (!feedback) return null;

  return {
    id: feedback.id,
    userName: feedback.userName,
    userEmail: feedback.userEmail || undefined,
    userRole: feedback.userRole,
    comment: feedback.comment,
    screenshot: feedback.screenshot || undefined,
    userAgent: feedback.userAgent || undefined,
    isProcessed: (feedback as { isProcessed?: boolean }).isProcessed || false,
    createdAt: feedback.createdAt.toISOString(),
    updatedAt: feedback.updatedAt.toISOString(),
  };
}

/**
 * Создать новый отзыв
 */
export async function createFeedback(
  feedback: Omit<Feedback, 'id' | 'createdAt' | 'updatedAt'>
): Promise<Feedback> {
  const newFeedback = await prisma.feedback.create({
    data: {
      userName: feedback.userName,
      userEmail: feedback.userEmail || null,
      userRole: feedback.userRole,
      comment: feedback.comment,
      screenshot: feedback.screenshot || null,
      userAgent: feedback.userAgent || null,
    },
  });

  return {
    id: newFeedback.id,
    userName: newFeedback.userName,
    userEmail: newFeedback.userEmail || undefined,
    userRole: newFeedback.userRole,
    comment: newFeedback.comment,
    screenshot: newFeedback.screenshot || undefined,
    userAgent: newFeedback.userAgent || undefined,
    isProcessed: (newFeedback as { isProcessed?: boolean }).isProcessed || false,
    createdAt: newFeedback.createdAt.toISOString(),
    updatedAt: newFeedback.updatedAt.toISOString(),
  };
}

/**
 * Обновить статус обработки отзыва
 */
export async function updateFeedbackStatus(id: string, isProcessed: boolean): Promise<Feedback> {
  const updatedFeedback = await prisma.feedback.update({
    where: { id },
    data: { isProcessed },
  });

  return {
    id: updatedFeedback.id,
    userName: updatedFeedback.userName,
    userEmail: updatedFeedback.userEmail || undefined,
    userRole: updatedFeedback.userRole,
    comment: updatedFeedback.comment,
    screenshot: updatedFeedback.screenshot || undefined,
    userAgent: updatedFeedback.userAgent || undefined,
    isProcessed: (updatedFeedback as { isProcessed?: boolean }).isProcessed || false,
    createdAt: updatedFeedback.createdAt.toISOString(),
    updatedAt: updatedFeedback.updatedAt.toISOString(),
  };
}

/**
 * Удалить отзыв
 */
export async function deleteFeedback(id: string): Promise<void> {
  await prisma.feedback.delete({
    where: { id },
  });
}

// ============================================
// REGISTRATION TOKEN (Общий токен регистрации)
// ============================================

/**
 * Получить активный токен регистрации
 */
export async function getActiveRegistrationToken(): Promise<RegistrationToken | null> {
  // Проверяем, что модель доступна
  if (!prisma.registrationToken) {
    throw new Error('RegistrationToken model is not available. Please restart the development server after running "npx prisma generate"');
  }

  const token = await prisma.registrationToken.findFirst({
    where: { isActive: true },
    orderBy: { createdAt: 'desc' },
  });

  if (!token) return null;

  return {
    id: token.id,
    token: token.token,
    originalToken: token.originalToken || undefined,
    isActive: token.isActive,
    createdAt: token.createdAt.toISOString(),
    updatedAt: token.updatedAt.toISOString(),
  };
}

/**
 * Получить токен регистрации по ID
 */
export async function getRegistrationTokenById(id: string): Promise<RegistrationToken | null> {
  // Проверяем, что модель доступна
  if (!prisma.registrationToken) {
    throw new Error('RegistrationToken model is not available. Please restart the development server after running "npx prisma generate"');
  }

  const token = await prisma.registrationToken.findUnique({
    where: { id },
  });

  if (!token) return null;

  return {
    id: token.id,
    token: token.token,
    isActive: token.isActive,
    createdAt: token.createdAt.toISOString(),
    updatedAt: token.updatedAt.toISOString(),
  };
}

/**
 * Проверить токен регистрации (по оригинальному токену из URL)
 */
export async function verifyRegistrationToken(originalToken: string): Promise<boolean> {
  // Проверяем, что модель доступна
  if (!prisma.registrationToken) {
    throw new Error('RegistrationToken model is not available. Please restart the development server after running "npx prisma generate"');
  }

  // Ищем по originalToken напрямую, так как в URL используется оригинальный токен
  const token = await prisma.registrationToken.findFirst({
    where: {
      originalToken: originalToken,
      isActive: true,
    },
  });

  return token !== null;
}

/**
 * Создать или обновить токен регистрации
 * При создании нового токена все старые токены деактивируются
 */
export async function createOrUpdateRegistrationToken(hashedToken: string, originalToken?: string): Promise<RegistrationToken> {
  // Проверяем, что модель доступна
  if (!prisma.registrationToken) {
    throw new Error('RegistrationToken model is not available. Please restart the development server after running "npx prisma generate"');
  }

  // Деактивируем все существующие токены
  await prisma.registrationToken.updateMany({
    where: { isActive: true },
    data: { isActive: false },
  });

  // Создаем новый активный токен
  const newToken = await prisma.registrationToken.create({
    data: {
      token: hashedToken,
      originalToken: originalToken || null,
      isActive: true,
    },
  });

  return {
    id: newToken.id,
    token: newToken.token,
    originalToken: newToken.originalToken || undefined,
    isActive: newToken.isActive,
    createdAt: newToken.createdAt.toISOString(),
    updatedAt: newToken.updatedAt.toISOString(),
  };
}

// ============================================
// BOOKING DATE RANGES (Диапазоны дат для бронирования)
// ============================================

/**
 * Получить все диапазоны дат для бронирования
 */
export async function getAllBookingDateRanges(): Promise<BookingDateRange[]> {
  const ranges = await prisma.bookingDateRange.findMany({
    orderBy: { startDate: 'desc' },
  });
  
  return ranges.map(r => ({
    id: r.id,
    name: r.name ?? null,
    startDate: r.startDate.toISOString().split('T')[0],
    endDate: r.endDate.toISOString().split('T')[0],
    isActive: r.isActive,
    createdAt: r.createdAt.toISOString(),
    updatedAt: r.updatedAt.toISOString(),
  }));
}

/**
 * Получить активные диапазоны дат для бронирования
 */
export async function getActiveBookingDateRanges(): Promise<BookingDateRange[]> {
  const ranges = await prisma.bookingDateRange.findMany({
    where: { isActive: true },
    orderBy: { startDate: 'asc' },
  });
  
  return ranges.map(r => ({
    id: r.id,
    name: r.name ?? null,
    startDate: r.startDate.toISOString().split('T')[0],
    endDate: r.endDate.toISOString().split('T')[0],
    isActive: r.isActive,
    createdAt: r.createdAt.toISOString(),
    updatedAt: r.updatedAt.toISOString(),
  }));
}

/**
 * Создать новый диапазон дат для бронирования
 */
export async function createBookingDateRange(data: {
  name?: string;
  startDate: string;
  endDate: string;
  isActive?: boolean;
}): Promise<BookingDateRange> {
  const range = await prisma.bookingDateRange.create({
    data: {
      name: data.name || null,
      startDate: new Date(data.startDate),
      endDate: new Date(data.endDate),
      isActive: data.isActive !== undefined ? data.isActive : true,
    },
  });
  
  return {
    id: range.id,
    name: range.name ?? null,
    startDate: range.startDate.toISOString().split('T')[0],
    endDate: range.endDate.toISOString().split('T')[0],
    isActive: range.isActive,
    createdAt: range.createdAt.toISOString(),
    updatedAt: range.updatedAt.toISOString(),
  };
}

/**
 * Обновить диапазон дат для бронирования
 */
export async function updateBookingDateRange(
  id: string,
  data: {
    name?: string;
    startDate?: string;
    endDate?: string;
    isActive?: boolean;
  }
): Promise<BookingDateRange> {
  const updateData: Prisma.BookingDateRangeUpdateInput = {};
  
  if (data.name !== undefined) updateData.name = data.name || null;
  if (data.startDate !== undefined) updateData.startDate = new Date(data.startDate);
  if (data.endDate !== undefined) updateData.endDate = new Date(data.endDate);
  if (data.isActive !== undefined) updateData.isActive = data.isActive;
  
  const range = await prisma.bookingDateRange.update({
    where: { id },
    data: updateData,
  });
  
  return {
    id: range.id,
    name: range.name ?? null,
    startDate: range.startDate.toISOString().split('T')[0],
    endDate: range.endDate.toISOString().split('T')[0],
    isActive: range.isActive,
    createdAt: range.createdAt.toISOString(),
    updatedAt: range.updatedAt.toISOString(),
  };
}

/**
 * Удалить диапазон дат для бронирования
 */
export async function deleteBookingDateRange(id: string): Promise<void> {
  await prisma.bookingDateRange.delete({
    where: { id },
  });
}