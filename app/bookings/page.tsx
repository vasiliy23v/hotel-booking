'use client';
/* eslint-disable @next/next/no-img-element */

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { BookOpen, Filter, X, ArrowUpDown, ArrowUp, ArrowDown, Building2, LogOut, ArrowLeft, Euro, Edit, CheckCircle } from 'lucide-react';
import { api } from '@/lib/api';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
// import { DatePicker } from '@/components/ui/date-picker';
import { BookingFormModal, type BookingFormData } from '@/components/booking/BookingFormModal';
import { ConfirmCancelBookingDialog } from '@/components/booking/ConfirmCancelBookingDialog';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
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
  
  // Состояние для подтверждения отмены бронирования
  const [showCancelDialog, setShowCancelDialog] = useState(false);
  const [bookingToCancel, setBookingToCancel] = useState<(BookingInfo & { roomNumber?: string }) | null>(null);
  const [isCanceling, setIsCanceling] = useState(false);
  
  // Состояние для диалога подтверждения выхода
  const [showLogoutDialog, setShowLogoutDialog] = useState(false);

  useEffect(() => {
    const userStr = localStorage.getItem('currentUser');
    if (userStr) {
      const user = JSON.parse(userStr);
      setCurrentUser(user);
    }
    loadBookings();
    // Перенаправляем на главную страницу, где бронирования отображаются по умолчанию
    router.push('/dashboard');
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
      const enrichedBookings = bookingsData.map((booking) => {
        const room = roomsData.find((r: Room) => r.id === booking.roomId);
        const hotel = hotelsData.find((h: Hotel) => h.id === room?.hotelId);
        return {
          id: booking.id,
          roomId: booking.roomId,
          bookedBy: booking.bookedBy,
          bookedDate: booking.bookedDate instanceof Date ? booking.bookedDate.toISOString() : String(booking.bookedDate),
          email: booking.email || undefined,
          phone: booking.phone,
          checkIn: booking.checkIn instanceof Date ? booking.checkIn.toISOString().split('T')[0] : String(booking.checkIn),
          checkOut: booking.checkOut instanceof Date ? booking.checkOut.toISOString().split('T')[0] : String(booking.checkOut),
          guests: Array.isArray(booking.guests) ? booking.guests.map((g: { name: string; age?: number }) => ({ name: g.name, email: undefined, phone: undefined, image: undefined })) : undefined,
          notes: booking.notes || undefined,
          isConfirmed: booking.isConfirmed,
          confirmedBy: booking.confirmedBy || undefined,
          confirmedDate: booking.confirmedDate ? (booking.confirmedDate instanceof Date ? booking.confirmedDate.toISOString() : String(booking.confirmedDate)) : undefined,
          isPaid: booking.isPaid,
          paymentMethod: booking.paymentMethod || undefined,
          paymentDate: booking.paymentDate ? (booking.paymentDate instanceof Date ? booking.paymentDate.toISOString() : String(booking.paymentDate)) : undefined,
          paidBy: booking.paidBy || undefined,
          amount: booking.amount ? Number(booking.amount) : undefined,
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

  const handleCancel = (booking: BookingInfo & { roomNumber?: string }) => {
    setBookingToCancel(booking);
    setShowCancelDialog(true);
  };

  const handleConfirmCancel = async () => {
    if (!bookingToCancel?.id) return;
    
    setIsCanceling(true);
    try {
      await api.deleteBooking(bookingToCancel.id);
      await loadBookings();
      setShowCancelDialog(false);
      setBookingToCancel(null);
    } catch (error) {
      console.error('Error canceling booking:', error);
      alert('Ошибка при отмене бронирования');
    } finally {
      setIsCanceling(false);
    }
  };


  const handleEdit = (booking: BookingInfo & { roomNumber?: string; hotelName?: string }) => {
    setSelectedBookingForEdit(booking);
    setShowEditModal(true);
  };

  const handleSaveEdit = async (data: BookingFormData) => {
    if (!selectedBookingForEdit?.id) return;
    
    try {
      // Для обычного пользователя имя берется из currentUser
      // const _bookedByName = currentUser?.name || selectedBookingForEdit.bookedBy;

      // Обрабатываем флаг includeManager для менеджеров/разработчиков
      let finalGuests = [...data.guests];
      
      if ((currentUser?.role === 'manager' || currentUser?.role === 'developer') && data.includeManager !== undefined) {
        const managerInGuests = finalGuests.some(g => g.name === currentUser?.name);
        
        if (data.includeManager && !managerInGuests) {
          // Добавляем менеджера в список гостей
          finalGuests = [{
            name: currentUser?.name || '',
            email: currentUser?.email || '',
            phone: currentUser?.phone || '',
          }, ...finalGuests];
        } else if (!data.includeManager && managerInGuests) {
          // Убираем менеджера из списка гостей
          finalGuests = finalGuests.filter(g => g.name !== currentUser?.name);
        }
      }

      await api.updateBooking(selectedBookingForEdit.id, {
        checkIn: data.checkIn,
        checkOut: data.checkOut,
        guests: finalGuests,
        notes: data.notes,
        email: data.email,
        phone: data.phone,
      });
      setShowEditModal(false);
      setSelectedBookingForEdit(null);
      await loadBookings();
    } catch (error) {
      console.error('Error updating booking:', error);
      throw error;
    }
  };

  const handleLogout = () => {
    setShowLogoutDialog(true);
  };

  const confirmLogout = () => {
    localStorage.removeItem('currentUser');
    router.push('/');
  };

  if (loading || !currentUser) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-background flex items-center justify-center">
        <div className="text-lg text-gray-900 dark:text-foreground">Загрузка...</div>
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
    <div className="min-h-screen bg-gray-50 dark:bg-background">
      {/* Header */}
      <header className="bg-white dark:bg-card border-b border-gray-200 dark:border-border sticky top-0 z-20">
        <div className="max-w-7xl mx-auto px-3 sm:px-4 py-2 sm:py-3">
          <div className="flex justify-between items-center gap-2 sm:gap-4">
            <div className="flex items-center gap-2 sm:gap-3 min-w-0">
              <Link
                href="/dashboard"
                className="p-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-foreground hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
                title="Назад к дашборду"
              >
                <ArrowLeft className="w-5 h-5" />
              </Link>
              <Link href="/" prefetch={false} className="flex items-center gap-2 sm:gap-3 min-w-0 hover:opacity-80 transition-opacity">
                <Building2 className="w-5 h-5 sm:w-6 sm:h-6 text-gray-700 dark:text-foreground shrink-0" />
                <h1 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-foreground truncate cursor-pointer">Hotel Booking</h1>
              </Link>
              <span className={`hidden sm:inline text-xs px-2 py-0.5 rounded ${
                currentUser.role === 'manager' 
                  ? 'bg-gray-700 dark:bg-gray-600 text-white' 
                  : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300'
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
        <div className="bg-white dark:bg-card rounded-lg border border-gray-200 dark:border-border p-4 sm:p-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 sm:gap-4 mb-4 sm:mb-6">
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-foreground flex items-center gap-2">
              <BookOpen className="w-5 h-5 sm:w-6 sm:h-6" />
              {currentUser.role === 'manager' ? 'Бронирования' : 'Мои бронирования'}
            </h2>
            
            <div className="flex gap-2 w-full sm:w-auto">
              {hasActiveFilters && (
                <button
                  onClick={resetFilters}
                  className="px-3 py-1.5 rounded-lg text-xs sm:text-sm font-semibold transition-colors flex items-center gap-1.5 bg-white dark:bg-card text-gray-700 dark:text-foreground border border-gray-200 dark:border-border hover:bg-gray-50 dark:hover:bg-gray-800"
                >
                  <X className="w-3 h-3 sm:w-4 sm:h-4" />
                  <span className="hidden sm:inline">Сбросить</span>
                </button>
              )}
              <button
                onClick={() => setShowFilters(!showFilters)}
                className={`px-3 py-1.5 rounded-lg text-xs sm:text-sm font-semibold transition-colors flex items-center gap-1.5 ${
                  showFilters
                    ? 'bg-gray-900 dark:bg-gray-700 text-white'
                    : 'bg-white dark:bg-card text-gray-700 dark:text-foreground border border-gray-200 dark:border-border hover:bg-gray-50 dark:hover:bg-gray-800'
                }`}
              >
                <Filter className="w-3 h-3 sm:w-4 sm:h-4" />
                <span className="hidden sm:inline">Фильтры</span>
              </button>
            </div>
          </div>

          {/* Панель фильтров */}
          {showFilters && (
            <div className="mb-4 p-3 sm:p-4 bg-gray-50 dark:bg-gray-900/50 rounded-lg border border-gray-200 dark:border-border">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
                {currentUser.role === 'manager' && (
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 dark:text-foreground mb-1.5">Забронировано</label>
                    <input
                      type="text"
                      value={filterBookedBy}
                      onChange={(e) => setFilterBookedBy(e.target.value)}
                      placeholder="Имя пользователя"
                      className="w-full px-2 py-1.5 rounded text-xs border border-gray-300 dark:border-border bg-white dark:bg-card text-gray-700 dark:text-foreground focus:outline-none focus:border-gray-900 dark:focus:border-gray-600"
                    />
                  </div>
                )}
                <div>
                  <label className="block text-xs font-semibold text-gray-700 dark:text-foreground mb-1.5">Отель</label>
                  <select
                    value={filterHotelId}
                    onChange={(e) => setFilterHotelId(e.target.value)}
                    className="w-full px-2 py-1.5 rounded text-xs border border-gray-300 dark:border-border bg-white dark:bg-card text-gray-700 dark:text-foreground focus:outline-none focus:border-gray-900 dark:focus:border-gray-600"
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
                  <label className="block text-xs font-semibold text-gray-700 dark:text-foreground mb-1.5">Номер комнаты</label>
                  <input
                    type="text"
                    value={filterRoomNumber}
                    onChange={(e) => setFilterRoomNumber(e.target.value)}
                    placeholder="Номер комнаты"
                    className="w-full px-2 py-1.5 rounded text-xs border border-gray-300 dark:border-border bg-white dark:bg-card text-gray-700 dark:text-foreground focus:outline-none focus:border-gray-900 dark:focus:border-gray-600"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-700 dark:text-foreground mb-1.5">Заезд с</label>
                  <input
                    type="date"
                    value={filterDateFrom}
                    onChange={(e) => setFilterDateFrom(e.target.value)}
                    className="w-full px-2 py-1.5 rounded text-xs border border-gray-300 dark:border-border bg-white dark:bg-card text-gray-700 dark:text-foreground focus:outline-none focus:border-gray-900 dark:focus:border-gray-600"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-700 dark:text-foreground mb-1.5">Заезд до</label>
                  <input
                    type="date"
                    value={filterDateTo}
                    onChange={(e) => setFilterDateTo(e.target.value)}
                    className="w-full px-2 py-1.5 rounded text-xs border border-gray-300 dark:border-border bg-white dark:bg-card text-gray-700 dark:text-foreground focus:outline-none focus:border-gray-900 dark:focus:border-gray-600"
                  />
                </div>
              </div>
            </div>
          )}

          {loading ? (
            <div className="text-center py-12">
              <div className="text-lg text-gray-900 dark:text-foreground">Загрузка...</div>
            </div>
          ) : filteredBookings.length === 0 ? (
            <div className="text-center py-12">
              <BookOpen className="w-12 h-12 text-gray-400 dark:text-gray-600 mx-auto mb-4" />
              <p className="text-gray-500 dark:text-gray-400 text-lg">Бронирования не найдены</p>
            </div>
          ) : currentUser.role !== 'manager' && bookingsByHotel ? (
            // Для обычных пользователей - группировка по отелям
            <div className="space-y-6">
              {Object.entries(bookingsByHotel).map(([hotelId, hotelBookings]) => {
                const hotel = hotels.find(h => h.id === hotelId);
                if (!hotel) return null;
                
                return (
                  <div key={hotelId} className="border border-gray-200 dark:border-border rounded-lg overflow-hidden">
                    {/* Заголовок отеля */}
                    <div className="bg-gray-50 dark:bg-gray-900/50 px-4 py-3 border-b border-gray-200 dark:border-border">
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="text-lg font-bold text-gray-900 dark:text-foreground">{hotel.name}</h3>
                          <p className="text-sm text-gray-600 dark:text-gray-400">{hotel.address}</p>
                        </div>
                        <div className="text-sm text-gray-500 dark:text-gray-400">
                          {hotelBookings.length} {hotelBookings.length === 1 ? 'бронирование' : hotelBookings.length < 5 ? 'бронирования' : 'бронирований'}
                        </div>
                      </div>
                    </div>
                    
                    {/* Список бронирований в отеле */}
                    <div className="divide-y divide-gray-100 dark:divide-gray-800">
                      {hotelBookings.map((booking) => {
                        const nights = Math.ceil(
                          (new Date(booking.checkOut).getTime() - new Date(booking.checkIn).getTime()) / 
                          (1000 * 60 * 60 * 24)
                        );
                        const room = rooms.find(r => r.id === booking.roomId);
                        
                        // Рассчитываем totalPrice с учётом perPerson
                        let totalPrice: number;
                        if (booking.amount) {
                          totalPrice = booking.amount;
                        } else if (room?.pricePerPerson && booking.guests) {
                          const guestsCount = Array.isArray(booking.guests) ? booking.guests.length : 0;
                          totalPrice = nights * (room?.price || 0) * guestsCount;
                        } else {
                          totalPrice = nights * (room?.price || 0);
                        }
                        
                        return (
                          <div
                            key={booking.id}
                            className="p-4 hover:bg-gray-50 dark:hover:bg-gray-900/50 transition-colors"
                          >
                            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                              {/* Основная информация */}
                              <div className="flex-1 space-y-3">
                                <div className="flex items-start gap-3">
                                  <div className="flex-1">
                                    <div className="flex items-center gap-2 mb-1">
                                      <span className="font-bold text-gray-900 dark:text-foreground">Комната #{booking.roomNumber || 'N/A'}</span>
                                      {room && (
                                        <span className="text-xs text-gray-500 dark:text-gray-400 px-2 py-0.5 bg-gray-100 dark:bg-gray-800 rounded">
                                          {room.type === 'FZ' ? 'Семейная' : room.type === 'DZ' ? 'Двухместная' : room.type === 'EZ' ? 'Одноместная' : room.type === 'MZ' ? 'Многоместная' : room.type === 'App' ? 'Апартаменты' : 'Общее'}
                                        </span>
                                      )}
                                    </div>
                                    <div className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
                                      <div className="flex items-center gap-2">
                                        <span className="font-semibold">Заезд:</span>
                                        <span>{new Date(booking.checkIn).toLocaleDateString('ru-RU')}</span>
                                      </div>
                                      <div className="flex items-center gap-2">
                                        <span className="font-semibold">Выезд:</span>
                                        <span>{new Date(booking.checkOut).toLocaleDateString('ru-RU')}</span>
                                        <span className="text-xs text-gray-500 dark:text-gray-400">({nights} {nights === 1 ? 'ночь' : nights < 5 ? 'ночи' : 'ночей'})</span>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                                
                                {/* Гости */}
                                {booking.guests && booking.guests.length > 0 && (
                                  <div>
                                    <div className="text-xs font-semibold text-gray-700 dark:text-foreground mb-1">
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
                                            <div                                               className="w-6 h-6 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center border border-gray-300 dark:border-gray-600">
                                              <span className="text-xs text-gray-500 dark:text-gray-300">{g.name.charAt(0).toUpperCase()}</span>
                                            </div>
                                          )}
                                          <span className="text-xs text-gray-700 dark:text-gray-300">{g.name}</span>
                                        </div>
                                      ))}
                                    </div>
                                  </div>
                                )}
                                
                                {/* Примечания */}
                                {booking.notes && (
                                  <div>
                                    <div className="text-xs font-semibold text-gray-700 dark:text-foreground mb-1">Примечания:</div>
                                    <div className="text-xs text-gray-600 dark:text-gray-400">{booking.notes}</div>
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
                                    <div className="text-sm font-bold text-gray-900 dark:text-foreground">
                                      {totalPrice.toFixed(2)}€
                                      {room && room.price > 0 && (
                                        <span className="text-xs text-gray-500 font-normal ml-1">
                                          ({room.price}€{room.pricePerPerson ? ' p.P.' : ''}/ночь)
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
              <Table className="min-w-[1200px]">
                <TableHeader>
                        <TableRow className="border-b border-gray-200 dark:border-border hover:bg-transparent">
                    {currentUser.role === 'manager' ? (
                      <>
                        <TableHead className="text-xs text-gray-600 dark:text-gray-400 whitespace-nowrap font-normal">Отель</TableHead>
                        <TableHead className="text-xs text-gray-600 dark:text-gray-400 whitespace-nowrap font-normal">Комната</TableHead>
                        <TableHead 
                          className="text-xs text-gray-600 dark:text-gray-400 cursor-pointer whitespace-nowrap font-normal"
                          onClick={() => handleSort('bookedBy')}
                        >
                          <div className="flex items-center gap-1">
                            Кто бронировал
                            {sortBy === 'bookedBy' && (
                              sortDirection === 'asc' ? <ArrowUp className="w-3 h-3" /> : <ArrowDown className="w-3 h-3" />
                            )}
                            {sortBy !== 'bookedBy' && <ArrowUpDown className="w-3 h-3 text-gray-400 dark:text-gray-500" />}
                          </div>
                        </TableHead>
                        <TableHead className="text-xs text-gray-600 dark:text-gray-400 whitespace-nowrap font-normal">Контакты</TableHead>
                        <TableHead 
                          className="text-xs text-gray-600 dark:text-gray-400 cursor-pointer whitespace-nowrap font-normal"
                          onClick={() => handleSort('checkIn')}
                        >
                          <div className="flex items-center gap-1">
                            Заезд
                            {sortBy === 'checkIn' && (
                              sortDirection === 'asc' ? <ArrowUp className="w-3 h-3" /> : <ArrowDown className="w-3 h-3" />
                            )}
                            {sortBy !== 'checkIn' && <ArrowUpDown className="w-3 h-3 text-gray-400 dark:text-gray-500" />}
                          </div>
                        </TableHead>
                        <TableHead 
                          className="text-xs text-gray-600 dark:text-gray-400 cursor-pointer whitespace-nowrap font-normal"
                          onClick={() => handleSort('checkOut')}
                        >
                          <div className="flex items-center gap-1">
                            Выезд
                            {sortBy === 'checkOut' && (
                              sortDirection === 'asc' ? <ArrowUp className="w-3 h-3" /> : <ArrowDown className="w-3 h-3" />
                            )}
                            {sortBy !== 'checkOut' && <ArrowUpDown className="w-3 h-3 text-gray-400 dark:text-gray-500" />}
                          </div>
                        </TableHead>
                        <TableHead className="text-xs text-gray-600 dark:text-gray-400 whitespace-nowrap font-normal">Гости</TableHead>
                        <TableHead className="text-xs text-gray-600 dark:text-gray-400 whitespace-nowrap font-normal">Сумма</TableHead>
                        <TableHead className="text-xs text-gray-600 dark:text-gray-400 whitespace-nowrap font-normal">Примечания</TableHead>
                        <TableHead className="text-xs text-gray-600 dark:text-gray-400 whitespace-nowrap font-normal">Действия</TableHead>
                      </>
                    ) : (
                      <>
                        <TableHead className="text-xs text-gray-600 dark:text-gray-400 whitespace-nowrap font-normal">Отель</TableHead>
                        <TableHead 
                          className="text-xs text-gray-600 dark:text-gray-400 cursor-pointer whitespace-nowrap font-normal"
                          onClick={() => handleSort('roomNumber')}
                        >
                          <div className="flex items-center gap-1">
                            Комната
                            {sortBy === 'roomNumber' && (
                              sortDirection === 'asc' ? <ArrowUp className="w-3 h-3" /> : <ArrowDown className="w-3 h-3" />
                            )}
                            {sortBy !== 'roomNumber' && <ArrowUpDown className="w-3 h-3 text-gray-400 dark:text-gray-500" />}
                          </div>
                        </TableHead>
                        <TableHead 
                          className="text-xs text-gray-600 dark:text-gray-400 cursor-pointer whitespace-nowrap font-normal"
                          onClick={() => handleSort('checkIn')}
                        >
                          <div className="flex items-center gap-1">
                            Заезд
                            {sortBy === 'checkIn' && (
                              sortDirection === 'asc' ? <ArrowUp className="w-3 h-3" /> : <ArrowDown className="w-3 h-3" />
                            )}
                            {sortBy !== 'checkIn' && <ArrowUpDown className="w-3 h-3 text-gray-400 dark:text-gray-500" />}
                          </div>
                        </TableHead>
                        <TableHead 
                          className="text-xs text-gray-600 dark:text-gray-400 cursor-pointer whitespace-nowrap font-normal"
                          onClick={() => handleSort('checkOut')}
                        >
                          <div className="flex items-center gap-1">
                            Выезд
                            {sortBy === 'checkOut' && (
                              sortDirection === 'asc' ? <ArrowUp className="w-3 h-3" /> : <ArrowDown className="w-3 h-3" />
                            )}
                            {sortBy !== 'checkOut' && <ArrowUpDown className="w-3 h-3 text-gray-400 dark:text-gray-500" />}
                          </div>
                        </TableHead>
                        <TableHead className="text-xs text-gray-600 dark:text-gray-400 whitespace-nowrap font-normal">Гости</TableHead>
                        <TableHead className="text-xs text-gray-600 dark:text-gray-400 whitespace-nowrap font-normal">Статус</TableHead>
                        <TableHead className="text-xs text-gray-600 dark:text-gray-400 whitespace-nowrap font-normal">Действия</TableHead>
                      </>
                    )}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredBookings.map((booking) => {
                    const nights = Math.ceil(
                      (new Date(booking.checkOut).getTime() - new Date(booking.checkIn).getTime()) / 
                      (1000 * 60 * 60 * 24)
                    );
                    const room = rooms.find(r => r.id === booking.roomId);
                    
                    // Рассчитываем totalPrice с учётом perPerson
                    let totalPrice: number;
                    if (booking.amount) {
                      totalPrice = booking.amount;
                    } else if (room?.pricePerPerson && booking.guests) {
                      const guestsCount = Array.isArray(booking.guests) ? booking.guests.length : 0;
                      totalPrice = nights * (room?.price || 0) * guestsCount;
                    } else {
                      totalPrice = nights * (room?.price || 0);
                    }
                    
                    const canCancel = currentUser.role === 'manager' || booking.bookedBy === currentUser.name;

                    if (currentUser.role === 'manager') {
                      return (
                        <TableRow key={booking.id} className="hover:bg-gray-100 dark:hover:bg-gray-900/50 transition-colors">
                          {/* Отель */}
                          <TableCell className="py-3">
                            <div className="text-sm text-gray-700">{booking.hotelName || 'N/A'}</div>
                          </TableCell>
                          
                          {/* Комната */}
                          <TableCell className="py-3">
                            <div className="text-sm text-gray-700">#{booking.roomNumber || 'N/A'}</div>
                            {room && (
                              <div className="text-xs text-gray-500 mt-0.5">
                                {room.type === 'FZ' ? 'Семейная' : room.type === 'DZ' ? 'Двухместная' : room.type === 'EZ' ? 'Одноместная' : 'Общее'}
                              </div>
                            )}
                          </TableCell>
                          
                          {/* Кто бронировал */}
                          <TableCell className="py-3">
                            <div className="text-sm text-gray-700 dark:text-foreground">{booking.bookedBy}</div>
                            <div className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                              {new Date(booking.bookedDate).toLocaleDateString('ru-RU')}
                            </div>
                          </TableCell>
                          
                          {/* Контакты */}
                          <TableCell className="py-3">
                            <div className="text-xs text-gray-600 dark:text-gray-400">
                              <div>{booking.email}</div>
                              <div className="text-gray-500 dark:text-gray-500 mt-0.5">{booking.phone}</div>
                            </div>
                          </TableCell>
                          
                          {/* Заезд */}
                          <TableCell className="py-3">
                            <div className="text-sm text-gray-700 dark:text-foreground">
                              {new Date(booking.checkIn).toLocaleDateString('ru-RU')}
                            </div>
                          </TableCell>
                          
                          {/* Выезд */}
                          <TableCell className="py-3">
                            <div className="text-sm text-gray-700 dark:text-foreground">
                              {new Date(booking.checkOut).toLocaleDateString('ru-RU')}
                            </div>
                            <div className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                              {nights} {nights === 1 ? 'ночь' : nights < 5 ? 'ночи' : 'ночей'}
                            </div>
                          </TableCell>
                          
                          {/* Гости */}
                          <TableCell className="py-3">
                            <div className="text-xs text-gray-600 dark:text-gray-400">
                              {booking.guests && booking.guests.length > 0 ? (
                                <div className="space-y-1">
                                  {booking.guests.map((g, i) => (
                                    <div key={i} className="flex items-center gap-1.5">
                                      {g.image ? (
                                        <img
                                          src={g.image}
                                          alt={g.name}
                                          className="w-5 h-5 rounded-full object-cover border border-gray-200 dark:border-gray-600"
                                        />
                                      ) : (
                                        <div className="w-5 h-5 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center border border-gray-200 dark:border-gray-600">
                                          <span className="text-xs text-gray-500 dark:text-gray-300">{g.name.charAt(0).toUpperCase()}</span>
                                        </div>
                                      )}
                                      <span className="text-gray-600 dark:text-gray-400">{g.name}</span>
                                    </div>
                                  ))}
                                </div>
                              ) : (
                                <span className="text-gray-400 dark:text-gray-500">Нет гостей</span>
                              )}
                            </div>
                          </TableCell>
                          
                          {/* Подтверждение */}
                          <TableCell className="py-3">
                            {booking.isConfirmed ? (
                              <div className="flex items-center gap-1.5 text-xs text-green-600 dark:text-green-400">
                                <div className="w-1.5 h-1.5 rounded-full bg-green-500 dark:bg-green-400"></div>
                                <span>Подтверждено</span>
                              </div>
                            ) : (
                              <div className="flex items-center gap-1.5 text-xs text-yellow-600 dark:text-yellow-500">
                                <div className="w-1.5 h-1.5 rounded-full bg-yellow-500 dark:bg-yellow-400"></div>
                                <span>Ожидает</span>
                              </div>
                            )}
                            {booking.confirmedBy && (
                              <div className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                                {booking.confirmedBy}
                              </div>
                            )}
                            {booking.confirmedDate && (
                              <div className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                                {new Date(booking.confirmedDate).toLocaleDateString('ru-RU')}
                              </div>
                            )}
                          </TableCell>
                          
                          {/* Оплата */}
                          <TableCell className="py-3">
                            {booking.isPaid ? (
                              <div className="space-y-0.5">
                                <div className="flex items-center gap-1.5 text-xs text-green-600 dark:text-green-400">
                                  <div className="w-1.5 h-1.5 rounded-full bg-green-500 dark:bg-green-400"></div>
                                  <span>Оплачено</span>
                                </div>
                                <div className="text-xs text-gray-500 dark:text-gray-400">
                                  {booking.paymentMethod === 'cash' ? 'Наличными' : 
                                   booking.paymentMethod === 'transfer' ? 'Переводом' : '-'}
                                </div>
                                {booking.paymentDate && (
                                  <div className="text-xs text-gray-500 dark:text-gray-400">
                                    {new Date(booking.paymentDate).toLocaleDateString('ru-RU')}
                                  </div>
                                )}
                              </div>
                            ) : (
                              <div className="flex items-center gap-1.5 text-xs text-red-600 dark:text-red-400">
                                <div className="w-1.5 h-1.5 rounded-full bg-red-500 dark:bg-red-400"></div>
                                <span>Не оплачено</span>
                              </div>
                            )}
                          </TableCell>
                          
                          {/* Сумма */}
                          <TableCell className="py-3">
                            <div className="text-sm text-gray-700 dark:text-foreground">
                              {totalPrice > 0 ? `${totalPrice.toFixed(2)}€` : '-'}
                            </div>
                            {room && room.price > 0 && (
                              <div className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                                {room.price}€{room.pricePerPerson ? ' p.P.' : ''}/ночь
                              </div>
                            )}
                          </TableCell>
                          
                          {/* Примечания */}
                          <TableCell className="py-3">
                            <div className="text-xs text-gray-500 dark:text-gray-400 max-w-xs">
                              {booking.notes ? (
                                <div title={booking.notes} className="truncate">
                                  {booking.notes}
                                </div>
                              ) : (
                                <span className="text-gray-400 dark:text-gray-500">-</span>
                              )}
                            </div>
                          </TableCell>
                          
                          {/* Действия */}
                          <TableCell className="py-3" onClick={(e) => e.stopPropagation()}>
                            <div className="flex flex-col gap-1">
                              <button
                                onClick={() => handleEdit(booking)}
                                className="px-2 py-1 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-700 dark:text-foreground rounded text-xs whitespace-nowrap transition-colors flex items-center gap-1"
                                title="Редактировать бронирование"
                              >
                                <Edit className="w-3 h-3" />
                                Редактировать
                              </button>
                              {canCancel && (
                                <button
                                  onClick={() => handleCancel(booking)}
                                  className="px-2 py-1 bg-red-50 dark:bg-red-900/30 hover:bg-red-100 dark:hover:bg-red-900/50 text-red-700 dark:text-red-400 rounded text-xs whitespace-nowrap transition-colors"
                                  title="Отменить бронирование"
                                >
                                  Отменить
                                </button>
                              )}
                            </div>
                          </TableCell>
                        </TableRow>
                      );
                    } else {
                      // Для гостей - упрощенная версия
                      return (
                        <TableRow
                          key={booking.id}
                          className={`hover:bg-gray-100 dark:hover:bg-gray-900/50 transition-colors ${
                            booking.bookedBy === currentUser.name
                              ? 'bg-blue-50/30 dark:bg-blue-900/20'
                              : ''
                          }`}
                        >
                          {/* Отель */}
                          <TableCell className="py-3">
                            <div className="text-sm text-gray-700">{booking.hotelName || 'N/A'}</div>
                          </TableCell>
                          
                          {/* Комната */}
                          <TableCell className="py-3">
                            <div className="text-sm text-gray-700">#{booking.roomNumber || 'N/A'}</div>
                            {room && (
                              <div className="text-xs text-gray-500 mt-0.5">
                                {room.type === 'FZ' ? 'FZ' : room.type === 'DZ' ? 'DZ' : room.type === 'EZ' ? 'EZ' : room.type === 'MZ' ? 'MZ' : room.type === 'App' ? 'App' : ''}
                              </div>
                            )}
                          </TableCell>
                          <TableCell className="py-3 text-sm text-gray-700 dark:text-foreground">
                            {new Date(booking.checkIn).toLocaleDateString('ru-RU')}
                          </TableCell>
                          <TableCell className="py-3 text-sm text-gray-700 dark:text-foreground">
                            <div>{new Date(booking.checkOut).toLocaleDateString('ru-RU')}</div>
                            <div className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                              {nights} {nights === 1 ? 'ночь' : nights < 5 ? 'ночи' : 'ночей'}
                            </div>
                          </TableCell>
                          <TableCell className="py-3">
                            <div className="text-xs text-gray-600 dark:text-gray-400">
                              {booking.guests && booking.guests.length > 0 ? (
                                <div className="space-y-1">
                                  {booking.guests.slice(0, 3).map((g, i) => (
                                    <div key={i} className="flex items-center gap-1.5">
                                      {g.image ? (
                                        <img
                                          src={g.image}
                                          alt={g.name}
                                          className="w-5 h-5 rounded-full object-cover border border-gray-200 dark:border-gray-600"
                                        />
                                      ) : (
                                        <div className="w-5 h-5 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center border border-gray-200 dark:border-gray-600">
                                          <span className="text-xs text-gray-500 dark:text-gray-300">{g.name.charAt(0).toUpperCase()}</span>
                                        </div>
                                      )}
                                      <span className="text-gray-600 dark:text-gray-400">{g.name}</span>
                                    </div>
                                  ))}
                                  {booking.guests.length > 3 && (
                                    <div className="text-gray-400 dark:text-gray-500 text-[10px]">+{booking.guests.length - 3} еще</div>
                                  )}
                                </div>
                              ) : (
                                <span className="text-gray-400 dark:text-gray-500">Нет гостей</span>
                              )}
                            </div>
                          </TableCell>
                          <TableCell className="py-3">
                            {booking.isConfirmed ? (
                              <div className="flex items-center gap-1.5 text-xs text-green-600">
                                <div className="w-1.5 h-1.5 rounded-full bg-green-500"></div>
                                <span>Подтверждено</span>
                              </div>
                            ) : (
                              <div className="flex items-center gap-1.5 text-xs text-yellow-600">
                                <div className="w-1.5 h-1.5 rounded-full bg-yellow-500"></div>
                                <span>Ожидает</span>
                              </div>
                            )}
                          </TableCell>
                          <TableCell className="py-3" onClick={(e) => e.stopPropagation()}>
                            <div className="flex flex-col gap-1">
                              {/* Кнопка редактирования всегда доступна для пользователя в его бронированиях */}
                              {booking.bookedBy === currentUser.name && (
                                <>
                                  <button
                                    onClick={() => handleEdit(booking)}
                                    className="px-2 py-1 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-700 dark:text-foreground rounded text-xs whitespace-nowrap transition-colors flex items-center gap-1"
                                    title="Редактировать бронирование"
                                  >
                                    <Edit className="w-3 h-3" />
                                    Редактировать
                                  </button>
                                  <button
                                    onClick={() => handleCancel(booking)}
                                    className="px-2 py-1 bg-red-50 dark:bg-red-900/30 hover:bg-red-100 dark:hover:bg-red-900/50 text-red-700 dark:text-red-400 rounded text-xs whitespace-nowrap transition-colors"
                                    title="Отменить бронирование"
                                  >
                                    Отменить
                                  </button>
                                </>
                              )}
                            </div>
                          </TableCell>
                        </TableRow>
                      );
                    }
                  })}
                </TableBody>
              </Table>
            </div>
          )}
        </div>
      </main>


      {/* Модальное окно для редактирования бронирования */}
      {showEditModal && selectedBookingForEdit && (() => {
        const bookingRoom = rooms.find(r => r.id === selectedBookingForEdit.roomId);
        const bookingHotel = bookingRoom ? hotels.find(h => h.id === bookingRoom.hotelId) : null;
        return (
          <BookingFormModal
            isOpen={showEditModal}
            onClose={() => {
              setShowEditModal(false);
              setSelectedBookingForEdit(null);
            }}
            onSubmit={handleSaveEdit}
            initialData={{
              checkIn: selectedBookingForEdit.checkIn.split('T')[0],
              checkOut: selectedBookingForEdit.checkOut.split('T')[0],
              guests: selectedBookingForEdit.guests || [],
              email: selectedBookingForEdit.email || '',
              phone: selectedBookingForEdit.phone || '',
              notes: selectedBookingForEdit.notes || '',
              includeManager: (currentUser?.role === 'manager' || currentUser?.role === 'developer') && 
                (selectedBookingForEdit.guests || []).some(g => g.name === currentUser?.name),
            }}
            room={bookingRoom || undefined}
            hotelName={bookingHotel?.name}
            currentUser={currentUser}
            mode="edit"
            excludeBookingId={selectedBookingForEdit.id}
          />
        );
      })()}

      {/* Модальное окно подтверждения отмены бронирования */}
      <ConfirmCancelBookingDialog
        isOpen={showCancelDialog}
        onClose={() => {
          setShowCancelDialog(false);
          setBookingToCancel(null);
        }}
        onConfirm={handleConfirmCancel}
        roomNumber={bookingToCancel?.roomNumber}
        bookedBy={bookingToCancel?.bookedBy}
        isSubmitting={isCanceling}
      />

      {/* Диалог подтверждения выхода */}
      <AlertDialog open={showLogoutDialog} onOpenChange={setShowLogoutDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Подтверждение выхода</AlertDialogTitle>
            <AlertDialogDescription>
              Вы уверены, что хотите выйти?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Отмена</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                setShowLogoutDialog(false);
                confirmLogout();
              }}
            >
              Выйти
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}


