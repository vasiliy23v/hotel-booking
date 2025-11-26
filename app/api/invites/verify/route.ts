import { NextRequest, NextResponse } from 'next/server';
import { readData } from '@/lib/data';
import { verifyInviteToken } from '@/lib/crypto';
import type { Invite } from '@/types';

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
    
    const data = readData();
    const invites = data.invites || [];
    
    // Ищем приглашение по токену
    let invite: Invite | undefined;
    for (const inv of invites) {
      try {
        // Проверяем, что токен в базе данных существует и имеет правильный формат
        if (!inv.token || typeof inv.token !== 'string') {
          continue;
        }
        
        if (verifyInviteToken(token, inv.token)) {
          invite = inv;
          break;
        }
      } catch (error) {
        // Продолжаем поиск, если произошла ошибка при проверке
        continue;
      }
    }
    
    if (!invite) {
      return NextResponse.json(
        { error: 'Приглашение не найдено', valid: false },
        { status: 404 }
      );
    }
    
    // Проверяем срок действия
    const now = new Date();
    const expiresAt = new Date(invite.expiresAt);
    
    if (now > expiresAt) {
      return NextResponse.json(
        { error: 'Приглашение истекло', valid: false },
        { status: 400 }
      );
    }
    
    // Проверяем, использовано ли приглашение
    if (invite.used) {
      return NextResponse.json(
        { error: 'Приглашение уже использовано', valid: false },
        { status: 400 }
      );
    }
    
    // Проверяем, существует ли пользователь с таким именем (для определения режима: регистрация или сброс пароля)
    let userExists = false;
    if (invite.name) {
      const user = data.users.find((u: any) => u.name?.trim() === invite.name.trim());
      userExists = !!user;
    }
    
    // Всё в порядке
    return NextResponse.json({
      valid: true,
      invite: {
        id: invite.id,
        name: invite.name,
        expiresAt: invite.expiresAt
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
