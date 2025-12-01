'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { Mail, Phone, Calendar, Users, Plus, X } from 'lucide-react';
import { api } from '@/lib/api';
import type { Room, User, Guest, BookingInfo } from '@/types';

export default function BookingPage() {
  const router = useRouter();
  const params = useParams();
  const roomId = params.id as string;

  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [room, setRoom] = useState<Room | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [checkIn, setCheckIn] = useState('');
  const [checkOut, setCheckOut] = useState('');
  const [guests, setGuests] = useState<Guest[]>([]);
  const [notes, setNotes] = useState('');
  const [manualUserName, setManualUserName] = useState('');
  const [manualUserPhone, setManualUserPhone] = useState('');

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

      // Обычные пользователи не могут бронировать уже забронированные комнаты
      // Менеджер может бронировать любую комнату
      if (roomData.booking && user?.role !== 'manager') {
        router.push('/dashboard');
      }
    } catch (error) {
      console.error('Error loading room:', error);
      router.push('/dashboard');
    } finally {
      setLoading(false);
    }
  };


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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Проверка для менеджера - всегда требуется ввод имени и телефона вручную
    if (currentUser?.role === 'manager') {
      if (!manualUserName.trim() || !manualUserPhone.trim()) {
        alert('Пожалуйста, введите имя и телефон пользователя');
        return;
      }
    }
    
    if (!email || !phone || !checkIn || !checkOut) {
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
      let finalGuests = validGuests;
      const mainUserName = bookedByName;
      const mainUserInGuests = validGuests.some(g => g.name === mainUserName);
      
      if (!mainUserInGuests && validGuests.length === 0) {
        // Если нет гостей, добавляем основного пользователя как гостя
        finalGuests = [{ 
          name: mainUserName, 
          email: bookingEmail, 
          phone: cleanPhone 
        }];
      } else if (!mainUserInGuests && currentUser!.role === 'guest') {
        // Для обычного пользователя добавляем его в начало списка гостей
        finalGuests = [{ 
          name: mainUserName, 
          email: bookingEmail, 
          phone: cleanPhone 
        }, ...validGuests];
      }

      const booking: BookingInfo = {
        roomId: roomId,
        bookedBy: bookedByName,
        bookedDate: new Date().toISOString(),
        email: bookingEmail,
        phone: cleanPhone,
        checkIn,
        checkOut,
        guests: finalGuests.length > 0 ? finalGuests : undefined,
        notes: notes.trim() || undefined
      };

      await api.createBooking(booking);
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

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Бронирование комнаты #{room.number}
          </h1>
          <p className="text-gray-600 mb-6">
            {room.type === 'FZ' ? 'FZ' : room.type === 'DZ' ? 'DZ' : room.type === 'EZ' ? 'EZ' : room.type === 'MZ' ? 'MZ' : room.type === 'App' ? 'App' : 'Комната'} · {room.capacity} · {room.price}€{room.pricePerPerson ? '/Per' : ''}/ночь
          </p>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Контактная информация */}
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold mb-2">
                  <Mail className="w-4 h-4 inline mr-1" />
                  Email <span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-3 py-2 border-2 border-gray-300 rounded-lg focus:border-gray-700 focus:outline-none"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-semibold mb-2">
                  <Phone className="w-4 h-4 inline mr-1" />
                  Телефон <span className="text-red-500">*</span>
                </label>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+491234567890"
                  className="w-full px-3 py-2 border-2 border-gray-300 rounded-lg focus:border-gray-700 focus:outline-none"
                  required
                />
              </div>
            </div>

            {/* Даты */}
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold mb-2">
                  <Calendar className="w-4 h-4 inline mr-1" />
                  Заезд <span className="text-red-500">*</span>
                </label>
                <input
                  type="date"
                  value={checkIn}
                  onChange={(e) => setCheckIn(e.target.value)}
                  min={today}
                  className="w-full px-3 py-2 border-2 border-gray-300 rounded-lg focus:border-gray-700 focus:outline-none"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-semibold mb-2">
                  <Calendar className="w-4 h-4 inline mr-1" />
                  Выезд <span className="text-red-500">*</span>
                </label>
                <input
                  type="date"
                  value={checkOut}
                  onChange={(e) => setCheckOut(e.target.value)}
                  min={checkIn || today}
                  className="w-full px-3 py-2 border-2 border-gray-300 rounded-lg focus:border-gray-700 focus:outline-none"
                  required
                />
              </div>
            </div>

            {/* Ввод данных пользователя для менеджера */}
            {currentUser.role === 'manager' && (
              <div>
                <label className="block text-sm font-semibold mb-2">
                  <Users className="w-4 h-4 inline mr-1" />
                  Данные пользователя
                </label>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold mb-2">
                      Имя пользователя <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={manualUserName}
                      onChange={(e) => setManualUserName(e.target.value)}
                      placeholder="Введите имя"
                      className="w-full px-3 py-2 border-2 border-gray-300 rounded-lg focus:border-gray-700 focus:outline-none"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold mb-2">
                      Телефон пользователя <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="tel"
                      value={manualUserPhone}
                      onChange={(e) => setManualUserPhone(e.target.value)}
                      placeholder="+491234567890"
                      className="w-full px-3 py-2 border-2 border-gray-300 rounded-lg focus:border-gray-700 focus:outline-none"
                      required
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Гости */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="block text-sm font-semibold">
                  <Users className="w-4 h-4 inline mr-1" />
                  Гости (опционально)
                </label>
                <span className={`text-xs font-semibold px-2 py-1 rounded ${
                  guests.length > (room.maxCapacity || 4)
                    ? 'bg-red-100 text-red-700'
                    : 'bg-gray-100 text-gray-700'
                }`}>
                  {guests.length} / {room.maxCapacity || 4}
                </span>
              </div>

              <div className="space-y-2 mb-3">
                {guests.map((guest, idx) => (
                  <div key={idx} className="flex gap-3 items-start p-3 bg-gray-50 border border-gray-200 rounded-lg">
                    {/* Фото гостя */}
                    <div className="flex-shrink-0">
                      {guest.image ? (
                        <div className="relative">
                          <img
                            src={guest.image}
                            alt={guest.name || 'Гость'}
                            className="w-16 h-16 rounded-full object-cover border-2 border-gray-300"
                          />
                          <button
                            type="button"
                            onClick={() => updateGuest(idx, 'image', '')}
                            className="absolute -top-1 -right-1 bg-pink-900 hover:bg-pink-950 text-white rounded-full p-1"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </div>
                      ) : (
                        <label className="w-16 h-16 rounded-full border-2 border-dashed border-gray-300 flex items-center justify-center cursor-pointer hover:border-gray-400 transition-colors">
                          <input
                            type="file"
                            accept="image/*"
                            onChange={(e) => {
                              const file = e.target.files?.[0];
                              if (file) handleGuestImageUpload(idx, file);
                            }}
                            className="hidden"
                          />
                          <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                          </svg>
                        </label>
                      )}
                    </div>
                    <div className="flex-1 space-y-2">
                      <input
                        type="text"
                        value={guest.name}
                        onChange={(e) => updateGuest(idx, 'name', e.target.value)}
                        placeholder="Имя"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                      />
                      <input
                        type="email"
                        value={guest.email || ''}
                        onChange={(e) => updateGuest(idx, 'email', e.target.value)}
                        placeholder="Email"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                      />
                      <input
                        type="tel"
                        value={guest.phone || ''}
                        onChange={(e) => updateGuest(idx, 'phone', e.target.value)}
                        placeholder="Телефон"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                      />
                    </div>
                    <button
                      type="button"
                      onClick={() => removeGuest(idx)}
                      className="text-red-500 hover:text-red-700 p-1 flex-shrink-0"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>
                ))}
              </div>

              {guests.length < (room.maxCapacity || 4) && (
                <button
                  type="button"
                  onClick={addGuest}
                  className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-lg text-sm font-semibold flex items-center gap-2"
                >
                  <Plus className="w-4 h-4" />
                  Добавить гостя
                </button>
              )}
            </div>

            {/* Примечания */}
            <div>
              <label className="block text-sm font-semibold mb-2">
                Примечания
              </label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Особые пожелания, время прибытия..."
                rows={3}
                className="w-full px-3 py-2 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none"
              />
            </div>

            {/* Итого */}
            {nights > 0 && (
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm">Ночей:</span>
                  <span className="font-semibold">{nights}</span>
                </div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm">Цена за ночь:</span>
                  <span className="font-semibold">{room.price}€{room.pricePerPerson ? '/Per' : ''}</span>
                </div>
                <div className="border-t pt-2 mt-2">
                  <div className="flex justify-between items-center">
                    <span className="text-lg font-bold">Итого:</span>
                    <span className="text-xl font-bold text-gray-700">{total}€</span>
                  </div>
                </div>
              </div>
            )}

            {/* Кнопки */}
            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => router.push('/dashboard')}
                className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-700 py-3 rounded-lg font-semibold"
              >
                Отмена
              </button>
              <button
                type="submit"
                disabled={submitting}
                className="flex-1 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white py-3 rounded-lg font-semibold"
              >
                {submitting ? 'Сохранение...' : 'Забронировать'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

