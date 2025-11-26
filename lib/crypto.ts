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
  const tokenHash = hashInviteToken(token);
  return crypto.timingSafeEqual(
    Buffer.from(tokenHash),
    Buffer.from(hash)
  );
}

