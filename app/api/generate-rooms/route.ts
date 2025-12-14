import { NextRequest, NextResponse } from 'next/server';
import { getHotels, getRooms, deleteRoom, createRoom } from '@/lib/db';
import { generateRoomsForHotel, generateAllRooms } from '@/lib/generateRooms';
import { logActivity } from '@/lib/logger';

// POST /api/generate-rooms
export async function POST(request: NextRequest) {
  const startTime = Date.now();
  
  try {
    const body = await request.json();
    const { hotelId, template, generateForAll } = body;
    
    // Получаем IP адрес и User-Agent из запроса
    const ipAddress = request.headers.get('x-forwarded-for') || 
                      request.headers.get('x-real-ip') || 
                      'unknown';
    const userAgent = request.headers.get('user-agent') || 'unknown';
    
    if (generateForAll) {
      // Генерируем комнаты для всех отелей
      const hotels = await getHotels();
      const newRooms = generateAllRooms(hotels);
      
      // Удаляем существующие комнаты
      const existingRooms = await getRooms();
      for (const room of existingRooms) {
        await deleteRoom(room.id);
      }
      
      // Создаем новые комнаты
      for (const room of newRooms) {
        await createRoom(room);
      }
      
      // Логируем генерацию комнат
      const duration = Date.now() - startTime;
      await logActivity({
        userId: undefined, // Будет заполнено на клиенте
        userName: 'Система',
        userRole: undefined, // Будет заполнено на клиенте
        action: 'rooms_generated',
        entity: 'room',
        details: {
          generateForAll: true,
          hotelsCount: hotels.length,
          roomsCount: newRooms.length,
          deletedRoomsCount: existingRooms.length,
        },
        status: 'success',
        ipAddress: ipAddress.split(',')[0].trim(),
        userAgent,
        duration,
      }).catch(() => {
        // Тихо игнорируем ошибки логирования
      });
      
      return NextResponse.json({ 
        success: true, 
        message: `Сгенерировано ${newRooms.length} комнат для ${hotels.length} отелей`,
        rooms: newRooms 
      });
    } else {
      // Генерируем комнаты для конкретного отеля
      if (!hotelId) {
        return NextResponse.json({ error: 'hotelId is required' }, { status: 400 });
      }
      
      // Проверяем существование отеля
      const hotels = await getHotels();
      const hotel = hotels.find((h) => h.id === hotelId);
      if (!hotel) {
        return NextResponse.json({ error: 'Hotel not found' }, { status: 404 });
      }
      
      // Удаляем существующие комнаты этого отеля
      const existingRooms = await getRooms(hotelId);
      for (const room of existingRooms) {
        await deleteRoom(room.id);
      }
      
      // Генерируем новые комнаты
      const newRooms = generateRoomsForHotel(
        hotelId, 
        template || 'legacy'
      );
      
      // Создаем новые комнаты
      for (const room of newRooms) {
        await createRoom(room);
      }
      
      // Логируем генерацию комнат
      const duration = Date.now() - startTime;
      await logActivity({
        userId: undefined, // Будет заполнено на клиенте
        userName: 'Система',
        userRole: undefined, // Будет заполнено на клиенте
        action: 'rooms_generated',
        entity: 'room',
        details: {
          generateForAll: false,
          hotelId,
          hotelName: hotel.name,
          roomsCount: newRooms.length,
          deletedRoomsCount: existingRooms.length,
          template: template || 'legacy',
        },
        status: 'success',
        ipAddress: ipAddress.split(',')[0].trim(),
        userAgent,
        duration,
      }).catch(() => {
        // Тихо игнорируем ошибки логирования
      });
      
      return NextResponse.json({ 
        success: true, 
        message: `Сгенерировано ${newRooms.length} комнат для отеля ${hotel.name}`,
        rooms: newRooms 
      });
    }
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Ошибка при генерации комнат';
    const duration = Date.now() - startTime;
    
    // Логируем ошибку генерации комнат
    const ipAddress = request.headers.get('x-forwarded-for') || 
                      request.headers.get('x-real-ip') || 
                      'unknown';
    const userAgent = request.headers.get('user-agent') || 'unknown';
    
    await logActivity({
      userId: undefined,
      userName: 'Система',
      userRole: undefined,
      action: 'rooms_generated',
      entity: 'room',
      details: {
        error: errorMessage,
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






