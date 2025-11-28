import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/neon';
import { getUsers } from '@/lib/db';
import { verifyInviteToken } from '@/lib/crypto';

// GET /api/invites/verify?token=xxx - Проверить токен приглашения
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const token = searchParams.get('token');
    
    if (!token) {
      return NextResponse.json(
        { error: 'Токен не предоставлен', valid: false },
        { status: 400 }
      );
    }
    
    // Получаем все приглашения из БД
    const invites = await query<any>(`SELECT * FROM invites`);
    
    // Ищем приглашение по токену
    let invite: any = undefined;
    for (const inv of invites) {
      try {
        // Проверяем, что токен в базе данных существует и имеет правильный формат
        if (!inv.token || typeof inv.token !== 'string') {
          continue;
        }
        
        // Проверяем токен
        const isValid = verifyInviteToken(token, inv.token);
        if (isValid) {
          invite = inv;
          break;
        }
      } catch (error) {
        // Продолжаем поиск, если произошла ошибка при проверке
        continue;
      }
    }
    
    if (!invite) {
      // Логируем для отладки (только в development)
      if (process.env.NODE_ENV === 'development') {
        console.log('Токен не найден. Всего приглашений:', invites.length);
        console.log('Искомый токен:', token?.substring(0, 20) + '...');
      }
      return NextResponse.json(
        { error: 'Приглашение не найдено', valid: false },
        { status: 404 }
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
        { error: 'Приглашение истекло', valid: false },
        { status: 400 }
      );
    }
    
    // Проверяем, использовано ли приглашение
    if (inviteUsed) {
      return NextResponse.json(
        { error: 'Приглашение уже использовано', valid: false },
        { status: 400 }
      );
    }
    
    // Проверяем, существует ли пользователь с таким именем (для определения режима: регистрация или сброс пароля)
    let userExists = false;
    if (inviteName) {
      const allUsers = await getUsers();
      const user = allUsers.find((u) => u.name?.trim() === inviteName.trim());
      userExists = !!user;
    }
    
    // Всё в порядке
    return NextResponse.json({
      valid: true,
      invite: {
        id: invite.id,
        name: inviteName,
        expiresAt: expiresAt.toISOString()
      },
      userExists // Информация о том, существует ли пользователь (для определения режима)
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message, valid: false },
      { status: 500 }
    );
  }
}
