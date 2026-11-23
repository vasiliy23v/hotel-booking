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
      <AlertDialogContent className="rounded-3xl border-[#eadfd3] bg-[#faf8f5] p-6 sm:p-8">
        <AlertDialogHeader className="space-y-3 text-left">
          <AlertDialogTitle className="text-2xl font-semibold text-[#2a1d15]">
            Отменить бронь?
          </AlertDialogTitle>
          <AlertDialogDescription className="text-lg leading-relaxed text-[#6f5a4c]">
            {roomNumber ? `Комната ${roomNumber}` : 'Бронирование'}
            {bookedBy ? ` · ${bookedBy}` : ''}
            <br />
            Это действие нельзя отменить.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter className="mt-4 flex-col gap-3 sm:flex-col sm:space-x-0">
          <AlertDialogCancel
            disabled={isSubmitting}
            className="mt-0 h-14 w-full rounded-full border-0 bg-[#6b4a36] text-lg font-semibold text-white hover:bg-[#5a3b28] hover:text-white"
          >
            Оставить
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={onConfirm}
            disabled={isSubmitting}
            className="h-14 w-full rounded-full border-2 border-[#c4622d] bg-transparent text-lg font-semibold text-[#a8431f] hover:bg-[#fde9da]"
          >
            {isSubmitting ? 'Отменяем…' : 'Да, отменить бронь'}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
