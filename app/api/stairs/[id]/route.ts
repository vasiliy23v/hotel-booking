import { NextRequest, NextResponse } from 'next/server';
import { getStairsById, updateStairs, deleteStairs } from '@/lib/db';
import { logActivity } from '@/lib/logger';

// GET /api/stairs/[id]
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const stairs = await getStairsById(id);
    
    if (!stairs) {
      return NextResponse.json({ error: 'Stairs not found' }, { status: 404 });
    }
    
    return NextResponse.json(stairs);
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Internal server error';
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}

// PUT /api/stairs/[id]
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const startTime = Date.now();
  let updatedStairs;
  let currentStairs;
  
  try {
    const { id } = await params;
    const body = await request.json();
    
    // Получаем текущую лестницу для логирования изменений
    currentStairs = await getStairsById(id);
    
    // Получаем IP адрес и User-Agent из запроса
    const ipAddress = request.headers.get('x-forwarded-for') || 
                      request.headers.get('x-real-ip') || 
                      'unknown';
    const userAgent = request.headers.get('user-agent') || 'unknown';
    
    updatedStairs = await updateStairs(id, body);
    
    // Логируем обновление лестницы
    const duration = Date.now() - startTime;
    await logActivity({
      userId: undefined, // Будет заполнено на клиенте
      userName: 'Система',
      userRole: undefined, // Будет заполнено на клиенте
      action: 'stairs_updated',
      entity: 'stairs',
      entityId: updatedStairs.id,
      details: {
        hotelId: updatedStairs.hotelId,
        floor: updatedStairs.floor,
        targetFloor: updatedStairs.targetFloor,
        direction: updatedStairs.direction,
        changes: {
          floor: currentStairs?.floor !== updatedStairs.floor ? { from: currentStairs?.floor, to: updatedStairs.floor } : undefined,
          targetFloor: currentStairs?.targetFloor !== updatedStairs.targetFloor ? { from: currentStairs?.targetFloor, to: updatedStairs.targetFloor } : undefined,
          direction: currentStairs?.direction !== updatedStairs.direction ? { from: currentStairs?.direction, to: updatedStairs.direction } : undefined,
        },
      },
      status: 'success',
      ipAddress: ipAddress.split(',')[0].trim(),
      userAgent,
      duration,
    }).catch(() => {
      // Тихо игнорируем ошибки логирования
    });
    
    return NextResponse.json(updatedStairs);
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Ошибка при обновлении лестницы';
    const duration = Date.now() - startTime;
    
    // Логируем ошибку обновления лестницы
    const ipAddress = request.headers.get('x-forwarded-for') || 
                      request.headers.get('x-real-ip') || 
                      'unknown';
    const userAgent = request.headers.get('user-agent') || 'unknown';
    
    await logActivity({
      userId: undefined,
      userName: 'Система',
      userRole: undefined,
      action: 'stairs_updated',
      entity: 'stairs',
      entityId: (await params).id,
      details: {
        error: errorMessage,
        currentStairs: currentStairs ? {
          hotelId: currentStairs.hotelId,
          floor: currentStairs.floor,
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
    
    if (errorMessage === 'Лестница не найдена') {
      return NextResponse.json({ error: 'Stairs not found' }, { status: 404 });
    }
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}

// DELETE /api/stairs/[id]
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    await deleteStairs(id);
    
    return NextResponse.json({ success: true });
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Internal server error';
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}






