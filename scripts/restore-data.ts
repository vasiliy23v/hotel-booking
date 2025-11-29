import * as fs from 'fs';
import * as path from 'path';
import * as dotenv from 'dotenv';
import { PrismaClient } from '../lib/generated/prisma';
import { PrismaNeon } from '@prisma/adapter-neon';
import { Pool } from '@neondatabase/serverless';

// Загружаем переменные окружения
dotenv.config({ path: '.env.local' });

async function restoreData() {
  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) {
    throw new Error('DATABASE_URL не установлена в .env.local');
  }

  const pool = new Pool({ connectionString });
  const adapter = new PrismaNeon(pool);
  const prisma = new PrismaClient({ adapter });

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
          await prisma.user.upsert({
            where: { id: user.id },
            update: {
              email: user.email || null,
              name: user.name,
              password: user.password || null,
              phone: user.phone || null,
              role: user.role,
            },
            create: {
              id: user.id,
              email: user.email || null,
              name: user.name,
              password: user.password || null,
              phone: user.phone || null,
              role: user.role,
            },
          });
        } catch (error: any) {
          console.error(`Ошибка при восстановлении пользователя ${user.id}:`, error?.message || error);
        }
      }
      console.log('Пользователи восстановлены');
    }

    // Восстанавливаем отели
    if (data.hotels && data.hotels.length > 0) {
      console.log(`Восстанавливаю ${data.hotels.length} отелей...`);
      for (const hotel of data.hotels) {
        try {
          await prisma.hotel.upsert({
            where: { id: hotel.id },
            update: {
              name: hotel.name,
              address: hotel.address,
              description: hotel.description || null,
              floors: hotel.floors || null,
              image: hotel.image || null,
            },
            create: {
              id: hotel.id,
              name: hotel.name,
              address: hotel.address,
              description: hotel.description || null,
              floors: hotel.floors || null,
              image: hotel.image || null,
            },
          });
        } catch (error) {
          console.error(`Ошибка при восстановлении отеля ${hotel.id}:`, error);
        }
      }
      console.log('Отели восстановлены');
    }

    // Восстанавливаем комнаты
    if (data.rooms && data.rooms.length > 0) {
      console.log(`Восстанавливаю ${data.rooms.length} комнат...`);
      for (const room of data.rooms) {
        try {
          const floor = room.floor === '1OG' ? 'oneOG' : room.floor === '2OG' ? 'twoOG' : 'EG';
          await prisma.room.upsert({
            where: { id: room.id },
            update: {
              number: room.number,
              hotelId: room.hotelId,
              name: room.name || null,
              type: room.type,
              capacity: room.capacity,
              maxCapacity: room.maxCapacity,
              beds: room.beds || [],
              floor: floor,
              price: room.price || 0,
              position: room.position || { x: 0, y: 0 },
              width: room.width || null,
              height: room.height || null,
              isCommon: room.isCommon || false,
              zIndex: room.zIndex || 1,
              description: room.description || null,
              hasShower: room.hasShower || false,
              hasToilet: room.hasToilet || false,
            },
            create: {
              id: room.id,
              number: room.number,
              hotelId: room.hotelId,
              name: room.name || null,
              type: room.type,
              capacity: room.capacity,
              maxCapacity: room.maxCapacity,
              beds: room.beds || [],
              floor: floor,
              price: room.price || 0,
              position: room.position || { x: 0, y: 0 },
              width: room.width || null,
              height: room.height || null,
              isCommon: room.isCommon || false,
              zIndex: room.zIndex || 1,
              description: room.description || null,
              hasShower: room.hasShower || false,
              hasToilet: room.hasToilet || false,
            },
          });
        } catch (error) {
          console.error(`Ошибка при восстановлении комнаты ${room.id}:`, error);
        }
      }
      console.log('Комнаты восстановлены');
    }

    // Восстанавливаем лестницы
    if (data.stairs && data.stairs.length > 0) {
      console.log(`Восстанавливаю ${data.stairs.length} лестниц...`);
      for (const stairs of data.stairs) {
        try {
          const floor = stairs.floor === '1OG' ? 'oneOG' : stairs.floor === '2OG' ? 'twoOG' : 'EG';
          const targetFloor = stairs.targetFloor 
            ? (stairs.targetFloor === '1OG' ? 'oneOG' : stairs.targetFloor === '2OG' ? 'twoOG' : 'EG')
            : null;
          await prisma.stairs.upsert({
            where: { id: stairs.id },
            update: {
              hotelId: stairs.hotelId,
              floor: floor,
              position: stairs.position || { x: 0, y: 0 },
              width: stairs.width,
              height: stairs.height,
              direction: stairs.direction,
              targetFloor: targetFloor,
            },
            create: {
              id: stairs.id,
              hotelId: stairs.hotelId,
              floor: floor,
              position: stairs.position || { x: 0, y: 0 },
              width: stairs.width,
              height: stairs.height,
              direction: stairs.direction,
              targetFloor: targetFloor,
            },
          });
        } catch (error) {
          console.error(`Ошибка при восстановлении лестницы ${stairs.id}:`, error);
        }
      }
      console.log('Лестницы восстановлены');
    }

    // Восстанавливаем бронирования
    if (data.bookings && data.bookings.length > 0) {
      console.log(`Восстанавливаю ${data.bookings.length} бронирований...`);
      for (const booking of data.bookings) {
        try {
          await prisma.booking.upsert({
            where: { id: booking.id },
            update: {
              roomId: booking.roomId,
              bookedBy: booking.bookedBy,
              bookedDate: new Date(booking.bookedDate),
              email: booking.email,
              phone: booking.phone,
              checkIn: new Date(booking.checkIn),
              checkOut: new Date(booking.checkOut),
              guests: booking.guests || [],
              notes: booking.notes || null,
              isConfirmed: booking.isConfirmed || false,
              confirmedBy: booking.confirmedBy || null,
              confirmedDate: booking.confirmedDate ? new Date(booking.confirmedDate) : null,
              isPaid: booking.isPaid || false,
              paymentMethod: booking.paymentMethod || null,
              paymentDate: booking.paymentDate ? new Date(booking.paymentDate) : null,
              paidBy: booking.paidBy || null,
              amount: booking.amount ? parseFloat(booking.amount.toString()) : null,
            },
            create: {
              id: booking.id,
              roomId: booking.roomId,
              bookedBy: booking.bookedBy,
              bookedDate: new Date(booking.bookedDate),
              email: booking.email,
              phone: booking.phone,
              checkIn: new Date(booking.checkIn),
              checkOut: new Date(booking.checkOut),
              guests: booking.guests || [],
              notes: booking.notes || null,
              isConfirmed: booking.isConfirmed || false,
              confirmedBy: booking.confirmedBy || null,
              confirmedDate: booking.confirmedDate ? new Date(booking.confirmedDate) : null,
              isPaid: booking.isPaid || false,
              paymentMethod: booking.paymentMethod || null,
              paymentDate: booking.paymentDate ? new Date(booking.paymentDate) : null,
              paidBy: booking.paidBy || null,
              amount: booking.amount ? parseFloat(booking.amount.toString()) : null,
            },
          });
        } catch (error) {
          console.error(`Ошибка при восстановлении бронирования ${booking.id}:`, error);
        }
      }
      console.log('Бронирования восстановлены');
    }

    // Восстанавливаем приглашения
    if (data.invites && data.invites.length > 0) {
      console.log(`Восстанавливаю ${data.invites.length} приглашений...`);
      for (const invite of data.invites) {
        try {
          await prisma.invite.upsert({
            where: { id: invite.id },
            update: {
              token: invite.token,
              createdBy: invite.createdBy,
              createdAt: new Date(invite.createdAt),
              expiresAt: new Date(invite.expiresAt),
              used: invite.used || false,
              name: invite.name,
              usedBy: invite.usedBy || null,
              usedAt: invite.usedAt ? new Date(invite.usedAt) : null,
            },
            create: {
              id: invite.id,
              token: invite.token,
              createdBy: invite.createdBy,
              createdAt: new Date(invite.createdAt),
              expiresAt: new Date(invite.expiresAt),
              used: invite.used || false,
              name: invite.name,
              usedBy: invite.usedBy || null,
              usedAt: invite.usedAt ? new Date(invite.usedAt) : null,
            },
          });
        } catch (error) {
          console.error(`Ошибка при восстановлении приглашения ${invite.id}:`, error);
        }
      }
      console.log('Приглашения восстановлены');
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
          await prisma.feedback.create({
            data: {
              userName: feedbackData.userName,
              userEmail: feedbackData.userEmail || null,
              userRole: feedbackData.userRole,
              comment: feedbackData.comment,
              screenshot: feedbackData.screenshot || null,
              userAgent: feedbackData.userAgent || null,
            },
          });
        } catch (error) {
          console.error(`Ошибка при восстановлении отзыва из ${file}:`, error);
        }
      }
      console.log('Отзывы восстановлены');
    }

    console.log('✅ Все данные успешно восстановлены!');
  } catch (error) {
    console.error('Ошибка при восстановлении данных:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
    await pool.end();
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

