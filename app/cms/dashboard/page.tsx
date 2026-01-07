'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { Building2, Users, BookOpen, MessageCircle, LogOut } from 'lucide-react';
import { api } from '@/lib/api';
import type { User, Hotel } from '@/types';
import HotelsView from '../components/HotelsView';
import UsersManagementView from '../components/UsersManagementView';
import BookingsView from '../components/BookingsView';
import FeedbackView from '../components/FeedbackView';
import BookingDateRangesView from '../components/BookingDateRangesView';
import FeedbackForm from '@/components/FeedbackForm';
import { SidebarProvider, SidebarInset } from '@/components/ui/sidebar';
import { AppSidebar } from '@/components/navigation/AppSidebar';
import { MobileNav } from '@/components/navigation/MobileNav';
import { ModeToggle } from '@/components/mode-toggle';
import { Button } from '@/components/ui/button';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';

export default function CMSDashboard() {
  const router = useRouter();
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [viewMode, setViewMode] = useState<'hotels' | 'users' | 'bookings' | 'feedback' | 'dateRanges'>('hotels');
  const [selectedHotel, setSelectedHotel] = useState<string>('');
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const [hotels, setHotels] = useState<Hotel[]>([]);
  const [bookingStats, setBookingStats] = useState({ unconfirmed: 0, unpaid: 0 });
  const [showFeedbackForm, setShowFeedbackForm] = useState(false);
  const [showLogoutDialog, setShowLogoutDialog] = useState(false);
  const isModalOpenRef = useRef(false);

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
    
    // Обновляем статистику каждые 30 секунд, но только если модальное окно закрыто
    const interval = setInterval(() => {
      if (!isModalOpenRef.current) {
        loadBookingStats();
      }
    }, 30000);
    
    return () => clearInterval(interval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router]);

  const handleLogout = () => {
    setShowLogoutDialog(true);
  };

  const confirmLogout = () => {
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
        onViewModeChange={(mode) => setViewMode(mode as 'hotels' | 'users' | 'bookings' | 'feedback' | 'dateRanges')}
        onHotelSelect={setSelectedHotel}
        onLogout={handleLogout}
        onShowFeedbackForm={() => setShowFeedbackForm(true)}
      />

      {/* Main Content */}
      <SidebarInset className="flex-1 flex flex-col min-w-0 pb-16 lg:pb-0">
        {/* Header */}
        <header className="bg-background dark:bg-background border-border dark:border-border sticky top-0 z-30">
          <div className="px-3 sm:px-4 py-3 sm:py-4">
            <div className="flex items-center justify-between gap-3 sm:gap-4">
              <div className="flex items-center gap-3 sm:gap-4">
                <h1 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-foreground">CMS - Управление</h1>
              </div>
              <div className="flex items-center gap-2 sm:gap-3">
                {/* Переключатель темы */}
                <ModeToggle />

                {/* Кнопка выхода */}
                <Button
                  variant="outline"
                  size="icon"
                  onClick={handleLogout}
                  title="Выйти"
                  className="h-9 w-9"
                >
                  <LogOut className="h-4 w-4" />
                  <span className="sr-only">Выйти</span>
                </Button>

                <span className="text-sm text-gray-600 dark:text-gray-400 hidden sm:inline">{currentUser.name}</span>
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
           <BookingsView onModalStateChange={(isOpen) => { isModalOpenRef.current = isOpen; }} />
         )}

        {viewMode === 'feedback' && (
          <FeedbackView />
        )}

        {viewMode === 'dateRanges' && (
          <BookingDateRangesView />
        )}
        </main>
      </SidebarInset>

      {/* Bottom Navigation Menu для мобильных устройств */}
      <MobileNav
        items={[
          {
            id: 'hotels',
            label: 'Отели',
            icon: Building2,
            onClick: () => setViewMode('hotels'),
          },
          {
            id: 'users',
            label: 'Пользователи',
            icon: Users,
            onClick: () => setViewMode('users'),
          },
          {
            id: 'bookings',
            label: 'Бронирования',
            icon: BookOpen,
            onClick: () => setViewMode('bookings'),
            badge: bookingStats.unconfirmed > 0 ? bookingStats.unconfirmed : undefined,
          },
          {
            id: 'feedback',
            label: 'Отзывы',
            icon: MessageCircle,
            onClick: () => setViewMode('feedback'),
          },
        ]}
        activeId={viewMode}
      />

      {/* Форма обратной связи */}
      {showFeedbackForm && currentUser && (
        <FeedbackForm
          currentUser={currentUser}
          onClose={() => setShowFeedbackForm(false)}
          telegramUsername="vasiliy_shef"
        />
      )}

      {/* Диалог подтверждения выхода */}
      <AlertDialog open={showLogoutDialog} onOpenChange={setShowLogoutDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Подтверждение выхода</AlertDialogTitle>
            <AlertDialogDescription>
              Вы уверены, что хотите выйти?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Отмена</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                setShowLogoutDialog(false);
                confirmLogout();
              }}
            >
              Выйти
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </SidebarProvider>
  );
}

