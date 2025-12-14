import { NextRequest, NextResponse } from 'next/server';
import { sendCustomEmail } from '@/lib/email';
import { logActivity } from '@/lib/logger';

// POST /api/email/send - Отправка произвольного email (для менеджера)
export async function POST(request: NextRequest) {
  const startTime = Date.now();
  
  try {
    const { to, subject, message, html } = await request.json();

    // Получаем IP адрес и User-Agent из запроса
    const ipAddress = request.headers.get('x-forwarded-for') || 
                      request.headers.get('x-real-ip') || 
                      'unknown';
    const userAgent = request.headers.get('user-agent') || 'unknown';

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
      const duration = Date.now() - startTime;
      await logActivity({
        userId: undefined,
        userName: 'Система',
        userRole: undefined,
        action: 'email_sent',
        entity: 'email',
        details: {
          to,
          subject,
          error: result.error || 'Ошибка отправки email',
        },
        status: 'error',
        errorMessage: result.error || 'Ошибка отправки email',
        ipAddress: ipAddress.split(',')[0].trim(),
        userAgent,
        duration,
      }).catch(() => {});
      
      return NextResponse.json(
        { error: result.error || 'Ошибка отправки email' },
        { status: 500 }
      );
    }

    // Логируем отправку email
    const duration = Date.now() - startTime;
    await logActivity({
      userId: undefined, // Будет заполнено на клиенте
      userName: 'Система',
      userRole: undefined, // Будет заполнено на клиенте
      action: 'email_sent',
      entity: 'email',
      details: {
        to,
        subject,
        messageLength: message.length,
        hasHtml: !!html,
        demo: result.demo || false,
      },
      status: 'success',
      ipAddress: ipAddress.split(',')[0].trim(),
      userAgent,
      duration,
    }).catch(() => {
      // Тихо игнорируем ошибки логирования
    });

    return NextResponse.json({
      success: true,
      demo: result.demo,
      message: result.demo
        ? 'Email подготовлен (демо-режим, SMTP не настроен)'
        : 'Email успешно отправлен',
    });
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Ошибка при отправке email';
    const duration = Date.now() - startTime;
    
    // Логируем ошибку отправки email
    const ipAddress = request.headers.get('x-forwarded-for') || 
                      request.headers.get('x-real-ip') || 
                      'unknown';
    const userAgent = request.headers.get('user-agent') || 'unknown';
    
    await logActivity({
      userId: undefined,
      userName: 'Система',
      userRole: undefined,
      action: 'email_sent',
      entity: 'email',
      details: {
        error: errorMessage,
      },
      status: 'error',
      errorMessage,
      ipAddress: ipAddress.split(',')[0].trim(),
      userAgent,
      duration,
    }).catch(() => {
      // Тихо игнорируем ошибки логирования
    });
    
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}

