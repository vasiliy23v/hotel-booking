"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { LogoutDialog } from "@/components/LogoutDialog";
import {
  BedDouble,
  CalendarCheck,
  PartyPopper,
  MessageSquareText,
  Users,
  LogOut,
  MessageSquare,
  Lock,
} from "lucide-react";
import type { User, Hotel } from "@/types";

function NavItem({
  icon: Icon,
  label,
  active,
  onClick,
  small,
}: {
  icon?: React.ComponentType<{ className?: string }>;
  label: string;
  active?: boolean;
  onClick: () => void;
  small?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-current={active ? "page" : undefined}
      className={`flex w-full items-center gap-3 rounded-xl px-3 text-left outline-none transition-colors focus-visible:ring-2 focus-visible:ring-[#6b4a36]/40 ${
        small ? "min-h-[44px] text-[15px]" : "min-h-[52px] text-[17px]"
      } ${
        active
          ? "bg-[#f1e4d6] font-semibold text-[#5a3b28] dark:bg-white/15 dark:text-white"
          : "font-medium text-[#4a3a30] hover:bg-[#f6ede2] dark:text-neutral-300 dark:hover:bg-white/10"
      }`}
    >
      {Icon && <Icon className="h-5 w-5 shrink-0" />}
      <span className="truncate">{label}</span>
    </button>
  );
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <p className="px-3 pb-1 pt-6 text-sm font-medium text-[#a8917f] dark:text-neutral-400">
      {children}
    </p>
  );
}

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
  const isManager =
    currentUser.role === "manager" || currentUser.role === "developer";
  const isGuest = currentUser.role === "guest";
  const [isDesktop, setIsDesktop] = useState(false);
  const [showLogoutDialog, setShowLogoutDialog] = useState(false);

  useEffect(() => {
    const checkScreenSize = () => {
      const width = window.innerWidth;
      // Показываем сайдбар только на десктопе (>= 1024px)
      setIsDesktop(width >= 1024);
    };
    checkScreenSize();
    window.addEventListener("resize", checkScreenSize);
    return () => window.removeEventListener("resize", checkScreenSize);
  }, []);

  // На планшетах и мобилке не показываем сайдбар, используется нижнее меню
  if (!isDesktop) {
    return null;
  }

  const hotelsActive = isGuest ? activeTab === "hotels" : viewMode === "hotels";
  const pickHotel = (id: string) => {
    if (isGuest) onTabChange?.("hotels");
    else onViewModeChange?.("hotels");
    onHotelSelect?.(id);
  };

  return (
    <div className="sticky top-0 flex h-screen w-64 shrink-0 flex-col border-r border-[#eadfd3] bg-[#fbf8f4] text-[#3d2f27] dark:border-white/10 dark:bg-neutral-900 dark:text-neutral-100">
      <div className="px-5 pb-2 pt-6">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/brand-hotel-v2.png"
          alt="Hotel Drei Bären"
          className="mx-auto w-32"
        />
      </div>

      <nav className="flex-1 space-y-1 overflow-y-auto px-3 pt-3">
        {isManager && (
          <>
            <NavItem
              icon={CalendarCheck}
              label="Бронирования"
              active={viewMode === "bookings"}
              onClick={() => onViewModeChange?.("bookings")}
            />
            <NavItem
              icon={BedDouble}
              label="Отели"
              active={viewMode === "hotels"}
              onClick={() => pickHotel("")}
            />
            <NavItem
              icon={Users}
              label="Пользователи"
              active={viewMode === "users"}
              onClick={() => onViewModeChange?.("users")}
            />
            <NavItem
              icon={PartyPopper}
              label="Фестивали"
              active={viewMode === "dateRanges"}
              onClick={() => onViewModeChange?.("dateRanges")}
            />
            <NavItem
              icon={MessageSquareText}
              label="Отзывы"
              active={viewMode === "feedback"}
              onClick={() => onViewModeChange?.("feedback")}
            />
          </>
        )}

        {isGuest && (
          <>
            <NavItem
              icon={BedDouble}
              label="Все отели"
              active={hotelsActive && !selectedHotel}
              onClick={() => pickHotel("")}
            />
            {hotels.map((hotel) => (
              <NavItem
                key={hotel.id}
                label={hotel.name}
                active={hotelsActive && selectedHotel === hotel.id}
                onClick={() => pickHotel(hotel.id)}
              />
            ))}
            <SectionLabel>Мои</SectionLabel>
            <NavItem
              icon={CalendarCheck}
              label="Мои бронирования"
              active={!selectedHotel && activeTab === "bookings"}
              onClick={() => {
                onTabChange?.("bookings");
                onHotelSelect?.("");
                onLoadBookings?.();
              }}
            />
          </>
        )}
      </nav>

      {isManager && (
        <div className="space-y-1 border-t border-[#eadfd3] p-3 dark:border-white/10">
          <NavItem
            icon={Lock}
            label="Логи системы"
            onClick={() => router.push("/cms/logs")}
            small
          />
          {onShowFeedbackForm && (
            <NavItem
              icon={MessageSquare}
              label="Обратная связь"
              onClick={onShowFeedbackForm}
              small
            />
          )}
          <NavItem
            icon={LogOut}
            label="Выйти"
            onClick={() => setShowLogoutDialog(true)}
            small
          />
        </div>
      )}

      <LogoutDialog open={showLogoutDialog} onOpenChange={setShowLogoutDialog} onConfirm={() => { setShowLogoutDialog(false); onLogout(); }} />
    </div>
  );
}
