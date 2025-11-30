'use client';

import { useState, useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Edit, Trash2, Building2, Save, X, LayoutGrid } from 'lucide-react';
import { api } from '@/lib/api';
import type { Hotel, Room, Stairs, User } from '@/types';
import FloorPlan from '@/components/FloorPlan';

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
  const [selectedFloor, setSelectedFloor] = useState<'EG' | '1OG' | '2OG' | '3OG'>('1OG');
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteConfirmName, setDeleteConfirmName] = useState('');

  // Определяем доступные этажи для отеля
  // Показываем ВСЕ этажи, на которых есть комнаты, независимо от настройки hasEGFloor
  // Настройка hasEGFloor влияет только на выбор этажа при создании новых комнат
  const getAvailableFloors = useMemo((): ('EG' | '1OG' | '2OG' | '3OG')[] => {
    // Показываем все этажи, на которых есть комнаты
    if (rooms.length > 0) {
      const floorsSet = new Set(rooms.map(r => r.floor));
      const allFloors: ('EG' | '1OG' | '2OG' | '3OG')[] = ['EG', '1OG', '2OG', '3OG'];
      const available = allFloors.filter(f => floorsSet.has(f));
      // Сортируем этажи в правильном порядке
      const sortedFloors: ('EG' | '1OG' | '2OG' | '3OG')[] = [];
      if (available.includes('EG')) sortedFloors.push('EG');
      if (available.includes('1OG')) sortedFloors.push('1OG');
      if (available.includes('2OG')) sortedFloors.push('2OG');
      if (available.includes('3OG')) sortedFloors.push('3OG');
      return sortedFloors.length > 0 ? sortedFloors : ['EG', '1OG', '2OG', '3OG'];
    }
    
    // Если нет комнат, возвращаем этажи согласно настройке hasEGFloor
    const hasEG = hotel?.hasEGFloor !== false;
    return hasEG ? ['EG', '1OG', '2OG'] : ['1OG', '2OG', '3OG'];
  }, [hotel?.hasEGFloor, rooms]);

  // Автоматически выбираем первый доступный этаж, если текущий не доступен
  useEffect(() => {
    if (getAvailableFloors.length > 0 && !getAvailableFloors.includes(selectedFloor)) {
      setSelectedFloor(getAvailableFloors[0]);
    }
  }, [getAvailableFloors, selectedFloor]);

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
          image: foundHotel.image || '',
        });
        setImagePreview(foundHotel.image || null);
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
      await api.updateRoom(updatedRoom.id, updatedRoom);
      await loadRoomsAndStairs();
    } catch (error) {
      console.error('Error updating room:', error);
    }
  };

  const handleRoomCreate = async (newRoom: Room) => {
    try {
      await api.createRoom(newRoom);
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
          await api.updateStairs(stair.id, stair);
        } else {
          await api.createStairs(stair);
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
    // Бронировать можно только свободные комнаты
    // Менеджер сначала должен отменить существующее бронирование
    if (!room.isCommon && !room.booking) {
      router.push(`/booking/${room.id}`);
    }
  };

  const handleCancelBooking = async (roomId: string) => {
    const foundRoom = rooms.find(r => r.id === roomId);
    if (!foundRoom?.booking) return;

    if (!confirm('Вы уверены, что хотите отменить бронирование?')) return;

    try {
      if (foundRoom.booking.id) {
        await api.deleteBooking(foundRoom.booking.id);
      }
      await loadRoomsAndStairs();
    } catch (error) {
      console.error('Error canceling booking:', error);
      alert('Ошибка при отмене бронирования');
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
      await api.updateHotel(hotel.id, formData);
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
        image: hotel.image || '',
      });
      setImagePreview(hotel.image || null);
    }
    setEditing(false);
  };

  if (loading) {
    return (
      <div className="text-center py-12">
        <div className="text-lg text-gray-900">Загрузка...</div>
      </div>
    );
  }

  if (!hotel) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500 mb-4">Отель не найден</p>
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
      {/* Header */}
      <div className="bg-white rounded-lg border border-gray-200 p-4 sm:p-6">
        <div className="flex items-center justify-between mb-4 ">
          <button
            onClick={onBack}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 font-semibold"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          {!editing && (
            <div className="flex sm:flex-row flex-col gap-2">
              <button
                onClick={() => setEditing(true)}
                className="px-4 py-2 bg-yellow-500 hover:bg-yellow-600 text-white rounded-lg text-sm font-semibold flex items-center gap-2"
              >
                <Edit className="w-4 h-4" />
                Редактировать
              </button>
              <button
                onClick={handleDelete}
                className="px-4 py-2 bg-pink-900 hover:bg-pink-950 text-white rounded-lg text-sm font-semibold flex items-center gap-2"
              >
                <Trash2 className="w-4 h-4" />
                Удалить
              </button>
            </div>
          )}
          {editing && (
            <div className="flex gap-2">
              <button
                onClick={handleCancel}
                className="px-4 py-2 bg-gray-300 hover:bg-gray-400 text-gray-700 rounded-lg text-sm font-semibold flex items-center gap-2"
              >
                <X className="w-4 h-4" />
                Отмена
              </button>
              <button
                onClick={handleSave}
                className="px-4 py-2 bg-gray-900 hover:bg-gray-800 text-white rounded-lg text-sm font-semibold flex items-center gap-2"
              >
                <Save className="w-4 h-4" />
                Сохранить
              </button>
            </div>
          )}
        </div>

        {/* Hotel Image */}
        <div className="mb-6">
          {imagePreview ? (
            <div className="relative w-full h-64 sm:h-96 rounded-lg overflow-hidden border-2 border-gray-300">
              <img
                src={imagePreview}
                alt={hotel.name}
                className="w-full h-full object-cover"
              />
              {editing && (
                <button
                  onClick={handleRemoveImage}
                  className="absolute top-2 right-2 bg-pink-900 hover:bg-pink-950 text-white rounded-full p-2"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
          ) : (
            <div className="w-full h-64 sm:h-96 rounded-lg bg-gray-200 flex items-center justify-center border-2 border-gray-300">
              <Building2 className="w-16 h-16 text-gray-400" />
            </div>
          )}
          {editing && (
            <div className="mt-4">
              <label className="block text-sm font-semibold mb-2">Загрузить фото отеля</label>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                disabled={uploading}
                className="w-full px-3 py-2 border-2 border-gray-300 rounded-lg focus:border-gray-900 focus:outline-none disabled:opacity-50"
              />
              {uploading && (
                <p className="text-xs text-gray-500 mt-1">Загрузка изображения...</p>
              )}
              <p className="text-xs text-gray-500 mt-1">
                Максимальный размер файла: 5MB. Поддерживаемые форматы: JPG, PNG, GIF, WebP.
              </p>
            </div>
          )}
        </div>

        {/* Hotel Information */}
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Название <span className="text-red-500">*</span>
            </label>
            {editing ? (
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-gray-900 focus:outline-none text-lg"
                required
              />
            ) : (
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">{hotel.name}</h1>
            )}
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Адрес <span className="text-red-500">*</span>
            </label>
            {editing ? (
              <input
                type="text"
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-gray-900 focus:outline-none"
                required
              />
            ) : (
              <p className="text-base sm:text-lg text-gray-700">{hotel.address}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Описание</label>
            {editing ? (
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows={4}
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-gray-900 focus:outline-none"
              />
            ) : (
              <p className="text-sm sm:text-base text-gray-600 whitespace-pre-wrap">
                {hotel.description || <span className="text-gray-400">Описание не указано</span>}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Количество этажей <span className="text-red-500">*</span>
            </label>
            {editing ? (
              <select
                value={formData.floors}
                onChange={(e) => setFormData({ ...formData, floors: parseInt(e.target.value) || 3 })}
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-gray-900 focus:outline-none"
                required
              >
                <option value={1}>1 этаж</option>
                <option value={2}>2 этажа</option>
                <option value={3}>3 этажа</option>
                <option value={4}>4 этажа</option>
              </select>
            ) : (
              <p className="text-base sm:text-lg text-gray-700 font-semibold">
                {hotel.floors || 0} {(hotel.floors || 0) === 1 ? 'этаж' : (hotel.floors || 0) < 5 ? 'этажа' : 'этажей'}
              </p>
            )}
            {editing && (
              <p className="text-xs text-gray-500 mt-1">
                Выберите количество этажей в отеле. Это определит доступные этажи для размещения комнат.
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Этаж EG (первый этаж)
            </label>
            {editing ? (
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.hasEGFloor}
                  onChange={(e) => setFormData({ ...formData, hasEGFloor: e.target.checked })}
                  className="w-4 h-4 text-gray-700 border-gray-300 rounded focus:ring-gray-500"
                />
                <span className="text-sm">
                  Есть этаж EG (первый этаж)
                </span>
              </label>
            ) : (
              <p className="text-base sm:text-lg text-gray-700 font-semibold">
                {hotel.hasEGFloor !== false ? 'Есть этаж EG' : 'Нет этажа EG (начинается с 1OG)'}
              </p>
            )}
            {editing && (
              <p className="text-xs text-gray-500 mt-1">
                Если отмечено, отель начинается с этажа EG. Если не отмечено, отель начинается с этажа 1OG.
              </p>
            )}
          </div>
        </div>
      </div>

      {/* План этажа */}
      <div className="bg-white rounded-lg border border-gray-200 p-4 sm:p-6">
        <div className="mb-4">
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900 flex items-center gap-2">
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
                      : 'bg-white text-gray-700 border border-gray-200 hover:bg-gray-50'
                  }`}
                >
                  {floor}
                </button>
              ))}
            </div>
          )}

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
            />
          )}
        </div>
      </div>

      {/* Модальное окно подтверждения удаления */}
      {showDeleteModal && hotel && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Подтверждение удаления отеля</h2>
            
            <div className="space-y-4">
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <p className="text-sm text-red-800 font-semibold mb-2">
                  ⚠️ Внимание! Это действие необратимо.
                </p>
                <p className="text-sm text-red-700">
                  При удалении отеля <strong>"{hotel.name}"</strong> будут безвозвратно удалены:
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
    </div>
  );
}

