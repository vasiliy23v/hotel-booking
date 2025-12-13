import { NextRequest, NextResponse } from 'next/server';
import { getRoomById, updateRoom, deleteRoom, getActiveBookingForRoom } from '@/lib/db';

// GET /api/rooms/[id]
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const room = await getRoomById(id);
    
    if (!room) {
      return NextResponse.json({ error: 'Room not found' }, { status: 404 });
    }
    
    // Загружаем активное бронирование, если есть
    const activeBooking = await getActiveBookingForRoom(id);
    const roomWithBooking = activeBooking ? { ...room, booking: activeBooking } : room;
    
    return NextResponse.json(roomWithBooking);
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Internal server error';
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}

// PUT /api/rooms/[id]
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const updatedRoom = await updateRoom(id, body);
    
    // Загружаем активное бронирование, если есть
    const activeBooking = await getActiveBookingForRoom(id);
    const roomWithBooking = activeBooking ? { ...updatedRoom, booking: activeBooking } : updatedRoom;
    
    return NextResponse.json(roomWithBooking);
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Internal server error';
    if (errorMessage === 'Комната не найдена') {
      return NextResponse.json({ error: 'Room not found' }, { status: 404 });
    }
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}

// DELETE /api/rooms/[id]
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    await deleteRoom(id);
    
    return NextResponse.json({ success: true });
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Internal server error';
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}

