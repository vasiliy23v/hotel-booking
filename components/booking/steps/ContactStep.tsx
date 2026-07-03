'use client';

import { Mail, Phone, User } from 'lucide-react';
import type { User as UserType } from '@/types';

interface ContactStepProps {
  email: string;
  phone: string;
  onEmailChange: (email: string) => void;
  onPhoneChange: (phone: string) => void;
  currentUser?: UserType | null;
  manualUserName?: string;
  manualUserPhone?: string;
  onManualUserNameChange?: (name: string) => void;
  onManualUserPhoneChange?: (phone: string) => void;
  mode?: 'create' | 'edit';
}

// Проверка на латинские буквы, пробелы и дефисы
const isValidLatinName = (name: string): boolean => {
  return /^[A-Za-z\s-]*$/.test(name);
};

export function ContactStep({
  email,
  phone,
  onEmailChange,
  onPhoneChange,
  currentUser,
  manualUserName,
  manualUserPhone,
  onManualUserNameChange,
  onManualUserPhoneChange,
  mode = 'create',
}: ContactStepProps) {
  const canEditBookedBy = currentUser?.role === 'manager' || currentUser?.role === 'developer';
  const hasNameError = canEditBookedBy && manualUserName && !isValidLatinName(manualUserName);
  const bookedByLabel = mode === 'edit' ? 'Кто бронировал' : 'Имя пользователя';

  return (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <Mail className="w-12 h-12 text-gray-400 dark:text-muted-foreground mx-auto mb-2" />
        <h2 className="text-xl font-medium text-gray-900 dark:text-foreground">Контактная информация</h2>
        <p className="text-sm text-gray-500 dark:text-muted-foreground mt-1">Укажите контактные данные для бронирования</p>
      </div>

      <div className="space-y-4">
        {canEditBookedBy ? (
          <>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-foreground mb-2">
                {bookedByLabel} <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 dark:text-muted-foreground" />
                <input
                  type="text"
                  value={manualUserName || ''}
                  onChange={(e) => onManualUserNameChange?.(e.target.value)}
                  placeholder="Muller Felix"
                  className={`w-full pl-10 pr-4 py-2 border-2 rounded-lg bg-white dark:bg-input text-gray-900 dark:text-foreground focus:outline-none ${
                    hasNameError 
                      ? 'border-red-500 focus:border-red-600' 
                      : 'border-gray-300 dark:border-border focus:border-gray-900 dark:focus:border-ring'
                  }`}
                />
              </div>
              {hasNameError ? (
                <p className="mt-1 text-xs text-red-600 dark:text-red-400">❌ Используйте только латинские буквы, пробелы и дефисы</p>
              ) : (
                <p className="mt-1 text-xs text-gray-500 dark:text-muted-foreground">Используйте только латинские буквы</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-foreground mb-2">
                Телефон пользователя <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 dark:text-muted-foreground" />
                <input
                  type="tel"
                  value={manualUserPhone || ''}
                  onChange={(e) => onManualUserPhoneChange?.(e.target.value)}
                  placeholder="+7XXXXXXXXXX"
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-border rounded-lg bg-white dark:bg-input text-gray-900 dark:text-foreground focus:border-gray-900 dark:focus:border-ring focus:outline-none"
                />
              </div>
            </div>
          </>
        ) : (
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-foreground mb-2">
              Имя <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 dark:text-muted-foreground" />
              <input
                type="text"
                value={currentUser?.name || ''}
                readOnly
                className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-border rounded-lg bg-gray-50 dark:bg-muted text-gray-700 dark:text-foreground cursor-not-allowed"
              />
            </div>
            <p className="mt-1 text-xs text-gray-500 dark:text-muted-foreground">Имя берется из вашего профиля</p>
          </div>
        )}

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-foreground mb-2">
            Email
          </label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 dark:text-muted-foreground" />
            <input
              type="email"
              value={email}
              onChange={(e) => onEmailChange(e.target.value)}
              placeholder="email@example.com (необязательно)"
              className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-border rounded-lg bg-white dark:bg-input text-gray-900 dark:text-foreground focus:border-gray-900 dark:focus:border-ring focus:outline-none"
            />
          </div>
        </div>

        {!canEditBookedBy && (
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-foreground mb-2">
              Телефон <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 dark:text-muted-foreground" />
              <input
                type="tel"
                value={phone}
                onChange={(e) => onPhoneChange(e.target.value)}
                placeholder="+7XXXXXXXXXX"
                className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-border rounded-lg bg-white dark:bg-input text-gray-900 dark:text-foreground focus:border-gray-900 dark:focus:border-ring focus:outline-none"
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

