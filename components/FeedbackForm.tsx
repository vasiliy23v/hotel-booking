'use client';

import { useState, useEffect, useRef } from 'react';
import { X, Upload, Image as ImageIcon, Send, Loader2 } from 'lucide-react';
import type { User } from '@/types';

interface FeedbackFormProps {
  currentUser: User;
  onClose: () => void;
}

export default function FeedbackForm({ currentUser, onClose }: FeedbackFormProps) {
  const [comment, setComment] = useState('');
  const [screenshot, setScreenshot] = useState<File | null>(null);
  const [screenshotPreview, setScreenshotPreview] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);

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

    setScreenshot(file);

    // Создаем превью
    const reader = new FileReader();
    reader.onloadend = () => {
      setScreenshotPreview(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleScreenshotChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    processImageFile(file);
  };

  const handlePaste = (e: ClipboardEvent) => {
    // Проверяем, что в буфере обмена есть изображение
    const items = e.clipboardData?.items;
    if (!items) return;

    for (let i = 0; i < items.length; i++) {
      const item = items[i];
      
      // Проверяем, является ли элемент изображением
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

  useEffect(() => {
    // Добавляем обработчик события paste
    const handlePasteEvent = (e: ClipboardEvent) => handlePaste(e);
    
    // Добавляем обработчик на весь документ, чтобы можно было вставлять в любое время
    document.addEventListener('paste', handlePasteEvent);
    
    return () => {
      // Удаляем обработчик при размонтировании компонента
      document.removeEventListener('paste', handlePasteEvent);
    };
  }, []);

  const handleRemoveScreenshot = () => {
    setScreenshot(null);
    setScreenshotPreview(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!comment.trim()) {
      alert('Пожалуйста, опишите проблему или оставьте отзыв');
      return;
    }

    setSubmitting(true);
    try {
      const formData = new FormData();
      formData.append('comment', comment.trim());
      formData.append('userName', currentUser.name || 'Неизвестный пользователь');
      formData.append('userEmail', currentUser.email || '');
      formData.append('userRole', currentUser.role || 'guest');
      
      if (screenshot) {
        formData.append('screenshot', screenshot);
      }

      const response = await fetch('/api/feedback', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Ошибка при отправке отзыва');
      }

      alert('Спасибо за ваш отзыв! Мы получили ваше сообщение.');
      setComment('');
      setScreenshot(null);
      setScreenshotPreview(null);
      onClose();
    } catch (error) {
      console.error('Error submitting feedback:', error);
      alert('Ошибка при отправке отзыва. Пожалуйста, попробуйте еще раз.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-xl">
        <div className="sticky top-0 bg-white border-b border-gray-200 px-4 sm:px-6 py-4 flex items-center justify-between">
          <h2 className="text-xl font-bold text-gray-900">Отправить отзыв / Сообщить о баге</h2>
          <button
            onClick={onClose}
            className="p-1 text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form ref={formRef} onSubmit={handleSubmit} className="p-4 sm:p-6 space-y-4">
          <div>
            <label className="block text-sm font-semibold mb-2 text-gray-700">
              Опишите проблему или оставьте отзыв <span className="text-red-500">*</span>
            </label>
            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Опишите проблему, которую вы обнаружили, или оставьте отзыв о приложении..."
              className="w-full px-3 py-2 border-2 border-gray-300 rounded-lg focus:border-gray-900 focus:outline-none resize-none"
              rows={6}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-semibold mb-2 text-gray-700">
              Прикрепить скриншот (необязательно)
            </label>
            {!screenshotPreview ? (
              <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer hover:bg-gray-50 transition-colors">
                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                  <ImageIcon className="w-8 h-8 mb-2 text-gray-400" />
                  <p className="mb-2 text-sm text-gray-500">
                    <span className="font-semibold">Нажмите для загрузки</span>, перетащите файл или <span className="font-semibold">вставьте из буфера обмена</span>
                  </p>
                  <p className="text-xs text-gray-500">PNG, JPG, GIF до 5MB (Ctrl+V / Cmd+V для вставки)</p>
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
                  className="w-full h-auto max-h-64 object-contain rounded-lg border-2 border-gray-300"
                />
                <button
                  type="button"
                  onClick={handleRemoveScreenshot}
                  className="absolute top-2 right-2 p-1 bg-red-600 text-white rounded-full hover:bg-red-700 transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 bg-gray-300 hover:bg-gray-400 text-gray-700 rounded-lg font-semibold transition-colors"
            >
              Отмена
            </button>
            <button
              type="submit"
              disabled={submitting || !comment.trim()}
              className="flex-1 px-4 py-2 bg-[#013328] hover:bg-[#013328]/90 text-white rounded-lg font-semibold flex items-center justify-center gap-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {submitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Отправка...
                </>
              ) : (
                <>
                  <Send className="w-4 h-4" />
                  Отправить
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

