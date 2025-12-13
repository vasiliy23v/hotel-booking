'use client';

import { useState, useEffect } from 'react';
import { Users, ArrowRight, KeyRound, Copy, CheckCircle } from 'lucide-react';
import { api } from '@/lib/api';
import type { User } from '@/types';
import UserDetailView from './UserDetailView';
import Toast, { type ToastType } from './Toast';

interface ToastState {
  message: string;
  type: ToastType;
}

export default function UsersView({ 
  currentUser, 
  selectedUserId, 
  onSelectUser 
}: { 
  currentUser: User; 
  selectedUserId: string | null;
  onSelectUser: (userId: string | null) => void;
}) {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [resetPasswordLinks, setResetPasswordLinks] = useState<Record<string, string>>({});
  const [copiedUserId, setCopiedUserId] = useState<string | null>(null);
  const [toast, setToast] = useState<ToastState | null>(null);

  const loadUsers = async () => {
    try {
      setLoading(true);
      const data = await api.getUsers();
      setUsers(data);
    } catch (error) {
      console.error('Error loading users:', error);
      alert('Ошибка при загрузке пользователей');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUsers();
  }, []);

  const handleResetPassword = async (user: User) => {
    if (!confirm(`Создать ссылку для сброса пароля для ${user.name}? Старый пароль будет заблокирован, и пользователь ОБЯЗАН будет установить новый пароль через эту ссылку.`)) {
      return;
    }

    try {
      const invite = await api.recreateInvite(
        user.name,
        1, // Срок действия 1 день
        currentUser.id!
      );
      
      const resetPasswordUrl = invite.inviteUrl || '';
      if (resetPasswordUrl) {
        setResetPasswordLinks(prev => ({
          ...prev,
          [user.id!]: resetPasswordUrl
        }));
        
        // Автоматически копируем ссылку в буфер обмена
        try {
          await navigator.clipboard.writeText(resetPasswordUrl);
          setCopiedUserId(user.id!);
          setTimeout(() => setCopiedUserId(null), 2000);
          setToast({
            message: `Ссылка для сброса пароля создана и скопирована в буфер обмена!`,
            type: 'success'
          });
        } catch {
          // Если не удалось скопировать в буфер обмена, все равно показываем успех
          setToast({
            message: `Ссылка для сброса пароля создана: ${resetPasswordUrl}`,
            type: 'success'
          });
        }
      } else {
        setToast({
          message: 'Ошибка: ссылка для сброса пароля не была создана',
          type: 'error'
        });
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Ошибка при создании ссылки для сброса пароля';
      setToast({
        message,
        type: 'error'
      });
    }
  };

  const handleCopyResetLink = async (userId: string, link: string) => {
    try {
      await navigator.clipboard.writeText(link);
      setCopiedUserId(userId);
      setTimeout(() => setCopiedUserId(null), 2000);
      setToast({
        message: 'Ссылка скопирована в буфер обмена',
        type: 'success'
      });
    } catch {
      setToast({
        message: 'Не удалось скопировать ссылку',
        type: 'error'
      });
    }
  };

  if (loading) {
    return <div className="text-center py-12">Загрузка...</div>;
  }

  if (selectedUserId) {
    return (
      <UserDetailView
        userId={selectedUserId}
        currentUser={currentUser}
        onBack={() => onSelectUser(null)}
      />
    );
  }

  return (
    <>
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
      <div className="space-y-4 sm:space-y-6">
        <div className="bg-white rounded-lg shadow-sm p-4 sm:p-6 border border-gray-200">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900 flex items-center gap-2">
            <Users className="w-5 h-5 sm:w-6 sm:h-6" />
            Управление пользователями
          </h2>
        </div>

        {users.length === 0 ? (
          <div className="text-center py-12 text-gray-500">
            <Users className="w-16 h-16 mx-auto mb-4 text-gray-300" />
            <p>Нет пользователей</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="border-b border-gray-200 bg-gray-50">
                  <th className="px-3 py-2 text-left text-xs font-semibold text-gray-700">Имя</th>
                  <th className="px-3 py-2 text-left text-xs font-semibold text-gray-700">Email</th>
                  <th className="px-3 py-2 text-left text-xs font-semibold text-gray-700">Телефон</th>
                  <th className="px-3 py-2 text-left text-xs font-semibold text-gray-700">Роль</th>
                  <th className="px-3 py-2 text-left text-xs font-semibold text-gray-700">Действия</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr
                    key={user.id}
                    className="border-b border-gray-100 hover:bg-gray-50 transition-colors"
                  >
                    <td className="px-3 py-2.5 text-sm text-gray-900 font-medium">
                      {user.name}
                    </td>
                    <td className="px-3 py-2.5 text-sm text-gray-700">
                      {user.email}
                    </td>
                    <td className="px-3 py-2.5 text-sm text-gray-700">
                      {user.phone || <span className="text-gray-400">—</span>}
                    </td>
                    <td className="px-3 py-2.5">
                      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-semibold ${
                        user.role === 'manager' 
                          ? 'bg-blue-100 text-blue-800' 
                          : 'bg-gray-100 text-gray-800'
                      }`}>
                        {user.role === 'developer' ? 'Разработчик' : user.role === 'manager' ? 'Менеджер' : 'Гость'}
                      </span>
                    </td>
                    <td className="px-3 py-2.5">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => onSelectUser(user.id!)}
                          className="px-3 py-1.5 bg-gray-900 hover:bg-gray-800 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5"
                        >
                          <span>Подробнее</span>
                          <ArrowRight className="w-3 h-3" />
                        </button>
                        
                        {/* Кнопка сброса пароля */}
                        {resetPasswordLinks[user.id!] ? (
                          <button
                            onClick={() => handleCopyResetLink(user.id!, resetPasswordLinks[user.id!])}
                            className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5"
                            title="Скопировать ссылку для сброса пароля"
                          >
                            {copiedUserId === user.id! ? (
                              <>
                                <CheckCircle className="w-3 h-3" />
                                <span>Скопировано</span>
                              </>
                            ) : (
                              <>
                                <Copy className="w-3 h-3" />
                                <span>Копировать</span>
                              </>
                            )}
                          </button>
                        ) : (
                          <button
                            onClick={() => handleResetPassword(user)}
                            className="px-3 py-1.5 bg-orange-600 hover:bg-orange-700 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5"
                            title="Создать ссылку для сброса пароля"
                          >
                            <KeyRound className="w-3 h-3" />
                            <span>Сброс пароля</span>
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
    </>
  );
}

