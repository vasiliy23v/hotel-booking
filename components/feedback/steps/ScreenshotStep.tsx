'use client';

import { useEffect, useRef } from 'react';
import { Image as ImageIcon, X } from 'lucide-react';

interface ScreenshotStepProps {
  screenshot: File | null;
  screenshotPreview: string | null;
  onScreenshotChange: (file: File | null) => void;
  onScreenshotPreviewChange: (preview: string | null) => void;
}

export function ScreenshotStep({
  screenshot,
  screenshotPreview,
  onScreenshotChange,
  onScreenshotPreviewChange,
}: ScreenshotStepProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  const processImageFile = (file: File) => {
    // Проверка типа файла
    if (!file.type.startsWith('image/')) {
      alert('Пожалуйста, выберите изображение');
      return;
    }

    // Проверка размера (5MB)
    if (file.size > 5 * 1024 * 1024) {
      alert('Размер файла должен быть меньше 5MB');
      return;
    }

    onScreenshotChange(file);

    // Создаем превью
    const reader = new FileReader();
    reader.onloadend = () => {
      onScreenshotPreviewChange(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleScreenshotChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    processImageFile(file);
  };

  useEffect(() => {
    const handlePaste = (e: ClipboardEvent) => {
      const items = e.clipboardData?.items;
      if (!items) return;

      for (let i = 0; i < items.length; i++) {
        const item = items[i];
        if (item.type.startsWith('image/')) {
          e.preventDefault();
          const file = item.getAsFile();
          if (file) {
            processImageFile(file);
          }
          break;
        }
      }
    };

    // Добавляем обработчик на весь документ для работы paste в любом месте
    document.addEventListener('paste', handlePaste);

    return () => {
      document.removeEventListener('paste', handlePaste);
    };
  }, []);

  const handleRemoveScreenshot = () => {
    onScreenshotChange(null);
    onScreenshotPreviewChange(null);
  };

  return (
    <div className="space-y-4" ref={containerRef}>
      <div>
        <label className="block text-sm font-semibold mb-2 text-gray-700 dark:text-foreground">
          Прикрепить скриншот (необязательно)
        </label>
        {!screenshotPreview ? (
          <label
            className="flex flex-col items-center justify-center w-full h-48 sm:h-64 border-2 border-gray-300 dark:border-border border-dashed rounded-lg cursor-pointer hover:bg-gray-50 dark:hover:bg-accent transition-colors"
          >
            <div className="flex flex-col items-center justify-center pt-5 pb-6">
              <ImageIcon className="w-12 h-12 mb-3 text-gray-400 dark:text-muted-foreground" />
              <p className="mb-2 text-sm text-center text-gray-500 dark:text-muted-foreground px-4">
                <span className="font-semibold">Нажмите для загрузки</span>, перетащите файл или{' '}
                <span className="font-semibold">вставьте из буфера обмена</span>
              </p>
              <p className="text-xs text-gray-500 dark:text-muted-foreground">
                PNG, JPG, GIF до 5MB (Ctrl+V / Cmd+V для вставки)
              </p>
            </div>
            <input
              type="file"
              className="hidden"
              accept="image/*"
              onChange={handleScreenshotChange}
            />
          </label>
        ) : (
          <div className="relative">
            <img
              src={screenshotPreview}
              alt="Превью скриншота"
              className="w-full h-auto max-h-96 object-contain rounded-lg border-2 border-gray-300 dark:border-border"
            />
            <button
              type="button"
              onClick={handleRemoveScreenshot}
              className="absolute top-2 right-2 p-2 bg-red-600 dark:bg-red-700 text-white rounded-full hover:bg-red-700 dark:hover:bg-red-800 transition-colors shadow-lg"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

