import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/neon';
import { getUsers, updateUser, updateInvite, getUserById } from '@/lib/db';
import { verifyInviteToken } from '@/lib/crypto';

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
    
    // Получаем все приглашения из БД
    const invites = await query<{
      id: string;
      token: string;
      expires_at: string;
      name: string;
      used: boolean;
    }>(`SELECT * FROM invites`);
    
    // Ищем приглашение по токену
    let invite: (typeof invites)[0] | undefined = undefined;
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
    
    // Преобразуем данные приглашения из БД формата
    const expiresAt = new Date(invite.expires_at);
    const inviteName = invite.name;
    const inviteUsed = invite.used;
    
    // Проверяем срок действия
    const now = new Date();
    if (now > expiresAt) {
      return NextResponse.json(
        { error: 'Приглашение истекло' },
        { status: 400 }
      );
    }
    
    // Проверяем, использовано ли приглашение
    if (inviteUsed) {
      return NextResponse.json(
        { error: 'Приглашение уже использовано' },
        { status: 400 }
      );
    }
    
    // Если приглашение привязано к имени, проверяем соответствие
    if (inviteName && name && inviteName.trim() !== name.trim()) {
      return NextResponse.json(
        { error: 'Это приглашение предназначено для другого пользователя' },
        { status: 400 }
      );
    }

    // Ищем пользователя по имени из приглашения
    const userName = inviteName || name;
    if (!userName) {
      return NextResponse.json(
        { error: 'Не указано имя пользователя для сброса пароля' },
        { status: 400 }
      );
    }

    const allUsers = await getUsers();
    const user = allUsers.find((u) => u.name?.trim() === userName.trim());
    
    if (!user || !user.id) {
      return NextResponse.json(
        { error: 'Пользователь с таким именем не найден. Используйте эту ссылку для регистрации.' },
        { status: 404 }
      );
    }

    // Обновляем пароль пользователя
    await updateUser(user.id, { password });
    
    // Помечаем приглашение как использованное
    await updateInvite(invite.id, {
      used: true,
      usedBy: user.id,
      usedAt: new Date().toISOString(),
    });
    
    // Получаем обновленного пользователя без пароля
    const updatedUser = await getUserById(user.id);
    if (updatedUser) {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { password, ...userWithoutPassword } = updatedUser;
      return NextResponse.json({
        success: true,
        message: 'Пароль успешно изменен',
        user: userWithoutPassword
      });
    }
    
    // Fallback - возвращаем пользователя без пароля
    return NextResponse.json({
      success: true,
      message: 'Пароль успешно изменен',
      user: { ...user }
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Неизвестная ошибка';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}




