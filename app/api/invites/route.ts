import { NextRequest, NextResponse } from 'next/server';
import { readData, writeData } from '@/lib/data';
import { generateInviteToken, hashInviteToken } from '@/lib/crypto';
import crypto from 'crypto';
import type { Invite, User } from '@/types';

// GET /api/invites - Получить все приглашения (для админов)
export async function GET() {
  try {
    const data = readData();
    const invites = data.invites || [];
    
    // Не возвращаем хэшированные токены, только метаданные
    const safeInvites = invites.map((invite: Invite) => ({
      id: invite.id,
      createdBy: invite.createdBy,
      createdAt: invite.createdAt,
      expiresAt: invite.expiresAt,
      used: invite.used,
      name: invite.name,
      usedBy: invite.usedBy,
      usedAt: invite.usedAt
    }));
    
    return NextResponse.json(safeInvites);
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Неизвестная ошибка';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

// POST /api/invites - Создать новое приглашение
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, expiresInDays = 7, createdBy } = body;
    
    if (!createdBy) {
      return NextResponse.json(
        { error: 'Необходимо указать создателя приглашения' },
        { status: 400 }
      );
    }
    
    // name опционален - если не указан, создается открытое приглашение
    const inviteName = name?.trim() || '';
    
    const data = readData();
    
    // Проверяем, что создатель существует
    const creator = data.users.find((u: User) => u.id === createdBy);
    if (!creator) {
      return NextResponse.json(
        { error: 'Пользователь-создатель не найден' },
        { status: 404 }
      );
    }
    
    // Проверяем, существует ли пользователь с таким именем
    // Если существует - блокируем его старый пароль, чтобы он был вынужден установить новый
    if (inviteName) {
      const existingUser = data.users.find((u: User) => u.name?.trim() === inviteName);
      
      if (existingUser) {
        // Генерируем случайный пароль, который никто не знает
        // Это заблокирует вход со старым паролем
        const randomPassword = crypto.randomBytes(32).toString('hex');
        existingUser.password = randomPassword;
      }
    }
    
    // Генерируем токен
    const token = generateInviteToken();
    const hashedToken = hashInviteToken(token);
    
    // Вычисляем дату истечения
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + expiresInDays);
    
    const newInvite: Invite = {
      id: `invite-${Date.now()}`,
      token: hashedToken,
      createdBy,
      createdAt: new Date().toISOString(),
      expiresAt: expiresAt.toISOString(),
      used: false,
      name: inviteName
    };
    
    if (!data.invites) {
      data.invites = [];
    }
    
    data.invites.push(newInvite);
    writeData(data);
    
    // Получаем текущий домен из запроса
    // Используем заголовки для определения реального домена
    const host = request.headers.get('host') || request.headers.get('x-forwarded-host');
    const protocol = request.headers.get('x-forwarded-proto') || 
                     (request.url.startsWith('https') ? 'https' : 'http');
    
    let baseUrl = process.env.NEXT_PUBLIC_BASE_URL;
    if (!baseUrl && host) {
      baseUrl = `${protocol}://${host}`;
    }
    if (!baseUrl) {
      // Fallback на origin из URL
      const origin = new URL(request.url).origin;
      baseUrl = origin;
    }
    
    // Возвращаем токен только один раз при создании
    return NextResponse.json({
      id: newInvite.id,
      token, // Возвращаем незахэшированный токен для отправки пользователю
      inviteUrl: `${baseUrl}/invite/${token}`,
      expiresAt: newInvite.expiresAt,
      name: newInvite.name
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Неизвестная ошибка';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

// DELETE /api/invites?id=xxx - Удалить приглашение
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    
    if (!id) {
      return NextResponse.json(
        { error: 'ID приглашения не указан' },
        { status: 400 }
      );
    }
    
    const data = readData();
    const invites = data.invites || [];
    
    const inviteIndex = invites.findIndex((inv: Invite) => inv.id === id);
    if (inviteIndex === -1) {
      return NextResponse.json(
        { error: 'Приглашение не найдено' },
        { status: 404 }
      );
    }
    
    // Удаляем приглашение
    invites.splice(inviteIndex, 1);
    data.invites = invites;
    writeData(data);
    
    return NextResponse.json({ success: true });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Неизвестная ошибка';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
