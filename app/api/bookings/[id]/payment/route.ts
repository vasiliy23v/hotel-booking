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
    
    // Вычисляем сумму, если не указана
    let paymentAmount = amount;
    if (!paymentAmount) {
      const room = await getRoomById(booking.roomId);
      if (room && room.price) {
        const checkIn = new Date(booking.checkIn);
        const checkOut = new Date(booking.checkOut);
        const nights = Math.ceil((checkOut.getTime() - checkIn.getTime()) / (1000 * 60 * 60 * 24));
        paymentAmount = nights * room.price;
      }
    }
    
    const updatedBooking = await updateBooking(id, {
      isPaid: true,
      paymentMethod: paymentMethod as 'cash' | 'transfer',
      paymentDate: new Date().toISOString(),
      paidBy: paidBy || 'system',
      amount: paymentAmount || booking.amount || 0
    });
    
    return NextResponse.json(updatedBooking);
  } catch (error: any) {
    if (error.message === 'Бронирование не найдено') {
      return NextResponse.json({ error: 'Booking not found' }, { status: 404 });
    }
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

