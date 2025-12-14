import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET /api/bookings/stats
export async function GET() {
  try {
    // Проверяем подключение перед запросами
    await prisma.$connect();
    
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
    const errorStack = error instanceof Error ? error.stack : undefined;
    console.error('Error stack:', errorStack);
    console.error('DATABASE_URL exists:', !!process.env.DATABASE_URL);
    return NextResponse.json(
      { 
        error: errorMessage,
        stack: process.env.NODE_ENV === 'development' ? errorStack : undefined
      },
      { status: 500 }
    );
  }
}




