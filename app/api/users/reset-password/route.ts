import { NextRequest, NextResponse } from 'next/server';
import { readData, writeData } from '@/lib/data';
import { verifyInviteToken } from '@/lib/crypto';
import type { User, Invite } from '@/types';

// POST /api/users/reset-password - Сброс пароля по токену приглашения
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { inviteToken, password, confirmPassword, name } = body;
    
    // Валидация обязательных полей
    if (!inviteToken || !password || !confirmPassword) {
      return NextResponse.json(
        { error: 'Заполните все обязательные поля' },
        { status: 400 }
      );
    }

    // Проверка совпадения паролей
    if (password !== confirmPassword) {
      return NextResponse.json(
        { error: 'Пароли не совпадают' },
        { status: 400 }
      );
    }

    // Минимальная длина пароля
    if (password.length < 6) {
      return NextResponse.json(
        { error: 'Пароль должен содержать минимум 6 символов' },
        { status: 400 }
      );
    }
    
    const data = readData();
    const invites = data.invites || [];
    
    // Ищем приглашение по токену
    let invite: Invite | undefined;
    for (const inv of invites) {
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
    if (invite.name && name && invite.name.trim() !== name.trim()) {
      return NextResponse.json(
        { error: 'Это приглашение предназначено для другого пользователя' },
        { status: 400 }
      );
    }

    // Ищем пользователя по имени из приглашения
    const userName = invite.name || name;
    if (!userName) {
      return NextResponse.json(
        { error: 'Не указано имя пользователя для сброса пароля' },
        { status: 400 }
      );
    }

    const user = data.users.find((u: User) => u.name?.trim() === userName.trim());
    
    if (!user) {
      return NextResponse.json(
        { error: 'Пользователь с таким именем не найден. Используйте эту ссылку для регистрации.' },
        { status: 404 }
      );
    }

    // Обновляем пароль пользователя
    user.password = password;
    
    // Помечаем приглашение как использованное
    invite.used = true;
    invite.usedBy = user.id;
    invite.usedAt = new Date().toISOString();
    
    writeData(data);
    
    const { password: _, ...userWithoutPassword } = user;
    return NextResponse.json({
      success: true,
      message: 'Пароль успешно изменен',
      user: userWithoutPassword
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

