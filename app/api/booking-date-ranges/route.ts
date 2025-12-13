import { NextRequest, NextResponse } from 'next/server';
import {
  getAllBookingDateRanges,
  createBookingDateRange,
  getActiveBookingDateRanges,
} from '@/lib/db';

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
  try {
    const body = await request.json();
    const newRange = await createBookingDateRange(body);

    return NextResponse.json(newRange);
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Ошибка при создании диапазона дат';
    if (errorMessage.includes('Дата начала') || errorMessage.includes('формат')) {
      return NextResponse.json({ error: errorMessage }, { status: 400 });
    }
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}





