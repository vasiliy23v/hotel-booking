import { NextRequest, NextResponse } from 'next/server';
import { readData, writeData } from '@/lib/data';
import type { BookingInfo, Room } from '@/types';

// PUT /api/bookings/[id]/confirm
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { confirmedBy } = body;
    
    const data = readData();
    const index = data.bookings?.findIndex((b: BookingInfo) => b.id === id) ?? -1;
    
    if (index === -1) {
      return NextResponse.json({ error: 'Booking not found' }, { status: 404 });
    }
    
    const updatedBooking: BookingInfo = {
      ...data.bookings[index],
      isConfirmed: true,
      confirmedBy: confirmedBy || 'system',
      confirmedDate: new Date().toISOString()
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


