import { NextRequest, NextResponse } from 'next/server';
import { updateBooking, getBookingById } from '@/lib/db';

// PUT /api/bookings/[id]/confirm
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { confirmedBy } = body;
    
    const updatedBooking = await updateBooking(id, {
      isConfirmed: true,
      confirmedBy: confirmedBy || 'system',
      confirmedDate: new Date().toISOString()
    });
    
    return NextResponse.json(updatedBooking);
  } catch (error: any) {
    if (error.message === 'Бронирование не найдено') {
      return NextResponse.json({ error: 'Booking not found' }, { status: 404 });
    }
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}


