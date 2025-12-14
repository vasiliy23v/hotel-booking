import { NextRequest, NextResponse } from 'next/server';
import { isRoomAvailable } from '@/lib/db';
import { logActivity } from '@/lib/logger';

// POST /api/rooms/availability
export async function POST(request: NextRequest) {
  const startTime = Date.now();
  
  try {
    const body = await request.json();
    const { roomIds, checkIn, checkOut, excludeBookingId } = body;

    // Получаем IP адрес и User-Agent из запроса
    const ipAddress = request.headers.get('x-forwarded-for') || 
                      request.headers.get('x-real-ip') || 
                      'unknown';
    const userAgent = request.headers.get('user-agent') || 'unknown';

    if (!roomIds || !Array.isArray(roomIds) || !checkIn || !checkOut) {
      return NextResponse.json(
        { error: 'roomIds (array), checkIn и checkOut обязательны' },
        { status: 400 }
      );
    }

    const checkInDate = new Date(checkIn);
    const checkOutDate = new Date(checkOut);

    if (isNaN(checkInDate.getTime()) || isNaN(checkOutDate.getTime())) {
      return NextResponse.json(
        { error: 'Неверный формат дат' },
        { status: 400 }
      );
    }

    // Разрешаем одинаковые даты (бронирование на одну ночь - check-in и check-out в один день)
    // Блокируем только если дата выезда раньше даты заезда
    if (checkInDate > checkOutDate) {
      return NextResponse.json(
        { error: 'Дата заезда не может быть позже даты выезда' },
        { status: 400 }
      );
    }

    // Проверяем доступность каждой комнаты
    const availability: Record<string, boolean> = {};
    
    await Promise.all(
      roomIds.map(async (roomId: string) => {
        const available = await isRoomAvailable(roomId, checkInDate, checkOutDate, excludeBookingId);
        availability[roomId] = available;
      })
    );

    // Логируем проверку доступности
    const duration = Date.now() - startTime;
    const availableCount = Object.values(availability).filter(v => v).length;
    await logActivity({
      userId: undefined, // Будет заполнено на клиенте
      userName: 'Система',
      userRole: undefined, // Будет заполнено на клиенте
      action: 'api_error', // Используем общее действие для запросов без изменений
      entity: 'room',
      details: {
        action: 'check_availability',
        roomIdsCount: roomIds.length,
        availableCount,
        unavailableCount: roomIds.length - availableCount,
        checkIn,
        checkOut,
        excludeBookingId,
      },
      status: 'success',
      ipAddress: ipAddress.split(',')[0].trim(),
      userAgent,
      duration,
    }).catch(() => {
      // Тихо игнорируем ошибки логирования
    });

    return NextResponse.json(availability);
  } catch (error: unknown) {
    console.error('Error checking rooms availability:', error);
    const errorMessage = error instanceof Error ? error.message : 'Ошибка при проверке доступности комнат';
    const duration = Date.now() - startTime;
    
    // Логируем ошибку проверки доступности
    const ipAddress = request.headers.get('x-forwarded-for') || 
                      request.headers.get('x-real-ip') || 
                      'unknown';
    const userAgent = request.headers.get('user-agent') || 'unknown';
    
    await logActivity({
      userId: undefined,
      userName: 'Система',
      userRole: undefined,
      action: 'api_error',
      entity: 'room',
      details: {
        action: 'check_availability',
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
    
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}

