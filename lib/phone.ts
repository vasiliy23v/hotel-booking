// ============================================
// НОРМАЛИЗАЦИЯ ТЕЛЕФОНОВ
// Приводит все форматы телефонов к единому виду
// ============================================

/**
 * Нормализует номер телефона к единому формату
 * Удаляет все символы кроме цифр, затем форматирует
 * Формат: +7XXXXXXXXXX (11 цифр) или XXXXXXXXXX (10 цифр без кода страны)
 * 
 * @param phone - номер телефона в любом формате
 * @returns нормализованный номер телефона или null, если номер невалидный
 */
export function normalizePhone(phone: string | null | undefined): string | null {
  if (!phone) return null;
  
  // Удаляем все символы кроме цифр
  const digits = phone.replace(/\D/g, '');
  
  // Если пусто после удаления нецифровых символов
  if (!digits) return null;
  
  // Если номер начинается с 8, заменяем на 7
  let normalized = digits.startsWith('8') ? '7' + digits.slice(1) : digits;
  
  // Если номер начинается с 7 и имеет 11 цифр - оставляем как есть
  if (normalized.startsWith('7') && normalized.length === 11) {
    return '+' + normalized;
  }
  
  // Если номер имеет 10 цифр (без кода страны) - добавляем +7
  if (normalized.length === 10) {
    return '+7' + normalized;
  }
  
  // Если номер имеет 11 цифр и начинается не с 7 - добавляем +7
  if (normalized.length === 11 && !normalized.startsWith('7')) {
    return '+7' + normalized.slice(1);
  }
  
  // Если номер имеет меньше 10 цифр - невалидный
  if (normalized.length < 10) {
    return null;
  }
  
  // Если номер имеет больше 11 цифр - обрезаем до 11
  if (normalized.length > 11) {
    normalized = normalized.slice(0, 11);
  }
  
  // Если после обрезки не начинается с 7, добавляем +7
  if (!normalized.startsWith('7')) {
    normalized = '7' + normalized;
  }
  
  return '+' + normalized;
}

/**
 * Проверяет, является ли строка валидным номером телефона
 */
export function isValidPhone(phone: string | null | undefined): boolean {
  const normalized = normalizePhone(phone);
  if (!normalized) return false;
  
  // Проверяем формат: +7 и 10 цифр после
  return /^\+7\d{10}$/.test(normalized);
}

/**
 * Проверяет, является ли строка валидным email
 */
export function isValidEmail(email: string | null | undefined): boolean {
  if (!email) return false;
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

