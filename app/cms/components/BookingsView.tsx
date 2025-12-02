'use client';

import { useState, useEffect, ReactElement } from 'react';
import { BookOpen, Filter, X, ArrowUpDown, ArrowUp, ArrowDown, Euro, Calendar, User as UserIcon, Phone, Mail, MapPin, Bed, FileText, Building2, Search, Edit, MoreVertical, Trash2, Plus } from 'lucide-react';
import { api } from '@/lib/api';
import { DatePicker } from '@/components/ui/date-picker';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { BookingFormModal, type BookingFormData } from '@/components/booking/BookingFormModal';
import { ConfirmCancelBookingDialog } from '@/components/booking/ConfirmCancelBookingDialog';
import { ConfirmPaymentDialog } from '@/components/booking/ConfirmPaymentDialog';
import type { User, Room, Hotel, BookingInfo, Statistics, Guest } from '@/types';

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

  // Модальное окно для редактирования
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedBookingForEdit, setSelectedBookingForEdit] = useState<(BookingInfo & { roomNumber?: string; hotelName?: string }) | null>(null);

  // Открытое меню действий
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);
  
  // Состояние для подтверждения отмены бронирования
  const [showCancelDialog, setShowCancelDialog] = useState(false);
  const [bookingToCancel, setBookingToCancel] = useState<(BookingInfo & { roomNumber?: string }) | null>(null);
  const [isCanceling, setIsCanceling] = useState(false);
  
  // Состояние для подтверждения оплаты
  const [showPaymentDialog, setShowPaymentDialog] = useState(false);
  const [paymentBooking, setPaymentBooking] = useState<(BookingInfo & { roomNumber?: string }) | null>(null);
  const [paymentType, setPaymentType] = useState<'half' | 'full'>('half');
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);

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

  const loadAllData = async (hotelId?: string) => {
    try {
      setLoading(true);
      setStatisticsLoading(true);
      
      // Загружаем все данные параллельно
      const [bookingsData, roomsData, hotelsData, stats] = await Promise.all([
        api.getBookings(),
        api.getRooms(),
        api.getHotels(),
        api.getStatistics(hotelId || undefined).catch((err) => {
          console.error('Error loading statistics:', err);
          return null; // Возвращаем null если статистика не загрузилась
        })
      ]);

      setRooms(roomsData);
      setHotels(hotelsData);
      // Устанавливаем статистику только если она успешно загрузилась
      if (stats) {
        setStatistics(stats);
      }

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
      console.error('Error loading data:', error);
      setBookings([]);
      // Убеждаемся, что статистика сбрасывается при ошибке
      setStatistics(null);
    } finally {
      setLoading(false);
      setStatisticsLoading(false);
    }
  };

  useEffect(() => {
    const userStr = localStorage.getItem('currentUser');
    if (userStr) {
      const user = JSON.parse(userStr);
      setCurrentUser(user);
    }
    loadAllData();
  }, []);

  useEffect(() => {
    // Обновляем статистику при изменении фильтра по отелю
    // Не вызываем loadAllData если hotels еще не загружены (избегаем бесконечного цикла)
    if (hotels.length === 0) return;
    
    if (filterHotel) {
      const hotel = hotels.find(h => h.name === filterHotel || h.id === filterHotel);
      if (hotel) {
        setFilterHotelId(hotel.id);
        loadAllData(hotel.id);
      } else {
        setFilterHotelId('');
        loadAllData();
      }
    } else {
      setFilterHotelId('');
      loadAllData();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filterHotel]);

  useEffect(() => {
    // Закрываем меню при нажатии Escape
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setOpenMenuId(null);
      }
    };
    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, []);

  useEffect(() => {
    // Закрываем меню при открытии модального окна
    if (showDetailModal || showEditModal) {
      setOpenMenuId(null);
    }
  }, [showDetailModal, showEditModal]);

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
    setOpenMenuId(null);
    setSelectedBookingForEdit(booking);
    setShowEditModal(true);
  };

  const handleSaveEdit = async (data: BookingFormData) => {
    if (!selectedBookingForEdit?.id) return;
    
    try {
      // Определяем имя того, кто бронирует
      let bookedByName: string;
      
      if (currentUser?.role === 'manager') {
        // Менеджер может изменить имя пользователя
        bookedByName = data.manualUserName?.trim() || selectedBookingForEdit.bookedBy;
      } else {
        // Обычный пользователь - имя берется из currentUser
        bookedByName = currentUser?.name || selectedBookingForEdit.bookedBy;
      }

      await api.updateBooking(selectedBookingForEdit.id, {
        checkIn: data.checkIn,
        checkOut: data.checkOut,
        notes: data.notes,
        guests: data.guests,
        email: data.email,
        phone: data.phone,
        bookedBy: bookedByName,
      });
      setShowEditModal(false);
      setSelectedBookingForEdit(null);
      await loadBookings();
    } catch (error) {
      console.error('Error updating booking:', error);
      throw error;
    }
  };

  const handleConfirmHalfPayment = (booking: BookingInfo & { roomNumber?: string }) => {
    const nights = Math.ceil(
      (new Date(booking.checkOut).getTime() - new Date(booking.checkIn).getTime()) / 
      (1000 * 60 * 60 * 24)
    );
    const room = rooms.find(r => r.id === booking.roomId);
    const totalBookingAmount = nights * (room?.price || 0);
    const alreadyPaid = booking.amount || 0;
    const halfAmount = totalBookingAmount / 2;
    const amountToAdd = halfAmount - alreadyPaid;

    if (amountToAdd <= 0) {
      alert('Бронирование уже оплачено на 50% или более');
      return;
    }

    setPaymentBooking(booking);
    setPaymentType('half');
    setShowPaymentDialog(true);
  };

  const handleConfirmFullPayment = (booking: BookingInfo & { roomNumber?: string }) => {
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

    setPaymentBooking(booking);
    setPaymentType('full');
    setShowPaymentDialog(true);
  };

  const handleProcessPayment = async () => {
    if (!paymentBooking || !currentUser) return;

    setIsProcessingPayment(true);
    try {
      const nights = Math.ceil(
        (new Date(paymentBooking.checkOut).getTime() - new Date(paymentBooking.checkIn).getTime()) / 
        (1000 * 60 * 60 * 24)
      );
      const room = rooms.find(r => r.id === paymentBooking.roomId);
      const totalAmount = nights * (room?.price || 0);
      const paymentAmount = paymentType === 'half' ? totalAmount / 2 : totalAmount;

      if (paymentBooking.id) {
        await api.updateBooking(paymentBooking.id, {
          amount: paymentAmount,
          isPaid: paymentType === 'full', // Полная оплата только для 100%
          paidBy: currentUser.name,
          paymentDate: new Date().toISOString(),
        });
        await loadBookings();
        setShowPaymentDialog(false);
        setPaymentBooking(null);
        alert(`Подтверждена оплата ${paymentType === 'half' ? '50%' : '100%'} (${paymentAmount.toFixed(2)}€)`);
      }
    } catch (error) {
      console.error('Error confirming payment:', error);
      alert('Ошибка при подтверждении оплаты');
    } finally {
      setIsProcessingPayment(false);
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
      const matchesGuestNames = b.guests?.some((guest: Guest) => 
        guest.name?.toLowerCase().includes(query)
      ) || false;
      
      // Поиск по email гостей
      const matchesGuestEmails = b.guests?.some((guest: Guest) => 
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

  // Группируем бронирования по комнатам для визуального объединения
  // Сначала сортируем по номеру комнаты, затем по датам заезда
  const sortedForGrouping = [...filteredBookings].sort((a, b) => {
    const roomCompare = (a.roomNumber || '').localeCompare(b.roomNumber || '');
    if (roomCompare !== 0) return roomCompare;
    return new Date(a.checkIn).getTime() - new Date(b.checkIn).getTime();
  });
  
  const groupedBookings: Array<{
    roomKey: string;
    bookings: typeof filteredBookings;
  }> = [];
  
  const roomGroups = new Map<string, typeof filteredBookings>();
  sortedForGrouping.forEach(booking => {
    const room = rooms.find(r => r.id === booking.roomId);
    const hotelId = room?.hotelId || '';
    const roomKey = `${hotelId}_${booking.roomId || ''}`;
    if (!roomGroups.has(roomKey)) {
      roomGroups.set(roomKey, []);
    }
    roomGroups.get(roomKey)!.push(booking);
  });
  
  roomGroups.forEach((bookings, roomKey) => {
    // Сортируем бронирования внутри группы по датам
    bookings.sort((a, b) => new Date(a.checkIn).getTime() - new Date(b.checkIn).getTime());
    groupedBookings.push({ roomKey, bookings });
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

  // Вычисляем статистику бронирований на основе отфильтрованных данных
  const totalBookings = filteredBookings.length;
  const paidBookings = filteredBookings.filter(b => b.isPaid).length;
  
  // Вычисляем финансовую статистику на основе отфильтрованных бронирований
  let totalRevenue = 0; // Ожидаемый доход (общая сумма всех бронирований)
  let paidRevenue = 0; // Доход (оплаченные бронирования)
  let unpaidAmount = 0; // Не оплачено
  
  filteredBookings.forEach(booking => {
    const nights = Math.ceil(
      (new Date(booking.checkOut).getTime() - new Date(booking.checkIn).getTime()) / 
      (1000 * 60 * 60 * 24)
    );
    const room = rooms.find(r => r.id === booking.roomId);
    const amount = booking.amount || (nights * (room?.price || 0));
    totalRevenue += amount;
    
    if (booking.isPaid) {
      paidRevenue += amount;
    } else {
      unpaidAmount += amount;
    }
  });

  return (
    <div className="space-y-4 sm:space-y-6">
      <div className="bg-white dark:bg-card rounded-lg border border-gray-200 dark:border-border p-4 sm:p-6">
        <div className="flex flex-col justify-between gap-3 sm:gap-4 mb-4 sm:mb-6">
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-foreground flex items-center gap-2">
            <BookOpen className="w-5 h-5 sm:w-6 sm:h-6" />
            Бронирования
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
            {/* Показываем скелетон загрузки, пока загружаются данные */}
            {(loading || statisticsLoading) ? (
              <>
                {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
                  <div key={i} className="rounded-lg p-3 sm:p-4 border border-gray-600 dark:border-gray-400">
                    <div className="h-3 w-16 sm:w-20 bg-gray-200 dark:bg-gray-700 rounded animate-pulse mb-2"></div>
                    <div className="h-6 sm:h-8 w-12 sm:w-16 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
                  </div>
                ))}
              </>
            ) : statistics ? (
              <>
                {/* Статистика комнат */}
                <div className="rounded-lg p-3 sm:p-4 border border-gray-500 dark:border-gray-200">
                  <div className="text-xs sm:text-sm text-gray-500 dark:text-muted-foreground mb-1.5">Всего комнат</div>
                  <div className="text-xl sm:text-2xl font-semibold text-gray-900 dark:text-foreground">{statistics.totalRooms}</div>
                </div>

                <div className="rounded-lg p-3 sm:p-4 border border-green-200 dark:border-green-800">
                  <div className="text-xs sm:text-sm text-gray-500 dark:text-muted-foreground mb-1.5">Свободно</div>
                  <div className="text-xl sm:text-2xl font-semibold text-green-600 dark:text-green-400">{statistics.availableRooms}</div>
                </div>

                <div className="rounded-lg p-3 sm:p-4 border border-gray-200 dark:border-border">
                  <div className="text-xs sm:text-sm text-gray-500 dark:text-muted-foreground mb-1.5">Забронировано</div>
                  <div className="text-xl sm:text-2xl font-semibold text-gray-900 dark:text-foreground">{statistics.bookedRooms}</div>
                </div>

                {/* Статистика бронирований */}
                <div className="rounded-lg p-3 sm:p-4 border border-gray-600 dark:border-gray-300">
                  <div className="text-xs sm:text-sm text-gray-600 dark:border-gray-300 mb-1.5">Всего бронирований</div>
                  <div className="text-xl sm:text-2xl font-semibold text-gray-600 dark:text-gray-300">{totalBookings}</div>
                </div>
                
                <div className="rounded-lg p-3 sm:p-4 border border-purple-200 dark:border-purple-800">
                  <div className="text-xs sm:text-sm text-gray-500 dark:text-muted-foreground mb-1.5">Оплачено</div>
                  <div className="text-xl sm:text-2xl font-semibold text-purple-600 dark:text-purple-400">{paidBookings}</div>
                </div>

                {/* Карточка: Не оплачено */}
                <div className="rounded-lg p-3 sm:p-4 border border-orange-200 dark:border-orange-800">
                  <div className="text-xs sm:text-sm text-gray-500 dark:text-muted-foreground mb-1.5">Не оплачено</div>
                  <div className="text-xl sm:text-2xl font-semibold text-orange-600 dark:text-orange-400">{unpaidAmount.toFixed(2)}€</div>
                </div>

                {/* Карточка: Доход */}
                <div className="rounded-lg p-3 sm:p-4 border border-emerald-200 dark:border-emerald-800">
                  <div className="text-xs sm:text-sm text-gray-500 dark:text-muted-foreground mb-1.5">Доход</div>
                  <div className="text-xl sm:text-2xl font-semibold text-emerald-600 dark:text-emerald-400">{paidRevenue.toFixed(2)}€</div>
                </div>

                {/* Карточка: Ожидаемый доход */}
                <div className="rounded-lg p-3 sm:p-4 border border-blue-200 dark:border-blue-800">
                  <div className="text-xs sm:text-sm text-gray-500 dark:text-muted-foreground mb-1.5">Ожидаемый доход</div>
                  <div className="text-xl sm:text-2xl font-semibold text-blue-600 dark:text-blue-400">{totalRevenue.toFixed(2)}€</div>
                </div>
              </>
            ) : (
              // Если статистика не загрузилась, показываем пустое состояние
              <div className="col-span-2 sm:col-span-4 text-center py-8 text-gray-500 dark:text-muted-foreground">
                Не удалось загрузить статистику
              </div>
            )}
          </div>
          <div className="flex gap-2 w-full sm:w-auto">
            {hasActiveFilters && (
              <button
                onClick={resetFilters}
                className="px-3 py-1.5 rounded-lg text-xs sm:text-sm font-semibold transition-colors flex items-center gap-1.5 bg-white dark:bg-card text-gray-700 dark:text-foreground border border-gray-200 dark:border-border hover:bg-gray-50 dark:hover:bg-accent"
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
                  : 'bg-white dark:bg-card text-gray-700 dark:text-foreground border border-gray-200 dark:border-border hover:bg-gray-50 dark:hover:bg-accent'
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
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 dark:text-muted-foreground" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Поиск по отелям, комнатам, именам или почте..."
              className="w-full pl-10 pr-4 py-2.5 border-2 border-gray-300 dark:border-border rounded-lg focus:border-gray-900 dark:focus:border-ring focus:outline-none bg-white dark:bg-input text-gray-900 dark:text-foreground text-sm"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-muted-foreground hover:text-gray-600 dark:hover:text-foreground"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        {/* Панель фильтров */}
        {showFilters && (
          <div className="mb-4 p-3 sm:p-4 bg-gray-50 dark:bg-muted rounded-lg border border-gray-200 dark:border-border">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 sm:gap-4">
              <div>
                <label className="block text-xs font-semibold text-gray-700 dark:text-foreground mb-1.5">Отель</label>
                <select
                  value={filterHotel}
                  onChange={(e) => setFilterHotel(e.target.value)}
                  className="w-full px-2 py-1.5 rounded text-xs border border-gray-300 dark:border-border bg-white dark:bg-input text-gray-700 dark:text-foreground focus:outline-none focus:border-gray-900 dark:focus:border-ring"
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
                <label className="block text-xs font-semibold text-gray-700 dark:text-foreground mb-1.5">Забронировано</label>
                <input
                  type="text"
                  value={filterBookedBy}
                  onChange={(e) => setFilterBookedBy(e.target.value)}
                  placeholder="Имя пользователя"
                  className="w-full px-2 py-1.5 rounded text-xs border border-gray-300 dark:border-border bg-white dark:bg-input text-gray-700 dark:text-foreground focus:outline-none focus:border-gray-900 dark:focus:border-ring"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1.5">Номер комнаты</label>
                <input
                  type="text"
                  value={filterRoomNumber}
                  onChange={(e) => setFilterRoomNumber(e.target.value)}
                  placeholder="Номер комнаты"
                  className="w-full px-2 py-1.5 rounded text-xs border border-gray-300 dark:border-border bg-white dark:bg-input text-gray-700 dark:text-foreground focus:outline-none focus:border-gray-900 dark:focus:border-ring"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1.5">Заезд с</label>
                <DatePicker
                  date={filterDateFrom ? new Date(filterDateFrom) : undefined}
                  onSelect={(date) => setFilterDateFrom(date ? `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}` : '')}
                  placeholder="С даты"
                  maxDate={filterDateTo ? new Date(filterDateTo) : undefined}
                  className="w-full text-xs"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1.5">Заезд до</label>
                <DatePicker
                  date={filterDateTo ? new Date(filterDateTo) : undefined}
                  onSelect={(date) => setFilterDateTo(date ? `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}` : '')}
                  placeholder="До даты"
                  minDate={filterDateFrom ? new Date(filterDateFrom) : undefined}
                  className="w-full text-xs"
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
            <BookOpen className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500 text-lg">Бронирования не найдены</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <Table className="min-w-[1200px]">
              <TableHeader>
                <TableRow className="border-b border-gray-200 dark:border-border hover:bg-transparent">
                  <TableHead className="text-xs text-gray-600 dark:text-muted-foreground whitespace-nowrap font-normal">Отель</TableHead>
                  <TableHead className="text-xs text-gray-600 dark:text-muted-foreground whitespace-nowrap font-normal">Комната</TableHead>
                  <TableHead 
                    className="text-xs text-gray-600 dark:text-muted-foreground cursor-pointer whitespace-nowrap font-normal"
                    onClick={() => handleSort('bookedBy')}
                  >
                    <div className="flex items-center gap-1">
                      Кто бронировал
                      {sortBy === 'bookedBy' && (
                        sortDirection === 'asc' ? <ArrowUp className="w-3 h-3" /> : <ArrowDown className="w-3 h-3" />
                      )}
                      {sortBy !== 'bookedBy' && <ArrowUpDown className="w-3 h-3 text-gray-400" />}
                    </div>
                  </TableHead>
                  <TableHead className="text-xs text-gray-600 dark:text-muted-foreground whitespace-nowrap font-normal">Контакты</TableHead>
                  <TableHead 
                    className="text-xs text-gray-600 dark:text-muted-foreground cursor-pointer whitespace-nowrap font-normal"
                    onClick={() => handleSort('checkIn')}
                  >
                    <div className="flex items-center gap-1">
                      Заезд
                      {sortBy === 'checkIn' && (
                        sortDirection === 'asc' ? <ArrowUp className="w-3 h-3" /> : <ArrowDown className="w-3 h-3" />
                      )}
                      {sortBy !== 'checkIn' && <ArrowUpDown className="w-3 h-3 text-gray-400" />}
                    </div>
                  </TableHead>
                  <TableHead 
                    className="text-xs text-gray-600 dark:text-muted-foreground cursor-pointer whitespace-nowrap font-normal"
                    onClick={() => handleSort('checkOut')}
                  >
                    <div className="flex items-center gap-1">
                      Выезд
                      {sortBy === 'checkOut' && (
                        sortDirection === 'asc' ? <ArrowUp className="w-3 h-3" /> : <ArrowDown className="w-3 h-3" />
                      )}
                      {sortBy !== 'checkOut' && <ArrowUpDown className="w-3 h-3 text-gray-400" />}
                    </div>
                  </TableHead>
                  <TableHead className="text-xs text-gray-600 dark:text-muted-foreground whitespace-nowrap font-normal">Гости</TableHead>
                  <TableHead className="text-xs text-gray-600 dark:text-muted-foreground whitespace-nowrap font-normal">Сумма</TableHead>
                  {(currentUser?.role === 'manager' || currentUser?.role === 'developer') && (
                    <TableHead className="text-xs text-gray-600 dark:text-muted-foreground whitespace-nowrap font-normal">Статус оплаты</TableHead>
                  )}
                  <TableHead className="text-xs text-gray-600 dark:text-muted-foreground whitespace-nowrap font-normal">Примечания</TableHead>
                  <TableHead className="text-xs text-gray-600 dark:text-muted-foreground whitespace-nowrap sticky right-0 bg-white dark:bg-card z-10 font-normal">Действия</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {groupedBookings.map((group) => 
                  group.bookings.map((booking, index) => {
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

                  const isFirstInGroup = index === 0;
                  const isLastInGroup = index === group.bookings.length - 1;
                  const hasMultipleBookings = group.bookings.length > 1;
                  
                  return (
                    <TableRow 
                      key={booking.id}
                      onClick={() => {
                        setOpenMenuId(null);
                        setSelectedBookingForDetail(booking);
                        setShowDetailModal(true);
                      }}
                      className={`cursor-pointer hover:bg-gray-100 dark:hover:bg-accent transition-colors ${hasMultipleBookings ? 'bg-gray-50 dark:bg-muted border-l-3 border-l-gray-200 dark:border-l-border' : ''} ${isFirstInGroup && hasMultipleBookings ? 'border-t border-t-gray-200 dark:border-t-border' : ''} ${isLastInGroup && hasMultipleBookings ? 'border-b border-b-gray-200 dark:border-b-border' : ''}`}
                    >
                      <TableCell className="py-3">
                        {isFirstInGroup ? (
                          <div className="text-sm text-gray-700 dark:text-foreground">
                            {searchQuery ? highlightText(booking.hotelName || 'N/A', searchQuery) : (booking.hotelName || 'N/A')}
                          </div>
                        ) : (
                          <div className="text-sm text-gray-400 dark:text-muted-foreground">—</div>
                        )}
                      </TableCell>
                      
                      <TableCell className="py-3">
                        {isFirstInGroup ? (
                          <>
                            <div className="text-sm text-gray-700 dark:text-foreground">
                              #{searchQuery ? highlightText(booking.roomNumber || 'N/A', searchQuery) : (booking.roomNumber || 'N/A')}
                            </div>
                            {room && (
                              <div className="text-xs text-gray-500 dark:text-muted-foreground mt-0.5">
                                {room.type === 'FZ' ? 'Семейная' : room.type === 'DZ' ? 'Двухместная' : room.type === 'EZ' ? 'Одноместная' : room.type === 'MZ' ? 'Многоместная' : room.type === 'App' ? 'Апартаменты' : 'Общее'}
                              </div>
                            )}
                          </>
                        ) : (
                          <div className="text-sm text-gray-400 dark:text-muted-foreground">—</div>
                        )}
                      </TableCell>
                      
                      <TableCell className="py-3">
                        <div className="text-sm text-gray-700 dark:text-foreground">
                          {searchQuery ? highlightText(booking.bookedBy, searchQuery) : booking.bookedBy}
                        </div>
                        <div className="text-xs text-gray-500 dark:text-muted-foreground mt-0.5">
                          {new Date(booking.bookedDate).toLocaleDateString('ru-RU')}
                        </div>
                      </TableCell>
                      
                      <TableCell className="py-3">
                        <div className="text-xs text-gray-600 dark:text-muted-foreground">
                          <div>
                            {searchQuery ? highlightText(booking.email || '', searchQuery) : (booking.email || '')}
                          </div>
                          <div className="text-gray-500 dark:text-muted-foreground mt-0.5">{booking.phone}</div>
                        </div>
                      </TableCell>
                      
                      <TableCell className="py-3">
                        <div className="text-sm text-gray-700 dark:text-foreground">
                          {new Date(booking.checkIn).toLocaleDateString('ru-RU')}
                        </div>
                      </TableCell>
                      
                      <TableCell className="py-3">
                        <div className="text-sm text-gray-700 dark:text-foreground">
                          {new Date(booking.checkOut).toLocaleDateString('ru-RU')}
                        </div>
                        <div className="text-xs text-gray-500 dark:text-muted-foreground mt-0.5">
                          {nights} {nights === 1 ? 'ночь' : nights < 5 ? 'ночи' : 'ночей'}
                        </div>
                      </TableCell>
                      
                      <TableCell className="py-3">
                        <div className="text-xs text-gray-600 dark:text-muted-foreground">
                          {booking.guests && booking.guests.length > 0 ? (
                            <div className="space-y-1">
                              {booking.guests.map((g, i) => (
                                <div key={i} className="flex items-center gap-1.5">
                                  {g.image ? (
                                    <img
                                      src={g.image}
                                      alt={g.name}
                                      className="w-5 h-5 rounded-full object-cover border border-gray-200 dark:border-border"
                                    />
                                  ) : (
                                    <div className="w-5 h-5 rounded-full bg-gray-100 dark:bg-muted flex items-center justify-center border border-gray-200 dark:border-border">
                                      <span className="text-xs text-gray-500 dark:text-muted-foreground">{g.name.charAt(0).toUpperCase()}</span>
                                    </div>
                                  )}
                                  <span className="text-gray-600 dark:text-muted-foreground">
                                    {searchQuery ? highlightText(g.name || '', searchQuery) : (g.name || '')}
                                  </span>
                                  {g.email && searchQuery && (
                                    <span className="text-gray-400 dark:text-muted-foreground text-[10px]">
                                      ({highlightText(g.email, searchQuery)})
                                    </span>
                                  )}
                                  {g.email && !searchQuery && (
                                    <span className="text-gray-400 dark:text-muted-foreground text-[10px]">
                                      ({g.email})
                                    </span>
                                  )}
                                </div>
                              ))}
                            </div>
                          ) : (
                            <span className="text-gray-400 dark:text-muted-foreground">Нет гостей</span>
                          )}
                        </div>
                      </TableCell>
                      
                      <TableCell className="py-3">
                        <div className="text-sm text-gray-700 dark:text-foreground">
                          {totalPrice > 0 ? `${totalPrice.toFixed(2)}€` : '-'}
                        </div>
                        {room && room.price > 0 && (
                          <div className="text-xs text-gray-500 dark:text-muted-foreground mt-0.5">
                            {room.price}€{room.pricePerPerson ? '/Per' : ''}/ночь
                          </div>
                        )}
                      </TableCell>
                      
                      {(currentUser?.role === 'manager' || currentUser?.role === 'developer') && (
                        <TableCell className="py-3">
                          {isFullyPaid ? (
                            <div className="flex items-center gap-1.5">
                              <div className="w-1.5 h-1.5 rounded-full bg-green-500"></div>
                              <span className="text-xs text-green-600 dark:text-green-400">Полностью оплачено</span>
                            </div>
                          ) : isHalfPaidOrMore ? (
                            <div className="flex items-center gap-1.5">
                              <div className="w-1.5 h-1.5 rounded-full bg-yellow-500"></div>
                              <span className="text-xs text-yellow-600 dark:text-yellow-500">50% оплачено</span>
                            </div>
                          ) : (
                            <div className="flex items-center gap-1.5">
                              <div className="w-1.5 h-1.5 rounded-full bg-red-500"></div>
                              <span className="text-xs text-red-600 dark:text-red-400">Не оплачено</span>
                            </div>
                          )}
                          {alreadyPaid > 0 && (
                            <div className="text-xs text-gray-500 dark:text-muted-foreground mt-0.5">
                              Оплачено: {alreadyPaid.toFixed(2)}€
                            </div>
                          )}
                        </TableCell>
                      )}
                      
                      <TableCell className="py-3">
                        <div className="text-xs text-gray-500 dark:text-muted-foreground max-w-xs">
                          {booking.notes ? (
                            <div title={booking.notes} className="truncate">
                              {booking.notes}
                            </div>
                          ) : (
                            <span className="text-gray-400 dark:text-muted-foreground">-</span>
                          )}
                        </div>
                      </TableCell>
                      
                      <TableCell className="py-3 sticky right-0 bg-white dark:bg-card z-10" onClick={(e) => e.stopPropagation()}>
                        <div className="relative z-10">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              if (!showDetailModal && !showEditModal) {
                                setOpenMenuId(openMenuId === booking.id ? null : booking.id || null);
                              }
                            }}
                            disabled={showDetailModal || showEditModal}
                            className={`p-1.5 hover:bg-gray-100 dark:hover:bg-accent rounded transition-colors z-11 ${(showDetailModal || showEditModal) ? 'opacity-50 pointer-events-none' : ''}`}
                            title="Действия"
                          >
                            <MoreVertical className="w-4 h-4 text-gray-600 dark:text-muted-foreground z-12" />
                          </button>
                          
                          {openMenuId === booking.id && !showDetailModal && !showEditModal && (
                            <>
                              <div 
                                className="fixed inset-0 z-5" 
                                onClick={() => setOpenMenuId(null)}
                              />
                              <div className="absolute right-25 -top-5 bg-white dark:bg-card border border-gray-200 dark:border-border rounded-lg shadow-xl z-[9999] min-w-[180px]">
                                {(currentUser?.role === 'manager' || currentUser?.role === 'developer') && (
                                  <>
                                    <button
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        setOpenMenuId(null);
                                        handleConfirmHalfPayment(booking);
                                      }}
                                      className="w-full px-3 py-2 text-left text-xs text-blue-700 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 flex items-center gap-2 transition-colors"
                                    >
                                      <Euro className="w-3 h-3" />
                                      50% оплаты
                                    </button>
                                    <button
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        setOpenMenuId(null);
                                        handleConfirmFullPayment(booking);
                                      }}
                                      className="w-full px-3 py-2 text-left text-xs text-green-700 dark:text-green-400 hover:bg-green-50 dark:hover:bg-green-900/20 flex items-center gap-2 transition-colors"
                                    >
                                      <Euro className="w-3 h-3" />
                                      100% оплаты
                                    </button>
                                    <div className="border-t border-gray-200 dark:border-border my-1" />
                                  </>
                                )}
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setOpenMenuId(null);
                                    handleEdit(booking);
                                  }}
                                  className="w-full px-3 py-2 text-left text-xs text-gray-700 dark:text-foreground hover:bg-gray-50 dark:hover:bg-accent flex items-center gap-2 transition-colors"
                                >
                                  <Edit className="w-3 h-3" />
                                  Редактировать
                                </button>
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setOpenMenuId(null);
                                    handleCancel(booking);
                                  }}
                                  className="w-full px-3 py-2 text-left text-xs text-red-700 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 flex items-center gap-2 transition-colors"
                                >
                                  <Trash2 className="w-3 h-3" />
                                  Отменить
                                </button>
                              </div>
                            </>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                  })
                ).flat()}
              </TableBody>
            </Table>
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
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[9999] p-4 overflow-y-auto">
            <div className="bg-white dark:bg-card rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-foreground flex items-center gap-2">
                    <BookOpen className="w-6 h-6" />
                    Детали бронирования
                  </h2>
                  <button
                    onClick={() => {
                      setShowDetailModal(false);
                      setSelectedBookingForDetail(null);
                    }}
                    className="text-gray-500 dark:text-muted-foreground hover:text-gray-700 dark:hover:text-foreground"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Основная информация */}
                  <div className="space-y-4">
                    <div className="bg-gray-50 dark:bg-muted rounded-lg p-4">
                      <h3 className="text-sm font-semibold text-gray-700 dark:text-foreground mb-3 flex items-center gap-2">
                        <MapPin className="w-4 h-4" />
                        Информация об отеле и комнате
                      </h3>
                      <div className="space-y-2 text-sm">
                        <div>
                          <span className="text-gray-600 dark:text-muted-foreground">Отель:</span>
                          <span className="ml-2 font-semibold text-gray-900 dark:text-foreground">{booking.hotelName || 'N/A'}</span>
                        </div>
                        <div>
                          <span className="text-gray-600 dark:text-muted-foreground">Комната:</span>
                          <span className="ml-2 font-semibold text-gray-900 dark:text-foreground">#{booking.roomNumber || 'N/A'}</span>
                        </div>
                        {room && (
                          <>
                            <div>
                              <span className="text-gray-600 dark:text-muted-foreground">Тип:</span>
                              <span className="ml-2 text-gray-900 dark:text-foreground">
                                {room.type === 'FZ' ? 'Семейная' : room.type === 'DZ' ? 'Двухместная' : room.type === 'EZ' ? 'Одноместная' : room.type === 'MZ' ? 'Многоместная' : room.type === 'App' ? 'Апартаменты' : 'Общее'}
                              </span>
                            </div>
                            <div>
                              <span className="text-gray-600 dark:text-muted-foreground">Вместимость:</span>
                              <span className="ml-2 text-gray-900 dark:text-foreground">{room.capacity}</span>
                            </div>
                            <div>
                              <span className="text-gray-600 dark:text-muted-foreground">Цена за ночь:</span>
                              <span className="ml-2 font-semibold text-gray-900 dark:text-foreground">{room.price}€{room.pricePerPerson ? '/Per' : ''}</span>
                            </div>
                          </>
                        )}
                      </div>
                    </div>

                    <div className="bg-gray-50 dark:bg-muted rounded-lg p-4">
                      <h3 className="text-sm font-semibold text-gray-700 dark:text-foreground mb-3 flex items-center gap-2">
                        <UserIcon className="w-4 h-4" />
                        Информация о госте
                      </h3>
                      <div className="space-y-2 text-sm">
                        <div>
                          <span className="text-gray-600 dark:text-muted-foreground">Имя:</span>
                          <span className="ml-2 font-semibold text-gray-900 dark:text-foreground">{booking.bookedBy}</span>
                        </div>
                        {booking.email && (
                          <div className="flex items-center gap-2">
                            <Mail className="w-4 h-4 text-gray-400 dark:text-muted-foreground" />
                            <span className="text-gray-600 dark:text-muted-foreground">Email:</span>
                            <span className="ml-2 text-gray-900 dark:text-foreground">{booking.email}</span>
                          </div>
                        )}
                        {booking.phone && (
                          <div className="flex items-center gap-2">
                            <Phone className="w-4 h-4 text-gray-400 dark:text-muted-foreground" />
                            <span className="text-gray-600 dark:text-muted-foreground">Телефон:</span>
                            <span className="ml-2 text-gray-900 dark:text-foreground">{booking.phone}</span>
                          </div>
                        )}
                        <div>
                          <span className="text-gray-600 dark:text-muted-foreground">Дата бронирования:</span>
                          <span className="ml-2 text-gray-900 dark:text-foreground">
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
                    <div className="bg-gray-50 dark:bg-muted rounded-lg p-4">
                      <h3 className="text-sm font-semibold text-gray-700 dark:text-foreground mb-3 flex items-center gap-2">
                        <Calendar className="w-4 h-4" />
                        Даты пребывания
                      </h3>
                      <div className="space-y-2 text-sm">
                        <div>
                          <span className="text-gray-600 dark:text-muted-foreground">Заезд:</span>
                          <span className="ml-2 font-semibold text-gray-900 dark:text-foreground">
                            {new Date(booking.checkIn).toLocaleDateString('ru-RU', {
                              day: '2-digit',
                              month: 'long',
                              year: 'numeric',
                              weekday: 'long'
                            })}
                          </span>
                        </div>
                        <div>
                          <span className="text-gray-600 dark:text-muted-foreground">Выезд:</span>
                          <span className="ml-2 font-semibold text-gray-900 dark:text-foreground">
                            {new Date(booking.checkOut).toLocaleDateString('ru-RU', {
                              day: '2-digit',
                              month: 'long',
                              year: 'numeric',
                              weekday: 'long'
                            })}
                          </span>
                        </div>
                        <div>
                          <span className="text-gray-600 dark:text-muted-foreground">Количество ночей:</span>
                          <span className="ml-2 font-semibold text-gray-900 dark:text-foreground">
                            {nights} {nights === 1 ? 'ночь' : nights < 5 ? 'ночи' : 'ночей'}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Гости */}
                    {booking.guests && booking.guests.length > 0 && (
                      <div className="bg-gray-50 dark:bg-muted rounded-lg p-4">
                        <h3 className="text-sm font-semibold text-gray-700 dark:text-foreground mb-3 flex items-center gap-2">
                          <Bed className="w-4 h-4" />
                          Гости ({booking.guests.length})
                        </h3>
                        <div className="space-y-2">
                          {booking.guests.map((guest, index) => (
                            <div key={index} className="flex items-center gap-3 p-2 bg-white dark:bg-card rounded border border-gray-200 dark:border-border">
                              {guest.image ? (
                                <img
                                  src={guest.image}
                                  alt={guest.name}
                                  className="w-10 h-10 rounded-full object-cover border border-gray-300 dark:border-border"
                                />
                              ) : (
                                <div className="w-10 h-10 rounded-full bg-gray-200 dark:bg-muted flex items-center justify-center border border-gray-300 dark:border-border">
                                  <span className="text-sm text-gray-500 dark:text-muted-foreground font-semibold">{guest.name.charAt(0).toUpperCase()}</span>
                                </div>
                              )}
                              <div className="flex-1">
                                <div className="font-semibold text-gray-900 dark:text-foreground">{guest.name}</div>
                                {guest.email && (
                                  <div className="text-xs text-gray-500 dark:text-muted-foreground">{guest.email}</div>
                                )}
                                {guest.phone && (
                                  <div className="text-xs text-gray-500 dark:text-muted-foreground">{guest.phone}</div>
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Примечания */}
                    {booking.notes && (
                      <div className="bg-gray-50 dark:bg-muted rounded-lg p-4">
                        <h3 className="text-sm font-semibold text-gray-700 dark:text-foreground mb-3 flex items-center gap-2">
                          <FileText className="w-4 h-4" />
                          Примечания
                        </h3>
                        <p className="text-sm text-gray-700 dark:text-foreground whitespace-pre-wrap">{booking.notes}</p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Действия */}
                <div className="mt-6 flex flex-wrap gap-2">
                  <button
                    onClick={() => {
                      setShowDetailModal(false);
                      handleCancel(booking);
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
                    className="px-4 py-2 bg-white dark:bg-card hover:bg-gray-100 dark:hover:bg-accent text-black dark:text-foreground border border-black dark:border-border rounded-lg font-semibold"
                  >
                    Закрыть
                  </button>
                </div>
              </div>
            </div>
          </div>
        );
      })()}

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
              manualUserName: selectedBookingForEdit.bookedBy || '',
              manualUserPhone: selectedBookingForEdit.phone || '',
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

      {/* Модальное окно подтверждения оплаты */}
      {paymentBooking && (() => {
        const nights = Math.ceil(
          (new Date(paymentBooking.checkOut).getTime() - new Date(paymentBooking.checkIn).getTime()) / 
          (1000 * 60 * 60 * 24)
        );
        const room = rooms.find(r => r.id === paymentBooking.roomId);
        const totalBookingAmount = nights * (room?.price || 0);
        const alreadyPaid = paymentBooking.amount || 0;
        const paymentAmount = paymentType === 'half' ? totalBookingAmount / 2 : totalBookingAmount;
        const amountToAdd = paymentAmount - alreadyPaid;

        return (
          <ConfirmPaymentDialog
            isOpen={showPaymentDialog}
            onClose={() => {
              setShowPaymentDialog(false);
              setPaymentBooking(null);
            }}
            onConfirm={handleProcessPayment}
            paymentType={paymentType}
            roomNumber={paymentBooking.roomNumber}
            totalAmount={paymentAmount}
            alreadyPaid={alreadyPaid}
            amountToAdd={amountToAdd}
            isSubmitting={isProcessingPayment}
          />
        );
      })()}
    </div>
  );
}

