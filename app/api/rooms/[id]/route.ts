import { NextRequest, NextResponse } from 'next/server';
import { getRoomById, updateRoom, deleteRoom, getActiveBookingForRoom } from '@/lib/db';
import { logActivity } from '@/lib/logger';

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
  const startTime = Date.now();
  let updatedRoom;
  let currentRoom;
  
  try {
    const { id } = await params;
    const body = await request.json();
    
    // Получаем текущую комнату для логирования изменений
    currentRoom = await getRoomById(id);
    
    // Получаем IP адрес и User-Agent из запроса
    const ipAddress = request.headers.get('x-forwarded-for') || 
                      request.headers.get('x-real-ip') || 
                      'unknown';
    const userAgent = request.headers.get('user-agent') || 'unknown';
    
    updatedRoom = await updateRoom(id, body);
    
    // Загружаем активное бронирование, если есть
    const activeBooking = await getActiveBookingForRoom(id);
    const roomWithBooking = activeBooking ? { ...updatedRoom, booking: activeBooking } : updatedRoom;
    
    // Логируем обновление комнаты
    const duration = Date.now() - startTime;
    await logActivity({
      userId: undefined, // Будет заполнено на клиенте
      userName: 'Система',
      userRole: undefined, // Будет заполнено на клиенте
      action: 'room_updated',
      entity: 'room',
      entityId: updatedRoom.id,
      details: {
        roomNumber: updatedRoom.number,
        hotelId: updatedRoom.hotelId,
        type: updatedRoom.type,
        capacity: updatedRoom.capacity,
        maxCapacity: updatedRoom.maxCapacity,
        floor: updatedRoom.floor,
        price: updatedRoom.price,
        changes: {
          number: currentRoom?.number !== updatedRoom.number ? { from: currentRoom?.number, to: updatedRoom.number } : undefined,
          type: currentRoom?.type !== updatedRoom.type ? { from: currentRoom?.type, to: updatedRoom.type } : undefined,
          capacity: currentRoom?.capacity !== updatedRoom.capacity ? { from: currentRoom?.capacity, to: updatedRoom.capacity } : undefined,
          price: currentRoom?.price !== updatedRoom.price ? { from: currentRoom?.price, to: updatedRoom.price } : undefined,
        },
      },
      status: 'success',
      ipAddress: ipAddress.split(',')[0].trim(),
      userAgent,
      duration,
    }).catch(() => {
      // Тихо игнорируем ошибки логирования
    });
    
    return NextResponse.json(roomWithBooking);
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Ошибка при обновлении комнаты';
    const duration = Date.now() - startTime;
    
    // Логируем ошибку обновления комнаты
    const ipAddress = request.headers.get('x-forwarded-for') || 
                      request.headers.get('x-real-ip') || 
                      'unknown';
    const userAgent = request.headers.get('user-agent') || 'unknown';
    
    await logActivity({
      userId: undefined,
      userName: 'Система',
      userRole: undefined,
      action: 'room_updated',
      entity: 'room',
      entityId: (await params).id,
      details: {
        error: errorMessage,
        currentRoom: currentRoom ? {
          number: currentRoom.number,
          hotelId: currentRoom.hotelId,
        } : undefined,
      },
      status: 'error',
      errorMessage,
      ipAddress: ipAddress.split(',')[0].trim(),
      userAgent,
      duration,
    }).catch(() => {
      // Тихо игнорируем ошибки логирования
    });
    
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

