'use client';
/* eslint-disable @next/next/no-img-element */

import { useState, useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Edit, Trash2, Building2, Save, X, LayoutGrid, Calendar } from 'lucide-react';
import { DatePicker } from '@/components/ui/date-picker';
import { api } from '@/lib/api';
import type { Hotel, Room, Stairs, User } from '@/types';
import FloorPlan from '@/components/FloorPlan';
import { getNearestFestivalDates } from '@/lib/festival-dates';
import { ConfirmCancelBookingDialog } from '@/components/booking/ConfirmCancelBookingDialog';

interface HotelDetailViewProps {
  hotelId: string;
  onBack: () => void;
  onHotelUpdate: () => void;
}

export default function HotelDetailView({ hotelId, onBack, onHotelUpdate }: HotelDetailViewProps) {
  const router = useRouter();
  const [hotel, setHotel] = useState<Hotel | null>(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    address: '',
    description: '',
    floors: 3,
    hasEGFloor: true,
    image: '',
  });
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [rooms, setRooms] = useState<Room[]>([]);
  const [stairs, setStairs] = useState<Stairs[]>([]);
  const [selectedFloor, setSelectedFloor] = useState<'EG' | '1OG' | '2OG' | '3OG' | '4OG' | '5OG' | '6OG'>('1OG');
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteConfirmName, setDeleteConfirmName] = useState('');
  
  // Состояние для подтверждения отмены бронирования
  const [showCancelDialog, setShowCancelDialog] = useState(false);
  const [bookingToCancel, setBookingToCancel] = useState<{ id: string; roomNumber?: string; bookedBy?: string } | null>(null);
  const [isCanceling, setIsCanceling] = useState(false);
  
  // Фильтр по датам
  const [descExpanded, setDescExpanded] = useState(false);
  const [dateFilterEnabled, setDateFilterEnabled] = useState(false);
  const [checkInDate, setCheckInDate] = useState('');
  const [checkOutDate, setCheckOutDate] = useState('');

  // По умолчанию подставляем даты ближайшего фестиваля (их можно изменить или сбросить)
  useEffect(() => {
    let cancelled = false;
    api
      .getBookingDateRanges(false)
      .then((ranges) => {
        if (cancelled) return;
        const dates = getNearestFestivalDates(ranges);
        if (!dates) return;
        setCheckInDate((prev) => prev || dates.checkIn);
        setCheckOutDate((prev) => prev || dates.checkOut);
        setDateFilterEnabled(true);
      })
      .catch((error) => console.error('Error loading festival dates:', error));
    return () => {
      cancelled = true;
    };
  }, []);

  // Определяем доступные этажи для отеля
  // Показываем ВСЕ этажи на основе hotel.floors и hasEGFloor, даже если на них еще нет комнат
  const getAvailableFloors = useMemo((): ('EG' | '1OG' | '2OG' | '3OG' | '4OG' | '5OG' | '6OG')[] => {
    const hasEG = hotel?.hasEGFloor !== false;
    const totalFloors = hotel?.floors || 3;
    
    // Генерируем все этажи на основе hotel.floors и hasEGFloor
    if (hasEG) {
      // С EG: EG, 1OG, 2OG, ... до totalFloors (EG считается первым этажом)
      const floors: ('EG' | '1OG' | '2OG' | '3OG' | '4OG' | '5OG' | '6OG')[] = ['EG'];
      for (let i = 1; i < totalFloors; i++) {
        floors.push(`${i}OG` as '1OG' | '2OG' | '3OG' | '4OG' | '5OG' | '6OG');
      }
      return floors;
    } else {
      // Без EG: 1OG, 2OG, 3OG, ... до totalFloors (1OG считается первым этажом)
      const floors: ('EG' | '1OG' | '2OG' | '3OG' | '4OG' | '5OG' | '6OG')[] = [];
      for (let i = 1; i <= totalFloors; i++) {
        floors.push(`${i}OG` as '1OG' | '2OG' | '3OG' | '4OG' | '5OG' | '6OG');
      }
      return floors;
    }
  }, [hotel?.hasEGFloor, hotel?.floors]);

  // Автоматически выбираем первый доступный этаж при изменении списка этажей
  useEffect(() => {
    if (getAvailableFloors.length > 0 && !getAvailableFloors.includes(selectedFloor)) {
      setSelectedFloor(getAvailableFloors[0]);
    }
  }, [getAvailableFloors, selectedFloor]);
  
  // При первой загрузке отеля устанавливаем первый доступный этаж (EG, если есть)
  useEffect(() => {
    if (hotel && getAvailableFloors.length > 0) {
      setSelectedFloor(getAvailableFloors[0]);
    }
  }, [hotel, getAvailableFloors]);

  useEffect(() => {
    loadHotel();
    loadRoomsAndStairs();
    const userStr = localStorage.getItem('currentUser');
    if (userStr) {
      const user = JSON.parse(userStr);
      setCurrentUser(user);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hotelId]);

  const loadHotel = async () => {
    try {
      setLoading(true);
      const hotels = await api.getHotels();
      const foundHotel = hotels.find((h: Hotel) => h.id === hotelId);
      if (foundHotel) {
        setHotel(foundHotel);
        setFormData({
          name: foundHotel.name || '',
          address: foundHotel.address || '',
          description: foundHotel.description || '',
          floors: foundHotel.floors || 3,
          hasEGFloor: foundHotel.hasEGFloor !== undefined ? foundHotel.hasEGFloor : true,
          image: typeof foundHotel.image === 'string' ? foundHotel.image : '',
        });
        setImagePreview(typeof foundHotel.image === 'string' ? foundHotel.image : null);
      }
    } catch (error) {
      console.error('Error loading hotel:', error);
      alert('Ошибка при загрузке отеля');
    } finally {
      setLoading(false);
    }
  };

  const loadRoomsAndStairs = async () => {
    try {
      const [roomsData, stairsData] = await Promise.all([
        api.getRooms(),
        api.getStairs()
      ]);
      setRooms(roomsData.filter((r: Room) => r.hotelId === hotelId));
      setStairs(stairsData.filter((s: Stairs) => s.hotelId === hotelId));
    } catch (error) {
      console.error('Error loading rooms and stairs:', error);
    }
  };

  const handleRoomUpdate = async (updatedRoom: Room) => {
    try {
      await api.updateRoom(updatedRoom.id, {
        ...updatedRoom,
        name: updatedRoom.name || undefined,
        description: updatedRoom.description || undefined,
        width: updatedRoom.width || undefined,
        height: updatedRoom.height || undefined,
      });
      await loadRoomsAndStairs();
    } catch (error) {
      console.error('Error updating room:', error);
    }
  };

  const handleRoomCreate = async (newRoom: Room) => {
    try {
      await api.createRoom({
        ...newRoom,
        name: newRoom.name || undefined,
        description: newRoom.description || undefined,
        width: newRoom.width || undefined,
        height: newRoom.height || undefined,
      });
      await loadRoomsAndStairs();
    } catch (error) {
      console.error('Error creating room:', error);
    }
  };

  const handleStairsUpdate = async (updatedStairs: Stairs[]) => {
    try {
      for (const stair of updatedStairs) {
        const existing = stairs.find(s => s.id === stair.id);
        if (existing) {
          await api.updateStairs(stair.id, {
            ...stair,
            targetFloor: stair.targetFloor || undefined,
          });
        } else {
          await api.createStairs({
            ...stair,
            targetFloor: stair.targetFloor || undefined,
          });
        }
      }
      
      const currentIds = updatedStairs.map(s => s.id);
      const toDelete = stairs.filter(s => !currentIds.includes(s.id));
      for (const stair of toDelete) {
        await api.deleteStairs(stair.id);
      }
      
      await loadRoomsAndStairs();
    } catch (error) {
      console.error('Error updating stairs:', error);
    }
  };

  const handleRoomClick = (room: Room) => {
    if (room.isCommon) return;
    
    // Менеджер может забронировать любую комнату
    // Передаем выбранные даты в URL если они заданы
    const params = new URLSearchParams();
    if (checkInDate && checkOutDate) {
      params.set('checkIn', checkInDate);
      params.set('checkOut', checkOutDate);
    }
    const queryString = params.toString();
    router.push(`/booking/${room.id}${queryString ? `?${queryString}` : ''}`);
  };

  const handleCancelBooking = (roomId: string) => {
    const foundRoom = rooms.find(r => r.id === roomId);
    if (!foundRoom?.booking?.id) return;

    setBookingToCancel({ 
      id: foundRoom.booking.id, 
      roomNumber: foundRoom.number,
      bookedBy: foundRoom.booking.bookedBy
    });
    setShowCancelDialog(true);
  };

  const handleConfirmCancel = async () => {
    if (!bookingToCancel?.id) return;
    
    setIsCanceling(true);
    try {
      await api.deleteBooking(bookingToCancel.id);
      await loadRoomsAndStairs();
      setShowCancelDialog(false);
      setBookingToCancel(null);
    } catch (error) {
      console.error('Error canceling booking:', error);
      alert('Ошибка при отмене бронирования');
    } finally {
      setIsCanceling(false);
    }
  };

  const handleSave = async () => {
    if (!hotel) return;

    // Проверяем, изменился ли hasEGFloor
    const hasEGFloorChanged = formData.hasEGFloor !== (hotel.hasEGFloor !== false);
    
    if (hasEGFloorChanged) {
      const action = formData.hasEGFloor 
        ? 'включить этаж EG (комнаты с 1OG, 2OG, 3OG переедут на EG, 1OG, 2OG)'
        : 'отключить этаж EG (комнаты с EG, 1OG, 2OG переедут на 1OG, 2OG, 3OG)';
      
      const confirmed = window.confirm(
        `ВНИМАНИЕ! Вы собираетесь ${action}.\n\n` +
        `Это автоматически переместит все комнаты и ступени на новые этажи.\n\n` +
        `Продолжить?`
      );
      
      if (!confirmed) {
        return;
      }
    }

    try {
      await api.updateHotel(hotel.id, {
        ...formData,
        // Передаем изображение как строку (base64 data URL), сервер сам обработает
        // Если image пустая строка, передаем её для удаления изображения
        image: formData.image !== undefined ? (formData.image || '') : undefined,
      } as Parameters<typeof api.updateHotel>[1]);
      setEditing(false);
      await loadHotel();
      onHotelUpdate();
      
      if (hasEGFloorChanged) {
        alert('Этажи успешно мигрированы! Все комнаты и ступени перемещены на новые этажи.');
      }
    } catch (error) {
      console.error('Error saving hotel:', error);
      alert('Ошибка при сохранении отеля: ' + (error instanceof Error ? error.message : 'Неизвестная ошибка'));
    }
  };

  const handleDelete = async () => {
    if (!hotel) return;
    
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    if (!hotel) return;
    
    if (deleteConfirmName.trim() !== hotel.name.trim()) {
      alert('Название отеля не совпадает. Введите точное название отеля для подтверждения.');
      return;
    }
    
    try {
      await api.deleteHotel(hotel.id);
      setShowDeleteModal(false);
      setDeleteConfirmName('');
      onBack();
      onHotelUpdate();
    } catch (error) {
      console.error('Error deleting hotel:', error);
      alert('Ошибка при удалении отеля');
    }
  };

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      alert('Пожалуйста, выберите изображение');
      return;
    }

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

  const handleCancel = () => {
    if (hotel) {
      setFormData({
        name: hotel.name || '',
        address: hotel.address || '',
        description: hotel.description || '',
        floors: hotel.floors || 3,
        hasEGFloor: hotel.hasEGFloor !== undefined ? hotel.hasEGFloor : true,
        image: typeof hotel.image === 'string' ? hotel.image : '',
      });
      setImagePreview(typeof hotel.image === 'string' ? hotel.image : null);
    }
    setEditing(false);
  };

  if (loading) {
    return (
      <div className="text-center py-12">
        <div className="text-lg text-gray-900 dark:text-foreground">Загрузка...</div>
      </div>
    );
  }

  if (!hotel) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500 dark:text-muted-foreground mb-4">Отель не найден</p>
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
      {/* Шапка отеля */}
      <div className="rounded-3xl border border-[#eadfd3] bg-white p-5 sm:p-8">
        <div className="mb-6 flex items-center justify-between gap-3">
          <button
            onClick={onBack}
            className="flex h-12 items-center gap-2 rounded-full px-4 text-lg font-medium text-[#6b4a36] transition-colors hover:bg-[#f1e4d6]"
          >
            <ArrowLeft className="h-5 w-5" />
            Все отели
          </button>
          {!editing ? (
            <div className="flex gap-3">
              <button
                onClick={() => setEditing(true)}
                className="flex h-12 items-center gap-2 rounded-full border-2 border-[#6b4a36] px-6 text-lg font-semibold text-[#5a3b28] transition-colors hover:bg-[#f1e4d6]"
              >
                <Edit className="h-5 w-5" />
                Изменить
              </button>
              <button
                onClick={handleDelete}
                className="flex h-12 items-center gap-2 rounded-full border-2 border-[#c4622d] px-6 text-lg font-semibold text-[#a8431f] transition-colors hover:bg-[#fde9da]"
              >
                <Trash2 className="h-5 w-5" />
                <span className="hidden sm:inline">Удалить</span>
              </button>
            </div>
          ) : (
            <div className="flex gap-3">
              <button
                onClick={handleCancel}
                className="flex h-12 items-center gap-2 rounded-full border-2 border-[#e3d5c6] px-6 text-lg font-semibold text-[#5a3b28] transition-colors hover:bg-[#f6ede2]"
              >
                <X className="h-5 w-5" />
                Отмена
              </button>
              <button
                onClick={handleSave}
                className="flex h-12 items-center gap-2 rounded-full bg-[#6b4a36] px-6 text-lg font-semibold text-white transition-colors hover:bg-[#5a3b28]"
              >
                <Save className="h-5 w-5" />
                Сохранить
              </button>
            </div>
          )}
        </div>

        <div className="grid gap-8 lg:grid-cols-[minmax(0,5fr)_minmax(0,6fr)]">
          {/* Фото */}
          <div>
            {imagePreview ? (
              <div className="relative aspect-[4/3] w-full overflow-hidden rounded-2xl bg-[#f1e4d6]">
                <img src={imagePreview} alt={hotel.name} className="h-full w-full object-cover" />
                {editing && (
                  <button
                    onClick={handleRemoveImage}
                    className="absolute right-3 top-3 flex h-11 w-11 items-center justify-center rounded-full bg-white/95 text-[#a8431f] shadow hover:bg-white"
                    title="Убрать фото"
                  >
                    <X className="h-5 w-5" />
                  </button>
                )}
              </div>
            ) : (
              <div className="flex aspect-[4/3] w-full items-center justify-center rounded-2xl bg-[#f1e4d6]">
                <Building2 className="h-14 w-14 text-[#c9b4a0]" />
              </div>
            )}
            {editing && (
              <div className="mt-4">
                <label className="mb-2 block text-base font-medium text-[#6f5a4c]">Загрузить фото</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  disabled={uploading}
                  className="w-full rounded-2xl border border-dashed border-[#d8cabb] bg-[#fbf8f4] px-4 py-3 text-base text-[#4a3a30] file:mr-4 file:rounded-full file:border-0 file:bg-[#6b4a36] file:px-5 file:py-2 file:text-base file:font-medium file:text-white disabled:opacity-50"
                />
                {uploading && <p className="mt-2 text-base text-[#8a7566]">Загрузка изображения…</p>}
                <p className="mt-2 text-sm text-[#a8917f]">До 5 МБ · JPG, PNG, GIF, WebP</p>
              </div>
            )}
          </div>

          {/* Информация */}
          <div className="min-w-0">
            {editing ? (
              <div className="space-y-5">
                <div>
                  <label className="mb-2 block text-base font-medium text-[#6f5a4c]">Название</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="h-14 w-full rounded-2xl border border-[#e3d5c6] bg-white px-5 text-lg text-[#2a1d15] outline-none focus:border-[#6b4a36] focus:ring-2 focus:ring-[#6b4a36]/20"
                    required
                  />
                </div>
                <div>
                  <label className="mb-2 block text-base font-medium text-[#6f5a4c]">Адрес</label>
                  <input
                    type="text"
                    value={formData.address}
                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                    className="h-14 w-full rounded-2xl border border-[#e3d5c6] bg-white px-5 text-lg text-[#2a1d15] outline-none focus:border-[#6b4a36] focus:ring-2 focus:ring-[#6b4a36]/20"
                    required
                  />
                </div>
                <div>
                  <label className="mb-2 block text-base font-medium text-[#6f5a4c]">Описание</label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    rows={6}
                    className="w-full rounded-2xl border border-[#e3d5c6] bg-white px-5 py-4 text-lg text-[#2a1d15] outline-none focus:border-[#6b4a36] focus:ring-2 focus:ring-[#6b4a36]/20"
                  />
                </div>
                <div className="grid gap-5 sm:grid-cols-2">
                  <div>
                    <label className="mb-2 block text-base font-medium text-[#6f5a4c]">Этажей</label>
                    <select
                      value={formData.floors}
                      onChange={(e) => setFormData({ ...formData, floors: parseInt(e.target.value) || 3 })}
                      className="h-14 w-full rounded-2xl border border-[#e3d5c6] bg-white px-5 text-lg text-[#2a1d15] outline-none focus:border-[#6b4a36] focus:ring-2 focus:ring-[#6b4a36]/20"
                    >
                      <option value={1}>1 этаж</option>
                      <option value={2}>2 этажа</option>
                      <option value={3}>3 этажа</option>
                      <option value={4}>4 этажа</option>
                    </select>
                  </div>
                  <label className="flex h-14 cursor-pointer items-center gap-3 self-end rounded-2xl border border-[#e3d5c6] bg-white px-5 text-lg text-[#2a1d15]">
                    <input
                      type="checkbox"
                      checked={formData.hasEGFloor}
                      onChange={(e) => setFormData({ ...formData, hasEGFloor: e.target.checked })}
                      className="h-5 w-5 accent-[#6b4a36]"
                    />
                    Есть этаж EG
                  </label>
                </div>
                <p className="text-sm text-[#a8917f]">
                  Без EG отель начинается с этажа 1OG.
                </p>
              </div>
            ) : (
              <>
                <h1 className="text-3xl font-semibold tracking-tight text-[#2a1d15] sm:text-4xl">{hotel.name}</h1>
                <p className="mt-2 text-lg text-[#6f5a4c]">{hotel.address}</p>
                <div className="mt-5 flex flex-wrap gap-2">
                  <span className="rounded-full bg-[#f1e4d6] px-4 py-2 text-base font-medium text-[#5a3b28]">
                    {hotel.floors || 0} {(hotel.floors || 0) === 1 ? 'этаж' : (hotel.floors || 0) < 5 ? 'этажа' : 'этажей'}
                  </span>
                  <span className="rounded-full bg-[#f1e4d6] px-4 py-2 text-base font-medium text-[#5a3b28]">
                    {hotel.hasEGFloor !== false ? 'Есть этаж EG' : 'Начинается с 1OG'}
                  </span>
                </div>
                <div className="mt-6">
                  {hotel.description ? (
                    <>
                      <p className={`whitespace-pre-wrap text-lg leading-relaxed text-[#4a3a30] ${descExpanded ? '' : 'line-clamp-5'}`}>
                        {hotel.description}
                      </p>
                      {hotel.description.length > 280 && (
                        <button
                          onClick={() => setDescExpanded(!descExpanded)}
                          className="mt-2 text-lg font-medium text-[#6b4a36] underline-offset-4 hover:underline"
                        >
                          {descExpanded ? 'Свернуть' : 'Читать полностью'}
                        </button>
                      )}
                    </>
                  ) : (
                    <p className="text-lg text-[#a8917f]">Описание не указано</p>
                  )}
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      {/* План этажа */}
      <div className="bg-white dark:bg-card rounded-lg border border-gray-200 dark:border-border p-4 sm:p-6">
        <div className="mb-4">
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-foreground flex items-center gap-2">
            <LayoutGrid className="w-5 h-5 sm:w-6 sm:h-6" />
            План этажа
          </h2>
        </div>

        <div className="space-y-4">
          {/* Выбор этажа */}
          {getAvailableFloors.length > 0 && (
            <div className="flex gap-2 overflow-x-auto scrollbar-hide">
              {getAvailableFloors.map((floor) => (
                <button
                  key={floor}
                  onClick={() => setSelectedFloor(floor)}
                  className={`px-3 py-2 rounded-lg text-sm font-semibold transition-all whitespace-nowrap ${
                    selectedFloor === floor
                      ? 'bg-gray-900 text-white shadow-sm'
                      : 'bg-white dark:bg-card text-gray-700 dark:text-foreground border border-gray-200 dark:border-border hover:bg-gray-50 dark:hover:bg-accent'
                  }`}
                >
                  {floor}
                </button>
              ))}
            </div>
          )}

          {/* Фильтр по датам */}
          <div className="flex flex-col items-center sm:flex-row sm:items-start sm:items-center gap-4 mb-4">
            <span className="text-sm font-semibold text-gray-700 flex items-center gap-1">
              <Calendar className="w-4 h-4" />
              Даты:
            </span>
            <div className="flex flex-col sm:flex-row gap-3 flex-1">
              <div className="flex-1 min-w-[150px]">
                <DatePicker
                  date={checkInDate ? new Date(checkInDate) : undefined}
                  onSelect={(date) => {
                    if (date) {
                      const newCheckIn = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
                      setCheckInDate(newCheckIn);
                      setDateFilterEnabled(true);
                      if (checkOutDate && newCheckIn >= checkOutDate) {
                        const nextDay = new Date(date);
                        nextDay.setDate(nextDay.getDate() + 1);
                        setCheckOutDate(`${nextDay.getFullYear()}-${String(nextDay.getMonth() + 1).padStart(2, '0')}-${String(nextDay.getDate()).padStart(2, '0')}`);
                      }
                    } else {  
                      setCheckInDate('');
                      if (!checkOutDate) setDateFilterEnabled(false);
                    }
                  }}
                  placeholder="Дата заезда"
                  className="w-full text-sm"
                />
              </div>
              <div className="flex-1 min-w-[150px]">
                <DatePicker
                  date={checkOutDate ? new Date(checkOutDate) : undefined}
                  onSelect={(date) => {
                    if (date) {
                      const newCheckOut = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
                      setDateFilterEnabled(true);
                      if (checkInDate && newCheckOut <= checkInDate) {
                        const nextDay = new Date(date);
                        nextDay.setDate(nextDay.getDate() + 1);
                        setCheckOutDate(`${nextDay.getFullYear()}-${String(nextDay.getMonth() + 1).padStart(2, '0')}-${String(nextDay.getDate()).padStart(2, '0')}`);
                      } else {
                        setCheckOutDate(newCheckOut);
                      }
                    } else {
                      setCheckOutDate('');
                      if (!checkInDate) setDateFilterEnabled(false);
                    }
                  }}
                  placeholder="Дата выезда"
                  minDate={checkInDate ? new Date(new Date(checkInDate).getTime() + 86400000) : undefined}
                  className="w-full text-sm"
                />
              </div>
              {(checkInDate || checkOutDate) && (
                <button
                  onClick={() => {
                    setCheckInDate('');
                    setCheckOutDate('');
                    setDateFilterEnabled(false);
                  }}
                  className="px-3 py-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                  title="Сбросить даты"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>

          {/* FloorPlan */}
          {currentUser && (
            <FloorPlan
              rooms={rooms.filter(r => r.floor === selectedFloor)}
              floor={selectedFloor}
              onRoomClick={handleRoomClick}
              onRoomUpdate={handleRoomUpdate}
              onRoomCreate={handleRoomCreate}
              onCancelBooking={handleCancelBooking}
              currentUser={currentUser.name}
              isManager={true}
              stairs={stairs}
              onStairsUpdate={handleStairsUpdate}
              hotelId={hotelId}
              dateFilterEnabled={dateFilterEnabled}
              checkInDate={checkInDate}
              checkOutDate={checkOutDate}
            />
          )}
        </div>
      </div>

      {/* Модальное окно подтверждения удаления */}
      {showDeleteModal && hotel && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-card rounded-lg max-w-md w-full p-6">
            <h2 className="text-xl font-bold text-gray-900 dark:text-foreground mb-4">Подтверждение удаления отеля</h2>
            
            <div className="space-y-4">
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <p className="text-sm text-red-800 font-semibold mb-2">
                  ⚠️ Внимание! Это действие необратимо.
                </p>
                <p className="text-sm text-red-700">
                  При удалении отеля <strong>&quot;{hotel.name}&quot;</strong> будут безвозвратно удалены:
                </p>
                <ul className="text-sm text-red-700 mt-2 list-disc list-inside space-y-1">
                  <li>Все комнаты отеля</li>
                  <li>Все бронирования, связанные с этими комнатами</li>
                  <li>Вся информация об отеле</li>
                </ul>
              </div>

              <div>
                <label className="block text-sm font-semibold mb-2 text-gray-700">
                  Для подтверждения введите название отеля: <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={deleteConfirmName}
                  onChange={(e) => setDeleteConfirmName(e.target.value)}
                  placeholder={hotel.name}
                  className="w-full px-3 py-2 border-2 border-gray-300 rounded-lg focus:border-gray-900 focus:outline-none"
                  autoFocus
                />
                <p className="text-xs text-gray-500 mt-1">
                  Введите: <strong>{hotel.name}</strong>
                </p>
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <button
                onClick={() => {
                  setShowDeleteModal(false);
                  setDeleteConfirmName('');
                }}
                className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-700 py-2 rounded-lg font-semibold"
              >
                Отмена
              </button>
              <button
                onClick={confirmDelete}
                disabled={deleteConfirmName.trim() !== hotel.name.trim()}
                className="flex-1 bg-red-600 hover:bg-red-700 text-white py-2 rounded-lg font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Удалить отель
              </button>
            </div>
          </div>
        </div>
      )}

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
    </div>
  );
}

