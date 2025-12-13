import { NextRequest, NextResponse } from 'next/server';
import {
  updateBookingDateRange,
  deleteBookingDateRange,
} from '@/lib/db';

// PUT /api/booking-date-ranges/[id]
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const updatedRange = await updateBookingDateRange(id, body);

    return NextResponse.json(updatedRange);
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Ошибка при обновлении диапазона дат';
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

