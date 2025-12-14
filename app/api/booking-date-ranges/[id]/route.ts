import { NextRequest, NextResponse } from 'next/server';
import {
  updateBookingDateRange,
  deleteBookingDateRange,
} from '@/lib/db';
import { logActivity } from '@/lib/logger';

// PUT /api/booking-date-ranges/[id]
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const startTime = Date.now();
  let updatedRange;
  
  try {
    const { id } = await params;
    const body = await request.json();
    
    // Получаем IP адрес и User-Agent из запроса
    const ipAddress = request.headers.get('x-forwarded-for') || 
                      request.headers.get('x-real-ip') || 
                      'unknown';
    const userAgent = request.headers.get('user-agent') || 'unknown';
    
    updatedRange = await updateBookingDateRange(id, body);

    // Логируем обновление диапазона дат
    const duration = Date.now() - startTime;
    await logActivity({
      userId: undefined, // Будет заполнено на клиенте
      userName: 'Система',
      userRole: undefined, // Будет заполнено на клиенте
      action: 'booking_date_range_updated',
      entity: 'booking_date_range',
      entityId: updatedRange.id,
      details: {
        startDate: updatedRange.startDate,
        endDate: updatedRange.endDate,
        isActive: updatedRange.isActive,
      },
      status: 'success',
      ipAddress: ipAddress.split(',')[0].trim(),
      userAgent,
      duration,
    }).catch(() => {
      // Тихо игнорируем ошибки логирования
    });

    return NextResponse.json(updatedRange);
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Ошибка при обновлении диапазона дат';
    const duration = Date.now() - startTime;
    
    // Логируем ошибку обновления диапазона дат
    const ipAddress = request.headers.get('x-forwarded-for') || 
                      request.headers.get('x-real-ip') || 
                      'unknown';
    const userAgent = request.headers.get('user-agent') || 'unknown';
    
    await logActivity({
      userId: undefined,
      userName: 'Система',
      userRole: undefined,
      action: 'booking_date_range_updated',
      entity: 'booking_date_range',
      entityId: (await params).id,
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
    
    if (errorMessage && (errorMessage.includes('Дата начала') || errorMessage.includes('не найдено'))) {
      return NextResponse.json({ error: errorMessage }, { status: 400 });
    }
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}

// DELETE /api/booking-date-ranges/[id]
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    await deleteBookingDateRange(id);
    return NextResponse.json({ success: true });
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Ошибка при удалении диапазона дат';
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}

