import { NextRequest, NextResponse } from 'next/server';
import { getHotels, createHotel } from '@/lib/db';

// GET /api/hotels
export async function GET() {
  try {
    const hotels = await getHotels();
    return NextResponse.json(hotels);
  } catch (error: any) {
    console.error('Error in GET /api/hotels:', error);
    return NextResponse.json({ 
      error: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    }, { status: 500 });
  }
}

// POST /api/hotels
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const newHotel = await createHotel(body);
    
    return NextResponse.json(newHotel);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}






