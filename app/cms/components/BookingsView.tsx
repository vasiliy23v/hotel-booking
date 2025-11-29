'use client';

import { useState, useEffect } from 'react';
import { BookOpen, Filter, X, ArrowUpDown, ArrowUp, ArrowDown, Euro, TrendingUp, Eye, Calendar, User as UserIcon, Phone, Mail, MapPin, Bed, FileText, Building2 } from 'lucide-react';
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


  // Фильтруем бронирования
  let filteredBookings = bookings;

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

  const resetFilters = () => {
    setFilterHotel('');
    setFilterBookedBy('');
    setFilterRoomNumber('');
    setFilterDateFrom('');
    setFilterDateTo('');
  };

  const hasActiveFilters = filterHotel || filterBookedBy || filterRoomNumber || filterDateFrom || filterDateTo;

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
          <div className="w-full sm:w-auto">
            <label className="block text-xs font-semibold text-gray-700 mb-2">Фильтр по отелю</label>
            <select
              value={filterHotelId}
              onChange={(e) => {
                setFilterHotelId(e.target.value);
                loadStatistics(e.target.value || undefined);
                if (e.target.value) {
                  const hotel = hotels.find(h => h.id === e.target.value);
                  if (hotel) {
                    setFilterHotel(hotel.name);
                  }
                } else {
                  setFilterHotel('');
                }
              }}
              className="w-full sm:w-64 px-3 py-2 border-2 border-gray-300 rounded-lg focus:border-gray-900 focus:outline-none bg-white text-gray-900 text-sm"
            >
              <option value="">Все отели</option>
              {hotels.map((hotel) => (
                <option key={hotel.id} value={hotel.id}>
                  {hotel.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Объединенная статистика */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-7 gap-3 sm:gap-4 mb-4 sm:mb-6">
          {/* Статистика комнат */}
          {!statisticsLoading && statistics && (
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

              <div className="bg-emerald-600 rounded-lg p-4 border border-emerald-700">
                <div className="flex items-center gap-2 mb-2">
                  <Euro className="w-5 h-5 text-white" />
                  <span className="text-sm text-white font-semibold">Доход</span>
                </div>
                <div className="text-2xl sm:text-3xl font-bold text-white">{statistics.revenue}€</div>
              </div>
            </>
          )}

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
              
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-3 sm:p-4">
                <div className="flex items-center gap-2 mb-1">
                  <TrendingUp className="w-4 h-4 text-gray-600" />
                  <span className="text-xs font-semibold text-gray-900">Общая сумма</span>
                </div>
                <div className="text-xl sm:text-2xl font-bold text-gray-900">{totalRevenue.toFixed(2)}€</div>
              </div>
            </>
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
                  const alreadyPaid = booking.isPaid ? (booking.amount || 0) : 0;
                  const remainingAmount = Math.max(0, expectedAmount - alreadyPaid);
                  const totalPrice = booking.amount || expectedAmount;

                  return (
                    <tr
                      key={booking.id}
                      className="border-b border-gray-100 hover:bg-gray-50 transition-colors"
                    >
                      <td className="px-3 py-2.5">
                        <div className="text-sm font-semibold text-gray-900">{booking.hotelName || 'N/A'}</div>
                      </td>
                      
                      <td className="px-3 py-2.5">
                        <div className="font-semibold text-gray-900">#{booking.roomNumber || 'N/A'}</div>
                        {room && (
                          <div className="text-xs text-gray-500">
                            {room.type === 'FZ' ? 'Семейная' : room.type === 'DZ' ? 'Двухместная' : room.type === 'EZ' ? 'Одноместная' : 'Общее'}
                          </div>
                        )}
                      </td>
                      
                      <td className="px-3 py-2.5">
                        <div className="text-sm font-semibold text-gray-700">{booking.bookedBy}</div>
                        <div className="text-xs text-gray-500">
                          {new Date(booking.bookedDate).toLocaleDateString('ru-RU')}
                        </div>
                      </td>
                      
                      <td className="px-3 py-2.5">
                        <div className="text-xs text-gray-700">
                          <div className="font-semibold">{booking.email}</div>
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
                                  <span className="text-gray-700">{g.name}</span>
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
                            {room.price}€/ночь
                          </div>
                        )}
                      </td>
                      
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
                                {room.type === 'FZ' ? 'Семейная' : room.type === 'DZ' ? 'Двухместная' : room.type === 'EZ' ? 'Одноместная' : 'Общее'}
                              </span>
                            </div>
                            <div>
                              <span className="text-gray-600">Вместимость:</span>
                              <span className="ml-2 text-gray-900">{room.capacity}</span>
                            </div>
                            <div>
                              <span className="text-gray-600">Цена за ночь:</span>
                              <span className="ml-2 font-semibold text-gray-900">{room.price}€</span>
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

