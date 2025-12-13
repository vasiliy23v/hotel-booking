import { NextRequest, NextResponse } from 'next/server';
import { getActiveRegistrationToken, createOrUpdateRegistrationToken, verifyRegistrationToken } from '@/lib/db';
import { generateInviteToken, hashInviteToken } from '@/lib/crypto';

// GET /api/registration-token - Получить активный токен регистрации
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const verify = searchParams.get('verify');
    const token = searchParams.get('token');

    // Если запрос на проверку токена
    if (verify === 'true' && token) {
      // Передаем оригинальный токен напрямую, так как в URL используется оригинальный токен
      const isValid = await verifyRegistrationToken(token);
      return NextResponse.json({ valid: isValid });
    }

    // Получаем активный токен
    const registrationToken = await getActiveRegistrationToken();
    
    if (!registrationToken) {
      return NextResponse.json({ 
        exists: false,
        message: 'Общий токен регистрации не создан' 
      });
    }

    // Проверяем, нужна ли ссылка
    const includeUrl = searchParams.get('includeUrl') === 'true';

    const response: Record<string, unknown> = {
      exists: true,
      id: registrationToken.id,
      isActive: registrationToken.isActive,
      createdAt: registrationToken.createdAt,
      updatedAt: registrationToken.updatedAt,
    };

    // Если нужна ссылка
    if (includeUrl) {
      if (registrationToken.originalToken) {
        // Получаем базовый URL для формирования ссылки
        const host = request.headers.get('host') || request.headers.get('x-forwarded-host');
        const protocol = request.headers.get('x-forwarded-proto') || 
                         (request.url.startsWith('https') ? 'https' : 'http');
        
        let baseUrl = process.env.NEXT_PUBLIC_BASE_URL;
        if (!baseUrl && host) {
          baseUrl = `${protocol}://${host}`;
        }
        if (!baseUrl) {
          const origin = new URL(request.url).origin;
          baseUrl = origin;
        }

        response.registrationUrl = `${baseUrl}/register/${registrationToken.originalToken}`;
      } else {
        // Оригинальный токен отсутствует (токен создан до обновления)
        response.registrationUrl = null;
        response.urlUnavailable = true;
        response.message = 'Ссылка недоступна. Токен был создан до обновления системы. Создайте новый токен для получения ссылки.';
      }
    }

    return NextResponse.json(response);
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Неизвестная ошибка';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

// POST /api/registration-token - Создать или обновить токен регистрации
export async function POST(request: NextRequest) {
  try {
    // Генерируем новый токен
    const token = generateInviteToken();
    const hashedToken = hashInviteToken(token);

    // Создаем или обновляем токен (старые автоматически деактивируются)
    // Сохраняем оригинальный токен для возможности получения ссылки позже
    const registrationToken = await createOrUpdateRegistrationToken(hashedToken, token);

    // Получаем базовый URL для формирования ссылки
    const host = request.headers.get('host') || request.headers.get('x-forwarded-host');
    const protocol = request.headers.get('x-forwarded-proto') || 
                     (request.url.startsWith('https') ? 'https' : 'http');
    
    let baseUrl = process.env.NEXT_PUBLIC_BASE_URL;
    if (!baseUrl && host) {
      baseUrl = `${protocol}://${host}`;
    }
    if (!baseUrl) {
      const origin = new URL(request.url).origin;
      baseUrl = origin;
    }

    // Возвращаем токен и ссылку для регистрации
    return NextResponse.json({
      id: registrationToken.id,
      token, // Возвращаем незахэшированный токен только при создании
      registrationUrl: `${baseUrl}/register/${token}`,
      createdAt: registrationToken.createdAt,
      updatedAt: registrationToken.updatedAt,
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Неизвестная ошибка';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

