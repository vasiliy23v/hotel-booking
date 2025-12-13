import { NextRequest, NextResponse } from 'next/server';
import { getBookingById, updateBooking, deleteBooking } from '@/lib/db';

// GET /api/bookings/[id]
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const booking = await getBookingById(id);
    
    if (!booking) {
      return NextResponse.json({ error: 'Booking not found' }, { status: 404 });
    }
    
    return NextResponse.json(booking);
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Internal server error';
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}

// PUT /api/bookings/[id]
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const updatedBooking = await updateBooking(id, body);
    
    return NextResponse.json(updatedBooking);
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Ошибка при обновлении бронирования';
    if (errorMessage === 'Бронирование не найдено') {
      return NextResponse.json({ error: 'Booking not found' }, { status: 404 });
    }
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

// DELETE /api/bookings/[id]
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    await deleteBooking(id);
    
    return NextResponse.json({ success: true });
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Internal server error';
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}

