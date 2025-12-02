'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Building2, Users, LogOut, ArrowLeft, BookOpen, Bell, DollarSign, MessageSquare, MessageCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { api } from '@/lib/api';
import type { User, Hotel } from '@/types';
import Link from 'next/link';
import HotelsView from '../components/HotelsView';
import UsersManagementView from '../components/UsersManagementView';
import BookingsView from '../components/BookingsView';
import FeedbackView from '../components/FeedbackView';
import FeedbackForm from '@/components/FeedbackForm';
import { SidebarProvider, SidebarInset, SidebarTrigger } from '@/components/ui/sidebar';
import { AppSidebar } from '@/components/navigation/AppSidebar';
import { ModeToggle } from '@/components/mode-toggle';

export default function CMSDashboard() {
  const router = useRouter();
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [viewMode, setViewMode] = useState<'hotels' | 'users' | 'bookings' | 'feedback'>('hotels');
  const [selectedHotel, setSelectedHotel] = useState<string>('');
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const [hotels, setHotels] = useState<Hotel[]>([]);
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
    
    if (user.role !== 'manager' && user.role !== 'developer') {
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
    <SidebarProvider className="min-h-screen bg-gray-50 dark:bg-[hsl(var(--background))] flex">
      {/* Sidebar */}
      <AppSidebar
        currentUser={currentUser}
        hotels={hotels}
        selectedHotel={selectedHotel}
        viewMode={viewMode}
        onViewModeChange={(mode) => setViewMode(mode as 'hotels' | 'users' | 'bookings' | 'feedback')}
        onHotelSelect={setSelectedHotel}
        onLogout={handleLogout}
      />

      {/* Main Content */}
      <SidebarInset className="flex-1 flex flex-col min-w-0 pb-16 lg:pb-0">
        {/* Header */}
        <header className="bg-background dark:bg-background border-border dark:border-border sticky top-0 z-30">
          <div className="px-3 sm:px-4 py-3 sm:py-4">
            <div className="flex items-center justify-between gap-3 sm:gap-4">
              <div className="flex items-center gap-3 sm:gap-4">
                <h1 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-[hsl(var(--foreground))]">CMS - Управление</h1>
              </div>
              <div className="flex items-center gap-2 sm:gap-3">
                {/* Переключатель темы */}
                <ModeToggle />

                {/* Кнопка обратной связи */}
          <Button
            variant="outline"
            size="icon"
            onClick={() => setShowFeedbackForm(true)}
            title="Отправить отзыв / Сообщить о баге"
          >
            <MessageSquare className="h-[1.2rem] w-[1.2rem]" />
            <span className="sr-only">Отправить отзыв</span>
          </Button>

                <span className="text-sm light:text-gray-600 dark:text-gray-600 dark:text-gray-400 hidden sm:inline">{currentUser.name}</span>
              </div>
            </div>
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 px-3 sm:px-4 py-4 sm:py-6 lg:py-8 overflow-y-auto">
        {viewMode === 'hotels' && (
          <HotelsView selectedHotel={selectedHotel} onSelectHotel={setSelectedHotel} />
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
      </SidebarInset>

      {/* Bottom Navigation Menu для мобильных устройств */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 bg-background dark:bg-background border-t border-border dark:border-border z-[100] shadow-lg" style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}>
        <div className="flex items-center justify-around h-16">
          <button
            onClick={() => setViewMode('hotels')}
            className={`flex flex-col items-center justify-center gap-1 flex-1 h-full transition-colors ${
              viewMode === 'hotels'
                ? 'text-gray-900 dark:text-[hsl(var(--foreground))] bg-gray-50 dark:bg-[hsl(var(--accent))]'
                : 'light:text-gray-600 dark:text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-[hsl(var(--foreground))]'
            }`}
          >
            <Building2 className={`w-5 h-5 ${viewMode === 'hotels' ? 'text-gray-900 dark:text-[hsl(var(--foreground))]' : 'text-gray-500 dark:text-gray-400'}`} />
            <span className="text-xs font-semibold">Отели</span>
          </button>
          <button
            onClick={() => setViewMode('users')}
            className={`flex flex-col items-center justify-center gap-1 flex-1 h-full transition-colors ${
              viewMode === 'users'
                ? 'text-gray-900 dark:text-[hsl(var(--foreground))] bg-gray-50 dark:bg-[hsl(var(--accent))]'
                : 'light:text-gray-600 dark:text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-[hsl(var(--foreground))]'
            }`}
          >
            <Users className={`w-5 h-5 ${viewMode === 'users' ? 'text-gray-900 dark:text-[hsl(var(--foreground))]' : 'text-gray-500 dark:text-gray-400'}`} />
            <span className="text-xs font-semibold">Пользователи</span>
          </button>
          <button
            onClick={() => setViewMode('bookings')}
            className={`flex flex-col items-center justify-center gap-1 flex-1 h-full transition-colors relative ${
              viewMode === 'bookings'
                ? 'text-gray-900 dark:text-[hsl(var(--foreground))] bg-gray-50 dark:bg-[hsl(var(--accent))]'
                : 'light:text-gray-600 dark:text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-[hsl(var(--foreground))]'
            }`}
          >
            <div className="relative">
              <BookOpen className={`w-5 h-5 ${viewMode === 'bookings' ? 'text-gray-900 dark:text-[hsl(var(--foreground))]' : 'text-gray-500 dark:text-gray-400'}`} />
              {bookingStats.unconfirmed > 0 && (
                <span className="absolute -top-1 -right-1 bg-black dark:bg-white text-white dark:text-black text-[10px] font-bold rounded-full w-4 h-4 flex items-center justify-center">
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
                ? 'text-gray-900 dark:text-[hsl(var(--foreground))] bg-gray-50 dark:bg-[hsl(var(--accent))]'
                : 'light:text-gray-600 dark:text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-[hsl(var(--foreground))]'
            }`}
          >
            <MessageCircle className={`w-5 h-5 ${viewMode === 'feedback' ? 'text-gray-900 dark:text-[hsl(var(--foreground))]' : 'text-gray-500 dark:text-gray-400'}`} />
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
    </SidebarProvider>
  );
}

