import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';
import { prisma } from '@/lib/prisma';
import { updateUser } from '@/lib/db';
import { readResetToken, verifyResetToken } from '@/lib/password-reset';

async function findUserByToken(token: string) {
  const parsed = readResetToken(token);
  if (!parsed) return null;
  const user = await prisma.user.findUnique({ where: { id: parsed.userId } });
  if (!user || !verifyResetToken(token, user.password)) return null;
  return user;
}

// GET /api/auth/reset-password?token=... — проверка ссылки
export async function GET(request: NextRequest) {
  const token = request.nextUrl.searchParams.get('token') || '';
  const user = await findUserByToken(token);
  return NextResponse.json({ valid: !!user });
}

// POST /api/auth/reset-password — установка нового пароля
export async function POST(request: NextRequest) {
  try {
    const { token, password } = await request.json();
    if (typeof password !== 'string' || password.length < 6) {
      return NextResponse.json({ error: 'Пароль должен содержать минимум 6 символов' }, { status: 400 });
    }
    if (!/^[a-zA-Z0-9!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]*$/.test(password)) {
      return NextResponse.json({ error: 'Пароль может содержать только латинские буквы, цифры и спецсимволы' }, { status: 400 });
    }
    const user = await findUserByToken(token || '');
    if (!user) {
      return NextResponse.json({ error: 'Ссылка недействительна или устарела. Запросите новую.' }, { status: 400 });
    }
    const hash = crypto.createHash('sha256').update(password).digest('hex');
    await updateUser(user.id, { password: hash });
    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error('Reset password error:', error);
    return NextResponse.json({ error: 'Не удалось сменить пароль' }, { status: 500 });
  }
}
