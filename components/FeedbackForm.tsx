'use client';

import { useState } from 'react';
import { X } from 'lucide-react';
import type { User } from '@/types';
import { MultiStepForm } from '@/components/booking/MultiStepForm';
import { CommentStep } from '@/components/feedback/steps/CommentStep';
import { ScreenshotStep } from '@/components/feedback/steps/ScreenshotStep';
import { DeveloperStep } from '@/components/feedback/steps/DeveloperStep';
import { Confetti } from '@/components/feedback/Confetti';

interface FeedbackFormProps {
  currentUser: User;
  onClose: () => void;
  developerEmail?: string;
  telegramUsername?: string;
}

export default function FeedbackForm({ currentUser, onClose, developerEmail, telegramUsername }: FeedbackFormProps) {
  const [comment, setComment] = useState('');
  const [screenshot, setScreenshot] = useState<File | null>(null);
  const [screenshotPreview, setScreenshotPreview] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [showConfetti, setShowConfetti] = useState(false);

  const handleSubmit = async () => {
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

  const validateComment = () => {
    return !!comment.trim();
  };

  const steps = [
    {
      title: 'Текст',
      description: 'Опишите проблему',
      content: (
        <CommentStep
          comment={comment}
          onCommentChange={setComment}
        />
      ),
      validate: validateComment,
    },
    {
      title: 'Скриншот',
      description: 'Прикрепите изображение',
      content: (
        <ScreenshotStep
          screenshot={screenshot}
          screenshotPreview={screenshotPreview}
          onScreenshotChange={setScreenshot}
          onScreenshotPreviewChange={setScreenshotPreview}
        />
      ),
    },
    {
      title: 'Разработчик',
      description: 'Свяжитесь со мной',
      content: (
        <DeveloperStep 
          developerEmail={developerEmail} 
          telegramUsername={telegramUsername}
        />
      ),
    },
  ];

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 pb-20 lg:pb-4" onClick={onClose}>
      <div className="bg-white dark:bg-card rounded-lg max-w-2xl w-full max-h-[calc(90vh-80px)] lg:max-h-[90vh] overflow-y-auto shadow-xl" onClick={(e) => e.stopPropagation()}>
        <div className="sticky top-0 bg-white dark:bg-card border-b border-gray-200 dark:border-border px-4 sm:px-6 py-4 flex items-center justify-between z-10">
          <h2 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-foreground">Отправить отзыв / Сообщить о баге</h2>
          <button
            onClick={onClose}
            className="p-1 text-gray-400 dark:text-muted-foreground hover:text-gray-600 dark:hover:text-foreground transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-4 sm:p-6">
          <MultiStepForm
            steps={steps}
            onSubmit={handleSubmit}
            onCancel={onClose}
            submitLabel="Отправить"
            cancelLabel="Отмена"
            isSubmitting={submitting}
            initialStep={currentStep}
            onStepChange={(step) => {
              setCurrentStep(step);
              if (step === 2) {
                setShowConfetti(true);
                setTimeout(() => setShowConfetti(false), 6000);
              }
            }}
          />
        </div>
      </div>
      <Confetti active={showConfetti} />
    </div>
  );
}

