// Одноразовые ссылки для сброса пароля без хранения в БД.
// Токен подписан секретом и привязан к текущему паролю: после смены пароля старая ссылка перестаёт работать.
import crypto from 'crypto';

const SECRET = process.env.INVITE_SECRET_KEY || 'your-secret-key-change-in-production';
const TTL_MS = 60 * 60 * 1000; // 1 час

function sign(payload: string, currentPassword: string | null): string {
  const pwdMark = crypto.createHash('sha256').update(currentPassword || '').digest('hex').slice(0, 16);
  return crypto.createHmac('sha256', SECRET).update(`${payload}.${pwdMark}`).digest('hex');
}

export function createResetToken(userId: string, currentPassword: string | null): string {
  const payload = Buffer.from(JSON.stringify({ u: userId, e: Date.now() + TTL_MS })).toString('base64url');
  return `${payload}.${sign(payload, currentPassword)}`;
}

export function readResetToken(token: string): { userId: string } | null {
  try {
    const [payload] = token.split('.');
    const data = JSON.parse(Buffer.from(payload, 'base64url').toString());
    if (!data?.u || typeof data.e !== 'number' || data.e < Date.now()) return null;
    return { userId: data.u as string };
  } catch {
    return null;
  }
}

export function verifyResetToken(token: string, currentPassword: string | null): boolean {
  const [payload, sig] = token.split('.');
  if (!payload || !sig) return false;
  const expected = sign(payload, currentPassword);
  if (expected.length !== sig.length) return false;
  return crypto.timingSafeEqual(Buffer.from(expected), Buffer.from(sig));
}
