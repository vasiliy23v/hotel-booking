import { NextRequest, NextResponse } from 'next/server';
import { readData } from '@/lib/data';
import type { Room, BookingInfo } from '@/types';

// GET /api/statistics
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const hotelId = searchParams.get('hotelId');
    
    const data = readData();
    let rooms = data.rooms || [];
    
    if (hotelId) {
      rooms = rooms.filter((r: Room) => r.hotelId === hotelId);
    }
    
    const totalRooms = rooms.length;
    const availableRooms = rooms.filter((r: Room) => !r.booking && !r.isCommon).length;
    const bookedRooms = rooms.filter((r: Room) => r.booking).length;
    const commonRooms = rooms.filter((r: Room) => r.isCommon).length;
    
    const allGuests = rooms
      .filter((r: Room) => r.booking)
      .flatMap((r: Room) => r.booking?.guests || []);
    const totalGuests = new Set(allGuests.map((g: any) => g.email || g.name)).size;
    
    const activeBookings = bookedRooms;
    
    const revenue = rooms
      .filter((r: Room) => r.booking && r.price)
      .reduce((sum: number, r: Room) => {
        const checkIn = new Date(r.booking!.checkIn);
        const checkOut = new Date(r.booking!.checkOut);
        const nights = Math.ceil((checkOut.getTime() - checkIn.getTime()) / (1000 * 60 * 60 * 24));
        return sum + (r.price * nights);
      }, 0);
    
    const roomsByType = {
      FZ: rooms.filter((r: Room) => r.type === 'FZ').length,
      DZ: rooms.filter((r: Room) => r.type === 'DZ').length,
      EZ: rooms.filter((r: Room) => r.type === 'EZ').length,
      COMMON: rooms.filter((r: Room) => r.type === 'COMMON').length
    };
    
    const roomsByFloor = {
      EG: rooms.filter((r: Room) => r.floor === 'EG').length,
      '1OG': rooms.filter((r: Room) => r.floor === '1OG').length,
      '2OG': rooms.filter((r: Room) => r.floor === '2OG').length
    };
    
    return NextResponse.json({
      totalRooms,
      availableRooms,
      bookedRooms,
      commonRooms,
      totalGuests,
      activeBookings,
      revenue,
      roomsByType,
      roomsByFloor
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

