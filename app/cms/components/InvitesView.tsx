'use client';

import React, { useState, useEffect } from 'react';
import { Mail, Plus, X, Copy, RefreshCw, CheckCircle, AlertCircle, Clock, Eye, EyeOff } from 'lucide-react';
import { api } from '@/lib/api';
import type { User, Invite } from '@/types';

export default function InvitesView({ currentUser }: { currentUser: User }) {
  const [invites, setInvites] = useState<Invite[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newInviteName, setNewInviteName] = useState('');
  const [expiresInDays, setExpiresInDays] = useState(7);
  const [copiedToken, setCopiedToken] = useState<string | null>(null);
  const [newInviteToken, setNewInviteToken] = useState<string | null>(null);
  const [visibleInviteUrl, setVisibleInviteUrl] = useState<string | null>(null);
  const [inviteUrls, setInviteUrls] = useState<Record<string, string>>({});

  const loadInvites = async () => {
    try {
      setLoading(true);
      const data = await api.getInvites();
      // Сортируем приглашения: использованные внизу, остальные по дате создания (старые выше)
      const sortedData = [...data].sort((a, b) => {
        // Сначала разделяем на использованные и неиспользованные
        if (a.used && !b.used) return 1; // a (использованное) идет после b
        if (!a.used && b.used) return -1; // a (неиспользованное) идет перед b
        
        // Если оба использованы или оба не использованы, сортируем по дате создания
        const dateA = new Date(a.createdAt).getTime();
        const dateB = new Date(b.createdAt).getTime();
        return dateA - dateB; // Старые выше (меньше дата = выше в списке)
      });
      setInvites(sortedData);
    } catch (error) {
      console.error('Error loading invites:', error);
      alert('Ошибка при загрузке приглашений');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadInvites();
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
      alert('Введите имя пользователя');
      return;
    }

    try {
      const invite = await api.createInvite(
        newInviteName.trim(),
        expiresInDays,
        currentUser.id!
      );
      
      setNewInviteToken(invite.inviteUrl);
      setNewInviteName('');
      // Автоматически копируем ссылку при создании
      await navigator.clipboard.writeText(invite.inviteUrl);
      setCopiedToken(invite.inviteUrl);
      setTimeout(() => setCopiedToken(null), 2000);
      await loadInvites();
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Ошибка при создании приглашения';
      alert(message);
    }
  };

  const handleRecreateInvite = async (name: string) => {
    if (!confirm(`Пересоздать приглашение для ${name}? Старое приглашение будет удалено.`)) {
      return;
    }

    try {
      const invite = await api.recreateInvite(
        name,
        expiresInDays,
        currentUser.id!
      );
      
      // Сохраняем URL для этого приглашения
      await loadInvites();
      const updatedInvites = await api.getInvites();
      const inviteId = updatedInvites.find((inv: Invite) => inv.name === name)?.id;
      if (inviteId) {
        setInviteUrls(prev => ({ ...prev, [inviteId]: invite.inviteUrl }));
        // Автоматически показываем ссылку после регенерации
        setVisibleInviteUrl(inviteId);
      }
      
      setNewInviteToken(invite.inviteUrl);
      // Автоматически копируем ссылку при регенерации
      await navigator.clipboard.writeText(invite.inviteUrl);
      setCopiedToken(invite.inviteUrl);
      setTimeout(() => setCopiedToken(null), 2000);
      
      await loadInvites();
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Ошибка при пересоздании приглашения';
      alert(message);
    }
  };

  const handleCopyLink = (url: string) => {
    navigator.clipboard.writeText(url);
    setCopiedToken(url);
    setTimeout(() => setCopiedToken(null), 2000);
  };

  if (loading) {
    return <div className="text-center py-12">Загрузка...</div>;
  }

  return (
    <div className="space-y-4 sm:space-y-6">
      <div className="bg-white rounded-lg shadow-sm p-4 sm:p-6 border border-gray-200">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900 flex items-center gap-2">
            <Mail className="w-5 h-5 sm:w-6 sm:h-6" />
            Управление приглашениями
          </h2>
          <button
            onClick={() => setShowCreateModal(true)}
            className="px-4 py-2 bg-gray-900 hover:bg-gray-800 text-white rounded-lg text-sm font-semibold flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            Создать приглашение
          </button>
        </div>

        {invites.length === 0 ? (
          <div className="text-center py-12 text-gray-500">
            <Mail className="w-16 h-16 mx-auto mb-4 text-gray-300" />
            <p>Нет созданных приглашений</p>
            <button
              onClick={() => setShowCreateModal(true)}
              className="mt-4 px-4 py-2 bg-gray-900 hover:bg-gray-800 text-white rounded-lg text-sm font-semibold"
            >
              Создать первое приглашение
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="border-b border-gray-200 bg-gray-50">
                  <th className="px-3 py-2 text-left text-xs font-semibold text-gray-700">Имя</th>
                  <th className="px-3 py-2 text-left text-xs font-semibold text-gray-700">Статус</th>
                  <th className="px-3 py-2 text-left text-xs font-semibold text-gray-700">Создано</th>
                  <th className="px-3 py-2 text-left text-xs font-semibold text-gray-700">Истекает</th>
                  <th className="px-3 py-2 text-left text-xs font-semibold text-gray-700">Использовано</th>
                  <th className="px-3 py-2 text-left text-xs font-semibold text-gray-700">Действия</th>
                </tr>
              </thead>
              <tbody>
                {invites.flatMap((invite) => {
                  const status = getInviteStatus(invite);
                  const StatusIcon = status.icon;
                  
                  const rows: React.ReactElement[] = [
                    <tr
                      key={invite.id}
                      className="border-b border-gray-100 hover:bg-gray-50 transition-colors"
                    >
                      <td className="px-3 py-2.5 text-sm text-gray-900 font-medium">
                        {invite.name || <span className="text-gray-400">Не указано</span>}
                      </td>
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
                      <td className="px-3 py-2.5">
                        <div className="flex items-center gap-2">
                          {/* Кнопка показать/скрыть ссылку */}
                          <button
                            onClick={() => {
                              if (visibleInviteUrl === invite.id) {
                                setVisibleInviteUrl(null);
                              } else {
                                // Если URL не сохранен, пытаемся получить его
                                const savedUrl = inviteUrls[invite.id];
                                if (savedUrl) {
                                  setVisibleInviteUrl(invite.id);
                                } else {
                                  // Показываем сообщение, что ссылка доступна только при создании/регенерации
                                  alert('Ссылка доступна только при создании или регенерации приглашения. Используйте кнопку регенерации для получения новой ссылки.');
                                }
                              }
                            }}
                            className="p-1.5 light:text-gray-600 dark:text-gray-600 hover:text-gray-800 hover:bg-gray-50 rounded"
                            title={visibleInviteUrl === invite.id ? "Скрыть ссылку" : "Показать ссылку"}
                          >
                            {visibleInviteUrl === invite.id ? (
                              <EyeOff className="w-4 h-4" />
                            ) : (
                              <Eye className="w-4 h-4" />
                            )}
                          </button>
                          
                          {/* Кнопка копирования ссылки */}
                          {inviteUrls[invite.id] && (
                            <button
                              onClick={() => handleCopyLink(inviteUrls[invite.id])}
                              className="p-1.5 text-green-600 hover:text-green-800 hover:bg-green-50 rounded"
                              title="Копировать ссылку"
                            >
                              {copiedToken === inviteUrls[invite.id] ? (
                                <CheckCircle className="w-4 h-4" />
                              ) : (
                                <Copy className="w-4 h-4" />
                              )}
                            </button>
                          )}
                          
                          {!invite.used && invite.name && (
                            <button
                              onClick={() => handleRecreateInvite(invite.name!)}
                              className="p-1.5 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded"
                              title="Пересоздать приглашение"
                            >
                              <RefreshCw className="w-4 h-4" />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ];
                  
                  // Добавляем строку с инпутом для ссылки, если она видима
                  if (visibleInviteUrl === invite.id && inviteUrls[invite.id]) {
                    rows.push(
                      <tr key={`${invite.id}-url`}>
                        <td colSpan={6} className="px-3 py-3 bg-gray-50">
                          <div className="flex gap-2 items-center sm:flex-row flex-col">
                            <input
                              type="text"
                              value={inviteUrls[invite.id]}
                              readOnly
                              className="flex-1 px-3 py-2 border border-gray-300 rounded-lg bg-white text-sm"
                              onClick={(e) => (e.target as HTMLInputElement).select()}
                            />
                            <button
                              onClick={() => handleCopyLink(inviteUrls[invite.id])}
                              className="px-3 py-2 bg-gray-900 hover:bg-gray-800 text-white rounded-lg flex items-center gap-2 text-sm"
                            >
                              {copiedToken === inviteUrls[invite.id] ? (
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
                        </td>
                      </tr>
                    );
                  }
                  
                  return rows;
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {showCreateModal && (
        <div className="fixed inset-0 bg-transparent flex items-center justify-center z-50 p-3 sm:p-4 pb-20 lg:pb-4">
          <div className="bg-white rounded-lg max-w-md w-full max-h-[calc(90vh-80px)] lg:max-h-[90vh] overflow-y-auto">
            <div className="p-4 sm:p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl sm:text-2xl font-bold">Создать приглашение</h2>
                <button
                  onClick={() => {
                    setShowCreateModal(false);
                    setNewInviteToken(null);
                  }}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <X className="w-5 h-5" />
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
                      placeholder="Иванов Иван "
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
    </div>
  );
}

