'use client';

import { useState, useEffect, ReactElement } from 'react';
import { BookOpen, Filter, X, ArrowUpDown, ArrowUp, ArrowDown, Euro, Eye, Calendar, User as UserIcon, Phone, Mail, MapPin, Bed, FileText, Building2, Search } from 'lucide-react';
import { api } from '@/lib/api';
import type { User, Room, Hotel, BookingInfo, Statistics } from '@/types';

export default function BookingsView() {
  const [bookings, setBookings] = useState<(BookingInfo & { roomNumber?: string; hotelName?: string })[]>([]);
  const [rooms, setRooms] = useState<Room[]>([]);
  const [hotels, setHotels] = useState<Hotel[]>([]);
  const [loading, setLoading] = useState(true);
  const [statistics, setStatistics] = useState<Statistics | null>(null);
  const [statisticsLoading, setStatisticsLoading] = useState(true);
  const [filterHotelId, setFilterHotelId] = useState<string>('');
  
  // Поиск
  const [searchQuery, setSearchQuery] = useState<string>('');
  
  // Фильтры
  const [filterHotel, setFilterHotel] = useState<string>('');
  const [filterBookedBy, setFilterBookedBy] = useState<string>('');
  const [filterRoomNumber, setFilterRoomNumber] = useState<string>('');
  const [filterDateFrom, setFilterDateFrom] = useState<string>('');
  const [filterDateTo, setFilterDateTo] = useState<string>('');
  const [showFilters, setShowFilters] = useState(false);
  
  // Сортировка
  const [sortBy, setSortBy] = useState<'checkIn' | 'checkOut' | 'bookedDate' | 'bookedBy' | 'roomNumber'>('checkIn');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
  
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  
  // Модальное окно для детального просмотра
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [selectedBookingForDetail, setSelectedBookingForDetail] = useState<(BookingInfo & { roomNumber?: string; hotelName?: string }) | null>(null);

  const loadStatistics = async (hotelId?: string) => {
    try {
      setStatisticsLoading(true);
      const stats = await api.getStatistics(hotelId || undefined);
      setStatistics(stats);
    } catch (error) {
      console.error('Error loading statistics:', error);
    } finally {
      setStatisticsLoading(false);
    }
  };

  useEffect(() => {
    const userStr = localStorage.getItem('currentUser');
    if (userStr) {
      const user = JSON.parse(userStr);
      setCurrentUser(user);
    }
    loadBookings();
    loadStatistics();
  }, []);

  useEffect(() => {
    // Обновляем статистику при изменении фильтра по отелю
    if (filterHotel) {
      const hotel = hotels.find(h => h.name === filterHotel || h.id === filterHotel);
      if (hotel) {
        setFilterHotelId(hotel.id);
        loadStatistics(hotel.id);
      } else {
        setFilterHotelId('');
        loadStatistics();
      }
    } else {
      setFilterHotelId('');
      loadStatistics();
    }
  }, [filterHotel, hotels]);

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
      await loadBookings();
    } catch (error) {
      console.error('Error canceling booking:', error);
      alert('Ошибка при отмене бронирования');
    }
  };

  const handleConfirmHalfPayment = async (booking: BookingInfo & { roomNumber?: string }) => {
    const nights = Math.ceil(
      (new Date(booking.checkOut).getTime() - new Date(booking.checkIn).getTime()) / 
      (1000 * 60 * 60 * 24)
    );
    const room = rooms.find(r => r.id === booking.roomId);
    const totalAmount = booking.amount || (nights * (room?.price || 0));
    const alreadyPaid = booking.amount || 0;
    const halfAmount = totalAmount / 2;
    const amountToAdd = halfAmount - alreadyPaid;

    if (amountToAdd <= 0) {
      alert('Бронирование уже оплачено на 50% или более');
      return;
    }

    if (!confirm(`Подтвердить оплату 50% (${halfAmount.toFixed(2)}€) для бронирования комнаты #${booking.roomNumber}?\n\nУже оплачено: ${alreadyPaid.toFixed(2)}€\nК доплате: ${amountToAdd.toFixed(2)}€`)) {
      return;
    }

    try {
      if (booking.id && currentUser) {
        await api.updateBooking(booking.id, {
          amount: halfAmount,
          isPaid: false, // Частичная оплата, не полная
          paidBy: currentUser.name,
          paymentDate: new Date().toISOString(),
        });
        await loadBookings();
        alert(`Подтверждена оплата 50% (${halfAmount.toFixed(2)}€)`);
      }
    } catch (error) {
      console.error('Error confirming half payment:', error);
      alert('Ошибка при подтверждении оплаты');
    }
  };

  const handleConfirmFullPayment = async (booking: BookingInfo & { roomNumber?: string }) => {
    const nights = Math.ceil(
      (new Date(booking.checkOut).getTime() - new Date(booking.checkIn).getTime()) / 
      (1000 * 60 * 60 * 24)
    );
    const room = rooms.find(r => r.id === booking.roomId);
    const totalAmount = nights * (room?.price || 0);
    const alreadyPaid = booking.amount || 0;
    const amountToAdd = totalAmount - alreadyPaid;

    if (amountToAdd <= 0) {
      alert('Бронирование уже полностью оплачено');
      return;
    }

    if (!confirm(`Подтвердить полную оплату (${totalAmount.toFixed(2)}€) для бронирования комнаты #${booking.roomNumber}?\n\nУже оплачено: ${alreadyPaid.toFixed(2)}€\nК доплате: ${amountToAdd.toFixed(2)}€`)) {
      return;
    }

    try {
      if (booking.id && currentUser) {
        await api.updateBooking(booking.id, {
          amount: totalAmount,
          isPaid: true, // Полная оплата
          paidBy: currentUser.name,
          paymentDate: new Date().toISOString(),
        });
        await loadBookings();
        alert(`Подтверждена полная оплата (${totalAmount.toFixed(2)}€)`);
      }
    } catch (error) {
      console.error('Error confirming full payment:', error);
      alert('Ошибка при подтверждении оплаты');
    }
  };


  // Фильтруем бронирования
  let filteredBookings = bookings;

  // Поиск по комнатам, именам, почте и названию отеля
  if (searchQuery) {
    const query = searchQuery.toLowerCase().trim();
    filteredBookings = filteredBookings.filter(b => {
      // Поиск по названию отеля
      const matchesHotel = b.hotelName?.toLowerCase().includes(query);
      
      // Поиск по номеру комнаты
      const matchesRoom = b.roomNumber?.toLowerCase().includes(query);
      
      // Поиск по имени того, кто бронировал
      const matchesBookedBy = b.bookedBy.toLowerCase().includes(query);
      
      // Поиск по email того, кто бронировал
      const matchesEmail = b.email?.toLowerCase().includes(query);
      
      // Поиск по именам гостей
      const matchesGuestNames = b.guests?.some((guest: any) => 
        guest.name?.toLowerCase().includes(query)
      ) || false;
      
      // Поиск по email гостей
      const matchesGuestEmails = b.guests?.some((guest: any) => 
        guest.email?.toLowerCase().includes(query)
      ) || false;
      
      return matchesHotel || matchesRoom || matchesBookedBy || matchesEmail || matchesGuestNames || matchesGuestEmails;
    });
  }

  if (filterHotel) {
    filteredBookings = filteredBookings.filter(b => 
      b.hotelName?.toLowerCase().includes(filterHotel.toLowerCase()) || 
      hotels.find(h => h.id === filterHotel)?.name === b.hotelName
    );
  }
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

  // Функция для выделения найденного текста (выделяет все вхождения)
  const highlightText = (text: string, query: string) => {
    if (!query || !text) return text;
    
    const queryLower = query.toLowerCase();
    const textLower = text.toLowerCase();
    const parts: (string | ReactElement)[] = [];
    let lastIndex = 0;
    let index = textLower.indexOf(queryLower, lastIndex);
    
    while (index !== -1) {
      // Добавляем текст до совпадения
      if (index > lastIndex) {
        parts.push(text.substring(lastIndex, index));
      }
      
      // Добавляем выделенное совпадение
      const match = text.substring(index, index + query.length);
      parts.push(
        <span key={index} className="bg-yellow-400 text-yellow-900 font-bold px-0.5 rounded underline decoration-2 decoration-yellow-600">
          {match}
        </span>
      );
      
      lastIndex = index + query.length;
      index = textLower.indexOf(queryLower, lastIndex);
    }
    
    // Добавляем оставшийся текст
    if (lastIndex < text.length) {
      parts.push(text.substring(lastIndex));
    }
    
    return parts.length > 0 ? <>{parts}</> : text;
  };

  const resetFilters = () => {
    setSearchQuery('');
    setFilterHotel('');
    setFilterBookedBy('');
    setFilterRoomNumber('');
    setFilterDateFrom('');
    setFilterDateTo('');
  };

  const hasActiveFilters = searchQuery || filterHotel || filterBookedBy || filterRoomNumber || filterDateFrom || filterDateTo;

  // Вычисляем статистику бронирований
  const totalBookings = filteredBookings.length;
  const paidBookings = filteredBookings.filter(b => b.isPaid).length;
  
  let totalRevenue = 0;
  filteredBookings.forEach(booking => {
    const nights = Math.ceil(
      (new Date(booking.checkOut).getTime() - new Date(booking.checkIn).getTime()) / 
      (1000 * 60 * 60 * 24)
    );
    const room = rooms.find(r => r.id === booking.roomId);
    const amount = booking.amount || (nights * (room?.price || 0));
    totalRevenue += amount;
  });

  return (
    <div className="space-y-4 sm:space-y-6">
      <div className="bg-white rounded-lg shadow-sm p-4 sm:p-6 border border-gray-200">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4 sm:mb-6">
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900">
            Статистика и бронирования
          </h2>
          
        </div>

        {/* Объединенная статистика */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4 mb-4 sm:mb-6">
          {/* Статистика комнат */}
          {statisticsLoading ? (
            <>
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-5 h-5 bg-gray-300 rounded animate-pulse"></div>
                    <div className="h-4 w-20 bg-gray-300 rounded animate-pulse"></div>
                  </div>
                  <div className="h-8 w-16 bg-gray-300 rounded animate-pulse mt-2"></div>
                </div>
              ))}
            </>
          ) : statistics ? (
            <>
              <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                <div className="flex items-center gap-2 mb-2">
                  <Building2 className="w-5 h-5 text-gray-700" />
                  <span className="text-sm text-gray-700 font-semibold">Всего комнат</span>
                </div>
                <div className="text-2xl sm:text-3xl font-bold text-gray-900">{statistics.totalRooms}</div>
              </div>

              <div className="bg-green-50 rounded-lg p-4 border border-green-200">
                <div className="flex items-center gap-2 mb-2">
                  <Bed className="w-5 h-5 text-green-700" />
                  <span className="text-sm text-green-700 font-semibold">Свободно</span>
                </div>
                <div className="text-2xl sm:text-3xl font-bold text-green-700">{statistics.availableRooms}</div>
              </div>

              <div className="bg-gray-100 rounded-lg p-4 border border-gray-300">
                <div className="flex items-center gap-2 mb-2">
                  <Calendar className="w-5 h-5 text-gray-700" />
                  <span className="text-sm text-gray-700 font-semibold">Забронировано</span>
                </div>
                <div className="text-2xl sm:text-3xl font-bold text-gray-700">{statistics.bookedRooms}</div>
              </div>

            </>
          ) : null}

          {/* Статистика бронирований */}
          {!loading && (
            <>
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 sm:p-4">
                <div className="flex items-center gap-2 mb-1">
                  <BookOpen className="w-4 h-4 text-blue-600" />
                  <span className="text-xs font-semibold text-blue-900">Всего бронирований</span>
                </div>
                <div className="text-xl sm:text-2xl font-bold text-blue-900">{totalBookings}</div>
              </div>
              
              <div className="bg-purple-50 border border-purple-200 rounded-lg p-3 sm:p-4">
                <div className="flex items-center gap-2 mb-1">
                  <Euro className="w-4 h-4 text-purple-600" />
                  <span className="text-xs font-semibold text-purple-900">Оплачено</span>
                </div>
                <div className="text-xl sm:text-2xl font-bold text-purple-900">{paidBookings}</div>
              </div>
            </>
          )}

          {/* Объединенная финансовая статистика */}
          {!statisticsLoading && statistics && !loading && (
            <div className="bg-gradient-to-br from-emerald-50 to-emerald-100 rounded-lg p-4 border-2 border-emerald-300 col-span-2 sm:col-span-1">
              <div className="space-y-3">
                <div className="flex items-center gap-2 mb-3">
                  <Euro className="w-5 h-5 text-emerald-700" />
                  <span className="text-sm font-bold text-emerald-900">Финансы</span>
                </div>
                
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-emerald-700 font-medium">Доход</span>
                    <span className="text-lg font-bold text-emerald-900">{statistics.revenue}€</span>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-orange-700 font-medium">К оплате</span>
                    <span className="text-lg font-bold text-orange-700">{statistics.amountToPay?.toFixed(2) || '0.00'}€</span>
                  </div>
                  
                  <div className="flex justify-between items-center pt-2 border-t border-emerald-200">
                    <span className="text-xs text-gray-700 font-semibold">Общая сумма</span>
                    <span className="text-lg font-bold text-gray-900">{totalRevenue.toFixed(2)}€</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="bg-white rounded-lg border border-gray-200 p-4 sm:p-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 sm:gap-4 mb-4 sm:mb-6">
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900 flex items-center gap-2">
            <BookOpen className="w-5 h-5 sm:w-6 sm:h-6" />
            Бронирования
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

        {/* Поле поиска */}
        <div className="mb-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Поиск по отелям, комнатам, именам или почте..."
              className="w-full pl-10 pr-4 py-2.5 border-2 border-gray-300 rounded-lg focus:border-gray-900 focus:outline-none bg-white text-gray-900 text-sm"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        {/* Панель фильтров */}
        {showFilters && (
          <div className="mb-4 p-3 sm:p-4 bg-gray-50 rounded-lg border border-gray-200">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 sm:gap-4">
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1.5">Отель</label>
                <select
                  value={filterHotel}
                  onChange={(e) => setFilterHotel(e.target.value)}
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
                <label className="block text-xs font-semibold text-gray-700 mb-1.5">Забронировано</label>
                <input
                  type="text"
                  value={filterBookedBy}
                  onChange={(e) => setFilterBookedBy(e.target.value)}
                  placeholder="Имя пользователя"
                  className="w-full px-2 py-1.5 rounded text-xs border border-gray-300 bg-white text-gray-700 focus:outline-none focus:border-gray-900"
                />
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
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full border-collapse min-w-[1200px]">
              <thead>
                <tr className="border-b border-gray-200 bg-gray-50">
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
                  {(currentUser?.role === 'manager' || currentUser?.role === 'developer') && (
                    <th className="px-3 py-2 text-left text-xs font-semibold text-gray-700 whitespace-nowrap">Статус оплаты</th>
                  )}
                  <th className="px-3 py-2 text-left text-xs font-semibold text-gray-700 whitespace-nowrap">Примечания</th>
                  <th className="px-3 py-2 text-left text-xs font-semibold text-gray-700 whitespace-nowrap sticky right-0 bg-gray-50 z-10 border-l border-gray-200">Действия</th>
                </tr>
              </thead>
              <tbody>
                {filteredBookings.map((booking) => {
                  const nights = Math.ceil(
                    (new Date(booking.checkOut).getTime() - new Date(booking.checkIn).getTime()) / 
                    (1000 * 60 * 60 * 24)
                  );
                  const room = rooms.find(r => r.id === booking.roomId);
                  const expectedAmount = nights * (room?.price || 0);
                  const totalPrice = expectedAmount;
                  const alreadyPaid = booking.amount || 0;
                  const remainingAmount = Math.max(0, expectedAmount - alreadyPaid);
                  const isFullyPaid = booking.isPaid && alreadyPaid >= expectedAmount;
                  const isHalfPaidOrMore = alreadyPaid >= (totalPrice / 2) && alreadyPaid > 0 && !isFullyPaid;

                  return (
                    <tr
                      key={booking.id}
                      className="border-b border-gray-100 hover:bg-gray-50 transition-colors"
                    >
                      <td className="px-3 py-2.5">
                        <div className="text-sm font-semibold text-gray-900">
                          {searchQuery ? highlightText(booking.hotelName || 'N/A', searchQuery) : (booking.hotelName || 'N/A')}
                        </div>
                      </td>
                      
                      <td className="px-3 py-2.5">
                        <div className="font-semibold text-gray-900">
                          #{searchQuery ? highlightText(booking.roomNumber || 'N/A', searchQuery) : (booking.roomNumber || 'N/A')}
                        </div>
                        {room && (
                          <div className="text-xs text-gray-500">
                            {room.type === 'FZ' ? 'Семейная' : room.type === 'DZ' ? 'Двухместная' : room.type === 'EZ' ? 'Одноместная' : room.type === 'MZ' ? 'Многоместная' : room.type === 'App' ? 'Апартаменты' : 'Общее'}
                          </div>
                        )}
                      </td>
                      
                      <td className="px-3 py-2.5">
                        <div className="text-sm font-semibold text-gray-700">
                          {searchQuery ? highlightText(booking.bookedBy, searchQuery) : booking.bookedBy}
                        </div>
                        <div className="text-xs text-gray-500">
                          {new Date(booking.bookedDate).toLocaleDateString('ru-RU')}
                        </div>
                      </td>
                      
                      <td className="px-3 py-2.5">
                        <div className="text-xs text-gray-700">
                          <div className="font-semibold">
                            {searchQuery ? highlightText(booking.email || '', searchQuery) : (booking.email || '')}
                          </div>
                          <div className="text-gray-500">{booking.phone}</div>
                        </div>
                      </td>
                      
                      <td className="px-3 py-2.5">
                        <div className="text-sm text-gray-700">
                          {new Date(booking.checkIn).toLocaleDateString('ru-RU')}
                        </div>
                      </td>
                      
                      <td className="px-3 py-2.5">
                        <div className="text-sm text-gray-700">
                          {new Date(booking.checkOut).toLocaleDateString('ru-RU')}
                        </div>
                        <div className="text-xs text-gray-500">
                          {nights} {nights === 1 ? 'ночь' : nights < 5 ? 'ночи' : 'ночей'}
                        </div>
                      </td>
                      
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
                                  <span className="text-gray-700">
                                    {searchQuery ? highlightText(g.name || '', searchQuery) : (g.name || '')}
                                  </span>
                                  {g.email && searchQuery && (
                                    <span className="text-gray-500 text-[10px]">
                                      ({highlightText(g.email, searchQuery)})
                                    </span>
                                  )}
                                  {g.email && !searchQuery && (
                                    <span className="text-gray-500 text-[10px]">
                                      ({g.email})
                                    </span>
                                  )}
                                </div>
                              ))}
                            </div>
                          ) : (
                            <span className="text-gray-400">Нет гостей</span>
                          )}
                        </div>
                      </td>
                      
                      <td className="px-3 py-2.5">
                        <div className="text-sm font-bold text-gray-900">
                          {totalPrice > 0 ? `${totalPrice.toFixed(2)}€` : '-'}
                        </div>
                        {room && room.price > 0 && (
                          <div className="text-xs text-gray-500">
                            {room.price}€{room.pricePerPerson ? '/Per' : ''}/ночь
                          </div>
                        )}
                      </td>
                      
                      {(currentUser?.role === 'manager' || currentUser?.role === 'developer') && (
                        <td className="px-3 py-2.5">
                          {isFullyPaid ? (
                            <div className="flex items-center gap-1.5">
                              <div className="w-2 h-2 rounded-full bg-green-500"></div>
                              <span className="text-xs font-semibold text-green-700">Полностью оплачено</span>
                            </div>
                          ) : isHalfPaidOrMore ? (
                            <div className="flex items-center gap-1.5">
                              <div className="w-2 h-2 rounded-full bg-yellow-500"></div>
                              <span className="text-xs font-semibold text-yellow-700">50% оплачено</span>
                            </div>
                          ) : (
                            <div className="flex items-center gap-1.5">
                              <div className="w-2 h-2 rounded-full bg-red-500"></div>
                              <span className="text-xs font-semibold text-red-700">Не оплачено</span>
                            </div>
                          )}
                          {alreadyPaid > 0 && (
                            <div className="text-xs text-gray-500 mt-0.5">
                              Оплачено: {alreadyPaid.toFixed(2)}€
                            </div>
                          )}
                        </td>
                      )}
                      
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
                      
                      <td className="px-3 py-2.5 sticky right-0 bg-white z-10 hover:bg-gray-50 border-l border-gray-200">
                        <div className="flex flex-col gap-1">
                          <button
                            onClick={() => {
                              setSelectedBookingForDetail(booking);
                              setShowDetailModal(true);
                            }}
                            className="px-2 py-1 bg-white hover:bg-gray-100 text-black border border-black rounded text-xs font-semibold whitespace-nowrap flex items-center gap-1"
                            title="Подробнее о бронировании"
                          >
                            <Eye className="w-3 h-3" />
                            Подробнее
                          </button>
                          {currentUser?.role === 'manager' && !isFullyPaid && !isHalfPaidOrMore && (
                            <button
                              onClick={() => handleConfirmHalfPayment(booking)}
                              className="px-2 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded text-xs font-semibold whitespace-nowrap flex items-center gap-1"
                              title="Подтвердить оплату 50%"
                            >
                              <Euro className="w-3 h-3" />
                              50% оплата
                            </button>
                          )}
                          {currentUser?.role === 'manager' && !isFullyPaid && (
                            <button
                              onClick={() => handleConfirmFullPayment(booking)}
                              className="px-2 py-1 bg-green-600 hover:bg-green-700 text-white rounded text-xs font-semibold whitespace-nowrap flex items-center gap-1"
                              title="Подтвердить полную оплату"
                            >
                              <Euro className="w-3 h-3" />
                              100% оплата
                            </button>
                          )}
                          <button
                            onClick={() => handleCancel(booking)}
                            className="px-2 py-1 bg-pink-900 hover:bg-pink-950 text-white rounded text-xs font-semibold whitespace-nowrap"
                            title="Отменить бронирование"
                          >
                            Отменить
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Модальное окно для детального просмотра бронирования */}
      {showDetailModal && selectedBookingForDetail && (() => {
        const booking = selectedBookingForDetail;
        const nights = Math.ceil(
          (new Date(booking.checkOut).getTime() - new Date(booking.checkIn).getTime()) / 
          (1000 * 60 * 60 * 24)
        );
        const room = rooms.find(r => r.id === booking.roomId);
        const expectedAmount = nights * (room?.price || 0);
        const alreadyPaid = booking.isPaid ? (booking.amount || 0) : 0;
        const remainingAmount = Math.max(0, expectedAmount - alreadyPaid);
        const totalPrice = booking.amount || expectedAmount;
        
        return (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 overflow-y-auto">
            <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                    <BookOpen className="w-6 h-6" />
                    Детали бронирования
                  </h2>
                  <button
                    onClick={() => {
                      setShowDetailModal(false);
                      setSelectedBookingForDetail(null);
                    }}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Основная информация */}
                  <div className="space-y-4">
                    <div className="bg-gray-50 rounded-lg p-4">
                      <h3 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
                        <MapPin className="w-4 h-4" />
                        Информация об отеле и комнате
                      </h3>
                      <div className="space-y-2 text-sm">
                        <div>
                          <span className="text-gray-600">Отель:</span>
                          <span className="ml-2 font-semibold text-gray-900">{booking.hotelName || 'N/A'}</span>
                        </div>
                        <div>
                          <span className="text-gray-600">Комната:</span>
                          <span className="ml-2 font-semibold text-gray-900">#{booking.roomNumber || 'N/A'}</span>
                        </div>
                        {room && (
                          <>
                            <div>
                              <span className="text-gray-600">Тип:</span>
                              <span className="ml-2 text-gray-900">
                                {room.type === 'FZ' ? 'Семейная' : room.type === 'DZ' ? 'Двухместная' : room.type === 'EZ' ? 'Одноместная' : room.type === 'MZ' ? 'Многоместная' : room.type === 'App' ? 'Апартаменты' : 'Общее'}
                              </span>
                            </div>
                            <div>
                              <span className="text-gray-600">Вместимость:</span>
                              <span className="ml-2 text-gray-900">{room.capacity}</span>
                            </div>
                            <div>
                              <span className="text-gray-600">Цена за ночь:</span>
                              <span className="ml-2 font-semibold text-gray-900">{room.price}€{room.pricePerPerson ? '/Per' : ''}</span>
                            </div>
                          </>
                        )}
                      </div>
                    </div>

                    <div className="bg-gray-50 rounded-lg p-4">
                      <h3 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
                        <UserIcon className="w-4 h-4" />
                        Информация о госте
                      </h3>
                      <div className="space-y-2 text-sm">
                        <div>
                          <span className="text-gray-600">Имя:</span>
                          <span className="ml-2 font-semibold text-gray-900">{booking.bookedBy}</span>
                        </div>
                        {booking.email && (
                          <div className="flex items-center gap-2">
                            <Mail className="w-4 h-4 text-gray-400" />
                            <span className="text-gray-600">Email:</span>
                            <span className="ml-2 text-gray-900">{booking.email}</span>
                          </div>
                        )}
                        {booking.phone && (
                          <div className="flex items-center gap-2">
                            <Phone className="w-4 h-4 text-gray-400" />
                            <span className="text-gray-600">Телефон:</span>
                            <span className="ml-2 text-gray-900">{booking.phone}</span>
                          </div>
                        )}
                        <div>
                          <span className="text-gray-600">Дата бронирования:</span>
                          <span className="ml-2 text-gray-900">
                            {new Date(booking.bookedDate).toLocaleDateString('ru-RU', {
                              day: '2-digit',
                              month: '2-digit',
                              year: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit'
                            })}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Даты и период */}
                  <div className="space-y-4">
                    <div className="bg-gray-50 rounded-lg p-4">
                      <h3 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
                        <Calendar className="w-4 h-4" />
                        Даты пребывания
                      </h3>
                      <div className="space-y-2 text-sm">
                        <div>
                          <span className="text-gray-600">Заезд:</span>
                          <span className="ml-2 font-semibold text-gray-900">
                            {new Date(booking.checkIn).toLocaleDateString('ru-RU', {
                              day: '2-digit',
                              month: 'long',
                              year: 'numeric',
                              weekday: 'long'
                            })}
                          </span>
                        </div>
                        <div>
                          <span className="text-gray-600">Выезд:</span>
                          <span className="ml-2 font-semibold text-gray-900">
                            {new Date(booking.checkOut).toLocaleDateString('ru-RU', {
                              day: '2-digit',
                              month: 'long',
                              year: 'numeric',
                              weekday: 'long'
                            })}
                          </span>
                        </div>
                        <div>
                          <span className="text-gray-600">Количество ночей:</span>
                          <span className="ml-2 font-semibold text-gray-900">
                            {nights} {nights === 1 ? 'ночь' : nights < 5 ? 'ночи' : 'ночей'}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Гости */}
                    {booking.guests && booking.guests.length > 0 && (
                      <div className="bg-gray-50 rounded-lg p-4">
                        <h3 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
                          <Bed className="w-4 h-4" />
                          Гости ({booking.guests.length})
                        </h3>
                        <div className="space-y-2">
                          {booking.guests.map((guest, index) => (
                            <div key={index} className="flex items-center gap-3 p-2 bg-white rounded border border-gray-200">
                              {guest.image ? (
                                <img
                                  src={guest.image}
                                  alt={guest.name}
                                  className="w-10 h-10 rounded-full object-cover border border-gray-300"
                                />
                              ) : (
                                <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center border border-gray-300">
                                  <span className="text-sm text-gray-500 font-semibold">{guest.name.charAt(0).toUpperCase()}</span>
                                </div>
                              )}
                              <div className="flex-1">
                                <div className="font-semibold text-gray-900">{guest.name}</div>
                                {guest.email && (
                                  <div className="text-xs text-gray-500">{guest.email}</div>
                                )}
                                {guest.phone && (
                                  <div className="text-xs text-gray-500">{guest.phone}</div>
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Примечания */}
                    {booking.notes && (
                      <div className="bg-gray-50 rounded-lg p-4">
                        <h3 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
                          <FileText className="w-4 h-4" />
                          Примечания
                        </h3>
                        <p className="text-sm text-gray-700 whitespace-pre-wrap">{booking.notes}</p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Действия */}
                <div className="mt-6 flex flex-wrap gap-2">
                  <button
                    onClick={() => {
                      if (confirm(`Вы уверены, что хотите отменить бронирование комнаты #${booking.roomNumber}?`)) {
                        setShowDetailModal(false);
                        handleCancel(booking);
                      }
                    }}
                    className="px-4 py-2 bg-pink-900 hover:bg-pink-950 text-white rounded-lg font-semibold"
                  >
                    Отменить бронирование
                  </button>
                  <button
                    onClick={() => {
                      setShowDetailModal(false);
                      setSelectedBookingForDetail(null);
                    }}
                    className="px-4 py-2 bg-white hover:bg-gray-100 text-black border border-black rounded-lg font-semibold"
                  >
                    Закрыть
                  </button>
                </div>
              </div>
            </div>
          </div>
        );
      })()}

    </div>
  );
}

