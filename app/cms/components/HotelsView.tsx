'use client';

import { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, Building2, ArrowRight } from 'lucide-react';
import { api } from '@/lib/api';
import type { Hotel } from '@/types';
import HotelModal from './HotelModal';
import HotelDetailView from './HotelDetailView';

export default function HotelsView({ 
  selectedHotel, 
  onSelectHotel 
}: { 
  selectedHotel: string; 
  onSelectHotel: (id: string) => void;
}) {
  const [hotels, setHotels] = useState<Hotel[]>([]);
  const [loading, setLoading] = useState(true);
  const [showHotelModal, setShowHotelModal] = useState(false);
  const [editingHotel, setEditingHotel] = useState<Hotel | null>(null);
  const [viewingHotelId, setViewingHotelId] = useState<string | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [hotelToDelete, setHotelToDelete] = useState<Hotel | null>(null);
  const [deleteConfirmName, setDeleteConfirmName] = useState('');

  const loadHotels = async () => {
    try {
      setLoading(true);
      const data = await api.getHotels();
      setHotels(data);
      if (data.length > 0 && !selectedHotel) {
        onSelectHotel(data[0].id);
      }
    } catch (error) {
      console.error('Error loading hotels:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadHotels();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleDeleteHotel = async (hotel: Hotel) => {
    setHotelToDelete(hotel);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    if (!hotelToDelete) return;
    
    if (deleteConfirmName.trim() !== hotelToDelete.name.trim()) {
      alert('Название отеля не совпадает. Введите точное название отеля для подтверждения.');
      return;
    }
    
    try {
      await api.deleteHotel(hotelToDelete.id);
      setHotels(hotels.filter(h => h.id !== hotelToDelete.id));
      if (selectedHotel === hotelToDelete.id && hotels.length > 1) {
        onSelectHotel(hotels.find(h => h.id !== hotelToDelete.id)?.id || '');
      }
      setShowDeleteModal(false);
      setHotelToDelete(null);
      setDeleteConfirmName('');
    } catch (error) {
      alert('Ошибка при удалении отеля');
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
      await loadHotels();
    } catch (error) {
      alert('Ошибка при сохранении отеля');
    }
  };

  if (loading) {
    return <div className="text-center py-12">Загрузка...</div>;
  }

  // Если выбран отель для просмотра, показываем детальную страницу
  if (viewingHotelId) {
    return (
      <HotelDetailView
        hotelId={viewingHotelId}
        onBack={() => setViewingHotelId(null)}
        onHotelUpdate={loadHotels}
      />
    );
  }

  return (
    <div className="space-y-4 sm:space-y-6">
      <div className="bg-white rounded-lg shadow-sm p-4 sm:p-6 border border-gray-200">
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
            <div key={hotel.id} className="bg-white border-2 border-gray-200 rounded-lg overflow-hidden hover:border-gray-300 transition-colors">
              <div className="w-full h-48 overflow-hidden cursor-pointer" onClick={() => setViewingHotelId(hotel.id)}>
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
              <div className="p-4 sm:p-6">
                <h3 
                  className="text-lg sm:text-xl font-bold text-gray-900 mb-1 sm:mb-2 cursor-pointer hover:text-gray-700"
                  onClick={() => setViewingHotelId(hotel.id)}
                >
                  {hotel.name}
                </h3>
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
                    onClick={() => setViewingHotelId(hotel.id)}
                    className="flex-1 bg-black hover:bg-black-90 text-white py-1.5 sm:py-2 rounded-lg text-xs sm:text-sm font-semibold flex items-center justify-center gap-1"
                  >
                    <span className="hidden sm:inline">Открыть</span>
                    <span className="sm:hidden">Открыть</span>
                    <ArrowRight className="w-3 h-3 sm:w-4 sm:h-4" />
                  </button>
                  <button
                    onClick={() => {
                      setEditingHotel(hotel);
                      setShowHotelModal(true);
                    }}
                    className="bg-yellow-500 hover:bg-yellow-600 text-white py-1.5 sm:py-2 rounded-lg text-xs sm:text-sm font-semibold flex items-center justify-center gap-1 px-2 sm:px-3"
                    title="Быстрое редактирование"
                  >
                    <Edit className="w-3 h-3 sm:w-4 sm:h-4" />
                  </button>
                  <button
                    onClick={() => handleDeleteHotel(hotel)}
                    className="bg-pink-900 hover:bg-pink-950 text-white py-1.5 sm:py-2 rounded-lg text-xs sm:text-sm font-semibold flex items-center justify-center gap-1 px-2 sm:px-3"
                    title="Удалить"
                  >
                    <Trash2 className="w-3 h-3 sm:w-4 sm:h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

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

      {/* Модальное окно подтверждения удаления */}
      {showDeleteModal && hotelToDelete && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Подтверждение удаления отеля</h2>
            
            <div className="space-y-4">
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <p className="text-sm text-red-800 font-semibold mb-2">
                  ⚠️ Внимание! Это действие необратимо.
                </p>
                <p className="text-sm text-red-700">
                  При удалении отеля <strong>"{hotelToDelete.name}"</strong> будут безвозвратно удалены:
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
                  placeholder={hotelToDelete.name}
                  className="w-full px-3 py-2 border-2 border-gray-300 rounded-lg focus:border-gray-900 focus:outline-none"
                  autoFocus
                />
                <p className="text-xs text-gray-500 mt-1">
                  Введите: <strong>{hotelToDelete.name}</strong>
                </p>
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <button
                onClick={() => {
                  setShowDeleteModal(false);
                  setHotelToDelete(null);
                  setDeleteConfirmName('');
                }}
                className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-700 py-2 rounded-lg font-semibold"
              >
                Отмена
              </button>
              <button
                onClick={confirmDelete}
                disabled={deleteConfirmName.trim() !== hotelToDelete.name.trim()}
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

