import { NextRequest, NextResponse } from 'next/server';
import { getUserByEmail } from '@/lib/db';
import { sendCustomEmail } from '@/lib/email';
import { createResetToken } from '@/lib/password-reset';

// POST /api/auth/forgot-password — всегда отвечает одинаково, чтобы нельзя было узнать, есть ли такой email
export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json();
    const value = typeof email === 'string' ? email.trim() : '';
    if (!value || !value.includes('@')) {
      return NextResponse.json({ error: 'Укажите email' }, { status: 400 });
    }

    const user = await getUserByEmail(value);
    if (user?.email) {
      const token = createResetToken(user.id, user.password ?? null);
      const origin = process.env.NEXT_PUBLIC_APP_URL || request.nextUrl.origin;
      const link = `${origin}/reset-password/${token}`;
      const text = `Здравствуйте, ${user.name}!\n\nЧтобы задать новый пароль, перейдите по ссылке (действует 1 час):\n${link}\n\nЕсли вы не запрашивали смену пароля, просто проигнорируйте это письмо.`;
      const html = `<div style="font-family:Arial,sans-serif;max-width:520px;margin:0 auto;padding:24px;color:#3d2f27;background:#fbf8f4">
<h2 style="font-weight:600">Новый пароль</h2>
<p>Здравствуйте, ${user.name}!</p>
<p>Чтобы задать новый пароль, нажмите на кнопку. Ссылка действует 1 час.</p>
<p><a href="${link}" style="display:inline-block;background:#6b4a36;color:#fff;padding:14px 28px;border-radius:999px;text-decoration:none;font-size:17px">Задать новый пароль</a></p>
<p style="color:#8a7566;font-size:14px">Если вы не запрашивали смену пароля, просто проигнорируйте это письмо.</p></div>`;
      const result = await sendCustomEmail(user.email, 'Сброс пароля', text, html);
      if (!result.success) console.error('Forgot password: email failed', result.error);
      if (result.demo) console.log('🔑 Ссылка сброса пароля (демо):', link);
    }

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error('Forgot password error:', error);
    return NextResponse.json({ error: 'Не удалось отправить письмо' }, { status: 500 });
  }
}
