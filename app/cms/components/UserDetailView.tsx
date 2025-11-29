'use client';

import { useState, useEffect } from 'react';
import { ArrowLeft, Mail, Phone, Calendar, KeyRound, Plus, RefreshCw, Copy, CheckCircle, X, AlertCircle, Clock, Edit, Trash2, Save } from 'lucide-react';
import { api } from '@/lib/api';
import type { User, BookingInfo, Invite, Room, Hotel } from '@/types';

export default function UserDetailView({
  userId,
  currentUser,
  onBack
}: {
  userId: string;
  currentUser: User;
  onBack: () => void;
}) {
  const [user, setUser] = useState<User | null>(null);
  const [bookings, setBookings] = useState<(BookingInfo & { roomNumber?: string; hotelName?: string })[]>([]);
  const [invites, setInvites] = useState<Invite[]>([]);
  const [loading, setLoading] = useState(true);
  const [copiedToken, setCopiedToken] = useState<string | null>(null);
  const [newInviteToken, setNewInviteToken] = useState<string | null>(null);
  const [expiresInDays] = useState(7);
  const [isEditing, setIsEditing] = useState(false);
  const [editFormData, setEditFormData] = useState({
    name: '',
    email: '',
    phone: '',
    role: 'guest' as 'manager' | 'guest'
  });
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const loadUserData = async () => {
    try {
      setLoading(true);
      const [usersData, bookingsData, invitesData, roomsData, hotelsData] = await Promise.all([
        api.getUsers(),
        api.getBookings(),
        api.getInvites(),
        api.getRooms(),
        api.getHotels()
      ]);

      const foundUser = usersData.find((u: User) => u.id === userId);
      if (!foundUser) {
        alert('Пользователь не найден');
        onBack();
        return;
      }

      setUser(foundUser);
      // Инициализируем форму редактирования
      setEditFormData({
        name: foundUser.name || '',
        email: foundUser.email || '',
        phone: foundUser.phone || '',
        role: foundUser.role || 'guest'
      });

      const userBookings = bookingsData
        .filter((b: BookingInfo) => b.bookedBy === foundUser.name)
        .map((booking: BookingInfo) => {
          const room = roomsData.find((r: Room) => r.id === booking.roomId);
          const hotel = hotelsData.find((h: Hotel) => h.id === room?.hotelId);
          return {
            ...booking,
            roomNumber: room?.number || 'N/A',
            hotelName: hotel?.name || 'N/A'
          };
        });
      setBookings(userBookings);

      const userInvites = invitesData.filter((inv: Invite) => inv.name === foundUser.name);
      setInvites(userInvites);
    } catch (error) {
      console.error('Error loading user data:', error);
      alert('Ошибка при загрузке данных пользователя');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUserData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userId]);

  const handleCreateInvite = async () => {
    if (!user) return;

    try {
      const invite = await api.createInvite(
        user.name,
        expiresInDays,
        currentUser.id!
      );
      
      setNewInviteToken(invite.inviteUrl);
      await loadUserData();
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Ошибка при создании приглашения';
      alert(message);
    }
  };

  const handleRecreateInvite = async () => {
    if (!user) return;

    if (!confirm(`Пересоздать приглашение для ${user.name}? Старое приглашение будет удалено.`)) {
      return;
    }

    try {
      const invite = await api.recreateInvite(
        user.name,
        expiresInDays,
        currentUser.id!
      );
      
      setNewInviteToken(invite.inviteUrl);
      await loadUserData();
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Ошибка при пересоздании приглашения';
      alert(message);
    }
  };

  const handleResetPassword = async () => {
    if (!user) return;

    if (!confirm(`Создать ссылку для сброса пароля для ${user.name}? Пользователь сможет использовать её для входа или смены пароля.`)) {
      return;
    }

    try {
      const invite = await api.recreateInvite(
        user.name,
        1,
        currentUser.id!
      );
      
      setNewInviteToken(invite.inviteUrl);
      await loadUserData();
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Ошибка при создании ссылки для сброса пароля';
      alert(message);
    }
  };

  const handleCopyLink = (url: string) => {
    navigator.clipboard.writeText(url);
    setCopiedToken(url);
    setTimeout(() => setCopiedToken(null), 2000);
  };

  const handleEditUser = () => {
    if (!user) return;
    setIsEditing(true);
    setEditFormData({
      name: user.name || '',
      email: user.email || '',
      phone: user.phone || '',
      role: user.role || 'guest'
    });
  };

  const handleSaveUser = async () => {
    if (!user) return;

    if (!editFormData.name.trim() || !editFormData.email.trim()) {
      alert('Имя и email обязательны для заполнения');
      return;
    }

    try {
      const updatedUser = await api.updateUser(user.id!, {
        name: editFormData.name.trim(),
        email: editFormData.email.trim(),
        phone: editFormData.phone.trim() || undefined,
        role: editFormData.role
      });

      setUser(updatedUser);
      setIsEditing(false);
      alert('Пользователь успешно обновлен');
      await loadUserData();
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Ошибка при обновлении пользователя';
      alert(message);
    }
  };

  const handleCancelEdit = () => {
    if (!user) return;
    setIsEditing(false);
    setEditFormData({
      name: user.name || '',
      email: user.email || '',
      phone: user.phone || '',
      role: user.role || 'guest'
    });
  };

  const handleDeleteUser = async () => {
    if (!user) return;

    if (!confirm(`Вы уверены, что хотите удалить пользователя ${user.name}? Это действие нельзя отменить.`)) {
      return;
    }

    try {
      await api.deleteUser(user.id!);
      alert('Пользователь успешно удален');
      onBack();
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Ошибка при удалении пользователя';
      alert(message);
    }
  };

  const getInviteStatus = (invite: Invite) => {
    if (invite.used) {
      return { label: 'Использовано', color: 'bg-gray-500', icon: CheckCircle };
    }
    const now = new Date();
    const expiresAt = new Date(invite.expiresAt);
    if (now > expiresAt) {
      return { label: 'Истекло', color: 'bg-red-500', icon: AlertCircle };
    }
    return { label: 'Активно', color: 'bg-green-500', icon: Clock };
  };

  const activeInvite = invites.find(inv => !inv.used && new Date(inv.expiresAt) > new Date());

  if (loading) {
    return <div className="text-center py-12">Загрузка...</div>;
  }

  if (!user) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500 mb-4">Пользователь не найден</p>
        <button
          onClick={onBack}
          className="px-4 py-2 bg-gray-900 hover:bg-gray-800 text-white rounded-lg font-semibold"
        >
          Назад к списку
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-4 sm:space-y-6">
      <div className="bg-white rounded-lg shadow-sm p-4 sm:p-6 border border-gray-200">
        <button
          onClick={onBack}
          className="mb-4 flex items-center gap-2 text-gray-600 hover:text-gray-900 font-semibold"
        >
          <ArrowLeft className="w-4 h-4" />
          Назад к списку
        </button>

        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
          <div className="flex-1">
            {isEditing ? (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold mb-2">
                    Имя <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={editFormData.name}
                    onChange={(e) => setEditFormData({ ...editFormData, name: e.target.value })}
                    className="w-full px-3 py-2 border-2 border-gray-300 rounded-lg focus:border-gray-900 focus:outline-none"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-2">
                    Email <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="email"
                    value={editFormData.email}
                    onChange={(e) => setEditFormData({ ...editFormData, email: e.target.value })}
                    className="w-full px-3 py-2 border-2 border-gray-300 rounded-lg focus:border-gray-900 focus:outline-none"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-2">
                    Телефон
                  </label>
                  <input
                    type="tel"
                    value={editFormData.phone}
                    onChange={(e) => setEditFormData({ ...editFormData, phone: e.target.value })}
                    className="w-full px-3 py-2 border-2 border-gray-300 rounded-lg focus:border-gray-900 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-2">
                    Роль
                  </label>
                  <select
                    value={editFormData.role}
                    onChange={(e) => setEditFormData({ ...editFormData, role: e.target.value as 'manager' | 'guest' })}
                    className="w-full px-3 py-2 border-2 border-gray-300 rounded-lg focus:border-gray-900 focus:outline-none"
                  >
                    <option value="guest">Гость</option>
                    <option value="manager">Менеджер</option>
                  </select>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={handleSaveUser}
                    className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg text-sm font-semibold flex items-center gap-2"
                  >
                    <Save className="w-4 h-4" />
                    Сохранить
                  </button>
                  <button
                    onClick={handleCancelEdit}
                    className="px-4 py-2 bg-gray-300 hover:bg-gray-400 text-gray-700 rounded-lg text-sm font-semibold"
                  >
                    Отмена
                  </button>
                </div>
              </div>
            ) : (
              <>
                <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2">{user.name}</h2>
                <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                  <div className="flex items-center gap-1">
                    <Mail className="w-4 h-4" />
                    <span>{user.email}</span>
                  </div>
                  {user.phone && (
                    <div className="flex items-center gap-1">
                      <Phone className="w-4 h-4" />
                      <span>{user.phone}</span>
                    </div>
                  )}
                  <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                    user.role === 'manager' 
                      ? 'bg-blue-100 text-blue-800' 
                      : 'bg-gray-100 text-gray-800'
                  }`}>
                    {user.role === 'manager' ? 'Менеджер' : 'Гость'}
                  </span>
                </div>
              </>
            )}
          </div>

          {!isEditing && (
            <div className="flex flex-wrap gap-2">
              <button
                onClick={handleEditUser}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-semibold flex items-center gap-2"
              >
                <Edit className="w-4 h-4" />
                Редактировать
              </button>
              <button
                onClick={() => setShowDeleteConfirm(true)}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg text-sm font-semibold flex items-center gap-2"
              >
                <Trash2 className="w-4 h-4" />
                Удалить
              </button>
              {activeInvite ? (
                <button
                  onClick={handleRecreateInvite}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-semibold flex items-center gap-2"
                >
                  <RefreshCw className="w-4 h-4" />
                  Пересоздать приглашение
                </button>
              ) : (
                <button
                  onClick={handleCreateInvite}
                  className="px-4 py-2 bg-gray-900 hover:bg-gray-800 text-white rounded-lg text-sm font-semibold flex items-center gap-2"
                >
                  <Plus className="w-4 h-4" />
                  Создать приглашение
                </button>
              )}
              <button
                onClick={handleResetPassword}
                className="px-4 py-2 bg-orange-600 hover:bg-orange-700 text-white rounded-lg text-sm font-semibold flex items-center gap-2"
              >
                <KeyRound className="w-4 h-4" />
                Сброс пароля
              </button>
            </div>
          )}
        </div>

        {newInviteToken && (
          <div className="mb-6 bg-green-50 border border-green-200 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <CheckCircle className="w-5 h-5 text-green-600" />
              <span className="font-semibold text-green-800">Ссылка создана!</span>
            </div>
            <p className="text-sm text-green-700 mb-3">Отправьте эту ссылку пользователю:</p>
            <div className="flex gap-2">
              <input
                type="text"
                value={newInviteToken}
                readOnly
                className="flex-1 px-3 py-2 border border-green-300 rounded-lg bg-white text-sm"
              />
              <button
                onClick={() => handleCopyLink(newInviteToken)}
                className="px-3 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg flex items-center gap-2"
              >
                {copiedToken === newInviteToken ? (
                  <>
                    <CheckCircle className="w-4 h-4" />
                    Скопировано
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4" />
                    Копировать
                  </>
                )}
              </button>
              <button
                onClick={() => setNewInviteToken(null)}
                className="px-3 py-2 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-lg"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>

      <div className="bg-white rounded-lg shadow-sm p-4 sm:p-6 border border-gray-200">
        <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
          <Mail className="w-5 h-5" />
          Приглашения
        </h3>
        {invites.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <p>Нет приглашений для этого пользователя</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="border-b border-gray-200 bg-gray-50">
                  <th className="px-3 py-2 text-left text-xs font-semibold text-gray-700">Статус</th>
                  <th className="px-3 py-2 text-left text-xs font-semibold text-gray-700">Создано</th>
                  <th className="px-3 py-2 text-left text-xs font-semibold text-gray-700">Истекает</th>
                  <th className="px-3 py-2 text-left text-xs font-semibold text-gray-700">Использовано</th>
                </tr>
              </thead>
              <tbody>
                {invites.map((invite) => {
                  const status = getInviteStatus(invite);
                  const StatusIcon = status.icon;
                  
                  return (
                    <tr
                      key={invite.id}
                      className="border-b border-gray-100 hover:bg-gray-50 transition-colors"
                    >
                      <td className="px-3 py-2.5">
                        <span className={`inline-flex items-center gap-1.5 px-2 py-1 rounded-full text-xs font-semibold text-white ${status.color}`}>
                          <StatusIcon className="w-3 h-3" />
                          {status.label}
                        </span>
                      </td>
                      <td className="px-3 py-2.5 text-sm text-gray-700">
                        {new Date(invite.createdAt).toLocaleDateString('ru-RU', {
                          day: '2-digit',
                          month: '2-digit',
                          year: 'numeric'
                        })}
                      </td>
                      <td className="px-3 py-2.5 text-sm text-gray-700">
                        {new Date(invite.expiresAt).toLocaleDateString('ru-RU', {
                          day: '2-digit',
                          month: '2-digit',
                          year: 'numeric'
                        })}
                      </td>
                      <td className="px-3 py-2.5 text-sm text-gray-700">
                        {invite.used ? (
                          invite.usedAt ? (
                            new Date(invite.usedAt).toLocaleDateString('ru-RU', {
                              day: '2-digit',
                              month: '2-digit',
                              year: 'numeric'
                            })
                          ) : (
                            'Да'
                          )
                        ) : (
                          <span className="text-gray-400">Нет</span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <div className="bg-white rounded-lg shadow-sm p-4 sm:p-6 border border-gray-200">
        <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
          <Calendar className="w-5 h-5" />
          Бронирования ({bookings.length})
        </h3>
        {bookings.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <p>Нет бронирований</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="border-b border-gray-200 bg-gray-50">
                  <th className="px-3 py-2 text-left text-xs font-semibold text-gray-700">Отель</th>
                  <th className="px-3 py-2 text-left text-xs font-semibold text-gray-700">Комната</th>
                  <th className="px-3 py-2 text-left text-xs font-semibold text-gray-700">Заезд</th>
                  <th className="px-3 py-2 text-left text-xs font-semibold text-gray-700">Выезд</th>
                </tr>
              </thead>
              <tbody>
                {bookings.map((booking) => (
                  <tr
                    key={booking.id}
                    className="border-b border-gray-100 hover:bg-gray-50 transition-colors"
                  >
                    <td className="px-3 py-2.5 text-sm text-gray-900 font-medium">
                      {booking.hotelName}
                    </td>
                    <td className="px-3 py-2.5 text-sm text-gray-700">
                      #{booking.roomNumber}
                    </td>
                    <td className="px-3 py-2.5 text-sm text-gray-700">
                      {new Date(booking.checkIn).toLocaleDateString('ru-RU', {
                        day: '2-digit',
                        month: '2-digit',
                        year: 'numeric'
                      })}
                    </td>
                    <td className="px-3 py-2.5 text-sm text-gray-700">
                      {new Date(booking.checkOut).toLocaleDateString('ru-RU', {
                        day: '2-digit',
                        month: '2-digit',
                        year: 'numeric'
                      })}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Модальное окно подтверждения удаления */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-transparent flex items-center justify-center z-50 p-3 sm:p-4">
          <div className="bg-white rounded-lg max-w-md w-full shadow-lg">
            <div className="p-4 sm:p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                  <AlertCircle className="w-6 h-6 text-red-600" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-gray-900">Удалить пользователя?</h3>
                  <p className="text-sm text-gray-600">Это действие нельзя отменить</p>
                </div>
              </div>
              <p className="text-sm text-gray-700 mb-6">
                Вы уверены, что хотите удалить пользователя <strong>{user?.name}</strong>? 
                Все связанные данные будут удалены.
              </p>
              <div className="flex gap-2">
                <button
                  onClick={() => setShowDeleteConfirm(false)}
                  className="flex-1 px-4 py-2 bg-gray-300 hover:bg-gray-400 text-gray-700 rounded-lg font-semibold"
                >
                  Отмена
                </button>
                <button
                  onClick={() => {
                    setShowDeleteConfirm(false);
                    handleDeleteUser();
                  }}
                  className="flex-1 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-semibold"
                >
                  Удалить
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

