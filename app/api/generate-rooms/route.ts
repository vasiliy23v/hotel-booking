import { NextRequest, NextResponse } from 'next/server';
import { getHotels, getRooms, deleteRoom, createRoom } from '@/lib/db';
import { generateRoomsForHotel, generateAllRooms } from '@/lib/generateRooms';

// POST /api/generate-rooms
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { hotelId, template, generateForAll } = body;
    
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
      
      return NextResponse.json({ 
        success: true, 
        message: `Сгенерировано ${newRooms.length} комнат для отеля ${hotel.name}`,
        rooms: newRooms 
      });
    }
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}






