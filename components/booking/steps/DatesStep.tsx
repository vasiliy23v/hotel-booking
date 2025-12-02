'use client';

import { DatePicker } from '@/components/ui/date-picker';
import { Calendar } from 'lucide-react';

interface DatesStepProps {
  checkIn: string;
  checkOut: string;
  onCheckInChange: (date: string) => void;
  onCheckOutChange: (date: string) => void;
  availabilityError?: string | null;
  isAvailable?: boolean | null;
  checkingAvailability?: boolean;
  minDate?: Date;
}

export function DatesStep({
  checkIn,
  checkOut,
  onCheckInChange,
  onCheckOutChange,
  availabilityError,
  isAvailable,
  checkingAvailability,
  minDate,
}: DatesStepProps) {
  const checkInDate = checkIn ? new Date(checkIn) : undefined;
  const checkOutDate = checkOut ? new Date(checkOut) : undefined;

  return (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <Calendar className="w-12 h-12 text-gray-400 dark:text-muted-foreground mx-auto mb-2" />
        <h2 className="text-xl font-medium text-gray-900 dark:text-foreground">Выберите даты</h2>
        <p className="text-sm text-gray-500 dark:text-muted-foreground mt-1">Укажите даты заезда и выезда</p>
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-foreground mb-2">
            Дата заезда <span className="text-red-500">*</span>
          </label>
          <DatePicker
            date={checkInDate}
            onSelect={(date) => {
              if (date) {
                const newCheckIn = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
                onCheckInChange(newCheckIn);
                if (checkOut && newCheckIn >= checkOut) {
                  const nextDay = new Date(date);
                  nextDay.setDate(nextDay.getDate() + 1);
                  onCheckOutChange(`${nextDay.getFullYear()}-${String(nextDay.getMonth() + 1).padStart(2, '0')}-${String(nextDay.getDate()).padStart(2, '0')}`);
                }
              } else {
                onCheckInChange('');
              }
            }}
            placeholder="Выберите дату заезда"
            minDate={minDate}
            className="w-full"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-foreground mb-2">
            Дата выезда <span className="text-red-500">*</span>
          </label>
          <DatePicker
            date={checkOutDate}
            onSelect={(date) => {
              if (date) {
                const newCheckOut = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
                if (checkIn && newCheckOut <= checkIn) {
                  const nextDay = new Date(date);
                  nextDay.setDate(nextDay.getDate() + 1);
                  onCheckOutChange(`${nextDay.getFullYear()}-${String(nextDay.getMonth() + 1).padStart(2, '0')}-${String(nextDay.getDate()).padStart(2, '0')}`);
                } else {
                  onCheckOutChange(newCheckOut);
                }
              } else {
                onCheckOutChange('');
              }
            }}
            placeholder="Выберите дату выезда"
            minDate={checkIn ? new Date(new Date(checkIn).getTime() + 86400000) : undefined}
            className="w-full"
          />
        </div>

        {checkingAvailability && (
          <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-muted-foreground">
            <div className="w-4 h-4 border-2 border-gray-300 dark:border-border border-t-gray-900 dark:border-t-primary rounded-full animate-spin"></div>
            <span>Проверка доступности...</span>
          </div>
        )}

        {availabilityError && (
          <div className="p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg text-sm text-red-700 dark:text-red-400">
            {availabilityError}
          </div>
        )}

        {isAvailable === true && checkIn && checkOut && (
          <div className="p-3 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg text-sm text-green-700 dark:text-green-400">
            Комната доступна на выбранные даты
          </div>
        )}
      </div>
    </div>
  );
}

