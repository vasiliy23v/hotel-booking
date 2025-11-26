'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { BookOpen, Filter, X, ArrowUpDown, ArrowUp, ArrowDown, Building2, LogOut, ArrowLeft, CheckCircle, CreditCard, Euro, DollarSign } from 'lucide-react';
import { api } from '@/lib/api';
import type { User, Room, Hotel, BookingInfo } from '@/types';
import Link from 'next/link';

export default function BookingsPage() {
  const router = useRouter();
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [bookings, setBookings] = useState<(BookingInfo & { roomNumber?: string; hotelName?: string })[]>([]);
  const [rooms, setRooms] = useState<Room[]>([]);
  const [hotels, setHotels] = useState<Hotel[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Фильтры
  const [filterBookedBy, setFilterBookedBy] = useState<string>('');
  const [filterRoomNumber, setFilterRoomNumber] = useState<string>('');
  const [filterDateFrom, setFilterDateFrom] = useState<string>('');
  const [filterDateTo, setFilterDateTo] = useState<string>('');
  const [showFilters, setShowFilters] = useState(false);
  
  // Сортировка
  const [sortBy, setSortBy] = useState<'checkIn' | 'checkOut' | 'bookedDate' | 'bookedBy' | 'roomNumber'>('checkIn');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
  
  // Модальное окно для оплаты
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [selectedBookingForPayment, setSelectedBookingForPayment] = useState<(BookingInfo & { roomNumber?: string; hotelName?: string }) | null>(null);
  const [paymentMethod, setPaymentMethod] = useState<'cash' | 'transfer'>('cash');
  const [paymentAmount, setPaymentAmount] = useState<number>(0);

  useEffect(() => {
    const userStr = localStorage.getItem('currentUser');
    if (!userStr) {
      router.push('/');
      return;
    }

    const user = JSON.parse(userStr);
    
    // Менеджеры перенаправляются на CMS
    if (user.role === 'manager') {
      router.push('/cms/dashboard');
      return;
    }

    setCurrentUser(user);
    loadBookings();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router]);

  const loadBookings = async () => {
    try {
      setLoading(true);
      const [bookingsData, roomsData, hotelsData] = await Promise.all([
        api.getBookings(),
        api.getRooms(),
        api.getHotels()
      ]);

      setRooms(roomsData);
      setHotels(hotelsData);

      // Обогащаем бронирования информацией о комнатах и отелях
      const enrichedBookings = bookingsData.map((booking: BookingInfo) => {
        const room = roomsData.find((r: Room) => r.id === booking.roomId);
        const hotel = hotelsData.find((h: Hotel) => h.id === room?.hotelId);
        return {
          ...booking,
          roomNumber: room?.number || 'N/A',
          hotelName: hotel?.name || 'N/A'
        };
      });

      setBookings(enrichedBookings);
    } catch (error) {
      console.error('Error loading bookings:', error);
      setBookings([]);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = async (booking: BookingInfo & { roomNumber?: string }) => {
    if (!confirm(`Вы уверены, что хотите отменить бронирование комнаты #${booking.roomNumber}?`)) {
      return;
    }

    try {
      if (booking.id) {
        await api.deleteBooking(booking.id);
      }
      // Обновляем список бронирований
      await loadBookings();
    } catch (error) {
      console.error('Error canceling booking:', error);
      alert('Ошибка при отмене бронирования');
    }
  };

  const handleConfirmBooking = async (booking: BookingInfo) => {
    if (!booking.id) return;
    
    try {
      await api.confirmBooking(booking.id, currentUser?.name || 'system');
      await loadBookings();
    } catch (error) {
      console.error('Error confirming booking:', error);
      alert('Ошибка при подтверждении бронирования');
    }
  };

  const handleOpenPaymentModal = (booking: BookingInfo) => {
    // Находим обогащенное бронирование из массива bookings, которое содержит roomNumber
    const enrichedBooking = bookings.find(b => b.id === booking.id) || booking;
    const room = rooms.find(r => r.id === booking.roomId);
    if (room && room.price) {
      const checkIn = new Date(booking.checkIn);
      const checkOut = new Date(booking.checkOut);
      const nights = Math.ceil((checkOut.getTime() - checkIn.getTime()) / (1000 * 60 * 60 * 24));
      setPaymentAmount(nights * room.price);
    } else {
      setPaymentAmount(booking.amount || 0);
    }
    setSelectedBookingForPayment(enrichedBooking);
    setShowPaymentModal(true);
  };

  const handleConfirmPayment = async () => {
    if (!selectedBookingForPayment?.id) return;
    
    try {
      await api.confirmPayment(
        selectedBookingForPayment.id,
        paymentMethod,
        paymentAmount || undefined,
        currentUser?.name || 'system'
      );
      setShowPaymentModal(false);
      setSelectedBookingForPayment(null);
      await loadBookings();
    } catch (error) {
      console.error('Error confirming payment:', error);
      alert('Ошибка при подтверждении оплаты');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('currentUser');
    router.push('/');
  };

  if (loading || !currentUser) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-lg text-gray-900">Загрузка...</div>
      </div>
    );
  }

  // Фильтруем бронирования: менеджер видит все, гость - только свои
  let filteredBookings = currentUser.role === 'manager' 
    ? bookings 
    : bookings.filter(b => b.bookedBy === currentUser.name);

  // Применяем фильтры
  if (filterBookedBy) {
    filteredBookings = filteredBookings.filter(b => 
      b.bookedBy.toLowerCase().includes(filterBookedBy.toLowerCase())
    );
  }
  if (filterRoomNumber) {
    filteredBookings = filteredBookings.filter(b => 
      b.roomNumber?.toLowerCase().includes(filterRoomNumber.toLowerCase())
    );
  }
  if (filterDateFrom) {
    filteredBookings = filteredBookings.filter(b => 
      new Date(b.checkIn) >= new Date(filterDateFrom)
    );
  }
  if (filterDateTo) {
    filteredBookings = filteredBookings.filter(b => 
      new Date(b.checkIn) <= new Date(filterDateTo)
    );
  }

  // Применяем сортировку
  filteredBookings.sort((a, b) => {
    let comparison = 0;
    switch (sortBy) {
      case 'checkIn':
        comparison = new Date(a.checkIn).getTime() - new Date(b.checkIn).getTime();
        break;
      case 'checkOut':
        comparison = new Date(a.checkOut).getTime() - new Date(b.checkOut).getTime();
        break;
      case 'bookedDate':
        comparison = new Date(a.bookedDate).getTime() - new Date(b.bookedDate).getTime();
        break;
      case 'bookedBy':
        comparison = a.bookedBy.localeCompare(b.bookedBy);
        break;
      case 'roomNumber':
        comparison = (a.roomNumber || '').localeCompare(b.roomNumber || '');
        break;
    }
    return sortDirection === 'asc' ? comparison : -comparison;
  });

  const handleSort = (column: typeof sortBy) => {
    if (sortBy === column) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(column);
      setSortDirection('asc');
    }
  };

  const resetFilters = () => {
    setFilterBookedBy('');
    setFilterRoomNumber('');
    setFilterDateFrom('');
    setFilterDateTo('');
  };

  const hasActiveFilters = filterBookedBy || filterRoomNumber || filterDateFrom || filterDateTo;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-20">
        <div className="max-w-7xl mx-auto px-3 sm:px-4 py-2 sm:py-3">
          <div className="flex justify-between items-center gap-2 sm:gap-4">
            <div className="flex items-center gap-2 sm:gap-3 min-w-0">
              <Link
                href="/dashboard"
                className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
                title="Назад к дашборду"
              >
                <ArrowLeft className="w-5 h-5" />
              </Link>
              <Link href="/" prefetch={false} className="flex items-center gap-2 sm:gap-3 min-w-0 hover:opacity-80 transition-opacity">
                <Building2 className="w-5 h-5 sm:w-6 sm:h-6 text-gray-700 shrink-0" />
                <h1 className="text-lg sm:text-xl font-bold text-gray-900 truncate cursor-pointer">Hotel Booking</h1>
              </Link>
              <span className={`hidden sm:inline text-xs px-2 py-0.5 rounded ${
                currentUser.role === 'manager' 
                  ? 'bg-gray-700 text-white' 
                  : 'bg-gray-100 text-gray-700'
              } font-semibold`}>
                {currentUser.role === 'manager' ? 'Менеджер' : 'Гость'}
              </span>
            </div>

            <div className="flex items-center gap-2 sm:gap-3">
              <button
                onClick={handleLogout}
                className="bg-gray-900 hover:bg-gray-800 text-white px-2 sm:px-3 py-1.5 sm:py-2 rounded-lg text-xs sm:text-sm font-semibold transition-colors flex items-center gap-1 sm:gap-2"
              >
                <LogOut className="w-3 h-3 sm:w-4 sm:h-4" />
                <span className="hidden sm:inline">Выйти</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="max-w-7xl mx-auto px-3 sm:px-4 py-4 sm:py-6 lg:py-8">
        <div className="bg-white rounded-lg border border-gray-200 p-4 sm:p-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 sm:gap-4 mb-4 sm:mb-6">
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900 flex items-center gap-2">
              <BookOpen className="w-5 h-5 sm:w-6 sm:h-6" />
              {currentUser.role === 'manager' ? 'Бронирования' : 'Мои бронирования'}
            </h2>
            
            <div className="flex gap-2 w-full sm:w-auto">
              {hasActiveFilters && (
                <button
                  onClick={resetFilters}
                  className="px-3 py-1.5 rounded-lg text-xs sm:text-sm font-semibold transition-colors flex items-center gap-1.5 bg-white text-gray-700 border border-gray-200 hover:bg-gray-50"
                >
                  <X className="w-3 h-3 sm:w-4 sm:h-4" />
                  <span className="hidden sm:inline">Сбросить</span>
                </button>
              )}
              <button
                onClick={() => setShowFilters(!showFilters)}
                className={`px-3 py-1.5 rounded-lg text-xs sm:text-sm font-semibold transition-colors flex items-center gap-1.5 ${
                  showFilters
                    ? 'bg-gray-900 text-white'
                    : 'bg-white text-gray-700 border border-gray-200 hover:bg-gray-50'
                }`}
              >
                <Filter className="w-3 h-3 sm:w-4 sm:h-4" />
                <span className="hidden sm:inline">Фильтры</span>
              </button>
            </div>
          </div>

          {/* Панель фильтров */}
          {showFilters && (
            <div className="mb-4 p-3 sm:p-4 bg-gray-50 rounded-lg border border-gray-200">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
                {currentUser.role === 'manager' && (
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1.5">Забронировано</label>
                    <input
                      type="text"
                      value={filterBookedBy}
                      onChange={(e) => setFilterBookedBy(e.target.value)}
                      placeholder="Имя пользователя"
                      className="w-full px-2 py-1.5 rounded text-xs border border-gray-300 bg-white text-gray-700 focus:outline-none focus:border-gray-900"
                    />
                  </div>
                )}
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1.5">Номер комнаты</label>
                  <input
                    type="text"
                    value={filterRoomNumber}
                    onChange={(e) => setFilterRoomNumber(e.target.value)}
                    placeholder="Номер комнаты"
                    className="w-full px-2 py-1.5 rounded text-xs border border-gray-300 bg-white text-gray-700 focus:outline-none focus:border-gray-900"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1.5">Заезд с</label>
                  <input
                    type="date"
                    value={filterDateFrom}
                    onChange={(e) => setFilterDateFrom(e.target.value)}
                    className="w-full px-2 py-1.5 rounded text-xs border border-gray-300 bg-white text-gray-700 focus:outline-none focus:border-gray-900"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1.5">Заезд до</label>
                  <input
                    type="date"
                    value={filterDateTo}
                    onChange={(e) => setFilterDateTo(e.target.value)}
                    className="w-full px-2 py-1.5 rounded text-xs border border-gray-300 bg-white text-gray-700 focus:outline-none focus:border-gray-900"
                  />
                </div>
              </div>
            </div>
          )}

          {loading ? (
            <div className="text-center py-12">
              <div className="text-lg text-gray-900">Загрузка...</div>
            </div>
          ) : filteredBookings.length === 0 ? (
            <div className="text-center py-12">
              <BookOpen className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500 text-lg">Бронирования не найдены</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full border-collapse min-w-[1200px]">
                <thead>
                  <tr className="border-b border-gray-200 bg-gray-50">
                    {currentUser.role === 'manager' ? (
                      <>
                        <th className="px-3 py-2 text-left text-xs font-semibold text-gray-700 whitespace-nowrap">Отель</th>
                        <th className="px-3 py-2 text-left text-xs font-semibold text-gray-700 whitespace-nowrap">Комната</th>
                        <th 
                          className="px-3 py-2 text-left text-xs font-semibold text-gray-700 cursor-pointer hover:bg-gray-100 transition-colors whitespace-nowrap"
                          onClick={() => handleSort('bookedBy')}
                        >
                          <div className="flex items-center gap-1">
                            Кто бронировал
                            {sortBy === 'bookedBy' && (
                              sortDirection === 'asc' ? <ArrowUp className="w-3 h-3" /> : <ArrowDown className="w-3 h-3" />
                            )}
                            {sortBy !== 'bookedBy' && <ArrowUpDown className="w-3 h-3 text-gray-400" />}
                          </div>
                        </th>
                        <th className="px-3 py-2 text-left text-xs font-semibold text-gray-700 whitespace-nowrap">Контакты</th>
                        <th 
                          className="px-3 py-2 text-left text-xs font-semibold text-gray-700 cursor-pointer hover:bg-gray-100 transition-colors whitespace-nowrap"
                          onClick={() => handleSort('checkIn')}
                        >
                          <div className="flex items-center gap-1">
                            Заезд
                            {sortBy === 'checkIn' && (
                              sortDirection === 'asc' ? <ArrowUp className="w-3 h-3" /> : <ArrowDown className="w-3 h-3" />
                            )}
                            {sortBy !== 'checkIn' && <ArrowUpDown className="w-3 h-3 text-gray-400" />}
                          </div>
                        </th>
                        <th 
                          className="px-3 py-2 text-left text-xs font-semibold text-gray-700 cursor-pointer hover:bg-gray-100 transition-colors whitespace-nowrap"
                          onClick={() => handleSort('checkOut')}
                        >
                          <div className="flex items-center gap-1">
                            Выезд
                            {sortBy === 'checkOut' && (
                              sortDirection === 'asc' ? <ArrowUp className="w-3 h-3" /> : <ArrowDown className="w-3 h-3" />
                            )}
                            {sortBy !== 'checkOut' && <ArrowUpDown className="w-3 h-3 text-gray-400" />}
                          </div>
                        </th>
                        <th className="px-3 py-2 text-left text-xs font-semibold text-gray-700 whitespace-nowrap">Гости</th>
                        <th className="px-3 py-2 text-left text-xs font-semibold text-gray-700 whitespace-nowrap">Подтверждение</th>
                        <th className="px-3 py-2 text-left text-xs font-semibold text-gray-700 whitespace-nowrap">Оплата</th>
                        <th className="px-3 py-2 text-left text-xs font-semibold text-gray-700 whitespace-nowrap">Сумма</th>
                        <th className="px-3 py-2 text-left text-xs font-semibold text-gray-700 whitespace-nowrap">Примечания</th>
                        <th className="px-3 py-2 text-left text-xs font-semibold text-gray-700 whitespace-nowrap">Действия</th>
                      </>
                    ) : (
                      <>
                        <th 
                          className="px-3 py-2 text-left text-xs font-semibold text-gray-700 cursor-pointer hover:bg-gray-100 transition-colors"
                          onClick={() => handleSort('roomNumber')}
                        >
                          <div className="flex items-center gap-1">
                            Комната
                            {sortBy === 'roomNumber' && (
                              sortDirection === 'asc' ? <ArrowUp className="w-3 h-3" /> : <ArrowDown className="w-3 h-3" />
                            )}
                            {sortBy !== 'roomNumber' && <ArrowUpDown className="w-3 h-3 text-gray-400" />}
                          </div>
                        </th>
                        <th 
                          className="px-3 py-2 text-left text-xs font-semibold text-gray-700 cursor-pointer hover:bg-gray-100 transition-colors"
                          onClick={() => handleSort('checkIn')}
                        >
                          <div className="flex items-center gap-1">
                            Заезд
                            {sortBy === 'checkIn' && (
                              sortDirection === 'asc' ? <ArrowUp className="w-3 h-3" /> : <ArrowDown className="w-3 h-3" />
                            )}
                            {sortBy !== 'checkIn' && <ArrowUpDown className="w-3 h-3 text-gray-400" />}
                          </div>
                        </th>
                        <th 
                          className="px-3 py-2 text-left text-xs font-semibold text-gray-700 cursor-pointer hover:bg-gray-100 transition-colors"
                          onClick={() => handleSort('checkOut')}
                        >
                          <div className="flex items-center gap-1">
                            Выезд
                            {sortBy === 'checkOut' && (
                              sortDirection === 'asc' ? <ArrowUp className="w-3 h-3" /> : <ArrowDown className="w-3 h-3" />
                            )}
                            {sortBy !== 'checkOut' && <ArrowUpDown className="w-3 h-3 text-gray-400" />}
                          </div>
                        </th>
                        <th className="px-3 py-2 text-left text-xs font-semibold text-gray-700">Гости</th>
                        <th className="px-3 py-2 text-left text-xs font-semibold text-gray-700">Статус</th>
                        <th className="px-3 py-2 text-left text-xs font-semibold text-gray-700">Действия</th>
                      </>
                    )}
                  </tr>
                </thead>
                <tbody>
                  {filteredBookings.map((booking) => {
                    const nights = Math.ceil(
                      (new Date(booking.checkOut).getTime() - new Date(booking.checkIn).getTime()) / 
                      (1000 * 60 * 60 * 24)
                    );
                    const room = rooms.find(r => r.id === booking.roomId);
                    const totalPrice = booking.amount || (nights * (room?.price || 0));
                    const canCancel = currentUser.role === 'manager' || booking.bookedBy === currentUser.name;

                    if (currentUser.role === 'manager') {
                      return (
                        <tr
                          key={booking.id}
                          className="border-b border-gray-100 hover:bg-gray-50 transition-colors"
                        >
                          {/* Отель */}
                          <td className="px-3 py-2.5">
                            <div className="text-sm font-semibold text-gray-900">{booking.hotelName || 'N/A'}</div>
                          </td>
                          
                          {/* Комната */}
                          <td className="px-3 py-2.5">
                            <div className="font-semibold text-gray-900">#{booking.roomNumber || 'N/A'}</div>
                            {room && (
                              <div className="text-xs text-gray-500">
                                {room.type === 'FZ' ? 'Семейная' : room.type === 'DZ' ? 'Двухместная' : room.type === 'EZ' ? 'Одноместная' : 'Общее'}
                              </div>
                            )}
                          </td>
                          
                          {/* Кто бронировал */}
                          <td className="px-3 py-2.5">
                            <div className="text-sm font-semibold text-gray-700">{booking.bookedBy}</div>
                            <div className="text-xs text-gray-500">
                              {new Date(booking.bookedDate).toLocaleDateString('ru-RU')}
                            </div>
                          </td>
                          
                          {/* Контакты */}
                          <td className="px-3 py-2.5">
                            <div className="text-xs text-gray-700">
                              <div className="font-semibold">{booking.email}</div>
                              <div className="text-gray-500">{booking.phone}</div>
                            </div>
                          </td>
                          
                          {/* Заезд */}
                          <td className="px-3 py-2.5">
                            <div className="text-sm text-gray-700">
                              {new Date(booking.checkIn).toLocaleDateString('ru-RU')}
                            </div>
                          </td>
                          
                          {/* Выезд */}
                          <td className="px-3 py-2.5">
                            <div className="text-sm text-gray-700">
                              {new Date(booking.checkOut).toLocaleDateString('ru-RU')}
                            </div>
                            <div className="text-xs text-gray-500">
                              {nights} {nights === 1 ? 'ночь' : nights < 5 ? 'ночи' : 'ночей'}
                            </div>
                          </td>
                          
                          {/* Гости */}
                          <td className="px-3 py-2.5">
                            <div className="text-xs text-gray-700">
                              {booking.guests && booking.guests.length > 0 ? (
                                <div className="space-y-1">
                                  {booking.guests.map((g, i) => (
                                    <div key={i} className="flex items-center gap-1.5">
                                      {g.image ? (
                                        <img
                                          src={g.image}
                                          alt={g.name}
                                          className="w-6 h-6 rounded-full object-cover border border-gray-300"
                                        />
                                      ) : (
                                        <div className="w-6 h-6 rounded-full bg-gray-200 flex items-center justify-center border border-gray-300">
                                          <span className="text-xs text-gray-500">{g.name.charAt(0).toUpperCase()}</span>
                                        </div>
                                      )}
                                      <span className="text-gray-700">{g.name}</span>
                                    </div>
                                  ))}
                                </div>
                              ) : (
                                <span className="text-gray-400">Нет гостей</span>
                              )}
                            </div>
                          </td>
                          
                          {/* Подтверждение */}
                          <td className="px-3 py-2.5">
                            {booking.isConfirmed ? (
                              <div className="flex items-center gap-1 text-xs text-green-600">
                                <CheckCircle className="w-4 h-4" />
                                <span className="font-semibold">Подтверждено</span>
                              </div>
                            ) : (
                              <div className="flex items-center gap-1 text-xs text-yellow-600">
                                <span>Ожидает</span>
                              </div>
                            )}
                            {booking.confirmedBy && (
                              <div className="text-xs text-gray-500 mt-1">
                                {booking.confirmedBy}
                              </div>
                            )}
                            {booking.confirmedDate && (
                              <div className="text-xs text-gray-500">
                                {new Date(booking.confirmedDate).toLocaleDateString('ru-RU')}
                              </div>
                            )}
                          </td>
                          
                          {/* Оплата */}
                          <td className="px-3 py-2.5">
                            {booking.isPaid ? (
                              <div className="space-y-1">
                                <div className="flex items-center gap-1 text-xs text-green-600">
                                  <Euro className="w-4 h-4" />
                                  <span className="font-semibold">Оплачено</span>
                                </div>
                                <div className="text-xs text-gray-600">
                                  {booking.paymentMethod === 'cash' ? 'Оплачено наличными' : 
                                   booking.paymentMethod === 'transfer' ? 'Оплачено переводом' : '-'}
                                </div>
                                {booking.paymentDate && (
                                  <div className="text-xs text-gray-500">
                                    {new Date(booking.paymentDate).toLocaleDateString('ru-RU')}
                                  </div>
                                )}
                              </div>
                            ) : (
                              <div className="flex items-center gap-1 text-xs text-red-600">
                                <span>Не оплачено</span>
                              </div>
                            )}
                          </td>
                          
                          {/* Сумма */}
                          <td className="px-3 py-2.5">
                            <div className="text-sm font-bold text-gray-900">
                              {totalPrice > 0 ? `${totalPrice.toFixed(2)}€` : '-'}
                            </div>
                            {room && room.price > 0 && (
                              <div className="text-xs text-gray-500">
                                {room.price}€/ночь
                              </div>
                            )}
                          </td>
                          
                          {/* Примечания */}
                          <td className="px-3 py-2.5">
                            <div className="text-xs text-gray-600 max-w-xs">
                              {booking.notes ? (
                                <div title={booking.notes} className="truncate">
                                  {booking.notes}
                                </div>
                              ) : (
                                <span className="text-gray-400">-</span>
                              )}
                            </div>
                          </td>
                          
                          {/* Действия */}
                          <td className="px-3 py-2.5">
                            <div className="flex flex-col gap-1">
                              {!booking.isConfirmed && (
                                <button
                                  onClick={() => handleConfirmBooking(booking)}
                                  className="px-2 py-1 bg-green-600 hover:bg-green-700 text-white rounded text-xs font-semibold whitespace-nowrap flex items-center gap-1"
                                  title="Подтвердить бронирование"
                                >
                                  <CheckCircle className="w-3 h-3" />
                                  Подтвердить
                                </button>
                              )}
                              {!booking.isPaid && (
                                <button
                                  onClick={() => handleOpenPaymentModal(booking)}
                                  className="px-2 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded text-xs font-semibold whitespace-nowrap flex items-center gap-1"
                                  title="Подтвердить оплату"
                                >
                                  <CreditCard className="w-3 h-3" />
                                  Оплата
                                </button>
                              )}
                              {canCancel && (
                                <button
                                  onClick={() => handleCancel(booking)}
                                  className="px-2 py-1 bg-red-500 hover:bg-red-600 text-white rounded text-xs font-semibold whitespace-nowrap"
                                  title="Отменить бронирование"
                                >
                                  Отменить
                                </button>
                              )}
                            </div>
                          </td>
                        </tr>
                      );
                    } else {
                      // Для гостей - упрощенная версия
                      return (
                        <tr
                          key={booking.id}
                          className={`border-b border-gray-100 transition-colors ${
                            booking.bookedBy === currentUser.name
                              ? 'bg-blue-50/50 hover:bg-blue-50'
                              : 'hover:bg-gray-50'
                          }`}
                        >
                          <td className="px-3 py-2.5">
                            <div className="font-semibold text-gray-900">#{booking.roomNumber || 'N/A'}</div>
                            {room && (
                              <div className="text-xs text-gray-500">
                                {room.type === 'FZ' ? 'Семейная' : room.type === 'DZ' ? 'Двухместная' : room.type === 'EZ' ? 'Одноместная' : 'Общее'}
                              </div>
                            )}
                          </td>
                          <td className="px-3 py-2.5 text-sm text-gray-700">
                            {new Date(booking.checkIn).toLocaleDateString('ru-RU')}
                          </td>
                          <td className="px-3 py-2.5 text-sm text-gray-700">
                            {new Date(booking.checkOut).toLocaleDateString('ru-RU')}
                          </td>
                          <td className="px-3 py-2.5">
                            <div className="text-xs text-gray-700">
                              {booking.guests && booking.guests.length > 0 ? (
                                <div>
                                  <div className="font-semibold mb-2">{booking.guests.length} {booking.guests.length === 1 ? 'гость' : 'гостей'}</div>
                                  <div className="flex flex-wrap gap-2">
                                    {booking.guests.slice(0, 3).map((g, i) => (
                                      <div key={i} className="flex items-center gap-1.5">
                                        {g.image ? (
                                          <img
                                            src={g.image}
                                            alt={g.name}
                                            className="w-8 h-8 rounded-full object-cover border border-gray-300"
                                          />
                                        ) : (
                                          <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center border border-gray-300">
                                            <span className="text-xs text-gray-500">{g.name.charAt(0).toUpperCase()}</span>
                                          </div>
                                        )}
                                        <span className="text-gray-700">{g.name}</span>
                                      </div>
                                    ))}
                                    {booking.guests.length > 3 && (
                                      <div className="text-gray-400">+{booking.guests.length - 3} еще</div>
                                    )}
                                  </div>
                                </div>
                              ) : (
                                <span className="text-gray-400">Нет гостей</span>
                              )}
                            </div>
                          </td>
                          <td className="px-3 py-2.5">
                            <div className="flex flex-col gap-1">
                              {booking.isConfirmed ? (
                                <div className="flex items-center gap-1 text-xs text-green-600">
                                  <CheckCircle className="w-3 h-3" />
                                  <span>Подтверждено</span>
                                </div>
                              ) : (
                                <div className="flex items-center gap-1 text-xs text-yellow-600">
                                  <span>Ожидает подтверждения</span>
                                </div>
                              )}
                              {booking.isPaid ? (
                                <div className="flex items-center gap-1 text-xs text-green-600">
                                  <Euro className="w-3 h-3" />
                                  <span>
                                    Оплачено ({booking.paymentMethod === 'cash' ? 'наличными' : booking.paymentMethod === 'transfer' ? 'переводом' : ''})
                                  </span>
                                </div>
                              ) : (
                                <div className="flex items-center gap-1 text-xs text-red-600">
                                  <span>Не оплачено</span>
                                </div>
                              )}
                            </div>
                          </td>
                          <td className="px-3 py-2.5">
                            <div className="flex flex-col gap-1">
                              {canCancel && (
                                <button
                                  onClick={() => handleCancel(booking)}
                                  className="px-2 py-1 bg-red-500 hover:bg-red-600 text-white rounded text-xs font-semibold whitespace-nowrap"
                                  title="Отменить бронирование"
                                >
                                  Отменить
                                </button>
                              )}
                            </div>
                          </td>
                        </tr>
                      );
                    }
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>

      {/* Модальное окно для подтверждения оплаты */}
      {showPaymentModal && selectedBookingForPayment && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Подтверждение оплаты</h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold mb-2 text-gray-700">
                  Способ оплаты <span className="text-red-500">*</span>
                </label>
                <select
                  value={paymentMethod}
                  onChange={(e) => setPaymentMethod(e.target.value as 'cash' | 'transfer')}
                  className="w-full px-3 py-2 border-2 border-gray-300 rounded-lg focus:border-gray-700 focus:outline-none"
                >
                  <option value="cash">Оплачено наличными</option>
                  <option value="transfer">Оплачено переводом</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold mb-2 text-gray-700">
                  Сумма (€)
                </label>
                <input
                  type="number"
                  value={paymentAmount}
                  onChange={(e) => setPaymentAmount(Number(e.target.value))}
                  min="0"
                  step="0.01"
                  className="w-full px-3 py-2 border-2 border-gray-300 rounded-lg focus:border-gray-700 focus:outline-none"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Оставьте 0 для автоматического расчета
                </p>
              </div>

              <div className="bg-gray-50 p-3 rounded-lg">
                <div className="text-sm text-gray-700">
                  <div className="font-semibold mb-1">Информация о бронировании:</div>
                  <div>Комната: #{selectedBookingForPayment.roomNumber || 'N/A'}</div>
                  <div>Гость: {selectedBookingForPayment.bookedBy}</div>
                  <div>Заезд: {new Date(selectedBookingForPayment.checkIn).toLocaleDateString('ru-RU')}</div>
                  <div>Выезд: {new Date(selectedBookingForPayment.checkOut).toLocaleDateString('ru-RU')}</div>
                </div>
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <button
                onClick={() => {
                  setShowPaymentModal(false);
                  setSelectedBookingForPayment(null);
                }}
                className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-700 py-2 rounded-lg font-semibold"
              >
                Отмена
              </button>
              <button
                onClick={handleConfirmPayment}
                className="flex-1 bg-green-600 hover:bg-green-700 text-white py-2 rounded-lg font-semibold"
              >
                Подтвердить оплату
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}


