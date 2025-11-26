// ============================================
// УТИЛИТЫ ДЛЯ РАБОТЫ С ДАННЫМИ
// ============================================

import fs from 'fs';
import path from 'path';
import type { User, Room, Hotel, Stairs, BookingInfo } from '@/types';

const DATA_FILE = path.join(process.cwd(), 'data', 'data.json');

// Инициализация данных
export const initData = () => {
  const dataDir = path.join(process.cwd(), 'data');
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
  }

  if (!fs.existsSync(DATA_FILE)) {
    const defaultData = {
      users: [
        {
          id: 'admin-1',
          email: 'admin@hotel.com',
          name: 'Admin',
          password: 'admin123',
          role: 'manager' as const
        }
      ],
      rooms: [],
      stairs: [],
      hotels: [
        {
          id: 'hotel-1',
          name: 'Grand Hotel Düsseldorf',
          address: 'Musterstraße 1, 40213 Düsseldorf',
          description: 'Современный отель в центре города',
          floors: 3
        },
        {
          id: 'hotel-2',
          name: 'Riverside Hotel',
          address: 'Rheinufer 10, 40213 Düsseldorf',
          description: 'Отель с видом на Рейн',
          floors: 3
        }
      ],
      bookings: [],
      invites: []
    };
    fs.writeFileSync(DATA_FILE, JSON.stringify(defaultData, null, 2));
  }
};

// Чтение данных
export const readData = () => {
  try {
    initData();
    const data = JSON.parse(fs.readFileSync(DATA_FILE, 'utf-8'));
    // Обратная совместимость: добавляем invites, если его нет
    if (!data.invites) {
      data.invites = [];
      writeData(data);
    }
    return data;
  } catch (error) {
    console.error('Error reading data:', error);
    return { users: [], rooms: [], stairs: [], hotels: [], bookings: [], invites: [] };
  }
};

// Запись данных
export const writeData = (data: any) => {
  try {
    fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));
    return true;
  } catch (error) {
    console.error('Error writing data:', error);
    return false;
  }
};

