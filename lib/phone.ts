// ============================================
// НОРМАЛИЗАЦИЯ ТЕЛЕФОНОВ
// Приводит все форматы телефонов к единому виду
// ============================================

/**
 * Нормализует номер телефона к единому формату
 * Формат: +[код страны][номер]
 * Поддерживает любые коды стран (любая длина)
 * 
 * @param phone - номер телефона в любом формате
 * @returns нормализованный номер телефона или null, если номер невалидный
 */
export function normalizePhone(phone: string | null | undefined): string | null {
  if (!phone) return null;
  
  // Убираем все пробелы, дефисы и скобки
  const cleaned = phone.replace(/[\s\-()]/g, '');
  
  // Если пусто после очистки
  if (!cleaned) return null;
  
  // Если номер уже начинается с +, оставляем как есть
  if (cleaned.startsWith('+')) {
    // Проверяем, что после + есть хотя бы одна цифра кода страны
    const afterPlus = cleaned.slice(1);
    if (!afterPlus || !/^\d/.test(afterPlus)) {
      return null;
    }
    return cleaned;
  }
  
  // Если номер начинается с 8 (российский формат), заменяем на +7
  if (cleaned.startsWith('8')) {
    return '+7' + cleaned.slice(1);
  }
  
  // Если номер начинается с 7 и имеет 11 цифр (российский формат без +)
  if (cleaned.startsWith('7') && cleaned.length === 11) {
    return '+' + cleaned;
  }
  
  // Если номер имеет 10 цифр (российский формат без кода страны)
  if (cleaned.length === 10 && /^\d{10}$/.test(cleaned)) {
    return '+7' + cleaned;
  }
  
  // Для других случаев просто добавляем + если его нет
  if (!cleaned.startsWith('+')) {
    // Проверяем, что это только цифры
    if (!/^\d+$/.test(cleaned)) {
      return null;
    }
    return '+' + cleaned;
  }
  
  return cleaned;
}

/**
 * Проверяет, является ли строка валидным номером телефона
 * Формат: +[код страны любой длины][номер, минимум 4 цифры]
 */
export function isValidPhone(phone: string | null | undefined): boolean {
  if (!phone) return false;
  
  const normalized = normalizePhone(phone);
  if (!normalized) return false;
  
  // Проверяем формат: +[код страны любой длины][номер, минимум 4 цифры]
  // Код страны должен начинаться с 1-9 (не может быть 0)
  // Общая длина должна быть не менее 6 символов (+ + минимум 1 цифра кода + минимум 4 цифры номера)
  // И не более 20 символов (разумный максимум)
  if (normalized.length < 6 || normalized.length > 20) {
    return false;
  }
  
  // Проверяем формат: +[код страны начинается с 1-9][любое количество цифр кода][номер минимум 4 цифры]
  const phoneRegex = /^\+[1-9]\d+\d{4,}$/;
  return phoneRegex.test(normalized);
}

/**
 * Проверяет, является ли строка валидным email
 */
export function isValidEmail(email: string | null | undefined): boolean {
  if (!email) return false;
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}


