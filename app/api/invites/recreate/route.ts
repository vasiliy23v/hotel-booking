import { NextRequest, NextResponse } from 'next/server';
import { getUserById, getUsers, updateUser, getInvites, deleteInvite, createInvite } from '@/lib/db';
import { generateInviteToken, hashInviteToken } from '@/lib/crypto';
import crypto from 'crypto';
import { logActivity } from '@/lib/logger';

// POST /api/invites/recreate - Пересоздать приглашение для имени
export async function POST(request: NextRequest) {
  const startTime = Date.now();
  let newInvite;
  
  try {
    const body = await request.json();
    const { name, expiresInDays = 7, createdBy } = body;
    
    // Получаем IP адрес и User-Agent из запроса
    const ipAddress = request.headers.get('x-forwarded-for') || 
                      request.headers.get('x-real-ip') || 
                      'unknown';
    const userAgent = request.headers.get('user-agent') || 'unknown';
    
    if (!name || !name.trim() || !createdBy) {
      return NextResponse.json(
        { error: 'Необходимо указать имя и создателя приглашения' },
        { status: 400 }
      );
    }
    
    // Проверяем, что создатель существует
    const creator = await getUserById(createdBy);
    if (!creator) {
      return NextResponse.json(
        { error: 'Пользователь-создатель не найден' },
        { status: 404 }
      );
    }
    
    // Получаем все приглашения
    const allInvites = await getInvites();
    
    // Удаляем все старые приглашения для этого имени (неиспользованные)
    const oldInvites = allInvites.filter((inv) => 
      inv.name === name.trim() && !inv.used
    );
    
    for (const oldInvite of oldInvites) {
      await deleteInvite(oldInvite.id);
    }
    
    // Проверяем, существует ли пользователь с таким именем
    const allUsers = await getUsers();
    const existingUser = allUsers.find((u) => u.name?.trim() === name.trim());
    
    // Если пользователь существует - блокируем его старый пароль, чтобы он был вынужден установить новый
    if (existingUser && existingUser.id) {
      // Генерируем случайный пароль, который никто не знает
      // Это заблокирует вход со старым паролем
      const randomPassword = crypto.randomBytes(32).toString('hex');
      await updateUser(existingUser.id, { password: randomPassword });
    }
    
    // Создаем новое приглашение
    const token = generateInviteToken();
    const hashedToken = hashInviteToken(token);
    
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + expiresInDays);
    
    newInvite = await createInvite({
      token: hashedToken,
      createdBy,
      createdAt: new Date().toISOString(),
      expiresAt: expiresAt.toISOString(),
      used: false,
      name: name.trim(),
      usedBy: null,
      usedAt: null
    });
    
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
    
    // Логируем пересоздание приглашения
    const duration = Date.now() - startTime;
    await logActivity({
      userId: createdBy,
      userName: creator.name || 'Неизвестный',
      userRole: creator.role,
      action: 'invite_recreated',
      entity: 'invite',
      entityId: newInvite.id,
      details: {
        name: name.trim(),
        expiresInDays,
        expiresAt: newInvite.expiresAt,
        deletedOldInvites: oldInvites.length,
      },
      status: 'success',
      ipAddress: ipAddress.split(',')[0].trim(),
      userAgent,
      duration,
    }).catch(() => {
      // Тихо игнорируем ошибки логирования
    });
    
    return NextResponse.json({
      id: newInvite.id,
      token,
      inviteUrl: `${baseUrl}/invite/${token}`,
      expiresAt: newInvite.expiresAt,
      name: newInvite.name
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Ошибка при пересоздании приглашения';
    const duration = Date.now() - startTime;
    
    // Логируем ошибку пересоздания приглашения
    const ipAddress = request.headers.get('x-forwarded-for') || 
                      request.headers.get('x-real-ip') || 
                      'unknown';
    const userAgent = request.headers.get('user-agent') || 'unknown';
    
    await logActivity({
      userId: undefined,
      userName: 'Система',
      userRole: undefined,
      action: 'invite_recreated',
      entity: 'invite',
      entityId: newInvite?.id,
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

