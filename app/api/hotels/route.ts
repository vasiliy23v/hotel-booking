import { NextRequest, NextResponse } from 'next/server';
import { readData, writeData } from '@/lib/data';
import type { Hotel } from '@/types';

// GET /api/hotels
export async function GET() {
  try {
    const data = readData();
    return NextResponse.json(data.hotels || []);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// POST /api/hotels
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const data = readData();
    
    const newHotel: Hotel = {
      id: `hotel-${Date.now()}`,
      ...body
    };
    
    if (!data.hotels) data.hotels = [];
    data.hotels.push(newHotel);
    writeData(data);
    
    return NextResponse.json(newHotel);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}






