/**
 * Утилиты для валидации данных
 */

/**
 * Валидация email адреса
 * @param email - Email адрес для проверки
 * @returns Объект с результатом валидации
 */
export function validateEmail(email: string): { isValid: boolean; error?: string } {
  if (!email) {
    return { isValid: false, error: 'Email обязателен' };
  }

  // Убираем пробелы в начале и конце
  const trimmedEmail = email.trim().toLowerCase();

  // Базовая проверка формата
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(trimmedEmail)) {
    return { isValid: false, error: 'Некорректный формат email' };
  }

  // Проверка длины
  if (trimmedEmail.length > 254) {
    return { isValid: false, error: 'Email слишком длинный (максимум 254 символа)' };
  }

  // Разделяем на локальную часть и домен
  const [localPart, domain] = trimmedEmail.split('@');

  // Проверка локальной части (до @)
  if (!localPart || localPart.length === 0) {
    return { isValid: false, error: 'Email должен содержать локальную часть' };
  }

  if (localPart.length > 64) {
    return { isValid: false, error: 'Локальная часть email слишком длинная' };
  }

  // Проверка на недопустимые символы в локальной части
  const localPartRegex = /^[a-z0-9._+-]+$/i;
  if (!localPartRegex.test(localPart)) {
    return { isValid: false, error: 'Локальная часть содержит недопустимые символы' };
  }

  // Проверка домена
  if (!domain || domain.length === 0) {
    return { isValid: false, error: 'Email должен содержать домен' };
  }

  if (domain.length > 253) {
    return { isValid: false, error: 'Домен слишком длинный' };
  }

  // Проверка формата домена
  const domainRegex = /^[a-z0-9.-]+\.[a-z]{2,}$/i;
  if (!domainRegex.test(domain)) {
    return { isValid: false, error: 'Некорректный формат домена' };
  }

  // Проверка, что домен не начинается и не заканчивается точкой или дефисом
  if (domain.startsWith('.') || domain.endsWith('.') || 
      domain.startsWith('-') || domain.endsWith('-')) {
    return { isValid: false, error: 'Некорректный формат домена' };
  }

  // Проверка на двойные точки
  if (domain.includes('..') || localPart.includes('..')) {
    return { isValid: false, error: 'Email не может содержать двойные точки' };
  }

  // Проверка, что домен содержит хотя бы одну точку (TLD)
  const domainParts = domain.split('.');
  if (domainParts.length < 2) {
    return { isValid: false, error: 'Домен должен содержать домен верхнего уровня (например, .com)' };
  }

  // Проверка TLD (должен быть минимум 2 символа)
  const tld = domainParts[domainParts.length - 1];
  if (tld.length < 2) {
    return { isValid: false, error: 'Домен верхнего уровня должен содержать минимум 2 символа' };
  }

  return { isValid: true };
}

/**
 * Простая валидация email (быстрая проверка)
 * @param email - Email адрес для проверки
 * @returns true если email валиден
 */
export function isValidEmail(email: string): boolean {
  const result = validateEmail(email);
  return result.isValid;
}

/**
 * Валидация телефона
 * @param phone - Номер телефона для проверки
 * @returns Объект с результатом валидации
 */
export function validatePhone(phone: string, required: boolean = false): { isValid: boolean; error?: string } {
  if (!phone) {
    if (required) {
      return { isValid: false, error: 'Телефон обязателен' };
    }
    return { isValid: true }; // Телефон не обязателен
  }

  // Убираем все пробелы, дефисы и скобки
  const cleanPhone = phone.replace(/[\s\-()]/g, '');

  // Проверка формата: должен начинаться с +, затем код страны (любая длина, начинается с 1-9), затем номер (минимум 4 цифры)
  // Общая длина: минимум 6 символов (+ + 1 + 4), максимум 20 символов
  if (cleanPhone.length < 6 || cleanPhone.length > 20) {
    return { 
      isValid: false, 
      error: 'Некорректный формат телефона. Используйте международный формат: +491234567890' 
    };
  }
  
  const phoneRegex = /^\+[1-9]\d+\d{4,}$/;
  if (!phoneRegex.test(cleanPhone)) {
    return { 
      isValid: false, 
      error: 'Некорректный формат телефона. Используйте международный формат: +491234567890' 
    };
  }

  return { isValid: true };
}

/**
 * Простая валидация телефона
 * @param phone - Номер телефона для проверки
 * @param required - Обязателен ли телефон
 * @returns true если телефон валиден
 */
export function isValidPhone(phone: string, required: boolean = false): boolean {
  const result = validatePhone(phone, required);
  return result.isValid;
}



