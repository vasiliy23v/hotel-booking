import { NextRequest, NextResponse } from 'next/server';
import { getUsers, createUser, getUserByEmail, getUserByPhone, getUserByEmailOrPhone, updateInvite } from '@/lib/db';
import { prisma } from '@/lib/prisma';
import { verifyInviteToken } from '@/lib/crypto';
import { normalizePhone, isValidEmail, isValidPhone } from '@/lib/phone';
import type { User } from '@/types';

// GET /api/users
export async function GET() {
  try {
    // getUsers() уже возвращает пользователей без паролей
    const users = await getUsers();
    return NextResponse.json(users);
  } catch (error: unknown) {
    console.error('Error in GET /api/users:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}

// POST /api/users
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { inviteToken, directCreate, ...userData } = body;
    
    // Если directCreate = true, создаем пользователя напрямую (только для менеджеров)
    if (directCreate) {
      // Валидация обязательных полей
      if (!userData.name) {
        return NextResponse.json(
          { error: 'Имя пользователя обязательно' },
          { status: 400 }
        );
      }

      // Телефон обязателен
      if (!userData.phone) {
        return NextResponse.json(
          { error: 'Телефон обязателен' },
          { status: 400 }
        );
      }

      // Валидация email (если указан)
      if (userData.email && !isValidEmail(userData.email)) {
        return NextResponse.json(
          { error: 'Неверный формат email' },
          { status: 400 }
        );
      }

      // Нормализация и валидация телефона (обязателен)
      if (!userData.phone) {
        return NextResponse.json(
          { error: 'Телефон обязателен' },
          { status: 400 }
        );
      }
      
      const normalizedPhone = normalizePhone(userData.phone);
      if (!normalizedPhone || !isValidPhone(normalizedPhone)) {
        return NextResponse.json(
          { error: 'Неверный формат телефона' },
          { status: 400 }
        );
      }
      userData.phone = normalizedPhone;
      
      // Проверка на существующего пользователя по email
      if (userData.email) {
        const existingUserByEmail = await getUserByEmail(userData.email);
        if (existingUserByEmail) {
          return NextResponse.json(
            { error: 'Пользователь с таким email уже существует' },
            { status: 400 }
          );
        }
      }

      // Проверка на существующего пользователя по телефону
      if (userData.phone) {
        const existingUserByPhone = await getUserByPhone(userData.phone);
        if (existingUserByPhone) {
          return NextResponse.json(
            { error: 'Пользователь с таким телефоном уже существует' },
            { status: 400 }
          );
        }
      }

      // Создаем нового пользователя напрямую
      const newUser = await createUser({
        ...userData,
        role: userData.role || 'guest',
        password: userData.password || undefined, // Пароль опционален при прямом создании
      });
      
      const { password, ...userWithoutPassword } = newUser;
      return NextResponse.json(userWithoutPassword);
    }
    
    // ОБЫЧНЫЙ ПУТЬ: ОБЯЗАТЕЛЬНАЯ проверка токена приглашения
    if (!inviteToken) {
      return NextResponse.json(
        { error: 'Токен приглашения обязателен для регистрации' },
        { status: 400 }
      );
    }
    
    // Ищем приглашение по токену в БД через Prisma
    // Нужно проверить все приглашения, так как токен хэширован
    // Получаем полные данные приглашений с токенами для проверки
    const invitesWithTokens = await prisma.invite.findMany({
      select: {
        id: true,
        token: true,
        createdBy: true,
        createdAt: true,
        expiresAt: true,
        used: true,
        name: true,
        usedBy: true,
        usedAt: true,
      },
    });
    
    // Проверяем каждый токен приглашения
    let invite = null;
    for (const inv of invitesWithTokens) {
      try {
        if (verifyInviteToken(inviteToken, inv.token)) {
          invite = inv;
          break;
        }
      } catch {
        continue;
      }
    }
    
    if (!invite) {
      return NextResponse.json(
        { error: 'Недействительный токен приглашения' },
        { status: 400 }
      );
    }
    
    // Проверяем срок действия
    const now = new Date();
    const expiresAt = new Date(invite.expiresAt);
    if (now > expiresAt) {
      return NextResponse.json(
        { error: 'Приглашение истекло' },
        { status: 400 }
      );
    }
    
    // Проверяем, использовано ли приглашение
    if (invite.used) {
      return NextResponse.json(
        { error: 'Приглашение уже использовано' },
        { status: 400 }
      );
    }
    
    // Если приглашение привязано к имени, проверяем соответствие
    if (invite.name && userData.name && invite.name.trim() !== userData.name.trim()) {
      return NextResponse.json(
        { error: 'Это приглашение предназначено для другого пользователя' },
        { status: 400 }
      );
    }
    
    // Валидация обязательных полей
    if (!userData.password || !userData.name) {
      return NextResponse.json(
        { error: 'Заполните все обязательные поля (имя и пароль)' },
        { status: 400 }
      );
    }

    // Телефон обязателен
    if (!userData.phone) {
      return NextResponse.json(
        { error: 'Телефон обязателен' },
        { status: 400 }
      );
    }

    // Валидация email (если указан)
    if (userData.email && !isValidEmail(userData.email)) {
      return NextResponse.json(
        { error: 'Неверный формат email' },
        { status: 400 }
      );
    }

    // Нормализация и валидация телефона (обязателен)
    if (!userData.phone) {
      return NextResponse.json(
        { error: 'Телефон обязателен' },
        { status: 400 }
      );
    }
    
    const normalizedPhone = normalizePhone(userData.phone);
    if (!normalizedPhone || !isValidPhone(normalizedPhone)) {
      return NextResponse.json(
        { error: 'Неверный формат телефона' },
        { status: 400 }
      );
    }
    userData.phone = normalizedPhone;
    
    // Проверка на существующего пользователя по email
    if (userData.email) {
      const existingUserByEmail = await getUserByEmail(userData.email);
      if (existingUserByEmail) {
        return NextResponse.json(
          { error: 'Пользователь с таким email уже существует' },
          { status: 400 }
        );
      }
    }

    // Проверка на существующего пользователя по телефону
    if (userData.phone) {
      const existingUserByPhone = await getUserByPhone(userData.phone);
      if (existingUserByPhone) {
        return NextResponse.json(
          { error: 'Пользователь с таким телефоном уже существует' },
          { status: 400 }
        );
      }
    }

    // Создаем нового пользователя
    const newUser = await createUser({
      ...userData,
      role: userData.role || 'guest'
    });
    
    // Помечаем приглашение как использованное
    // Преобразуем данные приглашения из БД формата
    const inviteId = invite.id;
    await updateInvite(inviteId, {
      used: true,
      usedBy: newUser.id,
      usedAt: new Date().toISOString(),
    });
    
    const { password, ...userWithoutPassword } = newUser;
    return NextResponse.json(userWithoutPassword);
  } catch (error: unknown) {
    console.error('Error in POST /api/users:', error);
    
    // Обработка ошибок Prisma
    if (error && typeof error === 'object' && 'code' in error) {
      const prismaError = error as { code: string; message: string };
      console.error('Prisma error code:', prismaError.code, 'message:', prismaError.message);
      
      if (prismaError.code === 'P2002') {
        return NextResponse.json(
          { error: 'Пользователь с таким email или телефоном уже существует' },
          { status: 400 }
        );
      }
      
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
    
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}

