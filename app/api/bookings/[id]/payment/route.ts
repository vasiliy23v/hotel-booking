import { NextRequest, NextResponse } from 'next/server';
import { updateBooking, getBookingById, getRoomById } from '@/lib/db';

// PUT /api/bookings/[id]/payment
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { paymentMethod, amount, paidBy } = body;
    
    if (!paymentMethod) {
      return NextResponse.json({ error: 'Payment method is required' }, { status: 400 });
    }
    
    const booking = await getBookingById(id);
    if (!booking) {
      return NextResponse.json({ error: 'Booking not found' }, { status: 404 });
    }
    
    // Вычисляем ожидаемую сумму на основе цены комнаты и количества ночей, округляем до целого
    const room = await getRoomById(booking.roomId);
    const checkIn = new Date(booking.checkIn);
    const checkOut = new Date(booking.checkOut);
    const nights = Math.ceil((checkOut.getTime() - checkIn.getTime()) / (1000 * 60 * 60 * 24));
    const expectedAmount = Math.round(nights * (room?.price || 0));
    
    // Вычисляем сумму доплаты, если не указана - используем остаток, округляем до целого
    let additionalPayment = amount ? Math.round(amount) : 0;
    if (!additionalPayment || additionalPayment === 0) {
      // Если сумма не указана, рассчитываем остаток к доплате
      const alreadyPaid = Math.round(booking.isPaid ? (booking.amount || 0) : 0);
      additionalPayment = Math.max(0, expectedAmount - alreadyPaid);
    }
    
    // Если уже была оплата, суммируем с новой доплатой, округляем до целого
    const alreadyPaid = Math.round(booking.isPaid ? (booking.amount || 0) : 0);
    const totalPaid = Math.round(alreadyPaid + additionalPayment);
    
    const updatedBooking = await updateBooking(id, {
      isPaid: true,
      paymentMethod: paymentMethod as 'cash' | 'transfer',
      paymentDate: new Date().toISOString(),
      paidBy: paidBy || 'system',
      amount: totalPaid
    });
    
    return NextResponse.json(updatedBooking);
  } catch (error: any) {
    if (error.message === 'Бронирование не найдено') {
      return NextResponse.json({ error: 'Booking not found' }, { status: 404 });
    }
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

