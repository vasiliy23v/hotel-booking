import { NextResponse, NextRequest } from 'next/server';
import { createUser, createHotel, createRoom, createStairs, createBooking, createInvite, createFeedback } from '@/lib/db';
import * as fs from 'fs';
import * as path from 'path';
import { logActivity } from '@/lib/logger';

export async function POST(request: NextRequest) {
  const startTime = Date.now();
  
  try {
    console.log('Начинаю восстановление данных...');
    
    // Получаем IP адрес и User-Agent из запроса
    const ipAddress = request.headers.get('x-forwarded-for') || 
                      request.headers.get('x-real-ip') || 
                      'unknown';
    const userAgent = request.headers.get('user-agent') || 'unknown';

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
            email: user.email || null,
            name: user.name,
            password: user.password || null,
            phone: user.phone || null,
            role: user.role,
            isProfileComplete: user.isProfileComplete ?? false,
            createdAt: user.createdAt ? new Date(user.createdAt) : new Date(),
          });
          results.users.success++;
        } catch (error: unknown) {
          results.users.failed++;
          const errorMessage = error instanceof Error ? error.message : 'Неизвестная ошибка';
          console.error(`Ошибка при восстановлении пользователя ${user.id}:`, errorMessage);
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
            description: hotel.description || null,
            floors: hotel.floors || null,
            hasEGFloor: hotel.hasEGFloor ?? true,
            image: hotel.image || undefined,
            displayOrder: hotel.displayOrder || null,
          });
          results.hotels.success++;
        } catch (error: unknown) {
          results.hotels.failed++;
          const errorMessage = error instanceof Error ? error.message : 'Неизвестная ошибка';
          console.error(`Ошибка при восстановлении отеля ${hotel.id}:`, errorMessage);
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
            pricePerPerson: room.pricePerPerson || false,
            textVertical: room.textVertical || false,
          });
          results.rooms.success++;
        } catch (error: unknown) {
          results.rooms.failed++;
          const errorMessage = error instanceof Error ? error.message : 'Неизвестная ошибка';
          console.error(`Ошибка при восстановлении комнаты ${room.id}:`, errorMessage);
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
        } catch (error: unknown) {
          results.stairs.failed++;
          const errorMessage = error instanceof Error ? error.message : 'Неизвестная ошибка';
          console.error(`Ошибка при восстановлении лестницы ${stairs.id}:`, errorMessage);
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
        } catch (error: unknown) {
          results.bookings.failed++;
          const errorMessage = error instanceof Error ? error.message : 'Неизвестная ошибка';
          console.error(`Ошибка при восстановлении бронирования ${booking.id}:`, errorMessage);
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
        } catch (error: unknown) {
          results.invites.failed++;
          const errorMessage = error instanceof Error ? error.message : 'Неизвестная ошибка';
          console.error(`Ошибка при восстановлении приглашения ${invite.id}:`, errorMessage);
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
            userEmail: feedbackData.userEmail || null,
            userRole: feedbackData.userRole,
            comment: feedbackData.comment,
            screenshot: feedbackData.screenshot || null,
            userAgent: feedbackData.userAgent || null,
            isProcessed: feedbackData.isProcessed || false,
          });
          results.feedback.success++;
        } catch (error: unknown) {
          results.feedback.failed++;
          const errorMessage = error instanceof Error ? error.message : 'Неизвестная ошибка';
          console.error(`Ошибка при восстановлении отзыва из ${file}:`, errorMessage);
        }
      }
    }

    // Логируем восстановление данных
    const duration = Date.now() - startTime;
    await logActivity({
      userId: undefined, // Будет заполнено на клиенте
      userName: 'Система',
      userRole: undefined, // Будет заполнено на клиенте
      action: 'data_restored',
      entity: 'system',
      details: {
        results,
        totalRestored: 
          results.users.success + 
          results.hotels.success + 
          results.rooms.success + 
          results.stairs.success + 
          results.bookings.success + 
          results.invites.success + 
          results.feedback.success,
        totalFailed: 
          results.users.failed + 
          results.hotels.failed + 
          results.rooms.failed + 
          results.stairs.failed + 
          results.bookings.failed + 
          results.invites.failed + 
          results.feedback.failed,
      },
      status: 'success',
      ipAddress: ipAddress.split(',')[0].trim(),
      userAgent,
      duration,
    }).catch(() => {
      // Тихо игнорируем ошибки логирования
    });

    return NextResponse.json({
      success: true,
      message: 'Данные восстановлены',
      results,
    });
  } catch (error: unknown) {
    console.error('Error in POST /api/restore-data:', error);
    const errorMessage = error instanceof Error ? error.message : 'Ошибка при восстановлении данных';
    const duration = Date.now() - startTime;
    
    // Логируем ошибку восстановления данных
    const ipAddress = request.headers.get('x-forwarded-for') || 
                      request.headers.get('x-real-ip') || 
                      'unknown';
    const userAgent = request.headers.get('user-agent') || 'unknown';
    
    await logActivity({
      userId: undefined,
      userName: 'Система',
      userRole: undefined,
      action: 'data_restored',
      entity: 'system',
      details: {
        error: errorMessage,
      },
      status: 'error',
      errorMessage,
      ipAddress: ipAddress.split(',')[0].trim(),
      userAgent,
      duration,
    }).catch(() => {
      // Тихо игнорируем ошибки логирования
    });
    
    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    );
  }
}



