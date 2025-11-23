import { NextRequest, NextResponse } from 'next/server';
import { readData, writeData } from '@/lib/data';
import type { Stairs } from '@/types';

// GET /api/stairs
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const hotelId = searchParams.get('hotelId');
    
    const data = readData();
    let stairs = data.stairs || [];
    
    if (hotelId) {
      stairs = stairs.filter((s: Stairs) => s.hotelId === hotelId);
    }
    
    return NextResponse.json(stairs);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// POST /api/stairs
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const data = readData();
    
    const newStairs: Stairs = {
      id: `stairs-${Date.now()}`,
      ...body
    };
    
    if (!data.stairs) data.stairs = [];
    data.stairs.push(newStairs);
    writeData(data);
    
    return NextResponse.json(newStairs);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}






