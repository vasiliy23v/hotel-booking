'use client';
/* eslint-disable @next/next/no-img-element */

import { useState, useEffect, useMemo, useCallback, ReactElement } from 'react';
import { BookOpen, Filter, X, ArrowUpDown, ArrowUp, ArrowDown, Euro, Calendar, User as UserIcon, Phone, Mail, MapPin, Bed, FileText, Search, Edit, MoreVertical, Trash2, AlertTriangle, Printer, History, ChevronDown, Check, FilterX, Info } from 'lucide-react';
import { api } from '@/lib/api';
import { DatePicker } from '@/components/ui/date-picker';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { BookingFormModal, type BookingFormData, getBookedByAndPhoneFromFormData } from '@/components/booking/BookingFormModal';
import { ConfirmCancelBookingDialog } from '@/components/booking/ConfirmCancelBookingDialog';
import { ConfirmPaymentDialog } from '@/components/booking/ConfirmPaymentDialog';
import { RoomPriceModal } from './RoomPriceModal';
import type { User, Room, Hotel, BookingInfo, Guest } from '@/types';
import type { StatisticsResponse } from '@/types/api';
import {
  getCurrentFestivalVisibleMonths,
  isPastFestivalBooking,
  parseLocalDate,
} from '@/lib/festival-dates';
import { openBookingsPrintWindow } from '@/lib/bookings-print';

const toolBtn =
  'inline-flex min-h-[48px] items-center gap-2 rounded-2xl border px-4 text-base font-medium whitespace-nowrap transition-colors';
const toolBtnOff = 'border-[#e3d5c6] bg-white text-[#4a3a30] hover:bg-[#f6ede2] dark:border-border dark:bg-card dark:text-foreground';
const toolIconBtn = 'inline-flex h-12 w-12 items-center justify-center rounded-2xl border transition-colors';
const menuRow = 'flex min-h-[48px] w-full items-center justify-between gap-3 rounded-xl px-4 text-left text-base';
const menuRowOn = 'bg-[#fde9da] font-medium text-[#6b4a36]';
const menuRowOff = 'text-[#4a3a30] hover:bg-[#f6ede2]';
const subLabel = 'mb-1.5 block text-sm font-medium text-[#8a7566] dark:text-muted-foreground';
const subField =
  'h-12 w-full rounded-2xl border border-[#e3d5c6] bg-white px-4 text-base text-[#3d2f27] placeholder:text-[#b9a493] focus:border-[#6b4a36] focus:outline-none focus:ring-2 focus:ring-[#6b4a36]/15 dark:border-border dark:bg-input dark:text-foreground';
const toolBtnOn = 'border-[#e8b790] bg-[#fde9da] text-[#6b4a36] dark:border-[#8a6249] dark:bg-[#3a2a20] dark:text-[#e8c9ad]';

export default function BookingsView({ onModalStateChange }: { onModalStateChange?: (isOpen: boolean) => void } = {}) {
  const [bookings, setBookings] = useState<(BookingInfo & { roomNumber?: string; hotelName?: string })[]>([]);
  const [rooms, setRooms] = useState<Room[]>([]);
  const [priceRoom, setPriceRoom] = useState<{ room: Room; hotelName?: string } | null>(null);
  const [hotels, setHotels] = useState<Hotel[]>([]);
  const [loading, setLoading] = useState(true);
  const [statistics, setStatistics] = useState<StatisticsResponse | null>(null);
  const [statisticsLoading, setStatisticsLoading] = useState(true);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [_filterHotelId, setFilterHotelId] = useState<string>('');
  const [allowedDateRanges, setAllowedDateRanges] = useState<Array<{ startDate: string; endDate: string }>>([]);
  const [allDateRanges, setAllDateRanges] = useState<Array<{ startDate: string; endDate: string }>>([]);
  const [hidePastFestivalBookings, setHidePastFestivalBookings] = useState(true);
  // Фестивали (диапазоны дат) с названиями — для фильтра, сортировки и истории комнаты
  const [festivals, setFestivals] = useState<Array<{ id: string; name: string | null; startDate: string; endDate: string }>>([]);
  const [filterFestivals, setFilterFestivals] = useState<string[]>([]); // festivalId[] и/или 'none'
  // История комнаты (кто жил на прошлых фестивалях)
  const [roomHistoryBooking, setRoomHistoryBooking] = useState<(BookingInfo & { roomNumber?: string; hotelName?: string }) | null>(null);
  
  // Поиск
  const [searchQuery, setSearchQuery] = useState<string>('');
  
  // Фильтры
  const [filterHotel, setFilterHotel] = useState<string>('');
  const [filterBookedBy, setFilterBookedBy] = useState<string>('');
  const [filterRoomNumber, setFilterRoomNumber] = useState<string>('');
  const [filterDateFrom, setFilterDateFrom] = useState<string>('');
  const [filterDateTo, setFilterDateTo] = useState<string>('');
  const [showFilters, setShowFilters] = useState(false);
  const [showFestivalMenu, setShowFestivalMenu] = useState(false);
  const [showHotelMenu, setShowHotelMenu] = useState(false);
  const [noticeDismissed, setNoticeDismissed] = useState(false);
  useEffect(() => {
    try {
      setNoticeDismissed(localStorage.getItem('bookings_past_notice_dismissed') === '1');
    } catch {
      /* localStorage недоступен */
    }
  }, []);
  const dismissNotice = () => {
    setNoticeDismissed(true);
    try {
      localStorage.setItem('bookings_past_notice_dismissed', '1');
    } catch {
      /* localStorage недоступен */
    }
  };
  
  // Сортировка
  const [sortBy, setSortBy] = useState<'checkIn' | 'checkOut' | 'bookedDate' | 'bookedBy' | 'roomNumber' | 'festival'>('checkIn');
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

  // const _loadStatistics = async (_hotelId?: string) => {
  //   try {
  //     setStatisticsLoading(true);
  //     const stats = await api.getStatistics(hotelId || undefined);
  //     setStatistics(stats);
  //   } catch (error) {
  //     console.error('Error loading statistics:', error);
  //   } finally {
  //     setStatisticsLoading(false);
  //   }
  // };

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
          paymentMethod: (booking.paymentMethod === 'cash' || booking.paymentMethod === 'transfer') ? booking.paymentMethod : undefined,
          paymentDate: booking.paymentDate ? (booking.paymentDate instanceof Date ? booking.paymentDate.toISOString() : String(booking.paymentDate)) : undefined,
          paidBy: booking.paidBy || undefined,
          amount: booking.amount ? Number(booking.amount) : undefined,
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
    
    // Загружаем активные диапазоны дат для валидации и подчёркивания невалидных дат
    const loadDateRanges = async () => {
      try {
        const ranges = await api.getBookingDateRanges(false);
        const normalizedRanges = ranges.map((r) => ({
          startDate: typeof r.startDate === 'string' ? r.startDate : r.startDate.toISOString().split('T')[0],
          endDate: typeof r.endDate === 'string' ? r.endDate : r.endDate.toISOString().split('T')[0],
        }));
        setAllDateRanges(normalizedRanges);
        setFestivals(
          ranges.map((r) => ({
            id: r.id,
            name: r.name,
            startDate: typeof r.startDate === 'string' ? r.startDate : r.startDate.toISOString().split('T')[0],
            endDate: typeof r.endDate === 'string' ? r.endDate : r.endDate.toISOString().split('T')[0],
          }))
        );
        setAllowedDateRanges(
          ranges
            .filter((r) => r.isActive)
            .map((r) => ({
              startDate: typeof r.startDate === 'string' ? r.startDate : r.startDate.toISOString().split('T')[0],
              endDate: typeof r.endDate === 'string' ? r.endDate : r.endDate.toISOString().split('T')[0],
            }))
        );
      } catch (error) {
        console.error('Error loading date ranges:', error);
      }
    };
    loadDateRanges();
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
    // Уведомляем родительский компонент о состоянии модального окна
    if (onModalStateChange) {
      onModalStateChange(showDetailModal || showEditModal);
    }
  }, [showDetailModal, showEditModal, onModalStateChange]);

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
          paymentMethod: (booking.paymentMethod === 'cash' || booking.paymentMethod === 'transfer') ? booking.paymentMethod : undefined,
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
    setOpenMenuId(null);
    setSelectedBookingForEdit(booking);
    setShowEditModal(true);
    if (onModalStateChange) {
      onModalStateChange(true);
    }
  };

  const handleSaveEdit = async (data: BookingFormData) => {
    if (!selectedBookingForEdit?.id) return;
    
    try {
      const { bookedBy, phone } = getBookedByAndPhoneFromFormData(data, currentUser);

      await api.updateBooking(selectedBookingForEdit.id, {
        checkIn: data.checkIn,
        checkOut: data.checkOut,
        notes: data.notes,
        guests: data.guests,
        email: data.email,
        phone,
        ...(bookedBy ? { bookedBy } : {}),
      });
      setShowEditModal(false);
      setSelectedBookingForEdit(null);
      if (onModalStateChange) {
        onModalStateChange(false);
      }
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
    
    // Рассчитываем полную стоимость бронирования с учётом perPerson
    // НЕ используем booking.amount для расчета полной стоимости, так как это уже оплаченная сумма
    let totalBookingAmount: number;
    if (room?.pricePerPerson && booking.guests) {
      const guestsCount = Array.isArray(booking.guests) ? booking.guests.length : 0;
      totalBookingAmount = nights * (room?.price || 0) * guestsCount;
    } else {
      totalBookingAmount = nights * (room?.price || 0);
    }
    
    // Уже оплаченная сумма берется из amount
    const alreadyPaid = booking.amount ? Number(booking.amount) : 0;
    const halfAmount = totalBookingAmount / 2;
    
    // Проверяем, нужно ли доплачивать
    if (alreadyPaid >= totalBookingAmount) {
      alert('Бронирование уже полностью оплачено');
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
    
    // Рассчитываем полную стоимость бронирования с учётом perPerson
    // НЕ используем booking.amount для расчета полной стоимости, так как это уже оплаченная сумма
    let totalAmount: number;
    if (room?.pricePerPerson && booking.guests) {
      const guestsCount = Array.isArray(booking.guests) ? booking.guests.length : 0;
      totalAmount = nights * (room?.price || 0) * guestsCount;
    } else {
      totalAmount = nights * (room?.price || 0);
    }
    
    // Уже оплаченная сумма берется из amount
    const alreadyPaid = booking.amount ? Number(booking.amount) : 0;
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
      
      // Рассчитываем полную сумму бронирования с учётом perPerson
      // НЕ используем paymentBooking.amount, так как это уже оплаченная сумма, а не полная
      let totalAmount: number;
      if (room?.pricePerPerson && paymentBooking.guests) {
        const guestsCount = Array.isArray(paymentBooking.guests) ? paymentBooking.guests.length : 0;
        totalAmount = nights * (room?.price || 0) * guestsCount;
      } else {
        totalAmount = nights * (room?.price || 0);
      }
      
      // Получаем уже оплаченную сумму
      const alreadyPaid = paymentBooking.amount ? Number(paymentBooking.amount) : 0;
      
      // Рассчитываем новую сумму после доплаты
      let newAmount: number;
      if (paymentType === 'half') {
        // Для 50% оплаты: если уже оплачено меньше 50%, доплачиваем до 50%
        const halfAmount = totalAmount / 2;
        if (alreadyPaid < halfAmount) {
          // Доплачиваем до 50%
          newAmount = halfAmount;
        } else {
          // Уже оплачено 50% или больше, доплачиваем до 100%
          newAmount = totalAmount;
        }
      } else {
        // Для 100% оплаты: всегда доплачиваем до полной суммы
        newAmount = totalAmount;
      }

      // isPaid должен быть true только если оплачено 100% или больше
      const isFullyPaid = newAmount >= totalAmount;

      if (paymentBooking.id) {
        await api.updateBooking(paymentBooking.id, {
          amount: newAmount,
          isPaid: isFullyPaid, // Полная оплата только если оплачено 100% или больше
          paidBy: currentUser.name,
          paymentDate: new Date().toISOString(),
        });
        await loadBookings();
        setShowPaymentDialog(false);
        setPaymentBooking(null);
        const addedAmount = newAmount - alreadyPaid;
        alert(`Подтверждена оплата ${paymentType === 'half' ? '50%' : '100%'} (${addedAmount.toFixed(2)}€ добавлено, всего: ${newAmount.toFixed(2)}€)`);
      }
    } catch (error) {
      console.error('Error confirming payment:', error);
      alert('Ошибка при подтверждении оплаты: ' + (error instanceof Error ? error.message : 'Неизвестная ошибка'));
    } finally {
      setIsProcessingPayment(false);
    }
  };

  const handleCancelHalfPayment = async (booking: BookingInfo & { roomNumber?: string }) => {
    if (!currentUser) return;
    
    const nights = Math.ceil(
      (new Date(booking.checkOut).getTime() - new Date(booking.checkIn).getTime()) / 
      (1000 * 60 * 60 * 24)
    );
    const room = rooms.find(r => r.id === booking.roomId);
    
    // Рассчитываем полную стоимость бронирования
    let totalAmount: number;
    if (room?.pricePerPerson && booking.guests) {
      const guestsCount = Array.isArray(booking.guests) ? booking.guests.length : 0;
      totalAmount = nights * (room?.price || 0) * guestsCount;
    } else {
      totalAmount = nights * (room?.price || 0);
    }
    
    const alreadyPaid = booking.amount ? Number(booking.amount) : 0;
    const halfAmount = totalAmount / 2;
    
    if (alreadyPaid <= 0) {
      alert('Оплата отсутствует');
      return;
    }
    
    if (!confirm(`Отменить 50% оплаты? Текущая оплата: ${alreadyPaid.toFixed(2)}€`)) {
      return;
    }
    
    try {
      // Уменьшаем оплату на 50% от полной суммы
      const newAmount = Math.max(0, alreadyPaid - halfAmount);
      const isFullyPaid = newAmount >= totalAmount;
      
      if (booking.id) {
        await api.updateBooking(booking.id, {
          amount: newAmount,
          isPaid: isFullyPaid,
          paidBy: newAmount > 0 ? currentUser.name : undefined,
          paymentDate: newAmount > 0 ? new Date().toISOString() : undefined,
        });
        await loadBookings();
        const canceledAmount = alreadyPaid - newAmount;
        alert(`Отменена оплата 50% (${canceledAmount.toFixed(2)}€ отменено, осталось: ${newAmount.toFixed(2)}€)`);
      }
    } catch (error) {
      console.error('Error canceling payment:', error);
      alert('Ошибка при отмене оплаты: ' + (error instanceof Error ? error.message : 'Неизвестная ошибка'));
    }
  };

  const handleCancelFullPayment = async (booking: BookingInfo & { roomNumber?: string }) => {
    if (!currentUser) return;
    
    const alreadyPaid = booking.amount ? Number(booking.amount) : 0;
    
    if (alreadyPaid <= 0) {
      alert('Оплата отсутствует');
      return;
    }
    
    if (!confirm(`Полностью отменить оплату? Текущая оплата: ${alreadyPaid.toFixed(2)}€`)) {
      return;
    }
    
    try {
      if (booking.id) {
        await api.updateBooking(booking.id, {
          amount: 0,
          isPaid: false,
          paidBy: undefined,
          paymentDate: undefined,
        });
        await loadBookings();
        alert(`Оплата полностью отменена (${alreadyPaid.toFixed(2)}€)`);
      }
    } catch (error) {
      console.error('Error canceling payment:', error);
      alert('Ошибка при отмене оплаты: ' + (error instanceof Error ? error.message : 'Неизвестная ошибка'));
    }
  };


  // Фестиваль брони определяется по дате заезда: попадает ли она в диапазон дат фестиваля
  const getFestivalForBooking = useCallback(
    (booking: { checkIn: string }) => {
      const checkIn = parseLocalDate(booking.checkIn);
      return (
        festivals.find(
          (f) => checkIn >= parseLocalDate(f.startDate) && checkIn <= parseLocalDate(f.endDate)
        ) || null
      );
    },
    [festivals]
  );

  const formatShortDate = (d: string) => parseLocalDate(d).toLocaleDateString('ru-RU');

  const getFestivalLabel = (f: { name: string | null; startDate: string; endDate: string }) =>
    f.name?.trim() || `${formatShortDate(f.startDate)} – ${formatShortDate(f.endDate)}`;

  const festivalsSorted = useMemo(
    () =>
      [...festivals].sort(
        (a, b) => parseLocalDate(b.startDate).getTime() - parseLocalDate(a.startDate).getTime()
      ),
    [festivals]
  );

  const currentFestivalVisibleMonths = useMemo(
    () => getCurrentFestivalVisibleMonths(bookings, allowedDateRanges, allDateRanges),
    [bookings, allowedDateRanges, allDateRanges]
  );

  const bookingsAfterFilters = useMemo(() => {
    let result = bookings;

    if (searchQuery) {
      const query = searchQuery.toLowerCase().trim();
      result = result.filter((b) => {
        const matchesHotel = b.hotelName?.toLowerCase().includes(query);
        const matchesRoom = b.roomNumber?.toLowerCase().includes(query);
        const matchesBookedBy = b.bookedBy.toLowerCase().includes(query);
        const matchesEmail = b.email?.toLowerCase().includes(query);
        const matchesPhone = b.phone?.toLowerCase().includes(query);
        const matchesNotes = b.notes?.toLowerCase().includes(query);
        const matchesGuestNames =
          b.guests?.some((guest: Guest) => guest.name?.toLowerCase().includes(query)) || false;
        const matchesGuestEmails =
          b.guests?.some((guest: Guest) => guest.email?.toLowerCase().includes(query)) || false;

        return (
          matchesHotel ||
          matchesRoom ||
          matchesBookedBy ||
          matchesEmail ||
          matchesPhone ||
          matchesNotes ||
          matchesGuestNames ||
          matchesGuestEmails
        );
      });
    }

    if (filterHotel) {
      result = result.filter(
        (b) =>
          b.hotelName?.toLowerCase().includes(filterHotel.toLowerCase()) ||
          hotels.find((h) => h.id === filterHotel)?.name === b.hotelName
      );
    }
    if (filterBookedBy) {
      result = result.filter((b) => b.bookedBy.toLowerCase().includes(filterBookedBy.toLowerCase()));
    }
    if (filterRoomNumber) {
      result = result.filter((b) =>
        b.roomNumber?.toLowerCase().includes(filterRoomNumber.toLowerCase())
      );
    }
    if (filterFestivals.length > 0) {
      result = result.filter((b) => {
        const f = getFestivalForBooking(b);
        return f ? filterFestivals.includes(f.id) : filterFestivals.includes('none');
      });
    }
    if (filterDateFrom) {
      result = result.filter((b) => parseLocalDate(b.checkIn) >= parseLocalDate(filterDateFrom));
    }
    if (filterDateTo) {
      result = result.filter((b) => parseLocalDate(b.checkIn) <= parseLocalDate(filterDateTo));
    }

    return result;
  }, [
    bookings,
    searchQuery,
    filterHotel,
    filterBookedBy,
    filterRoomNumber,
    filterFestivals,
    getFestivalForBooking,
    filterDateFrom,
    filterDateTo,
    hotels,
  ]);

  const pastFestivalBookingsCount = useMemo(
    () =>
      bookingsAfterFilters.filter((b) =>
        isPastFestivalBooking(b, allDateRanges, currentFestivalVisibleMonths)
      ).length,
    [bookingsAfterFilters, allDateRanges, currentFestivalVisibleMonths]
  );

  const filteredBookings = useMemo(() => {
    let result = bookingsAfterFilters;

    if (hidePastFestivalBookings && filterFestivals.length === 0) {
      result = result.filter(
        (b) => !isPastFestivalBooking(b, allDateRanges, currentFestivalVisibleMonths)
      );
    }

    return [...result].sort((a, b) => {
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
        case 'festival': {
          const fa = getFestivalForBooking(a);
          const fb = getFestivalForBooking(b);
          const ta = fa ? parseLocalDate(fa.startDate).getTime() : 0;
          const tb = fb ? parseLocalDate(fb.startDate).getTime() : 0;
          comparison = ta - tb;
          if (comparison === 0) {
            // внутри фестиваля — по номеру комнаты, затем по дате заезда
            comparison =
              (a.roomNumber || '').localeCompare(b.roomNumber || '', 'ru', { numeric: true }) ||
              new Date(a.checkIn).getTime() - new Date(b.checkIn).getTime();
          }
          break;
        }
      }
      return sortDirection === 'asc' ? comparison : -comparison;
    });
  }, [
    bookingsAfterFilters,
    hidePastFestivalBookings,
    filterFestivals,
    getFestivalForBooking,
    allDateRanges,
    currentFestivalVisibleMonths,
    sortBy,
    sortDirection,
  ]);

  // Функция для проверки пересечения дат
  const datesOverlap = (checkIn1: string, checkOut1: string, checkIn2: string, checkOut2: string): boolean => {
    const start1 = new Date(checkIn1).getTime();
    const end1 = new Date(checkOut1).getTime();
    const start2 = new Date(checkIn2).getTime();
    const end2 = new Date(checkOut2).getTime();
    
    // Проверяем пересечение: начало одного периода внутри другого или наоборот
    return (start1 < end2 && end1 > start2);
  };

  // Определяем дубликаты: бронирования с одинаковыми комнатами и пересекающимися датами
  const duplicateBookingIds = new Set<string>();
  filteredBookings.forEach((booking1, index1) => {
    filteredBookings.forEach((booking2, index2) => {
      if (index1 !== index2 && booking1.roomId === booking2.roomId) {
        if (datesOverlap(booking1.checkIn, booking1.checkOut, booking2.checkIn, booking2.checkOut)) {
          if (booking1.id) {
            duplicateBookingIds.add(booking1.id);
          }
          if (booking2.id) {
            duplicateBookingIds.add(booking2.id);
          }
        }
      }
    });
  });

  // Группируем бронирования по комнатам для визуального объединения
  // Если сортировка не по номеру комнаты, создаем плоский список (каждое бронирование - отдельная группа)
  // чтобы сохранить правильный порядок сортировки
  const groupedBookings: Array<{
    roomKey: string;
    bookings: typeof filteredBookings;
  }> = [];
  
  if (sortBy === 'roomNumber') {
    // При сортировке по номеру комнаты группируем по комнатам
    const roomGroups = new Map<string, typeof filteredBookings>();
    filteredBookings.forEach(booking => {
      const room = rooms.find(r => r.id === booking.roomId);
      const hotelId = room?.hotelId || '';
      const roomKey = `${hotelId}_${booking.roomId || ''}`;
      if (!roomGroups.has(roomKey)) {
        roomGroups.set(roomKey, []);
      }
      roomGroups.get(roomKey)!.push(booking);
    });
    
    roomGroups.forEach((bookings, roomKey) => {
      // Сортируем бронирования внутри группы по датам заезда
      bookings.sort((a, b) => new Date(a.checkIn).getTime() - new Date(b.checkIn).getTime());
      groupedBookings.push({ roomKey, bookings });
    });
  } else {
    // При сортировке по другим полям создаем плоский список, чтобы сохранить порядок
    filteredBookings.forEach(booking => {
      const room = rooms.find(r => r.id === booking.roomId);
      const hotelId = room?.hotelId || '';
      const roomKey = `${hotelId}_${booking.roomId || ''}`;
      groupedBookings.push({ roomKey, bookings: [booking] });
    });
  }

  const handleSort = (column: typeof sortBy) => {
    if (sortBy === column) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(column);
      setSortDirection('asc');
    }
  };

  // Функция для проверки, находится ли дата в валидном диапазоне
  const isDateInValidRange = (date: Date): boolean => {
    if (allowedDateRanges.length === 0) {
      // Если нет диапазонов, считаем все даты валидными (для обратной совместимости)
      return true;
    }

    const dateOnly = new Date(date.getFullYear(), date.getMonth(), date.getDate());
    
    return allowedDateRanges.some(range => {
      const rangeStart = new Date(range.startDate);
      const rangeEnd = new Date(range.endDate);
      const rangeStartOnly = new Date(rangeStart.getFullYear(), rangeStart.getMonth(), rangeStart.getDate());
      const rangeEndOnly = new Date(rangeEnd.getFullYear(), rangeEnd.getMonth(), rangeEnd.getDate());
      return dateOnly >= rangeStartOnly && dateOnly <= rangeEndOnly;
    });
  };

  // Функция для выделения найденного текста (выделяет все вхождения)
  const highlightText = (text: string, rawQuery: string) => {
    const query = rawQuery.trim();
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
        <span key={index} className="rounded bg-[#ffd9a8] px-0.5 text-[#5a3b28]">
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
    setFilterFestivals([]);
    setHidePastFestivalBookings(true);
    setFilterDateFrom('');
    setFilterDateTo('');
  };

  const hasActiveFilters = searchQuery || filterHotel || filterBookedBy || filterRoomNumber || filterFestivals.length > 0 || !hidePastFestivalBookings || filterDateFrom || filterDateTo;

  const hasOtherFilters = Boolean(searchQuery || filterHotel || filterBookedBy || filterRoomNumber || filterDateFrom || filterDateTo);
  const festivalMode: 'current' | 'all' | 'custom' =
    filterFestivals.length > 0 ? 'custom' : hidePastFestivalBookings ? 'current' : 'all';
  const festivalFilterActive = festivalMode !== 'current';
  const festivalButtonLabel =
    festivalMode === 'current'
      ? 'Текущий фестиваль'
      : festivalMode === 'all'
        ? 'Все фестивали'
        : filterFestivals.length === 1
          ? filterFestivals[0] === 'none'
            ? 'Вне фестивалей'
            : getFestivalLabel(festivals.find((f) => f.id === filterFestivals[0]) || festivalsSorted[0])
          : `Фестивали: ${filterFestivals.length}`;

  const handlePrint = () => {
    if (filteredBookings.length === 0) {
      alert('Нет данных для печати. Измените фильтры или покажите бронирования прошлого фестиваля.');
      return;
    }

    try {
      openBookingsPrintWindow({
        bookings: filteredBookings,
        rooms,
        activeRanges: allowedDateRanges,
        allRanges: allDateRanges,
        title: 'Регистрация участников фестиваля',
      });
    } catch (error) {
      console.error('Print error:', error);
      alert('Ошибка при подготовке печати. Попробуйте ещё раз.');
    }
  };

  // Вычисляем статистику бронирований на основе отфильтрованных данных
  const totalBookings = filteredBookings.length;
  // Считаем полностью оплаченные бронирования на основе фактически оплаченной суммы, а не флага isPaid
  const paidBookings = filteredBookings.filter(b => {
    const nights = Math.ceil(
      (new Date(b.checkOut).getTime() - new Date(b.checkIn).getTime()) / 
      (1000 * 60 * 60 * 24)
    );
    const room = rooms.find(r => r.id === b.roomId);
    let expectedAmount: number;
    if (room?.pricePerPerson && b.guests) {
      const guestsCount = Array.isArray(b.guests) ? b.guests.length : 0;
      expectedAmount = nights * (room?.price || 0) * guestsCount;
    } else {
      expectedAmount = nights * (room?.price || 0);
    }
    const alreadyPaid = b.amount ? Number(b.amount) : 0;
    return expectedAmount > 0 && alreadyPaid >= (expectedAmount - 0.01);
  }).length;
  
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
    
    // Рассчитываем полную стоимость бронирования (expectedAmount) с учётом perPerson
    // НЕ используем booking.amount для расчета полной стоимости, так как это уже оплаченная сумма
    let expectedAmount: number;
    if (room?.pricePerPerson && booking.guests) {
      // Для perPerson комнат учитываем количество гостей
      const guestsCount = Array.isArray(booking.guests) ? booking.guests.length : 0;
      expectedAmount = nights * (room?.price || 0) * guestsCount;
    } else {
      expectedAmount = nights * (room?.price || 0);
    }
    
    totalRevenue += expectedAmount;
    
    // Уже оплаченная сумма берется из amount
    const alreadyPaid = booking.amount ? Number(booking.amount) : 0;
    
    // Определяем полную оплату ТОЛЬКО на основе фактически оплаченной суммы
    // Игнорируем booking.isPaid из базы данных
    const isFullyPaid = expectedAmount > 0 && alreadyPaid >= (expectedAmount - 0.01);
    
    // Если бронирование полностью оплачено, добавляем к оплаченному доходу
    if (isFullyPaid) {
      paidRevenue += expectedAmount;
    } else {
      // Добавляем к неоплаченной сумме только разницу
      unpaidAmount += (expectedAmount - alreadyPaid);
      // Уже оплаченная часть идет в оплаченный доход
      paidRevenue += alreadyPaid;
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
          <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
            {/* Показываем скелетон загрузки, пока загружаются данные */}
            {(loading || statisticsLoading) ? (
              <>
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="rounded-2xl bg-[#f6ede2] p-4 dark:bg-white/5">
                    <div className="h-3 w-16 sm:w-20 bg-gray-200 dark:bg-gray-700 rounded animate-pulse mb-2"></div>
                    <div className="h-6 sm:h-8 w-12 sm:w-16 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
                  </div>
                ))}
              </>
            ) : statistics ? (
              <>
                {/* Статистика */}
                {[
                  { label: 'Комнаты', value: `${statistics.bookedRooms} из ${statistics.totalRooms}`, hint: `свободно ${statistics.availableRooms}`, warn: false },
                  { label: 'Бронирований', value: String(totalBookings), hint: `оплачено ${paidBookings}`, warn: false },
                  { label: 'Не оплачено', value: `${unpaidAmount.toFixed(0)} €`, hint: 'ждём оплату', warn: unpaidAmount > 0 },
                  { label: 'Доход', value: `${paidRevenue.toFixed(0)} €`, hint: `ожидается ${totalRevenue.toFixed(0)} €`, warn: false },
                ].map((tile) => (
                  <div key={tile.label} className="rounded-2xl bg-[#f6ede2] px-5 py-4 dark:bg-white/5">
                    <div className="text-sm text-[#8a7566] dark:text-muted-foreground">{tile.label}</div>
                    <div className={`mt-1 text-3xl font-semibold ${tile.warn ? 'text-[#b4532a]' : 'text-[#3d2f27] dark:text-foreground'}`}>{tile.value}</div>
                    <div className="mt-0.5 text-sm text-[#a8917f] dark:text-muted-foreground">{tile.hint}</div>
                  </div>
                ))}
              </>
            ) : (
              // Если статистика не загрузилась, показываем пустое состояние
              <div className="col-span-2 sm:col-span-4 text-center py-8 text-gray-500 dark:text-muted-foreground">
                Не удалось загрузить статистику
              </div>
            )}
          </div>
          <div className="flex w-full flex-wrap items-center gap-2.5">
            {festivals.length > 0 && (
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setShowFestivalMenu((v) => !v)}
                  aria-expanded={showFestivalMenu}
                  className={`${toolBtn} w-[250px] justify-between ${festivalFilterActive ? toolBtnOn : toolBtnOff}`}
                >
                  <Calendar className="h-5 w-5 shrink-0" />
                  <span className="flex-1 truncate text-left">{festivalButtonLabel}</span>
                  <ChevronDown className={`h-4 w-4 shrink-0 transition-transform ${showFestivalMenu ? 'rotate-180' : ''}`} />
                </button>
                {showFestivalMenu && (
                  <>
                    <div className="fixed inset-0 z-40" onClick={() => setShowFestivalMenu(false)} />
                    <div className="absolute left-0 top-full z-50 mt-2 w-[300px] max-w-[85vw] rounded-2xl border border-[#eadfd3] bg-white p-2 shadow-xl dark:border-border dark:bg-card">
                      <button
                        type="button"
                        onClick={() => {
                          setFilterFestivals([]);
                          setHidePastFestivalBookings(true);
                        }}
                        className={`${menuRow} ${festivalMode === 'current' ? menuRowOn : menuRowOff}`}
                      >
                        Текущий фестиваль
                        {festivalMode === 'current' && <Check className="h-4 w-4" />}
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setFilterFestivals([]);
                          setHidePastFestivalBookings(false);
                        }}
                        className={`${menuRow} ${festivalMode === 'all' ? menuRowOn : menuRowOff}`}
                      >
                        Показать все
                        {festivalMode === 'all' && <Check className="h-4 w-4" />}
                      </button>
                      <div className="mx-2 my-2 border-t border-[#eadfd3] dark:border-border" />
                      <p className="px-4 pb-1 pt-1 text-sm text-[#a8917f] dark:text-muted-foreground">Выбрать конкретные</p>
                      {[
                        ...festivalsSorted.map((f) => ({ id: f.id, label: getFestivalLabel(f) })),
                        { id: 'none', label: 'Вне фестивалей' },
                      ].map((opt) => {
                        const checked = filterFestivals.includes(opt.id);
                        return (
                          <button
                            key={opt.id}
                            type="button"
                            onClick={() => {
                              setHidePastFestivalBookings(false);
                              setFilterFestivals((prev) =>
                                prev.includes(opt.id) ? prev.filter((x) => x !== opt.id) : [...prev, opt.id]
                              );
                            }}
                            className={`${menuRow} ${checked ? menuRowOn : menuRowOff}`}
                          >
                            <span
                              className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-md border ${
                                checked ? 'border-[#6b4a36] bg-[#6b4a36] text-white' : 'border-[#d9c8b8] bg-white'
                              }`}
                            >
                              {checked && <Check className="h-4 w-4" />}
                            </span>
                            <span className="flex-1 truncate">{opt.label}</span>
                          </button>
                        );
                      })}
                    </div>
                  </>
                )}
              </div>
            )}
            <button
              type="button"
              onClick={() => setShowFilters(!showFilters)}
              aria-pressed={showFilters}
              className={`${toolBtn} ${showFilters || hasOtherFilters ? toolBtnOn : toolBtnOff}`}
            >
              <Filter className="h-5 w-5" />
              Фильтры
              <span className={`h-2 w-2 rounded-full ${hasOtherFilters ? 'bg-[#c4622d]' : 'bg-transparent'}`} />
            </button>
            <div className="relative min-w-[220px] flex-1 basis-[260px]">
              <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-[#b9a493] dark:text-muted-foreground" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Поиск: гость, комната, почта, телефон"
                className="h-12 w-full rounded-2xl border border-[#e3d5c6] bg-white pl-11 pr-11 text-base text-[#3d2f27] placeholder:text-[#b9a493] focus:border-[#6b4a36] focus:outline-none focus:ring-2 focus:ring-[#6b4a36]/15 dark:border-border dark:bg-input dark:text-foreground"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  aria-label="Очистить поиск"
                  className="absolute right-2 top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full text-[#a8917f] hover:bg-[#f1e4d6]"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>
              <button
                type="button"
                onClick={() => handleSort('festival')}
                aria-pressed={sortBy === 'festival'}
                aria-label="Сортировать по фестивалям"
                title="Сортировать по фестивалям"
                className={`${toolIconBtn} ${sortBy === 'festival' ? toolBtnOn : toolBtnOff}`}
              >
                {sortBy === 'festival' ? (
                  sortDirection === 'asc' ? <ArrowUp className="h-5 w-5" /> : <ArrowDown className="h-5 w-5" />
                ) : (
                  <ArrowUpDown className="h-5 w-5" />
                )}
              </button>
              <button
                type="button"
                onClick={resetFilters}
                disabled={!hasActiveFilters}
                aria-label="Очистить фильтры"
                title="Очистить фильтры"
                className={`${toolIconBtn} ${
                  hasActiveFilters
                    ? 'border-[#c4622d] bg-[#c4622d] text-white shadow-[0_6px_16px_-6px_rgba(196,98,45,0.8)] hover:bg-[#a8501f]'
                    : `${toolBtnOff} cursor-not-allowed opacity-40`
                }`}
              >
                <FilterX className="h-5 w-5" />
              </button>
            <div>
              <button
                type="button"
                onClick={handlePrint}
                disabled={loading || filteredBookings.length === 0}
                aria-label="Печать"
                title="Печать таблицы регистрации по дням"
                className={`${toolIconBtn} ${toolBtnOff} disabled:cursor-not-allowed disabled:opacity-40`}
              >
                <Printer className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>

        {/* Панель фильтров */}
        {showFilters && (
          <div className="mb-5 grid grid-cols-1 gap-4 sm:grid-cols-3">
            <div className="relative">
              <label className={subLabel}>Отель</label>
              <button
                type="button"
                onClick={() => setShowHotelMenu((v) => !v)}
                aria-expanded={showHotelMenu}
                className={`${subField} flex items-center justify-between gap-2 text-left`}
              >
                <span className={`truncate ${filterHotel ? '' : 'text-[#b9a493]'}`}>
                  {filterHotel ? hotels.find((h) => h.id === filterHotel || h.name === filterHotel)?.name || filterHotel : 'Все отели'}
                </span>
                <ChevronDown className={`h-4 w-4 shrink-0 text-[#a8917f] transition-transform ${showHotelMenu ? 'rotate-180' : ''}`} />
              </button>
              {showHotelMenu && (
                <>
                  <div className="fixed inset-0 z-40" onClick={() => setShowHotelMenu(false)} />
                  <div className="absolute left-0 top-full z-50 mt-2 w-full min-w-[220px] rounded-2xl border border-[#eadfd3] bg-white p-2 shadow-xl dark:border-border dark:bg-card">
                    {[{ id: '', name: 'Все отели' }, ...hotels.map((h) => ({ id: h.id, name: h.name }))].map((h) => {
                      const selected = (filterHotel || '') === h.id;
                      return (
                        <button
                          key={h.id || 'all'}
                          type="button"
                          onClick={() => {
                            setFilterHotel(h.id);
                            setShowHotelMenu(false);
                          }}
                          className={`${menuRow} ${selected ? menuRowOn : menuRowOff}`}
                        >
                          <span className="truncate">{h.name}</span>
                          {selected && <Check className="h-4 w-4 shrink-0" />}
                        </button>
                      );
                    })}
                  </div>
                </>
              )}
            </div>
            <div>
              <label className={subLabel}>Заезд с</label>
              <DatePicker
                date={filterDateFrom ? new Date(filterDateFrom) : undefined}
                onSelect={(date) => setFilterDateFrom(date ? `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}` : '')}
                placeholder="Выберите дату"
                maxDate={filterDateTo ? new Date(filterDateTo) : undefined}
                className="w-full"
              />
            </div>
            <div>
              <label className={subLabel}>Заезд до</label>
              <DatePicker
                date={filterDateTo ? new Date(filterDateTo) : undefined}
                onSelect={(date) => setFilterDateTo(date ? `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}` : '')}
                placeholder="Выберите дату"
                minDate={filterDateFrom ? new Date(filterDateFrom) : undefined}
                className="w-full"
              />
            </div>
          </div>
        )}

        {!loading && pastFestivalBookingsCount > 0 && !noticeDismissed && (
          <div className="mb-4 flex items-center gap-3 text-[15px] text-[#8a7566] dark:text-muted-foreground">
            <Info className="h-5 w-5 shrink-0 text-[#b9a493]" />
            <p className="flex-1">
              {hidePastFestivalBookings ? (
                <>
                  Скрыто {pastFestivalBookingsCount} броней прошлого фестиваля · показано{' '}
                  {filteredBookings.length} из {bookingsAfterFilters.length}
                </>
              ) : (
                <>Показаны все брони, включая {pastFestivalBookingsCount} прошлого фестиваля</>
              )}
            </p>
            <button
              type="button"
              onClick={dismissNotice}
              className="shrink-0 rounded-xl px-3 py-1.5 text-[15px] font-medium text-[#6b4a36] hover:bg-[#f1e4d6]"
            >
              Понятно
            </button>
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
          <>
          {/* Телефон: крупные карточки вместо таблицы */}
          <div className="hidden">
            {filteredBookings.map((booking) => {
              const room = rooms.find((r) => r.id === booking.roomId);
              const nights = Math.ceil(
                (new Date(booking.checkOut).getTime() - new Date(booking.checkIn).getTime()) / (1000 * 60 * 60 * 24)
              );
              const guestsCount = Array.isArray(booking.guests) ? booking.guests.length : 0;
              const expected = room?.pricePerPerson
                ? nights * (room?.price || 0) * guestsCount
                : nights * (room?.price || 0);
              const paid = booking.amount ? Number(booking.amount) : 0;
              const fullyPaid = expected > 0 && paid >= expected - 0.01;
              const halfPaid = paid > 0 && paid >= expected / 2 && !fullyPaid;
              const festival = getFestivalForBooking(booking);
              const isDup = booking.id ? duplicateBookingIds.has(booking.id) : false;
              const canSeePayment = currentUser?.role === 'manager' || currentUser?.role === 'developer';
              return (
                <div
                  key={booking.id}
                  className={`rounded-3xl border bg-white p-5 shadow-sm dark:bg-card ${isDup ? 'border-red-400' : 'border-gray-200 dark:border-border'}`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <div className="text-xl font-semibold text-gray-900 dark:text-foreground">
                        Комната #{booking.roomNumber || '—'}
                      </div>
                      <div className="text-base text-gray-600 dark:text-muted-foreground">{booking.hotelName}</div>
                    </div>
                    {festival && (
                      <span className="shrink-0 rounded-full bg-[#ffe9db] px-3 py-1 text-sm font-medium text-[#6b4a36]">
                        {getFestivalLabel(festival)}
                      </span>
                    )}
                  </div>

                  <div className="mt-4 text-lg text-gray-900 dark:text-foreground">
                    {new Date(booking.checkIn).toLocaleDateString('ru-RU')} – {new Date(booking.checkOut).toLocaleDateString('ru-RU')}
                    <span className="ml-2 text-base text-gray-600 dark:text-muted-foreground">
                      {nights} {nights === 1 ? 'ночь' : nights < 5 ? 'ночи' : 'ночей'}
                    </span>
                  </div>

                  <div className="mt-3 text-base text-gray-700 dark:text-foreground">
                    <div>Бронировал: <span className="font-medium">{booking.bookedBy}</span></div>
                    <div className="text-gray-600 dark:text-muted-foreground">Гостей: {guestsCount || '—'}</div>
                    {booking.phone && (
                      <a href={`tel:${booking.phone}`} className="mt-1 inline-block font-medium text-[#6b4a36] underline underline-offset-2">
                        {booking.phone}
                      </a>
                    )}
                  </div>

                  {isDup && (
                    <div className="mt-3 flex items-center gap-2 rounded-2xl bg-red-50 px-4 py-2 text-base text-red-800">
                      <AlertTriangle className="h-5 w-5" /> Дубликат: на эту комнату есть ещё бронь в те же даты
                    </div>
                  )}

                  {canSeePayment && (
                    <div
                      className={`mt-4 inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-base font-medium ${
                        fullyPaid
                          ? 'bg-green-100 text-green-900'
                          : halfPaid
                            ? 'bg-yellow-100 text-yellow-900'
                            : 'bg-red-100 text-red-900'
                      }`}
                    >
                      {fullyPaid ? '✓ Полностью оплачено' : halfPaid ? '◐ Оплачено 50%' : '○ Не оплачено'}
                      {paid > 0 && <span className="font-normal">· {paid.toFixed(2)}€</span>}
                    </div>
                  )}

                  <div className="mt-5 grid grid-cols-2 gap-3">
                    <button
                      onClick={() => {
                        setSelectedBookingForDetail(booking);
                        setShowDetailModal(true);
                      }}
                      className="col-span-2 h-14 rounded-full bg-[#6b4a36] text-lg font-medium text-white hover:bg-[#573b2b]"
                    >
                      Подробнее
                    </button>
                    <button
                      onClick={() => handleEdit(booking)}
                      className="h-12 rounded-full bg-gray-100 text-base font-medium text-gray-900 hover:bg-gray-200"
                    >
                      Изменить
                    </button>
                    <button
                      onClick={() => setRoomHistoryBooking(booking)}
                      className="h-12 rounded-full bg-gray-100 text-base font-medium text-gray-900 hover:bg-gray-200"
                    >
                      История комнаты
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="overflow-x-auto">
            <Table className="min-w-[1000px]">
              <TableHeader>
                <TableRow className="border-b border-gray-200 dark:border-border hover:bg-transparent">
                  <TableHead className="text-[15px] text-[#8a7566] dark:text-muted-foreground whitespace-nowrap font-medium">Отель и комната</TableHead>
                  <TableHead
                    className="text-[15px] text-[#8a7566] dark:text-muted-foreground cursor-pointer whitespace-nowrap font-medium"
                    onClick={() => handleSort('festival')}
                  >
                    <div className="flex items-center gap-1">
                      Фестиваль
                      {sortBy === 'festival' ? (
                        sortDirection === 'asc' ? <ArrowUp className="w-3 h-3" /> : <ArrowDown className="w-3 h-3" />
                      ) : (
                        <ArrowUpDown className="w-3 h-3 text-gray-400" />
                      )}
                    </div>
                  </TableHead>
                  <TableHead 
                    className="text-[15px] text-[#8a7566] dark:text-muted-foreground cursor-pointer whitespace-nowrap font-medium"
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
                  <TableHead 
                    className="text-[15px] text-[#8a7566] dark:text-muted-foreground cursor-pointer whitespace-nowrap font-medium"
                    onClick={() => handleSort('bookedDate')}
                  >
                    <div className="flex items-center gap-1">
                      Дата бронирования
                      {sortBy === 'bookedDate' && (
                        sortDirection === 'asc' ? <ArrowUp className="w-3 h-3" /> : <ArrowDown className="w-3 h-3" />
                      )}
                      {sortBy !== 'bookedDate' && <ArrowUpDown className="w-3 h-3 text-gray-400" />}
                    </div>
                  </TableHead>
                  <TableHead className="text-[15px] text-[#8a7566] dark:text-muted-foreground whitespace-nowrap font-medium">Контакты</TableHead>
                  <TableHead 
                    className="text-[15px] text-[#8a7566] dark:text-muted-foreground cursor-pointer whitespace-nowrap font-medium"
                    onClick={() => handleSort('checkIn')}
                  >
                    <div className="flex items-center gap-1">
                      Даты
                      {sortBy === 'checkIn' && (
                        sortDirection === 'asc' ? <ArrowUp className="w-3 h-3" /> : <ArrowDown className="w-3 h-3" />
                      )}
                      {sortBy !== 'checkIn' && <ArrowUpDown className="w-3 h-3 text-gray-400" />}
                    </div>
                  </TableHead>
                  <TableHead className="text-[15px] text-[#8a7566] dark:text-muted-foreground whitespace-nowrap font-medium">Гости</TableHead>
                  <TableHead className="text-[15px] text-[#8a7566] dark:text-muted-foreground whitespace-nowrap font-medium">Сумма</TableHead>
                  {(currentUser?.role === 'manager' || currentUser?.role === 'developer') && (
                    <TableHead className="text-[15px] text-[#8a7566] dark:text-muted-foreground whitespace-nowrap font-medium">Статус оплаты</TableHead>
                  )}
                  <TableHead className="text-[15px] text-[#8a7566] dark:text-muted-foreground whitespace-nowrap sticky right-0 bg-white dark:bg-card z-10 font-medium">Действия</TableHead>
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
                  
                  // Рассчитываем полную стоимость бронирования (expectedAmount) с учётом perPerson
                  // НЕ используем booking.amount для расчета полной стоимости, так как это уже оплаченная сумма
                  let expectedAmount: number;
                  if (room?.pricePerPerson && booking.guests) {
                    const guestsCount = Array.isArray(booking.guests) ? booking.guests.length : 0;
                    expectedAmount = nights * (room?.price || 0) * guestsCount;
                  } else {
                    expectedAmount = nights * (room?.price || 0);
                  }
                  
                  const totalPrice = expectedAmount;
                  // alreadyPaid - это сумма, которая УЖЕ была оплачена (из поля amount)
                  const alreadyPaid = booking.amount ? Number(booking.amount) : 0;
                  // eslint-disable-next-line @typescript-eslint/no-unused-vars
                  const _remainingAmount = Math.max(0, expectedAmount - alreadyPaid);
                  // Проверяем полную оплату ТОЛЬКО на основе фактически оплаченной суммы
                  // Игнорируем booking.isPaid из базы данных, так как он может быть неправильным
                  // Полностью оплачено, если оплачено >= ожидаемой суммы (с учетом погрешности округления 0.01)
                  const isFullyPaid = expectedAmount > 0 && alreadyPaid >= (expectedAmount - 0.01);
                  const isHalfPaidOrMore = alreadyPaid >= (totalPrice / 2) && alreadyPaid > 0 && !isFullyPaid;

                  const isFirstInGroup = index === 0;
                  const isLastInGroup = index === group.bookings.length - 1;
                  const hasMultipleBookings = group.bookings.length > 1;
                  
                  const isDuplicate = booking.id ? duplicateBookingIds.has(booking.id) : false;
                  const isPastRow =
                    !hidePastFestivalBookings &&
                    isPastFestivalBooking(booking, allDateRanges, currentFestivalVisibleMonths);
                  
                  return (
                    <TableRow 
                      key={booking.id}
                      onClick={() => {
                        setOpenMenuId(null);
                        setSelectedBookingForDetail(booking);
                        setShowDetailModal(true);
                      }}
                      className={`cursor-pointer hover:bg-gray-100 dark:hover:bg-accent transition-colors ${hasMultipleBookings ? 'bg-gray-50 dark:bg-muted border-l-3 border-l-gray-200 dark:border-l-border' : ''} ${isFirstInGroup && hasMultipleBookings ? 'border-t border-t-gray-200 dark:border-t-border' : ''} ${isLastInGroup && hasMultipleBookings ? 'border-b border-b-gray-200 dark:border-b-border' : ''} ${isDuplicate ? 'bg-red-50 dark:bg-red-900/20 border-l-4 border-l-red-500 dark:border-l-red-400' : ''} ${isPastRow ? 'bg-amber-50/80 dark:bg-amber-900/15 border-l-4 border-l-amber-400 dark:border-l-amber-500' : ''}`}
                    >
                      <TableCell className="py-3">
                        {isFirstInGroup ? (
                          <div>
                            <div className="flex items-center gap-2">
                              <div className="text-[17px] font-medium text-[#3d2f27] dark:text-foreground">
                                {searchQuery ? highlightText(booking.hotelName || 'N/A', searchQuery) : (booking.hotelName || 'N/A')}
                              </div>
                              {isDuplicate && (
                                <div title="Дубликат: другая бронь на эту же комнату в те же даты">
                                  <AlertTriangle className="w-4 h-4 text-red-500 dark:text-red-400" />
                                </div>
                              )}
                            </div>
                            <div className="mt-0.5 text-[15px] text-[#8a7566] dark:text-muted-foreground">
                              Комната {searchQuery ? highlightText(booking.roomNumber || 'N/A', searchQuery) : (booking.roomNumber || 'N/A')}
                              {room && (
                                <> · {room.type === 'FZ' ? 'семейная' : room.type === 'DZ' ? 'двухместная' : room.type === 'EZ' ? 'одноместная' : room.type === 'MZ' ? 'многоместная' : room.type === 'App' ? 'апартаменты' : 'общая'}</>
                              )}
                            </div>
                          </div>
                        ) : (
                          <div className="text-sm text-gray-400 dark:text-muted-foreground">—</div>
                        )}
                      </TableCell>

                      <TableCell className="py-3">
                        {(() => {
                          const f = getFestivalForBooking(booking);
                          return f ? (
                            <span className="inline-block px-2 py-0.5 rounded-full text-xs bg-gray-100 dark:bg-muted text-gray-700 dark:text-foreground whitespace-nowrap" title={`${formatShortDate(f.startDate)} – ${formatShortDate(f.endDate)}`}>
                              {getFestivalLabel(f)}
                            </span>
                          ) : (
                            <span className="text-xs text-gray-400 dark:text-muted-foreground">—</span>
                          );
                        })()}
                      </TableCell>

                      <TableCell className="py-3">
                        <div className="text-[17px] font-medium text-[#3d2f27] dark:text-foreground">
                          {searchQuery ? highlightText(booking.bookedBy, searchQuery) : booking.bookedBy}
                        </div>
                        {booking.notes && (
                          <div title={booking.notes} className="mt-0.5 max-w-[200px] truncate text-sm italic text-[#8a7566] dark:text-muted-foreground">
                            {searchQuery ? highlightText(booking.notes, searchQuery) : booking.notes}
                          </div>
                        )}
                      </TableCell>
                      
                      <TableCell className="py-3">
                        <div className="text-[17px] text-[#3d2f27] dark:text-foreground">
                          {new Date(booking.bookedDate).toLocaleDateString('ru-RU')}
                        </div>
                      </TableCell>
                      
                      <TableCell className="py-3">
                        <div className="text-[15px] text-[#6b5a4e] dark:text-muted-foreground">
                          <div>
                            {searchQuery ? highlightText(booking.email || '', searchQuery) : (booking.email || '')}
                          </div>
                          <div className="text-gray-500 dark:text-muted-foreground mt-0.5">{searchQuery ? highlightText(booking.phone || '', searchQuery) : booking.phone}</div>
                        </div>
                      </TableCell>
                      
                      <TableCell className="py-3">
                        <div className="whitespace-nowrap text-[17px] text-[#3d2f27] dark:text-foreground">
                          <span className={!isDateInValidRange(new Date(booking.checkIn)) ? 'font-semibold text-red-600 dark:text-red-400' : ''}>
                            {new Date(booking.checkIn).toLocaleDateString('ru-RU')}
                          </span>
                          <span className="mx-1.5 text-[#b9a493]">→</span>
                          <span className={!isDateInValidRange(new Date(booking.checkOut)) ? 'font-semibold text-red-600 dark:text-red-400' : ''}>
                            {new Date(booking.checkOut).toLocaleDateString('ru-RU')}
                          </span>
                        </div>
                        <div className="mt-0.5 text-[15px] text-[#8a7566] dark:text-muted-foreground">
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
                        {(() => {
                          const guestsCount = Array.isArray(booking.guests) ? booking.guests.length : 0;
                          
                          // Если нет room, показываем только сохраненную сумму
                          if (!room) {
                            return (
                              <div className="text-sm font-semibold text-gray-700 dark:text-foreground">
                                {totalPrice > 0 ? `${totalPrice.toFixed(2)}€` : <span className="font-medium text-[#8a7566]">Комната удалена</span>}
                              </div>
                            );
                          }
                          
                          // Определяем, учитывались ли люди в расчете
                          const simpleCalc = nights * room.price;
                          const isPerPerson = guestsCount > 0 && (room.pricePerPerson || totalPrice > simpleCalc + 0.01);
                          
                          return (
                            <>
                              <div className="text-sm font-semibold text-gray-700 dark:text-foreground">
                                {totalPrice > 0 ? `${totalPrice.toFixed(2)}€` : <span className="font-medium text-[#8a7566]">Цена не задана</span>}
                              </div>
                              {room.price > 0 ? (
                                <div className="mt-0.5 text-[15px] text-[#8a7566] dark:text-muted-foreground">
                                  {isPerPerson
                                    ? `${guestsCount} чел × ${nights} н × ${room.price}€`
                                    : `${nights} н × ${room.price}€`}
                                </div>
                              ) : (
                                <button
                                  type="button"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setPriceRoom({ room, hotelName: booking.hotelName });
                                  }}
                                  className="mt-1 inline-flex min-h-[40px] items-center whitespace-nowrap rounded-xl bg-[#6b4a36] px-4 text-sm font-semibold text-white hover:bg-[#5a3b28]"
                                >
                                  Задать цену комнаты
                                </button>
                              )}
                            </>
                          );
                        })()}
                      </TableCell>
                      
                      {(currentUser?.role === 'manager' || currentUser?.role === 'developer') && (
                        <TableCell className="py-3">
                          {isFullyPaid ? (
                            <span className="inline-flex items-center whitespace-nowrap rounded-full bg-emerald-100 px-3 py-1 text-sm font-medium text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-300">Оплачено</span>
                          ) : isHalfPaidOrMore ? (
                            <span className="inline-flex items-center whitespace-nowrap rounded-full bg-amber-100 px-3 py-1 text-sm font-medium text-amber-800 dark:bg-amber-900/30 dark:text-amber-300">Оплачено 50%</span>
                          ) : (
                            <span className="inline-flex items-center whitespace-nowrap rounded-full bg-[#fde4d8] px-3 py-1 text-sm font-medium text-[#a8431f] dark:bg-red-900/30 dark:text-red-300">Не оплачено</span>
                          )}
                          {alreadyPaid > 0 && (
                            <div className="text-[15px] text-[#8a7566] dark:text-muted-foreground mt-1">
                              Оплачено: {alreadyPaid.toFixed(2)}€
                            </div>
                          )}
                        </TableCell>
                      )}
                      
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
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setOpenMenuId(null);
                                    setRoomHistoryBooking(booking);
                                  }}
                                  className="w-full px-3 py-2 text-left text-xs text-gray-700 dark:text-foreground hover:bg-gray-50 dark:hover:bg-accent flex items-center gap-2 transition-colors"
                                >
                                  <History className="w-3 h-3" />
                                  История комнаты
                                </button>
                                <div className="border-t border-gray-200 dark:border-border my-1" />
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
                                    <button
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        setOpenMenuId(null);
                                        handleCancelHalfPayment(booking);
                                      }}
                                      className="w-full px-3 py-2 text-left text-xs text-orange-700 dark:text-orange-400 hover:bg-orange-50 dark:hover:bg-orange-900/20 flex items-center gap-2 transition-colors"
                                    >
                                      <Euro className="w-3 h-3" />
                                      Отменить 50% оплаты
                                    </button>
                                    <button
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        setOpenMenuId(null);
                                        handleCancelFullPayment(booking);
                                      }}
                                      className="w-full px-3 py-2 text-left text-xs text-red-700 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 flex items-center gap-2 transition-colors"
                                    >
                                      <Euro className="w-3 h-3" />
                                      Отменить 100% оплаты
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
          </>
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
        
        // Рассчитываем полную стоимость бронирования (expectedAmount) с учётом perPerson
        // НЕ используем booking.amount для расчета полной стоимости, так как это уже оплаченная сумма
        let expectedAmount: number;
        if (room?.pricePerPerson && booking.guests) {
          const guestsCount = Array.isArray(booking.guests) ? booking.guests.length : 0;
          expectedAmount = nights * (room?.price || 0) * guestsCount;
        } else {
          expectedAmount = nights * (room?.price || 0);
        }
        
        // alreadyPaid - это сумма, которая УЖЕ была оплачена (из поля amount)
        const alreadyPaid = booking.amount ? Number(booking.amount) : 0;
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const _remainingAmount = Math.max(0, expectedAmount - alreadyPaid);
        const totalPrice = expectedAmount;
        
        return (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[9999] p-4 pb-20 lg:pb-4 overflow-y-auto">
            <div className="bg-white dark:bg-card rounded-lg max-w-4xl w-full max-h-[calc(90vh-80px)] lg:max-h-[90vh] overflow-y-auto">
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
                          <span className="ml-2 font-semibold text-gray-900 dark:text-foreground">
                            #{booking.roomNumber || 'N/A'}
                            {room?.name && <span className="text-gray-500 dark:text-muted-foreground font-normal ml-1">({room.name})</span>}
                          </span>
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
                              <span className="ml-2 font-semibold text-gray-900 dark:text-foreground">{room.price}€{room.pricePerPerson ? ' p.P.' : ''}</span>
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
              if (onModalStateChange) {
                onModalStateChange(false);
              }
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
        
        // Рассчитываем полную сумму бронирования с учётом perPerson
        // НЕ используем paymentBooking.amount для расчета полной суммы, так как это уже оплаченная сумма
        let totalBookingAmount: number;
        if (room?.pricePerPerson && paymentBooking.guests) {
          const guestsCount = Array.isArray(paymentBooking.guests) ? paymentBooking.guests.length : 0;
          totalBookingAmount = nights * (room?.price || 0) * guestsCount;
        } else {
          totalBookingAmount = nights * (room?.price || 0);
        }
        
        // Уже оплаченная сумма берется из amount
        const alreadyPaid = paymentBooking.amount ? Number(paymentBooking.amount) : 0;
        
        // Рассчитываем сумму к доплате
        let paymentAmount: number;
        if (paymentType === 'half') {
          // Для 50%: если уже оплачено меньше 50%, доплачиваем до 50%
          const halfAmount = totalBookingAmount / 2;
          if (alreadyPaid < halfAmount) {
            // Доплачиваем до 50%
            paymentAmount = halfAmount;
          } else {
            // Уже оплачено 50% или больше, доплачиваем до 100%
            paymentAmount = totalBookingAmount;
          }
        } else {
          // Для 100%: всегда доплачиваем до полной суммы
          paymentAmount = totalBookingAmount;
        }
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

      {/* История комнаты: кто жил в этой комнате на разных фестивалях */}
      {roomHistoryBooking && (() => {
        const history = bookings
          .filter((b) => b.roomId === roomHistoryBooking.roomId)
          .sort((a, b) => new Date(b.checkIn).getTime() - new Date(a.checkIn).getTime());
        return (
          <div
            className="fixed inset-0 z-[10000] flex items-center justify-center bg-black/50 p-4"
            onClick={() => setRoomHistoryBooking(null)}
          >
            <div
              className="bg-white dark:bg-card rounded-lg shadow-xl w-full max-w-2xl max-h-[85vh] overflow-y-auto p-5"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h2 className="text-lg font-bold text-gray-900 dark:text-foreground flex items-center gap-2">
                    <History className="w-5 h-5" />
                    История комнаты #{roomHistoryBooking.roomNumber}
                  </h2>
                  <p className="text-xs text-gray-500 dark:text-muted-foreground mt-0.5">
                    {roomHistoryBooking.hotelName}
                  </p>
                </div>
                <button
                  onClick={() => setRoomHistoryBooking(null)}
                  className="text-gray-500 dark:text-muted-foreground hover:text-gray-700 dark:hover:text-foreground"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              <div className="space-y-2">
                {history.map((b) => {
                  const f = getFestivalForBooking(b);
                  const isCurrent = b.id === roomHistoryBooking.id;
                  const guestNames = (b.guests || []).map((g: Guest) => g.name).filter(Boolean);
                  return (
                    <div
                      key={b.id}
                      className={`rounded-lg border p-3 text-sm ${
                        isCurrent
                          ? 'border-gray-900 dark:border-ring bg-gray-50 dark:bg-muted'
                          : 'border-gray-200 dark:border-border'
                      }`}
                    >
                      <div className="flex flex-wrap items-center justify-between gap-2 mb-1">
                        <span className="text-xs font-semibold text-gray-700 dark:text-foreground">
                          {f ? getFestivalLabel(f) : 'Вне фестивалей'}
                          {isCurrent && <span className="ml-2 text-gray-500 font-normal">(выбранная бронь)</span>}
                        </span>
                        <span className="text-xs text-gray-500 dark:text-muted-foreground">
                          {formatShortDate(b.checkIn)} – {formatShortDate(b.checkOut)}
                        </span>
                      </div>
                      <div className="text-gray-900 dark:text-foreground">Бронировал: {b.bookedBy}</div>
                      <div className="text-xs text-gray-600 dark:text-muted-foreground mt-0.5">
                        Гости: {guestNames.length > 0 ? guestNames.join(', ') : '—'}
                      </div>
                      <div className="text-xs text-gray-500 dark:text-muted-foreground mt-0.5">
                        {b.phone}{b.email ? ` · ${b.email}` : ''}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        );
      })()}

      {priceRoom && (
        <RoomPriceModal
          room={priceRoom.room}
          rooms={rooms}
          hotelName={priceRoom.hotelName}
          onClose={() => setPriceRoom(null)}
          onSaved={() => loadAllData(_filterHotelId || undefined)}
        />
      )}
    </div>
  );
}
