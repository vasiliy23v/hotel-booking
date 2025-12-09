'use client';

import { FileText } from 'lucide-react';

interface NotesStepProps {
  notes: string;
  onNotesChange: (notes: string) => void;
  roomNumber?: string;
  hotelName?: string;
  checkIn?: string;
  checkOut?: string;
  nights?: number;
  roomPrice?: number;
  pricePerPerson?: boolean;
  guestsCount?: number;
}

export function NotesStep({
  notes,
  onNotesChange,
  roomNumber,
  hotelName,
  checkIn,
  checkOut,
  nights,
  roomPrice,
  pricePerPerson,
  guestsCount,
}: NotesStepProps) {
  // Вычисляем общую сумму
  // Для perPerson комнат: цена * количество ночей * (количество гостей + 1 основной пользователь)
  // Для обычных комнат: цена * количество ночей
  const totalPrice = roomPrice && nights ? 
    (pricePerPerson && guestsCount !== undefined ? roomPrice * nights * guestsCount : roomPrice * nights) 
    : null;
  return (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <FileText className="w-12 h-12 text-gray-400 dark:text-muted-foreground mx-auto mb-2" />
        <h2 className="text-xl font-medium text-gray-900 dark:text-foreground">Дополнительная информация</h2>
        <p className="text-sm text-gray-500 dark:text-muted-foreground mt-1">Оставьте примечания к бронированию</p>
      </div>

      {/* Booking Summary */}
      {(roomNumber || hotelName || checkIn || checkOut) && (
        <div className="p-4 bg-gray-50 dark:bg-muted rounded-lg border border-gray-200 dark:border-border">
          <h3 className="text-sm font-medium text-gray-900 dark:text-foreground mb-3">Сводка бронирования</h3>
          <div className="space-y-2 text-sm text-gray-600 dark:text-muted-foreground">
            {hotelName && (
              <div className="flex justify-between">
                <span>Отель:</span>
                <span className="font-medium">{hotelName}</span>
              </div>
            )}
            {roomNumber && (
              <div className="flex justify-between">
                <span>Комната:</span>
                <span className="font-medium">#{roomNumber}</span>
              </div>
            )}
            {checkIn && (
              <div className="flex justify-between">
                <span>Заезд:</span>
                <span className="font-medium">
                  {new Date(checkIn).toLocaleDateString('ru-RU')}
                </span>
              </div>
            )}
            {checkOut && (
              <div className="flex justify-between">
                <span>Выезд:</span>
                <span className="font-medium">
                  {new Date(checkOut).toLocaleDateString('ru-RU')}
                </span>
              </div>
            )}
            {nights && (
              <div className="flex justify-between">
                <span>Ночей:</span>
                <span className="font-medium">{nights}</span>
              </div>
            )}
            {roomPrice && (
              <div className="flex justify-between">
                <span>Цена за ночь:</span>
                <span className="font-medium">
                  {roomPrice.toFixed(2)}€{pricePerPerson ? ' p.P.' : ''}
                </span>
              </div>
            )}
            {pricePerPerson && guestsCount && (
              <div className="flex justify-between">
                <span>Количество людей:</span>
                <span className="font-medium">{guestsCount} (вы + гости)</span>
              </div>
            )}
            {totalPrice && (
              <>
                <div className="flex justify-between pt-2 mt-2 border-t border-gray-300 dark:border-border">
                  <span className="font-semibold text-gray-900 dark:text-foreground">Итого:</span>
                  <span className="font-bold text-xl text-blue-600 dark:text-blue-400">
                    {totalPrice.toFixed(2)}€
                  </span>
                </div>
                {pricePerPerson && guestsCount && roomPrice ? (
                  <div className="text-xs text-gray-500 dark:text-muted-foreground mt-1">
                    {roomPrice.toFixed(2)}€ × {guestsCount} чел. × {nights} ноч. = {totalPrice.toFixed(2)}€
                  </div>
                ) : roomPrice ? (
                  <div className="text-xs text-gray-500 dark:text-muted-foreground mt-1">
                    {roomPrice.toFixed(2)}€ × {nights} ноч. = {totalPrice.toFixed(2)}€
                  </div>
                ) : null}
              </>
            )}
          </div>
        </div>
      )}

      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-foreground mb-2">
          Примечания
        </label>
        <textarea
          value={notes}
          onChange={(e) => onNotesChange(e.target.value)}
          rows={4}
          placeholder="Дополнительная информация о бронировании..."
          className="w-full px-3 py-2 border border-gray-300 dark:border-border rounded-lg bg-white dark:bg-input text-gray-900 dark:text-foreground text-sm focus:border-gray-900 dark:focus:border-ring focus:outline-none resize-none"
        />
      </div>
    </div>
  );
}

