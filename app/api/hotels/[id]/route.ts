import { NextRequest, NextResponse } from 'next/server';
import { readData, writeData } from '@/lib/data';
import type { Hotel } from '@/types';

// GET /api/hotels/[id]
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const data = readData();
    const hotel = data.hotels?.find((h: Hotel) => h.id === id);
    
    if (!hotel) {
      return NextResponse.json({ error: 'Hotel not found' }, { status: 404 });
    }
    
    return NextResponse.json(hotel);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// PUT /api/hotels/[id]
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const data = readData();
    const index = data.hotels?.findIndex((h: Hotel) => h.id === id) ?? -1;
    
    if (index === -1) {
      return NextResponse.json({ error: 'Hotel not found' }, { status: 404 });
    }
    
    data.hotels[index] = { ...data.hotels[index], ...body };
    writeData(data);
    
    return NextResponse.json(data.hotels[index]);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// DELETE /api/hotels/[id]
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const data = readData();
    data.hotels = data.hotels?.filter((h: Hotel) => h.id !== id) || [];
    writeData(data);
    
    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

