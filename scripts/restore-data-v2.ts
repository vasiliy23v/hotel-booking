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
            email: user.email || null,
            name: user.name,
            password: user.password || null,
            phone: user.phone || null,
            role: user.role,
            isProfileComplete: user.isProfileComplete ?? true,
            createdAt: user.createdAt || new Date().toISOString(),
          });
          console.log(`✓ Пользователь ${user.name} восстановлен`);
        } catch (error: unknown) {
          const errorMessage = error instanceof Error ? error.message : String(error);
          console.error(`✗ Ошибка при восстановлении пользователя ${user.id}:`, errorMessage);
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
            description: hotel.description || null,
            floors: hotel.floors || null,
            hasEGFloor: hotel.hasEGFloor ?? true,
            image: hotel.image || null,
            displayOrder: hotel.displayOrder || null,
          });
          console.log(`✓ Отель ${hotel.name} восстановлен`);
        } catch (error: unknown) {
          const errorMessage = error instanceof Error ? error.message : String(error);
          console.error(`✗ Ошибка при восстановлении отеля ${hotel.id}:`, errorMessage);
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
            name: room.name || null,
            type: room.type,
            capacity: room.capacity,
            maxCapacity: room.maxCapacity,
            beds: room.beds || [],
            floor: room.floor,
            price: room.price || 0,
            position: room.position || { x: 0, y: 0 },
            width: room.width || null,
            height: room.height || null,
            isCommon: room.isCommon || false,
            zIndex: room.zIndex || 1,
            description: room.description || null,
            hasShower: room.hasShower || false,
            hasToilet: room.hasToilet || false,
            pricePerPerson: room.pricePerPerson || false,
            textVertical: room.textVertical || false,
          });
          console.log(`✓ Комната ${room.number} восстановлена`);
        } catch (error: unknown) {
          const errorMessage = error instanceof Error ? error.message : String(error);
          console.error(`✗ Ошибка при восстановлении комнаты ${room.id}:`, errorMessage);
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
        } catch (error: unknown) {
          const errorMessage = error instanceof Error ? error.message : String(error);
          console.error(`✗ Ошибка при восстановлении лестницы ${stairs.id}:`, errorMessage);
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
        } catch (error: unknown) {
          const errorMessage = error instanceof Error ? error.message : String(error);
          console.error(`✗ Ошибка при восстановлении бронирования ${booking.id}:`, errorMessage);
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
        } catch (error: unknown) {
          const errorMessage = error instanceof Error ? error.message : String(error);
          console.error(`✗ Ошибка при восстановлении приглашения ${invite.id}:`, errorMessage);
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
            userEmail: feedbackData.userEmail || null,
            userRole: feedbackData.userRole,
            comment: feedbackData.comment,
            screenshot: feedbackData.screenshot || null,
            userAgent: feedbackData.userAgent || null,
            isProcessed: feedbackData.isProcessed || false,
          });
          console.log(`✓ Отзыв из ${file} восстановлен`);
        } catch (error: unknown) {
          const errorMessage = error instanceof Error ? error.message : String(error);
          console.error(`✗ Ошибка при восстановлении отзыва из ${file}:`, errorMessage);
        }
      }
      console.log('Отзывы восстановлены\n');
    }

    console.log('✅ Все данные успешно восстановлены!');
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    console.error('Ошибка при восстановлении данных:', errorMessage);
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



