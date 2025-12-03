'use client';

import { useTheme } from 'next-themes';
import { useEffect, useState } from 'react';

interface DeveloperStepProps {
  developerEmail?: string;
  developerPhoto?: string;
  telegramUsername?: string;
}

export function DeveloperStep({ 
  developerEmail = 'shevchuk.develop@gmail.com',
  developerPhoto = '/feedback/developer.jpg', // Путь к фото разработчика
  telegramUsername
}: DeveloperStepProps) {
  const { theme, systemTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  
  useEffect(() => {
    // Используем setTimeout для избежания синхронного setState
    const timer = setTimeout(() => {
      setMounted(true);
    }, 0);
    return () => clearTimeout(timer);
  }, []);

  const currentTheme = theme === 'system' ? systemTheme : theme;
  const isDark = mounted && currentTheme === 'dark';

  return (
    <div className="space-y-6 text-center">
      {/* Фото разработчика */}
      <div className="flex justify-center">
        <div className="relative">
          <img
            src={developerPhoto}
            alt="Разработчик"
            className="w-24 h-24 sm:w-32 sm:h-32 rounded-full object-cover border-4 border-gray-200 dark:border-gray-700 shadow-lg"
            onError={(e) => {
              // Если фото не найдено, скрываем элемент
              (e.target as HTMLImageElement).style.display = 'none';
            }}
          />
        </div>
      </div>

      <div>
        <h3 className="text-2xl font-bold text-gray-900 dark:text-foreground mb-4">
          Разработано с ❤️
        </h3>
        <p className="text-sm text-gray-600 dark:text-muted-foreground mb-6">
          Если у вас есть вопросы или предложения, свяжитесь со мной:
        </p>
      </div>

      {/* Кот с адаптивными цветами */}
      <div className="flex justify-center mb-6">
        <div className="w-full max-w-sm rounded-lg overflow-hidden bg-transparent">
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
                src="/feedback/cat.svg" 
                alt="Кот кликает на кнопочки" 
                className="w-full h-auto rounded-lg"
              />
            </div>
          )}
        </div>
      </div>

      {/* Контакты */}
      <div className="space-y-3">
        {/* Email */}
        <a
          href={`mailto:${developerEmail}`}
          className="block text-center text-sm text-gray-600 dark:text-muted-foreground hover:text-gray-900 dark:hover:text-foreground transition-colors"
        >
          {developerEmail}
        </a>

        {/* Telegram */}
        {telegramUsername && (
          <a
            href={`https://t.me/${telegramUsername.replace('@', '')}`}
            target="_blank"
            rel="noopener noreferrer"
            className="block text-center text-sm text-gray-600 dark:text-muted-foreground hover:text-gray-900 dark:hover:text-foreground transition-colors"
          >
            @{telegramUsername.replace('@', '')}
          </a>
        )}
      </div>
    </div>
  );
}

