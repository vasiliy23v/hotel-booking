import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET /api/bookings/stats
export async function GET() {
  try {
    // Подсчет неподтвержденных бронирований
    const unconfirmedCount = await prisma.booking.count({
      where: {
        isConfirmed: false,
      },
    });

    // Подсчет неоплаченных бронирований (подтвержденных, но не оплаченных)
    const unpaidCount = await prisma.booking.count({
      where: {
        isConfirmed: true,
        isPaid: false,
      },
    });

    return NextResponse.json({
      unconfirmed: unconfirmedCount,
      unpaid: unpaidCount,
    });
  } catch (error: unknown) {
    console.error('Error fetching booking stats:', error);
    const errorMessage = error instanceof Error ? error.message : 'Internal server error';
    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    );
  }
}




