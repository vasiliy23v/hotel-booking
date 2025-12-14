import { NextRequest, NextResponse } from 'next/server';
import { getRooms, createRoom } from '@/lib/db';
import { logActivity } from '@/lib/logger';

// GET /api/rooms
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const hotelId = searchParams.get('hotelId');
    
    const rooms = await getRooms(hotelId || undefined);
    
    return NextResponse.json(rooms);
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Internal server error';
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}

// POST /api/rooms
export async function POST(request: NextRequest) {
  const startTime = Date.now();
  let newRoom;
  
  try {
    const body = await request.json();
    
    // Получаем IP адрес и User-Agent из запроса
    const ipAddress = request.headers.get('x-forwarded-for') || 
                      request.headers.get('x-real-ip') || 
                      'unknown';
    const userAgent = request.headers.get('user-agent') || 'unknown';
    
    newRoom = await createRoom(body);
    
    // Логируем создание комнаты
    const duration = Date.now() - startTime;
    await logActivity({
      userId: undefined, // Будет заполнено на клиенте
      userName: 'Система',
      userRole: undefined, // Будет заполнено на клиенте
      action: 'room_created',
      entity: 'room',
      entityId: newRoom.id,
      details: {
        roomNumber: newRoom.number,
        hotelId: newRoom.hotelId,
        type: newRoom.type,
        capacity: newRoom.capacity,
        maxCapacity: newRoom.maxCapacity,
        floor: newRoom.floor,
        price: newRoom.price,
      },
      status: 'success',
      ipAddress: ipAddress.split(',')[0].trim(),
      userAgent,
      duration,
    }).catch(() => {
      // Тихо игнорируем ошибки логирования
    });
    
    return NextResponse.json(newRoom);
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Ошибка при создании комнаты';
    const duration = Date.now() - startTime;
    
    // Логируем ошибку создания комнаты
    const ipAddress = request.headers.get('x-forwarded-for') || 
                      request.headers.get('x-real-ip') || 
                      'unknown';
    const userAgent = request.headers.get('user-agent') || 'unknown';
    
    await logActivity({
      userId: undefined,
      userName: 'Система',
      userRole: undefined,
      action: 'room_created',
      entity: 'room',
      entityId: newRoom?.id,
      details: {
        error: errorMessage,
        body: (error as { body?: unknown })?.body,
      },
      status: 'error',
      errorMessage,
      ipAddress: ipAddress.split(',')[0].trim(),
      userAgent,
      duration,
    }).catch(() => {
      // Тихо игнорируем ошибки логирования
    });
    
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}






