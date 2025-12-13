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
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// POST /api/booking-date-ranges
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const newRange = await createBookingDateRange(body);

    return NextResponse.json(newRange);
  } catch (error: any) {
    if (error.message && (error.message.includes('Дата начала') || error.message.includes('формат'))) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }
    return NextResponse.json({ error: error.message || 'Ошибка при создании диапазона дат' }, { status: 500 });
  }
}




