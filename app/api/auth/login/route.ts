import { NextRequest, NextResponse } from 'next/server';
import { getUserByEmail, getUserByPhone } from '@/lib/db';
import { normalizePhone } from '@/lib/phone';
import crypto from 'crypto';
import { logActivity } from '@/lib/logger';

// POST /api/auth/login
export async function POST(request: NextRequest) {
  const startTime = Date.now();
  let user;
  
  try {
    const body = await request.json();
    const { email, phone, password } = body;
    
    // Получаем IP адрес и User-Agent из запроса
    const ipAddress = request.headers.get('x-forwarded-for') || 
                      request.headers.get('x-real-ip') || 
                      'unknown';
    const userAgent = request.headers.get('user-agent') || 'unknown';
    
    // Должен быть указан либо email, либо телефон
    const identifier = email || phone;
    if (!identifier) {
      return NextResponse.json(
        { error: 'Укажите email или телефон' },
        { status: 400 }
      );
    }
    
    if (!password) {
      return NextResponse.json(
        { error: 'Укажите пароль' },
        { status: 400 }
      );
    }
    
    // Определяем, является ли идентификатор email или телефоном
    user = null;
    
    // Если передан email или identifier содержит @, ищем по email
    if (email || identifier.includes('@')) {
      const emailToSearch = email || identifier;
      user = await getUserByEmail(emailToSearch);
    } else {
      // Иначе ищем по телефону (нормализуем перед поиском)
      const phoneToSearch = phone || identifier;
      const normalizedPhone = normalizePhone(phoneToSearch);
      
      if (normalizedPhone) {
        user = await getUserByPhone(normalizedPhone);
      } else {
        // Если телефон не удалось нормализовать, пробуем найти как есть
        user = await getUserByPhone(phoneToSearch);
      }
    }
    
    if (!user) {
      console.log('Login failed: User not found for', email || phone || identifier);
      const duration = Date.now() - startTime;
      await logActivity({
        userId: undefined,
        userName: 'Неизвестный',
        userRole: undefined,
        action: 'user_login',
        entity: 'user',
        details: {
          identifier: email || phone || identifier,
          error: 'User not found',
        },
        status: 'error',
        errorMessage: 'Неверный email/телефон или пароль',
        ipAddress: ipAddress.split(',')[0].trim(),
        userAgent,
        duration,
      }).catch(() => {});
      
      return NextResponse.json(
        { error: 'Неверный email/телефон или пароль' },
        { status: 401 }
      );
    }
    
    // Проверяем пароль
    // Если у пользователя нет пароля, но он пытается войти - это ошибка
    if (!user.password) {
      console.log('Login failed: No password set for user', user.id);
      return NextResponse.json(
        { error: 'Пароль не установлен. Обратитесь к администратору' },
        { status: 401 }
      );
    }
    
    // Хешируем входящий пароль для сравнения
    // Если пароль в БД захеширован (64 символа hex), сравниваем хеши
    // Если пароль в БД в открытом виде, сравниваем напрямую
    let passwordMatches = false;
    const isHashed = user.password.length === 64 && /^[a-f0-9]{64}$/i.test(user.password);
    
    if (isHashed) {
      // Пароль захеширован (SHA-256)
      const passwordHash = crypto.createHash('sha256').update(password).digest('hex');
      passwordMatches = passwordHash === user.password;
      console.log('Password check (hashed):', {
        provided: password,
        storedHash: user.password.substring(0, 16) + '...',
        computedHash: passwordHash.substring(0, 16) + '...',
        matches: passwordMatches
      });
    } else {
      // Пароль в открытом виде
      passwordMatches = user.password === password;
      console.log('Password check (plain):', {
        provided: password,
        stored: user.password,
        matches: passwordMatches
      });
    }
    
    if (!passwordMatches) {
      console.log('Login failed: Password mismatch for user', user.id);
      const duration = Date.now() - startTime;
      await logActivity({
        userId: user.id,
        userName: user.name || 'Неизвестный',
        userRole: user.role,
        action: 'user_login',
        entity: 'user',
        entityId: user.id,
        details: {
          identifier: email || phone || identifier,
          error: 'Password mismatch',
        },
        status: 'error',
        errorMessage: 'Неверный email/телефон или пароль',
        ipAddress: ipAddress.split(',')[0].trim(),
        userAgent,
        duration,
      }).catch(() => {});
      
      return NextResponse.json(
        { error: 'Неверный email/телефон или пароль' },
        { status: 401 }
      );
    }
    
    console.log('Login successful for user', user.id);
    
    // Логируем успешный вход
    const duration = Date.now() - startTime;
    await logActivity({
      userId: user.id,
      userName: user.name || 'Неизвестный',
      userRole: user.role,
      action: 'user_login',
      entity: 'user',
      entityId: user.id,
      details: {
        identifier: email || phone || identifier,
      },
      status: 'success',
      ipAddress: ipAddress.split(',')[0].trim(),
      userAgent,
      duration,
    }).catch(() => {
      // Тихо игнорируем ошибки логирования
    });
    
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password: _password, ...userWithoutPassword } = user;
    return NextResponse.json(userWithoutPassword);
  } catch (error: unknown) {
    console.error('Login error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Ошибка при входе';
    const duration = Date.now() - startTime;
    
    // Логируем ошибку входа
    const ipAddress = request.headers.get('x-forwarded-for') || 
                      request.headers.get('x-real-ip') || 
                      'unknown';
    const userAgent = request.headers.get('user-agent') || 'unknown';
    
    await logActivity({
      userId: user?.id,
      userName: user?.name || 'Неизвестный',
      userRole: user?.role,
      action: 'user_login',
      entity: 'user',
      entityId: user?.id,
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
    
    // Обработка ошибок Prisma
    if (error && typeof error === 'object' && 'code' in error) {
      const prismaError = error as { code: string; message: string };
      console.error('Prisma error code:', prismaError.code, 'message:', prismaError.message);
      return NextResponse.json(
        { error: 'Ошибка базы данных. Попробуйте позже.' },
        { status: 500 }
      );
    }
    
    // Обработка ошибок парсинга JSON
    if (error instanceof SyntaxError) {
      return NextResponse.json(
        { error: 'Неверный формат данных' },
        { status: 400 }
      );
    }
    
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}






