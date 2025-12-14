import { NextRequest, NextResponse } from 'next/server';
import { getStairs, createStairs } from '@/lib/db';
import { logActivity } from '@/lib/logger';

// GET /api/stairs
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const hotelId = searchParams.get('hotelId');
    
    const stairs = await getStairs(hotelId || undefined);
    
    return NextResponse.json(stairs);
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Internal server error';
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}

// POST /api/stairs
export async function POST(request: NextRequest) {
  const startTime = Date.now();
  let newStairs;
  
  try {
    const body = await request.json();
    
    // Получаем IP адрес и User-Agent из запроса
    const ipAddress = request.headers.get('x-forwarded-for') || 
                      request.headers.get('x-real-ip') || 
                      'unknown';
    const userAgent = request.headers.get('user-agent') || 'unknown';
    
    newStairs = await createStairs(body);
    
    // Логируем создание лестницы
    const duration = Date.now() - startTime;
    await logActivity({
      userId: undefined, // Будет заполнено на клиенте
      userName: 'Система',
      userRole: undefined, // Будет заполнено на клиенте
      action: 'stairs_created',
      entity: 'stairs',
      entityId: newStairs.id,
      details: {
        hotelId: newStairs.hotelId,
        floor: newStairs.floor,
        targetFloor: newStairs.targetFloor,
        direction: newStairs.direction,
      },
      status: 'success',
      ipAddress: ipAddress.split(',')[0].trim(),
      userAgent,
      duration,
    }).catch(() => {
      // Тихо игнорируем ошибки логирования
    });
    
    return NextResponse.json(newStairs);
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Ошибка при создании лестницы';
    const duration = Date.now() - startTime;
    
    // Логируем ошибку создания лестницы
    const ipAddress = request.headers.get('x-forwarded-for') || 
                      request.headers.get('x-real-ip') || 
                      'unknown';
    const userAgent = request.headers.get('user-agent') || 'unknown';
    
    await logActivity({
      userId: undefined,
      userName: 'Система',
      userRole: undefined,
      action: 'stairs_created',
      entity: 'stairs',
      entityId: newStairs?.id,
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






