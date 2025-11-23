import { NextRequest, NextResponse } from 'next/server';
import { readData, writeData } from '@/lib/data';
import type { Room } from '@/types';

// GET /api/rooms
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const hotelId = searchParams.get('hotelId');
    
    const data = readData();
    let rooms = data.rooms || [];
    
    if (hotelId) {
      rooms = rooms.filter((r: Room) => r.hotelId === hotelId);
    }
    
    return NextResponse.json(rooms);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// POST /api/rooms
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const data = readData();
    
    const newRoom: Room = {
      id: `room-${Date.now()}`,
      ...body
    };
    
    if (!data.rooms) data.rooms = [];
    data.rooms.push(newRoom);
    writeData(data);
    
    return NextResponse.json(newRoom);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}






