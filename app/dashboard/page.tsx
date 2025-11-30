'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { Building2, Bed, Users, BarChart3, LogOut, Plus, Edit, Trash2, LayoutGrid, Filter, Calendar, Euro, X, ArrowUpDown, ArrowUp, ArrowDown, ArrowLeft, DollarSign, Mail, Copy, RefreshCw, CheckCircle, AlertCircle, Clock, KeyRound, ArrowRight, Phone, BookOpen, List, Eye, EyeOff, Bell, MessageSquare, CreditCard } from 'lucide-react';
import { api } from '@/lib/api';
import type { User, Room, Hotel, Stairs, Statistics, CashMonitoring, Invite, BookingInfo } from '@/types';
import FloorPlan from '@/components/FloorPlan';
import Link from 'next/link';
import FeedbackForm from '@/components/FeedbackForm';

export default function Dashboard() {
  const router = useRouter();
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [hotels, setHotels] = useState<Hotel[]>([]);
  const [rooms, setRooms] = useState<Room[]>([]);
  // Состояние будет восстановлено после загрузки данных
  const [selectedHotel, setSelectedHotel] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [dataLoaded, setDataLoaded] = useState(false); // Флаг загрузки данных
  const [isRefreshing, setIsRefreshing] = useState(false); // Тихая перезагрузка без скелетона
  const [error, setError] = useState<string | null>(null); // Состояние ошибки
  const [viewMode, setViewMode] = useState<'plan' | 'list'>('plan');
  const [selectedFloor, setSelectedFloor] = useState<'EG' | '1OG' | '2OG'>('EG');
  const [stairs, setStairs] = useState<Stairs[]>([]);
  const [showRoomModal, setShowRoomModal] = useState(false);
  const [editingRoom, setEditingRoom] = useState<Room | null>(null);
  const [showFeedbackForm, setShowFeedbackForm] = useState(false);
  
  // Фильтры и сортировка
  const [filterType, setFilterType] = useState<'all' | 'FZ' | 'DZ' | 'EZ'>('all');
  const [filterPriceMin, setFilterPriceMin] = useState(0);
  const [filterPriceMax, setFilterPriceMax] = useState(1000);
  const [filterCapacity, setFilterCapacity] = useState(0);
  const [filterAvailableOnly, setFilterAvailableOnly] = useState(false); // По умолчанию показываем все комнаты
  const [sortBy, setSortBy] = useState<'floor' | 'number' | 'type' | 'price' | 'capacity' | 'status'>('floor');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const [showFilters, setShowFilters] = useState(false);
  
  // Состояние для бронирований
  const [bookings, setBookings] = useState<(BookingInfo & { roomNumber?: string; hotelName?: string })[]>([]);
  const [bookingsLoading, setBookingsLoading] = useState(false);
  const [filterBookedBy, setFilterBookedBy] = useState<string>('');
  const [filterRoomNumber, setFilterRoomNumber] = useState<string>('');
  const [filterDateFrom, setFilterDateFrom] = useState<string>('');
  const [filterDateTo, setFilterDateTo] = useState<string>('');
  const [showBookingsFilters, setShowBookingsFilters] = useState(false);
  const [bookingsSortBy, setBookingsSortBy] = useState<'checkIn' | 'checkOut' | 'bookedDate' | 'bookedBy' | 'roomNumber'>('checkIn');
  const [bookingsSortDirection, setBookingsSortDirection] = useState<'asc' | 'desc'>('desc');
  const [bookingStats, setBookingStats] = useState({ unconfirmed: 0, unpaid: 0 });
  
  // Состояние для активной вкладки в мобильном меню (только для обычных пользователей)
  const [activeTab, setActiveTab] = useState<'hotels' | 'bookings'>('hotels');
  
  // Ref для отслеживания предыдущего значения выбранного отеля
  const prevSelectedHotelRef = useRef<string | null>(null);

  useEffect(() => {
    const userStr = localStorage.getItem('currentUser');
    if (!userStr) {
      router.push('/');
      return;
    }

    const user = JSON.parse(userStr);
    
    // Проверяем, заполнен ли телефон (обязателен)
    if (!user.phone) {
      router.push('/complete-profile');
      return;
    }
    
    // Менеджеры автоматически перенаправляются на CMS
    if (user.role === 'manager') {
      router.push('/cms/dashboard');
      return;
    }

    setCurrentUser(user);
    loadData();
    loadBookings(); // Загружаем бронирования при загрузке страницы
    loadBookingStats();
    
    // Обновляем статистику каждые 30 секунд
    const interval = setInterval(() => {
      loadBookingStats();
    }, 30000);
    
    return () => clearInterval(interval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router]);

  // Сохраняем состояние в localStorage при изменении (только после загрузки данных)
  useEffect(() => {
    if (dataLoaded) {
      if (selectedHotel) {
        localStorage.setItem('dashboard_selectedHotel', selectedHotel);
      } else {
        localStorage.removeItem('dashboard_selectedHotel');
      }
    }
  }, [selectedHotel, dataLoaded]);

  useEffect(() => {
    if (dataLoaded) {
      localStorage.setItem('dashboard_viewMode', viewMode);
    }
  }, [viewMode, dataLoaded]);

  useEffect(() => {
    if (dataLoaded) {
      localStorage.setItem('dashboard_selectedFloor', selectedFloor);
    }
  }, [selectedFloor, dataLoaded]);

  useEffect(() => {
    localStorage.setItem('dashboard_viewMode', viewMode);
  }, [viewMode]);

  useEffect(() => {
    localStorage.setItem('dashboard_selectedFloor', selectedFloor);
  }, [selectedFloor]);

  // Обновление максимальной цены при загрузке комнат
  useEffect(() => {
    if (rooms.length > 0 && selectedHotel) {
      const hotelRooms = rooms.filter(r => r.hotelId === selectedHotel);
      const roomsWithPrice = hotelRooms.filter(r => !r.isCommon && r.price > 0);
      if (roomsWithPrice.length > 0) {
        const maxPrice = Math.max(...roomsWithPrice.map(r => r.price));
        if (maxPrice > 0 && filterPriceMax === 1000) {
          setFilterPriceMax(maxPrice);
        }
      }
    }
  }, [rooms, selectedHotel, filterPriceMax]);

  // Перезагрузка данных при смене отеля
  useEffect(() => {
    // Пропускаем первоначальную загрузку и пустые значения
    if (!dataLoaded) {
      prevSelectedHotelRef.current = selectedHotel;
      return;
    }
    
    // Проверяем, действительно ли изменился отель
    if (prevSelectedHotelRef.current !== selectedHotel && selectedHotel) {
      console.log('Hotel changed, reloading data for:', selectedHotel);
      loadData(true); // Тихая перезагрузка без скелетона
      loadBookings();
    }
    
    // Обновляем предыдущее значение
    prevSelectedHotelRef.current = selectedHotel;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedHotel, dataLoaded]);

  const loadData = async (silent = false) => {
    try {
      // При тихой перезагрузке не показываем скелетон
      if (silent) {
        setIsRefreshing(true);
      } else {
        setLoading(true);
      }
      
      const [hotelsData, roomsData, stairsData] = await Promise.all([
        api.getHotels(),
        api.getRooms(),
        api.getStairs()
      ]);

      setHotels(hotelsData);
      setRooms(roomsData);
      setStairs(stairsData || []);

      // Восстанавливаем состояние из localStorage только после загрузки данных
      if (!dataLoaded) {
        // Восстанавливаем все состояния синхронно в одном батче
        const savedViewMode = localStorage.getItem('dashboard_viewMode');
        const savedFloor = localStorage.getItem('dashboard_selectedFloor');
        const savedHotel = localStorage.getItem('dashboard_selectedHotel');

        // Применяем все изменения состояния одновременно
        if (savedViewMode === 'plan' || savedViewMode === 'list') {
          setViewMode(savedViewMode);
        }
        if (savedFloor === 'EG' || savedFloor === '1OG' || savedFloor === '2OG') {
          setSelectedFloor(savedFloor);
        }
        if (savedHotel) {
          const hotelExists = hotelsData.find(h => h.id === savedHotel);
          if (hotelExists) {
            setSelectedHotel(savedHotel);
          } else {
            // Если отель не найден, очищаем из localStorage
            localStorage.removeItem('dashboard_selectedHotel');
          }
        }
      } else {
        // Проверяем, что выбранный отель все еще существует (при обновлении данных)
        if (selectedHotel && !hotelsData.find(h => h.id === selectedHotel)) {
          // Если отель был удален, сбрасываем выбор
          setSelectedHotel('');
          localStorage.removeItem('dashboard_selectedHotel');
        }
      }
      
      // Устанавливаем флаг только при успешной загрузке
      setDataLoaded(true);
      setError(null); // Очищаем ошибку при успешной загрузке
    } catch (error) {
      console.error('Error loading data:', error);
      const errorMessage = error instanceof Error ? error.message : 'Ошибка при загрузке данных';
      setError(errorMessage);
      // Не устанавливаем dataLoaded при ошибке, чтобы показать экран загрузки
      // и пользователь мог увидеть, что что-то пошло не так
    } finally {
      setLoading(false);
      setIsRefreshing(false);
    }
  };

  const loadBookings = async () => {
    try {
      setBookingsLoading(true);
      const [bookingsData, roomsData, hotelsData] = await Promise.all([
        api.getBookings(),
        api.getRooms(),
        api.getHotels()
      ]);

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
      setBookingsLoading(false);
    }
  };

  const loadBookingStats = async () => {
    try {
      const stats = await api.getBookingStats();
      setBookingStats(stats);
    } catch (error) {
      console.error('Error loading booking stats:', error);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('currentUser');
    router.push('/');
  };

  const handleDeleteRoom = async (id: string) => {
    if (!confirm('Вы уверены, что хотите удалить эту комнату?')) return;
    
    try {
      await api.deleteRoom(id);
      setRooms(rooms.filter(r => r.id !== id));
    } catch (error) {
      alert('Ошибка при удалении комнаты');
    }
  };

  const handleCancelBooking = async (roomId: string) => {
    const room = rooms.find(r => r.id === roomId);
    if (!room?.booking) return;

    if (!confirm('Вы уверены, что хотите отменить бронирование?')) return;

    try {
      if (room.booking.id) {
        await api.deleteBooking(room.booking.id);
      }
      // Обновляем комнату, убирая бронирование
      const updatedRooms = rooms.map(r => 
        r.id === roomId ? { ...r, booking: undefined } : r
      );
      setRooms(updatedRooms);
    } catch (error) {
      console.error('Error canceling booking:', error);
      alert('Ошибка при отмене бронирования');
    }
  };


  const handleSaveRoom = async (roomData: Partial<Room> & { number: string; hotelId: string; type: Room['type']; floor: Room['floor'] }) => {
    try {
      if (editingRoom) {
        await api.updateRoom(editingRoom.id, roomData);
        setRooms(rooms.map(r => r.id === editingRoom.id ? { ...r, ...roomData } : r));
      } else {
        const newRoom = await api.createRoom(roomData);
        setRooms([...rooms, newRoom]);
      }
      setShowRoomModal(false);
      setEditingRoom(null);
    } catch (error) {
      alert('Ошибка при сохранении комнаты');
    }
  };

  const handleRoomUpdate = async (updatedRoom: Room) => {
    try {
      await api.updateRoom(updatedRoom.id, updatedRoom);
      setRooms(prevRooms => prevRooms.map(r => r.id === updatedRoom.id ? updatedRoom : r));
    } catch (error) {
      console.error('Error updating room:', error);
    }
  };

  const handleRoomCreate = async (newRoom: Room) => {
    try {
      const created = await api.createRoom(newRoom);
      setRooms(prevRooms => [...prevRooms, created]);
    } catch (error) {
      console.error('Error creating room:', error);
    }
  };


  const handleStairsUpdate = async (updatedStairs: Stairs[]) => {
    try {
      // Обновляем все ступени
      for (const stair of updatedStairs) {
        const existing = stairs.find(s => s.id === stair.id);
        if (existing) {
          await api.updateStairs(stair.id, stair);
        } else {
          await api.createStairs(stair);
        }
      }
      
      // Удаляем ступени, которых нет в обновленном списке
      const currentIds = updatedStairs.map(s => s.id);
      const toDelete = stairs.filter(s => !currentIds.includes(s.id));
      for (const stair of toDelete) {
        await api.deleteStairs(stair.id);
      }
      
      setStairs(updatedStairs);
    } catch (error) {
      console.error('Error updating stairs:', error);
    }
  };

  const handleRoomClick = (room: Room) => {
    if (!room.isCommon && !room.booking) {
      // Бронировать можно только свободные комнаты
      // Менеджер сначала должен отменить существующее бронирование
      router.push(`/booking/${room.id}`);
    }
  };


  // Показываем индикатор загрузки, пока пользователь не загружен или данные не получены
  if (!currentUser || loading || !dataLoaded) {
    // Если есть ошибка - показываем сообщение об ошибке
    if (error) {
      return (
        <div className="flex items-center justify-center min-h-screen bg-gray-50">
          <div className="text-center">
            <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
            <div className="text-lg text-gray-900 mb-4">Ошибка загрузки данных</div>
            <div className="text-sm text-gray-600 mb-4">{error}</div>
            <button
              onClick={() => {
                setError(null);
                setLoading(true);
                loadData();
              }}
              className="px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors"
            >
              Попробовать снова
            </button>
          </div>
        </div>
      );
    }
    
    // Скелетон загрузки
    return (
      <div className="min-h-screen bg-gray-50 flex">
        {/* Skeleton Sidebar - только для десктопа */}
        <aside className="hidden lg:block w-64 bg-white border-r border-gray-200 h-screen">
          <div className="h-full flex flex-col">
            {/* Sidebar Header */}
            <div className="p-4 border-b border-gray-200">
              <div className="h-6 w-24 bg-gray-200 rounded animate-pulse"></div>
            </div>
            {/* Navigation skeleton */}
            <nav className="flex-1 p-4 space-y-2">
              <div className="h-3 w-16 bg-gray-100 rounded mb-3"></div>
              {[1, 2, 3].map(i => (
                <div key={i} className="h-10 bg-gray-100 rounded-lg animate-pulse"></div>
              ))}
              <div className="h-10 bg-gray-200 rounded-lg animate-pulse mt-4"></div>
            </nav>
          </div>
        </aside>

        {/* Skeleton Main Content */}
        <main className="flex-1 p-4 lg:p-6">
          {/* Header skeleton */}
          <div className="flex items-center justify-between mb-6">
            <div className="h-8 w-48 bg-gray-200 rounded animate-pulse"></div>
            <div className="h-10 w-10 bg-gray-200 rounded-full animate-pulse"></div>
          </div>

          {/* Cards skeleton */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
            {[1, 2, 3].map(i => (
              <div key={i} className="bg-white rounded-xl p-5 border border-gray-100">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 bg-gray-100 rounded-lg animate-pulse"></div>
                  <div className="h-4 w-24 bg-gray-200 rounded animate-pulse"></div>
                </div>
                <div className="h-6 w-16 bg-gray-100 rounded animate-pulse"></div>
              </div>
            ))}
          </div>

          {/* Rooms grid skeleton */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3">
            {[1, 2, 3, 4, 5, 6, 7, 8].map(i => (
              <div 
                key={i} 
                className="bg-white rounded-xl p-4 border border-gray-100"
                style={{ animationDelay: `${i * 50}ms` }}
              >
                <div className="h-4 w-12 bg-gray-200 rounded animate-pulse mb-3"></div>
                <div className="h-3 w-16 bg-gray-100 rounded animate-pulse mb-2"></div>
                <div className="h-5 w-14 bg-gray-100 rounded animate-pulse"></div>
              </div>
            ))}
          </div>
        </main>
      </div>
    );
  }

  const hotelRooms = rooms.filter(r => r.hotelId === selectedHotel);
  const currentHotel = hotels.find(h => h.id === selectedHotel);
  const availableRooms = hotelRooms.filter(r => !r.booking && !r.isCommon).length;
  const myBookingsCount = rooms.filter(r => r.booking?.bookedBy === currentUser.name).length;

  // Вычисляем минимальную цену для каждого отеля
  const getHotelMinPrice = (hotelId: string): number => {
    const hotelRoomsList = rooms.filter(r => r.hotelId === hotelId && !r.isCommon);
    if (hotelRoomsList.length === 0) return 0;
    return Math.min(...hotelRoomsList.map(r => r.price));
  };

  // Обработка сортировки по клику на заголовок
  const handleSort = (column: 'floor' | 'number' | 'type' | 'price' | 'capacity' | 'status') => {
    if (sortBy === column) {
      // Если кликнули на тот же столбец - меняем направление
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      // Если кликнули на другой столбец - устанавливаем его и направление по умолчанию
      setSortBy(column);
      setSortDirection('asc');
    }
  };

  // Фильтрация и сортировка комнат для таблицы
  const filteredAndSortedRooms = hotelRooms
    .filter(room => {
      if (room.isCommon) return false;
      
      // Для гостя показываем только свободные комнаты и свои бронирования
      if (currentUser.role === 'guest') {
        if (room.booking && room.booking.bookedBy !== currentUser.name) {
          return false; // Скрываем чужие бронирования
        }
        // Показываем свободные и свои забронированные
      }
      
      // Фильтр "только свободные"
      if (filterAvailableOnly && room.booking) return false;
      // Остальные фильтры (применяются только если установлены)
      if (filterType !== 'all' && room.type !== filterType) return false;
      if (filterPriceMin > 0 && room.price < filterPriceMin) return false;
      if (filterPriceMax < 1000 && room.price > filterPriceMax) return false;
      if (filterCapacity > 0 && room.maxCapacity < filterCapacity) return false;
      return true;
    })
    .sort((a, b) => {
      let comparison = 0;
      
      switch (sortBy) {
        case 'floor':
          const floorOrder: { [key: string]: number } = { 'EG': 0, '1OG': 1, '2OG': 2 };
          comparison = (floorOrder[a.floor] || 0) - (floorOrder[b.floor] || 0);
          break;
        case 'number':
          comparison = a.number.localeCompare(b.number);
          break;
        case 'type':
          comparison = a.type.localeCompare(b.type);
          break;
        case 'price':
          comparison = a.price - b.price;
          break;
        case 'capacity':
          comparison = a.maxCapacity - b.maxCapacity;
          break;
        case 'status':
          const aStatus = a.booking ? 1 : 0;
          const bStatus = b.booking ? 1 : 0;
          comparison = aStatus - bStatus;
          break;
        default:
          return 0;
      }
      
      return sortDirection === 'asc' ? comparison : -comparison;
    });

  // Вычисление максимальной цены для сброса
  const getMaxPrice = () => {
    if (hotelRooms.length === 0) return 1000;
    const roomsWithPrice = hotelRooms.filter(r => !r.isCommon && r.price > 0);
    if (roomsWithPrice.length === 0) return 1000;
    const maxPrice = Math.max(...roomsWithPrice.map(r => r.price));
    return Math.ceil(maxPrice / 10) * 10; // Округляем до десятков
  };

  // Функция сброса фильтров
  const resetFilters = () => {
    setFilterType('all');
    setFilterPriceMin(0);
    setFilterPriceMax(getMaxPrice());
    setFilterCapacity(0);
    setFilterAvailableOnly(false);
    setSortBy('floor');
    setSortDirection('asc');
  };

  // Проверка, применены ли фильтры
  const maxPrice = getMaxPrice();
  const hasActiveFilters = filterType !== 'all' || filterPriceMin > 0 || filterPriceMax < maxPrice || filterCapacity > 0 || filterAvailableOnly || sortBy !== 'floor' || sortDirection !== 'asc';

  // Комнаты для текущего этажа
  const floorRooms = hotelRooms.filter(r => r.floor === selectedFloor);

  return (
    <div className="min-h-screen bg-gray-50 flex pb-16 lg:pb-0">
      {/* Sidebar - только для десктопа */}
      {currentUser.role === 'guest' && (
        <aside className="hidden lg:block w-64 bg-white border-r border-gray-200 sticky top-0 h-screen z-50">
          <div className="h-full flex flex-col">
            {/* Sidebar Header */}
            <div className="p-4 border-b border-gray-200">
              <h2 className="text-lg font-bold text-gray-900">Навигация</h2>
            </div>

            {/* Navigation Menu */}
            <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
              {/* Отели */}
              <div className="mb-4">
                <div className="text-xs font-semibold text-gray-500 uppercase mb-2 px-2">Отели</div>
                <button
                  onClick={() => {
                    setSelectedHotel('');
                    setActiveTab('hotels');
                  }}
                  className={`w-full px-4 py-2.5 rounded-lg text-sm font-semibold transition-colors flex items-center gap-3 text-left mb-1 ${
                    !selectedHotel && activeTab === 'hotels' && currentUser.role === 'guest'
                      ? 'bg-gray-900 text-white'
                      : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-200'
                  }`}
                >
                  <Building2 className="w-4 h-4 shrink-0" />
                  <span>Все отели</span>
                </button>
                <div className="space-y-1 mb-2">
                  {hotels.map(hotel => (
                    <button
                      key={hotel.id}
                      onClick={() => setSelectedHotel(hotel.id)}
                      className={`w-full px-4 py-2.5 rounded-lg text-sm font-semibold transition-colors flex items-center gap-3 text-left ${
                        selectedHotel === hotel.id
                          ? 'bg-gray-900 text-white'
                          : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-200'
                      }`}
                    >
                      <Building2 className="w-4 h-4 shrink-0" />
                      <span className="truncate">{hotel.name}</span>
                    </button>
                  ))}
                </div>
                 {/* Мои бронирования */}
              <button
                onClick={() => {
                  setSelectedHotel('');
                  setActiveTab('bookings');
                  if (bookings.length === 0) {
                    loadBookings();
                  }
                }}
                className={`w-full px-4 py-3 rounded-lg text-sm font-semibold transition-colors flex items-center gap-3 text-left ${
                  !selectedHotel && activeTab === 'bookings' && currentUser.role === 'guest'
                    ? 'bg-gray-900 text-white'
                    : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-200'
                }`}
              >
                <BookOpen className="w-5 h-5" />
                <span>Мои бронирования</span>
              </button>
              </div>

             
            </nav>

            {/* Sidebar Footer */}
            <div className="p-4 border-t border-gray-200">
              <button
                onClick={handleLogout}
                className="w-full px-4 py-2 rounded-lg text-sm font-semibold transition-colors flex items-center gap-3 text-gray-700 hover:bg-gray-50"
              >
                <LogOut className="w-5 h-5" />
                <span>Выйти</span>
              </button>
            </div>
          </div>
        </aside>
      )}

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Header */}
        <header className="bg-white border-b border-gray-200 sticky top-0 z-30">
          <div className="px-3 sm:px-4 py-2 sm:py-3">
            <div className="flex justify-between items-center gap-2 sm:gap-4">
              <div className="flex items-center gap-2 sm:gap-3 min-w-0">
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
                {selectedHotel && (
                  <div className="hidden sm:flex items-center gap-3 text-xs sm:text-sm">
                    <div className="text-gray-700">
                      Свободно: <span className="font-bold text-emerald-600">{availableRooms}</span>
                    </div>
                  </div>
                )}


                {/* Кнопка обратной связи */}
                <button
                  onClick={() => setShowFeedbackForm(true)}
                  className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
                  title="Отправить отзыв / Сообщить об ошибке "
                >
                  <MessageSquare className="w-5 h-5" />
                </button>


                {/* Кнопка CMS для менеджеров */}
                {currentUser.role === 'manager' && (
                  <Link
                    href="/cms/dashboard"
                    className="px-2 sm:px-3 py-1.5 sm:py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs sm:text-sm font-semibold transition-colors flex items-center gap-1 sm:gap-2"
                    title="CMS - Управление"
                  >
                    <Building2 className="w-3 h-3 sm:w-4 sm:h-4" />
                    <span className="hidden sm:inline">CMS</span>
                  </Link>
                )}

                {/* Кнопка выхода для менеджеров (для гостей она в sidebar) */}
                {currentUser.role === 'manager' && (
                  <button
                    onClick={handleLogout}
                    className="bg-gray-900 hover:bg-gray-800 text-white px-2 sm:px-3 py-1.5 sm:py-2 rounded-lg text-xs sm:text-sm font-semibold transition-colors flex items-center gap-1 sm:gap-2"
                  >
                    <LogOut className="w-3 h-3 sm:w-4 sm:h-4" />
                    <span className="hidden sm:inline">Выйти</span>
                  </button>
                )}
              </div>
            </div>
          </div>
        </header>

      {/* Информация о выбранном отеле */}
      {selectedHotel && currentHotel && (
        <div className="bg-white border-b border-gray-200 relative overflow-hidden">
          {/* Индикатор обновления данных */}
          {isRefreshing && (
            <div className="absolute top-0 left-0 right-0 h-0.5 bg-gray-100 overflow-hidden">
              <div className="h-full w-1/3 bg-gray-900 animate-[shimmer_1s_ease-in-out_infinite]" 
                   style={{ animation: 'shimmer 1s ease-in-out infinite' }} />
            </div>
          )}
          <div className="max-w-7xl mx-auto px-3 sm:px-4 py-4 sm:py-6">
            <div className="flex flex-col sm:flex-row gap-4 sm:gap-6">
              {/* Фото отеля */}
              {currentHotel.image ? (
                <div className={`w-full sm:w-48 h-48 sm:h-32 shrink-0 rounded-xl overflow-hidden shadow-sm transition-opacity ${isRefreshing ? 'opacity-70' : ''}`}>
                  <img
                    src={currentHotel.image}
                    alt={currentHotel.name}
                    className="w-full h-full object-cover"
                  />
                </div>
              ) : (
                <div className={`w-full sm:w-48 h-48 sm:h-32 shrink-0 rounded-xl bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center shadow-sm transition-opacity ${isRefreshing ? 'opacity-70' : ''}`}>
                  <Building2 className="w-12 h-12 text-gray-400" />
                </div>
              )}
              
              {/* Информация об отеле */}
              <div className={`flex-1 transition-opacity ${isRefreshing ? 'opacity-70' : ''}`}>
                <div className="flex items-center gap-2 mb-2">
                  <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
                    {currentHotel.name}
                  </h1>
                  {isRefreshing && (
                    <RefreshCw className="w-4 h-4 text-gray-400 animate-spin" />
                  )}
                </div>
                <p className="text-sm sm:text-base text-gray-600 mb-3 flex items-center gap-1.5">
                  <span className="inline-block w-1.5 h-1.5 rounded-full bg-green-500"></span>
                  {currentHotel.address}
                </p>
                {currentHotel.description && (
                  <p className="text-sm text-gray-500 line-clamp-2 leading-relaxed">
                    {currentHotel.description}
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Navigation - Минималистичная (только если выбран отель) */}
      {selectedHotel && (
        <div className="bg-white border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-3 sm:px-4 py-2 sm:py-3">
            <div className="flex gap-1 sm:gap-2 overflow-x-auto scrollbar-hide">
              <button
                onClick={() => setSelectedHotel('')}
                className="px-2 sm:px-3 py-1.5 sm:py-2 rounded-lg text-xs sm:text-sm font-semibold transition-colors flex items-center gap-1 sm:gap-2 whitespace-nowrap shrink-0 bg-white text-gray-700 border border-gray-200 hover:bg-gray-50"
              >
                <ArrowLeft className="w-4 h-4" />
                <span className="hidden sm:inline">Назад</span>
              </button>
              <button
                onClick={() => setViewMode('plan')}
                className={`px-2 sm:px-3 py-1.5 sm:py-2 rounded-lg text-xs sm:text-sm font-semibold transition-colors flex items-center gap-1 sm:gap-2 whitespace-nowrap shrink-0 ${
                  viewMode === 'plan'
                    ? 'bg-gray-900 text-white'
                    : 'bg-white text-gray-700 border border-gray-200 hover:bg-gray-50'
                }`}
              >
                <LayoutGrid className="w-4 h-4" />
                <span className="hidden sm:inline">План</span>
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`px-2 sm:px-3 py-1.5 sm:py-2 rounded-lg text-xs sm:text-sm font-semibold transition-colors flex items-center gap-1 sm:gap-2 whitespace-nowrap shrink-0 ${
                  viewMode === 'list'
                    ? 'bg-gray-900 text-white'
                    : 'bg-white text-gray-700 border border-gray-200 hover:bg-gray-50'
                }`}
              >
                <List className="w-4 h-4" />
                <span className="hidden sm:inline">Список</span>
              </button>
            </div>

            {/* Выбор этажа для плана */}
            {viewMode === 'plan' && currentHotel && (
              <div className="mt-2 sm:mt-3 flex gap-1 sm:gap-2 overflow-x-auto scrollbar-hide">
                <button
                  onClick={() => setSelectedFloor('EG')}
                  className={`px-2 sm:px-3 py-1.5 sm:py-2 rounded-lg text-xs sm:text-sm font-semibold transition-all whitespace-nowrap flex-shrink-0 ${
                    selectedFloor === 'EG'
                      ? 'bg-gray-900 text-white shadow-sm'
                      : 'bg-white text-gray-700 border border-gray-200 hover:bg-gray-50'
                  }`}
                >
                  EG
                </button>
                <button
                  onClick={() => setSelectedFloor('1OG')}
                  className={`px-2 sm:px-3 py-1.5 sm:py-2 rounded-lg text-xs sm:text-sm font-semibold transition-all whitespace-nowrap flex-shrink-0 ${
                    selectedFloor === '1OG'
                      ? 'bg-gray-900 text-white shadow-sm'
                      : 'bg-white text-gray-700 border border-gray-200 hover:bg-gray-50'
                  }`}
                >
                  1OG
                </button>
                <button
                  onClick={() => setSelectedFloor('2OG')}
                  className={`px-2 sm:px-3 py-1.5 sm:py-2 rounded-lg text-xs sm:text-sm font-semibold transition-all whitespace-nowrap flex-shrink-0 ${
                    selectedFloor === '2OG'
                      ? 'bg-gray-900 text-white shadow-sm'
                      : 'bg-white text-gray-700 border border-gray-200 hover:bg-gray-50'
                  }`}
                >
                  2OG
                </button>
              </div>
            )}
          </div>
        </div>
      )}

        {/* Content */}
        <main className="flex-1 px-3 sm:px-4 py-4 sm:py-6 lg:py-8 overflow-y-auto">
        {/* Бронирования и отели - показываем в зависимости от активной вкладки, когда отель не выбран */}
        {!selectedHotel && (() => {
          // Для обычных пользователей используем активную вкладку, для менеджеров показываем все
          const showBookings = currentUser.role === 'guest' ? (activeTab === 'bookings') : true;
          const showHotels = currentUser.role === 'guest' ? (activeTab === 'hotels') : true;
          
          return (
            <div className="space-y-6">
              {/* Мои бронирования - показываем в зависимости от вкладки */}
              {showBookings && (
                <BookingsView 
                  currentUser={currentUser}
                  bookings={bookings}
                  bookingsLoading={bookingsLoading}
                  rooms={rooms}
                  filterBookedBy={filterBookedBy}
                  setFilterBookedBy={setFilterBookedBy}
                  filterRoomNumber={filterRoomNumber}
                  setFilterRoomNumber={setFilterRoomNumber}
                  filterDateFrom={filterDateFrom}
                  setFilterDateFrom={setFilterDateFrom}
                  filterDateTo={filterDateTo}
                  setFilterDateTo={setFilterDateTo}
                  showBookingsFilters={showBookingsFilters}
                  setShowBookingsFilters={setShowBookingsFilters}
                  bookingsSortBy={bookingsSortBy}
                  setBookingsSortBy={setBookingsSortBy}
                  bookingsSortDirection={bookingsSortDirection}
                  setBookingsSortDirection={setBookingsSortDirection}
                  onCancelBooking={async (bookingId: string) => {
                    try {
                      await api.deleteBooking(bookingId);
                      await loadBookings();
                    } catch (error) {
                      console.error('Error canceling booking:', error);
                      alert('Ошибка при отмене бронирования');
                    }
                  }}
                />
              )}

              {/* Карточки отелей для выбора - показываем в зависимости от вкладки */}
              {showHotels && hotels.length > 0 && (
              <div className="space-y-6">
                <div>
                  <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">Выберите отель</h1>
                  <p className="text-gray-600">Выберите отель для просмотра доступных номеров</p>
                </div>
                <div className="grid grid-cols-1 gap-4 sm:gap-6">
                  {hotels.map(hotel => {
                    const minPrice = getHotelMinPrice(hotel.id);
                    const hotelRoomsCount = rooms.filter(r => r.hotelId === hotel.id && !r.isCommon).length;
                    const availableCount = rooms.filter(r => r.hotelId === hotel.id && !r.booking && !r.isCommon).length;
                    
                    return (
                      <div
                        key={hotel.id}
                        onClick={() => setSelectedHotel(hotel.id)}
                        className="bg-white border-2 border-gray-200 rounded-lg overflow-hidden hover:border-gray-300 hover:shadow-lg transition-all cursor-pointer"
                      >
                        <div className="flex flex-col sm:flex-row">
                          {/* Фото отеля */}
                          <div className="w-full sm:w-64 h-48 sm:h-auto flex-shrink-0">
                            {hotel.image ? (
                              <img
                                src={hotel.image}
                                alt={hotel.name}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                                <Building2 className="w-16 h-16 text-gray-400" />
                              </div>
                            )}
                          </div>
                          
                          {/* Информация об отеле */}
                          <div className="flex-1 p-4 sm:p-6 flex flex-col justify-between">
                            <div>
                              <div className="flex justify-between items-start mb-2">
                                <h3 className="text-xl sm:text-2xl font-bold text-gray-900 pr-4">
                                  {hotel.name}
                                </h3>
                                {minPrice > 0 && (
                                  <div className="text-right flex-shrink-0">
                                    <div className="text-lg sm:text-xl font-bold text-gray-900">
                                      От € {minPrice}
                                    </div>
                                    <div className="text-xs text-gray-500">за ночь</div>
                                  </div>
                                )}
                              </div>
                              <p className="text-sm sm:text-base text-gray-600 mb-2">{hotel.address}</p>
                              {hotel.description && (
                                <p className="text-sm text-gray-500 mb-3 line-clamp-2">{hotel.description}</p>
                              )}
                              <div className="flex flex-wrap gap-3 text-xs sm:text-sm text-gray-600">
                                {hotel.floors && (
                                  <div className="flex items-center gap-1">
                                    <Building2 className="w-4 h-4" />
                                    <span>{hotel.floors} {hotel.floors === 1 ? 'этаж' : hotel.floors < 5 ? 'этажа' : 'этажей'}</span>
                                  </div>
                                )}
                                <div className="flex items-center gap-1">
                                  <Bed className="w-4 h-4" />
                                  <span>{hotelRoomsCount} {hotelRoomsCount === 1 ? 'номер' : hotelRoomsCount < 5 ? 'номера' : 'номеров'}</span>
                                </div>
                                {availableCount > 0 && (
                                  <div className="flex items-center gap-1 text-emerald-600">
                                    <span className="font-semibold">{availableCount} свободно</span>
                                  </div>
                                )}
                              </div>
                            </div>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                setSelectedHotel(hotel.id);
                              }}
                              className="mt-4 bg-gray-900 hover:bg-gray-800 text-white px-6 py-2.5 rounded-lg text-sm font-semibold transition-colors w-full sm:w-auto"
                            >
                              Выбрать отель
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
              )}
            </div>
          );
        })()}

        {viewMode === 'plan' && selectedHotel && (
          <div className="space-y-6">
            {/* План этажа */}
            <div>
              <FloorPlan
                rooms={floorRooms}
                floor={selectedFloor}
                onRoomClick={handleRoomClick}
                onRoomUpdate={currentUser.role === 'manager' ? handleRoomUpdate : undefined}
                onRoomCreate={currentUser.role === 'manager' ? handleRoomCreate : undefined}
                onCancelBooking={handleCancelBooking}
                currentUser={currentUser.name}
                isManager={currentUser.role === 'manager'}
                stairs={stairs.filter((s: Stairs) => s.hotelId === selectedHotel)}
                onStairsUpdate={currentUser.role === 'manager' ? handleStairsUpdate : undefined}
                hotelId={selectedHotel}
              />
            </div>

            {/* Список комнат с фильтрами */}
            <div className="bg-white rounded-lg border border-gray-200 p-4 sm:p-6">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 sm:gap-4 mb-4">
                <h2 className="text-lg sm:text-xl font-bold text-gray-900">
                  Комнаты этажа {selectedFloor}
                </h2>
                
                {currentUser.role === 'manager' && (
                  <div className="flex gap-2 w-full sm:w-auto">
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
                    
                    <select
                      value={sortBy}
                      onChange={(e) => setSortBy(e.target.value as 'price' | 'capacity' | 'number')}
                      className="px-3 py-1.5 rounded-lg text-xs sm:text-sm font-semibold border border-gray-200 bg-white text-gray-700 focus:outline-none focus:border-gray-900"
                    >
                      <option value="number">По номеру</option>
                      <option value="price">По цене</option>
                      <option value="capacity">По вместимости</option>
                    </select>
                  </div>
                )}
              </div>

              {/* Панель фильтров */}
              {showFilters && (
                <div className="mb-4 p-3 sm:p-4 bg-gray-50 rounded-lg border border-gray-200">
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-gray-700 mb-1.5">Тип</label>
                      <select
                        value={filterType}
                        onChange={(e) => setFilterType(e.target.value as 'all' | 'FZ' | 'DZ' | 'EZ')}
                        className="w-full px-2 py-1.5 rounded text-xs border border-gray-300 bg-white text-gray-700 focus:outline-none focus:border-gray-900"
                      >
                        <option value="all">Все</option>
                        <option value="FZ">Семейная</option>
                        <option value="DZ">Двухместная</option>
                        <option value="EZ">Одноместная</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-gray-700 mb-1.5">Цена от</label>
                      <input
                        type="number"
                        value={filterPriceMin}
                        onChange={(e) => setFilterPriceMin(Number(e.target.value))}
                        className="w-full px-2 py-1.5 rounded text-xs border border-gray-300 bg-white text-gray-700 focus:outline-none focus:border-gray-900"
                        min="0"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-gray-700 mb-1.5">Цена до</label>
                      <input
                        type="number"
                        value={filterPriceMax}
                        onChange={(e) => setFilterPriceMax(Number(e.target.value))}
                        className="w-full px-2 py-1.5 rounded text-xs border border-gray-300 bg-white text-gray-700 focus:outline-none focus:border-gray-900"
                        min="0"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-gray-700 mb-1.5">Вместимость мин.</label>
                      <input
                        type="number"
                        value={filterCapacity}
                        onChange={(e) => setFilterCapacity(Number(e.target.value))}
                        className="w-full px-2 py-1.5 rounded text-xs border border-gray-300 bg-white text-gray-700 focus:outline-none focus:border-gray-900"
                        min="0"
                      />
                    </div>
                  </div>

                  <div className="mt-3 flex items-center gap-2">
                    <input
                      type="checkbox"
                      id="availableOnly"
                      checked={filterAvailableOnly}
                      onChange={(e) => setFilterAvailableOnly(e.target.checked)}
                      className="w-4 h-4 text-gray-700 border-gray-300 rounded focus:ring-gray-500"
                    />
                    <label htmlFor="availableOnly" className="text-xs sm:text-sm text-gray-700 cursor-pointer font-semibold">
                      Только свободные комнаты
                    </label>
                  </div>
                </div>
              )}

              {/* Список комнат */}
              <div className="space-y-2">
                {filteredAndSortedRooms.filter(r => r.floor === selectedFloor).length === 0 ? (
                  <div className="text-center py-8 text-gray-500 text-sm">
                    Комнаты не найдены
                  </div>
                ) : (
                  filteredAndSortedRooms
                    .filter(r => r.floor === selectedFloor)
                    .map(room => (
                      <div
                        key={room.id}
                        className={`flex items-center justify-between p-3 sm:p-4 rounded-lg border transition-colors ${
                          room.booking
                            ? room.booking.bookedBy === currentUser.name
                              ? 'bg-emerald-50 border-emerald-200'
                              : 'bg-gray-50 border-gray-200'
                            : 'bg-white border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 sm:gap-3">
                            <div className="text-lg sm:text-xl font-bold text-gray-900">{room.number}</div>
                            {room.name && (
                              <div className="text-sm font-semibold text-gray-700 truncate">{room.name}</div>
                            )}
                            <div className="text-xs text-gray-500">
                              {room.type === 'FZ' ? 'Семейная' : room.type === 'DZ' ? 'Двухместная' : 'Одноместная'}
                            </div>
                          </div>
                          <div className="flex items-center gap-3 sm:gap-4 mt-1.5 text-xs sm:text-sm text-gray-600">
                            <span className="flex items-center gap-1">
                              <Users className="w-3 h-3" />
                              {room.capacity}
                            </span>
                            {!room.isCommon && room.price > 0 && (
                              <span className="font-semibold text-gray-700">{room.price}€/ночь</span>
                            )}
                          </div>
                          {room.booking && (
                            <div className="mt-1.5 text-xs text-gray-500">
                              {room.booking.bookedBy} · {new Date(room.booking.checkIn).toLocaleDateString()} - {new Date(room.booking.checkOut).toLocaleDateString()}
                            </div>
                          )}
                        </div>

                        <div className="flex items-center gap-2 ml-4">
                          {!room.booking && !room.isCommon && (
                            <Link
                              href={`/booking/${room.id}`}
                              prefetch={false}
                              className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs sm:text-sm font-semibold whitespace-nowrap"
                            >
                              Забронировать
                            </Link>
                          )}
                          {room.booking && (room.booking.bookedBy === currentUser.name || currentUser.role === 'manager') && (
                            <button
                              onClick={() => handleCancelBooking(room.id)}
                              className="px-3 py-1.5 bg-pink-900 hover:bg-pink-950 text-white rounded-lg text-xs sm:text-sm font-semibold whitespace-nowrap"
                            >
                              Отменить бронь
                            </button>
                          )}
                          {currentUser.role === 'manager' && (
                            <>
                              <button
                                onClick={() => {
                                  setEditingRoom(room);
                                  setShowRoomModal(true);
                                }}
                                className="p-1.5 text-gray-600 hover:text-gray-900"
                              >
                                <Edit className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => handleDeleteRoom(room.id)}
                                className="p-1.5 text-red-500 hover:text-red-700"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </>
                          )}
                        </div>
                      </div>
                    ))
                )}
              </div>
            </div>

            {/* Таблица всех комнат отеля - показывается только в режиме плана */}
            {viewMode === 'plan' && (
            <div className="bg-white rounded-lg border border-gray-200 p-4 sm:p-6">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 sm:gap-4 mb-4">
                <div>
                  {currentHotel && (
                    <h2 className="text-lg sm:text-xl font-bold text-gray-900 mb-1">{currentHotel.name}</h2>
                  )}
                  <p className="text-sm text-gray-600">
                    {currentUser.role === 'guest' 
                      ? 'Доступные комнаты' 
                      : filterAvailableOnly ? 'Свободные комнаты' : 'Все комнаты отеля'}
                  </p>
                </div>
                
                <div className="flex gap-2 w-full sm:w-auto flex-wrap">
                  {currentUser.role === 'manager' && (
                    <>
                      <button
                        onClick={() => {
                          setEditingRoom(null);
                          setShowRoomModal(true);
                        }}
                        className="px-3 py-1.5 bg-gray-900 hover:bg-gray-800 text-white rounded-lg text-xs sm:text-sm font-semibold flex items-center gap-1.5"
                      >
                        <Plus className="w-3 h-3 sm:w-4 sm:h-4" />
                        <span className="hidden sm:inline">Добавить</span>
                      </button>
                      
                      {hasActiveFilters && (
                        <button
                          onClick={resetFilters}
                          className="px-3 py-1.5 rounded-lg text-xs sm:text-sm font-semibold transition-colors flex items-center gap-1.5 bg-white text-gray-700 border border-gray-200 hover:bg-gray-50"
                          title="Сбросить фильтры"
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
                    </>
                  )}
                </div>
              </div>

              {/* Панель фильтров (только для менеджера) */}
              {showFilters && currentUser.role === 'manager' && (
                <div className="mb-4 p-3 sm:p-4 bg-gray-50 rounded-lg border border-gray-200">
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-gray-700 mb-1.5">Тип</label>
                      <select
                        value={filterType}
                        onChange={(e) => setFilterType(e.target.value as 'all' | 'FZ' | 'DZ' | 'EZ')}
                        className="w-full px-2 py-1.5 rounded text-xs border border-gray-300 bg-white text-gray-700 focus:outline-none focus:border-gray-900"
                      >
                        <option value="all">Все</option>
                        <option value="FZ">Семейная</option>
                        <option value="DZ">Двухместная</option>
                        <option value="EZ">Одноместная</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-gray-700 mb-1.5">Цена от</label>
                      <input
                        type="number"
                        value={filterPriceMin}
                        onChange={(e) => setFilterPriceMin(Number(e.target.value))}
                        className="w-full px-2 py-1.5 rounded text-xs border border-gray-300 bg-white text-gray-700 focus:outline-none focus:border-gray-900"
                        min="0"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-gray-700 mb-1.5">Цена до</label>
                      <input
                        type="number"
                        value={filterPriceMax}
                        onChange={(e) => setFilterPriceMax(Number(e.target.value))}
                        className="w-full px-2 py-1.5 rounded text-xs border border-gray-300 bg-white text-gray-700 focus:outline-none focus:border-gray-900"
                        min="0"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-gray-700 mb-1.5">Вместимость мин.</label>
                      <input
                        type="number"
                        value={filterCapacity}
                        onChange={(e) => setFilterCapacity(Number(e.target.value))}
                        className="w-full px-2 py-1.5 rounded text-xs border border-gray-300 bg-white text-gray-700 focus:outline-none focus:border-gray-900"
                        min="0"
                      />
                    </div>
                  </div>

                  <div className="mt-3 flex items-center gap-2">
                    <input
                      type="checkbox"
                      id="availableOnlyRooms"
                      checked={filterAvailableOnly}
                      onChange={(e) => setFilterAvailableOnly(e.target.checked)}
                      className="w-4 h-4 text-gray-700 border-gray-300 rounded focus:ring-gray-500"
                    />
                    <label htmlFor="availableOnlyRooms" className="text-xs sm:text-sm text-gray-700 cursor-pointer font-semibold">
                      Только свободные комнаты
                    </label>
                  </div>
                </div>
              )}

              {/* Таблица комнат */}
              <div className="overflow-x-auto">
                {filteredAndSortedRooms.length === 0 ? (
                  <div className="text-center py-8 text-gray-500 text-sm">
                    Комнаты не найдены
                    {currentUser.role === 'manager' && (
                      <button
                        onClick={() => {
                          setEditingRoom(null);
                          setShowRoomModal(true);
                        }}
                        className="block mt-4 mx-auto bg-gray-900 hover:bg-gray-800 text-white px-4 py-2 rounded-lg text-sm font-semibold"
                      >
                        Добавить первую комнату
                      </button>
                    )}
                  </div>
                ) : (
                  <table className="w-full border-collapse">
                    <thead>
                      <tr className="border-b border-gray-200 bg-gray-50">
                        <th 
                          className="px-3 py-2 text-left text-xs font-semibold text-gray-700 cursor-pointer hover:bg-gray-100 transition-colors"
                          onClick={() => handleSort('number')}
                        >
                          <div className="flex items-center gap-1">
                            Номер
                            {sortBy === 'number' && (
                              sortDirection === 'asc' ? <ArrowUp className="w-3 h-3" /> : <ArrowDown className="w-3 h-3" />
                            )}
                            {sortBy !== 'number' && <ArrowUpDown className="w-3 h-3 text-gray-400" />}
                          </div>
                        </th>
                        <th 
                          className="px-3 py-2 text-left text-xs font-semibold text-gray-700 cursor-pointer hover:bg-gray-100 transition-colors"
                          onClick={() => handleSort('floor')}
                        >
                          <div className="flex items-center gap-1">
                            Этаж
                            {sortBy === 'floor' && (
                              sortDirection === 'asc' ? <ArrowUp className="w-3 h-3" /> : <ArrowDown className="w-3 h-3" />
                            )}
                            {sortBy !== 'floor' && <ArrowUpDown className="w-3 h-3 text-gray-400" />}
                          </div>
                        </th>
                        <th 
                          className="px-3 py-2 text-left text-xs font-semibold text-gray-700 cursor-pointer hover:bg-gray-100 transition-colors"
                          onClick={() => handleSort('type')}
                        >
                          <div className="flex items-center gap-1">
                            Тип
                            {sortBy === 'type' && (
                              sortDirection === 'asc' ? <ArrowUp className="w-3 h-3" /> : <ArrowDown className="w-3 h-3" />
                            )}
                            {sortBy !== 'type' && <ArrowUpDown className="w-3 h-3 text-gray-400" />}
                          </div>
                        </th>
                        <th className="px-3 py-2 text-left text-xs font-semibold text-gray-700">
                          <div className="flex items-center gap-1">
                            <Users className="w-3 h-3" />
                            Вместимость
                          </div>
                        </th>
                        <th 
                          className="px-3 py-2 text-left text-xs font-semibold text-gray-700 cursor-pointer hover:bg-gray-100 transition-colors"
                          onClick={() => handleSort('price')}
                        >
                          <div className="flex items-center gap-1">
                            Цена
                            {sortBy === 'price' && (
                              sortDirection === 'asc' ? <ArrowUp className="w-3 h-3" /> : <ArrowDown className="w-3 h-3" />
                            )}
                            {sortBy !== 'price' && <ArrowUpDown className="w-3 h-3 text-gray-400" />}
                          </div>
                        </th>
                        <th 
                          className="px-3 py-2 text-left text-xs font-semibold text-gray-700 cursor-pointer hover:bg-gray-100 transition-colors"
                          onClick={() => handleSort('status')}
                        >
                          <div className="flex items-center gap-1">
                            Статус
                            {sortBy === 'status' && (
                              sortDirection === 'asc' ? <ArrowUp className="w-3 h-3" /> : <ArrowDown className="w-3 h-3" />
                            )}
                            {sortBy !== 'status' && <ArrowUpDown className="w-3 h-3 text-gray-400" />}
                          </div>
                        </th>
                        {(currentUser.role === 'manager' || filteredAndSortedRooms.some(r => !r.isCommon && (!r.booking || r.booking.bookedBy === currentUser.name))) && (
                          <th className="px-3 py-2 text-left text-xs font-semibold text-gray-700">Действия</th>
                        )}
                      </tr>
                    </thead>
                    <tbody>
                      {filteredAndSortedRooms.map(room => (
                        <tr
                          key={room.id}
                          className={`border-b border-gray-100 transition-colors ${
                            room.booking
                              ? room.booking.bookedBy === currentUser.name
                                ? 'bg-blue-50/50 hover:bg-blue-50'
                                : 'bg-gray-50/50 hover:bg-gray-50'
                              : 'hover:bg-gray-50'
                          }`}
                        >
                          <td className="px-3 py-2.5">
                            <div className="font-semibold text-gray-900">{room.number}</div>
                            {room.name && (
                              <div className="text-xs text-gray-600 mt-0.5">{room.name}</div>
                            )}
                          </td>
                          <td className="px-3 py-2.5 text-sm text-gray-700">{room.floor}</td>
                          <td className="px-3 py-2.5 text-sm text-gray-700">
                            {room.type === 'FZ' ? 'Семейная' : room.type === 'DZ' ? 'Двухместная' : room.type === 'EZ' ? 'Одноместная' : 'Общее'}
                          </td>
                          <td className="px-3 py-2.5 text-sm text-gray-700">{room.capacity}</td>
                          <td className="px-3 py-2.5 text-sm font-semibold text-gray-700">
                            {!room.isCommon && room.price > 0 ? `${room.price}€` : '-'}
                          </td>
                          <td className="px-3 py-2.5">
                            {room.booking ? (
                              <div className="text-xs">
                                {currentUser.role === 'manager' && (
                                  <div className="font-semibold text-gray-700">{room.booking.bookedBy}</div>
                                )}
                                <div className="text-gray-500">
                                  {new Date(room.booking.checkIn).toLocaleDateString('ru-RU')} - {new Date(room.booking.checkOut).toLocaleDateString('ru-RU')}
                                </div>
                              </div>
                            ) : (
                              <span className="text-xs text-green-600 font-semibold">Свободна</span>
                            )}
                          </td>
                          {(currentUser.role === 'manager' || (!room.isCommon && (!room.booking || room.booking.bookedBy === currentUser.name))) && (
                            <td className="px-3 py-2.5">
                              <div className="flex items-center gap-2">
                                {!room.booking && !room.isCommon && (
                                  <Link
                                    href={`/booking/${room.id}`}
                                    prefetch={false}
                                    className="px-2 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded text-xs font-semibold whitespace-nowrap"
                                  >
                                    Забронировать
                                  </Link>
                                )}
                                {room.booking && (room.booking.bookedBy === currentUser.name || currentUser.role === 'manager') && (
                                  <button
                                    onClick={() => handleCancelBooking(room.id)}
                                    className="px-2 py-1 bg-pink-900 hover:bg-pink-950 text-white rounded text-xs font-semibold whitespace-nowrap"
                                    title="Отменить бронирование"
                                  >
                                    Отменить
                                  </button>
                                )}
                                {currentUser.role === 'manager' && (
                                  <>
                                    <button
                                      onClick={() => {
                                        setEditingRoom(room);
                                        setShowRoomModal(true);
                                      }}
                                      className="p-1 text-gray-600 hover:text-gray-900"
                                      title="Редактировать"
                                    >
                                      <Edit className="w-3.5 h-3.5" />
                                    </button>
                                    <button
                                      onClick={() => handleDeleteRoom(room.id)}
                                      className="p-1 text-red-500 hover:text-red-700"
                                      title="Удалить"
                                    >
                                      <Trash2 className="w-3.5 h-3.5" />
                                    </button>
                                  </>
                                )}
                              </div>
                            </td>
                          )}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>
            </div>
            )}
          </div>
        )}

        {/* Режим списка - показываем только таблицу всех комнат */}
        {viewMode === 'list' && selectedHotel && (
          <div className="space-y-6">
            {/* Таблица всех комнат отеля */}
            <div className="bg-white rounded-lg border border-gray-200 p-4 sm:p-6">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 sm:gap-4 mb-4">
                <div>
                  {currentHotel && (
                    <h2 className="text-lg sm:text-xl font-bold text-gray-900 mb-1">{currentHotel.name}</h2>
                  )}
                  <p className="text-sm text-gray-600">
                    {currentUser.role === 'guest' 
                      ? 'Доступные комнаты' 
                      : filterAvailableOnly ? 'Свободные комнаты' : 'Все комнаты отеля'}
                  </p>
                </div>
                
                <div className="flex gap-2 w-full sm:w-auto flex-wrap">
                  {currentUser.role === 'manager' && (
                    <>
                      <button
                        onClick={() => {
                          setEditingRoom(null);
                          setShowRoomModal(true);
                        }}
                        className="px-3 py-1.5 bg-gray-900 hover:bg-gray-800 text-white rounded-lg text-xs sm:text-sm font-semibold flex items-center gap-1.5"
                      >
                        <Plus className="w-3 h-3 sm:w-4 sm:h-4" />
                        <span className="hidden sm:inline">Добавить</span>
                      </button>
                      
                      {hasActiveFilters && (
                        <button
                          onClick={resetFilters}
                          className="px-3 py-1.5 rounded-lg text-xs sm:text-sm font-semibold transition-colors flex items-center gap-1.5 bg-white text-gray-700 border border-gray-200 hover:bg-gray-50"
                          title="Сбросить фильтры"
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
                    </>
                  )}
                </div>
              </div>

              {/* Панель фильтров (только для менеджера) */}
              {showFilters && currentUser.role === 'manager' && (
                <div className="mb-4 p-3 sm:p-4 bg-gray-50 rounded-lg border border-gray-200">
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-gray-700 mb-1.5">Тип</label>
                      <select
                        value={filterType}
                        onChange={(e) => setFilterType(e.target.value as 'all' | 'FZ' | 'DZ' | 'EZ')}
                        className="w-full px-2 py-1.5 rounded text-xs border border-gray-300 bg-white text-gray-700 focus:outline-none focus:border-gray-900"
                      >
                        <option value="all">Все</option>
                        <option value="FZ">Семейная</option>
                        <option value="DZ">Двухместная</option>
                        <option value="EZ">Одноместная</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-gray-700 mb-1.5">Цена от</label>
                      <input
                        type="number"
                        value={filterPriceMin}
                        onChange={(e) => setFilterPriceMin(Number(e.target.value))}
                        className="w-full px-2 py-1.5 rounded text-xs border border-gray-300 bg-white text-gray-700 focus:outline-none focus:border-gray-900"
                        min="0"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-gray-700 mb-1.5">Цена до</label>
                      <input
                        type="number"
                        value={filterPriceMax}
                        onChange={(e) => setFilterPriceMax(Number(e.target.value))}
                        className="w-full px-2 py-1.5 rounded text-xs border border-gray-300 bg-white text-gray-700 focus:outline-none focus:border-gray-900"
                        min="0"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-gray-700 mb-1.5">Вместимость мин.</label>
                      <input
                        type="number"
                        value={filterCapacity}
                        onChange={(e) => setFilterCapacity(Number(e.target.value))}
                        className="w-full px-2 py-1.5 rounded text-xs border border-gray-300 bg-white text-gray-700 focus:outline-none focus:border-gray-900"
                        min="0"
                      />
                    </div>
                  </div>

                  <div className="mt-3 flex items-center gap-2">
                    <input
                      type="checkbox"
                      id="availableOnlyRoomsList"
                      checked={filterAvailableOnly}
                      onChange={(e) => setFilterAvailableOnly(e.target.checked)}
                      className="w-4 h-4 text-gray-700 border-gray-300 rounded focus:ring-gray-500"
                    />
                    <label htmlFor="availableOnlyRoomsList" className="text-xs sm:text-sm text-gray-700 cursor-pointer font-semibold">
                      Только свободные комнаты
                    </label>
                  </div>
                </div>
              )}

              {/* Таблица комнат */}
              <div className="overflow-x-auto">
                {filteredAndSortedRooms.length === 0 ? (
                  <div className="text-center py-8 text-gray-500 text-sm">
                    Комнаты не найдены
                    {currentUser.role === 'manager' && (
                      <button
                        onClick={() => {
                          setEditingRoom(null);
                          setShowRoomModal(true);
                        }}
                        className="block mt-4 mx-auto bg-gray-900 hover:bg-gray-800 text-white px-4 py-2 rounded-lg text-sm font-semibold"
                      >
                        Добавить первую комнату
                      </button>
                    )}
                  </div>
                ) : (
                  <table className="w-full border-collapse">
                    <thead>
                      <tr className="border-b border-gray-200 bg-gray-50">
                        <th 
                          className="px-3 py-2 text-left text-xs font-semibold text-gray-700 cursor-pointer hover:bg-gray-100 transition-colors"
                          onClick={() => handleSort('number')}
                        >
                          <div className="flex items-center gap-1">
                            Номер
                            {sortBy === 'number' && (
                              sortDirection === 'asc' ? <ArrowUp className="w-3 h-3" /> : <ArrowDown className="w-3 h-3" />
                            )}
                            {sortBy !== 'number' && <ArrowUpDown className="w-3 h-3 text-gray-400" />}
                          </div>
                        </th>
                        <th 
                          className="px-3 py-2 text-left text-xs font-semibold text-gray-700 cursor-pointer hover:bg-gray-100 transition-colors"
                          onClick={() => handleSort('floor')}
                        >
                          <div className="flex items-center gap-1">
                            Этаж
                            {sortBy === 'floor' && (
                              sortDirection === 'asc' ? <ArrowUp className="w-3 h-3" /> : <ArrowDown className="w-3 h-3" />
                            )}
                            {sortBy !== 'floor' && <ArrowUpDown className="w-3 h-3 text-gray-400" />}
                          </div>
                        </th>
                        <th 
                          className="px-3 py-2 text-left text-xs font-semibold text-gray-700 cursor-pointer hover:bg-gray-100 transition-colors"
                          onClick={() => handleSort('type')}
                        >
                          <div className="flex items-center gap-1">
                            Тип
                            {sortBy === 'type' && (
                              sortDirection === 'asc' ? <ArrowUp className="w-3 h-3" /> : <ArrowDown className="w-3 h-3" />
                            )}
                            {sortBy !== 'type' && <ArrowUpDown className="w-3 h-3 text-gray-400" />}
                          </div>
                        </th>
                        <th className="px-3 py-2 text-left text-xs font-semibold text-gray-700">
                          <div className="flex items-center gap-1">
                            <Users className="w-3 h-3" />
                            Вместимость
                          </div>
                        </th>
                        <th 
                          className="px-3 py-2 text-left text-xs font-semibold text-gray-700 cursor-pointer hover:bg-gray-100 transition-colors"
                          onClick={() => handleSort('price')}
                        >
                          <div className="flex items-center gap-1">
                            Цена
                            {sortBy === 'price' && (
                              sortDirection === 'asc' ? <ArrowUp className="w-3 h-3" /> : <ArrowDown className="w-3 h-3" />
                            )}
                            {sortBy !== 'price' && <ArrowUpDown className="w-3 h-3 text-gray-400" />}
                          </div>
                        </th>
                        <th 
                          className="px-3 py-2 text-left text-xs font-semibold text-gray-700 cursor-pointer hover:bg-gray-100 transition-colors"
                          onClick={() => handleSort('status')}
                        >
                          <div className="flex items-center gap-1">
                            Статус
                            {sortBy === 'status' && (
                              sortDirection === 'asc' ? <ArrowUp className="w-3 h-3" /> : <ArrowDown className="w-3 h-3" />
                            )}
                            {sortBy !== 'status' && <ArrowUpDown className="w-3 h-3 text-gray-400" />}
                          </div>
                        </th>
                        {(currentUser.role === 'manager' || filteredAndSortedRooms.some(r => !r.isCommon && (!r.booking || r.booking.bookedBy === currentUser.name))) && (
                          <th className="px-3 py-2 text-left text-xs font-semibold text-gray-700">Действия</th>
                        )}
                      </tr>
                    </thead>
                    <tbody>
                      {filteredAndSortedRooms.map(room => (
                        <tr
                          key={room.id}
                          className={`border-b border-gray-100 transition-colors ${
                            room.booking
                              ? room.booking.bookedBy === currentUser.name
                                ? 'bg-blue-50/50 hover:bg-blue-50'
                                : 'bg-gray-50/50 hover:bg-gray-50'
                              : 'hover:bg-gray-50'
                          }`}
                        >
                          <td className="px-3 py-2.5">
                            <div className="font-semibold text-gray-900">{room.number}</div>
                            {room.name && (
                              <div className="text-xs text-gray-600 mt-0.5">{room.name}</div>
                            )}
                          </td>
                          <td className="px-3 py-2.5 text-sm text-gray-700">{room.floor}</td>
                          <td className="px-3 py-2.5 text-sm text-gray-700">
                            {room.type === 'FZ' ? 'Семейная' : room.type === 'DZ' ? 'Двухместная' : room.type === 'EZ' ? 'Одноместная' : 'Общее'}
                          </td>
                          <td className="px-3 py-2.5 text-sm text-gray-700">{room.capacity}</td>
                          <td className="px-3 py-2.5 text-sm font-semibold text-gray-700">
                            {!room.isCommon && room.price > 0 ? `${room.price}€` : '-'}
                          </td>
                          <td className="px-3 py-2.5">
                            {room.booking ? (
                              <div className="text-xs">
                                {currentUser.role === 'manager' && (
                                  <div className="font-semibold text-gray-700">{room.booking.bookedBy}</div>
                                )}
                                <div className="text-gray-500">
                                  {new Date(room.booking.checkIn).toLocaleDateString('ru-RU')} - {new Date(room.booking.checkOut).toLocaleDateString('ru-RU')}
                                </div>
                              </div>
                            ) : (
                              <span className="text-xs text-green-600 font-semibold">Свободна</span>
                            )}
                          </td>
                          {(currentUser.role === 'manager' || (!room.isCommon && (!room.booking || room.booking.bookedBy === currentUser.name))) && (
                            <td className="px-3 py-2.5">
                              <div className="flex items-center gap-2">
                                {!room.booking && !room.isCommon && (
                                  <Link
                                    href={`/booking/${room.id}`}
                                    prefetch={false}
                                    className="px-2 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded text-xs font-semibold whitespace-nowrap"
                                  >
                                    Забронировать
                                  </Link>
                                )}
                                {room.booking && (room.booking.bookedBy === currentUser.name || currentUser.role === 'manager') && (
                                  <button
                                    onClick={() => handleCancelBooking(room.id)}
                                    className="px-2 py-1 bg-pink-900 hover:bg-pink-950 text-white rounded text-xs font-semibold whitespace-nowrap"
                                    title="Отменить бронирование"
                                  >
                                    Отменить
                                  </button>
                                )}
                                {currentUser.role === 'manager' && (
                                  <>
                                    <button
                                      onClick={() => {
                                        setEditingRoom(room);
                                        setShowRoomModal(true);
                                      }}
                                      className="p-1 text-gray-600 hover:text-gray-900"
                                      title="Редактировать"
                                    >
                                      <Edit className="w-3.5 h-3.5" />
                                    </button>
                                    <button
                                      onClick={() => handleDeleteRoom(room.id)}
                                      className="p-1 text-red-500 hover:text-red-700"
                                      title="Удалить"
                                    >
                                      <Trash2 className="w-3.5 h-3.5" />
                                    </button>
                                  </>
                                )}
                              </div>
                            </td>
                          )}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>
            </div>
          </div>
        )}



        {/* Бронирования вынесены в отдельную страницу /bookings */}
        </main>

        {/* Room Modal */}
        {showRoomModal && (
          <RoomModal
            room={editingRoom}
            hotels={hotels}
            onSave={handleSaveRoom}
            onClose={() => {
              setShowRoomModal(false);
              setEditingRoom(null);
            }}
          />
        )}
      </div>

      {/* Bottom Navigation Menu для мобильных устройств (только для гостей) */}
      {currentUser.role === 'guest' && (
        <nav className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-[100] shadow-lg" style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}>
          <div className="flex items-center justify-around h-16">
            {/* Отели - список всех отелей */}
            <button
              onClick={() => {
                setSelectedHotel(''); // Сбрасываем выбор отеля
                setActiveTab('hotels'); // Переключаемся на вкладку отелей
              }}
              className={`flex flex-col items-center justify-center gap-1 flex-1 h-full transition-colors ${
                !selectedHotel && activeTab === 'hotels'
                  ? 'text-gray-900 bg-gray-50'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <Building2 className={`w-5 h-5 ${!selectedHotel && activeTab === 'hotels' ? 'text-gray-900' : 'text-gray-500'}`} />
              <span className="text-xs font-semibold">Отели</span>
            </button>

            {/* Бронирования - показываем на главной странице */}
            <button
              onClick={() => {
                setSelectedHotel(''); // Сбрасываем выбор отеля
                setActiveTab('bookings'); // Переключаемся на вкладку бронирований
              }}
              className={`flex flex-col items-center justify-center gap-1 flex-1 h-full transition-colors relative ${
                !selectedHotel && activeTab === 'bookings'
                  ? 'text-gray-900 bg-gray-50'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <div className="relative">
                <BookOpen className={`w-5 h-5 ${!selectedHotel && activeTab === 'bookings' ? 'text-gray-900' : 'text-gray-500'}`} />
                {bookingStats.unconfirmed > 0 && (
                  <span className="absolute -top-1 -right-1 bg-pink-950 text-white text-[10px] font-bold rounded-full w-4 h-4 flex items-center justify-center">
                    {bookingStats.unconfirmed > 9 ? '9+' : bookingStats.unconfirmed}
                  </span>
                )}
              </div>
              <span className="text-xs font-semibold">Бронирования</span>
            </button>

            {/* Выйти */}
            <button
              onClick={handleLogout}
              className="flex flex-col items-center justify-center gap-1 flex-1 h-full transition-colors text-gray-600 hover:text-gray-900"
            >
              <LogOut className="w-5 h-5 text-gray-500" />
              <span className="text-xs font-semibold">Выйти</span>
            </button>
          </div>
        </nav>
      )}

      {/* Форма обратной связи */}
      {showFeedbackForm && currentUser && (
        <FeedbackForm
          currentUser={currentUser}
          onClose={() => setShowFeedbackForm(false)}
        />
      )}
    </div>
  );
}

// Компоненты модальных окон
interface RoomModalProps {
  room: Room | null;
  hotels: Hotel[];
  onSave: (roomData: Partial<Room> & { number: string; hotelId: string; type: Room['type']; floor: Room['floor'] }) => void;
  onClose: () => void;
}

function RoomModal({ room, hotels, onSave, onClose }: RoomModalProps) {
  const [formData, setFormData] = useState({
    number: room?.number || '',
    name: room?.name || '',
    type: room?.type || 'DZ',
    capacity: room?.capacity || '2 чел.',
    maxCapacity: room?.maxCapacity || 2,
    beds: room?.beds?.join(', ') || '',
    floor: room?.floor || 'EG',
    price: room?.price || 0,
    hotelId: room?.hotelId || hotels[0]?.id || '',
    description: room?.description || '',
    isCommon: room?.isCommon || false,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const bedsArray = formData.beds.split(',').map((b: string) => b.trim()).filter((b: string) => b);
    
    onSave({
      ...formData,
      beds: bedsArray,
      position: room?.position || { x: 0, y: 0 },
      width: room?.width || 120,
      height: room?.height || 100,
    });
  };

  return (
    <div className="fixed inset-0 bg-transparent flex items-center justify-center z-50 p-3 sm:p-4">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-4 sm:p-6">
          <h2 className="text-xl sm:text-2xl font-bold mb-3 sm:mb-4">
            {room ? 'Редактировать комнату' : 'Создать комнату'}
          </h2>
          <form onSubmit={handleSubmit} className="space-y-3 sm:space-y-4">
            <div className="grid sm:grid-cols-2 gap-3 sm:gap-4">
              <div>
                <label className="block text-sm font-semibold mb-2">Номер комнаты *</label>
                <input
                  type="text"
                  value={formData.number}
                  onChange={(e) => setFormData({ ...formData, number: e.target.value })}
                  className="w-full px-3 py-2 border-2 border-gray-300 rounded-lg focus:border-gray-700 focus:outline-none"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-semibold mb-2">Отель *</label>
                <select
                  value={formData.hotelId}
                  onChange={(e) => setFormData({ ...formData, hotelId: e.target.value })}
                  className="w-full px-3 py-2 border-2 border-gray-300 rounded-lg focus:border-gray-700 focus:outline-none"
                  required
                >
                  {hotels.map((h: Hotel) => (
                    <option key={h.id} value={h.id}>{h.name}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold mb-2">Тип комнаты *</label>
                <select
                  value={formData.type}
                  onChange={(e) => setFormData({ ...formData, type: e.target.value as Room['type'] })}
                  className="w-full px-3 py-2 border-2 border-gray-300 rounded-lg focus:border-gray-700 focus:outline-none"
                >
                  <option value="FZ">Семейная (FZ)</option>
                  <option value="DZ">Двухместная (DZ)</option>
                  <option value="EZ">Одноместная (EZ)</option>
                  <option value="COMMON">Общее помещение</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-semibold mb-2">Этаж *</label>
                <select
                  value={formData.floor}
                  onChange={(e) => setFormData({ ...formData, floor: e.target.value as Room['floor'] })}
                  className="w-full px-3 py-2 border-2 border-gray-300 rounded-lg focus:border-gray-700 focus:outline-none"
                >
                  <option value="EG">Первый этаж (EG)</option>
                  <option value="1OG">Второй этаж (1OG)</option>
                  <option value="2OG">Третий этаж (2OG)</option>
                </select>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold mb-2">Вместимость</label>
                <input
                  type="text"
                  value={formData.capacity}
                  onChange={(e) => setFormData({ ...formData, capacity: e.target.value })}
                  className="w-full px-3 py-2 border-2 border-gray-300 rounded-lg focus:border-gray-700 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold mb-2">Максимальная вместимость</label>
                <input
                  type="number"
                  value={formData.maxCapacity}
                  onChange={(e) => setFormData({ ...formData, maxCapacity: parseInt(e.target.value) || 1 })}
                  min="1"
                  className="w-full px-3 py-2 border-2 border-gray-300 rounded-lg focus:border-gray-700 focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold mb-2">Кровати (через запятую)</label>
              <input
                type="text"
                value={formData.beds}
                onChange={(e) => setFormData({ ...formData, beds: e.target.value })}
                placeholder="1-DB, 1-HB"
                className="w-full px-3 py-2 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold mb-2">Цена за ночь (€)</label>
              <input
                type="number"
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: parseInt(e.target.value) || 0 })}
                min="0"
                className="w-full px-3 py-2 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none"
              />
            </div>

            <div className="flex gap-2 sm:gap-3">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-700 py-2 sm:py-3 rounded-lg text-sm sm:text-base font-semibold"
              >
                Отмена
              </button>
              <button
                type="submit"
                className="flex-1 bg-gray-700 hover:bg-gray-800 text-white py-2 sm:py-3 rounded-lg text-sm sm:text-base font-semibold"
              >
                Сохранить
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

interface HotelModalProps {
  hotel: Hotel | null;
  onSave: (hotelData: Partial<Hotel> & { name: string; address: string }) => void;
  onClose: () => void;
}

function HotelModal({ hotel, onSave, onClose }: HotelModalProps) {
  const [formData, setFormData] = useState({
    name: hotel?.name || '',
    address: hotel?.address || '',
    description: hotel?.description || '',
    floors: hotel?.floors || 3,
    image: hotel?.image || '',
  });
  const [imagePreview, setImagePreview] = useState<string | null>(hotel?.image || null);
  const [uploading, setUploading] = useState(false);

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Проверка типа файла
    if (!file.type.startsWith('image/')) {
      alert('Пожалуйста, выберите изображение');
      return;
    }

    // Проверка размера (5MB)
    if (file.size > 5 * 1024 * 1024) {
      alert('Размер файла должен быть меньше 5MB');
      return;
    }

    setUploading(true);
    try {
      const uploadFormData = new FormData();
      uploadFormData.append('file', file);

      const response = await fetch('/api/hotels/upload', {
        method: 'POST',
        body: uploadFormData,
      });

      if (!response.ok) {
        throw new Error('Ошибка при загрузке изображения');
      }

      const data = await response.json();
      setFormData({ ...formData, image: data.path });
      setImagePreview(data.path);
    } catch (error) {
      console.error('Upload error:', error);
      alert('Ошибка при загрузке изображения');
    } finally {
      setUploading(false);
    }
  };

  const handleRemoveImage = () => {
    setFormData({ ...formData, image: '' });
    setImagePreview(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <div className="fixed inset-0 bg-transparent flex items-center justify-center z-50 p-3 sm:p-4">
      <div className="bg-white rounded-lg max-w-md w-full max-h-[90vh] overflow-y-auto">
        <div className="p-4 sm:p-6">
          <h2 className="text-xl sm:text-2xl font-bold mb-3 sm:mb-4">
            {hotel ? 'Редактировать отель' : 'Создать отель'}
          </h2>
          <form onSubmit={handleSubmit} className="space-y-3 sm:space-y-4">
            <div>
              <label className="block text-sm font-semibold mb-2">Название *</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-3 py-2 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-semibold mb-2">Адрес *</label>
              <input
                type="text"
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                className="w-full px-3 py-2 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-semibold mb-2">Описание</label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows={3}
                className="w-full px-3 py-2 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold mb-2">
                Количество этажей <span className="text-red-500">*</span>
              </label>
              <select
                value={formData.floors}
                onChange={(e) => setFormData({ ...formData, floors: parseInt(e.target.value) || 3 })}
                className="w-full px-3 py-2 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none"
                required
              >
                <option value={1}>1 этаж (EG)</option>
                <option value={2}>2 этажа (EG, 1OG)</option>
                <option value={3}>3 этажа (EG, 1OG, 2OG)</option>
              </select>
              <p className="text-xs text-gray-500 mt-1">
                Выберите количество этажей в отеле. Это определит доступные этажи для размещения комнат.
              </p>
            </div>
            <div>
              <label className="block text-sm font-semibold mb-2">Фото отеля</label>
              {imagePreview && (
                <div className="mb-3 relative">
                  <img
                    src={imagePreview}
                    alt="Preview"
                    className="w-full h-48 object-cover rounded-lg border-2 border-gray-300"
                  />
                  <button
                    type="button"
                    onClick={handleRemoveImage}
                    className="absolute top-2 right-2 bg-pink-900 hover:bg-pink-950 text-white rounded-full p-1.5"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              )}
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                disabled={uploading}
                className="w-full px-3 py-2 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none disabled:opacity-50"
              />
              {uploading && (
                <p className="text-xs text-gray-500 mt-1">Загрузка изображения...</p>
              )}
              <p className="text-xs text-gray-500 mt-1">
                Максимальный размер файла: 5MB. Поддерживаемые форматы: JPG, PNG, GIF, WebP.
              </p>
            </div>
            <div className="flex gap-2 sm:gap-3">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-700 py-2 sm:py-3 rounded-lg text-sm sm:text-base font-semibold"
              >
                Отмена
              </button>
              <button
                type="submit"
                className="flex-1 bg-gray-700 hover:bg-gray-800 text-white py-2 sm:py-3 rounded-lg text-sm sm:text-base font-semibold"
              >
                Сохранить
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

function StatisticsView({ selectedHotel, hotels }: { selectedHotel: string; hotels: Hotel[] }) {
  const [statistics, setStatistics] = useState<Statistics | null>(null);
  const [loading, setLoading] = useState(true);
  const [filterHotelId, setFilterHotelId] = useState<string>(selectedHotel || '');

  const loadStatistics = async (hotelId?: string) => {
    try {
      setLoading(true);
      const stats = await api.getStatistics(hotelId || undefined);
      setStatistics(stats);
    } catch (error) {
      console.error('Error loading statistics:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadStatistics(filterHotelId || undefined);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filterHotelId]);

  if (!statistics && !loading) return null;

  // Скелетон для загрузки
  if (loading) {
    return (
      <div className="space-y-4 sm:space-y-6">
        <div className="bg-white rounded-lg shadow-sm p-4 sm:p-6 border border-gray-200">
          <div className="mb-4 sm:mb-6">
            <div className="h-8 w-48 bg-gray-200 rounded animate-pulse"></div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 sm:gap-4 mb-4 sm:mb-6">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-5 h-5 bg-gray-300 rounded animate-pulse"></div>
                  <div className="h-4 w-24 bg-gray-300 rounded animate-pulse"></div>
                </div>
                <div className="h-8 w-16 bg-gray-300 rounded animate-pulse mt-2"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (!statistics) return null;

  return (
    <div className="space-y-4 sm:space-y-6">
      <div className="bg-white rounded-lg shadow-sm p-4 sm:p-6 border border-gray-200">
        <div className="mb-4 sm:mb-6">
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900 flex items-center gap-2">
            <BarChart3 className="w-5 h-5 sm:w-6 sm:h-6" />
            Статистика
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 sm:gap-4 mb-4 sm:mb-6">
          <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
            <div className="flex items-center gap-2 mb-2">
              <Building2 className="w-5 h-5 text-gray-700" />
              <span className="text-sm text-gray-700 font-semibold">Всего комнат</span>
            </div>
            <div className="text-3xl font-bold text-gray-900">{statistics.totalRooms}</div>
          </div>

          <div className="bg-green-50 rounded-lg p-4 border border-green-200">
            <div className="flex items-center gap-2 mb-2">
              <Bed className="w-5 h-5 text-green-700" />
              <span className="text-sm text-green-700 font-semibold">Свободно</span>
            </div>
            <div className="text-3xl font-bold text-green-700">{statistics.availableRooms}</div>
          </div>

          <div className="bg-gray-100 rounded-lg p-4 border border-gray-300">
            <div className="flex items-center gap-2 mb-2">
              <Calendar className="w-5 h-5 text-gray-700" />
              <span className="text-sm text-gray-700 font-semibold">Забронировано</span>
            </div>
            <div className="text-3xl font-bold text-gray-700">{statistics.bookedRooms}</div>
          </div>

          <div className="bg-emerald-600 rounded-lg p-4 border border-emerald-700">
            <div className="flex items-center gap-2 mb-2">
              <Euro className="w-5 h-5 text-white" />
              <span className="text-sm text-white font-semibold">Доход</span>
            </div>
            <div className="text-3xl font-bold text-white">{statistics.revenue}€</div>
          </div>

          <div className="bg-orange-50 rounded-lg p-4 border border-orange-200">
            <div className="flex items-center gap-2 mb-2">
              <CreditCard className="w-5 h-5 text-orange-700" />
              <span className="text-sm text-orange-700 font-semibold">К оплате</span>
            </div>
            <div className="text-3xl font-bold text-orange-700">{statistics.amountToPay?.toFixed(2) || '0.00'}€</div>
          </div>
        </div>
      </div>
    </div>
  );
}

function CashMonitoringView({ selectedHotel }: { selectedHotel: string }) {
  const [cashData, setCashData] = useState<CashMonitoring | null>(null);
  const [loading, setLoading] = useState(true);

  const loadCashData = async () => {
    try {
      setLoading(true);
      const data = await api.getCashMonitoring(selectedHotel || undefined);
      setCashData(data);
    } catch (error) {
      console.error('Error loading cash monitoring:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCashData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedHotel]);

  if (loading) {
    return <div className="text-center py-12">Загрузка...</div>;
  }

  if (!cashData) return null;

  return (
    <div className="space-y-4 sm:space-y-6">
      <div className="bg-white rounded-lg shadow-sm p-4 sm:p-6 border border-gray-200">
        <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4 sm:mb-6 flex items-center gap-2">
          <DollarSign className="w-5 h-5 sm:w-6 sm:h-6" />
          Мониторинг наличных денег
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-6">
          <div className="bg-green-50 rounded-lg p-4 border border-green-200">
            <div className="flex items-center gap-2 mb-2">
              <DollarSign className="w-5 h-5 text-green-700" />
              <span className="text-sm text-green-700 font-semibold">Всего наличных</span>
            </div>
            <div className="text-3xl font-bold text-green-700">{cashData.totalCash.toFixed(2)}€</div>
          </div>

          <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
            <div className="flex items-center gap-2 mb-2">
              <Calendar className="w-5 h-5 text-blue-700" />
              <span className="text-sm text-blue-700 font-semibold">Сегодня</span>
            </div>
            <div className="text-3xl font-bold text-blue-700">{cashData.cashToday.toFixed(2)}€</div>
          </div>

          <div className="bg-purple-50 rounded-lg p-4 border border-purple-200">
            <div className="flex items-center gap-2 mb-2">
              <Calendar className="w-5 h-5 text-purple-700" />
              <span className="text-sm text-purple-700 font-semibold">За неделю</span>
            </div>
            <div className="text-3xl font-bold text-purple-700">{cashData.cashThisWeek.toFixed(2)}€</div>
          </div>

          <div className="bg-orange-50 rounded-lg p-4 border border-orange-200">
            <div className="flex items-center gap-2 mb-2">
              <Calendar className="w-5 h-5 text-orange-700" />
              <span className="text-sm text-orange-700 font-semibold">За месяц</span>
            </div>
            <div className="text-3xl font-bold text-orange-700">{cashData.cashThisMonth.toFixed(2)}€</div>
          </div>
        </div>

        <div className="mt-6">
          <h3 className="text-lg font-bold text-gray-900 mb-4">Последние платежи наличными</h3>
          {cashData.recentCashPayments.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              Нет платежей наличными
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="border-b border-gray-200 bg-gray-50">
                    <th className="px-3 py-2 text-left text-xs font-semibold text-gray-700">Дата</th>
                    <th className="px-3 py-2 text-left text-xs font-semibold text-gray-700">Комната</th>
                    <th className="px-3 py-2 text-left text-xs font-semibold text-gray-700">Гость</th>
                    <th className="px-3 py-2 text-left text-xs font-semibold text-gray-700">Сумма</th>
                  </tr>
                </thead>
                <tbody>
                  {cashData.recentCashPayments.map((payment, index) => (
                    <tr
                      key={index}
                      className="border-b border-gray-100 hover:bg-gray-50 transition-colors"
                    >
                      <td className="px-3 py-2.5 text-sm text-gray-700">
                        {new Date(payment.date).toLocaleDateString('ru-RU', {
                          day: '2-digit',
                          month: '2-digit',
                          year: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </td>
                      <td className="px-3 py-2.5 text-sm font-semibold text-gray-900">
                        #{payment.roomNumber}
                      </td>
                      <td className="px-3 py-2.5 text-sm text-gray-700">
                        {payment.bookedBy}
                      </td>
                      <td className="px-3 py-2.5 text-sm font-bold text-green-700">
                        {payment.amount.toFixed(2)}€
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function InvitesView({ currentUser }: { currentUser: User }) {
  const [invites, setInvites] = useState<Invite[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newInviteName, setNewInviteName] = useState('');
  const [expiresInDays, setExpiresInDays] = useState(7);
  const [copiedToken, setCopiedToken] = useState<string | null>(null);
  const [newInviteToken, setNewInviteToken] = useState<string | null>(null);
  const [visibleInviteUrl, setVisibleInviteUrl] = useState<string | null>(null);
  const [inviteUrls, setInviteUrls] = useState<Record<string, string>>({});

  const loadInvites = async () => {
    try {
      setLoading(true);
      const data = await api.getInvites();
      // Сортируем приглашения: использованные внизу, остальные по дате создания (старые выше)
      const sortedData = [...data].sort((a, b) => {
        // Сначала разделяем на использованные и неиспользованные
        if (a.used && !b.used) return 1; // a (использованное) идет после b
        if (!a.used && b.used) return -1; // a (неиспользованное) идет перед b
        
        // Если оба использованы или оба не использованы, сортируем по дате создания
        const dateA = new Date(a.createdAt).getTime();
        const dateB = new Date(b.createdAt).getTime();
        return dateA - dateB; // Старые выше (меньше дата = выше в списке)
      });
      setInvites(sortedData);
    } catch (error) {
      console.error('Error loading invites:', error);
      alert('Ошибка при загрузке приглашений');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadInvites();
  }, []);

  const getInviteStatus = (invite: Invite) => {
    if (invite.used) {
      return { label: 'Использовано', color: 'bg-gray-500', icon: CheckCircle };
    }
    const now = new Date();
    const expiresAt = new Date(invite.expiresAt);
    if (now > expiresAt) {
      return { label: 'Истекло', color: 'bg-red-500', icon: AlertCircle };
    }
    return { label: 'Активно', color: 'bg-green-500', icon: Clock };
  };

  const handleCreateInvite = async () => {
    if (!newInviteName.trim()) {
      alert('Введите имя пользователя');
      return;
    }

    try {
      const invite = await api.createInvite(
        newInviteName.trim(),
        expiresInDays,
        currentUser.id!
      );
      
      setNewInviteToken(invite.inviteUrl);
      setNewInviteName('');
      // Автоматически копируем ссылку при создании
      await navigator.clipboard.writeText(invite.inviteUrl);
      setCopiedToken(invite.inviteUrl);
      setTimeout(() => setCopiedToken(null), 2000);
      await loadInvites();
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Ошибка при создании приглашения';
      alert(message);
    }
  };

  const handleRecreateInvite = async (name: string) => {
    if (!confirm(`Пересоздать приглашение для ${name}? Старое приглашение будет удалено.`)) {
      return;
    }

    try {
      const invite = await api.recreateInvite(
        name,
        expiresInDays,
        currentUser.id!
      );
      
      // Сохраняем URL для этого приглашения
      await loadInvites();
      const updatedInvites = await api.getInvites();
      const inviteId = updatedInvites.find((inv: Invite) => inv.name === name)?.id;
      if (inviteId) {
        setInviteUrls(prev => ({ ...prev, [inviteId]: invite.inviteUrl }));
        // Автоматически показываем ссылку после регенерации
        setVisibleInviteUrl(inviteId);
      }
      
      setNewInviteToken(invite.inviteUrl);
      // Автоматически копируем ссылку при регенерации
      await navigator.clipboard.writeText(invite.inviteUrl);
      setCopiedToken(invite.inviteUrl);
      setTimeout(() => setCopiedToken(null), 2000);
      await loadInvites();
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Ошибка при пересоздании приглашения';
      alert(message);
    }
  };

  const handleCopyLink = (url: string) => {
    navigator.clipboard.writeText(url);
    setCopiedToken(url);
    setTimeout(() => setCopiedToken(null), 2000);
  };

  if (loading) {
    return <div className="text-center py-12">Загрузка...</div>;
  }

  return (
    <div className="space-y-4 sm:space-y-6">
      <div className="bg-white rounded-lg shadow-sm p-4 sm:p-6 border border-gray-200">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900 flex items-center gap-2">
            <Mail className="w-5 h-5 sm:w-6 sm:h-6" />
            Управление приглашениями
          </h2>
          <button
            onClick={() => setShowCreateModal(true)}
            className="px-4 py-2 bg-gray-900 hover:bg-gray-800 text-white rounded-lg text-sm font-semibold flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            Создать приглашение
          </button>
        </div>

        {invites.length === 0 ? (
          <div className="text-center py-12 text-gray-500">
            <Mail className="w-16 h-16 mx-auto mb-4 text-gray-300" />
            <p>Нет созданных приглашений</p>
            <button
              onClick={() => setShowCreateModal(true)}
              className="mt-4 px-4 py-2 bg-gray-900 hover:bg-gray-800 text-white rounded-lg text-sm font-semibold"
            >
              Создать первое приглашение
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="border-b border-gray-200 bg-gray-50">
                  <th className="px-3 py-2 text-left text-xs font-semibold text-gray-700">Имя</th>
                  <th className="px-3 py-2 text-left text-xs font-semibold text-gray-700">Статус</th>
                  <th className="px-3 py-2 text-left text-xs font-semibold text-gray-700">Создано</th>
                  <th className="px-3 py-2 text-left text-xs font-semibold text-gray-700">Истекает</th>
                  <th className="px-3 py-2 text-left text-xs font-semibold text-gray-700">Использовано</th>
                  <th className="px-3 py-2 text-left text-xs font-semibold text-gray-700">Действия</th>
                </tr>
              </thead>
              <tbody>
                {invites.flatMap((invite) => {
                  const status = getInviteStatus(invite);
                  const StatusIcon = status.icon;
                  
                  const rows = [
                    <tr
                      key={invite.id}
                      className="border-b border-gray-100 hover:bg-gray-50 transition-colors"
                    >
                      <td className="px-3 py-2.5 text-sm text-gray-900 font-medium">
                        {invite.name || <span className="text-gray-400">Не указано</span>}
                      </td>
                      <td className="px-3 py-2.5">
                        <span className={`inline-flex items-center gap-1.5 px-2 py-1 rounded-full text-xs font-semibold text-white ${status.color}`}>
                          <StatusIcon className="w-3 h-3" />
                          {status.label}
                        </span>
                      </td>
                      <td className="px-3 py-2.5 text-sm text-gray-700">
                        {new Date(invite.createdAt).toLocaleDateString('ru-RU', {
                          day: '2-digit',
                          month: '2-digit',
                          year: 'numeric'
                        })}
                      </td>
                      <td className="px-3 py-2.5 text-sm text-gray-700">
                        {new Date(invite.expiresAt).toLocaleDateString('ru-RU', {
                          day: '2-digit',
                          month: '2-digit',
                          year: 'numeric'
                        })}
                      </td>
                      <td className="px-3 py-2.5 text-sm text-gray-700">
                        {invite.used ? (
                          invite.usedAt ? (
                            new Date(invite.usedAt).toLocaleDateString('ru-RU', {
                              day: '2-digit',
                              month: '2-digit',
                              year: 'numeric'
                            })
                          ) : (
                            'Да'
                          )
                        ) : (
                          <span className="text-gray-400">Нет</span>
                        )}
                      </td>
                      <td className="px-3 py-2.5">
                        <div className="flex items-center gap-2">
                          {/* Кнопка показать/скрыть ссылку */}
                          <button
                            onClick={() => {
                              if (visibleInviteUrl === invite.id) {
                                setVisibleInviteUrl(null);
                              } else {
                                // Если URL не сохранен, пытаемся получить его
                                const savedUrl = inviteUrls[invite.id];
                                if (savedUrl) {
                                  setVisibleInviteUrl(invite.id);
                                } else {
                                  // Показываем сообщение, что ссылка доступна только при создании/регенерации
                                  alert('Ссылка доступна только при создании или регенерации приглашения. Используйте кнопку регенерации для получения новой ссылки.');
                                }
                              }
                            }}
                            className="p-1.5 text-gray-600 hover:text-gray-800 hover:bg-gray-50 rounded"
                            title={visibleInviteUrl === invite.id ? "Скрыть ссылку" : "Показать ссылку"}
                          >
                            {visibleInviteUrl === invite.id ? (
                              <EyeOff className="w-4 h-4" />
                            ) : (
                              <Eye className="w-4 h-4" />
                            )}
                          </button>
                          
                          {/* Кнопка копирования ссылки */}
                          {inviteUrls[invite.id] && (
                            <button
                              onClick={() => handleCopyLink(inviteUrls[invite.id])}
                              className="p-1.5 text-green-600 hover:text-green-800 hover:bg-green-50 rounded"
                              title="Копировать ссылку"
                            >
                              {copiedToken === inviteUrls[invite.id] ? (
                                <CheckCircle className="w-4 h-4" />
                              ) : (
                                <Copy className="w-4 h-4" />
                              )}
                            </button>
                          )}
                          
                          {!invite.used && invite.name && (
                            <button
                              onClick={() => handleRecreateInvite(invite.name)}
                              className="p-1.5 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded"
                              title="Пересоздать приглашение"
                            >
                              <RefreshCw className="w-4 h-4" />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ];
                  
                  // Добавляем строку с инпутом для ссылки, если она видима
                  if (visibleInviteUrl === invite.id && inviteUrls[invite.id]) {
                    rows.push(
                      <tr key={`${invite.id}-url`}>
                        <td colSpan={6} className="px-3 py-3 bg-gray-50">
                          <div className="flex gap-2 items-center">
                            <input
                              type="text"
                              value={inviteUrls[invite.id] || ''}
                              readOnly
                              className="flex-1 px-3 py-2 border border-gray-300 rounded-lg bg-white text-sm"
                              onClick={(e) => (e.target as HTMLInputElement).select()}
                            />
                            <button
                              onClick={() => inviteUrls[invite.id] && handleCopyLink(inviteUrls[invite.id])}
                              className="px-3 py-2 bg-gray-900 hover:bg-gray-800 text-white rounded-lg flex items-center gap-2 text-sm"
                            >
                              {copiedToken === inviteUrls[invite.id] ? (
                                <>
                                  <CheckCircle className="w-4 h-4" />
                                  Скопировано
                                </>
                              ) : (
                                <>
                                  <Copy className="w-4 h-4" />
                                  Копировать
                                </>
                              )}
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  }
                  
                  return rows;
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Модальное окно создания приглашения */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-transparent flex items-center justify-center z-50 p-3 sm:p-4">
          <div className="bg-white rounded-lg max-w-md w-full max-h-[90vh] overflow-y-auto">
            <div className="p-4 sm:p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl sm:text-2xl font-bold">Создать приглашение</h2>
                <button
                  onClick={() => {
                    setShowCreateModal(false);
                    setNewInviteToken(null);
                  }}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {newInviteToken ? (
                <div className="space-y-4">
                  <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <CheckCircle className="w-5 h-5 text-green-600" />
                      <span className="font-semibold text-green-800">Приглашение создано!</span>
                    </div>
                    <p className="text-sm text-green-700 mb-3">Отправьте эту ссылку пользователю:</p>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={newInviteToken}
                        readOnly
                        className="flex-1 px-3 py-2 border border-green-300 rounded-lg bg-white text-sm"
                      />
                      <button
                        onClick={() => handleCopyLink(newInviteToken)}
                        className="px-3 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg flex items-center gap-2"
                      >
                        {copiedToken === newInviteToken ? (
                          <>
                            <CheckCircle className="w-4 h-4" />
                            Скопировано
                          </>
                        ) : (
                          <>
                            <Copy className="w-4 h-4" />
                            Копировать
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                  <button
                    onClick={() => {
                      setShowCreateModal(false);
                      setNewInviteToken(null);
                    }}
                    className="w-full bg-gray-900 hover:bg-gray-800 text-white py-2 rounded-lg font-semibold"
                  >
                    Закрыть
                  </button>
                </div>
              ) : (
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    handleCreateInvite();
                  }}
                  className="space-y-4"
                >
                  <div>
                    <label className="block text-sm font-semibold mb-2">
                      Имя пользователя <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={newInviteName}
                      onChange={(e) => setNewInviteName(e.target.value)}
                      placeholder="Иван Иванов"
                      className="w-full px-3 py-2 border-2 border-gray-300 rounded-lg focus:border-gray-900 focus:outline-none"
                      required
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      Приглашение будет привязано к этому имени. Email и пароль пользователь введет сам при регистрации.
                    </p>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold mb-2">
                      Срок действия (дней)
                    </label>
                    <input
                      type="number"
                      value={expiresInDays}
                      onChange={(e) => setExpiresInDays(Number(e.target.value) || 7)}
                      min="1"
                      max="365"
                      className="w-full px-3 py-2 border-2 border-gray-300 rounded-lg focus:border-gray-900 focus:outline-none"
                    />
                  </div>

                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => {
                        setShowCreateModal(false);
                        setNewInviteToken(null);
                      }}
                      className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-700 py-2 rounded-lg font-semibold"
                    >
                      Отмена
                    </button>
                    <button
                      type="submit"
                      className="flex-1 bg-gray-900 hover:bg-gray-800 text-white py-2 rounded-lg font-semibold"
                    >
                      Создать
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function UsersView({ 
  currentUser, 
  selectedUserId, 
  onSelectUser 
}: { 
  currentUser: User; 
  selectedUserId: string | null;
  onSelectUser: (userId: string | null) => void;
}) {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  const loadUsers = async () => {
    try {
      setLoading(true);
      const data = await api.getUsers();
      setUsers(data);
    } catch (error) {
      console.error('Error loading users:', error);
      alert('Ошибка при загрузке пользователей');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUsers();
  }, []);

  if (loading) {
    return <div className="text-center py-12">Загрузка...</div>;
  }

  if (selectedUserId) {
    return (
      <UserDetailView
        userId={selectedUserId}
        currentUser={currentUser}
        onBack={() => onSelectUser(null)}
      />
    );
  }

  return (
    <div className="space-y-4 sm:space-y-6">
      <div className="bg-white rounded-lg shadow-sm p-4 sm:p-6 border border-gray-200">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900 flex items-center gap-2">
            <Users className="w-5 h-5 sm:w-6 sm:h-6" />
            Управление пользователями
          </h2>
        </div>

        {users.length === 0 ? (
          <div className="text-center py-12 text-gray-500">
            <Users className="w-16 h-16 mx-auto mb-4 text-gray-300" />
            <p>Нет пользователей</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="border-b border-gray-200 bg-gray-50">
                  <th className="px-3 py-2 text-left text-xs font-semibold text-gray-700">Имя</th>
                  <th className="px-3 py-2 text-left text-xs font-semibold text-gray-700">Email</th>
                  <th className="px-3 py-2 text-left text-xs font-semibold text-gray-700">Телефон</th>
                  <th className="px-3 py-2 text-left text-xs font-semibold text-gray-700">Роль</th>
                  <th className="px-3 py-2 text-left text-xs font-semibold text-gray-700">Действия</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr
                    key={user.id}
                    className="border-b border-gray-100 hover:bg-gray-50 transition-colors"
                  >
                    <td className="px-3 py-2.5 text-sm text-gray-900 font-medium">
                      {user.name}
                    </td>
                    <td className="px-3 py-2.5 text-sm text-gray-700">
                      {user.email}
                    </td>
                    <td className="px-3 py-2.5 text-sm text-gray-700">
                      {user.phone || <span className="text-gray-400">—</span>}
                    </td>
                    <td className="px-3 py-2.5">
                      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-semibold ${
                        user.role === 'manager' 
                          ? 'bg-blue-100 text-blue-800' 
                          : 'bg-gray-100 text-gray-800'
                      }`}>
                        {user.role === 'manager' ? 'Менеджер' : 'Гость'}
                      </span>
                    </td>
                    <td className="px-3 py-2.5">
                      <button
                        onClick={() => onSelectUser(user.id!)}
                        className="px-3 py-1.5 bg-gray-900 hover:bg-gray-800 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5"
                      >
                        <span>Подробнее</span>
                        <ArrowRight className="w-3 h-3" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

function UserDetailView({
  userId,
  currentUser,
  onBack
}: {
  userId: string;
  currentUser: User;
  onBack: () => void;
}) {
  const [user, setUser] = useState<User | null>(null);
  const [bookings, setBookings] = useState<(BookingInfo & { roomNumber?: string; hotelName?: string })[]>([]);
  const [invites, setInvites] = useState<Invite[]>([]);
  const [loading, setLoading] = useState(true);
  const [copiedToken, setCopiedToken] = useState<string | null>(null);
  const [newInviteToken, setNewInviteToken] = useState<string | null>(null);
  const [expiresInDays] = useState(7);

  const loadUserData = async () => {
    try {
      setLoading(true);
      const [usersData, bookingsData, invitesData, roomsData, hotelsData] = await Promise.all([
        api.getUsers(),
        api.getBookings(),
        api.getInvites(),
        api.getRooms(),
        api.getHotels()
      ]);

      const foundUser = usersData.find((u: User) => u.id === userId);
      if (!foundUser) {
        alert('Пользователь не найден');
        onBack();
        return;
      }

      setUser(foundUser);

      // Фильтруем бронирования по имени пользователя
      const userBookings = bookingsData
        .filter((b: BookingInfo) => b.bookedBy === foundUser.name)
        .map((booking: BookingInfo) => {
          const room = roomsData.find((r: Room) => r.id === booking.roomId);
          const hotel = hotelsData.find((h: Hotel) => h.id === room?.hotelId);
          return {
            ...booking,
            roomNumber: room?.number || 'N/A',
            hotelName: hotel?.name || 'N/A'
          };
        });
      setBookings(userBookings);

      // Фильтруем приглашения по имени пользователя
      const userInvites = invitesData.filter((inv: Invite) => inv.name === foundUser.name);
      setInvites(userInvites);
    } catch (error) {
      console.error('Error loading user data:', error);
      alert('Ошибка при загрузке данных пользователя');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUserData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userId]);

  const handleCreateInvite = async () => {
    if (!user) return;

    try {
      const invite = await api.createInvite(
        user.name,
        expiresInDays,
        currentUser.id!
      );
      
      setNewInviteToken(invite.inviteUrl);
      await loadUserData();
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Ошибка при создании приглашения';
      alert(message);
    }
  };

  const handleRecreateInvite = async () => {
    if (!user) return;

    if (!confirm(`Пересоздать приглашение для ${user.name}? Старое приглашение будет удалено.`)) {
      return;
    }

    try {
      const invite = await api.recreateInvite(
        user.name,
        expiresInDays,
        currentUser.id!
      );
      
      setNewInviteToken(invite.inviteUrl);
      await loadUserData();
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Ошибка при пересоздании приглашения';
      alert(message);
    }
  };

  const handleResetPassword = async () => {
    if (!user) return;

    if (!confirm(`Создать ссылку для сброса пароля для ${user.name}? Пользователь сможет использовать её для входа или смены пароля.`)) {
      return;
    }

    try {
      // Используем механизм приглашения для сброса пароля
      const invite = await api.recreateInvite(
        user.name,
        1, // Короткий срок для сброса пароля - 1 день
        currentUser.id!
      );
      
      setNewInviteToken(invite.inviteUrl);
      await loadUserData();
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Ошибка при создании ссылки для сброса пароля';
      alert(message);
    }
  };

  const handleCopyLink = (url: string) => {
    navigator.clipboard.writeText(url);
    setCopiedToken(url);
    setTimeout(() => setCopiedToken(null), 2000);
  };

  const getInviteStatus = (invite: Invite) => {
    if (invite.used) {
      return { label: 'Использовано', color: 'bg-gray-500', icon: CheckCircle };
    }
    const now = new Date();
    const expiresAt = new Date(invite.expiresAt);
    if (now > expiresAt) {
      return { label: 'Истекло', color: 'bg-red-500', icon: AlertCircle };
    }
    return { label: 'Активно', color: 'bg-green-500', icon: Clock };
  };

  const activeInvite = invites.find(inv => !inv.used && new Date(inv.expiresAt) > new Date());

  if (loading) {
    return <div className="text-center py-12">Загрузка...</div>;
  }

  if (!user) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500 mb-4">Пользователь не найден</p>
        <button
          onClick={onBack}
          className="px-4 py-2 bg-gray-900 hover:bg-gray-800 text-white rounded-lg font-semibold"
        >
          Назад к списку
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Кнопка назад и информация о пользователе */}
      <div className="bg-white rounded-lg shadow-sm p-4 sm:p-6 border border-gray-200">
        <button
          onClick={onBack}
          className="mb-4 flex items-center gap-2 text-gray-600 hover:text-gray-900 font-semibold"
        >
          <ArrowLeft className="w-4 h-4" />
          Назад к списку
        </button>

        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2">{user.name}</h2>
            <div className="flex flex-wrap gap-4 text-sm text-gray-600">
              <div className="flex items-center gap-1">
                <Mail className="w-4 h-4" />
                <span>{user.email}</span>
              </div>
              {user.phone && (
                <div className="flex items-center gap-1">
                  <Phone className="w-4 h-4" />
                  <span>{user.phone}</span>
                </div>
              )}
              <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                user.role === 'manager' 
                  ? 'bg-blue-100 text-blue-800' 
                  : 'bg-gray-100 text-gray-800'
              }`}>
                {user.role === 'manager' ? 'Менеджер' : 'Гость'}
              </span>
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            {activeInvite ? (
              <button
                onClick={handleRecreateInvite}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-semibold flex items-center gap-2"
              >
                <RefreshCw className="w-4 h-4" />
                Пересоздать приглашение
              </button>
            ) : (
              <button
                onClick={handleCreateInvite}
                className="px-4 py-2 bg-gray-900 hover:bg-gray-800 text-white rounded-lg text-sm font-semibold flex items-center gap-2"
              >
                <Plus className="w-4 h-4" />
                Создать приглашение
              </button>
            )}
            <button
              onClick={handleResetPassword}
              className="px-4 py-2 bg-orange-600 hover:bg-orange-700 text-white rounded-lg text-sm font-semibold flex items-center gap-2"
            >
              <KeyRound className="w-4 h-4" />
              Сброс пароля
            </button>
          </div>
        </div>

        {/* Показываем ссылку приглашения, если она создана */}
        {newInviteToken && (
          <div className="mb-6 bg-green-50 border border-green-200 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <CheckCircle className="w-5 h-5 text-green-600" />
              <span className="font-semibold text-green-800">Ссылка создана!</span>
            </div>
            <p className="text-sm text-green-700 mb-3">Отправьте эту ссылку пользователю:</p>
            <div className="flex gap-2">
              <input
                type="text"
                value={newInviteToken}
                readOnly
                className="flex-1 px-3 py-2 border border-green-300 rounded-lg bg-white text-sm"
              />
              <button
                onClick={() => handleCopyLink(newInviteToken)}
                className="px-3 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg flex items-center gap-2"
              >
                {copiedToken === newInviteToken ? (
                  <>
                    <CheckCircle className="w-4 h-4" />
                    Скопировано
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4" />
                    Копировать
                  </>
                )}
              </button>
              <button
                onClick={() => setNewInviteToken(null)}
                className="px-3 py-2 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-lg"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Приглашения */}
      <div className="bg-white rounded-lg shadow-sm p-4 sm:p-6 border border-gray-200">
        <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
          <Mail className="w-5 h-5" />
          Приглашения
        </h3>
        {invites.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <p>Нет приглашений для этого пользователя</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="border-b border-gray-200 bg-gray-50">
                  <th className="px-3 py-2 text-left text-xs font-semibold text-gray-700">Статус</th>
                  <th className="px-3 py-2 text-left text-xs font-semibold text-gray-700">Создано</th>
                  <th className="px-3 py-2 text-left text-xs font-semibold text-gray-700">Истекает</th>
                  <th className="px-3 py-2 text-left text-xs font-semibold text-gray-700">Использовано</th>
                </tr>
              </thead>
              <tbody>
                {invites.map((invite) => {
                  const status = getInviteStatus(invite);
                  const StatusIcon = status.icon;
                  
                  return (
                    <tr
                      key={invite.id}
                      className="border-b border-gray-100 hover:bg-gray-50 transition-colors"
                    >
                      <td className="px-3 py-2.5">
                        <span className={`inline-flex items-center gap-1.5 px-2 py-1 rounded-full text-xs font-semibold text-white ${status.color}`}>
                          <StatusIcon className="w-3 h-3" />
                          {status.label}
                        </span>
                      </td>
                      <td className="px-3 py-2.5 text-sm text-gray-700">
                        {new Date(invite.createdAt).toLocaleDateString('ru-RU', {
                          day: '2-digit',
                          month: '2-digit',
                          year: 'numeric'
                        })}
                      </td>
                      <td className="px-3 py-2.5 text-sm text-gray-700">
                        {new Date(invite.expiresAt).toLocaleDateString('ru-RU', {
                          day: '2-digit',
                          month: '2-digit',
                          year: 'numeric'
                        })}
                      </td>
                      <td className="px-3 py-2.5 text-sm text-gray-700">
                        {invite.used ? (
                          invite.usedAt ? (
                            new Date(invite.usedAt).toLocaleDateString('ru-RU', {
                              day: '2-digit',
                              month: '2-digit',
                              year: 'numeric'
                            })
                          ) : (
                            'Да'
                          )
                        ) : (
                          <span className="text-gray-400">Нет</span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Бронирования */}
      <div className="bg-white rounded-lg shadow-sm p-4 sm:p-6 border border-gray-200">
        <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
          <Calendar className="w-5 h-5" />
          Бронирования ({bookings.length})
        </h3>
        {bookings.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <p>Нет бронирований</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="border-b border-gray-200 bg-gray-50">
                  <th className="px-3 py-2 text-left text-xs font-semibold text-gray-700">Отель</th>
                  <th className="px-3 py-2 text-left text-xs font-semibold text-gray-700">Комната</th>
                  <th className="px-3 py-2 text-left text-xs font-semibold text-gray-700">Заезд</th>
                  <th className="px-3 py-2 text-left text-xs font-semibold text-gray-700">Выезд</th>
                </tr>
              </thead>
              <tbody>
                {bookings.map((booking) => (
                  <tr
                    key={booking.id}
                    className="border-b border-gray-100 hover:bg-gray-50 transition-colors"
                  >
                    <td className="px-3 py-2.5 text-sm text-gray-900 font-medium">
                      {booking.hotelName}
                    </td>
                    <td className="px-3 py-2.5 text-sm text-gray-700">
                      #{booking.roomNumber}
                    </td>
                    <td className="px-3 py-2.5 text-sm text-gray-700">
                      {new Date(booking.checkIn).toLocaleDateString('ru-RU', {
                        day: '2-digit',
                        month: '2-digit',
                        year: 'numeric'
                      })}
                    </td>
                    <td className="px-3 py-2.5 text-sm text-gray-700">
                      {new Date(booking.checkOut).toLocaleDateString('ru-RU', {
                        day: '2-digit',
                        month: '2-digit',
                        year: 'numeric'
                      })}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

// Компонент для отображения бронирований в dashboard
function BookingsView({
  currentUser,
  bookings,
  bookingsLoading,
  rooms,
  filterBookedBy,
  setFilterBookedBy,
  filterRoomNumber,
  setFilterRoomNumber,
  filterDateFrom,
  setFilterDateFrom,
  filterDateTo,
  setFilterDateTo,
  showBookingsFilters,
  setShowBookingsFilters,
  bookingsSortBy,
  setBookingsSortBy,
  bookingsSortDirection,
  setBookingsSortDirection,
  onCancelBooking
}: {
  currentUser: User;
  bookings: (BookingInfo & { roomNumber?: string; hotelName?: string })[];
  bookingsLoading: boolean;
  rooms: Room[];
  filterBookedBy: string;
  setFilterBookedBy: (value: string) => void;
  filterRoomNumber: string;
  setFilterRoomNumber: (value: string) => void;
  filterDateFrom: string;
  setFilterDateFrom: (value: string) => void;
  filterDateTo: string;
  setFilterDateTo: (value: string) => void;
  showBookingsFilters: boolean;
  setShowBookingsFilters: (value: boolean) => void;
  bookingsSortBy: 'checkIn' | 'checkOut' | 'bookedDate' | 'bookedBy' | 'roomNumber';
  setBookingsSortBy: (value: 'checkIn' | 'checkOut' | 'bookedDate' | 'bookedBy' | 'roomNumber') => void;
  bookingsSortDirection: 'asc' | 'desc';
  setBookingsSortDirection: (value: 'asc' | 'desc') => void;
  onCancelBooking: (bookingId: string) => void;
}) {
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
    switch (bookingsSortBy) {
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
    return bookingsSortDirection === 'asc' ? comparison : -comparison;
  });

  const handleSort = (column: typeof bookingsSortBy) => {
    if (bookingsSortBy === column) {
      setBookingsSortDirection(bookingsSortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setBookingsSortBy(column);
      setBookingsSortDirection('asc');
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
    <div className="space-y-6">
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
              onClick={() => setShowBookingsFilters(!showBookingsFilters)}
              className={`px-3 py-1.5 rounded-lg text-xs sm:text-sm font-semibold transition-colors flex items-center gap-1.5 ${
                showBookingsFilters
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
        {showBookingsFilters && (
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

        {bookingsLoading ? (
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
            <table className="w-full border-collapse min-w-[800px]">
              <thead>
                <tr className="border-b border-gray-200 bg-gray-50">
                  <th 
                    className="px-3 py-2 text-left text-xs font-semibold text-gray-700 cursor-pointer hover:bg-gray-100 transition-colors"
                    onClick={() => handleSort('roomNumber')}
                  >
                    <div className="flex items-center gap-1">
                      Комната
                      {bookingsSortBy === 'roomNumber' && (
                        bookingsSortDirection === 'asc' ? <ArrowUp className="w-3 h-3" /> : <ArrowDown className="w-3 h-3" />
                      )}
                      {bookingsSortBy !== 'roomNumber' && <ArrowUpDown className="w-3 h-3 text-gray-400" />}
                    </div>
                  </th>
                  <th 
                    className="px-3 py-2 text-left text-xs font-semibold text-gray-700 cursor-pointer hover:bg-gray-100 transition-colors"
                    onClick={() => handleSort('checkIn')}
                  >
                    <div className="flex items-center gap-1">
                      Заезд
                      {bookingsSortBy === 'checkIn' && (
                        bookingsSortDirection === 'asc' ? <ArrowUp className="w-3 h-3" /> : <ArrowDown className="w-3 h-3" />
                      )}
                      {bookingsSortBy !== 'checkIn' && <ArrowUpDown className="w-3 h-3 text-gray-400" />}
                    </div>
                  </th>
                  <th 
                    className="px-3 py-2 text-left text-xs font-semibold text-gray-700 cursor-pointer hover:bg-gray-100 transition-colors"
                    onClick={() => handleSort('checkOut')}
                  >
                    <div className="flex items-center gap-1">
                      Выезд
                      {bookingsSortBy === 'checkOut' && (
                        bookingsSortDirection === 'asc' ? <ArrowUp className="w-3 h-3" /> : <ArrowDown className="w-3 h-3" />
                      )}
                      {bookingsSortBy !== 'checkOut' && <ArrowUpDown className="w-3 h-3 text-gray-400" />}
                    </div>
                  </th>
                  <th className="px-3 py-2 text-left text-xs font-semibold text-gray-700">Гости</th>
                  <th className="px-3 py-2 text-left text-xs font-semibold text-gray-700">Действия</th>
                </tr>
              </thead>
              <tbody>
                {filteredBookings.map((booking) => {
                  const nights = Math.ceil(
                    (new Date(booking.checkOut).getTime() - new Date(booking.checkIn).getTime()) / 
                    (1000 * 60 * 60 * 24)
                  );
                  const room = rooms.find(r => r.id === booking.roomId);
                  const canCancel = currentUser.role === 'manager' || booking.bookedBy === currentUser.name;

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
                        <div className="text-xs text-gray-500">
                          {nights} {nights === 1 ? 'ночь' : nights < 5 ? 'ночи' : 'ночей'}
                        </div>
                      </td>
                      <td className="px-3 py-2.5">
                        <div className="text-xs text-gray-700">
                          {booking.guests && booking.guests.length > 0 ? (
                            <div>
                              <div className="font-semibold mb-1">{booking.guests.length} {booking.guests.length === 1 ? 'гость' : 'гостей'}</div>
                              <div className="flex flex-wrap gap-2">
                                {booking.guests.slice(0, 3).map((g, i) => (
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
                                    <span className="text-gray-700 text-xs">{g.name}</span>
                                  </div>
                                ))}
                                {booking.guests.length > 3 && (
                                  <div className="text-gray-400 text-xs">+{booking.guests.length - 3} еще</div>
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
                          {canCancel && booking.id && (
                            <button
                              onClick={() => {
                                if (confirm('Вы уверены, что хотите отменить бронирование?')) {
                                  onCancelBooking(booking.id!);
                                }
                              }}
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
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

