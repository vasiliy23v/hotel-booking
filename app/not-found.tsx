'use client';

import Link from 'next/link';
import { Home, Search } from 'lucide-react';
import { useTheme } from 'next-themes';
import { useEffect, useState } from 'react';

export default function NotFound() {
  const { theme, systemTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setMounted(true);
    }, 0);
    return () => clearTimeout(timer);
  }, []);

  const currentTheme = theme === 'system' ? systemTheme : theme;
  const isDark = mounted && currentTheme === 'dark';

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-background flex items-center justify-center p-4">
      <div className="max-w-2xl w-full text-center">
        {/* SVG изображение с адаптивными цветами - ограниченный размер */}
        <div className="mb-6 flex justify-center">
          <div className="w-full max-w-md sm:max-w-lg">
            {mounted && (
              <div
                className="w-full h-auto"
                style={{
                  filter: isDark
                    ? 'invert(1) brightness(0.9) contrast(1.1)'
                    : 'invert(0) brightness(1) contrast(1)',
                  transition: 'filter 0.3s ease-in-out'
                }}
              >
                <img
                  src="/feedback/not-found.svg"
                  alt="404 Страница не найдена"
                  className="w-full h-auto max-h-[300px] sm:max-h-[350px] object-contain"
                />
              </div>
            )}
          </div>
        </div>

        {/* Заголовок */}
        <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-foreground mb-3">
          Страница не найдена
        </h1>

        {/* Описание */}
        <p className="text-base sm:text-lg text-gray-600 dark:text-muted-foreground mb-1">
          К сожалению, запрашиваемая страница не существует
        </p>
        <p className="text-sm text-gray-500 dark:text-muted-foreground mb-8">
          Возможно, она была перемещена или удалена
        </p>

        {/* Кнопки действий */}
        <div className="flex flex-col sm:flex-row gap-3 justify-center items-center mb-8">
          <Link
            href="/"
            className="flex items-center gap-2 bg-gray-900 dark:bg-gray-800 hover:bg-gray-800 dark:hover:bg-gray-700 text-white px-6 py-2.5 rounded-lg font-semibold transition-colors text-sm sm:text-base"
          >
            <Home className="w-4 h-4 sm:w-5 sm:h-5" />
            На главную
          </Link>
          
          <Link
            href="/dashboard"
            className="flex items-center gap-2 bg-white dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-foreground border-2 border-gray-300 dark:border-gray-600 px-6 py-2.5 rounded-lg font-semibold transition-colors text-sm sm:text-base"
          >
            <Search className="w-4 h-4 sm:w-5 sm:h-5" />
            В кабинет
          </Link>
        </div>

        {/* Дополнительная информация */}
        <div className="pt-6 border-t border-gray-200 dark:border-gray-700">
          <p className="text-xs sm:text-sm text-gray-500 dark:text-muted-foreground">
            Если вы считаете, что это ошибка, пожалуйста, свяжитесь с поддержкой
          </p>
        </div>
      </div>
    </div>
  );
}
