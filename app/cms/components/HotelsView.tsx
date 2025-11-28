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

  const handleDeleteHotel = async (id: string) => {
    if (!confirm('Вы уверены, что хотите удалить этот отель?')) return;
    
    try {
      await api.deleteHotel(id);
      setHotels(hotels.filter(h => h.id !== id));
      if (selectedHotel === id && hotels.length > 1) {
        onSelectHotel(hotels.find(h => h.id !== id)?.id || '');
      }
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
                    onClick={() => handleDeleteHotel(hotel.id)}
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
    </div>
  );
}

