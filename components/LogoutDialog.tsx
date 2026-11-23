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

export function LogoutDialog({
  open,
  onOpenChange,
  onConfirm,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
}) {
  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent className="max-w-sm rounded-3xl border-[#eadfd3] bg-[#faf8f5] p-6 sm:p-8">
        <AlertDialogHeader className="space-y-2 text-left">
          <AlertDialogTitle className="text-2xl font-semibold text-[#2a1d15]">
            Выйти?
          </AlertDialogTitle>
          <AlertDialogDescription className="sr-only">
            Подтвердите выход из аккаунта
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter className="mt-2 flex-row gap-3 sm:flex-row sm:space-x-0">
          <AlertDialogCancel className="mt-0 h-14 flex-1 rounded-full border border-[#d8cabb] bg-transparent text-lg font-medium text-[#5a3b28] hover:bg-[#f1e4d6]">
            Остаться
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={onConfirm}
            className="h-14 flex-1 rounded-full bg-[#6b4a36] text-lg font-semibold text-white hover:bg-[#5a3b28]"
          >
            Выйти
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
