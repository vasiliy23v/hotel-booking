import { NextRequest, NextResponse } from 'next/server';
import { sendCustomEmail } from '@/lib/email';

// POST /api/email/send - Отправка произвольного email (для менеджера)
export async function POST(request: NextRequest) {
  try {
    const { to, subject, message, html } = await request.json();

    // Валидация
    if (!to || !subject || !message) {
      return NextResponse.json(
        { error: 'Заполните все обязательные поля: to, subject, message' },
        { status: 400 }
      );
    }

    // Отправка email
    const result = await sendCustomEmail(to, subject, message, html);

    if (!result.success) {
      return NextResponse.json(
        { error: result.error || 'Ошибка отправки email' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      demo: result.demo,
      message: result.demo
        ? 'Email подготовлен (демо-режим, SMTP не настроен)'
        : 'Email успешно отправлен',
    });
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Internal server error';
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}

