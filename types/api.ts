/**
 * Типы для API запросов и ответов
 */

import type { $Enums } from '../lib/generated/prisma';

type UserRole = $Enums.UserRole;
type RoomType = $Enums.RoomType;
type FloorType = $Enums.FloorType;
type PaymentMethod = $Enums.PaymentMethod;
type StairsDirection = $Enums.StairsDirection;
type LogStatus = $Enums.LogStatus;

// ============================================
// Базовые типы
// ============================================

export type User = {
  id: string;
  email: string | null;
  name: string;
  password?: string | null;
  phone: string | null;
  role: UserRole;
  isProfileComplete: boolean;
  createdAt: Date;
  updatedAt: Date;
};

export type Hotel = {
  id: string;
  name: string;
  address: string;
  description: string | null;
  floors: number | null;
  hasEGFloor: boolean;
  image: Buffer | null;
  displayOrder: number | null;
  createdAt: Date;
  updatedAt: Date;
};

export type Room = {
  id: string;
  number: string;
  hotelId: string;
  name: string | null;
  type: RoomType;
  capacity: string;
  maxCapacity: number;
  beds: string[];
  floor: FloorType;
  price: number;
  position: { x: number; y: number };
  width: number | null;
  height: number | null;
  isCommon: boolean;
  zIndex: number;
  description: string | null;
  hasShower: boolean;
  hasToilet: boolean;
  pricePerPerson: boolean;
  textVertical: boolean;
  createdAt: Date;
  updatedAt: Date;
};

export type Booking = {
  id: string;
  roomId: string;
  bookedBy: string;
  bookedDate: Date;
  email: string | null;
  phone: string;
  checkIn: Date;
  checkOut: Date;
  guests: Array<{ name: string; age?: number }>;
  notes: string | null;
  isConfirmed: boolean;
  confirmedBy: string | null;
  confirmedDate: Date | null;
  isPaid: boolean;
  paymentMethod: PaymentMethod | null;
  paymentDate: Date | null;
  paidBy: string | null;
  amount: number | null;
  createdAt: Date;
  updatedAt: Date;
};

export type Stairs = {
  id: string;
  hotelId: string;
  floor: FloorType;
  position: { x: number; y: number };
  width: number;
  height: number;
  direction: StairsDirection;
  targetFloor: FloorType | null;
  createdAt: Date;
  updatedAt: Date;
};

export type Invite = {
  id: string;
  token: string;
  createdBy: string;
  createdAt: Date;
  expiresAt: Date;
  used: boolean;
  name: string;
  usedBy: string | null;
  usedAt: Date | null;
};

export type CreateInviteResponse = Invite & {
  inviteUrl?: string;
};

export type Feedback = {
  id: string;
  userName: string;
  userEmail: string | null;
  userRole: string;
  comment: string;
  screenshot: string | null;
  userAgent: string | null;
  isProcessed: boolean;
  createdAt: Date;
  updatedAt: Date;
};

export type RegistrationToken = {
  id: string;
  token: string;
  originalToken: string | null;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
  registrationUrl?: string;
  urlUnavailable?: boolean;
};

export type BookingDateRange = {
  id: string;
  name: string | null;
  startDate: Date;
  endDate: Date;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
};

export type ActivityLog = {
  id: string;
  userId: string | null;
  userName: string;
  userRole: string | null;
  action: string;
  entity: string;
  entityId: string | null;
  details: Record<string, unknown> | null;
  status: LogStatus;
  errorMessage: string | null;
  ipAddress: string | null;
  userAgent: string | null;
  duration: number | null;
  createdAt: Date;
};

// ============================================
// Типы для создания/обновления
// ============================================

export type CreateUserInput = {
  email?: string;
  name: string;
  password?: string;
  phone?: string;
  role: UserRole;
  inviteToken?: string;
  directCreate?: boolean;
};

export type UpdateUserInput = Partial<Omit<CreateUserInput, 'role'>> & {
  isProfileComplete?: boolean;
};

export type CreateHotelInput = {
  name: string;
  address: string;
  description?: string;
  floors?: number;
  hasEGFloor?: boolean;
  image?: Buffer | string; // Может быть Buffer или base64 строка (data URL)
  displayOrder?: number;
};

export type UpdateHotelInput = Partial<CreateHotelInput>;

export type CreateRoomInput = {
  number: string;
  hotelId: string;
  name?: string;
  type: RoomType;
  capacity: string;
  maxCapacity: number;
  beds: string[];
  floor: FloorType;
  price: number;
  position?: { x: number; y: number };
  width?: number;
  height?: number;
  isCommon?: boolean;
  zIndex?: number;
  description?: string;
  hasShower?: boolean;
  hasToilet?: boolean;
  pricePerPerson?: boolean;
  textVertical?: boolean;
};

export type UpdateRoomInput = Partial<CreateRoomInput>;

export type CreateBookingInput = {
  roomId: string;
  bookedBy: string;
  email?: string;
  phone: string;
  checkIn: Date | string;
  checkOut: Date | string;
  guests: Array<{ name: string; age?: number }>;
  notes?: string;
};

export type UpdateBookingInput = Partial<Omit<CreateBookingInput, 'roomId' | 'bookedBy'>> & {
  isConfirmed?: boolean;
  confirmedBy?: string;
  confirmedDate?: Date | string;
  isPaid?: boolean;
  paymentMethod?: PaymentMethod;
  paymentDate?: Date | string;
  paidBy?: string;
  amount?: number;
};

export type CreateStairsInput = {
  hotelId: string;
  floor: FloorType;
  position?: { x: number; y: number };
  width: number;
  height: number;
  direction: StairsDirection;
  targetFloor?: FloorType;
};

export type UpdateStairsInput = Partial<CreateStairsInput>;

export type CreateInviteInput = {
  name: string;
  expiresInDays?: number;
  createdBy?: string;
};

export type CreateBookingDateRangeInput = {
  name?: string;
  startDate: Date | string;
  endDate: Date | string;
  isActive?: boolean;
};

export type UpdateBookingDateRangeInput = Partial<CreateBookingDateRangeInput>;

// ============================================
// Типы для ответов API
// ============================================

export type ApiResponse<T> = T;

export type ApiError = {
  error: string;
  message?: string;
  details?: Record<string, unknown>;
};

export type BookingStats = {
  unconfirmed: number;
  unpaid: number;
};

export type RoomsAvailabilityResponse = Record<string, boolean>;

export type StatisticsResponse = {
  totalRooms: number;
  availableRooms: number;
  bookedRooms: number;
  commonRooms?: number;
  totalGuests?: number;
  activeBookings?: number;
  revenue: number;
  amountToPay: number;
  roomsByType?: {
    FZ: number;
    DZ: number;
    EZ: number;
    MZ: number;
    App: number;
    COMMON: number;
  };
  roomsByFloor?: {
    EG: number;
    '1OG': number;
    '2OG': number;
    [key: string]: number;
  };
  [key: string]: unknown;
};

export type CashMonitoringResponse = {
  totalCash: number;
  cashToday: number;
  cashThisWeek: number;
  cashThisMonth: number;
  recentCashPayments: Array<{
    bookingId: string;
    amount: number;
    date: string;
    bookedBy: string;
    roomNumber: string;
  }>;
  [key: string]: unknown;
};

// ============================================
// Типы для логирования
// ============================================

export type LogActivityInput = {
  userId?: string;
  userName: string;
  userRole?: string;
  action: string;
  entity: string;
  entityId?: string;
  details?: Record<string, unknown>;
  status: LogStatus;
  errorMessage?: string;
  duration?: number;
};

