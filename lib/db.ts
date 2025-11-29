// ============================================
// ТИПИЗИРОВАННЫЕ ХЕЛПЕРЫ ДЛЯ РАБОТЫ С БАЗОЙ ДАННЫХ
// Использует Prisma для работы с Neon PostgreSQL
// ============================================

import { prisma } from './prisma';
import type { User, Room, Hotel, Stairs, BookingInfo, Invite } from '@/types';
import { normalizePhone } from './phone';

// ============================================
// ВСПОМОГАТЕЛЬНЫЕ ФУНКЦИИ ДЛЯ ПРЕОБРАЗОВАНИЯ ДАННЫХ
// ============================================

/**
 * Преобразует enum FloorType из Prisma в формат приложения
 */
function transformFloor(floor: string): 'EG' | '1OG' | '2OG' {
  if (floor === 'oneOG') return '1OG';
  if (floor === 'twoOG') return '2OG';
  return floor as 'EG' | '1OG' | '2OG';
}

/**
 * Преобразует формат приложения в enum FloorType для Prisma
 */
function transformFloorToPrisma(floor: 'EG' | '1OG' | '2OG'): 'EG' | 'oneOG' | 'twoOG' {
  if (floor === '1OG') return 'oneOG';
  if (floor === '2OG') return 'twoOG';
  return 'EG';
}

/**
 * Преобразует данные комнаты из Prisma в формат приложения
 */
function transformRoom(room: any): Room {
  return {
    id: room.id,
    number: room.number,
    hotelId: room.hotelId,
    name: room.name || undefined,
    type: room.type as Room['type'],
    capacity: room.capacity,
    maxCapacity: room.maxCapacity,
    beds: (typeof room.beds === 'string' ? JSON.parse(room.beds) : room.beds) as string[],
    floor: transformFloor(room.floor),
    price: Number(room.price),
    position: typeof room.position === 'string' ? JSON.parse(room.position) : room.position,
    width: room.width || undefined,
    height: room.height || undefined,
    isCommon: room.isCommon || false,
    zIndex: room.zIndex || 1,
    description: room.description || undefined,
    hasShower: room.hasShower || false,
    hasToilet: room.hasToilet || false,
  };
}

/**
 * Преобразует данные бронирования из Prisma в формат приложения
 */
function transformBooking(booking: any): BookingInfo {
  return {
    id: booking.id,
    roomId: booking.roomId,
    bookedBy: booking.bookedBy,
    bookedDate: booking.bookedDate.toISOString(),
    email: booking.email,
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
function transformStairs(stairs: any): Stairs {
  return {
    id: stairs.id,
    hotelId: stairs.hotelId,
    floor: transformFloor(stairs.floor),
    position: typeof stairs.position === 'string' ? JSON.parse(stairs.position) : stairs.position,
    width: stairs.width,
    height: stairs.height,
    direction: stairs.direction as Stairs['direction'],
    targetFloor: stairs.targetFloor ? transformFloor(stairs.targetFloor) : undefined,
  };
}

/**
 * Преобразует данные приглашения из Prisma в формат приложения
 */
function transformInvite(invite: any): Invite {
  return {
    id: invite.id,
    token: invite.token,
    createdBy: invite.createdBy,
    createdAt: invite.createdAt.toISOString(),
    expiresAt: invite.expiresAt.toISOString(),
    used: invite.used,
    name: invite.name,
    usedBy: invite.usedBy || undefined,
    usedAt: invite.usedAt?.toISOString() || undefined,
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
      createdAt: true,
    },
    orderBy: {
      createdAt: 'desc',
    },
  });
  
  return users.map(u => ({
    id: u.id,
    email: u.email || undefined,
    name: u.name,
    phone: u.phone || undefined,
    role: u.role as User['role'],
    createdAt: u.createdAt?.toISOString() || undefined,
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
    email: user.email || undefined,
    name: user.name,
    password: user.password || undefined,
    phone: user.phone || undefined,
    role: user.role as User['role'],
    createdAt: user.createdAt?.toISOString() || undefined,
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
    email: user.email || undefined,
    name: user.name,
    password: user.password || undefined,
    phone: user.phone || undefined,
    role: user.role as User['role'],
    createdAt: user.createdAt?.toISOString() || undefined,
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
    email: user.email || undefined,
    name: user.name,
    password: user.password || undefined,
    phone: user.phone || undefined,
    role: user.role as User['role'],
    createdAt: user.createdAt?.toISOString() || undefined,
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
      role: user.role as any,
      isProfileComplete: user.isProfileComplete ?? false,
    },
  });
  
  return {
    id: newUser.id,
    email: newUser.email || undefined,
    name: newUser.name,
    password: newUser.password || undefined,
    phone: newUser.phone || undefined,
    role: newUser.role as User['role'],
    createdAt: newUser.createdAt?.toISOString() || undefined,
    isProfileComplete: newUser.isProfileComplete,
  };
}

/**
 * Обновить пользователя
 */
export async function updateUser(id: string, updates: Partial<User>): Promise<User> {
  const updateData: any = {};
  
  if (updates.email !== undefined) updateData.email = updates.email || null;
  if (updates.name !== undefined) updateData.name = updates.name;
  if (updates.password !== undefined) updateData.password = updates.password || null;
  if (updates.phone !== undefined) {
    // Нормализуем телефон перед сохранением
    updateData.phone = updates.phone ? normalizePhone(updates.phone) : null;
  }
  if (updates.role !== undefined) updateData.role = updates.role as any;
  if (updates.isProfileComplete !== undefined) updateData.isProfileComplete = updates.isProfileComplete;
  
  const updatedUser = await prisma.user.update({
    where: { id },
    data: updateData,
  });
  
  return {
    id: updatedUser.id,
    email: updatedUser.email || undefined,
    name: updatedUser.name,
    password: updatedUser.password || undefined,
    phone: updatedUser.phone || undefined,
    role: updatedUser.role as User['role'],
    createdAt: updatedUser.createdAt?.toISOString() || undefined,
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
 * Получить все отели
 */
export async function getHotels(): Promise<Hotel[]> {
  const hotels = await prisma.hotel.findMany({
    orderBy: {
      createdAt: 'desc',
    },
  });
  
  return hotels.map(h => ({
    id: h.id,
    name: h.name,
    address: h.address,
    description: h.description || undefined,
    floors: h.floors || undefined,
    image: h.image || undefined,
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
    description: hotel.description || undefined,
    floors: hotel.floors || undefined,
    image: hotel.image || undefined,
  };
}

/**
 * Создать новый отель
 */
export async function createHotel(hotel: Omit<Hotel, 'id'> & { id?: string }): Promise<Hotel> {
  const hotelId = hotel.id || `hotel-${Date.now()}`;
  const newHotel = await prisma.hotel.create({
    data: {
      id: hotelId,
      name: hotel.name,
      address: hotel.address,
      description: hotel.description || null,
      floors: hotel.floors || null,
      image: hotel.image || null,
    },
  });
  
  return {
    id: newHotel.id,
    name: newHotel.name,
    address: newHotel.address,
    description: newHotel.description || undefined,
    floors: newHotel.floors || undefined,
    image: newHotel.image || undefined,
  };
}

/**
 * Обновить отель
 */
export async function updateHotel(id: string, updates: Partial<Hotel>): Promise<Hotel> {
  const updateData: any = {};
  
  if (updates.name !== undefined) updateData.name = updates.name;
  if (updates.address !== undefined) updateData.address = updates.address;
  if (updates.description !== undefined) updateData.description = updates.description;
  if (updates.floors !== undefined) updateData.floors = updates.floors;
  if (updates.image !== undefined) updateData.image = updates.image;
  
  const updatedHotel = await prisma.hotel.update({
    where: { id },
    data: updateData,
  });
  
  return {
    id: updatedHotel.id,
    name: updatedHotel.name,
    address: updatedHotel.address,
    description: updatedHotel.description || undefined,
    floors: updatedHotel.floors || undefined,
    image: updatedHotel.image || undefined,
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
      const activeBooking = await getActiveBookingForRoom(room.id);
      if (activeBooking) {
        (transformedRoom as any).booking = activeBooking;
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
      type: room.type as any,
      capacity: room.capacity,
      maxCapacity: room.maxCapacity,
      beds: (room.beds || []) as any,
      floor: transformFloorToPrisma(room.floor) as any,
      price: room.price,
      position: room.position as any,
      width: room.width || null,
      height: room.height || null,
      isCommon: room.isCommon || false,
      zIndex: room.zIndex || 1,
      description: room.description || null,
      hasShower: room.hasShower || false,
      hasToilet: room.hasToilet || false,
    },
  });
  
  const transformedRoom = transformRoom(newRoom);
  // Загружаем активное бронирование для комнаты, если есть
  const activeBooking = await getActiveBookingForRoom(roomId);
  if (activeBooking) {
    (transformedRoom as any).booking = activeBooking;
  }
  return transformedRoom;
}

/**
 * Обновить комнату
 */
export async function updateRoom(id: string, updates: Partial<Room>): Promise<Room> {
  const updateData: any = {};
  
  if (updates.number !== undefined) updateData.number = updates.number;
  // hotelId не обновляется напрямую, так как это связь через relation
  // if (updates.hotelId !== undefined) updateData.hotelId = updates.hotelId;
  if (updates.name !== undefined) updateData.name = updates.name;
  if (updates.type !== undefined) updateData.type = updates.type as any;
  if (updates.capacity !== undefined) updateData.capacity = updates.capacity;
  if (updates.maxCapacity !== undefined) updateData.maxCapacity = updates.maxCapacity;
  if (updates.beds !== undefined) updateData.beds = updates.beds as any;
  if (updates.floor !== undefined) updateData.floor = transformFloorToPrisma(updates.floor) as any;
  if (updates.price !== undefined) updateData.price = updates.price;
  if (updates.position !== undefined) updateData.position = updates.position as any;
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
  let where: any = {};
  
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
 * Получить активное бронирование для комнаты
 */
export async function getActiveBookingForRoom(roomId: string): Promise<BookingInfo | null> {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  const booking = await prisma.booking.findFirst({
    where: {
      roomId,
      checkOut: {
        gte: today,
      },
    },
    orderBy: {
      bookedDate: 'desc',
    },
  });
  
  if (!booking) return null;
  
  return transformBooking(booking);
}

/**
 * Создать новое бронирование
 */
export async function createBooking(
  booking: Omit<BookingInfo, 'id'> & { id?: string }
): Promise<BookingInfo> {
  const bookingId = booking.id || `booking-${Date.now()}`;
  const newBooking = await prisma.booking.create({
    data: {
      id: bookingId,
      roomId: booking.roomId,
      bookedBy: booking.bookedBy,
      bookedDate: new Date(booking.bookedDate),
      email: booking.email,
      phone: booking.phone,
      checkIn: new Date(booking.checkIn),
      checkOut: new Date(booking.checkOut),
      guests: (booking.guests || []) as any,
      notes: booking.notes || null,
      isConfirmed: booking.isConfirmed || false,
      confirmedBy: booking.confirmedBy || null,
      confirmedDate: booking.confirmedDate ? new Date(booking.confirmedDate) : null,
      isPaid: booking.isPaid || false,
      paymentMethod: booking.paymentMethod as any || null,
      paymentDate: booking.paymentDate ? new Date(booking.paymentDate) : null,
      paidBy: booking.paidBy || null,
      amount: booking.amount || null,
    },
  });
  
  return transformBooking(newBooking);
}

/**
 * Обновить бронирование
 */
export async function updateBooking(
  id: string,
  updates: Partial<BookingInfo>
): Promise<BookingInfo> {
  const updateData: any = {};
  
  if (updates.roomId !== undefined) updateData.roomId = updates.roomId;
  if (updates.bookedBy !== undefined) updateData.bookedBy = updates.bookedBy;
  if (updates.bookedDate !== undefined) updateData.bookedDate = new Date(updates.bookedDate);
  if (updates.email !== undefined) updateData.email = updates.email;
  if (updates.phone !== undefined) updateData.phone = updates.phone;
  if (updates.checkIn !== undefined) updateData.checkIn = new Date(updates.checkIn);
  if (updates.checkOut !== undefined) updateData.checkOut = new Date(updates.checkOut);
      if (updates.guests !== undefined) updateData.guests = updates.guests as any;
  if (updates.notes !== undefined) updateData.notes = updates.notes;
  if (updates.isConfirmed !== undefined) updateData.isConfirmed = updates.isConfirmed;
  if (updates.confirmedBy !== undefined) updateData.confirmedBy = updates.confirmedBy;
  if (updates.confirmedDate !== undefined) updateData.confirmedDate = updates.confirmedDate ? new Date(updates.confirmedDate) : null;
  if (updates.isPaid !== undefined) updateData.isPaid = updates.isPaid;
  if (updates.paymentMethod !== undefined) updateData.paymentMethod = updates.paymentMethod as any;
  if (updates.paymentDate !== undefined) updateData.paymentDate = updates.paymentDate ? new Date(updates.paymentDate) : null;
  if (updates.paidBy !== undefined) updateData.paidBy = updates.paidBy;
  if (updates.amount !== undefined) updateData.amount = updates.amount;
  
  const updatedBooking = await prisma.booking.update({
    where: { id },
    data: updateData,
  });
  
  return transformBooking(updatedBooking);
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
      floor: transformFloorToPrisma(stairs.floor) as any,
      position: stairs.position as any,
      width: stairs.width,
      height: stairs.height,
      direction: stairs.direction as any,
      targetFloor: stairs.targetFloor ? transformFloorToPrisma(stairs.targetFloor) as any : null,
    },
  });
  
  return transformStairs(newStairs);
}

/**
 * Обновить лестницу
 */
export async function updateStairs(id: string, updates: Partial<Stairs>): Promise<Stairs> {
  const updateData: any = {};
  
  if (updates.hotelId !== undefined) updateData.hotelId = updates.hotelId;
      if (updates.floor !== undefined) updateData.floor = transformFloorToPrisma(updates.floor) as any;
      if (updates.position !== undefined) updateData.position = updates.position as any;
      if (updates.width !== undefined) updateData.width = updates.width;
  if (updates.height !== undefined) updateData.height = updates.height;
  if (updates.direction !== undefined) updateData.direction = updates.direction as any;
  if (updates.targetFloor !== undefined) updateData.targetFloor = updates.targetFloor ? transformFloorToPrisma(updates.targetFloor) as any : null;
  
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
    usedBy: i.usedBy || undefined,
    usedAt: i.usedAt?.toISOString() || undefined,
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
  const updateData: any = {};
  
  if (updates.used !== undefined) updateData.used = updates.used;
  if (updates.usedBy !== undefined) updateData.usedBy = updates.usedBy;
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
