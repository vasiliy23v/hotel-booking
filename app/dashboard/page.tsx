'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Building2, Bed, Users, BarChart3, LogOut, Plus, Edit, Trash2, LayoutGrid, Filter, Calendar, Euro, X, ArrowUpDown, ArrowUp, ArrowDown, ArrowLeft, Bell, DollarSign } from 'lucide-react';
import { api } from '@/lib/api';
import type { User, Room, Hotel, Stairs, Statistics, CashMonitoring } from '@/types';
import FloorPlan from '@/components/FloorPlan';
import Link from 'next/link';

export default function Dashboard() {
  const router = useRouter();
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [hotels, setHotels] = useState<Hotel[]>([]);
  const [rooms, setRooms] = useState<Room[]>([]);
  const [selectedHotel, setSelectedHotel] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState<'plan' | 'statistics' | 'hotels' | 'cash'>('plan');
  const [selectedFloor, setSelectedFloor] = useState<'EG' | '1OG' | '2OG'>('EG');
  const [stairs, setStairs] = useState<Stairs[]>([]);
  const [showRoomModal, setShowRoomModal] = useState(false);
  const [showHotelModal, setShowHotelModal] = useState(false);
  const [editingRoom, setEditingRoom] = useState<Room | null>(null);
  const [editingHotel, setEditingHotel] = useState<Hotel | null>(null);
  
  // Фильтры и сортировка
  const [filterType, setFilterType] = useState<'all' | 'FZ' | 'DZ' | 'EZ'>('all');
  const [filterPriceMin, setFilterPriceMin] = useState(0);
  const [filterPriceMax, setFilterPriceMax] = useState(1000);
  const [filterCapacity, setFilterCapacity] = useState(0);
  const [filterAvailableOnly, setFilterAvailableOnly] = useState(false); // По умолчанию показываем все комнаты
  const [sortBy, setSortBy] = useState<'floor' | 'number' | 'type' | 'price' | 'capacity' | 'status'>('floor');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    const userStr = localStorage.getItem('currentUser');
    if (!userStr) {
      router.push('/');
      return;
    }

    const user = JSON.parse(userStr);
    setCurrentUser(user);
    loadData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router]);

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

  const loadData = async () => {
    try {
      setLoading(true);
      const [hotelsData, roomsData, stairsData] = await Promise.all([
        api.getHotels(),
        api.getRooms(),
        api.getStairs()
      ]);

      setHotels(hotelsData);
      setRooms(roomsData);
      setStairs(stairsData || []);

      // Не выбираем отель автоматически - показываем карточки для выбора
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
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

  const handleDeleteHotel = async (id: string) => {
    if (!confirm('Вы уверены, что хотите удалить этот отель?')) return;
    
    try {
      await api.deleteHotel(id);
      setHotels(hotels.filter(h => h.id !== id));
      if (selectedHotel === id && hotels.length > 1) {
        setSelectedHotel(hotels.find(h => h.id !== id)?.id || '');
      }
    } catch (error) {
      alert('Ошибка при удалении отеля');
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

  const handleDuplicateRoom = async (room: Room) => {
    try {
      // Создаем копию комнаты с новым ID и временным номером
      const duplicatedRoom: Room = {
        ...room,
        id: `room-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        number: `${room.number}-copy`, // Временный номер, пользователь может изменить
        position: {
          x: room.position.x + (room.width || 120) + 20,
          y: room.position.y
        },
        booking: undefined // Убираем бронирование при дублировании
      };
      
      const created = await api.createRoom(duplicatedRoom);
      setRooms(prevRooms => [...prevRooms, created]);
      
      // Автоматически открываем модальное окно для редактирования новой комнаты
      setEditingRoom(created);
      setShowRoomModal(true);
    } catch (error) {
      console.error('Error duplicating room:', error);
      alert('Ошибка при дублировании комнаты');
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
    if (!room.booking && !room.isCommon) {
      router.push(`/booking/${room.id}`);
    }
  };

  const handleSaveHotel = async (hotelData: Partial<Hotel> & { name: string; address: string }) => {
    try {
      if (editingHotel) {
        await api.updateHotel(editingHotel.id, hotelData);
        setHotels(hotels.map(h => h.id === editingHotel.id ? { ...h, ...hotelData } : h));
      } else {
        const newHotel = await api.createHotel(hotelData);
        setHotels([...hotels, newHotel]);
      }
      setShowHotelModal(false);
      setEditingHotel(null);
    } catch (error) {
      alert('Ошибка при сохранении отеля');
    }
  };

  if (loading || !currentUser) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-lg text-gray-900">Загрузка...</div>
      </div>
    );
  }

  const hotelRooms = rooms.filter(r => r.hotelId === selectedHotel);
  const currentHotel = hotels.find(h => h.id === selectedHotel);
  const myBookingsCount = rooms.filter(r => r.booking?.bookedBy === currentUser.name).length;
  const availableRooms = hotelRooms.filter(r => !r.booking && !r.isCommon).length;

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
    <div className="min-h-screen bg-gray-50">
      {/* Header - Минималистичный */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-20">
        <div className="max-w-7xl mx-auto px-3 sm:px-4 py-2 sm:py-3">
          <div className="flex justify-between items-center gap-2 sm:gap-4">
            <div className="flex items-center gap-2 sm:gap-3 min-w-0">
              <Link href="/" prefetch={false} className="flex items-center gap-2 sm:gap-3 min-w-0 hover:opacity-80 transition-opacity">
                <Building2 className="w-5 h-5 sm:w-6 sm:h-6 text-gray-700 flex-shrink-0" />
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

              {/* Колокольчик с бронированиями */}
              <Link
                href="/bookings"
                prefetch={false}
                className="relative p-2 text-gray-700 hover:text-gray-900 transition-colors"
                title="Мои бронирования"
              >
                <Bell className="w-5 h-5 sm:w-6 sm:h-6" />
                {myBookingsCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                    {myBookingsCount > 99 ? '99+' : myBookingsCount}
                  </span>
                )}
              </Link>

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

      {/* Информация о выбранном отеле */}
      {selectedHotel && currentHotel && (
        <div className="bg-white border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-3 sm:px-4 py-4 sm:py-6">
            <div className="flex flex-col sm:flex-row gap-4 sm:gap-6">
              {/* Фото отеля */}
              {currentHotel.image ? (
                <div className="w-full sm:w-48 h-48 sm:h-32 flex-shrink-0 rounded-lg overflow-hidden">
                  <img
                    src={currentHotel.image}
                    alt={currentHotel.name}
                    className="w-full h-full object-cover"
                  />
                </div>
              ) : (
                <div className="w-full sm:w-48 h-48 sm:h-32 flex-shrink-0 rounded-lg bg-gray-200 flex items-center justify-center">
                  <Building2 className="w-16 h-16 text-gray-400" />
                </div>
              )}
              
              {/* Информация об отеле */}
              <div className="flex-1">
                <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
                  {currentHotel.name}
                </h1>
                <p className="text-sm sm:text-base text-gray-600 mb-3">
                  {currentHotel.address}
                </p>
                {currentHotel.description && (
                  <p className="text-sm text-gray-500 line-clamp-2">
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
              {currentUser.role === 'manager' && (
                <>
                  <button
                    onClick={() => setViewMode('hotels')}
                    className={`px-2 sm:px-3 py-1.5 sm:py-2 rounded-lg text-xs sm:text-sm font-semibold transition-colors flex items-center gap-1 sm:gap-2 whitespace-nowrap shrink-0 ${
                      viewMode === 'hotels'
                        ? 'bg-gray-900 text-white'
                        : 'bg-white text-gray-700 border border-gray-200 hover:bg-gray-50'
                    }`}
                  >
                    <Building2 className="w-4 h-4" />
                    <span className="hidden sm:inline">Отели</span>
                  </button>
                  <button
                    onClick={() => setViewMode('statistics')}
                    className={`px-2 sm:px-3 py-1.5 sm:py-2 rounded-lg text-xs sm:text-sm font-semibold transition-colors flex items-center gap-1 sm:gap-2 whitespace-nowrap shrink-0 ${
                      viewMode === 'statistics'
                        ? 'bg-gray-900 text-white'
                        : 'bg-white text-gray-700 border border-gray-200 hover:bg-gray-50'
                    }`}
                  >
                    <BarChart3 className="w-4 h-4" />
                    <span className="hidden sm:inline">Статистика</span>
                  </button>
                  <button
                    onClick={() => setViewMode('cash')}
                    className={`px-2 sm:px-3 py-1.5 sm:py-2 rounded-lg text-xs sm:text-sm font-semibold transition-colors flex items-center gap-1 sm:gap-2 whitespace-nowrap shrink-0 ${
                      viewMode === 'cash'
                        ? 'bg-gray-900 text-white'
                        : 'bg-white text-gray-700 border border-gray-200 hover:bg-gray-50'
                    }`}
                  >
                    <DollarSign className="w-4 h-4" />
                    <span className="hidden sm:inline">Наличные</span>
                  </button>
                </>
              )}
            </div>

            {/* Выбор этажа для плана */}
            {viewMode === 'plan' && (
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
      <main className="max-w-7xl mx-auto px-3 sm:px-4 py-4 sm:py-6 lg:py-8">
        {/* Карточки отелей для выбора (если отель не выбран) */}
        {!selectedHotel && hotels.length > 0 && (
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
                            <div className="text-lg sm:text-xl font-bold text-gray-900">#{room.number}</div>
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
                              className="px-3 py-1.5 bg-red-500 hover:bg-red-600 text-white rounded-lg text-xs sm:text-sm font-semibold whitespace-nowrap"
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
                            <div className="font-semibold text-gray-900">#{room.number}</div>
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
                                    className="px-2 py-1 bg-red-500 hover:bg-red-600 text-white rounded text-xs font-semibold whitespace-nowrap"
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


        {viewMode === 'hotels' && currentUser.role === 'manager' && (
          <div>
            <div className="mb-4 flex justify-end">
              <button
                onClick={() => {
                  setEditingHotel(null);
                  setShowHotelModal(true);
                }}
                className="bg-[#013328] hover:bg-[#013328]/90 text-white px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg text-xs sm:text-sm font-semibold flex items-center gap-1 sm:gap-2"
              >
                <Plus className="w-3 h-3 sm:w-4 sm:h-4" />
                <span className="hidden sm:inline">Добавить отель</span>
                <span className="sm:hidden">Добавить</span>
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
              {hotels.map(hotel => (
                <div key={hotel.id} className="bg-white border-2 border-gray-200 rounded-lg overflow-hidden">
                  {hotel.image && (
                    <div className="w-full h-48 overflow-hidden">
                      <img
                        src={hotel.image}
                        alt={hotel.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}
                  <div className="p-4 sm:p-6">
                    <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-1 sm:mb-2">{hotel.name}</h3>
                    <p className="text-xs sm:text-sm text-gray-600 mb-1 sm:mb-2">{hotel.address}</p>
                    {hotel.description && (
                      <p className="text-xs sm:text-sm text-gray-600 mb-2 line-clamp-2">{hotel.description}</p>
                    )}
                    {hotel.floors && (
                      <p className="text-xs sm:text-sm text-gray-700 mb-3 sm:mb-4 font-semibold">
                        Этажей: {hotel.floors} {hotel.floors === 1 ? 'этаж' : hotel.floors < 5 ? 'этажа' : 'этажей'}
                      </p>
                    )}
                    <div className="flex gap-1.5 sm:gap-2">
                      <button
                        onClick={() => {
                          setEditingHotel(hotel);
                          setShowHotelModal(true);
                        }}
                        className="flex-1 bg-green-600 hover:bg-green-700 text-white py-1.5 sm:py-2 rounded-lg text-xs sm:text-sm font-semibold flex items-center justify-center gap-1"
                      >
                        <Edit className="w-3 h-3 sm:w-4 sm:h-4" />
                        <span className="hidden sm:inline">Редактировать</span>
                      </button>
                      <button
                        onClick={() => handleDeleteHotel(hotel.id)}
                        className="bg-red-500 hover:bg-red-600 text-white py-1.5 sm:py-2 rounded-lg text-xs sm:text-sm font-semibold flex items-center justify-center gap-1 px-2 sm:px-3"
                      >
                        <Trash2 className="w-3 h-3 sm:w-4 sm:h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {viewMode === 'statistics' && currentUser.role === 'manager' && (
          <StatisticsView selectedHotel={selectedHotel} />
        )}

        {viewMode === 'cash' && currentUser.role === 'manager' && (
          <CashMonitoringView selectedHotel={selectedHotel} />
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

      {/* Hotel Modal */}
      {showHotelModal && (
        <HotelModal
          hotel={editingHotel}
          onSave={handleSaveHotel}
          onClose={() => {
            setShowHotelModal(false);
            setEditingHotel(null);
          }}
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
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-3 sm:p-4">
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
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-3 sm:p-4">
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
                    className="absolute top-2 right-2 bg-red-500 hover:bg-red-600 text-white rounded-full p-1.5"
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

function StatisticsView({ selectedHotel }: { selectedHotel: string }) {
  const [statistics, setStatistics] = useState<Statistics | null>(null);
  const [loading, setLoading] = useState(true);

  const loadStatistics = async () => {
    try {
      setLoading(true);
      const stats = await api.getStatistics(selectedHotel);
      setStatistics(stats);
    } catch (error) {
      console.error('Error loading statistics:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadStatistics();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedHotel]);

  if (loading) {
    return <div className="text-center py-12">Загрузка...</div>;
  }

  if (!statistics) return null;

  return (
    <div className="space-y-4 sm:space-y-6">
      <div className="bg-white rounded-lg shadow-sm p-4 sm:p-6 border border-gray-200">
        <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4 sm:mb-6 flex items-center gap-2">
          <BarChart3 className="w-5 h-5 sm:w-6 sm:h-6" />
          Статистика отеля
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-4 sm:mb-6">
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


