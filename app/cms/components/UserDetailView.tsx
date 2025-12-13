'use client';

import { useState, useEffect } from 'react';
import { ArrowLeft, Mail, Phone, Calendar, KeyRound, Plus, RefreshCw, Copy, CheckCircle, X, AlertCircle, Clock, Edit, Trash2, Save } from 'lucide-react';
import { api } from '@/lib/api';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
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
    role: 'guest' as 'developer' | 'manager' | 'guest'
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
        .filter((b) => b.bookedBy === foundUser.name)
        .map((booking) => {
          const bookingInfo: BookingInfo = {
            id: booking.id,
            roomId: booking.roomId,
            bookedBy: booking.bookedBy,
            bookedDate: booking.bookedDate instanceof Date ? booking.bookedDate.toISOString() : String(booking.bookedDate),
            email: booking.email || undefined,
            phone: booking.phone,
            checkIn: booking.checkIn instanceof Date ? booking.checkIn.toISOString().split('T')[0] : String(booking.checkIn),
            checkOut: booking.checkOut instanceof Date ? booking.checkOut.toISOString().split('T')[0] : String(booking.checkOut),
            guests: Array.isArray(booking.guests) ? booking.guests.map((g: { name: string; age?: number }) => ({ name: g.name, email: undefined, phone: undefined, image: undefined })) : undefined,
            notes: booking.notes || undefined,
            isConfirmed: booking.isConfirmed,
            confirmedBy: booking.confirmedBy || undefined,
            confirmedDate: booking.confirmedDate ? (booking.confirmedDate instanceof Date ? booking.confirmedDate.toISOString() : String(booking.confirmedDate)) : undefined,
            isPaid: booking.isPaid,
            paymentMethod: (booking.paymentMethod === 'cash' || booking.paymentMethod === 'transfer') ? booking.paymentMethod : undefined,
            paymentDate: booking.paymentDate ? (booking.paymentDate instanceof Date ? booking.paymentDate.toISOString() : String(booking.paymentDate)) : undefined,
            paidBy: booking.paidBy || undefined,
            amount: booking.amount ? Number(booking.amount) : undefined,
          };
          const room = roomsData.find((r: Room) => r.id === booking.roomId);
          const hotel = hotelsData.find((h: Hotel) => h.id === room?.hotelId);
          return {
            ...bookingInfo,
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
      
      setNewInviteToken(invite.inviteUrl || null);
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
      
      setNewInviteToken(invite.inviteUrl || null);
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
      
      setNewInviteToken(invite.inviteUrl || null);
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
      });

      setUser(updatedUser);
      setIsEditing(false);
      
      // Если редактируется текущий пользователь, обновляем localStorage
      if (currentUser.id === user.id) {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { password: _password, ...userWithoutPassword } = updatedUser;
        localStorage.setItem('currentUser', JSON.stringify(userWithoutPassword));
      }
      
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
    return <div className="text-center py-12 text-gray-900 dark:text-foreground">Загрузка...</div>;
  }

  if (!user) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500 dark:text-muted-foreground mb-4">Пользователь не найден</p>
        <button
          onClick={onBack}
          className="px-4 py-2 bg-gray-900 dark:bg-primary hover:bg-gray-800 dark:hover:bg-primary/80 text-white dark:text-primary-foreground rounded-lg font-semibold transition-colors"
        >
          Назад к списку
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-4 sm:space-y-6">
      <div className="bg-white dark:bg-card rounded-lg shadow-sm p-4 sm:p-6 border border-gray-200 dark:border-border">
        <button
          onClick={onBack}
          className="mb-4 flex items-center gap-2 text-gray-600 dark:text-muted-foreground hover:text-gray-900 dark:hover:text-foreground font-semibold"
        >
          <ArrowLeft className="w-4 h-4" />
          Назад к списку
        </button>

        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
          <div className="flex-1">
            {isEditing ? (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold mb-2 text-gray-900 dark:text-foreground">
                    Имя <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={editFormData.name}
                    onChange={(e) => setEditFormData({ ...editFormData, name: e.target.value })}
                    className="w-full px-3 py-2 border-2 border-gray-300 dark:border-border rounded-lg bg-white dark:bg-input text-gray-900 dark:text-foreground focus:border-gray-900 dark:focus:border-ring focus:outline-none"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-2 text-gray-900 dark:text-foreground">
                    Email <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="email"
                    value={editFormData.email}
                    onChange={(e) => setEditFormData({ ...editFormData, email: e.target.value })}
                    className="w-full px-3 py-2 border-2 border-gray-300 dark:border-border rounded-lg bg-white dark:bg-input text-gray-900 dark:text-foreground focus:border-gray-900 dark:focus:border-ring focus:outline-none"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-2 text-gray-900 dark:text-foreground">
                    Телефон
                  </label>
                  <input
                    type="tel"
                    value={editFormData.phone}
                    onChange={(e) => setEditFormData({ ...editFormData, phone: e.target.value })}
                    className="w-full px-3 py-2 border-2 border-gray-300 dark:border-border rounded-lg bg-white dark:bg-input text-gray-900 dark:text-foreground focus:border-gray-900 dark:focus:border-ring focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-2 text-gray-900 dark:text-foreground">
                    Роль
                  </label>
                  <select
                    value={editFormData.role}
                    onChange={(e) => setEditFormData({ ...editFormData, role: e.target.value as 'developer' | 'manager' | 'guest' })}
                    className="w-full px-3 py-2 border-2 border-gray-300 dark:border-border rounded-lg bg-white dark:bg-input text-gray-900 dark:text-foreground focus:border-gray-900 dark:focus:border-ring focus:outline-none"
                  >
                    <option value="guest">Гость</option>
                    <option value="manager">Менеджер</option>
                    {currentUser.role === 'developer' && (
                      <option value="developer">Разработчик</option>
                    )}
                  </select>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={handleSaveUser}
                    className="px-4 py-2 bg-green-600 dark:bg-green-700 hover:bg-green-700 dark:hover:bg-green-800 text-white rounded-lg text-sm font-semibold flex items-center gap-2 transition-colors"
                  >
                    <Save className="w-4 h-4" />
                    Сохранить
                  </button>
                  <button
                    onClick={handleCancelEdit}
                    className="px-4 py-2 bg-gray-300 dark:bg-muted hover:bg-gray-400 dark:hover:bg-accent text-gray-700 dark:text-foreground rounded-lg text-sm font-semibold transition-colors"
                  >
                    Отмена
                  </button>
                </div>
              </div>
            ) : (
              <>
                <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-foreground mb-2">{user.name}</h2>
                <div className="flex flex-wrap gap-4 text-sm text-gray-600 dark:text-muted-foreground">
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
                      ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300' 
                      : user.role === 'developer'
                      ? 'bg-purple-100 dark:bg-purple-900/30 text-purple-800 dark:text-purple-300'
                      : 'bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200'
                  }`}>
                    {user.role === 'developer' ? 'Разработчик' : user.role === 'manager' ? 'Менеджер' : 'Гость'}
                  </span>
                </div>
              </>
            )}
          </div>

          {!isEditing && (
            <div className="flex flex-wrap gap-2">
              <button
                onClick={handleEditUser}
                className="px-4 py-2 bg-blue-600 dark:bg-blue-700 hover:bg-blue-700 dark:hover:bg-blue-800 text-white rounded-lg text-sm font-semibold flex items-center gap-2 transition-colors"
              >
                <Edit className="w-4 h-4" />
                Редактировать
              </button>
              <button
                onClick={() => setShowDeleteConfirm(true)}
                className="px-4 py-2 bg-red-600 dark:bg-red-700 hover:bg-red-700 dark:hover:bg-red-800 text-white rounded-lg text-sm font-semibold flex items-center gap-2 transition-colors"
              >
                <Trash2 className="w-4 h-4" />
                Удалить
              </button>
              {activeInvite ? (
                <button
                  onClick={handleRecreateInvite}
                  className="px-4 py-2 bg-blue-600 dark:bg-blue-700 hover:bg-blue-700 dark:hover:bg-blue-800 text-white rounded-lg text-sm font-semibold flex items-center gap-2 transition-colors"
                >
                  <RefreshCw className="w-4 h-4" />
                  Пересоздать приглашение
                </button>
              ) : (
                <button
                  onClick={handleCreateInvite}
                  className="px-4 py-2 bg-gray-900 dark:bg-primary hover:bg-gray-800 dark:hover:bg-primary/80 text-white dark:text-primary-foreground rounded-lg text-sm font-semibold flex items-center gap-2 transition-colors"
                >
                  <Plus className="w-4 h-4" />
                  Создать приглашение
                </button>
              )}
              <button
                onClick={handleResetPassword}
                className="px-4 py-2 bg-orange-600 dark:bg-orange-700 hover:bg-orange-700 dark:hover:bg-orange-800 text-white rounded-lg text-sm font-semibold flex items-center gap-2 transition-colors"
              >
                <KeyRound className="w-4 h-4" />
                Сброс пароля
              </button>
            </div>
          )}
        </div>

        {newInviteToken && (
          <div className="mb-6 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400" />
              <span className="font-semibold text-green-800 dark:text-green-400">Ссылка создана!</span>
            </div>
            <p className="text-sm text-green-700 dark:text-green-400 mb-3">Отправьте эту ссылку пользователю:</p>
            <div className="flex gap-2">
              <input
                type="text"
                value={newInviteToken}
                readOnly
                className="flex-1 px-3 py-2 border border-green-300 dark:border-green-800 rounded-lg bg-white dark:bg-input text-gray-900 dark:text-foreground text-sm"
              />
              <button
                onClick={() => handleCopyLink(newInviteToken)}
                className="px-3 py-2 bg-green-600 dark:bg-green-700 hover:bg-green-700 dark:hover:bg-green-800 text-white rounded-lg flex items-center gap-2 transition-colors"
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
                className="px-3 py-2 bg-gray-200 dark:bg-muted hover:bg-gray-300 dark:hover:bg-accent text-gray-700 dark:text-foreground rounded-lg transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>

      <div className="bg-white dark:bg-card rounded-lg shadow-sm p-4 sm:p-6 border border-gray-200 dark:border-border">
        <h3 className="text-lg font-bold text-gray-900 dark:text-foreground mb-4 flex items-center gap-2">
          <Mail className="w-5 h-5" />
          Приглашения
        </h3>
        {invites.length === 0 ? (
          <div className="text-center py-8 text-gray-500 dark:text-muted-foreground">
            <p>Нет приглашений для этого пользователя</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="bg-gray-50 dark:bg-muted hover:bg-transparent border-b border-gray-200 dark:border-border">
                  <TableHead className="text-xs font-semibold text-gray-700 dark:text-foreground">Статус</TableHead>
                  <TableHead className="text-xs font-semibold text-gray-700 dark:text-foreground">Создано</TableHead>
                  <TableHead className="text-xs font-semibold text-gray-700 dark:text-foreground">Истекает</TableHead>
                  <TableHead className="text-xs font-semibold text-gray-700 dark:text-foreground">Использовано</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {invites.map((invite) => {
                  const status = getInviteStatus(invite);
                  const StatusIcon = status.icon;
                  
                  return (
                    <TableRow key={invite.id} className="hover:bg-gray-100 dark:hover:bg-accent transition-colors">
                      <TableCell>
                        <span className={`inline-flex items-center gap-1.5 px-2 py-1 rounded-full text-xs font-semibold text-white ${status.color}`}>
                          <StatusIcon className="w-3 h-3" />
                          {status.label}
                        </span>
                      </TableCell>
                      <TableCell className="text-sm text-gray-700 dark:text-foreground">
                        {new Date(invite.createdAt).toLocaleDateString('ru-RU', {
                          day: '2-digit',
                          month: '2-digit',
                          year: 'numeric'
                        })}
                      </TableCell>
                      <TableCell className="text-sm text-gray-700 dark:text-foreground">
                        {new Date(invite.expiresAt).toLocaleDateString('ru-RU', {
                          day: '2-digit',
                          month: '2-digit',
                          year: 'numeric'
                        })}
                      </TableCell>
                      <TableCell className="text-sm text-gray-700 dark:text-foreground">
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
                          <span className="text-gray-400 dark:text-muted-foreground">Нет</span>
                        )}
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>
        )}
      </div>

      <div className="bg-white dark:bg-card rounded-lg shadow-sm p-4 sm:p-6 border border-gray-200 dark:border-border">
        <h3 className="text-lg font-bold text-gray-900 dark:text-foreground mb-4 flex items-center gap-2">
          <Calendar className="w-5 h-5" />
          Бронирования ({bookings.length})
        </h3>
        {bookings.length === 0 ? (
          <div className="text-center py-8 text-gray-500 dark:text-muted-foreground">
            <p>Нет бронирований</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="bg-gray-50 dark:bg-muted hover:bg-transparent border-b border-gray-200 dark:border-border">
                  <TableHead className="text-xs font-semibold text-gray-700 dark:text-foreground">Отель</TableHead>
                  <TableHead className="text-xs font-semibold text-gray-700 dark:text-foreground">Комната</TableHead>
                  <TableHead className="text-xs font-semibold text-gray-700 dark:text-foreground">Заезд</TableHead>
                  <TableHead className="text-xs font-semibold text-gray-700 dark:text-foreground">Выезд</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {bookings.map((booking) => (
                  <TableRow key={booking.id} className="hover:bg-gray-100 dark:hover:bg-accent transition-colors">
                    <TableCell className="text-sm text-gray-900 dark:text-foreground font-medium">
                      {booking.hotelName}
                    </TableCell>
                    <TableCell className="text-sm text-gray-700 dark:text-foreground">
                      #{booking.roomNumber}
                    </TableCell>
                    <TableCell className="text-sm text-gray-700 dark:text-foreground">
                      {new Date(booking.checkIn).toLocaleDateString('ru-RU', {
                        day: '2-digit',
                        month: '2-digit',
                        year: 'numeric'
                      })}
                    </TableCell>
                    <TableCell className="text-sm text-gray-700 dark:text-foreground">
                      {new Date(booking.checkOut).toLocaleDateString('ru-RU', {
                        day: '2-digit',
                        month: '2-digit',
                        year: 'numeric'
                      })}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </div>

      {/* Модальное окно подтверждения удаления */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-3 sm:p-4">
          <div className="bg-white dark:bg-card rounded-lg max-w-md w-full shadow-lg border border-gray-200 dark:border-border">
            <div className="p-4 sm:p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center">
                  <AlertCircle className="w-6 h-6 text-red-600 dark:text-red-400" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-gray-900 dark:text-foreground">Удалить пользователя?</h3>
                  <p className="text-sm text-gray-600 dark:text-muted-foreground">Это действие нельзя отменить</p>
                </div>
              </div>
              <p className="text-sm text-gray-700 dark:text-foreground mb-6">
                Вы уверены, что хотите удалить пользователя <strong>{user?.name}</strong>? 
                Все связанные данные будут удалены.
              </p>
              <div className="flex gap-2">
                <button
                  onClick={() => setShowDeleteConfirm(false)}
                  className="flex-1 px-4 py-2 bg-gray-300 dark:bg-muted hover:bg-gray-400 dark:hover:bg-accent text-gray-700 dark:text-foreground rounded-lg font-semibold transition-colors"
                >
                  Отмена
                </button>
                <button
                  onClick={() => {
                    setShowDeleteConfirm(false);
                    handleDeleteUser();
                  }}
                  className="flex-1 px-4 py-2 bg-red-600 dark:bg-red-700 hover:bg-red-700 dark:hover:bg-red-800 text-white rounded-lg font-semibold transition-colors"
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

