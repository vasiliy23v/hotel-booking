'use client';

import { useState, useEffect } from 'react';
import { DatePicker } from '@/components/ui/date-picker';
import { Calendar } from 'lucide-react';
import { api } from '@/lib/api';
import type { User } from '@/types';

interface DatesStepProps {
  checkIn: string;
  checkOut: string;
  onCheckInChange: (date: string) => void;
  onCheckOutChange: (date: string) => void;
  availabilityError?: string | null;
  isAvailable?: boolean | null;
  checkingAvailability?: boolean;
  minDate?: Date;
  currentUser?: User | null;
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
  currentUser,
}: DatesStepProps) {
  const [allowedDateRanges, setAllowedDateRanges] = useState<Array<{ startDate: string; endDate: string }>>([]);
  const [defaultMonth, setDefaultMonth] = useState<Date | undefined>(undefined);
  const checkInDate = checkIn ? new Date(checkIn) : undefined;
  const checkOutDate = checkOut ? new Date(checkOut) : undefined;
  
  // Developer и manager могут бронировать на любые даты
  const canBookAnyDate = currentUser?.role === 'developer' || currentUser?.role === 'manager';

  useEffect(() => {
    // Загружаем активные диапазоны дат (только если пользователь НЕ developer/manager)
    const loadDateRanges = async () => {
      if (canBookAnyDate) {
        // Developer и manager не ограничены диапазонами
        setAllowedDateRanges([]);
        return;
      }
      
      try {
        const ranges = await api.getBookingDateRanges(true);
        const dateRanges = ranges.map((r) => ({
          startDate: r.startDate instanceof Date ? r.startDate.toISOString().split('T')[0] : r.startDate,
          endDate: r.endDate instanceof Date ? r.endDate.toISOString().split('T')[0] : r.endDate,
        }));
        setAllowedDateRanges(dateRanges);

        // Находим ближайшую доступную дату и автоматически выбираем её
        if (dateRanges.length > 0 && !checkIn) {
          const now = new Date();
          const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
          
          // Ищем первый диапазон, который еще не закончился
          const upcomingRange = dateRanges.find((range) => {
            const endDate = new Date(range.endDate);
            return endDate >= today;
          });
          
          if (upcomingRange) {
            const rangeStartDate = new Date(upcomingRange.startDate);
            
            // Определяем ближайшую доступную дату (сегодня или начало диапазона)
            let nearestDate: Date;
            if (rangeStartDate > today) {
              // Если диапазон еще не начался, берем его начало
              nearestDate = rangeStartDate;
            } else {
              // Если диапазон уже начался, берем сегодня
              nearestDate = today;
            }
            
            // Устанавливаем defaultMonth для календаря
            setDefaultMonth(nearestDate);
            
            // Автоматически выбираем ближайшую доступную дату для checkIn
            const dateStr = `${nearestDate.getFullYear()}-${String(nearestDate.getMonth() + 1).padStart(2, '0')}-${String(nearestDate.getDate()).padStart(2, '0')}`;
            onCheckInChange(dateStr);
            
            // Автоматически устанавливаем checkOut на следующий день
            const nextDay = new Date(nearestDate);
            nextDay.setDate(nextDay.getDate() + 1);
            const nextDayStr = `${nextDay.getFullYear()}-${String(nextDay.getMonth() + 1).padStart(2, '0')}-${String(nextDay.getDate()).padStart(2, '0')}`;
            onCheckOutChange(nextDayStr);
          }
        }
      } catch (error) {
        console.error('Error loading date ranges:', error);
        // Если не удалось загрузить, разрешаем все даты (для обратной совместимости)
      }
    };
    loadDateRanges();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [canBookAnyDate]);

  return (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <Calendar className="w-12 h-12 text-gray-400 dark:text-muted-foreground mx-auto mb-2" />
        <h2 className="text-xl font-medium text-gray-900 dark:text-foreground">Выберите даты</h2>
        <p className="text-sm text-gray-500 dark:text-muted-foreground mt-1">Укажите даты заезда и выезда</p>
      </div>

      {canBookAnyDate && (
        <div className="p-4 bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800 rounded-lg">
          <p className="text-sm text-blue-800 dark:text-blue-300">
            🔓 <strong>{currentUser?.role === 'developer' ? 'Разработчик' : 'Менеджер'}:</strong> Вы можете бронировать на любые даты без ограничений по диапазонам.
          </p>
        </div>
      )}

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
            allowedDateRanges={canBookAnyDate ? [] : allowedDateRanges}
            defaultMonth={defaultMonth}
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
            allowedDateRanges={canBookAnyDate ? [] : allowedDateRanges}
            defaultMonth={defaultMonth}
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

