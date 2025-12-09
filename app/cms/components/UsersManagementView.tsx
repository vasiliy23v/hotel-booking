'use client';

import React, { useState, useEffect } from 'react';
import { Users, Plus, X, Copy, CheckCircle, AlertCircle, Clock, ArrowRight, KeyRound, Mail, Trash2, Key, RefreshCw } from 'lucide-react';
import { api } from '@/lib/api';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import type { User, Invite } from '@/types';
import UserDetailView from './UserDetailView';
import Toast, { type ToastType } from './Toast';

interface ToastState {
  message: string;
  type: ToastType;
}

export default function UsersManagementView({ 
  currentUser, 
  selectedUserId, 
  onSelectUser 
}: { 
  currentUser: User; 
  selectedUserId: string | null;
  onSelectUser: (userId: string | null) => void;
}) {
  const [users, setUsers] = useState<User[]>([]);
  const [invites, setInvites] = useState<Invite[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [createMode, setCreateMode] = useState<'invite' | 'direct'>('direct'); // 'invite' или 'direct'
  const [newInviteName, setNewInviteName] = useState('');
  const [newUserName, setNewUserName] = useState('');
  const [newUserEmail, setNewUserEmail] = useState('');
  const [newUserPhone, setNewUserPhone] = useState('');
  const [newUserPassword, setNewUserPassword] = useState('');
  const [newUserRole, setNewUserRole] = useState<'developer' | 'manager' | 'guest'>('guest');
  const [expiresInDays, setExpiresInDays] = useState(7);
  const [copiedToken, setCopiedToken] = useState<string | null>(null);
  const [newInviteToken, setNewInviteToken] = useState<string | null>(null);
  const [visibleInviteUrl, setVisibleInviteUrl] = useState<string | null>(null);
  const [inviteUrls, setInviteUrls] = useState<Record<string, string>>({});
  const [resetPasswordLinks, setResetPasswordLinks] = useState<Record<string, string>>({});
  const [copiedUserId, setCopiedUserId] = useState<string | null>(null);
  const [toast, setToast] = useState<ToastState | null>(null);
  const [registrationToken, setRegistrationToken] = useState<any>(null);
  const [registrationTokenLoading, setRegistrationTokenLoading] = useState(false);
  const [copiedRegistrationUrl, setCopiedRegistrationUrl] = useState(false);
  const [activeRegistrationUrl, setActiveRegistrationUrl] = useState<string | null>(null);

  const loadData = async () => {
    try {
      setLoading(true);
      const [usersData, invitesData] = await Promise.all([
        api.getUsers(),
        api.getInvites()
      ]);
      
      // Загружаем информацию об общем токене регистрации
      try {
        const tokenData = await api.getRegistrationToken(true); // Запрашиваем с ссылкой
        setRegistrationToken(tokenData);
        // Если есть ссылка, сохраняем её
        if (tokenData.registrationUrl) {
          setActiveRegistrationUrl(tokenData.registrationUrl);
          localStorage.setItem('activeRegistrationUrl', tokenData.registrationUrl);
        } else if (tokenData.urlUnavailable) {
          // Очищаем сохраненную ссылку, если она была сохранена ранее
          setActiveRegistrationUrl(null);
          localStorage.removeItem('activeRegistrationUrl');
        }
      } catch (error) {
        // Если токен не создан, это нормально
        setRegistrationToken(null);
      }
      setUsers(usersData);
      
      // Сортируем приглашения: использованные внизу, остальные по дате создания
      const sortedInvites = [...invitesData].sort((a, b) => {
        if (a.used && !b.used) return 1;
        if (!a.used && b.used) return -1;
        const dateA = new Date(a.createdAt).getTime();
        const dateB = new Date(b.createdAt).getTime();
        return dateA - dateB;
      });
      setInvites(sortedInvites);
    } catch (error) {
      console.error('Error loading data:', error);
      alert('Ошибка при загрузке данных');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
    // Восстанавливаем сохраненную ссылку из localStorage
    const savedUrl = localStorage.getItem('activeRegistrationUrl');
    if (savedUrl) {
      setActiveRegistrationUrl(savedUrl);
    }
  }, []);

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

  const handleCreateInvite = async () => {
    if (!newInviteName.trim()) {
      setToast({
        message: 'Введите имя пользователя',
        type: 'error'
      });
      return;
    }

    try {
      const invite = await api.createInvite(
        newInviteName.trim(),
        expiresInDays,
        currentUser.id!
      );
      
      setNewInviteToken(invite.inviteUrl);
      // Сохраняем URL перед загрузкой данных, чтобы он был доступен после обновления
      setInviteUrls(prev => ({ ...prev, [invite.id]: invite.inviteUrl }));
      setNewInviteName('');
      await navigator.clipboard.writeText(invite.inviteUrl);
      setCopiedToken(invite.inviteUrl);
      setTimeout(() => setCopiedToken(null), 2000);
      setToast({
        message: 'Приглашение создано и скопировано в буфер обмена!',
        type: 'success'
      });
      // Загружаем данные после сохранения URL
      await loadData();
      // После загрузки восстанавливаем видимость URL для нового приглашения
      if (invite.id) {
        setVisibleInviteUrl(invite.id);
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Ошибка при создании приглашения';
      setToast({
        message,
        type: 'error'
      });
    }
  };

  const handleCreateUser = async () => {
    if (!newUserName.trim()) {
      setToast({
        message: 'Введите имя пользователя',
        type: 'error'
      });
      return;
    }

    if (!newUserPhone.trim()) {
      setToast({
        message: 'Телефон обязателен',
        type: 'error'
      });
      return;
    }

    try {
      const newUser = await api.createUser({
        name: newUserName.trim(),
        email: newUserEmail.trim() || undefined,
        phone: newUserPhone.trim() || undefined,
        password: newUserPassword.trim() || undefined,
        role: newUserRole,
        directCreate: true, // Флаг для прямого создания
      });
      
      // Очищаем форму
      setNewUserName('');
      setNewUserEmail('');
      setNewUserPhone('');
      setNewUserPassword('');
      setNewUserRole('guest');
      
      setToast({
        message: 'Пользователь успешно создан!',
        type: 'success'
      });
      
      // Закрываем модальное окно и обновляем данные
      setShowCreateModal(false);
      await loadData();
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Ошибка при создании пользователя';
      setToast({
        message,
        type: 'error'
      });
    }
  };

  const handleRecreateInvite = async (name: string) => {
    try {
      const invite = await api.recreateInvite(
        name,
        expiresInDays,
        currentUser.id!
      );
      
      await loadData();
      const updatedInvites = await api.getInvites();
      const inviteId = updatedInvites.find((inv: Invite) => inv.name === name)?.id;
      if (inviteId) {
        setInviteUrls(prev => ({ ...prev, [inviteId]: invite.inviteUrl }));
        // Показываем приглашение после регенерации
        setVisibleInviteUrl(inviteId);
      }
      
      await navigator.clipboard.writeText(invite.inviteUrl);
      setCopiedToken(invite.inviteUrl);
      setTimeout(() => setCopiedToken(null), 2000);
      setToast({
        message: 'Приглашение создано и скопировано в буфер обмена!',
        type: 'success'
      });
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Ошибка при создании приглашения';
      setToast({
        message,
        type: 'error'
      });
    }
  };

  const handleCopyLink = async (url: string) => {
    try {
      await navigator.clipboard.writeText(url);
      setCopiedToken(url);
      setTimeout(() => setCopiedToken(null), 2000);
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
      
      setResetPasswordLinks(prev => ({
        ...prev,
        [user.id!]: invite.inviteUrl
      }));
      
      try {
        await navigator.clipboard.writeText(invite.inviteUrl);
        setCopiedUserId(user.id!);
        setTimeout(() => setCopiedUserId(null), 2000);
        setToast({
          message: `Ссылка для сброса пароля создана и скопирована в буфер обмена!`,
          type: 'success'
        });
      } catch {
        setToast({
          message: `Ссылка для сброса пароля создана: ${invite.inviteUrl}`,
          type: 'success'
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

  const handleDeleteUser = async (user: User) => {
    // Нельзя удалить самого себя
    if (user.id === currentUser.id) {
      setToast({
        message: 'Вы не можете удалить свой собственный аккаунт',
        type: 'error'
      });
      return;
    }

    if (!confirm(`Вы уверены, что хотите удалить пользователя "${user.name}" (${user.email})? Это действие нельзя отменить.`)) {
      return;
    }

    try {
      await api.deleteUser(user.id!);
      setToast({
        message: `Пользователь "${user.name}" успешно удален`,
        type: 'success'
      });
      await loadData();
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Ошибка при удалении пользователя';
      setToast({
        message,
        type: 'error'
      });
    }
  };

  // Получить приглашения для пользователя
  const getUserInvites = (userName: string) => {
    return invites.filter(inv => inv.name === userName);
  };

  // Проверить, есть ли у пользователя использованные приглашения
  // Если пользователь существует (зарегистрирован), значит у него должно быть использованное приглашение
  const hasUsedInvites = (userName: string) => {
    // Если пользователь существует в списке пользователей, значит он зарегистрирован
    const userExists = users.some(u => u.name === userName);
    if (userExists) {
      return true; // Пользователь зарегистрирован, значит приглашение использовано
    }
    // Если пользователя нет, проверяем приглашения
    return invites.some(inv => inv.name === userName && inv.used);
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
        {/* Секция управления общим токеном регистрации */}
        <div className="bg-white dark:bg-card rounded-lg shadow-sm p-4 sm:p-6 border border-gray-200 dark:border-border">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4">
            <div>
              <h3 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-foreground flex items-center gap-2 mb-2">
                <Key className="w-5 h-5 sm:w-6 sm:h-6" />
                Общий токен регистрации
              </h3>
              <p className="text-sm text-gray-600 dark:text-muted-foreground">
                Создайте общую ссылку для регистрации. Люди с этой ссылкой смогут регистрироваться без индивидуальных приглашений.
              </p>
            </div>
          </div>

          {registrationToken?.exists ? (
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-green-600 dark:text-green-400">
                <CheckCircle className="w-5 h-5" />
                <span className="text-sm font-medium">Активный токен создан</span>
              </div>
              <div className="bg-gray-50 dark:bg-muted rounded-lg p-3 border border-gray-200 dark:border-border">
                <div className="text-xs text-gray-600 dark:text-muted-foreground mb-2">Создан:</div>
                <div className="text-sm text-gray-900 dark:text-foreground">
                  {new Date(registrationToken.createdAt).toLocaleString('ru-RU', {
                    day: '2-digit',
                    month: '2-digit',
                    year: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </div>
              </div>
              
              {/* Ссылка для копирования */}
              {activeRegistrationUrl ? (
                <div className="bg-gray-50 dark:bg-muted border border-gray-200 dark:border-border rounded-lg p-3">
                  <div className="flex flex-col sm:flex-row gap-2 items-stretch sm:items-center">
                    <input
                      type="text"
                      value={activeRegistrationUrl}
                      readOnly
                      className="w-full sm:flex-1 px-3 py-2 border border-gray-300 dark:border-border rounded-lg bg-white dark:bg-input text-sm text-gray-700 dark:text-foreground"
                      onClick={(e) => (e.target as HTMLInputElement).select()}
                    />
                    <button
                      onClick={async () => {
                        try {
                          await navigator.clipboard.writeText(activeRegistrationUrl);
                          setCopiedRegistrationUrl(true);
                          setToast({
                            message: 'Ссылка скопирована в буфер обмена',
                            type: 'success'
                          });
                          setTimeout(() => setCopiedRegistrationUrl(false), 2000);
                        } catch (error) {
                          setToast({
                            message: 'Ошибка при копировании ссылки',
                            type: 'error'
                          });
                        }
                      }}
                      className="w-full sm:w-auto px-4 py-2 bg-gray-700 dark:bg-primary hover:bg-gray-800 dark:hover:bg-primary/80 text-white dark:text-primary-foreground rounded-lg flex items-center justify-center gap-2 text-sm font-semibold sm:shrink-0 transition-colors"
                    >
                      {copiedRegistrationUrl ? (
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
                  </div>
                </div>
              ) : (
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                    <div className="flex items-center gap-2 text-yellow-800">
                      <AlertCircle className="w-4 h-4" />
                      <span className="text-sm">Ссылка не загружена. Получите ссылку для активного токена.</span>
                    </div>
                    <button
                      onClick={async () => {
                        try {
                          setRegistrationTokenLoading(true);
                          const tokenData = await api.getRegistrationToken(true); // Запрашиваем с ссылкой
                          if (tokenData.registrationUrl) {
                            setActiveRegistrationUrl(tokenData.registrationUrl);
                            localStorage.setItem('activeRegistrationUrl', tokenData.registrationUrl);
                            setToast({
                              message: 'Ссылка успешно загружена',
                              type: 'success'
                            });
                          } else if (tokenData.urlUnavailable) {
                            setToast({
                              message: tokenData.message || 'Ссылка недоступна. Токен был создан до обновления системы. Создайте новый токен для получения ссылки.',
                              type: 'error'
                            });
                          } else {
                            setToast({
                              message: 'Не удалось получить ссылку',
                              type: 'error'
                            });
                          }
                        } catch (error) {
                          const message = error instanceof Error ? error.message : 'Ошибка при получении ссылки';
                          setToast({ message, type: 'error' });
                        } finally {
                          setRegistrationTokenLoading(false);
                        }
                      }}
                      disabled={registrationTokenLoading}
                      className="px-4 py-2 bg-yellow-600 hover:bg-yellow-700 text-white rounded-lg text-sm font-semibold flex items-center gap-2 disabled:opacity-50 shrink-0"
                    >
                      <RefreshCw className={`w-4 h-4 ${registrationTokenLoading ? 'animate-spin' : ''}`} />
                      {registrationTokenLoading ? 'Загрузка...' : 'Получить ссылку'}
                    </button>
                  </div>
                </div>
              )}

              <div className="flex flex-col sm:flex-row gap-2">
                <button
                  onClick={async () => {
                    try {
                      setRegistrationTokenLoading(true);
                      const result = await api.createOrUpdateRegistrationToken();
                      setRegistrationToken({
                        exists: true,
                        createdAt: result.createdAt,
                        updatedAt: result.updatedAt,
                      });
                      // Сохраняем ссылку в состоянии
                      setActiveRegistrationUrl(result.registrationUrl);
                      // Сохраняем ссылку в localStorage для сохранения после перезагрузки
                      localStorage.setItem('activeRegistrationUrl', result.registrationUrl);
                      setToast({
                        message: 'Новый токен регистрации создан. Старый токен автоматически деактивирован.',
                        type: 'success'
                      });
                      // Копируем новую ссылку в буфер обмена
                      await navigator.clipboard.writeText(result.registrationUrl);
                      setCopiedRegistrationUrl(true);
                      setTimeout(() => setCopiedRegistrationUrl(false), 2000);
                    } catch (error) {
                      const message = error instanceof Error ? error.message : 'Ошибка при создании токена';
                      setToast({ message, type: 'error' });
                    } finally {
                      setRegistrationTokenLoading(false);
                    }
                  }}
                  disabled={registrationTokenLoading}
                  className="px-4 py-2 bg-gray-700 dark:bg-primary hover:bg-gray-800 dark:hover:bg-primary/80 text-white dark:text-primary-foreground rounded-lg text-sm font-semibold flex items-center gap-2 disabled:opacity-50 transition-colors"
                >
                  <RefreshCw className={`w-4 h-4 ${registrationTokenLoading ? 'animate-spin' : ''}`} />
                  {registrationTokenLoading ? 'Создание...' : 'Создать новый токен'}
                </button>
              </div>
              <p className="text-xs text-gray-500 dark:text-muted-foreground">
                При создании нового токена старый автоматически деактивируется. Все ссылки со старым токеном перестанут работать.
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-gray-600 dark:text-muted-foreground">
                <AlertCircle className="w-5 h-5" />
                <span className="text-sm">Общий токен регистрации не создан</span>
              </div>
              <button
                onClick={async () => {
                  try {
                    setRegistrationTokenLoading(true);
                    const result = await api.createOrUpdateRegistrationToken();
                    setRegistrationToken({
                      exists: true,
                      createdAt: result.createdAt,
                      updatedAt: result.updatedAt,
                    });
                    // Сохраняем ссылку в состоянии
                    setActiveRegistrationUrl(result.registrationUrl);
                    // Сохраняем ссылку в localStorage для сохранения после перезагрузки
                    localStorage.setItem('activeRegistrationUrl', result.registrationUrl);
                    setToast({
                      message: 'Токен регистрации создан! Ссылка скопирована в буфер обмена.',
                      type: 'success'
                    });
                    // Копируем ссылку в буфер обмена
                    await navigator.clipboard.writeText(result.registrationUrl);
                    setCopiedRegistrationUrl(true);
                    setTimeout(() => setCopiedRegistrationUrl(false), 2000);
                  } catch (error) {
                    const message = error instanceof Error ? error.message : 'Ошибка при создании токена';
                    setToast({ message, type: 'error' });
                  } finally {
                    setRegistrationTokenLoading(false);
                  }
                }}
                disabled={registrationTokenLoading}
                className="px-4 py-2 bg-gray-900 dark:bg-primary hover:bg-gray-800 dark:hover:bg-primary/80 text-white dark:text-primary-foreground rounded-lg text-sm font-semibold flex items-center gap-2 disabled:opacity-50 transition-colors"
              >
                <Key className={`w-4 h-4 ${registrationTokenLoading ? 'animate-spin' : ''}`} />
                {registrationTokenLoading ? 'Создание...' : 'Создать токен регистрации'}
              </button>
            </div>
          )}
        </div>

        <div className="bg-white dark:bg-card rounded-lg shadow-sm p-4 sm:p-6 border border-gray-200 dark:border-border">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-foreground flex items-center gap-2">
              <Users className="w-5 h-5 sm:w-6 sm:h-6" />
              Управление пользователями
            </h2>
            <button
              onClick={() => setShowCreateModal(true)}
              className="px-4 py-2 bg-gray-900 dark:bg-primary hover:bg-gray-800 dark:hover:bg-primary/80 text-white dark:text-primary-foreground rounded-lg text-sm font-semibold flex items-center gap-2 transition-colors"
            >
              <Plus className="w-4 h-4" />
              Добавить пользователя
            </button>
          </div>

          {users.length === 0 && invites.length === 0 ? (
            <div className="text-center py-12 text-gray-500 dark:text-muted-foreground">
              <Users className="w-16 h-16 mx-auto mb-4 text-gray-300 dark:text-muted-foreground" />
              <p>Нет пользователей</p>
              <button
                onClick={() => setShowCreateModal(true)}
                className="mt-4 px-4 py-2 bg-gray-900 dark:bg-primary hover:bg-gray-800 dark:hover:bg-primary/80 text-white dark:text-primary-foreground rounded-lg text-sm font-semibold transition-colors"
              >
                Добавить первого пользователя
              </button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table className="min-w-[1000px]">
                <TableHeader>
                  <TableRow className="bg-gray-50 dark:bg-muted hover:bg-transparent border-b border-gray-200 dark:border-border">
                    <TableHead className="text-xs font-semibold text-gray-700 dark:text-foreground">Имя</TableHead>
                    <TableHead className="text-xs font-semibold text-gray-700 dark:text-foreground">Email</TableHead>
                    <TableHead className="text-xs font-semibold text-gray-700 dark:text-foreground">Телефон</TableHead>
                    <TableHead className="text-xs font-semibold text-gray-700 dark:text-foreground">Роль</TableHead>
                    <TableHead className="text-xs font-semibold text-gray-700 dark:text-foreground">Дата регистрации</TableHead>
                    <TableHead className="text-xs font-semibold text-gray-700 dark:text-foreground">Действия</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {users.map((user) => {
                    const userInvites = getUserInvites(user.name);
                    const userHasUsedInvites = hasUsedInvites(user.name);
                    return (
                      <React.Fragment key={user.id}>
                        <TableRow className="hover:bg-gray-100 dark:hover:bg-accent transition-colors">
                          <TableCell className="text-sm text-gray-900 dark:text-foreground font-medium">
                            {user.name}
                          </TableCell>
                          <TableCell className="text-sm text-gray-700 dark:text-foreground">
                            {user.email}
                          </TableCell>
                          <TableCell className="text-sm text-gray-700 dark:text-foreground">
                            {user.phone || <span className="text-gray-400 dark:text-muted-foreground">—</span>}
                          </TableCell>
                          <TableCell>
                            <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-semibold ${
                              user.role === 'manager' 
                                ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300' 
                                : user.role === 'developer'
                                ? 'bg-purple-100 dark:bg-purple-900/30 text-purple-800 dark:text-purple-300'
                                : 'bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200'
                            }`}>
                              {user.role === 'developer' ? 'Разработчик' : user.role === 'manager' ? 'Менеджер' : 'Гость'}
                            </span>
                          </TableCell>
                          <TableCell className="text-sm text-gray-700 dark:text-foreground">
                            {user.createdAt ? (
                              new Date(user.createdAt).toLocaleDateString('ru-RU', {
                                day: '2-digit',
                                month: '2-digit',
                                year: 'numeric',
                                hour: '2-digit',
                                minute: '2-digit'
                              })
                            ) : (
                              <span className="text-gray-400 dark:text-muted-foreground">—</span>
                            )}
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2 flex-wrap">
                              <button
                                onClick={() => onSelectUser(user.id!)}
                                className="px-3 py-1.5 bg-gray-900 dark:bg-primary hover:bg-gray-800 dark:hover:bg-primary/80 text-white dark:text-primary-foreground rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors"
                              >
                                <span>Подробнее</span>
                                <ArrowRight className="w-3 h-3" />
                              </button>
                              
                              {/* Если есть использованные приглашения - показываем сброс пароля, иначе - создание приглашения */}
                              {userHasUsedInvites ? (
                                resetPasswordLinks[user.id!] ? (
                                  <button
                                    onClick={() => handleCopyResetLink(user.id!, resetPasswordLinks[user.id!])}
                                    className="px-3 py-1.5 bg-blue-600 dark:bg-blue-700 hover:bg-blue-700 dark:hover:bg-blue-800 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors"
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
                                    className="px-3 py-1.5 bg-orange-600 dark:bg-orange-700 hover:bg-orange-700 dark:hover:bg-orange-800 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors"
                                    title="Создать ссылку для сброса пароля"
                                  >
                                    <KeyRound className="w-3 h-3" />
                                    <span>Сброс пароля</span>
                                  </button>
                                )
                              ) : (
                                <button
                                  onClick={() => handleRecreateInvite(user.name)}
                                  className="px-3 py-1.5 bg-blue-600 dark:bg-blue-700 hover:bg-blue-700 dark:hover:bg-blue-800 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors"
                                  title="Создать/регенерировать приглашение"
                                >
                                  <Mail className="w-3 h-3" />
                                  <span>Приглашение</span>
                                </button>
                              )}
                              
                              {user.id !== currentUser.id && (
                                <button
                                  onClick={() => handleDeleteUser(user)}
                                  className="px-3 py-1.5 bg-red-600 dark:bg-red-700 hover:bg-red-700 dark:hover:bg-red-800 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors"
                                  title="Удалить пользователя"
                                >
                                  <Trash2 className="w-3 h-3" />
                                  <span>Удалить</span>
                                </button>
                              )}
                            </div>
                          </TableCell>
                        </TableRow>
                        
                        {/* Показываем приглашение только если оно было создано/регенерировано */}
                        {visibleInviteUrl && userInvites.some(inv => inv.id === visibleInviteUrl) && (() => {
                          const invite = userInvites.find(inv => inv.id === visibleInviteUrl);
                          const inviteUrl = inviteUrls[visibleInviteUrl];
                          if (!invite || !inviteUrl) return null;
                          
                          return (
                            <TableRow key={`${user.id}-invite`} className="bg-gray-50 dark:bg-muted hover:bg-gray-50 dark:hover:bg-accent">
                              <TableCell colSpan={6} className="py-3">
                                <div className="space-y-2">
                                  <div className="text-xs font-semibold text-gray-700 mb-2 flex items-center gap-1">
                                    <Mail className="w-3 h-3" />
                                    Приглашение для {user.name}:
                                  </div>
                                  <div className="flex gap-2 items-center">
                                    <input
                                      type="text"
                                      value={inviteUrl}
                                      readOnly
                                      className="flex-1 px-3 py-2 border border-gray-300 dark:border-border rounded-lg bg-white dark:bg-input text-sm text-gray-900 dark:text-foreground"
                                      onClick={(e) => (e.target as HTMLInputElement).select()}
                                    />
                                    <button
                                      onClick={() => handleCopyLink(inviteUrl)}
                                      className="px-3 py-2 bg-gray-900 dark:bg-primary hover:bg-gray-800 dark:hover:bg-primary/80 text-white dark:text-primary-foreground rounded-lg flex items-center gap-2 text-sm transition-colors"
                                    >
                                      {copiedToken === inviteUrl ? (
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
                                      onClick={() => setVisibleInviteUrl(null)}
                                      className="px-3 py-2 bg-gray-300 dark:bg-muted hover:bg-gray-400 dark:hover:bg-accent text-gray-700 dark:text-foreground rounded-lg text-sm transition-colors"
                                    >
                                      <X className="w-4 h-4" />
                                    </button>
                                  </div>
                                </div>
                              </TableCell>
                            </TableRow>
                          );
                        })()}
                      </React.Fragment>
                    );
                  })}
                </TableBody>
              </Table>
            </div>
          )}
        </div>
      </div>

      {/* Модальное окно создания приглашения/пользователя */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-3 sm:p-4 pb-20 lg:pb-4">
          <div className="bg-white dark:bg-card rounded-lg max-w-md w-full max-h-[calc(90vh-80px)] lg:max-h-[90vh] overflow-y-auto">
            <div className="p-4 sm:p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl sm:text-2xl font-bold">Добавить пользователя</h2>
                <button
                  onClick={() => {
                    setShowCreateModal(false);
                    setNewInviteToken(null);
                    setCreateMode('direct');
                    setNewInviteName('');
                    setNewUserName('');
                    setNewUserEmail('');
                    setNewUserPhone('');
                    setNewUserPassword('');
                    setNewUserRole('guest');
                  }}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Переключатель режима создания */}
              <div className="mb-4 flex gap-2 border-b border-gray-200 dark:border-border">
                <button
                  onClick={() => setCreateMode('direct')}
                  className={`px-4 py-2 text-sm font-semibold transition-colors ${
                    createMode === 'direct'
                      ? 'border-b-2 border-gray-900 dark:border-ring text-gray-900 dark:text-foreground'
                      : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  Создать пользователя
                </button>
                <button
                  onClick={() => setCreateMode('invite')}
                  className={`px-4 py-2 text-sm font-semibold transition-colors ${
                    createMode === 'invite'
                      ? 'border-b-2 border-gray-900 dark:border-ring text-gray-900 dark:text-foreground'
                      : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  Создать приглашение
                </button>
              </div>

              {newInviteToken ? (
                <div className="space-y-4">
                  <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <CheckCircle className="w-5 h-5 text-green-600" />
                      <span className="font-semibold text-green-800">Приглашение создано!</span>
                    </div>
                    <p className="text-sm text-green-700 mb-3">Отправьте эту ссылку пользователю:</p>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={newInviteToken}
                        readOnly
                        className="flex-1 px-3 py-2 border border-green-300 rounded-lg bg-white text-sm"
                        onClick={(e) => (e.target as HTMLInputElement).select()}
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
                    </div>
                  </div>
                  <button
                    onClick={() => {
                      setShowCreateModal(false);
                      setNewInviteToken(null);
                    }}
                    className="w-full bg-gray-900 hover:bg-gray-800 text-white py-2 rounded-lg font-semibold"
                  >
                    Закрыть
                  </button>
                </div>
              ) : createMode === 'direct' ? (
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    handleCreateUser();
                  }}
                  className="space-y-4"
                >
                  <div>
                    <label className="block text-sm font-semibold mb-2">
                      Имя пользователя <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={newUserName}
                      onChange={(e) => setNewUserName(e.target.value)}
                      placeholder="Muller Felix"
                      className="w-full px-3 py-2 border-2 border-gray-300 rounded-lg focus:border-gray-900 focus:outline-none"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold mb-2">
                      Телефон <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="tel"
                      value={newUserPhone}
                      onChange={(e) => setNewUserPhone(e.target.value)}
                      placeholder="+79991234567"
                      className="w-full px-3 py-2 border-2 border-gray-300 rounded-lg focus:border-gray-900 focus:outline-none"
                      required
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      Обязательное поле для входа в систему
                    </p>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold mb-2">
                      Email
                    </label>
                    <input
                      type="email"
                      value={newUserEmail}
                      onChange={(e) => setNewUserEmail(e.target.value)}
                      placeholder="user@example.com"
                      className="w-full px-3 py-2 border-2 border-gray-300 rounded-lg focus:border-gray-900 focus:outline-none"
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      Опционально. Можно использовать для входа в систему
                    </p>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold mb-2">
                      Пароль
                    </label>
                    <input
                      type="password"
                      value={newUserPassword}
                      onChange={(e) => setNewUserPassword(e.target.value)}
                      placeholder="Оставьте пустым для установки позже"
                      className="w-full px-3 py-2 border-2 border-gray-300 rounded-lg focus:border-gray-900 focus:outline-none"
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      Пароль можно установить позже через сброс пароля
                    </p>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold mb-2">
                      Роль
                    </label>
                    <select
                      value={newUserRole}
                      onChange={(e) => setNewUserRole(e.target.value as 'developer' | 'manager' | 'guest')}
                      className="w-full px-3 py-2 border-2 border-gray-300 rounded-lg focus:border-gray-900 focus:outline-none"
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
                      type="button"
                      onClick={() => {
                        setShowCreateModal(false);
                        setNewUserName('');
                        setNewUserEmail('');
                        setNewUserPhone('');
                        setNewUserPassword('');
                        setNewUserRole('guest');
                      }}
                      className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-700 py-2 rounded-lg font-semibold"
                    >
                      Отмена
                    </button>
                    <button
                      type="submit"
                      className="flex-1 bg-gray-900 hover:bg-gray-800 text-white py-2 rounded-lg font-semibold"
                    >
                      Создать
                    </button>
                  </div>
                </form>
              ) : (
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    handleCreateInvite();
                  }}
                  className="space-y-4"
                >
                  <div>
                    <label className="block text-sm font-semibold mb-2">
                      Имя пользователя <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={newInviteName}
                      onChange={(e) => setNewInviteName(e.target.value)}
                      placeholder="Muller Felix"
                      className="w-full px-3 py-2 border-2 border-gray-300 rounded-lg focus:border-gray-900 focus:outline-none"
                      required
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      Приглашение будет привязано к этому имени. Email и пароль пользователь введет сам при регистрации.
                    </p>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold mb-2">
                      Срок действия (дней)
                    </label>
                    <input
                      type="number"
                      value={expiresInDays}
                      onChange={(e) => setExpiresInDays(Number(e.target.value) || 7)}
                      min="1"
                      max="365"
                      className="w-full px-3 py-2 border-2 border-gray-300 rounded-lg focus:border-gray-900 focus:outline-none"
                    />
                  </div>

                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => {
                        setShowCreateModal(false);
                        setNewInviteToken(null);
                        setNewInviteName('');
                      }}
                      className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-700 py-2 rounded-lg font-semibold"
                    >
                      Отмена
                    </button>
                    <button
                      type="submit"
                      className="flex-1 bg-gray-900 hover:bg-gray-800 text-white py-2 rounded-lg font-semibold"
                    >
                      Создать
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}

