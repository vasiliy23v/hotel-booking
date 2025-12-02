import { NextRequest, NextResponse } from 'next/server';
import { createUser, createHotel, createRoom, createStairs, createBooking, createInvite, createFeedback } from '@/lib/db';
import * as fs from 'fs';
import * as path from 'path';

export async function POST(request: NextRequest) {
  try {
    console.log('Начинаю восстановление данных...');

    // Читаем файл с данными
    const dataPath = path.join(process.cwd(), 'data', 'data.json');
    const dataContent = fs.readFileSync(dataPath, 'utf-8');
    const data = JSON.parse(dataContent);

    const results = {
      users: { success: 0, failed: 0 },
      hotels: { success: 0, failed: 0 },
      rooms: { success: 0, failed: 0 },
      stairs: { success: 0, failed: 0 },
      bookings: { success: 0, failed: 0 },
      invites: { success: 0, failed: 0 },
      feedback: { success: 0, failed: 0 },
    };

    // Восстанавливаем пользователей
    if (data.users && data.users.length > 0) {
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
          results.users.success++;
        } catch (error: any) {
          results.users.failed++;
          console.error(`Ошибка при восстановлении пользователя ${user.id}:`, error?.message);
        }
      }
    }

    // Восстанавливаем отели
    if (data.hotels && data.hotels.length > 0) {
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
          results.hotels.success++;
        } catch (error: any) {
          results.hotels.failed++;
          console.error(`Ошибка при восстановлении отеля ${hotel.id}:`, error?.message);
        }
      }
    }

    // Восстанавливаем комнаты
    if (data.rooms && data.rooms.length > 0) {
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
          results.rooms.success++;
        } catch (error: any) {
          results.rooms.failed++;
          console.error(`Ошибка при восстановлении комнаты ${room.id}:`, error?.message);
        }
      }
    }

    // Восстанавливаем лестницы
    if (data.stairs && data.stairs.length > 0) {
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
          results.stairs.success++;
        } catch (error: any) {
          results.stairs.failed++;
          console.error(`Ошибка при восстановлении лестницы ${stairs.id}:`, error?.message);
        }
      }
    }

    // Восстанавливаем бронирования
    if (data.bookings && data.bookings.length > 0) {
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
          results.bookings.success++;
        } catch (error: any) {
          results.bookings.failed++;
          console.error(`Ошибка при восстановлении бронирования ${booking.id}:`, error?.message);
        }
      }
    }

    // Восстанавливаем приглашения
    if (data.invites && data.invites.length > 0) {
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
          results.invites.success++;
        } catch (error: any) {
          results.invites.failed++;
          console.error(`Ошибка при восстановлении приглашения ${invite.id}:`, error?.message);
        }
      }
    }

    // Восстанавливаем отзывы из JSON файлов
    const feedbackDir = path.join(process.cwd(), 'data', 'feedback');
    if (fs.existsSync(feedbackDir)) {
      const feedbackFiles = fs.readdirSync(feedbackDir).filter(f => f.endsWith('.json'));
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
          results.feedback.success++;
        } catch (error: any) {
          results.feedback.failed++;
          console.error(`Ошибка при восстановлении отзыва из ${file}:`, error?.message);
        }
      }
    }

    return NextResponse.json({
      success: true,
      message: 'Данные восстановлены',
      results,
    });
  } catch (error: unknown) {
    console.error('Error in POST /api/restore-data:', error);
    const errorMessage = error instanceof Error ? error.message : 'Ошибка при восстановлении данных';
    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    );
  }
}


