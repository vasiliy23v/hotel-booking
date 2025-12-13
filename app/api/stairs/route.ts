import { NextRequest, NextResponse } from 'next/server';
import { getStairs, createStairs } from '@/lib/db';

// GET /api/stairs
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const hotelId = searchParams.get('hotelId');
    
    const stairs = await getStairs(hotelId || undefined);
    
    return NextResponse.json(stairs);
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Internal server error';
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}

// POST /api/stairs
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const newStairs = await createStairs(body);
    
    return NextResponse.json(newStairs);
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Internal server error';
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}






