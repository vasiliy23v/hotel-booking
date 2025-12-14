import { NextRequest, NextResponse } from 'next/server';
import { getBookingById, updateBooking, deleteBooking } from '@/lib/db';
import { logActivity } from '@/lib/logger';

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
  const startTime = Date.now();
  let updatedBooking;
  let currentBooking;
  
  try {
    const { id } = await params;
    const body = await request.json();
    
    // Получаем текущее бронирование для логирования изменений
    currentBooking = await getBookingById(id);
    
    // Получаем IP адрес и User-Agent из запроса
    const ipAddress = request.headers.get('x-forwarded-for') || 
                      request.headers.get('x-real-ip') || 
                      'unknown';
    const userAgent = request.headers.get('user-agent') || 'unknown';
    
    updatedBooking = await updateBooking(id, body);
    
    // Логируем обновление бронирования со всей информацией
    const duration = Date.now() - startTime;
    await logActivity({
      userId: undefined, // Будет заполнено на клиенте
      userName: updatedBooking.bookedBy || 'Неизвестный',
      userRole: undefined, // Будет заполнено на клиенте
      action: 'booking_updated',
      entity: 'booking',
      entityId: updatedBooking.id,
      details: {
        // Полная информация о бронировании после обновления
        roomId: updatedBooking.roomId,
        bookedBy: updatedBooking.bookedBy,
        bookedDate: updatedBooking.bookedDate,
        email: updatedBooking.email,
        phone: updatedBooking.phone,
        checkIn: updatedBooking.checkIn,
        checkOut: updatedBooking.checkOut,
        guests: updatedBooking.guests,
        guestsCount: updatedBooking.guests?.length || 0,
        notes: updatedBooking.notes,
        isConfirmed: updatedBooking.isConfirmed || false,
        confirmedBy: updatedBooking.confirmedBy,
        confirmedDate: updatedBooking.confirmedDate,
        isPaid: updatedBooking.isPaid || false,
        paymentMethod: updatedBooking.paymentMethod,
        paymentDate: updatedBooking.paymentDate,
        paidBy: updatedBooking.paidBy,
        amount: updatedBooking.amount,
        // Информация об изменениях
        changes: {
          roomId: currentBooking?.roomId !== updatedBooking.roomId ? { from: currentBooking?.roomId, to: updatedBooking.roomId } : undefined,
          checkIn: currentBooking?.checkIn !== updatedBooking.checkIn ? { from: currentBooking?.checkIn, to: updatedBooking.checkIn } : undefined,
          checkOut: currentBooking?.checkOut !== updatedBooking.checkOut ? { from: currentBooking?.checkOut, to: updatedBooking.checkOut } : undefined,
          isConfirmed: currentBooking?.isConfirmed !== updatedBooking.isConfirmed ? { from: currentBooking?.isConfirmed, to: updatedBooking.isConfirmed } : undefined,
          isPaid: currentBooking?.isPaid !== updatedBooking.isPaid ? { from: currentBooking?.isPaid, to: updatedBooking.isPaid } : undefined,
          amount: currentBooking?.amount !== updatedBooking.amount ? { from: currentBooking?.amount, to: updatedBooking.amount } : undefined,
        },
      },
      status: 'success',
      ipAddress: ipAddress.split(',')[0].trim(),
      userAgent,
      duration,
    }).catch(() => {
      // Тихо игнорируем ошибки логирования
    });
    
    return NextResponse.json(updatedBooking);
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Ошибка при обновлении бронирования';
    const duration = Date.now() - startTime;
    
    // Логируем ошибку обновления бронирования
    const ipAddress = request.headers.get('x-forwarded-for') || 
                      request.headers.get('x-real-ip') || 
                      'unknown';
    const userAgent = request.headers.get('user-agent') || 'unknown';
    
    await logActivity({
      userId: undefined,
      userName: 'Система',
      userRole: undefined,
      action: 'booking_updated',
      entity: 'booking',
      entityId: (await params).id,
      details: {
        error: errorMessage,
        currentBooking: currentBooking ? {
          roomId: currentBooking.roomId,
          checkIn: currentBooking.checkIn,
          checkOut: currentBooking.checkOut,
        } : undefined,
      },
      status: 'error',
      errorMessage,
      ipAddress: ipAddress.split(',')[0].trim(),
      userAgent,
      duration,
    }).catch(() => {
      // Тихо игнорируем ошибки логирования
    });
    
    if (errorMessage === 'Бронирование не найдено') {
      return NextResponse.json({ error: 'Booking not found' }, { status: 404 });
    }
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

// DELETE /api/bookings/[id]
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const startTime = Date.now();
  let deletedBooking;
  
  try {
    const { id } = await params;
    
    // Получаем бронирование перед удалением для логирования
    deletedBooking = await getBookingById(id);
    
    if (!deletedBooking) {
      return NextResponse.json({ error: 'Booking not found' }, { status: 404 });
    }
    
    // Получаем IP адрес и User-Agent из запроса
    const ipAddress = request.headers.get('x-forwarded-for') || 
                      request.headers.get('x-real-ip') || 
                      'unknown';
    const userAgent = request.headers.get('user-agent') || 'unknown';
    
    await deleteBooking(id);
    
    // Логируем удаление бронирования со всей информацией
    const duration = Date.now() - startTime;
    await logActivity({
      userId: undefined, // Будет заполнено на клиенте
      userName: deletedBooking.bookedBy || 'Неизвестный',
      userRole: undefined, // Будет заполнено на клиенте
      action: 'booking_cancelled',
      entity: 'booking',
      entityId: deletedBooking.id,
      details: {
        // Полная информация об удаленном бронировании
        roomId: deletedBooking.roomId,
        bookedBy: deletedBooking.bookedBy,
        bookedDate: deletedBooking.bookedDate,
        email: deletedBooking.email,
        phone: deletedBooking.phone,
        checkIn: deletedBooking.checkIn,
        checkOut: deletedBooking.checkOut,
        guests: deletedBooking.guests,
        guestsCount: deletedBooking.guests?.length || 0,
        notes: deletedBooking.notes,
        isConfirmed: deletedBooking.isConfirmed || false,
        confirmedBy: deletedBooking.confirmedBy,
        confirmedDate: deletedBooking.confirmedDate,
        isPaid: deletedBooking.isPaid || false,
        paymentMethod: deletedBooking.paymentMethod,
        paymentDate: deletedBooking.paymentDate,
        paidBy: deletedBooking.paidBy,
        amount: deletedBooking.amount,
      },
      status: 'success',
      ipAddress: ipAddress.split(',')[0].trim(),
      userAgent,
      duration,
    }).catch(() => {
      // Тихо игнорируем ошибки логирования
    });
    
    return NextResponse.json({ success: true });
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Internal server error';
    const duration = Date.now() - startTime;
    
    // Логируем ошибку удаления бронирования
    const ipAddress = request.headers.get('x-forwarded-for') || 
                      request.headers.get('x-real-ip') || 
                      'unknown';
    const userAgent = request.headers.get('user-agent') || 'unknown';
    
    await logActivity({
      userId: undefined,
      userName: 'Система',
      userRole: undefined,
      action: 'booking_cancelled',
      entity: 'booking',
      entityId: (await params).id,
      details: {
        error: errorMessage,
        deletedBooking: deletedBooking ? {
          roomId: deletedBooking.roomId,
          bookedBy: deletedBooking.bookedBy,
        } : undefined,
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

