import { NextRequest, NextResponse } from 'next/server';
import { getHotelById, updateHotel, deleteHotel } from '@/lib/db';
import { logActivity } from '@/lib/logger';

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
  const startTime = Date.now();
  let updatedHotel;
  let currentHotel;
  
  try {
    const { id } = await params;
    const body = await request.json();
    
    // Получаем текущий отель для логирования изменений
    currentHotel = await getHotelById(id);
    
    // Получаем IP адрес и User-Agent из запроса
    const ipAddress = request.headers.get('x-forwarded-for') || 
                      request.headers.get('x-real-ip') || 
                      'unknown';
    const userAgent = request.headers.get('user-agent') || 'unknown';
    
    updatedHotel = await updateHotel(id, body);
    
    // Логируем обновление отеля
    const duration = Date.now() - startTime;
    await logActivity({
      userId: undefined, // Будет заполнено на клиенте
      userName: 'Система',
      userRole: undefined, // Будет заполнено на клиенте
      action: 'hotel_updated',
      entity: 'hotel',
      entityId: updatedHotel.id,
      details: {
        name: updatedHotel.name,
        address: updatedHotel.address,
        floors: updatedHotel.floors,
        hasEGFloor: updatedHotel.hasEGFloor,
        changes: {
          name: currentHotel?.name !== updatedHotel.name ? { from: currentHotel?.name, to: updatedHotel.name } : undefined,
          address: currentHotel?.address !== updatedHotel.address ? { from: currentHotel?.address, to: updatedHotel.address } : undefined,
          floors: currentHotel?.floors !== updatedHotel.floors ? { from: currentHotel?.floors, to: updatedHotel.floors } : undefined,
        },
      },
      status: 'success',
      ipAddress: ipAddress.split(',')[0].trim(),
      userAgent,
      duration,
    }).catch(() => {
      // Тихо игнорируем ошибки логирования
    });
    
    return NextResponse.json(updatedHotel);
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Ошибка при обновлении отеля';
    const duration = Date.now() - startTime;
    
    // Логируем ошибку обновления отеля
    const ipAddress = request.headers.get('x-forwarded-for') || 
                      request.headers.get('x-real-ip') || 
                      'unknown';
    const userAgent = request.headers.get('user-agent') || 'unknown';
    
    await logActivity({
      userId: undefined,
      userName: 'Система',
      userRole: undefined,
      action: 'hotel_updated',
      entity: 'hotel',
      entityId: (await params).id,
      details: {
        error: errorMessage,
        currentHotel: currentHotel ? {
          name: currentHotel.name,
          id: currentHotel.id,
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

