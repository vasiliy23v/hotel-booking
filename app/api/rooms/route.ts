import { NextRequest, NextResponse } from 'next/server';
import { getRooms, createRoom } from '@/lib/db';

// GET /api/rooms
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const hotelId = searchParams.get('hotelId');
    
    const rooms = await getRooms(hotelId || undefined);
    
    return NextResponse.json(rooms);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// POST /api/rooms
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const newRoom = await createRoom(body);
    
    return NextResponse.json(newRoom);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}






