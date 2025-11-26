'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Building2, BarChart3, DollarSign, Mail, Users, LogOut, ArrowLeft, Menu, X, BookOpen } from 'lucide-react';
import { api } from '@/lib/api';
import type { User } from '@/types';
import Link from 'next/link';
import HotelsView from '../components/HotelsView';
import StatisticsView from '../components/StatisticsView';
import CashMonitoringView from '../components/CashMonitoringView';
import InvitesView from '../components/InvitesView';
import UsersView from '../components/UsersView';
import BookingsView from '../components/BookingsView';

export default function CMSDashboard() {
  const router = useRouter();
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [viewMode, setViewMode] = useState<'hotels' | 'statistics' | 'cash' | 'invites' | 'users' | 'bookings'>('hotels');
  const [selectedHotel, setSelectedHotel] = useState<string>('');
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const [hotels, setHotels] = useState<any[]>([]);
  const [sidebarOpen, setSidebarOpen] = useState(true);

  useEffect(() => {
    const userStr = localStorage.getItem('currentUser');
    if (!userStr) {
      router.push('/');
      return;
    }

    const user = JSON.parse(userStr);
    if (user.role !== 'manager') {
      router.push('/dashboard');
      return;
    }

    setCurrentUser(user);
    loadHotels();
  }, [router]);

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

  const handleLogout = () => {
    localStorage.removeItem('currentUser');
    router.push('/');
  };

  if (!currentUser) {
    return <div className="min-h-screen flex items-center justify-center">Загрузка...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <aside className={`${sidebarOpen ? 'w-64' : 'w-0'} transition-all duration-300 bg-white border-r border-gray-200 fixed lg:sticky lg:top-0 h-screen z-50 overflow-hidden`}>
        <div className="h-full flex flex-col">
          {/* Sidebar Header */}
          <div className="p-4 border-b border-gray-200 flex items-center justify-between">
            <h2 className="text-lg font-bold text-gray-900">CMS</h2>
            <button
              onClick={() => setSidebarOpen(false)}
              className="lg:hidden p-1 text-gray-500 hover:text-gray-700"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Navigation Menu */}
          <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
            <button
              onClick={() => {
                setViewMode('hotels');
                // Закрываем меню на мобильных устройствах
                if (typeof window !== 'undefined' && window.innerWidth < 1024) {
                  setSidebarOpen(false);
                }
              }}
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
              onClick={() => {
                setViewMode('statistics');
                // Закрываем меню на мобильных устройствах
                if (typeof window !== 'undefined' && window.innerWidth < 1024) {
                  setSidebarOpen(false);
                }
              }}
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
              onClick={() => {
                setViewMode('cash');
                // Закрываем меню на мобильных устройствах
                if (typeof window !== 'undefined' && window.innerWidth < 1024) {
                  setSidebarOpen(false);
                }
              }}
              className={`w-full px-4 py-3 rounded-lg text-sm font-semibold transition-colors flex items-center gap-3 ${
                viewMode === 'cash'
                  ? 'bg-gray-900 text-white'
                  : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-200'
              }`}
            >
              <DollarSign className="w-5 h-5" />
              <span>Наличные</span>
            </button>
            <button
              onClick={() => {
                setViewMode('users');
                // Закрываем меню на мобильных устройствах
                if (typeof window !== 'undefined' && window.innerWidth < 1024) {
                  setSidebarOpen(false);
                }
              }}
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
              onClick={() => {
                setViewMode('invites');
                // Закрываем меню на мобильных устройствах
                if (typeof window !== 'undefined' && window.innerWidth < 1024) {
                  setSidebarOpen(false);
                }
              }}
              className={`w-full px-4 py-3 rounded-lg text-sm font-semibold transition-colors flex items-center gap-3 ${
                viewMode === 'invites'
                  ? 'bg-gray-900 text-white'
                  : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-200'
              }`}
            >
              <Mail className="w-5 h-5" />
              <span>Приглашения</span>
            </button>
            <button
              onClick={() => {
                setViewMode('bookings');
                // Закрываем меню на мобильных устройствах
                if (typeof window !== 'undefined' && window.innerWidth < 1024) {
                  setSidebarOpen(false);
                }
              }}
              className={`w-full px-4 py-3 rounded-lg text-sm font-semibold transition-colors flex items-center gap-3 ${
                viewMode === 'bookings'
                  ? 'bg-gray-900 text-white'
                  : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-200'
              }`}
            >
              <BookOpen className="w-5 h-5" />
              <span>Бронирования</span>
            </button>
          </nav>

          {/* Sidebar Footer */}
          <div className="p-4 border-t border-gray-200">
            <Link
              href="/dashboard"
              className="w-full px-4 py-2 rounded-lg text-sm font-semibold transition-colors flex items-center gap-3 text-gray-700 hover:bg-gray-50"
            >
              <ArrowLeft className="w-5 h-5" />
              <span>К бронированию</span>
            </Link>
          </div>
        </div>
      </aside>

      {/* Overlay for mobile */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-transparent z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Header */}
        <header className="bg-white border-b border-gray-200 sticky top-0 z-30">
          <div className="px-3 sm:px-4 py-3 sm:py-4">
            <div className="flex items-center justify-between gap-3 sm:gap-4">
              <div className="flex items-center gap-3 sm:gap-4">
                <button
                  onClick={() => setSidebarOpen(true)}
                  className="lg:hidden p-2 text-gray-600 hover:text-gray-900"
                >
                  <Menu className="w-5 h-5" />
                </button>
                <h1 className="text-xl sm:text-2xl font-bold text-gray-900">CMS - Управление</h1>
              </div>
              <div className="flex items-center gap-3 sm:gap-4">
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

        {viewMode === 'cash' && (
          <CashMonitoringView selectedHotel={selectedHotel} />
        )}

        {viewMode === 'users' && (
          <UsersView 
            currentUser={currentUser} 
            selectedUserId={selectedUserId}
            onSelectUser={setSelectedUserId}
          />
        )}

        {viewMode === 'invites' && (
          <InvitesView currentUser={currentUser} />
        )}

        {viewMode === 'bookings' && (
          <BookingsView />
        )}
        </main>
      </div>
    </div>
  );
}

