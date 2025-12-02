'use client';

import { Users, Plus, X, Upload } from 'lucide-react';
import type { Guest } from '@/types';
import { useState } from 'react';

interface GuestsStepProps {
  guests: Guest[];
  onGuestsChange: (guests: Guest[]) => void;
  maxCapacity?: number;
  onGuestImageUpload?: (index: number, file: File) => Promise<void>;
}

export function GuestsStep({
  guests,
  onGuestsChange,
  maxCapacity = 4,
  onGuestImageUpload,
}: GuestsStepProps) {
  const [uploadingIndex, setUploadingIndex] = useState<number | null>(null);

  const updateGuest = (index: number, field: keyof Guest, value: string) => {
    const updatedGuests = [...guests];
    updatedGuests[index] = { ...updatedGuests[index], [field]: value };
    onGuestsChange(updatedGuests);
  };

  const addGuest = () => {
    if (guests.length < maxCapacity) {
      onGuestsChange([...guests, { name: '', email: '', phone: '' }]);
    }
  };

  const removeGuest = (index: number) => {
    onGuestsChange(guests.filter((_, i) => i !== index));
  };

  const handleImageUpload = async (index: number, file: File) => {
    if (onGuestImageUpload) {
      setUploadingIndex(index);
      try {
        await onGuestImageUpload(index, file);
      } finally {
        setUploadingIndex(null);
      }
    }
  };

  return (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <Users className="w-12 h-12 text-gray-400 dark:text-muted-foreground mx-auto mb-2" />
        <h2 className="text-xl font-medium text-gray-900 dark:text-foreground">Гости</h2>
        <p className="text-sm text-gray-500 dark:text-muted-foreground mt-1">Добавьте информацию о гостях</p>
      </div>

      <div className="space-y-4">
        {guests.map((guest, idx) => (
          <div key={idx} className="p-4 border border-gray-200 dark:border-border rounded-lg">
            <div className="flex items-start gap-4">
              {/* Avatar */}
              <div className="flex-shrink-0">
                <label className="relative cursor-pointer">
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) handleImageUpload(idx, file);
                    }}
                    disabled={uploadingIndex === idx}
                  />
                  {guest.image ? (
                    <img
                      src={guest.image}
                      alt={guest.name || `Гость ${idx + 1}`}
                      className="w-16 h-16 rounded-full object-cover border-2 border-gray-200 dark:border-border"
                    />
                  ) : (
                    <div className="w-16 h-16 rounded-full bg-gray-100 dark:bg-muted border-2 border-gray-200 dark:border-border flex items-center justify-center">
                      {uploadingIndex === idx ? (
                        <div className="w-6 h-6 border-2 border-gray-400 dark:border-border border-t-gray-900 dark:border-t-primary rounded-full animate-spin"></div>
                      ) : (
                        <Upload className="w-6 h-6 text-gray-400 dark:text-muted-foreground" />
                      )}
                    </div>
                  )}
                </label>
              </div>

              {/* Guest Info */}
              <div className="flex-1 space-y-3">
                <input
                  type="text"
                  value={guest.name}
                  onChange={(e) => updateGuest(idx, 'name', e.target.value)}
                  placeholder="Имя гостя"
                  className="w-full px-3 py-2 border border-gray-300 dark:border-border rounded-lg bg-white dark:bg-input text-gray-900 dark:text-foreground text-sm focus:border-gray-900 dark:focus:border-ring focus:outline-none"
                />
                <input
                  type="email"
                  value={guest.email || ''}
                  onChange={(e) => updateGuest(idx, 'email', e.target.value)}
                  placeholder="Email (необязательно)"
                  className="w-full px-3 py-2 border border-gray-300 dark:border-border rounded-lg bg-white dark:bg-input text-gray-900 dark:text-foreground text-sm focus:border-gray-900 dark:focus:border-ring focus:outline-none"
                />
                <input
                  type="tel"
                  value={guest.phone || ''}
                  onChange={(e) => updateGuest(idx, 'phone', e.target.value)}
                  placeholder="Телефон (необязательно)"
                  className="w-full px-3 py-2 border border-gray-300 dark:border-border rounded-lg bg-white dark:bg-input text-gray-900 dark:text-foreground text-sm focus:border-gray-900 dark:focus:border-ring focus:outline-none"
                />
              </div>

              {/* Remove Button */}
              <button
                type="button"
                onClick={() => removeGuest(idx)}
                className="flex-shrink-0 text-red-500 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>
        ))}

        {guests.length < maxCapacity && (
          <button
            type="button"
            onClick={addGuest}
            className="w-full bg-gray-100 dark:bg-muted hover:bg-gray-200 dark:hover:bg-accent text-gray-700 dark:text-foreground px-4 py-3 rounded-lg text-sm font-medium flex items-center justify-center gap-2 transition-colors"
          >
            <Plus className="w-4 h-4" />
            Добавить гостя
          </button>
        )}
      </div>
    </div>
  );
}

