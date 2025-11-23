import { NextRequest, NextResponse } from 'next/server';
import { readData, writeData } from '@/lib/data';
import type { BookingInfo, Room } from '@/types';

// GET /api/bookings
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const roomId = searchParams.get('roomId');
    const hotelId = searchParams.get('hotelId');
    
    const data = readData();
    let bookings = data.bookings || [];
    
    if (roomId) {
      bookings = bookings.filter((b: BookingInfo) => b.roomId === roomId);
    } else if (hotelId) {
      const rooms = data.rooms?.filter((r: Room) => r.hotelId === hotelId) || [];
      const roomIds = rooms.map((r: Room) => r.id);
      bookings = bookings.filter((b: BookingInfo) => roomIds.includes(b.roomId));
    }
    
    return NextResponse.json(bookings);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// POST /api/bookings
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const data = readData();
    
    const newBooking: BookingInfo = {
      id: `booking-${Date.now()}`,
      ...body
    };
    
    // Обновляем комнату с бронированием
    if (data.rooms) {
      const roomIndex = data.rooms.findIndex((r: Room) => r.id === body.roomId);
      if (roomIndex !== -1) {
        data.rooms[roomIndex].booking = newBooking;
      }
    }
    
    if (!data.bookings) data.bookings = [];
    data.bookings.push(newBooking);
    writeData(data);
    
    return NextResponse.json(newBooking);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}






