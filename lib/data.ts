// ============================================
// УТИЛИТЫ ДЛЯ РАБОТЫ С ДАННЫМИ
// ============================================

import fs from 'fs';
import path from 'path';

// На Vercel используем /tmp для записи, иначе data директорию
const DATA_DIR = process.env.VERCEL 
  ? '/tmp/data' 
  : path.join(process.cwd(), 'data');
const DATA_FILE = path.join(DATA_DIR, 'data.json');

// Инициализация данных
export const initData = () => {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }

  if (!fs.existsSync(DATA_FILE)) {
    // На Vercel пытаемся скопировать исходный файл из репозитория
    const sourceFile = path.join(process.cwd(), 'data', 'data.json');
    if (fs.existsSync(sourceFile)) {
      try {
        fs.copyFileSync(sourceFile, DATA_FILE);
        return; // Файл скопирован, выходим
      } catch (error) {
        console.warn('Не удалось скопировать исходный файл данных:', error);
      }
    }
    
    // Если исходный файл не найден, создаем дефолтные данные
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
export const writeData = (data: unknown) => {
  try {
    // Проверяем, доступна ли файловая система для записи
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    
    const jsonData = JSON.stringify(data, null, 2);
    fs.writeFileSync(DATA_FILE, jsonData, 'utf-8');
    
    // Проверяем, что данные действительно записались
    const verifyData = fs.readFileSync(DATA_FILE, 'utf-8');
    if (verifyData !== jsonData) {
      console.error('Данные не совпадают после записи');
      return false;
    }
    
    return true;
  } catch (error: unknown) {
    const err = error as { message?: string; code?: string };
    console.error('Error writing data:', error);
    console.error('Error details:', {
      message: err.message,
      code: err.code,
      path: DATA_FILE,
      cwd: process.cwd(),
      isVercel: !!process.env.VERCEL
    });
    return false;
  }
};

