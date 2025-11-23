import { NextRequest, NextResponse } from 'next/server';
import { readData, writeData } from '@/lib/data';
import type { BookingInfo, Room } from '@/types';

// GET /api/bookings/[id]
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const data = readData();
    const booking = data.bookings?.find((b: BookingInfo) => b.id === id);
    
    if (!booking) {
      return NextResponse.json({ error: 'Booking not found' }, { status: 404 });
    }
    
    return NextResponse.json(booking);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
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
    const data = readData();
    const index = data.bookings?.findIndex((b: BookingInfo) => b.id === id) ?? -1;
    
    if (index === -1) {
      return NextResponse.json({ error: 'Booking not found' }, { status: 404 });
    }
    
    const updatedBooking = { ...data.bookings[index], ...body };
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

// DELETE /api/bookings/[id]
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const data = readData();
    const booking = data.bookings?.find((b: BookingInfo) => b.id === id);
    
    if (booking) {
      // Удаляем бронирование из комнаты
      if (data.rooms) {
        const roomIndex = data.rooms.findIndex((r: Room) => r.id === booking.roomId);
        if (roomIndex !== -1) {
          delete data.rooms[roomIndex].booking;
        }
      }
    }
    
    data.bookings = data.bookings?.filter((b: BookingInfo) => b.id !== id) || [];
    writeData(data);
    
    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

