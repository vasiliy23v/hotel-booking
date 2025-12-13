export interface Guest {
  name: string;
  email?: string;
  phone?: string;
  image?: string; // Путь к изображению гостя
}

export interface BookingInfo {
  id?: string;
  roomId: string;
  bookedBy: string;
  bookedDate: string;
  email?: string; // Опциональный email
  phone: string;
  checkIn: string;
  checkOut: string;
  guests?: Guest[];
  notes?: string;
  // Подтверждение бронирования
  isConfirmed?: boolean;
  confirmedBy?: string;
  confirmedDate?: string;
  // Оплата
  isPaid?: boolean;
  paymentMethod?: 'cash' | 'transfer'; // 'cash' - наличными, 'transfer' - переводом
  paymentDate?: string;
  paidBy?: string;
  amount?: number; // Сумма оплаты
}

export interface Room {
  id: string;
  number: string;
  hotelId: string;
  name: string | null;
  type: 'FZ' | 'DZ' | 'EZ' | 'MZ' | 'App' | 'COMMON';
  capacity: string;
  maxCapacity: number;
  beds: string[];
  floor: 'EG' | '1OG' | '2OG' | '3OG' | '4OG' | '5OG' | '6OG';
  price: number;
  booking?: BookingInfo; // Оставлено для обратной совместимости, но устарело - используйте bookings
  bookings?: BookingInfo[]; // Массив всех активных бронирований
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
  createdAt?: Date | string;
  updatedAt?: Date | string;
}

export interface Stairs {
  id: string;
  hotelId: string;
  floor: 'EG' | '1OG' | '2OG' | '3OG' | '4OG' | '5OG' | '6OG';
  position: { x: number; y: number };
  width: number;
  height: number;
  direction: 'up' | 'down' | 'both';
  targetFloor: 'EG' | '1OG' | '2OG' | '3OG' | '4OG' | '5OG' | '6OG' | null;
  createdAt?: Date | string;
  updatedAt?: Date | string;
}

export interface Hotel {
  id: string;
  name: string;
  address: string;
  description: string | null;
  floors: number | null;
  hasEGFloor: boolean;
  image: Buffer | string | null; // Может быть Buffer из БД или string из API
  displayOrder: number | null;
  createdAt?: Date | string;
  updatedAt?: Date | string;
}

export interface User {
  id: string;
  email: string | null; // Email может быть null
  name: string;
  password?: string | null;
  phone: string | null; // Телефон может быть null
  role: 'developer' | 'manager' | 'guest';
  isProfileComplete: boolean; // Флаг заполненности профиля
  createdAt: Date | string; // Дата регистрации
  updatedAt?: Date | string; // Дата обновления
}

export interface Statistics {
  totalRooms: number;
  availableRooms: number;
  bookedRooms: number;
  commonRooms?: number;
  totalGuests?: number;
  activeBookings?: number;
  revenue: number;
  amountToPay: number; // Сумма к оплате (неоплаченные бронирования)
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
  [key: string]: unknown; // Для дополнительных полей из API
}

export interface CashMonitoring {
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
}

export interface Invite {
  id: string;
  token: string; // Хэшированный токен
  createdBy: string; // ID пользователя, создавшего приглашение
  createdAt: Date | string; // Дата создания
  expiresAt: Date | string; // Дата истечения
  used: boolean; // Использован ли токен
  name: string; // Имя пользователя, для которого создано приглашение
  usedBy: string | null; // ID пользователя, использовавшего токен
  usedAt: Date | string | null; // Дата использования
}

export interface Feedback {
  id: string;
  userName: string;
  userEmail: string | null;
  userRole: string;
  comment: string;
  screenshot: string | null;
  userAgent: string | null;
  isProcessed: boolean;
  createdAt: Date | string;
  updatedAt: Date | string;
}

export interface RegistrationToken {
  id: string;
  token: string; // Хэшированный токен
  originalToken?: string; // Оригинальный токен для формирования ссылки
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface BookingDateRange {
  id: string;
  name: string | null; // Название диапазона (например, "Фестиваль 2024")
  startDate: string | Date; // Дата начала в формате YYYY-MM-DD или Date
  endDate: string | Date; // Дата окончания в формате YYYY-MM-DD или Date
  isActive: boolean; // Активен ли диапазон
  createdAt: string | Date;
  updatedAt: string | Date;
}



