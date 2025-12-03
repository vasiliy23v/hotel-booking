'use client';

import { useState, useEffect } from 'react';
import { X, GripVertical, Save } from 'lucide-react';
import { api } from '@/lib/api';
import type { Hotel } from '@/types';

interface HotelOrderModalProps {
  hotels: Hotel[];
  onClose: () => void;
  onSave: () => void;
}

export default function HotelOrderModal({ hotels, onClose, onSave }: HotelOrderModalProps) {
  const [orderedHotels, setOrderedHotels] = useState<Hotel[]>([]);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    // Сортируем отели по displayOrder, затем по дате создания
    const sorted = [...hotels].sort((a, b) => {
      const aOrder = a.displayOrder ?? 999999;
      const bOrder = b.displayOrder ?? 999999;
      if (aOrder !== bOrder) return aOrder - bOrder;
      return 0;
    });
    setOrderedHotels(sorted);
  }, [hotels]);

  const moveHotel = (index: number, direction: 'up' | 'down') => {
    const newOrder = [...orderedHotels];
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    
    if (targetIndex < 0 || targetIndex >= newOrder.length) return;
    
    [newOrder[index], newOrder[targetIndex]] = [newOrder[targetIndex], newOrder[index]];
    setOrderedHotels(newOrder);
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      // Обновляем displayOrder для каждого отеля
      const updatePromises = orderedHotels.map((hotel, index) => {
        const newOrder = index + 1;
        if (hotel.displayOrder !== newOrder) {
          return api.updateHotel(hotel.id, { displayOrder: newOrder });
        }
        return Promise.resolve();
      });
      
      await Promise.all(updatePromises);
      onSave();
      onClose();
    } catch (error) {
      console.error('Error saving hotel order:', error);
      alert('Ошибка при сохранении порядка отелей');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 pb-20 lg:pb-4">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[calc(90vh-80px)] lg:max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 sm:p-6 border-b border-gray-200">
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900">
            Настройка порядка отображения отелей
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 light:text-gray-600 dark:text-gray-600" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6">
          <p className="text-sm light:text-gray-600 dark:text-gray-600 mb-4">
            Перемещайте отели вверх или вниз, чтобы изменить порядок их отображения у пользователей.
          </p>
          
          <div className="space-y-2">
            {orderedHotels.map((hotel, index) => (
              <div
                key={hotel.id}
                className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg border border-gray-200"
              >
                <div className="flex items-center gap-2 shrink-0">
                  <GripVertical className="w-5 h-5 text-gray-400" />
                  <span className="text-sm font-semibold light:text-gray-600 dark:text-gray-600 w-8 text-center">
                    {index + 1}
                  </span>
                </div>
                
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-gray-900 truncate">{hotel.name}</h3>
                  <p className="text-xs light:text-gray-600 dark:text-gray-600 truncate">{hotel.address}</p>
                </div>
                
                <div className="flex gap-1 shrink-0">
                  <button
                    onClick={() => moveHotel(index, 'up')}
                    disabled={index === 0}
                    className="px-2 py-1 bg-gray-200 hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed rounded text-sm font-semibold transition-colors"
                    title="Вверх"
                  >
                    ↑
                  </button>
                  <button
                    onClick={() => moveHotel(index, 'down')}
                    disabled={index === orderedHotels.length - 1}
                    className="px-2 py-1 bg-gray-200 hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed rounded text-sm font-semibold transition-colors"
                    title="Вниз"
                  >
                    ↓
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="flex gap-3 p-4 sm:p-6 border-t border-gray-200">
          <button
            onClick={onClose}
            className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-700 py-2 rounded-lg font-semibold transition-colors"
          >
            Отмена
          </button>
          <button
            onClick={handleSave}
            disabled={saving}
            className="flex-1 bg-gray-900 hover:bg-gray-800 text-white py-2 rounded-lg font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            <Save className="w-4 h-4" />
            {saving ? 'Сохранение...' : 'Сохранить'}
          </button>
        </div>
      </div>
    </div>
  );
}

