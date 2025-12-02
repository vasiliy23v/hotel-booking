'use client';

import { useEffect, useRef, useState } from 'react';
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
  const navRef = useRef<HTMLDivElement>(null);
  const indicatorRef = useRef<HTMLDivElement>(null);
  const [indicatorStyle, setIndicatorStyle] = useState<React.CSSProperties>({});
  const [isAnimating, setIsAnimating] = useState(false);
  const prevActiveIdRef = useRef<string>(activeId);

  useEffect(() => {
    const updateIndicator = () => {
      if (!navRef.current || !indicatorRef.current) return;

      const activeButton = navRef.current.querySelector(
        `[data-nav-item="${activeId}"]`
      ) as HTMLElement;

      if (activeButton) {
        const navRect = navRef.current.getBoundingClientRect();
        const buttonRect = activeButton.getBoundingClientRect();

        const left = buttonRect.left - navRect.left;
        const width = buttonRect.width;

        // Активируем анимацию
        setIsAnimating(true);
        
        // Устанавливаем новую позицию с эффектом пружины
        setIndicatorStyle({
          left: `${left}px`,
          width: `${width}px`,
        });

        // Отключаем флаг анимации после завершения
        const timer = setTimeout(() => {
          setIsAnimating(false);
        }, 600);

        prevActiveIdRef.current = activeId;
        
        return () => clearTimeout(timer);
      }
    };

    // Обновляем позицию при изменении активного элемента
    updateIndicator();

    // Обновляем позицию при изменении размера окна
    window.addEventListener('resize', updateIndicator);
    return () => window.removeEventListener('resize', updateIndicator);
  }, [activeId]);

  return (
    <nav
      className={`lg:hidden fixed bottom-0 left-0 right-0 z-[100] ${className}`}
      style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}
    >
      {/* Многослойный фон в стиле Apple Liquid Glass */}
      {/* Слой 1: Основной размытый фон (светлая тема) */}
      <div 
        className="absolute inset-0 dark:hidden"
        style={{
          background: 'rgba(255, 255, 255, 0.72)',
          backdropFilter: 'blur(40px) saturate(160%)',
          WebkitBackdropFilter: 'blur(40px) saturate(160%)',
        }}
      />
      
      {/* Слой 2: Темная тема */}
      <div 
        className="absolute inset-0 hidden dark:block"
        style={{
          background: 'rgba(28, 28, 30, 0.72)',
          backdropFilter: 'blur(40px) saturate(160%)',
          WebkitBackdropFilter: 'blur(40px) saturate(160%)',
        }}
      />
      
      {/* Слой 3: Градиентная граница сверху для глубины */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/30 to-transparent dark:via-white/10" />
      
      {/* Слой 4: Тонкая тень для объема */}
      <div className="absolute top-0 left-0 right-0 h-px bg-black/[0.03] dark:bg-white/[0.05]" />
      
      <div ref={navRef} className="relative flex items-center justify-around h-20 px-3">
        {/* Анимированный индикатор в стиле iOS с оригинальной анимацией */}
        <div
          ref={indicatorRef}
          className="absolute top-3 bottom-3 rounded-2xl"
          style={{
            ...indicatorStyle,
            width: indicatorStyle.width ? `calc(${indicatorStyle.width} - 24px)` : '0px',
            left: indicatorStyle.left ? `calc(${indicatorStyle.left} + 12px)` : '0px',
            transition: isAnimating 
              ? 'left 0.6s cubic-bezier(0.34, 1.56, 0.64, 1), width 0.6s cubic-bezier(0.34, 1.56, 0.64, 1)'
              : 'left 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94), width 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
          }}
        >
          {/* Основной фон индикатора с эффектом стекла (светлая тема) */}
          <div 
            className="absolute inset-0 rounded-2xl dark:hidden"
            style={{
              background: 'rgba(0, 0, 0, 0.06)',
              backdropFilter: 'blur(20px) saturate(180%)',
              WebkitBackdropFilter: 'blur(20px) saturate(180%)',
            }}
          />
          
          {/* Темная тема для индикатора */}
          <div 
            className="absolute inset-0 rounded-2xl hidden dark:block"
            style={{
              background: 'rgba(255, 255, 255, 0.12)',
              backdropFilter: 'blur(20px) saturate(180%)',
              WebkitBackdropFilter: 'blur(20px) saturate(180%)',
            }}
          />
          
          {/* Светящийся эффект сверху для объема */}
          <div 
            className="absolute top-0 left-0 right-0 h-1/2 rounded-t-2xl bg-gradient-to-b from-white/25 to-transparent dark:from-white/15"
            style={{
              transition: 'opacity 0.3s ease-out',
              opacity: isAnimating ? 0.7 : 1,
            }}
          />
          
          {/* Декоративные блики для объема (светлая тема) */}
          <div 
            className="absolute top-1/2 left-1/3 w-12 h-12 bg-white/15 rounded-full blur-2xl dark:hidden"
            style={{
              transition: 'all 0.5s cubic-bezier(0.34, 1.56, 0.64, 1)',
              transform: isAnimating ? 'scale(1.2) translateX(-5px)' : 'scale(1)',
            }}
          />
          <div 
            className="absolute top-1/2 right-1/3 w-10 h-10 bg-white/15 rounded-full blur-xl dark:hidden"
            style={{
              transition: 'all 0.5s cubic-bezier(0.34, 1.56, 0.64, 1)',
              transform: isAnimating ? 'scale(1.2) translateX(5px)' : 'scale(1)',
            }}
          />
          
          {/* Декоративные блики для темной темы */}
          <div 
            className="absolute top-1/2 left-1/3 w-12 h-12 bg-white/8 rounded-full blur-2xl hidden dark:block"
            style={{
              transition: 'all 0.5s cubic-bezier(0.34, 1.56, 0.64, 1)',
              transform: isAnimating ? 'scale(1.2) translateX(-5px)' : 'scale(1)',
            }}
          />
          <div 
            className="absolute top-1/2 right-1/3 w-10 h-10 bg-white/8 rounded-full blur-xl hidden dark:block"
            style={{
              transition: 'all 0.5s cubic-bezier(0.34, 1.56, 0.64, 1)',
              transform: isAnimating ? 'scale(1.2) translateX(5px)' : 'scale(1)',
            }}
          />
          
          {/* Эффект "волны" при перемещении */}
          {isAnimating && (
            <>
              <div 
                className="absolute inset-0 rounded-2xl bg-white/10 dark:bg-white/5"
                style={{
                  animation: 'pulse-wave 0.6s ease-out',
                }}
              />
              <div 
                className="absolute inset-0 rounded-2xl bg-white/5 dark:bg-white/3"
                style={{
                  animation: 'pulse-wave 0.6s ease-out 0.15s',
                }}
              />
            </>
          )}
        </div>

        {/* Кнопки меню */}
        {items.map((item) => {
          const Icon = item.icon;
          const isActive = activeId === item.id;

          return (
            <button
              key={item.id}
              data-nav-item={item.id}
              onClick={item.onClick}
              className={`
                relative z-10 flex flex-col items-center justify-center gap-1.5 flex-1 h-full
                transition-all duration-300 ease-out
                ${isActive
                  ? 'text-foreground'
                  : 'text-muted-foreground'
                }
              `}
            >
              {/* Контейнер иконки */}
              <div className="relative">
                <div
                  className={`
                    relative transition-all duration-300 ease-[cubic-bezier(0.2, 0, 0, 1)]
                    ${isActive
                      ? 'scale-110'
                      : 'scale-100 active:scale-95'
                    }
                  `}
                >
                  <Icon
                    className={`
                      w-6 h-6 transition-all duration-300
                      ${isActive
                        ? 'text-foreground'
                        : 'text-muted-foreground'
                      }
                    `}
                    strokeWidth={isActive ? 2.5 : 2}
                  />
                  
                  {/* Бейдж уведомлений в стиле iOS */}
                  {item.badge && item.badge > 0 && (
                    <span
                      className={`
                        absolute -top-2 -right-2 min-w-[18px] h-[18px] px-1.5 text-[10px] font-semibold rounded-full flex items-center justify-center
                        transition-all duration-300
                        ${isActive
                          ? 'bg-foreground text-background shadow-lg scale-110'
                          : 'bg-destructive text-destructive-foreground shadow-md scale-100'
                        }
                      `}
                      style={{
                        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
                      }}
                    >
                      {item.badge > 9 ? '9+' : item.badge}
                    </span>
                  )}
                </div>
              </div>
              
              {/* Текст под иконкой */}
              <span
                className={`
                  text-[10px] font-medium transition-all duration-300
                  ${isActive
                    ? 'text-foreground opacity-100'
                    : 'text-muted-foreground opacity-60'
                  }
                `}
                style={{
                  fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
                  letterSpacing: '0.01em',
                }}
              >
                {item.label}
              </span>
              
              {/* Активный индикатор снизу (точка в стиле iOS) */}
              {isActive && (
                <div 
                  className="absolute -bottom-0.5 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-foreground transition-all duration-300"
                  style={{
                    boxShadow: '0 0 6px rgba(0, 0, 0, 0.2)',
                  }}
                />
              )}
            </button>
          );
        })}
      </div>
    </nav>
  );
}
