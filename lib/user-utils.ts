import type { User } from '@/types';

/**
 * Проверяет, заполнены ли обязательные данные пользователя
 * Обязательные данные: email или телефон, и пароль
 */
export function isUserProfileComplete(user: User | null): boolean {
  if (!user) return false;
  
  // Должен быть указан либо email, либо телефон
  const hasEmailOrPhone = !!(user.email || user.phone);
  
  // Пароль должен быть установлен (проверяем через наличие в БД, но в localStorage пароль не хранится)
  // Поэтому проверяем только email/телефон, а пароль проверяем при попытке входа
  // Но для полноты профиля нужно, чтобы был хотя бы email или телефон
  return hasEmailOrPhone;
}

/**
 * Проверяет, нужно ли перенаправить пользователя на страницу заполнения профиля
 */
export function shouldRedirectToCompleteProfile(user: User | null): boolean {
  return !isUserProfileComplete(user);
}



