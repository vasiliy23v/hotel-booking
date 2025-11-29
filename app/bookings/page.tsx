'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { BookOpen, Filter, X, ArrowUpDown, ArrowUp, ArrowDown, Building2, LogOut, ArrowLeft, Euro, DollarSign, Edit, CheckCircle } from 'lucide-react';
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
  const [filterHotelId, setFilterHotelId] = useState<string>('');
  const [filterDateFrom, setFilterDateFrom] = useState<string>('');
  const [filterDateTo, setFilterDateTo] = useState<string>('');
  const [showFilters, setShowFilters] = useState(false);
  
  // Сортировка
  const [sortBy, setSortBy] = useState<'checkIn' | 'checkOut' | 'bookedDate' | 'bookedBy' | 'roomNumber'>('checkIn');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
  

  // Модальное окно для редактирования
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedBookingForEdit, setSelectedBookingForEdit] = useState<(BookingInfo & { roomNumber?: string; hotelName?: string }) | null>(null);
  const [editCheckIn, setEditCheckIn] = useState<string>('');
  const [editCheckOut, setEditCheckOut] = useState<string>('');
  const [editGuests, setEditGuests] = useState<any[]>([]);
  const [editNotes, setEditNotes] = useState<string>('');

  useEffect(() => {
    // Перенаправляем на главную страницу, где бронирования отображаются по умолчанию
    router.push('/dashboard');
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


  const handleEdit = (booking: BookingInfo & { roomNumber?: string; hotelName?: string }) => {
    setSelectedBookingForEdit(booking);
    setEditCheckIn(booking.checkIn.split('T')[0]);
    setEditCheckOut(booking.checkOut.split('T')[0]);
    setEditGuests(booking.guests || []);
    setEditNotes(booking.notes || '');
    setShowEditModal(true);
  };

  const handleSaveEdit = async () => {
    if (!selectedBookingForEdit?.id) return;
    
    try {
      await api.updateBooking(selectedBookingForEdit.id, {
        checkIn: editCheckIn,
        checkOut: editCheckOut,
        guests: editGuests,
        notes: editNotes,
      });
      setShowEditModal(false);
      setSelectedBookingForEdit(null);
      await loadBookings();
    } catch (error) {
      console.error('Error updating booking:', error);
      alert('Ошибка при обновлении бронирования');
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
  if (filterHotelId) {
    filteredBookings = filteredBookings.filter(b => {
      const room = rooms.find(r => r.id === b.roomId);
      return room?.hotelId === filterHotelId;
    });
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

  // Группируем бронирования по отелям для обычных пользователей
  const bookingsByHotel = currentUser.role !== 'manager' 
    ? filteredBookings.reduce((acc, booking) => {
        const room = rooms.find(r => r.id === booking.roomId);
        const hotelId = room?.hotelId || 'unknown';
        if (!acc[hotelId]) {
          acc[hotelId] = [];
        }
        acc[hotelId].push(booking);
        return acc;
      }, {} as Record<string, typeof filteredBookings>)
    : null;

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
    setFilterHotelId('');
    setFilterDateFrom('');
    setFilterDateTo('');
  };

  const hasActiveFilters = filterBookedBy || filterRoomNumber || filterHotelId || filterDateFrom || filterDateTo;

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
                  <label className="block text-xs font-semibold text-gray-700 mb-1.5">Отель</label>
                  <select
                    value={filterHotelId}
                    onChange={(e) => setFilterHotelId(e.target.value)}
                    className="w-full px-2 py-1.5 rounded text-xs border border-gray-300 bg-white text-gray-700 focus:outline-none focus:border-gray-900"
                  >
                    <option value="">Все отели</option>
                    {hotels.map((hotel) => (
                      <option key={hotel.id} value={hotel.id}>
                        {hotel.name}
                      </option>
                    ))}
                  </select>
                </div>
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
          ) : currentUser.role !== 'manager' && bookingsByHotel ? (
            // Для обычных пользователей - группировка по отелям
            <div className="space-y-6">
              {Object.entries(bookingsByHotel).map(([hotelId, hotelBookings]) => {
                const hotel = hotels.find(h => h.id === hotelId);
                if (!hotel) return null;
                
                return (
                  <div key={hotelId} className="border border-gray-200 rounded-lg overflow-hidden">
                    {/* Заголовок отеля */}
                    <div className="bg-gray-50 px-4 py-3 border-b border-gray-200">
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="text-lg font-bold text-gray-900">{hotel.name}</h3>
                          <p className="text-sm text-gray-600">{hotel.address}</p>
                        </div>
                        <div className="text-sm text-gray-500">
                          {hotelBookings.length} {hotelBookings.length === 1 ? 'бронирование' : hotelBookings.length < 5 ? 'бронирования' : 'бронирований'}
                        </div>
                      </div>
                    </div>
                    
                    {/* Список бронирований в отеле */}
                    <div className="divide-y divide-gray-100">
                      {hotelBookings.map((booking) => {
                        const nights = Math.ceil(
                          (new Date(booking.checkOut).getTime() - new Date(booking.checkIn).getTime()) / 
                          (1000 * 60 * 60 * 24)
                        );
                        const room = rooms.find(r => r.id === booking.roomId);
                        const totalPrice = booking.amount || (nights * (room?.price || 0));
                        
                        return (
                          <div
                            key={booking.id}
                            className="p-4 hover:bg-gray-50 transition-colors"
                          >
                            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                              {/* Основная информация */}
                              <div className="flex-1 space-y-3">
                                <div className="flex items-start gap-3">
                                  <div className="flex-1">
                                    <div className="flex items-center gap-2 mb-1">
                                      <span className="font-bold text-gray-900">Комната #{booking.roomNumber || 'N/A'}</span>
                                      {room && (
                                        <span className="text-xs text-gray-500 px-2 py-0.5 bg-gray-100 rounded">
                                          {room.type === 'FZ' ? 'Семейная' : room.type === 'DZ' ? 'Двухместная' : room.type === 'EZ' ? 'Одноместная' : 'Общее'}
                                        </span>
                                      )}
                                    </div>
                                    <div className="text-sm text-gray-600 space-y-1">
                                      <div className="flex items-center gap-2">
                                        <span className="font-semibold">Заезд:</span>
                                        <span>{new Date(booking.checkIn).toLocaleDateString('ru-RU')}</span>
                                      </div>
                                      <div className="flex items-center gap-2">
                                        <span className="font-semibold">Выезд:</span>
                                        <span>{new Date(booking.checkOut).toLocaleDateString('ru-RU')}</span>
                                        <span className="text-xs text-gray-500">({nights} {nights === 1 ? 'ночь' : nights < 5 ? 'ночи' : 'ночей'})</span>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                                
                                {/* Гости */}
                                {booking.guests && booking.guests.length > 0 && (
                                  <div>
                                    <div className="text-xs font-semibold text-gray-700 mb-1">
                                      Гости ({booking.guests.length}):
                                    </div>
                                    <div className="flex flex-wrap gap-2">
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
                                          <span className="text-xs text-gray-700">{g.name}</span>
                                        </div>
                                      ))}
                                    </div>
                                  </div>
                                )}
                                
                                {/* Примечания */}
                                {booking.notes && (
                                  <div>
                                    <div className="text-xs font-semibold text-gray-700 mb-1">Примечания:</div>
                                    <div className="text-xs text-gray-600">{booking.notes}</div>
                                  </div>
                                )}
                              </div>
                              
                              {/* Статусы и действия */}
                              <div className="flex flex-col gap-3 sm:w-48">
                                {/* Статусы */}
                                <div className="space-y-2">
                                  <div className="flex items-center gap-2">
                                    {booking.isConfirmed ? (
                                      <div className="flex items-center gap-1 text-xs text-green-600">
                                        <CheckCircle className="w-4 h-4" />
                                        <span className="font-semibold">Подтверждено</span>
                                      </div>
                                    ) : (
                                      <div className="flex items-center gap-1 text-xs text-yellow-600">
                                        <span>Ожидает подтверждения</span>
                                      </div>
                                    )}
                                  </div>
                                  
                                  <div className="flex items-center gap-2">
                                    {booking.isPaid ? (
                                      <div className="flex items-center gap-1 text-xs text-green-600">
                                        <Euro className="w-4 h-4" />
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
                                  
                                  {totalPrice > 0 && (
                                    <div className="text-sm font-bold text-gray-900">
                                      {totalPrice.toFixed(2)}€
                                      {room && room.price > 0 && (
                                        <span className="text-xs text-gray-500 font-normal ml-1">
                                          ({room.price}€/ночь)
                                        </span>
                                      )}
                                    </div>
                                  )}
                                </div>
                                
                                {/* Действия */}
                                <div className="flex flex-col gap-2">
                                  <button
                                    onClick={() => handleEdit(booking)}
                                    className="px-3 py-1.5 bg-blue-500 hover:bg-blue-600 text-white rounded text-xs font-semibold flex items-center justify-center gap-1"
                                    title="Редактировать бронирование"
                                  >
                                    <Edit className="w-3 h-3" />
                                    Редактировать
                                  </button>
                                  <button
                                    onClick={() => handleCancel(booking)}
                                    className="px-3 py-1.5 bg-pink-900 hover:bg-pink-950 text-white rounded text-xs font-semibold"
                                    title="Отменить бронирование"
                                  >
                                    Отменить
                                  </button>
                                </div>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            // Для менеджеров - таблица
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
                        <th className="px-3 py-2 text-left text-xs font-semibold text-gray-700 whitespace-nowrap">Сумма</th>
                        <th className="px-3 py-2 text-left text-xs font-semibold text-gray-700 whitespace-nowrap">Примечания</th>
                        <th className="px-3 py-2 text-left text-xs font-semibold text-gray-700 whitespace-nowrap">Действия</th>
                      </>
                    ) : (
                      <>
                        <th className="px-3 py-2 text-left text-xs font-semibold text-gray-700 whitespace-nowrap">Отель</th>
                        <th 
                          className="px-3 py-2 text-left text-xs font-semibold text-gray-700 cursor-pointer hover:bg-gray-100 transition-colors whitespace-nowrap"
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
                        <th className="px-3 py-2 text-left text-xs font-semibold text-gray-700 whitespace-nowrap">Статус</th>
                        <th className="px-3 py-2 text-left text-xs font-semibold text-gray-700 whitespace-nowrap">Действия</th>
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
                              {canCancel && (
                                <button
                                  onClick={() => handleCancel(booking)}
                                  className="px-2 py-1 bg-pink-900 hover:bg-pink-950 text-white rounded text-xs font-semibold whitespace-nowrap"
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
                              {canCancel && (
                                <>
                                  <button
                                    onClick={() => handleEdit(booking)}
                                    className="px-2 py-1 bg-blue-500 hover:bg-blue-600 text-white rounded text-xs font-semibold whitespace-nowrap flex items-center gap-1"
                                    title="Редактировать бронирование"
                                  >
                                    <Edit className="w-3 h-3" />
                                    Редактировать
                                  </button>
                                  <button
                                    onClick={() => handleCancel(booking)}
                                    className="px-2 py-1 bg-pink-900 hover:bg-pink-950 text-white rounded text-xs font-semibold whitespace-nowrap"
                                    title="Отменить бронирование"
                                  >
                                    Отменить
                                  </button>
                                </>
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


      {/* Модальное окно для редактирования бронирования */}
      {showEditModal && selectedBookingForEdit && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Редактировать бронирование</h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold mb-2 text-gray-700">
                  Отель
                </label>
                <div className="px-3 py-2 bg-gray-50 rounded-lg text-sm text-gray-700">
                  {selectedBookingForEdit.hotelName || 'N/A'}
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold mb-2 text-gray-700">
                  Комната
                </label>
                <div className="px-3 py-2 bg-gray-50 rounded-lg text-sm text-gray-700">
                  #{selectedBookingForEdit.roomNumber || 'N/A'}
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold mb-2 text-gray-700">
                  Заезд <span className="text-red-500">*</span>
                </label>
                <input
                  type="date"
                  value={editCheckIn}
                  onChange={(e) => setEditCheckIn(e.target.value)}
                  className="w-full px-3 py-2 border-2 border-gray-300 rounded-lg focus:border-gray-700 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold mb-2 text-gray-700">
                  Выезд <span className="text-red-500">*</span>
                </label>
                <input
                  type="date"
                  value={editCheckOut}
                  onChange={(e) => setEditCheckOut(e.target.value)}
                  className="w-full px-3 py-2 border-2 border-gray-300 rounded-lg focus:border-gray-700 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold mb-2 text-gray-700">
                  Примечания
                </label>
                <textarea
                  value={editNotes}
                  onChange={(e) => setEditNotes(e.target.value)}
                  rows={3}
                  className="w-full px-3 py-2 border-2 border-gray-300 rounded-lg focus:border-gray-700 focus:outline-none"
                  placeholder="Дополнительная информация..."
                />
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <button
                onClick={() => {
                  setShowEditModal(false);
                  setSelectedBookingForEdit(null);
                }}
                className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-700 py-2 rounded-lg font-semibold"
              >
                Отмена
              </button>
              <button
                onClick={handleSaveEdit}
                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg font-semibold"
              >
                Сохранить
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}


