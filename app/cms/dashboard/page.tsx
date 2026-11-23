'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { BedDouble, Users, CalendarCheck, PartyPopper, MessageSquareText, LogOut } from 'lucide-react';
import { serif } from '@/lib/fonts';
import { LogoutDialog } from '@/components/LogoutDialog';
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


export default function CMSDashboard() {
  const router = useRouter();
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [viewMode, setViewMode] = useState<'hotels' | 'users' | 'bookings' | 'feedback' | 'dateRanges'>('bookings');
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
    <SidebarProvider className="cms-root min-h-screen bg-gray-50 dark:bg-[hsl(var(--background))] flex">
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
        <header className="sticky top-0 z-30 border-b border-[#eadfd3] bg-[#faf8f5]/90 backdrop-blur-md dark:border-white/10 dark:bg-background/90">
          <div className="flex items-center justify-between gap-3 px-4 py-3 sm:px-6">
            <div className="flex items-center gap-3">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/brand-hotel-v2.png" alt="" className="h-10 w-auto lg:hidden" />
              <h1 className={`${serif.className} text-2xl font-semibold tracking-tight text-[#3d2f27] dark:text-foreground sm:text-3xl`}>
                {viewMode === 'bookings' ? 'Бронирования'
                  : viewMode === 'hotels' ? 'Отели'
                  : viewMode === 'users' ? 'Пользователи'
                  : viewMode === 'dateRanges' ? 'Фестивали'
                  : 'Отзывы'}
              </h1>
            </div>
            <div className="flex items-center gap-2 sm:gap-3">
              <div className="hidden items-center gap-3 rounded-full bg-[#f1e4d6] py-1.5 pl-1.5 pr-4 dark:bg-white/10 sm:flex">
                <span className="flex h-9 w-9 items-center justify-center rounded-full bg-[#6b4a36] text-base font-semibold text-white">
                  {currentUser.name?.charAt(0).toUpperCase()}
                </span>
                <span className="text-base font-medium text-[#5a3b28] dark:text-foreground">{currentUser.name}</span>
              </div>
              <button
                type="button"
                onClick={handleLogout}
                title="Выйти"
                aria-label="Выйти"
                className="flex h-11 w-11 items-center justify-center rounded-full border border-[#e3d5c6] bg-white text-[#5a3b28] transition-colors hover:bg-[#f6ede2] dark:border-border dark:bg-card dark:text-foreground"
              >
                <LogOut className="h-5 w-5" />
              </button>
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
            id: 'bookings',
            label: 'Брони',
            icon: CalendarCheck,
            onClick: () => setViewMode('bookings'),
            badge: bookingStats.unconfirmed > 0 ? bookingStats.unconfirmed : undefined,
          },
          {
            id: 'hotels',
            label: 'Отели',
            icon: BedDouble,
            onClick: () => setViewMode('hotels'),
          },
          {
            id: 'users',
            label: 'Люди',
            icon: Users,
            onClick: () => setViewMode('users'),
          },
          {
            id: 'dateRanges',
            label: 'Фестивали',
            icon: PartyPopper,
            onClick: () => setViewMode('dateRanges'),
          },
          {
            id: 'feedback',
            label: 'Отзывы',
            icon: MessageSquareText,
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
      <LogoutDialog open={showLogoutDialog} onOpenChange={setShowLogoutDialog} onConfirm={() => { setShowLogoutDialog(false); confirmLogout(); }} />
    </SidebarProvider>
  );
}

