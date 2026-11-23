'use client';
/* eslint-disable @next/next/no-img-element */

import { useState, useEffect } from 'react';
import { Plus, Building2, Settings } from 'lucide-react';
import { api } from '@/lib/api';
import type { Hotel } from '@/types';
import HotelModal from './HotelModal';
import HotelDetailView from './HotelDetailView';
import HotelOrderModal from './HotelOrderModal';

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
  const [showOrderModal, setShowOrderModal] = useState(false);

  const loadHotels = async () => {
    try {
      setLoading(true);
      const data = await api.getHotels();
      
      // Отели уже отсортированы по displayOrder в API
      setHotels(data);
    } catch (error) {
      console.error('Error loading hotels:', error);
      alert('Ошибка при загрузке отелей');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadHotels();
  }, []);

  // Синхронизируем viewingHotelId с selectedHotel из сайдбара
  useEffect(() => {
    if (selectedHotel && selectedHotel !== viewingHotelId) {
      setViewingHotelId(selectedHotel);
    } else if (!selectedHotel && viewingHotelId) {
      // Если selectedHotel сброшен (например, выбрали "Все отели"), закрываем детальный вид
      setViewingHotelId(null);
    }
  }, [selectedHotel, viewingHotelId]);

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
      console.error('Error deleting hotel:', error);
      alert('Ошибка при удалении отеля');
    }
  };

  const handleSaveHotel = async (hotelData: Partial<Hotel> & { name: string; address: string }) => {
    try {
      if (editingHotel) {
        await api.updateHotel(editingHotel.id, {
          ...hotelData,
          description: hotelData.description || undefined,
          floors: hotelData.floors || undefined,
          displayOrder: hotelData.displayOrder || undefined,
          image: typeof hotelData.image === 'string' ? Buffer.from(hotelData.image) : (hotelData.image || undefined),
        });
        setHotels(hotels.map(h => h.id === editingHotel.id ? { ...h, ...hotelData } : h));
      } else {
        const newHotel = await api.createHotel({
          ...hotelData,
          description: hotelData.description || undefined,
          floors: hotelData.floors || undefined,
          displayOrder: hotelData.displayOrder || undefined,
          image: typeof hotelData.image === 'string' ? Buffer.from(hotelData.image) : (hotelData.image || undefined),
        });
        setHotels([...hotels, newHotel]);
      }
      setShowHotelModal(false);
      setEditingHotel(null);
      await loadHotels();
    } catch (error) {
      console.error('Error saving hotel:', error);
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
        onBack={() => {
          setViewingHotelId(null);
          onSelectHotel(''); // Сбрасываем выбор в сайдбаре
        }}
        onHotelUpdate={loadHotels}
      />
    );
  }

  return (
    <div className="space-y-4 sm:space-y-6">
      <div className="mx-auto max-w-[1400px]">
        <div className="mb-5 flex justify-end gap-2">
          <button
            onClick={() => setShowOrderModal(true)}
            className="flex h-12 items-center gap-2 rounded-full px-5 text-base font-medium text-[#6b4a36] transition-colors hover:bg-[#f1e4d6]"
            title="Настроить порядок отображения отелей"
          >
            <Settings className="h-5 w-5" />
            <span className="hidden sm:inline">Порядок</span>
          </button>
          <button
            onClick={() => {
              setEditingHotel(null);
              setShowHotelModal(true);
            }}
            className="flex h-12 items-center gap-2 rounded-full bg-[#6b4a36] px-6 text-base font-semibold text-white transition-colors hover:bg-[#5a3b28]"
          >
            <Plus className="h-5 w-5" />
            Добавить
          </button>
        </div>

        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3">
          {hotels.map(hotel => {
            const open = () => {
              setViewingHotelId(hotel.id);
              onSelectHotel(hotel.id);
            };
            return (
              <div key={hotel.id} className="group flex flex-col">
                <div
                  className="aspect-[3/2] w-full cursor-pointer overflow-hidden rounded-2xl bg-[#f1e4d6]"
                  onClick={open}
                >
                  {hotel.image && typeof hotel.image === 'string' ? (
                    <img
                      src={hotel.image}
                      alt={hotel.name}
                      className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.03]"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center">
                      <Building2 className="h-14 w-14 text-[#c9b4a0]" />
                    </div>
                  )}
                </div>
                <div className="mt-4 min-w-0 cursor-pointer" onClick={open}>
                  <h3 className="text-2xl font-semibold text-[#2a1d15]">{hotel.name}</h3>
                  <p className="mt-1 text-lg text-[#6f5a4c]">
                    {hotel.address}
                    {hotel.floors ? ` · ${hotel.floors} ${hotel.floors === 1 ? 'этаж' : hotel.floors < 5 ? 'этажа' : 'этажей'}` : ''}
                  </p>
                </div>
                <div className="mt-4 flex items-center gap-3 text-lg font-semibold">
                  <button
                    onClick={() => {
                      setEditingHotel(hotel);
                      setShowHotelModal(true);
                    }}
                    className="h-12 rounded-full border-2 border-[#6b4a36] px-6 text-[#5a3b28] transition-colors hover:bg-[#f1e4d6]"
                  >
                    Изменить
                  </button>
                  <button
                    onClick={() => handleDeleteHotel(hotel)}
                    className="h-12 rounded-full border-2 border-[#c4622d] px-6 text-[#a8431f] transition-colors hover:bg-[#fde9da]"
                  >
                    Удалить
                  </button>
                </div>
              </div>
            );
          })}
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

      {showOrderModal && (
        <HotelOrderModal
          hotels={hotels}
          onClose={() => setShowOrderModal(false)}
          onSave={loadHotels}
        />
      )}

      {/* Модальное окно подтверждения удаления */}
      {showDeleteModal && hotelToDelete && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-card rounded-lg max-w-md w-full p-6">
            <h2 className="text-xl font-bold text-gray-900 dark:text-foreground mb-4">Подтверждение удаления отеля</h2>
            
            <div className="space-y-4">
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <p className="text-sm text-red-800 font-semibold mb-2">
                  ⚠️ Внимание! Это действие необратимо.
                </p>
                <p className="text-sm text-red-700">
                  При удалении отеля <strong>&quot;{hotelToDelete.name}&quot;</strong> будут безвозвратно удалены:
                </p>
                <ul className="text-sm text-red-700 mt-2 list-disc list-inside space-y-1">
                  <li>Все комнаты отеля</li>
                  <li>Все бронирования, связанные с этими комнатами</li>
                  <li>Вся информация об отеле</li>
                </ul>
              </div>

              <div>
                <label className="block text-sm font-semibold mb-2 text-gray-700 dark:text-foreground">
                  Для подтверждения введите название отеля: <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={deleteConfirmName}
                  onChange={(e) => setDeleteConfirmName(e.target.value)}
                  placeholder={hotelToDelete.name}
                  className="w-full px-3 py-2 border-2 border-gray-300 dark:border-border rounded-lg focus:border-gray-900 dark:focus:border-ring focus:outline-none bg-white dark:bg-input text-gray-900 dark:text-foreground"
                  autoFocus
                />
                <p className="text-xs text-gray-500 dark:text-muted-foreground mt-1">
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
                className="flex-1 bg-gray-300 dark:bg-muted hover:bg-gray-400 dark:hover:bg-accent text-gray-700 dark:text-foreground py-2 rounded-lg font-semibold"
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

