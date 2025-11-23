import { NextRequest, NextResponse } from 'next/server';
import { readData, writeData } from '@/lib/data';
import { sendVerificationCode, isSmtpConfigured } from '@/lib/email';

// POST /api/auth/verify-email - Генерация кода подтверждения
export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json();
    
    if (!email) {
      return NextResponse.json({ error: 'Email обязателен' }, { status: 400 });
    }

    // Генерируем 6-значный код
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = Date.now() + 10 * 60 * 1000; // 10 минут

    const data = readData();
    if (!data.emailVerifications) {
      data.emailVerifications = [];
    }

    // Удаляем старые коды для этого email
    data.emailVerifications = data.emailVerifications.filter(
      (v: any) => v.email !== email
    );

    // Добавляем новый код
    data.emailVerifications.push({
      email,
      code,
      expiresAt,
      createdAt: Date.now()
    });

    writeData(data);

    // Отправка кода на email
    const emailResult = await sendVerificationCode(email, code);

    if (!emailResult.success) {
      // Если не удалось отправить email, удаляем код из базы
      data.emailVerifications = data.emailVerifications.filter(
        (v: any) => !(v.email === email && v.code === code)
      );
      writeData(data);

      return NextResponse.json({ 
        error: emailResult.error || 'Не удалось отправить код подтверждения. Попробуйте позже.' 
      }, { status: 500 });
    }

    // В демо-режиме возвращаем код для отображения в интерфейсе
    // В продакшене (когда SMTP настроен) код не возвращаем
    const response: any = {
      success: true,
      message: emailResult.demo 
        ? 'Код подтверждения сгенерирован (демо-режим)' 
        : 'Код подтверждения отправлен на email'
    };

    // Только в демо-режиме показываем код
    if (emailResult.demo || !isSmtpConfigured()) {
      response.code = code;
      response.demo = true;
    }

    return NextResponse.json(response);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// PUT /api/auth/verify-email - Проверка кода
export async function PUT(request: NextRequest) {
  try {
    const { email, code } = await request.json();
    
    if (!email || !code) {
      return NextResponse.json({ error: 'Email и код обязательны' }, { status: 400 });
    }

    const data = readData();
    const verification = data.emailVerifications?.find(
      (v: any) => v.email === email && v.code === code
    );

    if (!verification) {
      return NextResponse.json({ error: 'Неверный код подтверждения' }, { status: 400 });
    }

    if (verification.expiresAt < Date.now()) {
      return NextResponse.json({ error: 'Код подтверждения истек' }, { status: 400 });
    }

    // Удаляем использованный код
    data.emailVerifications = data.emailVerifications.filter(
      (v: any) => !(v.email === email && v.code === code)
    );
    writeData(data);

    return NextResponse.json({ success: true, message: 'Email подтвержден' });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}


