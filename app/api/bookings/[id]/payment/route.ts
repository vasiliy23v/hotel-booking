import { NextRequest, NextResponse } from 'next/server';
import { readData, writeData } from '@/lib/data';
import type { BookingInfo, Room } from '@/types';

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
    
    const data = readData();
    const index = data.bookings?.findIndex((b: BookingInfo) => b.id === id) ?? -1;
    
    if (index === -1) {
      return NextResponse.json({ error: 'Booking not found' }, { status: 404 });
    }
    
    const booking = data.bookings[index];
    
    // Вычисляем сумму, если не указана
    let paymentAmount = amount;
    if (!paymentAmount && data.rooms) {
      const room = data.rooms.find((r: Room) => r.id === booking.roomId);
      if (room && room.price) {
        const checkIn = new Date(booking.checkIn);
        const checkOut = new Date(booking.checkOut);
        const nights = Math.ceil((checkOut.getTime() - checkIn.getTime()) / (1000 * 60 * 60 * 24));
        paymentAmount = nights * room.price;
      }
    }
    
    const updatedBooking: BookingInfo = {
      ...booking,
      isPaid: true,
      paymentMethod: paymentMethod as 'cash' | 'transfer',
      paymentDate: new Date().toISOString(),
      paidBy: paidBy || 'system',
      amount: paymentAmount || booking.amount || 0
    };
    
    data.bookings[index] = updatedBooking;
    
    // Обновляем бронирование в комнате
    if (data.rooms) {
      const roomIndex = data.rooms.findIndex((r: Room) => r.booking?.id === id);
      if (roomIndex !== -1) {
        data.rooms[roomIndex].booking = updatedBooking;
      }
    }
    
    writeData(data);
    
    return NextResponse.json(updatedBooking);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

