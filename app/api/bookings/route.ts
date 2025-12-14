import { NextRequest, NextResponse } from 'next/server';
import { getBookings, createBooking } from '@/lib/db';
import { logActivity } from '@/lib/logger';

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
  const startTime = Date.now();
  let newBooking;
  
  try {
    const body = await request.json();
    
    // Получаем IP адрес и User-Agent из запроса
    const ipAddress = request.headers.get('x-forwarded-for') || 
                      request.headers.get('x-real-ip') || 
                      'unknown';
    const userAgent = request.headers.get('user-agent') || 'unknown';
    
    newBooking = await createBooking(body);
    
    // Логируем создание бронирования со всей информацией
    const duration = Date.now() - startTime;
    await logActivity({
      userId: undefined, // Будет заполнено на клиенте
      userName: body.bookedBy || 'Неизвестный',
      userRole: undefined, // Будет заполнено на клиенте
      action: 'booking_created',
      entity: 'booking',
      entityId: newBooking.id,
      details: {
        roomId: newBooking.roomId,
        bookedBy: newBooking.bookedBy,
        bookedDate: newBooking.bookedDate,
        email: newBooking.email,
        phone: newBooking.phone,
        checkIn: newBooking.checkIn,
        checkOut: newBooking.checkOut,
        guests: newBooking.guests,
        guestsCount: newBooking.guests?.length || 0,
        notes: newBooking.notes,
        isConfirmed: newBooking.isConfirmed || false,
        confirmedBy: newBooking.confirmedBy,
        confirmedDate: newBooking.confirmedDate,
        isPaid: newBooking.isPaid || false,
        paymentMethod: newBooking.paymentMethod,
        paymentDate: newBooking.paymentDate,
        paidBy: newBooking.paidBy,
        amount: newBooking.amount,
      },
      status: 'success',
      ipAddress: ipAddress.split(',')[0].trim(),
      userAgent,
      duration,
    }).catch(() => {
      // Тихо игнорируем ошибки логирования
    });
    
    return NextResponse.json(newBooking);
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Ошибка при создании бронирования';
    const duration = Date.now() - startTime;
    
    // Логируем ошибку создания бронирования
    const ipAddress = request.headers.get('x-forwarded-for') || 
                      request.headers.get('x-real-ip') || 
                      'unknown';
    const userAgent = request.headers.get('user-agent') || 'unknown';
    
    await logActivity({
      userId: undefined,
      userName: 'Система',
      userRole: undefined,
      action: 'booking_created',
      entity: 'booking',
      entityId: newBooking?.id,
      details: {
        roomId: (error as { roomId?: string })?.roomId,
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
    
    // Если это ошибка о занятости комнаты, возвращаем 409 Conflict
    if (errorMessage.includes('уже забронирована') || errorMessage.includes('забронировал эту комнату раньше')) {
      return NextResponse.json({ error: errorMessage }, { status: 409 });
    }
    // Для других ошибок валидации возвращаем 400
    if (errorMessage.includes('Дата заезда') || errorMessage.includes('формат')) {
      return NextResponse.json({ error: errorMessage }, { status: 400 });
    }
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}






