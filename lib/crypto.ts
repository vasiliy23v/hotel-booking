// Утилиты для хэширования токенов приглашений
import crypto from 'crypto';

const SECRET_KEY = process.env.INVITE_SECRET_KEY || 'your-secret-key-change-in-production';

/**
 * Генерирует случайный токен приглашения
 */
export function generateInviteToken(): string {
  return crypto.randomBytes(32).toString('hex');
}

/**
 * Хэширует токен приглашения для безопасного хранения
 */
export function hashInviteToken(token: string): string {
  return crypto
    .createHmac('sha256', SECRET_KEY)
    .update(token)
    .digest('hex');
}

/**
 * Проверяет, соответствует ли токен хэшу
 */
export function verifyInviteToken(token: string, hash: string): boolean {
  if (!token || !hash) {
    return false;
  }
  
  try {
    const tokenHash = hashInviteToken(token);
    
    // Проверяем, что хэши имеют одинаковую длину
    if (tokenHash.length !== hash.length) {
      return false;
    }
    
    // Используем timingSafeEqual для защиты от timing attacks
    // Оба хэша - это hex строки, преобразуем их в буферы для сравнения
    const tokenHashBuffer = Buffer.from(tokenHash, 'hex');
    const hashBuffer = Buffer.from(hash, 'hex');
    
    // Проверяем, что буферы имеют одинаковую длину (должно быть 32 байта для SHA256)
    if (tokenHashBuffer.length !== hashBuffer.length) {
      return false;
    }
    
    return crypto.timingSafeEqual(tokenHashBuffer, hashBuffer);
  } catch {
    // Если произошла ошибка (например, неверный формат hex), возвращаем false
    return false;
  }
}

