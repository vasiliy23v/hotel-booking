import { NextRequest, NextResponse } from 'next/server';
import { getHotels, createHotel } from '@/lib/db';
import { logActivity } from '@/lib/logger';

// GET /api/hotels
export async function GET() {
  try {
    const hotels = await getHotels();
    return NextResponse.json(hotels);
  } catch (error: unknown) {
    console.error('Error in GET /api/hotels:', error);
    const errorMessage = error instanceof Error ? error.message : 'Internal server error';
    const errorStack = error instanceof Error ? error.stack : undefined;
    return NextResponse.json({ 
      error: errorMessage,
      stack: process.env.NODE_ENV === 'development' ? errorStack : undefined
    }, { status: 500 });
  }
}

// POST /api/hotels
export async function POST(request: NextRequest) {
  const startTime = Date.now();
  let newHotel;
  
  try {
    const body = await request.json();
    
    // Получаем IP адрес и User-Agent из запроса
    const ipAddress = request.headers.get('x-forwarded-for') || 
                      request.headers.get('x-real-ip') || 
                      'unknown';
    const userAgent = request.headers.get('user-agent') || 'unknown';
    
    newHotel = await createHotel(body);
    
    // Логируем создание отеля
    const duration = Date.now() - startTime;
    await logActivity({
      userId: undefined, // Будет заполнено на клиенте
      userName: 'Система',
      userRole: undefined, // Будет заполнено на клиенте
      action: 'hotel_created',
      entity: 'hotel',
      entityId: newHotel.id,
      details: {
        name: newHotel.name,
        address: newHotel.address,
        floors: newHotel.floors,
        hasEGFloor: newHotel.hasEGFloor,
      },
      status: 'success',
      ipAddress: ipAddress.split(',')[0].trim(),
      userAgent,
      duration,
    }).catch(() => {
      // Тихо игнорируем ошибки логирования
    });
    
    return NextResponse.json(newHotel);
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Ошибка при создании отеля';
    const duration = Date.now() - startTime;
    
    // Логируем ошибку создания отеля
    const ipAddress = request.headers.get('x-forwarded-for') || 
                      request.headers.get('x-real-ip') || 
                      'unknown';
    const userAgent = request.headers.get('user-agent') || 'unknown';
    
    await logActivity({
      userId: undefined,
      userName: 'Система',
      userRole: undefined,
      action: 'hotel_created',
      entity: 'hotel',
      entityId: newHotel?.id,
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






