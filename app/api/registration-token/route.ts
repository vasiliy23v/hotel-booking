import { NextRequest, NextResponse } from 'next/server';
import { getActiveRegistrationToken, createOrUpdateRegistrationToken, verifyRegistrationToken } from '@/lib/db';
import { generateInviteToken, hashInviteToken } from '@/lib/crypto';
import { logActivity } from '@/lib/logger';

// GET /api/registration-token - Получить активный токен регистрации
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const verify = searchParams.get('verify');
    const token = searchParams.get('token');

    // Если запрос на проверку токена
    if (verify === 'true' && token) {
      // Передаем оригинальный токен напрямую, так как в URL используется оригинальный токен
      try {
        const isValid = await verifyRegistrationToken(token);
        return NextResponse.json({ valid: isValid });
      } catch (error) {
        console.error('Error verifying registration token:', error);
        return NextResponse.json({ 
          valid: false, 
          error: error instanceof Error ? error.message : 'Unknown error' 
        });
      }
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
  const startTime = Date.now();
  let registrationToken;
  
  try {
    // Получаем IP адрес и User-Agent из запроса
    const ipAddress = request.headers.get('x-forwarded-for') || 
                      request.headers.get('x-real-ip') || 
                      'unknown';
    const userAgent = request.headers.get('user-agent') || 'unknown';
    
    // Генерируем новый токен
    const token = generateInviteToken();
    const hashedToken = hashInviteToken(token);

    // Создаем или обновляем токен (старые автоматически деактивируются)
    // Сохраняем оригинальный токен для возможности получения ссылки позже
    registrationToken = await createOrUpdateRegistrationToken(hashedToken, token);

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

    // Логируем создание/обновление токена регистрации
    const duration = Date.now() - startTime;
    await logActivity({
      userId: undefined, // Будет заполнено на клиенте
      userName: 'Система',
      userRole: undefined, // Будет заполнено на клиенте
      action: 'registration_token_created',
      entity: 'registration_token',
      entityId: registrationToken.id,
      details: {
        isActive: registrationToken.isActive,
        createdAt: registrationToken.createdAt,
        updatedAt: registrationToken.updatedAt,
      },
      status: 'success',
      ipAddress: ipAddress.split(',')[0].trim(),
      userAgent,
      duration,
    }).catch(() => {
      // Тихо игнорируем ошибки логирования
    });

    // Возвращаем токен и ссылку для регистрации
    return NextResponse.json({
      id: registrationToken.id,
      token, // Возвращаем незахэшированный токен только при создании
      registrationUrl: `${baseUrl}/register/${token}`,
      createdAt: registrationToken.createdAt,
      updatedAt: registrationToken.updatedAt,
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Ошибка при создании токена регистрации';
    const duration = Date.now() - startTime;
    
    // Логируем ошибку создания токена регистрации
    const ipAddress = request.headers.get('x-forwarded-for') || 
                      request.headers.get('x-real-ip') || 
                      'unknown';
    const userAgent = request.headers.get('user-agent') || 'unknown';
    
    await logActivity({
      userId: undefined,
      userName: 'Система',
      userRole: undefined,
      action: 'registration_token_created',
      entity: 'registration_token',
      entityId: registrationToken?.id,
      details: {
        error: message,
      },
      status: 'error',
      errorMessage: message,
      ipAddress: ipAddress.split(',')[0].trim(),
      userAgent,
      duration,
    }).catch(() => {
      // Тихо игнорируем ошибки логирования
    });
    
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

