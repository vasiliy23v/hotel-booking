'use client';

import { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { MultiStepForm } from './MultiStepForm';
import { DatesStep } from './steps/DatesStep';
import { GuestsStep } from './steps/GuestsStep';
import { ContactStep } from './steps/ContactStep';
import { NotesStep } from './steps/NotesStep';
import type { Guest, User, Room } from '@/types';
import { api } from '@/lib/api';

interface BookingFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: BookingFormData) => Promise<void>;
  initialData?: Partial<BookingFormData>;
  room?: Room;
  hotelName?: string;
  currentUser?: User | null;
  mode?: 'create' | 'edit';
  excludeBookingId?: string;
}

export interface BookingFormData {
  checkIn: string;
  checkOut: string;
  guests: Guest[];
  email: string;
  phone: string;
  notes: string;
  manualUserName?: string;
  manualUserPhone?: string;
  includeManager?: boolean; // Учитывать ли менеджера при бронировании
}

export function BookingFormModal({
  isOpen,
  onClose,
  onSubmit,
  initialData,
  room,
  hotelName,
  currentUser,
  mode = 'create',
  excludeBookingId,
}: BookingFormModalProps) {
  const [checkIn, setCheckIn] = useState(initialData?.checkIn || '');
  const [checkOut, setCheckOut] = useState(initialData?.checkOut || '');
  const [guests, setGuests] = useState<Guest[]>(initialData?.guests || []);
  const [email, setEmail] = useState(initialData?.email || currentUser?.email || '');
  const [phone, setPhone] = useState(initialData?.phone || currentUser?.phone || '');
  const [notes, setNotes] = useState(initialData?.notes || '');
  const [manualUserName, setManualUserName] = useState(initialData?.manualUserName || '');
  const [manualUserPhone, setManualUserPhone] = useState(initialData?.manualUserPhone || '');
  const [includeManager, setIncludeManager] = useState(initialData?.includeManager || false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [checkingAvailability, setCheckingAvailability] = useState(false);
  const [availabilityError, setAvailabilityError] = useState<string | null>(null);
  const [isAvailable, setIsAvailable] = useState<boolean | null>(null);

  // Обновление формы при открытии модального окна или изменении данных
  useEffect(() => {
    if (isOpen) {
      setCheckIn(initialData?.checkIn || '');
      setCheckOut(initialData?.checkOut || '');
      setGuests(initialData?.guests || []);
      setEmail(initialData?.email || currentUser?.email || '');
      setPhone(initialData?.phone || currentUser?.phone || '');
      setNotes(initialData?.notes || '');
      setManualUserName(initialData?.manualUserName || '');
      setManualUserPhone(initialData?.manualUserPhone || '');
      setIncludeManager(initialData?.includeManager || false);
      setAvailabilityError(null);
      setIsAvailable(null);
    } else {
      // Сброс формы при закрытии
      setCheckIn('');
      setCheckOut('');
      setGuests([]);
      setEmail('');
      setPhone('');
      setNotes('');
      setManualUserName('');
      setManualUserPhone('');
      setIncludeManager(false);
      setAvailabilityError(null);
      setIsAvailable(null);
    }
  }, [isOpen, initialData, currentUser]);

  // Проверка доступности при изменении дат
  useEffect(() => {
    if (mode === 'edit' && checkIn && checkOut && room?.id) {
      const checkAvailability = async () => {
        setCheckingAvailability(true);
        setAvailabilityError(null);
        try {
          const availability = await api.checkRoomsAvailability(
            [room.id],
            checkIn,
            checkOut,
            excludeBookingId
          );
          const available = availability[room.id] === true;
          setIsAvailable(available);
          if (!available) {
            setAvailabilityError('Комната недоступна на выбранные даты');
          }
        } catch (error) {
          console.error('Error checking availability:', error);
          setAvailabilityError('Ошибка при проверке доступности');
        } finally {
          setCheckingAvailability(false);
        }
      };

      const timeoutId = setTimeout(() => {
        checkAvailability();
      }, 300);

      return () => clearTimeout(timeoutId);
    }
  }, [checkIn, checkOut, room?.id, mode, excludeBookingId]);

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      await onSubmit({
        checkIn,
        checkOut,
        guests,
        email,
        phone,
        notes,
        manualUserName,
        manualUserPhone,
        includeManager,
      });
      onClose();
    } catch (error) {
      console.error('Error submitting booking:', error);
      alert('Ошибка при сохранении бронирования');
    } finally {
      setIsSubmitting(false);
    }
  };

  const calculateNights = () => {
    if (!checkIn || !checkOut) return 0;
    const checkInDate = new Date(checkIn);
    const checkOutDate = new Date(checkOut);
    return Math.ceil((checkOutDate.getTime() - checkInDate.getTime()) / (1000 * 60 * 60 * 24));
  };

  const validateDates = () => {
    if (!checkIn || !checkOut) return false;
    const checkInDate = new Date(checkIn);
    const checkOutDate = new Date(checkOut);
    return checkOutDate > checkInDate;
  };

  const validateContact = () => {
    if (currentUser?.role === 'manager') {
      // Проверяем, что имя заполнено, телефон заполнен И имя содержит только латинские буквы
      const isNameValid = manualUserName && /^[A-Za-z\s-]+$/.test(manualUserName.trim());
      return !!(isNameValid && manualUserPhone);
    }
    return !!phone;
  };

  const steps = [
    {
      title: 'Даты',
      description: 'Выберите даты',
      content: (
        <DatesStep
          checkIn={checkIn}
          checkOut={checkOut}
          onCheckInChange={setCheckIn}
          onCheckOutChange={setCheckOut}
          availabilityError={availabilityError}
          isAvailable={isAvailable}
          checkingAvailability={checkingAvailability}
          currentUser={currentUser}
        />
      ),
      validate: validateDates,
    },
    {
      title: 'Контакты',
      description: 'Контактная информация',
      content: (
        <ContactStep
          email={email}
          phone={phone}
          onEmailChange={setEmail}
          onPhoneChange={setPhone}
          currentUser={currentUser}
          manualUserName={manualUserName}
          manualUserPhone={manualUserPhone}
          onManualUserNameChange={setManualUserName}
          onManualUserPhoneChange={setManualUserPhone}
        />
      ),
      validate: validateContact,
    },
    {
      title: 'Гости',
      description: 'Добавьте гостей',
      content: (
        <GuestsStep
          guests={guests}
          onGuestsChange={setGuests}
          maxCapacity={room?.maxCapacity || 4}
          currentUser={currentUser}
          includeManager={includeManager}
          onIncludeManagerChange={setIncludeManager}
        />
      ),
      validate: () => {
        // Проверяем, что есть хотя бы один гость И все имена валидны
        if (guests.length === 0) return false;
        return guests.every(g => !g.name || /^[A-Za-z\s-]+$/.test(g.name.trim()));
      },
    },
    {
      title: 'Примечания',
      description: 'Дополнительная информация',
      content: (
        <NotesStep
          notes={notes}
          onNotesChange={setNotes}
          roomNumber={room?.number}
          hotelName={hotelName}
          checkIn={checkIn}
          checkOut={checkOut}
          nights={calculateNights()}
          roomPrice={room?.price}
          pricePerPerson={room?.pricePerPerson}
          guestsCount={room?.pricePerPerson ? (guests.length + (currentUser?.role === 'guest' ? 1 : (includeManager ? 1 : 0))) : undefined}
        />
      ),
    },
  ];

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[9999] p-4 pb-20 lg:pb-4" onClick={onClose}>
      <div className="bg-white dark:bg-card rounded-lg max-w-3xl w-full max-h-[calc(90vh-80px)] lg:max-h-[90vh] overflow-y-auto shadow-xl" onClick={(e) => e.stopPropagation()}>
        <div className="p-4 sm:p-6">
          <div className="flex justify-between items-center mb-4 sm:mb-6">
            <h2 className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-foreground">
              {mode === 'edit' ? 'Редактировать бронирование' : 'Новое бронирование'}
            </h2>
            <button
              onClick={onClose}
              className="text-gray-400 dark:text-muted-foreground hover:text-gray-600 dark:hover:text-foreground transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {mode === 'edit' && room && (
            <div className="mb-4 sm:mb-6 p-3 sm:p-4 bg-gray-50 dark:bg-muted rounded-lg border border-gray-200 dark:border-border">
              <div className="grid grid-cols-2 gap-3 sm:gap-4 text-xs sm:text-sm">
                <div>
                  <span className="text-gray-600 dark:text-muted-foreground">Отель:</span>
                  <span className="ml-2 font-medium text-gray-900 dark:text-foreground">{hotelName || '-'}</span>
                </div>
                <div>
                  <span className="text-gray-600 dark:text-muted-foreground">Комната:</span>
                  <span className="ml-2 font-medium text-gray-900 dark:text-foreground">#{room.number}</span>
                </div>
              </div>
            </div>
          )}

          <MultiStepForm
            steps={steps}
            onSubmit={handleSubmit}
            onCancel={onClose}
            submitLabel={mode === 'edit' ? 'Сохранить' : 'Забронировать'}
            cancelLabel="Отмена"
            isSubmitting={isSubmitting}
          />
        </div>
      </div>
    </div>
  );
}

