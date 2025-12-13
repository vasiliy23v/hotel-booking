import { NextRequest, NextResponse } from 'next/server';
import { getHotelById, updateHotel, deleteHotel } from '@/lib/db';

// GET /api/hotels/[id]
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const hotel = await getHotelById(id);
    
    if (!hotel) {
      return NextResponse.json({ error: 'Hotel not found' }, { status: 404 });
    }
    
    return NextResponse.json(hotel);
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Internal server error';
    return NextResponse.json({ error: errorMessage }, { status: 500 });
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
    const updatedHotel = await updateHotel(id, body);
    
    return NextResponse.json(updatedHotel);
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Internal server error';
    if (errorMessage === 'Отель не найден') {
      return NextResponse.json({ error: 'Hotel not found' }, { status: 404 });
    }
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}

// DELETE /api/hotels/[id]
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    await deleteHotel(id);
    
    return NextResponse.json({ success: true });
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Internal server error';
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}

