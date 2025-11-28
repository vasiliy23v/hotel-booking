import { NextRequest, NextResponse } from 'next/server';
import { getBookings, getRooms } from '@/lib/db';
import type { BookingInfo, Room } from '@/types';

// GET /api/cash-monitoring
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const hotelId = searchParams.get('hotelId');
    
    let bookings = await getBookings(undefined, hotelId || undefined);
    
    // Логирование для отладки
    if (process.env.NODE_ENV === 'development') {
      console.log('Cash Monitoring Debug:', {
        hotelId,
        totalBookings: bookings.length,
        bookingsWithPayment: bookings.filter(b => b.isPaid).length,
        cashBookings: bookings.filter(b => b.isPaid && b.paymentMethod === 'cash').length,
        sampleBookings: bookings.slice(0, 3).map(b => ({
          id: b.id,
          isPaid: b.isPaid,
          paymentMethod: b.paymentMethod,
          amount: b.amount,
          paymentDate: b.paymentDate,
        })),
      });
    }
    
    // Фильтруем только оплаченные наличными
    const cashBookings = bookings.filter(
      (b: BookingInfo) => b.isPaid && b.paymentMethod === 'cash'
    );
    
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const weekAgo = new Date(today);
    weekAgo.setDate(weekAgo.getDate() - 7);
    const monthAgo = new Date(today);
    monthAgo.setMonth(monthAgo.getMonth() - 1);
    
    let totalCash = 0;
    let cashToday = 0;
    let cashThisWeek = 0;
    let cashThisMonth = 0;
    const recentCashPayments: Array<{
      bookingId: string;
      amount: number;
      date: string;
      bookedBy: string;
      roomNumber: string;
    }> = [];
    
    // Получаем все комнаты для поиска номеров
    const rooms = await getRooms(hotelId || undefined);
    const roomsMap = new Map(rooms.map((r: Room) => [r.id, r]));
    
    cashBookings.forEach((booking: BookingInfo) => {
      const amount = booking.amount || 0;
      totalCash += amount;
      
      if (booking.paymentDate) {
        const paymentDate = new Date(booking.paymentDate);
        
        if (paymentDate >= today) {
          cashToday += amount;
        }
        if (paymentDate >= weekAgo) {
          cashThisWeek += amount;
        }
        if (paymentDate >= monthAgo) {
          cashThisMonth += amount;
        }
        
        // Добавляем в список последних платежей (за последние 30 дней)
        if (paymentDate >= monthAgo) {
          const room = roomsMap.get(booking.roomId);
          recentCashPayments.push({
            bookingId: booking.id || '',
            amount: amount,
            date: booking.paymentDate,
            bookedBy: booking.bookedBy,
            roomNumber: room?.number || 'N/A'
          });
        }
      }
    });
    
    // Сортируем по дате (новые сначала)
    recentCashPayments.sort((a, b) => 
      new Date(b.date).getTime() - new Date(a.date).getTime()
    );
    
    return NextResponse.json({
      totalCash,
      cashToday,
      cashThisWeek,
      cashThisMonth,
      recentCashPayments: recentCashPayments.slice(0, 50) // Последние 50 платежей
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}


