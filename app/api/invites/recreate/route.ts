import { NextRequest, NextResponse } from 'next/server';
import { readData, writeData } from '@/lib/data';
import { generateInviteToken, hashInviteToken } from '@/lib/crypto';
import crypto from 'crypto';
import type { Invite, User } from '@/types';

// POST /api/invites/recreate - Пересоздать приглашение для имени
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, expiresInDays = 7, createdBy } = body;
    
    if (!name || !name.trim() || !createdBy) {
      return NextResponse.json(
        { error: 'Необходимо указать имя и создателя приглашения' },
        { status: 400 }
      );
    }
    
    const data = readData();
    
    // Проверяем, что создатель существует
    const creator = data.users.find((u: User) => u.id === createdBy);
    if (!creator) {
      return NextResponse.json(
        { error: 'Пользователь-создатель не найден' },
        { status: 404 }
      );
    }
    
    const invites = data.invites || [];
    
    // Удаляем все старые приглашения для этого имени (неиспользованные)
    const oldInvites = invites.filter((inv: Invite) => 
      inv.name === name.trim() && !inv.used
    );
    
    oldInvites.forEach((inv: Invite) => {
      const index = invites.findIndex((i: Invite) => i.id === inv.id);
      if (index !== -1) {
        invites.splice(index, 1);
      }
    });
    
    // Проверяем, существует ли пользователь с таким именем
    const existingUser = data.users.find((u: User) => u.name?.trim() === name.trim());
    
    // Если пользователь существует - блокируем его старый пароль, чтобы он был вынужден установить новый
    if (existingUser) {
      // Генерируем случайный пароль, который никто не знает
      // Это заблокирует вход со старым паролем
      const randomPassword = crypto.randomBytes(32).toString('hex');
      existingUser.password = randomPassword;
    }
    
    // Создаем новое приглашение
    const token = generateInviteToken();
    const hashedToken = hashInviteToken(token);
    
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + expiresInDays);
    
    const newInvite: Invite = {
      id: `invite-${Date.now()}`,
      token: hashedToken,
      createdBy,
      createdAt: new Date().toISOString(),
      expiresAt: expiresAt.toISOString(),
      used: false,
      name: name.trim()
    };
    
    invites.push(newInvite);
    data.invites = invites;
    writeData(data);
    
    return NextResponse.json({
      id: newInvite.id,
      token,
      inviteUrl: `${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/invite/${token}`,
      expiresAt: newInvite.expiresAt,
      name: newInvite.name
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Неизвестная ошибка';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

