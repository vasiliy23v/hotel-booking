'use client';

import { useState, useEffect } from 'react';
import { MessageSquare, User, Mail, Calendar, Image as ImageIcon, Search, RefreshCw, Eye, X, Filter, Trash2, CheckSquare } from 'lucide-react';
import { api } from '@/lib/api';
import type { Feedback } from '@/types';

export default function FeedbackView() {
  const [feedbacks, setFeedbacks] = useState<Feedback[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterRole, setFilterRole] = useState<string>('all');
  const [selectedFeedback, setSelectedFeedback] = useState<Feedback | null>(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  useEffect(() => {
    loadFeedbacks();
  }, []);

  const loadFeedbacks = async () => {
    try {
      setLoading(true);
      const data = await api.getFeedbacks();
      setFeedbacks(data);
    } catch (error) {
      console.error('Error loading feedbacks:', error);
      setFeedbacks([]);
    } finally {
      setLoading(false);
    }
  };

  const handleViewDetail = (feedback: Feedback) => {
    setSelectedFeedback(feedback);
    setShowDetailModal(true);
  };

  const handleToggleProcessed = async (feedback: Feedback, event?: React.ChangeEvent<HTMLInputElement> | React.MouseEvent) => {
    if (event) {
      event.stopPropagation();
    }

    if (!feedback || !feedback.id) {
      console.error('Invalid feedback:', feedback);
      return;
    }

    const newProcessedStatus = !feedback.isProcessed;

    try {
      setUpdatingId(feedback.id);
      
      // Оптимистичное обновление UI
      setFeedbacks(prevFeedbacks => 
        prevFeedbacks.map(f => 
          f && f.id === feedback.id 
            ? { ...f, isProcessed: newProcessedStatus }
            : f
        )
      );
      
      // Обновляем на сервере
      const response = await api.updateFeedbackStatus(feedback.id, newProcessedStatus);
      
      // API возвращает объект с полем feedback
      const updatedFeedback = response.feedback || response;
      
      // Обновляем отзыв в списке с данными с сервера
      setFeedbacks(prevFeedbacks => 
        prevFeedbacks.map(f => 
          f && f.id === feedback.id ? updatedFeedback : f
        )
      );
      
      // Если обновляемый отзыв открыт в модальном окне, обновляем его
      if (selectedFeedback?.id === feedback.id) {
        setSelectedFeedback(updatedFeedback);
      }
    } catch (error) {
      console.error('Error updating feedback status:', error);
      // Откатываем изменения при ошибке
      setFeedbacks(prevFeedbacks => 
        prevFeedbacks.map(f => 
          f && f.id === feedback.id 
            ? { ...f, isProcessed: feedback.isProcessed }
            : f
        )
      );
      alert('Ошибка при обновлении статуса отзыва');
    } finally {
      setUpdatingId(null);
    }
  };

  const handleDelete = async (feedback: Feedback, event?: React.MouseEvent) => {
    if (event) {
      event.stopPropagation();
    }

    if (!confirm(`Вы уверены, что хотите удалить отзыв от ${feedback.userName}?`)) {
      return;
    }

    try {
      setDeletingId(feedback.id);
      await api.deleteFeedback(feedback.id);
      
      // Удаляем отзыв из списка
      setFeedbacks(feedbacks.filter(f => f.id !== feedback.id));
      
      // Если удаляемый отзыв открыт в модальном окне, закрываем его
      if (selectedFeedback?.id === feedback.id) {
        setShowDetailModal(false);
        setSelectedFeedback(null);
      }
    } catch (error) {
      console.error('Error deleting feedback:', error);
      alert('Ошибка при удалении отзыва');
    } finally {
      setDeletingId(null);
    }
  };

  // Фильтрация и сортировка отзывов
  const filteredFeedbacks = feedbacks
    .filter(feedback => {
      if (!feedback || !feedback.id) return false;
      
      const matchesSearch = 
        (feedback.userName?.toLowerCase() || '').includes(searchQuery.toLowerCase()) ||
        (feedback.comment?.toLowerCase() || '').includes(searchQuery.toLowerCase()) ||
        (feedback.userEmail && feedback.userEmail.toLowerCase().includes(searchQuery.toLowerCase()));
      
      const matchesRole = filterRole === 'all' || feedback.userRole === filterRole;
      
      return matchesSearch && matchesRole;
    })
    .sort((a, b) => {
      if (!a || !b) return 0;
      // Сначала необработанные, потом обработанные
      if (a.isProcessed !== b.isProcessed) {
        return a.isProcessed ? 1 : -1;
      }
      // Внутри каждой группы сортируем по дате создания (новые сверху)
      const dateA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
      const dateB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
      return dateB - dateA;
    });

  // Получение уникальных ролей
  const uniqueRoles = Array.from(new Set(feedbacks.map(f => f.userRole)));

  const formatDate = (dateString: string) => {
    if (!dateString) return 'Дата не указана';
    const date = new Date(dateString);
    if (isNaN(date.getTime())) {
      return 'Неверная дата';
    }
    return new Intl.DateTimeFormat('ru-RU', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case 'manager':
        return 'bg-blue-100 text-blue-800';
      case 'guest':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getRoleLabel = (role: string) => {
    switch (role) {
      case 'manager':
        return 'Менеджер';
      case 'guest':
        return 'Гость';
      default:
        return role;
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <RefreshCw className="w-8 h-8 text-gray-400 animate-spin mx-auto mb-2" />
          <div className="text-gray-600">Загрузка отзывов...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Заголовок и статистика */}
      <div className="bg-white rounded-lg border border-gray-200 p-4 sm:p-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-1">Отзывы и обратная связь</h2>
            <p className="text-sm text-gray-600">
              Всего отзывов: {feedbacks.length} 
              {filteredFeedbacks.length !== feedbacks.length && ` (найдено: ${filteredFeedbacks.length})`}
            </p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-2"
            >
              <Filter className="w-4 h-4" />
              <span>Фильтры</span>
            </button>
            <button
              onClick={loadFeedbacks}
              className="px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors flex items-center gap-2"
            >
              <RefreshCw className="w-4 h-4" />
              <span>Обновить</span>
            </button>
          </div>
        </div>

        {/* Поиск и фильтры */}
        <div className={`space-y-3 ${showFilters ? 'block' : 'hidden'}`}>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Поиск по имени, email или тексту отзыва..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:border-gray-900 focus:outline-none"
            />
          </div>
          <div className="flex gap-3">
            <select
              value={filterRole}
              onChange={(e) => setFilterRole(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:border-gray-900 focus:outline-none"
            >
              <option key="all" value="all">Все роли</option>
              {uniqueRoles.map(role => (
                <option key={role} value={role}>
                  {getRoleLabel(role)}
                </option>
              ))}
            </select>
            {(searchQuery || filterRole !== 'all') && (
              <button
                onClick={() => {
                  setSearchQuery('');
                  setFilterRole('all');
                }}
                className="px-4 py-2 text-gray-600 hover:text-gray-900 flex items-center gap-2"
              >
                <X className="w-4 h-4" />
                <span>Сбросить</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Список отзывов */}
      {filteredFeedbacks.length === 0 ? (
        <div className="bg-white rounded-lg border border-gray-200 p-12 text-center">
          <MessageSquare className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600">
            {feedbacks.length === 0 
              ? 'Отзывов пока нет' 
              : 'Отзывы не найдены по заданным фильтрам'}
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {filteredFeedbacks.map((feedback) => {
            if (!feedback || !feedback.id) return null;
            return (
            <div
              key={feedback.id}
              className={`rounded-lg border p-4 sm:p-6 transition-all ${
                feedback.isProcessed
                  ? 'bg-gray-50 border-gray-300 opacity-75'
                  : 'bg-white border-gray-200 hover:shadow-md'
              }`}
            >
              <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                <div className="flex-1 flex items-start gap-3">
                  <label className="flex items-center cursor-pointer pt-1">
                    <input
                      type="checkbox"
                      checked={feedback.isProcessed || false}
                      onChange={(e) => handleToggleProcessed(feedback, e)}
                      disabled={updatingId === feedback.id}
                      className="w-5 h-5 text-gray-900 border-gray-300 rounded focus:ring-gray-500 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                    />
                  </label>
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center shrink-0">
                        <User className={`w-5 h-5 ${feedback.isProcessed ? 'text-gray-400' : 'text-gray-600'}`} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <h3 className={`font-semibold ${feedback.isProcessed ? 'text-gray-500' : 'text-gray-900'}`}>
                            {feedback.userName}
                          </h3>
                          <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${getRoleBadgeColor(feedback.userRole)} ${feedback.isProcessed ? 'opacity-60' : ''}`}>
                            {getRoleLabel(feedback.userRole)}
                          </span>
                        </div>
                        {feedback.userEmail && (
                          <p className={`text-sm flex items-center gap-1 mt-0.5 ${feedback.isProcessed ? 'text-gray-400' : 'text-gray-500'}`}>
                            <Mail className="w-3 h-3" />
                            {feedback.userEmail}
                          </p>
                        )}
                      </div>
                    </div>
                    
                    <p className={`mb-3 line-clamp-3 whitespace-pre-wrap ${feedback.isProcessed ? 'text-gray-500' : 'text-gray-700'}`}>
                      {feedback.comment}
                    </p>
                    
                    <div className={`flex items-center gap-4 text-xs flex-wrap ${feedback.isProcessed ? 'text-gray-400' : 'text-gray-500'}`}>
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {formatDate(feedback.createdAt)}
                      </span>
                      {feedback.screenshot && (
                        <span className={`flex items-center gap-1 ${feedback.isProcessed ? 'text-gray-400' : 'text-blue-600'}`}>
                          <ImageIcon className="w-3 h-3" />
                          Есть скриншот
                        </span>
                      )}
                    </div>
                  </div>
                </div>
                
                <div className="flex gap-2 shrink-0">
                  <button
                    onClick={() => handleViewDetail(feedback)}
                    className={`px-4 py-2 rounded-lg transition-colors flex items-center gap-2 ${
                      feedback.isProcessed
                        ? 'bg-gray-300 text-gray-600 hover:bg-gray-400'
                        : 'bg-gray-900 text-white hover:bg-gray-800'
                    }`}
                  >
                    <Eye className="w-4 h-4" />
                    <span className="hidden sm:inline">Подробнее</span>
                  </button>
                  <button
                    onClick={(e) => handleDelete(feedback, e)}
                    disabled={deletingId === feedback.id}
                    className={`px-4 py-2 rounded-lg transition-colors flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed ${
                      feedback.isProcessed
                        ? 'bg-gray-300 text-gray-600 hover:bg-gray-400'
                        : 'bg-red-600 text-white hover:bg-red-700'
                    }`}
                    title="Удалить отзыв"
                  >
                    {deletingId === feedback.id ? (
                      <RefreshCw className="w-4 h-4 animate-spin" />
                    ) : (
                      <Trash2 className="w-4 h-4" />
                    )}
                    <span className="hidden sm:inline">Удалить</span>
                  </button>
                </div>
              </div>
            </div>
            );
          })}
        </div>
      )}

      {/* Модальное окно с деталями */}
      {showDetailModal && selectedFeedback && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-3xl w-full max-h-[90vh] overflow-y-auto shadow-xl">
            <div className="sticky top-0 bg-white border-b border-gray-200 px-4 sm:px-6 py-4 flex items-center justify-between">
              <h2 className="text-xl font-bold text-gray-900">Детали отзыва</h2>
              <button
                onClick={() => {
                  setShowDetailModal(false);
                  setSelectedFeedback(null);
                }}
                className="p-1 text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-4 sm:p-6 space-y-6">
              {/* Информация о пользователе */}
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center shrink-0">
                  <User className="w-6 h-6 text-gray-600" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="text-lg font-semibold text-gray-900">{selectedFeedback.userName}</h3>
                    <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${getRoleBadgeColor(selectedFeedback.userRole)}`}>
                      {getRoleLabel(selectedFeedback.userRole)}
                    </span>
                  </div>
                  {selectedFeedback.userEmail && (
                    <p className="text-sm text-gray-600 flex items-center gap-1 mb-2">
                      <Mail className="w-4 h-4" />
                      {selectedFeedback.userEmail}
                    </p>
                  )}
                  <p className="text-xs text-gray-500 flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    {formatDate(selectedFeedback.createdAt)}
                  </p>
                </div>
              </div>

              {/* Текст отзыва */}
              <div>
                <h4 className="text-sm font-semibold text-gray-700 mb-2">Текст отзыва:</h4>
                <div className="bg-gray-50 rounded-lg p-4">
                  <p className="text-gray-700 whitespace-pre-wrap">{selectedFeedback.comment}</p>
                </div>
              </div>

              {/* Скриншот */}
              {selectedFeedback.screenshot && (
                <div>
                  <h4 className="text-sm font-semibold text-gray-700 mb-2">Скриншот:</h4>
                  <div className="border border-gray-200 rounded-lg overflow-hidden">
                    <img
                      src={selectedFeedback.screenshot}
                      alt="Скриншот"
                      className="w-full h-auto"
                    />
                  </div>
                  <a
                    href={selectedFeedback.screenshot}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-2 inline-flex items-center gap-2 text-sm text-blue-600 hover:text-blue-800"
                  >
                    <ImageIcon className="w-4 h-4" />
                    Открыть в новой вкладке
                  </a>
                </div>
              )}

              {/* Дополнительная информация */}
              {selectedFeedback.userAgent && (
                <div>
                  <h4 className="text-sm font-semibold text-gray-700 mb-2">Информация о браузере:</h4>
                  <p className="text-sm text-gray-600 bg-gray-50 rounded-lg p-3 break-all">
                    {selectedFeedback.userAgent}
                  </p>
                </div>
              )}

              {/* ID отзыва и действия */}
              <div className="pt-4 border-t border-gray-200 flex items-center justify-between flex-wrap gap-3">
                <p className="text-xs text-gray-500">ID: {selectedFeedback.id}</p>
                <div className="flex gap-2 items-center">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={selectedFeedback.isProcessed || false}
                      onChange={(e) => handleToggleProcessed(selectedFeedback, e)}
                      disabled={updatingId === selectedFeedback.id}
                      className="w-5 h-5 text-gray-900 border-gray-300 rounded focus:ring-gray-500 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                    />
                    <span className="text-sm text-gray-700">
                      {selectedFeedback.isProcessed ? 'Обработан' : 'Отметить как обработанный'}
                    </span>
                  </label>
                  <button
                    onClick={() => handleDelete(selectedFeedback)}
                    disabled={deletingId === selectedFeedback.id}
                    className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {deletingId === selectedFeedback.id ? (
                      <>
                        <RefreshCw className="w-4 h-4 animate-spin" />
                        <span>Удаление...</span>
                      </>
                    ) : (
                      <>
                        <Trash2 className="w-4 h-4" />
                        <span>Удалить отзыв</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

