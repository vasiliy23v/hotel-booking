'use client';

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
import { Trash2 } from 'lucide-react';

interface ConfirmCancelBookingDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  roomNumber?: string;
  bookedBy?: string;
  isSubmitting?: boolean;
}

export function ConfirmCancelBookingDialog({
  isOpen,
  onClose,
  onConfirm,
  roomNumber,
  bookedBy,
  isSubmitting = false,
}: ConfirmCancelBookingDialogProps) {
  return (
    <AlertDialog open={isOpen} onOpenChange={onClose}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle className="flex items-center gap-2 text-gray-900 dark:text-gray-100">
            <Trash2 className="w-5 h-5 text-red-600 dark:text-red-400" />
            Отменить бронирование
          </AlertDialogTitle>
          <AlertDialogDescription className="text-gray-700 dark:text-gray-300 space-y-2">
            {bookedBy && (
              <div className="font-medium text-gray-900 dark:text-gray-100">
                Бронирование для: <span className="font-semibold">{bookedBy}</span>
              </div>
            )}
            <div>
              {roomNumber
                ? `Вы уверены, что хотите отменить бронирование комнаты #${roomNumber}? Это действие нельзя отменить.`
                : 'Вы уверены, что хотите отменить бронирование? Это действие нельзя отменить.'}
            </div>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel 
            disabled={isSubmitting}
            className="text-gray-900 dark:text-gray-100 border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-800"
          >
            Отмена
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={onConfirm}
            disabled={isSubmitting}
            className="bg-red-600 hover:bg-red-700 dark:bg-red-700 dark:hover:bg-red-800 text-white"
          >
            {isSubmitting ? 'Отмена...' : 'Отменить бронирование'}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

