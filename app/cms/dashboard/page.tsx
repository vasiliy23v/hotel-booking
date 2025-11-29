'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Building2, BarChart3, Users, LogOut, ArrowLeft, BookOpen, Bell, DollarSign, MessageSquare, MessageCircle } from 'lucide-react';
import { api } from '@/lib/api';
import type { User } from '@/types';
import Link from 'next/link';
import HotelsView from '../components/HotelsView';
import StatisticsView from '../components/StatisticsView';
import UsersManagementView from '../components/UsersManagementView';
import BookingsView from '../components/BookingsView';
import FeedbackView from '../components/FeedbackView';
import FeedbackForm from '@/components/FeedbackForm';

export default function CMSDashboard() {
  const router = useRouter();
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [viewMode, setViewMode] = useState<'hotels' | 'statistics' | 'users' | 'bookings' | 'feedback'>('hotels');
  const [selectedHotel, setSelectedHotel] = useState<string>('');
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const [hotels, setHotels] = useState<any[]>([]);
  const [bookingStats, setBookingStats] = useState({ unconfirmed: 0, unpaid: 0 });
  const [showFeedbackForm, setShowFeedbackForm] = useState(false);

  const loadHotels = async () => {
    try {
      const data = await api.getHotels();
      setHotels(data);
      if (data.length > 0 && !selectedHotel) {
        setSelectedHotel(data[0].id);
      }
    } catch (error) {
      console.error('Error loading hotels:', error);
    }
  };

  const loadBookingStats = async () => {
    try {
      const stats = await api.getBookingStats();
      setBookingStats(stats);
    } catch (error) {
      console.error('Error loading booking stats:', error);
    }
  };

  useEffect(() => {
    const userStr = localStorage.getItem('currentUser');
    if (!userStr) {
      router.push('/');
      return;
    }

    const user = JSON.parse(userStr);
    
    // Проверяем, заполнен ли телефон (обязателен)
    if (!user.phone) {
      router.push('/complete-profile');
      return;
    }
    
    if (user.role !== 'manager') {
      router.push('/dashboard');
      return;
    }

    setCurrentUser(user);
    loadHotels();
    loadBookingStats();
    
    // Обновляем статистику каждые 30 секунд
    const interval = setInterval(() => {
      loadBookingStats();
    }, 30000);
    
    return () => clearInterval(interval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem('currentUser');
    router.push('/');
  };

  if (!currentUser) {
    return <div className="min-h-screen flex items-center justify-center">Загрузка...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50 flex pb-16 lg:pb-0">
      {/* Sidebar - только для десктопа */}
      <aside className="hidden lg:block w-64 bg-white border-r border-gray-200 sticky top-0 h-screen z-50">
        <div className="h-full flex flex-col">
          {/* Sidebar Header */}
          <div className="p-4 border-b border-gray-200">
            <h2 className="text-lg font-bold text-gray-900">CMS</h2>
          </div>

          {/* Navigation Menu */}
          <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
            <button
              onClick={() => setViewMode('hotels')}
              className={`w-full px-4 py-3 rounded-lg text-sm font-semibold transition-colors flex items-center gap-3 ${
                viewMode === 'hotels'
                  ? 'bg-gray-900 text-white'
                  : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-200'
              }`}
            >
              <Building2 className="w-5 h-5" />
              <span>Отели</span>
            </button>
            <button
              onClick={() => setViewMode('statistics')}
              className={`w-full px-4 py-3 rounded-lg text-sm font-semibold transition-colors flex items-center gap-3 ${
                viewMode === 'statistics'
                  ? 'bg-gray-900 text-white'
                  : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-200'
              }`}
            >
              <BarChart3 className="w-5 h-5" />
              <span>Статистика</span>
            </button>
            <button
              onClick={() => setViewMode('users')}
              className={`w-full px-4 py-3 rounded-lg text-sm font-semibold transition-colors flex items-center gap-3 ${
                viewMode === 'users'
                  ? 'bg-gray-900 text-white'
                  : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-200'
              }`}
            >
              <Users className="w-5 h-5" />
              <span>Пользователи</span>
            </button>
            <button
              onClick={() => setViewMode('bookings')}
              className={`w-full px-4 py-3 rounded-lg text-sm font-semibold transition-colors flex items-center gap-3 ${
                viewMode === 'bookings'
                  ? 'bg-gray-900 text-white'
                  : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-200'
              }`}
            >
              <BookOpen className="w-5 h-5" />
              <span>Бронирования</span>
            </button>
            <button
              onClick={() => setViewMode('feedback')}
              className={`w-full px-4 py-3 rounded-lg text-sm font-semibold transition-colors flex items-center gap-3 ${
                viewMode === 'feedback'
                  ? 'bg-gray-900 text-white'
                  : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-200'
              }`}
            >
              <MessageCircle className="w-5 h-5" />
              <span>Отзывы</span>
            </button>
          </nav>

        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Header */}
        <header className="bg-white border-b border-gray-200 sticky top-0 z-30">
          <div className="px-3 sm:px-4 py-3 sm:py-4">
            <div className="flex items-center justify-between gap-3 sm:gap-4">
              <div className="flex items-center gap-3 sm:gap-4">
                <h1 className="text-xl sm:text-2xl font-bold text-gray-900">CMS - Управление</h1>
              </div>
              <div className="flex items-center gap-2 sm:gap-3">

                {/* Доллар с неоплаченными бронированиями (только для менеджера) */}
                {currentUser.role === 'manager' && (
                  <button
                    onClick={() => setViewMode('bookings')}
                    className="relative p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
                    title="Неоплаченные бронирования"
                  >
                    <DollarSign className="w-5 h-5" />
                    {bookingStats.unpaid > 0 && (
                      <span className="absolute -top-1 -right-1 bg-pink-900 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                        {bookingStats.unpaid > 99 ? '99+' : bookingStats.unpaid}
                      </span>
                    )}
                  </button>
                )}

                {/* Кнопка обратной связи */}
                <button
                  onClick={() => setShowFeedbackForm(true)}
                  className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
                  title="Отправить отзыв / Сообщить о баге"
                >
                  <MessageSquare className="w-5 h-5" />
                </button>

                <span className="text-sm text-gray-600 hidden sm:inline">{currentUser.name}</span>
                <button
                  onClick={handleLogout}
                  className="px-3 py-1.5 sm:py-2 bg-gray-900 hover:bg-gray-800 text-white rounded-lg text-xs sm:text-sm font-semibold flex items-center gap-1.5 sm:gap-2"
                >
                  <LogOut className="w-3 h-3 sm:w-4 sm:h-4" />
                  <span className="hidden sm:inline">Выйти</span>
                </button>
              </div>
            </div>
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 px-3 sm:px-4 py-4 sm:py-6 lg:py-8 overflow-y-auto">
        {viewMode === 'hotels' && (
          <HotelsView selectedHotel={selectedHotel} onSelectHotel={setSelectedHotel} />
        )}

        {viewMode === 'statistics' && (
          <StatisticsView selectedHotel={selectedHotel} hotels={hotels} />
        )}

        {viewMode === 'users' && (
          <UsersManagementView 
            currentUser={currentUser} 
            selectedUserId={selectedUserId}
            onSelectUser={setSelectedUserId}
          />
        )}

        {viewMode === 'bookings' && (
          <BookingsView />
        )}

        {viewMode === 'feedback' && (
          <FeedbackView />
        )}
        </main>
      </div>

      {/* Bottom Navigation Menu для мобильных устройств */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-[100] shadow-lg" style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}>
        <div className="flex items-center justify-around h-16">
          <button
            onClick={() => setViewMode('hotels')}
            className={`flex flex-col items-center justify-center gap-1 flex-1 h-full transition-colors ${
              viewMode === 'hotels'
                ? 'text-gray-900 bg-gray-50'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <Building2 className={`w-5 h-5 ${viewMode === 'hotels' ? 'text-gray-900' : 'text-gray-500'}`} />
            <span className="text-xs font-semibold">Отели</span>
          </button>
          <button
            onClick={() => setViewMode('statistics')}
            className={`flex flex-col items-center justify-center gap-1 flex-1 h-full transition-colors ${
              viewMode === 'statistics'
                ? 'text-gray-900 bg-gray-50'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <BarChart3 className={`w-5 h-5 ${viewMode === 'statistics' ? 'text-gray-900' : 'text-gray-500'}`} />
            <span className="text-xs font-semibold">Статистика</span>
          </button>
          <button
            onClick={() => setViewMode('users')}
            className={`flex flex-col items-center justify-center gap-1 flex-1 h-full transition-colors ${
              viewMode === 'users'
                ? 'text-gray-900 bg-gray-50'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <Users className={`w-5 h-5 ${viewMode === 'users' ? 'text-gray-900' : 'text-gray-500'}`} />
            <span className="text-xs font-semibold">Пользователи</span>
          </button>
          <button
            onClick={() => setViewMode('bookings')}
            className={`flex flex-col items-center justify-center gap-1 flex-1 h-full transition-colors relative ${
              viewMode === 'bookings'
                ? 'text-gray-900 bg-gray-50'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <div className="relative">
              <BookOpen className={`w-5 h-5 ${viewMode === 'bookings' ? 'text-gray-900' : 'text-gray-500'}`} />
              {bookingStats.unconfirmed > 0 && (
                <span className="absolute -top-1 -right-1 bg-black text-white text-[10px] font-bold rounded-full w-4 h-4 flex items-center justify-center">
                  {bookingStats.unconfirmed > 9 ? '9+' : bookingStats.unconfirmed}
                </span>
              )}
            </div>
            <span className="text-xs font-semibold">Бронирования</span>
          </button>
          <button
            onClick={() => setViewMode('feedback')}
            className={`flex flex-col items-center justify-center gap-1 flex-1 h-full transition-colors ${
              viewMode === 'feedback'
                ? 'text-gray-900 bg-gray-50'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <MessageCircle className={`w-5 h-5 ${viewMode === 'feedback' ? 'text-gray-900' : 'text-gray-500'}`} />
            <span className="text-xs font-semibold">Отзывы</span>
          </button>
        </div>
      </nav>

      {/* Форма обратной связи */}
      {showFeedbackForm && currentUser && (
        <FeedbackForm
          currentUser={currentUser}
          onClose={() => setShowFeedbackForm(false)}
        />
      )}
    </div>
  );
}

