import { NextRequest, NextResponse } from 'next/server';
import { readData, writeData } from '@/lib/data';
import { generateRoomsForHotel, generateAllRooms } from '@/lib/generateRooms';

// POST /api/generate-rooms
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { hotelId, template, generateForAll } = body;
    
    const data = readData();
    
    if (generateForAll) {
      // Генерируем комнаты для всех отелей
      const hotels = data.hotels || [];
      const newRooms = generateAllRooms(hotels);
      
      // Удаляем существующие комнаты
      data.rooms = [];
      data.rooms = newRooms;
      
      writeData(data);
      
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
      const hotel = data.hotels?.find((h: any) => h.id === hotelId);
      if (!hotel) {
        return NextResponse.json({ error: 'Hotel not found' }, { status: 404 });
      }
      
      // Удаляем существующие комнаты этого отеля
      if (data.rooms) {
        data.rooms = data.rooms.filter((r: any) => r.hotelId !== hotelId);
      }
      
      // Генерируем новые комнаты
      const newRooms = generateRoomsForHotel(
        hotelId, 
        template || 'legacy'
      );
      
      if (!data.rooms) data.rooms = [];
      data.rooms.push(...newRooms);
      
      writeData(data);
      
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






