import { NextRequest, NextResponse } from 'next/server';
import { getBookings, createBooking } from '@/lib/db';

// GET /api/bookings
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const roomId = searchParams.get('roomId');
    const hotelId = searchParams.get('hotelId');
    
    const bookings = await getBookings(roomId || undefined, hotelId || undefined);
    
    return NextResponse.json(bookings);
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Internal server error';
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}

// POST /api/bookings
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const newBooking = await createBooking(body);
    
    return NextResponse.json(newBooking);
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Ошибка при создании бронирования';
    // Если это ошибка о занятости комнаты, возвращаем 409 Conflict
    if (errorMessage.includes('уже забронирована')) {
      return NextResponse.json({ error: errorMessage }, { status: 409 });
    }
    // Для других ошибок валидации возвращаем 400
    if (errorMessage.includes('Дата заезда') || errorMessage.includes('формат')) {
      return NextResponse.json({ error: errorMessage }, { status: 400 });
    }
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}






