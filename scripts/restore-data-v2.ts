import * as fs from 'fs';
import * as path from 'path';
import * as dotenv from 'dotenv';

// Загружаем переменные окружения
dotenv.config({ path: '.env.local' });

import { createUser, createHotel, createRoom, createStairs, createBooking, createInvite, createFeedback } from '../lib/db';

async function restoreData() {
  try {
    console.log('Начинаю восстановление данных...');

    // Читаем файл с данными
    const dataPath = path.join(process.cwd(), 'data', 'data.json');
    const dataContent = fs.readFileSync(dataPath, 'utf-8');
    const data = JSON.parse(dataContent);

    console.log('Данные загружены из файла');

    // Восстанавливаем пользователей
    if (data.users && data.users.length > 0) {
      console.log(`Восстанавливаю ${data.users.length} пользователей...`);
      for (const user of data.users) {
        try {
          await createUser({
            id: user.id,
            email: user.email || undefined,
            name: user.name,
            password: user.password || undefined,
            phone: user.phone || undefined,
            role: user.role,
          });
          console.log(`✓ Пользователь ${user.name} восстановлен`);
        } catch (error: any) {
          console.error(`✗ Ошибка при восстановлении пользователя ${user.id}:`, error?.message || error);
        }
      }
      console.log('Пользователи восстановлены\n');
    }

    // Восстанавливаем отели
    if (data.hotels && data.hotels.length > 0) {
      console.log(`Восстанавливаю ${data.hotels.length} отелей...`);
      for (const hotel of data.hotels) {
        try {
          await createHotel({
            id: hotel.id,
            name: hotel.name,
            address: hotel.address,
            description: hotel.description || undefined,
            floors: hotel.floors || undefined,
            image: hotel.image || undefined,
          });
          console.log(`✓ Отель ${hotel.name} восстановлен`);
        } catch (error: any) {
          console.error(`✗ Ошибка при восстановлении отеля ${hotel.id}:`, error?.message || error);
        }
      }
      console.log('Отели восстановлены\n');
    }

    // Восстанавливаем комнаты
    if (data.rooms && data.rooms.length > 0) {
      console.log(`Восстанавливаю ${data.rooms.length} комнат...`);
      for (const room of data.rooms) {
        try {
          await createRoom({
            id: room.id,
            number: room.number,
            hotelId: room.hotelId,
            name: room.name || undefined,
            type: room.type,
            capacity: room.capacity,
            maxCapacity: room.maxCapacity,
            beds: room.beds || [],
            floor: room.floor,
            price: room.price || 0,
            position: room.position || { x: 0, y: 0 },
            width: room.width || undefined,
            height: room.height || undefined,
            isCommon: room.isCommon || false,
            zIndex: room.zIndex || 1,
            description: room.description || undefined,
            hasShower: room.hasShower || false,
            hasToilet: room.hasToilet || false,
          });
          console.log(`✓ Комната ${room.number} восстановлена`);
        } catch (error: any) {
          console.error(`✗ Ошибка при восстановлении комнаты ${room.id}:`, error?.message || error);
        }
      }
      console.log('Комнаты восстановлены\n');
    }

    // Восстанавливаем лестницы
    if (data.stairs && data.stairs.length > 0) {
      console.log(`Восстанавливаю ${data.stairs.length} лестниц...`);
      for (const stairs of data.stairs) {
        try {
          await createStairs({
            id: stairs.id,
            hotelId: stairs.hotelId,
            floor: stairs.floor,
            position: stairs.position || { x: 0, y: 0 },
            width: stairs.width,
            height: stairs.height,
            direction: stairs.direction,
            targetFloor: stairs.targetFloor || undefined,
          });
          console.log(`✓ Лестница ${stairs.id} восстановлена`);
        } catch (error: any) {
          console.error(`✗ Ошибка при восстановлении лестницы ${stairs.id}:`, error?.message || error);
        }
      }
      console.log('Лестницы восстановлены\n');
    }

    // Восстанавливаем бронирования
    if (data.bookings && data.bookings.length > 0) {
      console.log(`Восстанавливаю ${data.bookings.length} бронирований...`);
      for (const booking of data.bookings) {
        try {
          await createBooking({
            id: booking.id,
            roomId: booking.roomId,
            bookedBy: booking.bookedBy,
            bookedDate: booking.bookedDate,
            email: booking.email,
            phone: booking.phone,
            checkIn: booking.checkIn,
            checkOut: booking.checkOut,
            guests: booking.guests || [],
            notes: booking.notes || undefined,
            isConfirmed: booking.isConfirmed || false,
            confirmedBy: booking.confirmedBy || undefined,
            confirmedDate: booking.confirmedDate || undefined,
            isPaid: booking.isPaid || false,
            paymentMethod: booking.paymentMethod || undefined,
            paymentDate: booking.paymentDate || undefined,
            paidBy: booking.paidBy || undefined,
            amount: booking.amount || undefined,
          });
          console.log(`✓ Бронирование ${booking.id} восстановлено`);
        } catch (error: any) {
          console.error(`✗ Ошибка при восстановлении бронирования ${booking.id}:`, error?.message || error);
        }
      }
      console.log('Бронирования восстановлены\n');
    }

    // Восстанавливаем приглашения
    if (data.invites && data.invites.length > 0) {
      console.log(`Восстанавливаю ${data.invites.length} приглашений...`);
      for (const invite of data.invites) {
        try {
          await createInvite({
            id: invite.id,
            token: invite.token,
            createdBy: invite.createdBy,
            createdAt: invite.createdAt,
            expiresAt: invite.expiresAt,
            used: invite.used || false,
            name: invite.name,
            usedBy: invite.usedBy || undefined,
            usedAt: invite.usedAt || undefined,
          });
          console.log(`✓ Приглашение ${invite.name} восстановлено`);
        } catch (error: any) {
          console.error(`✗ Ошибка при восстановлении приглашения ${invite.id}:`, error?.message || error);
        }
      }
      console.log('Приглашения восстановлены\n');
    }

    // Восстанавливаем отзывы из JSON файлов
    const feedbackDir = path.join(process.cwd(), 'data', 'feedback');
    if (fs.existsSync(feedbackDir)) {
      const feedbackFiles = fs.readdirSync(feedbackDir).filter(f => f.endsWith('.json'));
      console.log(`Восстанавливаю ${feedbackFiles.length} отзывов...`);
      for (const file of feedbackFiles) {
        try {
          const filePath = path.join(feedbackDir, file);
          const feedbackData = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
          await createFeedback({
            userName: feedbackData.userName,
            userEmail: feedbackData.userEmail || undefined,
            userRole: feedbackData.userRole,
            comment: feedbackData.comment,
            screenshot: feedbackData.screenshot || undefined,
            userAgent: feedbackData.userAgent || undefined,
          });
          console.log(`✓ Отзыв из ${file} восстановлен`);
        } catch (error: any) {
          console.error(`✗ Ошибка при восстановлении отзыва из ${file}:`, error?.message || error);
        }
      }
      console.log('Отзывы восстановлены\n');
    }

    console.log('✅ Все данные успешно восстановлены!');
  } catch (error: any) {
    console.error('Ошибка при восстановлении данных:', error?.message || error);
    throw error;
  }
}

restoreData()
  .then(() => {
    console.log('Восстановление завершено');
    process.exit(0);
  })
  .catch((error) => {
    console.error('Критическая ошибка:', error);
    process.exit(1);
  });

