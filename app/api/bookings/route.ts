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
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// POST /api/bookings
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const newBooking = await createBooking(body);
    
    return NextResponse.json(newBooking);
  } catch (error: any) {
    // Если это ошибка о занятости комнаты, возвращаем 409 Conflict
    if (error.message && error.message.includes('уже забронирована')) {
      return NextResponse.json({ error: error.message }, { status: 409 });
    }
    // Для других ошибок валидации возвращаем 400
    if (error.message && (error.message.includes('Дата заезда') || error.message.includes('формат'))) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }
    return NextResponse.json({ error: error.message || 'Ошибка при создании бронирования' }, { status: 500 });
  }
}






