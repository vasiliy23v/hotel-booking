'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Building2, BookOpen, Users, MessageCircle, LogOut, ChevronDown, MessageSquare, Calendar, FileText, Lock } from 'lucide-react';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubItem,
} from '@/components/ui/sidebar';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';
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
import type { User, Hotel } from '@/types';

interface AppSidebarProps {
  currentUser: User;
  hotels?: Hotel[];
  selectedHotel?: string;
  activeTab?: string;
  viewMode?: string;
  onHotelSelect?: (hotelId: string) => void;
  onTabChange?: (tab: string) => void;
  onViewModeChange?: (mode: string) => void;
  onLogout: () => void;
  onLoadBookings?: () => void;
  onShowFeedbackForm?: () => void;
}

export function AppSidebar({
  currentUser,
  hotels = [],
  selectedHotel,
  activeTab,
  viewMode,
  onHotelSelect,
  onTabChange,
  onViewModeChange,
  onLogout,
  onLoadBookings,
  onShowFeedbackForm,
}: AppSidebarProps) {
  const router = useRouter();
  const isManager = currentUser.role === 'manager' || currentUser.role === 'developer';
  const isGuest = currentUser.role === 'guest';
  const [hotelsOpen, setHotelsOpen] = useState(true);
  const [isDesktop, setIsDesktop] = useState(false);
  const [showLogoutDialog, setShowLogoutDialog] = useState(false);

  useEffect(() => {
    const checkScreenSize = () => {
      const width = window.innerWidth;
      // Показываем сайдбар только на десктопе (>= 1024px)
      setIsDesktop(width >= 1024);
    };
    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);
    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);

  // На планшетах и мобилке не показываем сайдбар, используется нижнее меню
  if (!isDesktop) {
    return null;
  }

  return (
    <div 
      className="sticky top-0 h-screen shrink-0 w-64 transition-all duration-200 border-r border-sidebar-border bg-background dark:bg-background text-sidebar-foreground flex flex-col"
    >
      <Sidebar collapsible="none" variant="sidebar" className="h-full w-full">
      <SidebarHeader>
        <div className="flex items-center gap-2 px-2 py-1.5">
          <Building2 className="w-5 h-5 text-sidebar-foreground" />
          <span className="font-semibold text-sidebar-foreground">
            {isManager ? 'CMS' : 'Навигация'}
          </span>
        </div>
      </SidebarHeader>

      <SidebarContent>
        {isGuest && (
          <SidebarGroup>
            <SidebarGroupContent>
              <SidebarMenu>
                <Collapsible
                  asChild
                  open={hotelsOpen}
                  onOpenChange={setHotelsOpen}
                >
                  <SidebarMenuItem>
                    <CollapsibleTrigger asChild>
                      <SidebarMenuButton 
                        isActive={activeTab === 'hotels'}
                        tooltip="Отели"
                      >
                        <Building2 />
                        <span>Отели</span>
                        <ChevronDown className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-180" />
                      </SidebarMenuButton>
                    </CollapsibleTrigger>
                    <CollapsibleContent>
                        <SidebarMenuSub>
                          <SidebarMenuSubItem>
                            <button
                              onClick={() => {
                                onTabChange?.('hotels');
                                onHotelSelect?.('');
                              }}
                              className={`flex h-7 min-w-0 -translate-x-px items-center gap-2 overflow-hidden rounded-md px-2 text-sidebar-foreground outline-none ring-sidebar-ring hover:bg-sidebar-accent hover:text-sidebar-accent-foreground focus-visible:ring-2 active:bg-sidebar-accent active:text-sidebar-accent-foreground disabled:pointer-events-none disabled:opacity-50 aria-disabled:pointer-events-none aria-disabled:opacity-50 [&>span:last-child]:truncate [&>svg]:size-4 [&>svg]:shrink-0 [&>svg]:text-sidebar-accent-foreground text-sm w-full text-left ${
                                !selectedHotel && activeTab === 'hotels' ? 'bg-sidebar-accent text-sidebar-accent-foreground' : ''
                              }`}
                            >
                              <span>Все отели</span>
                            </button>
                          </SidebarMenuSubItem>
                          {hotels.map((hotel) => (
                            <SidebarMenuSubItem key={hotel.id}>
                              <button
                                onClick={() => {
                                  onTabChange?.('hotels');
                                  onHotelSelect?.(hotel.id);
                                }}
                                className={`flex h-7 min-w-0 -translate-x-px items-center gap-2 overflow-hidden rounded-md px-2 text-sidebar-foreground outline-none ring-sidebar-ring hover:bg-sidebar-accent hover:text-sidebar-accent-foreground focus-visible:ring-2 active:bg-sidebar-accent active:text-sidebar-accent-foreground disabled:pointer-events-none disabled:opacity-50 aria-disabled:pointer-events-none aria-disabled:opacity-50 [&>span:last-child]:truncate [&>svg]:size-4 [&>svg]:shrink-0 [&>svg]:text-sidebar-accent-foreground text-sm w-full text-left ${
                                  selectedHotel === hotel.id ? 'bg-sidebar-accent text-sidebar-accent-foreground' : ''
                                }`}
                              >
                                <span className="truncate">{hotel.name}</span>
                              </button>
                            </SidebarMenuSubItem>
                          ))}
                        </SidebarMenuSub>
                      </CollapsibleContent>
                  </SidebarMenuItem>
                </Collapsible>
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        )}

        {isGuest && (
          <SidebarGroup>
            <SidebarGroupContent>
              <SidebarMenu>
                <SidebarMenuItem>
                  <SidebarMenuButton
                    isActive={!selectedHotel && activeTab === 'bookings'}
                    onClick={() => {
                      onTabChange?.('bookings');
                      onHotelSelect?.('');
                      onLoadBookings?.();
                    }}
                    tooltip="Мои бронирования"
                  >
                    <BookOpen />
                    <span>Мои бронирования</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        )}

        {isManager && (
          <SidebarGroup>
            <SidebarGroupContent>
              <SidebarMenu>
                <Collapsible
                  asChild
                  open={hotelsOpen}
                  onOpenChange={setHotelsOpen}
                >
                  <SidebarMenuItem>
                    <CollapsibleTrigger asChild>
                      <SidebarMenuButton 
                        isActive={viewMode === 'hotels'}
                        tooltip="Отели"
                      >
                        <Building2 />
                        <span>Отели</span>
                        <ChevronDown className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-180" />
                      </SidebarMenuButton>
                    </CollapsibleTrigger>
                    <CollapsibleContent>
                        <SidebarMenuSub>
                          <SidebarMenuSubItem>
                            <button
                              onClick={() => {
                                onViewModeChange?.('hotels');
                                onHotelSelect?.('');
                              }}
                              className={`flex h-7 min-w-0 -translate-x-px items-center gap-2 overflow-hidden rounded-md px-2 text-sidebar-foreground outline-none ring-sidebar-ring hover:bg-sidebar-accent hover:text-sidebar-accent-foreground focus-visible:ring-2 active:bg-sidebar-accent active:text-sidebar-accent-foreground disabled:pointer-events-none disabled:opacity-50 aria-disabled:pointer-events-none aria-disabled:opacity-50 [&>span:last-child]:truncate [&>svg]:size-4 [&>svg]:shrink-0 [&>svg]:text-sidebar-accent-foreground text-sm w-full text-left ${
                                viewMode === 'hotels' && !selectedHotel ? 'bg-sidebar-accent text-sidebar-accent-foreground' : ''
                              }`}
                            >
                              <span>Все отели</span>
                            </button>
                          </SidebarMenuSubItem>
                          {hotels.map((hotel) => (
                            <SidebarMenuSubItem key={hotel.id}>
                              <button
                                onClick={() => {
                                  onViewModeChange?.('hotels');
                                  onHotelSelect?.(hotel.id);
                                }}
                                className={`flex h-7 min-w-0 -translate-x-px items-center gap-2 overflow-hidden rounded-md px-2 text-sidebar-foreground outline-none ring-sidebar-ring hover:bg-sidebar-accent hover:text-sidebar-accent-foreground focus-visible:ring-2 active:bg-sidebar-accent active:text-sidebar-accent-foreground disabled:pointer-events-none disabled:opacity-50 aria-disabled:pointer-events-none aria-disabled:opacity-50 [&>span:last-child]:truncate [&>svg]:size-4 [&>svg]:shrink-0 [&>svg]:text-sidebar-accent-foreground text-sm w-full text-left ${
                                  selectedHotel === hotel.id ? 'bg-sidebar-accent text-sidebar-accent-foreground' : ''
                                }`}
                              >
                                <span className="truncate">{hotel.name}</span>
                              </button>
                            </SidebarMenuSubItem>
                          ))}
                        </SidebarMenuSub>
                      </CollapsibleContent>
                  </SidebarMenuItem>
                </Collapsible>
                <SidebarMenuItem>
                  <SidebarMenuButton
                    isActive={viewMode === 'users'}
                    onClick={() => onViewModeChange?.('users')}
                    tooltip="Пользователи"
                  >
                    <Users />
                    <span>Пользователи</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <SidebarMenuButton
                    isActive={viewMode === 'bookings'}
                    onClick={() => onViewModeChange?.('bookings')}
                    tooltip="Бронирования"
                  >
                    <BookOpen />
                    <span>Бронирования</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <SidebarMenuButton
                    isActive={viewMode === 'dateRanges'}
                    onClick={() => onViewModeChange?.('dateRanges')}
                    tooltip="Диапазоны дат"
                  >
                    <Calendar />
                    <span>Диапазоны дат</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <SidebarMenuButton
                    isActive={viewMode === 'feedback'}
                    onClick={() => onViewModeChange?.('feedback')}
                    tooltip="Отзывы"
                  >
                    <MessageCircle />
                    <span>Отзывы</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        )}
      </SidebarContent>

      <SidebarFooter>
        <SidebarMenu>
          {/* Кнопка "Логи системы" только для менеджеров и разработчиков */}
          {isManager && (
            <SidebarMenuItem>
              <SidebarMenuButton
                onClick={() => router.push('/cms/logs')}
                tooltip="Логи системы"
                className={currentUser.role === 'manager' ? 'text-gray-500 hover:text-gray-600 dark:text-gray-400 dark:hover:text-gray-300' : ''}
              >
                <Lock className="w-4 h-4" />
                <span>Логи системы</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
          )}
          {/* Для менеджеров оставляем кнопки в сайдбаре */}
          {isManager && (
            <>
              {onShowFeedbackForm && (
                <SidebarMenuItem>
                  <SidebarMenuButton onClick={onShowFeedbackForm} tooltip="Обратная связь">
                    <MessageSquare />
                    <span>Обратная связь</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              )}
              <SidebarMenuItem>
                <SidebarMenuButton onClick={() => setShowLogoutDialog(true)} tooltip="Выйти">
                  <LogOut />
                  <span>Выйти</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </>
          )}
          {/* Для гостей кнопки убраны - они теперь в header */}
        </SidebarMenu>
      </SidebarFooter>
      </Sidebar>

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
                onLogout();
              }}
            >
              Выйти
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

