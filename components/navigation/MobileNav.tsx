'use client';

import { LucideIcon } from 'lucide-react';

interface MobileNavItem {
  id: string;
  label: string;
  icon: LucideIcon;
  onClick: () => void;
  badge?: number;
}

interface MobileNavProps {
  items: MobileNavItem[];
  activeId: string;
  className?: string;
}

export function MobileNav({ items, activeId, className = '' }: MobileNavProps) {
  return (
    <nav
      className={`fixed bottom-0 left-0 right-0 z-[100] border-t border-[#eadfd3] bg-[#fbf8f4]/95 backdrop-blur-md dark:border-white/10 dark:bg-neutral-900/95 lg:hidden ${className}`}
      style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}
    >
      <div className="flex h-20 items-stretch justify-around px-2">
        {items.map((item) => {
          const Icon = item.icon;
          const isActive = activeId === item.id;

          return (
            <button
              key={item.id}
              type="button"
              data-nav-item={item.id}
              onClick={item.onClick}
              aria-current={isActive ? 'page' : undefined}
              className="flex flex-1 flex-col items-center justify-center gap-1 outline-none"
            >
              <span
                className={`relative flex h-9 w-16 items-center justify-center rounded-full transition-colors ${
                  isActive
                    ? 'bg-[#f1e4d6] text-[#5a3b28] dark:bg-white/15 dark:text-white'
                    : 'text-[#8a7566] dark:text-neutral-400'
                }`}
              >
                <Icon className="h-6 w-6" strokeWidth={isActive ? 2.25 : 1.75} />
                {item.badge && item.badge > 0 ? (
                  <span className="absolute -right-0.5 -top-1 flex h-5 min-w-[20px] items-center justify-center rounded-full bg-[#6b4a36] px-1.5 text-[11px] font-semibold text-white">
                    {item.badge > 9 ? '9+' : item.badge}
                  </span>
                ) : null}
              </span>
              <span
                className={`text-[13px] leading-none ${
                  isActive
                    ? 'font-semibold text-[#5a3b28] dark:text-white'
                    : 'font-medium text-[#8a7566] dark:text-neutral-400'
                }`}
              >
                {item.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
