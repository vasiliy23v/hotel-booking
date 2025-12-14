import { NextRequest, NextResponse } from 'next/server';
import {
  getAllBookingDateRanges,
  createBookingDateRange,
  getActiveBookingDateRanges,
} from '@/lib/db';
import { logActivity } from '@/lib/logger';

// GET /api/booking-date-ranges
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const activeOnly = searchParams.get('activeOnly') === 'true';

    const ranges = activeOnly
      ? await getActiveBookingDateRanges()
      : await getAllBookingDateRanges();

    return NextResponse.json(ranges);
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Неизвестная ошибка';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

// POST /api/booking-date-ranges
export async function POST(request: NextRequest) {
  const startTime = Date.now();
  let newRange;
  
  try {
    const body = await request.json();
    
    // Получаем IP адрес и User-Agent из запроса
    const ipAddress = request.headers.get('x-forwarded-for') || 
                      request.headers.get('x-real-ip') || 
                      'unknown';
    const userAgent = request.headers.get('user-agent') || 'unknown';
    
    newRange = await createBookingDateRange(body);

    // Логируем создание диапазона дат
    const duration = Date.now() - startTime;
    await logActivity({
      userId: undefined, // Будет заполнено на клиенте
      userName: 'Система',
      userRole: undefined, // Будет заполнено на клиенте
      action: 'booking_date_range_created',
      entity: 'booking_date_range',
      entityId: newRange.id,
      details: {
        startDate: newRange.startDate,
        endDate: newRange.endDate,
        isActive: newRange.isActive,
      },
      status: 'success',
      ipAddress: ipAddress.split(',')[0].trim(),
      userAgent,
      duration,
    }).catch(() => {
      // Тихо игнорируем ошибки логирования
    });

    return NextResponse.json(newRange);
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Ошибка при создании диапазона дат';
    const duration = Date.now() - startTime;
    
    // Логируем ошибку создания диапазона дат
    const ipAddress = request.headers.get('x-forwarded-for') || 
                      request.headers.get('x-real-ip') || 
                      'unknown';
    const userAgent = request.headers.get('user-agent') || 'unknown';
    
    await logActivity({
      userId: undefined,
      userName: 'Система',
      userRole: undefined,
      action: 'booking_date_range_created',
      entity: 'booking_date_range',
      entityId: newRange?.id,
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
    
    if (errorMessage.includes('Дата начала') || errorMessage.includes('формат')) {
      return NextResponse.json({ error: errorMessage }, { status: 400 });
    }
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}





