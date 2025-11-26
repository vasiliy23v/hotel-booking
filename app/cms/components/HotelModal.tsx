'use client';

import { useState } from 'react';
import type { Hotel } from '@/types';

interface HotelModalProps {
  hotel: Hotel | null;
  onSave: (hotelData: Partial<Hotel> & { name: string; address: string }) => void;
  onClose: () => void;
}

export default function HotelModal({ hotel, onSave, onClose }: HotelModalProps) {
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

