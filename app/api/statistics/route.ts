import { NextRequest, NextResponse } from 'next/server';
import { getRooms } from '@/lib/db';
import type { Room } from '@/types';

// GET /api/statistics
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const hotelId = searchParams.get('hotelId');
    
    // Получаем комнаты с активными бронированиями
    const rooms = await getRooms(hotelId || undefined);
    
    // getRooms уже загружает активные бронирования для каждой комнаты
    const roomsWithBookings = rooms;
    
    // Исключаем общие комнаты из статистики
    const nonCommonRooms = roomsWithBookings.filter((r: Room) => !r.isCommon);
    
    const totalRooms = nonCommonRooms.length;
    // Свободные комнаты - те, у которых нет бронирования (и не общие)
    const availableRooms = nonCommonRooms.filter((r: Room) => !r.booking).length;
    // Забронированные комнаты - те, у которых есть бронирование (независимо от количества гостей)
    const bookedRooms = nonCommonRooms.filter((r: Room) => r.booking).length;
    const commonRooms = roomsWithBookings.filter((r: Room) => r.isCommon).length;
    
    // Собираем всех гостей из активных бронирований
    const allGuests = roomsWithBookings
      .filter((r: Room) => r.booking && r.booking.guests)
      .flatMap((r: Room) => {
        const guests = r.booking?.guests || [];
        return Array.isArray(guests) ? guests : [];
      });
    
    // Подсчитываем уникальных гостей по email или name
    const uniqueGuests = new Set<string>();
    allGuests.forEach((g: { email?: string; name?: string }) => {
      if (g?.email) {
        uniqueGuests.add(g.email);
      } else if (g?.name) {
        uniqueGuests.add(g.name);
      }
    });
    const totalGuests = uniqueGuests.size;
    
    const activeBookings = bookedRooms;
    
    // Подсчитываем доход от активных бронирований (только ОПЛАЧЕННЫЕ)
    const revenue = roomsWithBookings
      .filter((r: Room) => r.booking && r.booking.isPaid && r.price)
      .reduce((sum: number, r: Room) => {
        try {
          // Рассчитываем сумму бронирования
          let expectedAmount: number;
          if (r.booking!.amount) {
            expectedAmount = Number(r.booking!.amount);
          } else {
            const checkIn = new Date(r.booking!.checkIn);
            const checkOut = new Date(r.booking!.checkOut);
            const nights = Math.ceil((checkOut.getTime() - checkIn.getTime()) / (1000 * 60 * 60 * 24));
            
            if (r.pricePerPerson && r.booking!.guests) {
              // Для perPerson комнат учитываем количество гостей
              const guestsCount = Array.isArray(r.booking!.guests) ? r.booking!.guests.length : 0;
              expectedAmount = Number(r.price) * nights * guestsCount;
            } else {
              expectedAmount = Number(r.price) * nights;
            }
          }
          
          return sum + expectedAmount;
        } catch (e) {
          console.error('Error calculating revenue for room:', r.id, e);
          return sum;
        }
      }, 0);
    
    // Подсчитываем сумму к оплате (неоплаченные бронирования)
    const amountToPay = roomsWithBookings
      .filter((r: Room) => r.booking && !r.booking.isPaid && r.price)
      .reduce((sum: number, r: Room) => {
        try {
          const checkIn = new Date(r.booking!.checkIn);
          const checkOut = new Date(r.booking!.checkOut);
          const nights = Math.ceil((checkOut.getTime() - checkIn.getTime()) / (1000 * 60 * 60 * 24));
          
          let expectedAmount: number;
          if (r.booking!.amount) {
            // Если есть сохранённая сумма, используем её
            expectedAmount = Number(r.booking!.amount);
          } else if (r.pricePerPerson && r.booking!.guests) {
            // Для perPerson комнат учитываем количество гостей
            const guestsCount = Array.isArray(r.booking!.guests) ? r.booking!.guests.length : 0;
            expectedAmount = Number(r.price) * nights * guestsCount;
          } else {
            expectedAmount = Number(r.price) * nights;
          }
          
          // Если уже была частичная оплата, вычитаем её
          // Но только если amount не установлен (для старых бронирований)
          const alreadyPaid = r.booking!.amount ? 0 : 0;
          const remainingAmount = Math.max(0, expectedAmount - alreadyPaid);
          return sum + remainingAmount;
        } catch (e) {
          console.error('Error calculating amount to pay for room:', r.id, e);
          return sum;
        }
      }, 0);
    
    const roomsByType = {
      FZ: roomsWithBookings.filter((r: Room) => r.type === 'FZ').length,
      DZ: roomsWithBookings.filter((r: Room) => r.type === 'DZ').length,
      EZ: roomsWithBookings.filter((r: Room) => r.type === 'EZ').length,
      MZ: roomsWithBookings.filter((r: Room) => r.type === 'MZ').length,
      App: roomsWithBookings.filter((r: Room) => r.type === 'App').length,
      COMMON: roomsWithBookings.filter((r: Room) => r.type === 'COMMON').length
    };
    
    const roomsByFloor = {
      EG: roomsWithBookings.filter((r: Room) => r.floor === 'EG').length,
      '1OG': roomsWithBookings.filter((r: Room) => r.floor === '1OG').length,
      '2OG': roomsWithBookings.filter((r: Room) => r.floor === '2OG').length
    };
    
    return NextResponse.json({
      totalRooms,
      availableRooms,
      bookedRooms,
      commonRooms,
      totalGuests,
      activeBookings,
      revenue,
      amountToPay,
      roomsByType,
      roomsByFloor
    });
  } catch (error: unknown) {
    console.error('Error in GET /api/statistics:', error);
    const errorMessage = error instanceof Error ? error.message : 'Internal server error';
    const errorStack = error instanceof Error ? error.stack : undefined;
    return NextResponse.json({ 
      error: errorMessage,
      stack: process.env.NODE_ENV === 'development' ? errorStack : undefined
    }, { status: 500 });
  }
}

