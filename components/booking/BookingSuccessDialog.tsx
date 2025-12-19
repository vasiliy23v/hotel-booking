'use client';

import { useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { CheckCircle } from 'lucide-react';

interface BookingSuccessDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

export function BookingSuccessDialog({
  isOpen,
  onClose,
}: BookingSuccessDialogProps) {
  const router = useRouter();
  const isNavigatingRef = useRef(false);

  // Сбрасываем флаг при открытии диалога
  useEffect(() => {
    if (isOpen) {
      isNavigatingRef.current = false;
    }
  }, [isOpen]);

  const handleGoToBookings = () => {
    // Устанавливаем флаг синхронно, чтобы предотвратить вызов onClose при закрытии диалога
    isNavigatingRef.current = true;
    // Используем router.push для навигации без полной перезагрузки страницы
    router.push('/bookings');
  };

  const handleOpenChange = (open: boolean) => {
    // Если диалог закрывается и мы не делаем переход в bookings, вызываем onClose
    if (!open && !isNavigatingRef.current) {
      onClose();
    }
  };

  return (
    <AlertDialog open={isOpen} onOpenChange={handleOpenChange}>
      <AlertDialogContent className="max-w-md">
        <AlertDialogHeader>
          <AlertDialogTitle className="flex items-center gap-3 text-gray-900 dark:text-gray-100">
            <div className="shrink-0 w-10 h-10 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
              <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400" />
            </div>
            <span>Комната успешно забронирована</span>
          </AlertDialogTitle>
          <AlertDialogDescription className="text-gray-700 dark:text-gray-300 pt-2 text-base leading-relaxed">
            Ваше бронирование было успешно создано. Вы можете просмотреть все свои бронирования в разделе &quot;Мои бронирования&quot;.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter className="flex-col sm:flex-row gap-2">
          <AlertDialogAction
            onClick={handleGoToBookings}
            className="bg-green-600 hover:bg-green-700 dark:bg-green-700 dark:hover:bg-green-800 text-white w-full sm:w-auto"
          >
            Перейти в &quot;Мои бронирования&quot;
          </AlertDialogAction>
          <AlertDialogAction
            onClick={onClose}
            className="bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-900 dark:text-gray-100 w-full sm:w-auto"
          >
            Закрыть
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

