'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams, useSearchParams } from 'next/navigation';
import { api } from '@/lib/api';
import type { Room, User, Guest, BookingInfo } from '@/types';
import { MultiStepForm } from '@/components/booking/MultiStepForm';
import { DatesStep } from '@/components/booking/steps/DatesStep';
import { GuestsStep } from '@/components/booking/steps/GuestsStep';
import { ContactStep } from '@/components/booking/steps/ContactStep';
import { NotesStep } from '@/components/booking/steps/NotesStep';

export default function BookingPage() {
  const router = useRouter();
  const params = useParams();
  const searchParams = useSearchParams();
  const roomId = params.id as string;

  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [room, setRoom] = useState<Room | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  // Загружаем даты из URL параметров или localStorage
  const [checkIn, setCheckIn] = useState(() => {
    if (typeof window !== 'undefined') {
      const urlCheckIn = searchParams?.get('checkIn');
      if (urlCheckIn) return urlCheckIn;
      const savedCheckIn = localStorage.getItem('dashboard_checkInDate');
      return savedCheckIn || '';
    }
    return '';
  });
  const [checkOut, setCheckOut] = useState(() => {
    if (typeof window !== 'undefined') {
      const urlCheckOut = searchParams?.get('checkOut');
      if (urlCheckOut) return urlCheckOut;
      const savedCheckOut = localStorage.getItem('dashboard_checkOutDate');
      return savedCheckOut || '';
    }
    return '';
  });
  
  // Преобразуем строки в Date объекты для DatePicker
  const checkInDate = checkIn ? new Date(checkIn) : undefined;
  const checkOutDate = checkOut ? new Date(checkOut) : undefined;
  const [guests, setGuests] = useState<Guest[]>([]);
  const [notes, setNotes] = useState('');
  const [manualUserName, setManualUserName] = useState('');
  const [manualUserPhone, setManualUserPhone] = useState('');
  const [checkingAvailability, setCheckingAvailability] = useState(false);
  const [availabilityError, setAvailabilityError] = useState<string | null>(null);
  const [isAvailable, setIsAvailable] = useState<boolean | null>(null);

  useEffect(() => {
    const loadUserAndRoom = async () => {
      const userStr = localStorage.getItem('currentUser');
      if (!userStr) {
        router.push('/');
        return;
      }

      const user = JSON.parse(userStr);
      let finalUser = user;
      
      // Загружаем актуальные данные пользователя из базы данных
      try {
        if (user.id) {
          const updatedUser = await api.getUser(user.id);
          // Обновляем localStorage актуальными данными
          const { password: _password, ...userWithoutPassword } = updatedUser;
          localStorage.setItem('currentUser', JSON.stringify(userWithoutPassword));
          
          finalUser = userWithoutPassword;
          setCurrentUser(userWithoutPassword);
          setEmail(updatedUser.email || '');
          setPhone(updatedUser.phone || '');
        } else {
          // Если нет ID, используем данные из localStorage
          setCurrentUser(user);
          setEmail(user.email || '');
          setPhone(user.phone || '');
        }
      } catch (error) {
        console.error('Error loading user data:', error);
        // В случае ошибки используем данные из localStorage
        setCurrentUser(user);
        setEmail(user.email || '');
        setPhone(user.phone || '');
      }
      
      loadRoom(finalUser);
    };

    loadUserAndRoom();
  }, [router, roomId]);

  const loadRoom = async (user?: User) => {
    try {
      setLoading(true);
      const roomData = await api.getRoom(roomId);
      setRoom(roomData);

      // Обычные пользователи могут бронировать комнату, даже если есть другие бронирования
      // Проверка доступности будет происходить при выборе дат
      // Менеджер может бронировать любую комнату на любые даты (с проверкой пересечений)
    } catch (error) {
      console.error('Error loading room:', error);
      router.push('/dashboard');
    } finally {
      setLoading(false);
    }
  };

  // Проверка доступности комнаты при изменении дат
  useEffect(() => {
    const checkAvailability = async () => {
      if (!checkIn || !checkOut || !roomId) {
        setIsAvailable(null);
        setAvailabilityError(null);
        return;
      }

      const checkInDate = new Date(checkIn);
      const checkOutDate = new Date(checkOut);

      if (checkInDate >= checkOutDate) {
        setIsAvailable(false);
        setAvailabilityError('Дата заезда должна быть раньше даты выезда');
        return;
      }

      setCheckingAvailability(true);
      setAvailabilityError(null);

      try {
        const availability = await api.checkRoomsAvailability([roomId], checkIn, checkOut);
        const available = availability[roomId] === true;
        setIsAvailable(available);
        
        if (!available) {
          // Получаем информацию о конфликтующих бронированиях
          if (room?.bookings && room.bookings.length > 0) {
            const conflicting = room.bookings.find(b => {
              const bCheckIn = new Date(b.checkIn);
              const bCheckOut = new Date(b.checkOut);
              return bCheckIn < checkOutDate && bCheckOut > checkInDate;
            });
            
            if (conflicting) {
              const existingCheckIn = new Date(conflicting.checkIn).toLocaleDateString('ru-RU');
              const existingCheckOut = new Date(conflicting.checkOut).toLocaleDateString('ru-RU');
              setAvailabilityError(`Комната уже забронирована на период ${existingCheckIn} - ${existingCheckOut}`);
            } else {
              setAvailabilityError('Комната недоступна на выбранные даты');
            }
          } else {
            setAvailabilityError('Комната недоступна на выбранные даты');
          }
        }
      } catch (error) {
        console.error('Error checking availability:', error);
        setIsAvailable(false);
        setAvailabilityError('Ошибка при проверке доступности');
      } finally {
        setCheckingAvailability(false);
      }
    };

    // Debounce проверки доступности
    const timeoutId = setTimeout(() => {
      checkAvailability();
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [checkIn, checkOut, roomId, room]);


  const addGuest = () => {
    if (guests.length < (room?.maxCapacity || 4)) {
      setGuests([...guests, { name: '', email: '', phone: '', image: '' }]);
    }
  };

  const removeGuest = (index: number) => {
    setGuests(guests.filter((_, i) => i !== index));
  };

  const updateGuest = (index: number, field: keyof Guest, value: string) => {
    const updatedGuests = [...guests];
    updatedGuests[index] = { ...updatedGuests[index], [field]: value };
    setGuests(updatedGuests);
  };

  const handleGuestImageUpload = async (index: number, file: File) => {
    // Проверка типа файла
    if (!file.type.startsWith('image/')) {
      alert('Пожалуйста, выберите изображение');
      return;
    }

    // Проверка размера (5MB)
    if (file.size > 5 * 1024 * 1024) {
      alert('Размер файла должен быть меньше 5MB');
      return;
    }

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
      updateGuest(index, 'image', data.path);
    } catch (error) {
      console.error('Upload error:', error);
      alert('Ошибка при загрузке изображения');
    }
  };

  const handleCheckInChange = (date: string) => {
    setCheckIn(date);
    // Если даты одинаковые - автоматически добавляем +1 день к дате выезда
    if (checkOut && date === checkOut) {
      const nextDay = new Date(date);
      nextDay.setDate(nextDay.getDate() + 1);
      setCheckOut(`${nextDay.getFullYear()}-${String(nextDay.getMonth() + 1).padStart(2, '0')}-${String(nextDay.getDate()).padStart(2, '0')}`);
    }
  };

  const handleCheckOutChange = (date: string) => {
    // Если даты одинаковые - автоматически добавляем +1 день
    if (checkIn && date === checkIn) {
      const nextDay = new Date(date);
      nextDay.setDate(nextDay.getDate() + 1);
      setCheckOut(`${nextDay.getFullYear()}-${String(nextDay.getMonth() + 1).padStart(2, '0')}-${String(nextDay.getDate()).padStart(2, '0')}`);
    } else {
      setCheckOut(date);
    }
  };

  const handleSubmit = async () => {
    // Проверка для менеджера - всегда требуется ввод имени и телефона вручную
    if (currentUser?.role === 'manager') {
      if (!manualUserName.trim() || !manualUserPhone.trim()) {
        alert('Пожалуйста, введите имя и телефон пользователя');
        return;
      }
    }
    
    if (!phone || !checkIn || !checkOut) {
      alert('Пожалуйста, заполните все обязательные поля');
      return;
    }

    // Проверяем, что если есть гости, их количество не превышает максимум
    const validGuests = guests.filter(g => g.name.trim());
    if (validGuests.length > (room?.maxCapacity || 4)) {
      alert(`Превышена вместимость комнаты! Максимум: ${room?.maxCapacity}`);
      return;
    }

    if (new Date(checkIn) >= new Date(checkOut)) {
      alert('Дата заезда должна быть раньше даты выезда!');
      return;
    }

    // Проверяем доступность перед отправкой
    if (isAvailable === false) {
      alert(availabilityError || 'Комната недоступна на выбранные даты. Пожалуйста, выберите другие даты.');
      return;
    }

    if (checkingAvailability) {
      alert('Пожалуйста, дождитесь завершения проверки доступности');
      return;
    }

    setSubmitting(true);

    try {
      // Определяем имя того, кто бронирует
      let bookedByName: string;
      let bookingEmail: string;
      let bookingPhone: string;
      
      if (currentUser!.role === 'manager') {
        // Менеджер всегда вводит имя и телефон вручную
        if (!manualUserName.trim() || !manualUserPhone.trim()) {
          alert('Пожалуйста, введите имя и телефон пользователя');
          setSubmitting(false);
          return;
        }
        bookedByName = manualUserName.trim();
        bookingEmail = email;
        bookingPhone = manualUserPhone.trim();
      } else {
        // Обычный пользователь
        bookedByName = currentUser!.name;
        bookingEmail = email;
        bookingPhone = phone;
      }

      // Очищаем телефон от пробелов
      const cleanPhone = bookingPhone.replace(/\s/g, '');

      // Добавляем основного пользователя в гости, если его там нет
      // ВАЖНО: Менеджер НЕ учитывается, он бронирует для клиента
      let finalGuests = validGuests;
      const mainUserName = bookedByName;
      const mainUserInGuests = validGuests.some(g => g.name === mainUserName);
      
      if (currentUser!.role === 'guest' && !mainUserInGuests) {
        // Для обычного пользователя добавляем ЕГО в список гостей
        // Он сам является одним из проживающих
        finalGuests = [{ 
          name: mainUserName, 
          email: bookingEmail, 
          phone: cleanPhone 
        }, ...validGuests];
      } else if (currentUser!.role === 'manager') {
        // Для менеджера используем только validGuests
        // Менеджер НЕ проживает, он бронирует для клиента
        finalGuests = validGuests;
      }

      // Рассчитываем сумму с учётом perPerson
      const nights = Math.ceil((new Date(checkOut).getTime() - new Date(checkIn).getTime()) / (1000 * 60 * 60 * 24));
      let amount: number;
      if (room?.pricePerPerson) {
        // Для комнат с ценой за человека: цена * ночи * количество людей (включая основного пользователя)
        const totalPeople = finalGuests.length;
        amount = Number(room.price) * nights * totalPeople;
      } else {
        // Для обычных комнат: цена * ночи
        amount = Number(room?.price || 0) * nights;
      }

      const booking: BookingInfo = {
        roomId: roomId,
        bookedBy: bookedByName,
        bookedDate: new Date().toISOString(),
        email: bookingEmail || undefined,
        phone: cleanPhone,
        checkIn,
        checkOut,
        guests: finalGuests.length > 0 ? finalGuests : undefined,
        notes: notes.trim() || undefined,
        amount: amount
      };

      await api.createBooking(booking);
      // Сохраняем даты в фильтр перед возвратом на dashboard
      // Сохраняем даты только если они заполнены
      if (typeof window !== 'undefined') {
        localStorage.setItem('dashboard_dateFilterEnabled', 'true');
        if (checkIn) {
          localStorage.setItem('dashboard_checkInDate', checkIn);
        }
        if (checkOut) {
          localStorage.setItem('dashboard_checkOutDate', checkOut);
        }
      }
      router.push('/dashboard');
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Неизвестная ошибка';
      alert('Ошибка при создании бронирования: ' + message);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading || !currentUser || !room) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-lg text-gray-900">Загрузка...</div>
      </div>
    );
  }

  const today = new Date().toISOString().split('T')[0];
  const nights = checkIn && checkOut 
    ? Math.ceil((new Date(checkOut).getTime() - new Date(checkIn).getTime()) / (1000 * 60 * 60 * 24))
    : 0;
  const total = nights * room.price;

  const validateDates = () => {
    if (!checkIn || !checkOut) return false;
    const checkInDate = new Date(checkIn);
    const checkOutDate = new Date(checkOut);
    return checkOutDate > checkInDate && isAvailable !== false;
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
          onCheckInChange={handleCheckInChange}
          onCheckOutChange={handleCheckOutChange}
          availabilityError={availabilityError}
          isAvailable={isAvailable}
          checkingAvailability={checkingAvailability}
          minDate={new Date()}
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
          onGuestImageUpload={handleGuestImageUpload}
          currentUser={currentUser}
        />
      ),
      validate: () => {
        // Проверяем, что все гости с именем имеют валидное имя (только латинские буквы)
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
          checkIn={checkIn}
          checkOut={checkOut}
          nights={nights}
          roomPrice={room?.price}
          pricePerPerson={room?.pricePerPerson}
          guestsCount={room?.pricePerPerson ? guests.length + 1 : undefined}
        />
      ),
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-background">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="bg-white dark:bg-card rounded-lg shadow-lg p-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-foreground mb-2">
            Бронирование комнаты #{room.number}
          </h1>
          <p className="text-gray-600 dark:text-muted-foreground mb-6">
            {room.type === 'FZ' ? 'FZ' : room.type === 'DZ' ? 'DZ' : room.type === 'EZ' ? 'EZ' : room.type === 'MZ' ? 'MZ' : room.type === 'App' ? 'App' : 'Комната'} · {room.capacity} · {room.price}€{room.pricePerPerson ? ' p.P.' : ''}/ночь
          </p>

          <MultiStepForm
            steps={steps}
            onSubmit={handleSubmit}
            onCancel={() => {
              // Сохраняем даты в фильтр перед возвратом на dashboard
              if (typeof window !== 'undefined') {
                localStorage.setItem('dashboard_dateFilterEnabled', 'true');
                if (checkIn) {
                  localStorage.setItem('dashboard_checkInDate', checkIn);
                }
                if (checkOut) {
                  localStorage.setItem('dashboard_checkOutDate', checkOut);
                }
              }
              router.push('/dashboard');
            }}
            submitLabel="Забронировать"
            cancelLabel="Отмена"
            isSubmitting={submitting}
          />
        </div>
      </div>
    </div>
  );
}

