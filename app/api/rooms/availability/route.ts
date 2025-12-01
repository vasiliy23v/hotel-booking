import { NextRequest, NextResponse } from 'next/server';
import { isRoomAvailable } from '@/lib/db';

// POST /api/rooms/availability
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { roomIds, checkIn, checkOut } = body;

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
        const available = await isRoomAvailable(roomId, checkInDate, checkOutDate);
        availability[roomId] = available;
      })
    );

    return NextResponse.json(availability);
  } catch (error: any) {
    console.error('Error checking rooms availability:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

