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
import { Euro } from 'lucide-react';

interface ConfirmPaymentDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  paymentType: 'half' | 'full';
  roomNumber?: string;
  totalAmount: number;
  alreadyPaid: number;
  amountToAdd: number;
  isSubmitting?: boolean;
}

export function ConfirmPaymentDialog({
  isOpen,
  onClose,
  onConfirm,
  paymentType,
  roomNumber,
  totalAmount,
  alreadyPaid,
  amountToAdd,
  isSubmitting = false,
}: ConfirmPaymentDialogProps) {
  const isHalfPayment = paymentType === 'half';

  return (
    <AlertDialog open={isOpen} onOpenChange={onClose}>
      <AlertDialogContent className="bg-white dark:bg-card border-gray-200 dark:border-border">
        <AlertDialogHeader>
          <AlertDialogTitle className="flex items-center gap-2 text-gray-900 dark:text-foreground">
            <Euro className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            Подтвердить оплату {isHalfPayment ? '50%' : '100%'}
          </AlertDialogTitle>
          <AlertDialogDescription asChild>
            <div className="text-gray-700 dark:text-muted-foreground space-y-3 pt-2">
              {roomNumber && (
                <div className="font-medium text-gray-900 dark:text-foreground">
                  Комната: <span className="font-semibold">#{roomNumber}</span>
                </div>
              )}
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span>Сумма к оплате:</span>
                  <span className="font-semibold text-gray-900 dark:text-foreground">
                    {totalAmount.toFixed(2)}€
                  </span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span>Уже оплачено:</span>
                  <span className="text-gray-600 dark:text-muted-foreground">
                    {alreadyPaid.toFixed(2)}€
                  </span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span>К доплате:</span>
                  <span className="font-semibold text-gray-900 dark:text-foreground">
                    {amountToAdd.toFixed(2)}€
                  </span>
                </div>
              </div>
            </div>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel 
            disabled={isSubmitting}
            className="text-gray-900 dark:text-foreground border-gray-300 dark:border-border hover:bg-gray-100 dark:hover:bg-accent"
          >
            Отмена
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={onConfirm}
            disabled={isSubmitting}
            className={`${
              isHalfPayment 
                ? 'bg-blue-600 hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-800' 
                : 'bg-green-600 hover:bg-green-700 dark:bg-green-700 dark:hover:bg-green-800'
            } text-white`}
          >
            {isSubmitting 
              ? 'Подтверждение...' 
              : `Подтвердить оплату ${isHalfPayment ? '50%' : '100%'}`}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

