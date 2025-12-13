import { NextRequest, NextResponse } from 'next/server';
import { getHotels, createHotel } from '@/lib/db';

// GET /api/hotels
export async function GET() {
  try {
    const hotels = await getHotels();
    return NextResponse.json(hotels);
  } catch (error: unknown) {
    console.error('Error in GET /api/hotels:', error);
    const errorMessage = error instanceof Error ? error.message : 'Internal server error';
    const errorStack = error instanceof Error ? error.stack : undefined;
    return NextResponse.json({ 
      error: errorMessage,
      stack: process.env.NODE_ENV === 'development' ? errorStack : undefined
    }, { status: 500 });
  }
}

// POST /api/hotels
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const newHotel = await createHotel(body);
    
    return NextResponse.json(newHotel);
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Internal server error';
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}






