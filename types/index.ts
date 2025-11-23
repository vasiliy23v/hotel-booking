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
  email: string;
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
  name?: string;
  type: 'FZ' | 'DZ' | 'EZ' | 'COMMON';
  capacity: string;
  maxCapacity: number;
  beds: string[];
  floor: 'EG' | '1OG' | '2OG';
  price: number;
  booking?: BookingInfo;
  position: { x: number; y: number };
  width?: number;
  height?: number;
  isCommon?: boolean;
  zIndex?: number;
  description?: string;
}

export interface Stairs {
  id: string;
  hotelId: string;
  floor: 'EG' | '1OG' | '2OG';
  position: { x: number; y: number };
  width: number;
  height: number;
  direction: 'up' | 'down' | 'both';
  targetFloor?: 'EG' | '1OG' | '2OG';
}

export interface Hotel {
  id: string;
  name: string;
  address: string;
  description?: string;
  floors?: number; // Количество этажей
  image?: string; // Путь к изображению отеля
}

export interface User {
  id?: string;
  email: string;
  name: string;
  password?: string;
  phone?: string;
  role: 'manager' | 'guest';
}

export interface Statistics {
  totalRooms: number;
  availableRooms: number;
  bookedRooms: number;
  revenue: number;
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



