import { NextRequest, NextResponse } from 'next/server';
import { getUserById, updateUser, deleteUser } from '@/lib/db';
import { normalizePhone, isValidPhone } from '@/lib/phone';
import { logActivity } from '@/lib/logger';

// GET /api/users/[id]
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const user = await getUserById(id);
    
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }
    
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password: _password, ...userWithoutPassword } = user;
    return NextResponse.json(userWithoutPassword);
  } catch (error: unknown) {
    console.error('Error in GET /api/users/[id]:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}

// PUT /api/users/[id]
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const startTime = Date.now();
  let updatedUser;
  let currentUser;
  
  try {
    const { id } = await params;
    const body = await request.json();
    
    // Получаем IP адрес и User-Agent из запроса
    const ipAddress = request.headers.get('x-forwarded-for') || 
                      request.headers.get('x-real-ip') || 
                      'unknown';
    const userAgent = request.headers.get('user-agent') || 'unknown';
    
    // Получаем текущего пользователя, чтобы проверить, что после обновления останется хотя бы email или телефон
    currentUser = await getUserById(id);
    if (!currentUser) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }
    
    // Определяем, какое значение телефона будет после обновления
    const finalPhone = body.phone !== undefined ? (body.phone || null) : currentUser.phone;
    
    // Проверяем, что телефон будет заполнен (телефон обязателен)
    if (!finalPhone) {
      return NextResponse.json(
        { error: 'Телефон обязателен' },
        { status: 400 }
      );
    }
    
    // Валидация email (если указан)
    if (body.email && body.email.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(body.email.trim())) {
      return NextResponse.json(
        { error: 'Неверный формат email' },
        { status: 400 }
      );
    }
    
    // Валидация и нормализация телефона (если указан)
    if (body.phone !== undefined && body.phone && body.phone.trim()) {
      const normalizedPhone = normalizePhone(body.phone.trim());
      if (!normalizedPhone || !isValidPhone(normalizedPhone)) {
        return NextResponse.json(
          { error: 'Неверный формат телефона' },
          { status: 400 }
        );
      }
      body.phone = normalizedPhone;
    }
    
    updatedUser = await updateUser(id, body);
    
    // Логируем обновление пользователя
    const duration = Date.now() - startTime;
    await logActivity({
      userId: undefined, // Будет заполнено на клиенте
      userName: updatedUser.name || 'Неизвестный',
      userRole: updatedUser.role,
      action: 'user_updated',
      entity: 'user',
      entityId: updatedUser.id,
      details: {
        email: updatedUser.email,
        phone: updatedUser.phone,
        role: updatedUser.role,
        changes: {
          name: currentUser?.name !== updatedUser.name ? { from: currentUser?.name, to: updatedUser.name } : undefined,
          email: currentUser?.email !== updatedUser.email ? { from: currentUser?.email, to: updatedUser.email } : undefined,
          phone: currentUser?.phone !== updatedUser.phone ? { from: currentUser?.phone, to: updatedUser.phone } : undefined,
          role: currentUser?.role !== updatedUser.role ? { from: currentUser?.role, to: updatedUser.role } : undefined,
        },
      },
      status: 'success',
      ipAddress: ipAddress.split(',')[0].trim(),
      userAgent,
      duration,
    }).catch(() => {
      // Тихо игнорируем ошибки логирования
    });
    
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password: _password, ...userWithoutPassword } = updatedUser;
    return NextResponse.json(userWithoutPassword);
  } catch (error: unknown) {
    console.error('Error in PUT /api/users/[id]:', error);
    const errorMessage = error instanceof Error ? error.message : 'Ошибка при обновлении пользователя';
    const duration = Date.now() - startTime;
    
    // Логируем ошибку обновления пользователя
    const ipAddress = request.headers.get('x-forwarded-for') || 
                      request.headers.get('x-real-ip') || 
                      'unknown';
    const userAgent = request.headers.get('user-agent') || 'unknown';
    
    await logActivity({
      userId: undefined,
      userName: 'Система',
      userRole: undefined,
      action: 'user_updated',
      entity: 'user',
      entityId: (await params).id,
      details: {
        error: errorMessage,
        currentUser: currentUser ? {
          name: currentUser.name,
          email: currentUser.email,
        } : undefined,
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
      if (prismaError.code === 'P2025') {
        return NextResponse.json({ error: 'User not found' }, { status: 404 });
      }
      if (prismaError.code === 'P2002') {
        return NextResponse.json(
          { error: 'Пользователь с таким email или телефоном уже существует' },
          { status: 400 }
        );
      }
    }
    
    if (error instanceof Error) {
      if (error.message === 'Пользователь не найден') {
        return NextResponse.json({ error: 'User not found' }, { status: 404 });
      }
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    
    return NextResponse.json({ error: 'Unknown error' }, { status: 500 });
  }
}

// DELETE /api/users/[id]
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    await deleteUser(id);
    
    return NextResponse.json({ success: true });
  } catch (error: unknown) {
    console.error('Error in DELETE /api/users/[id]:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}

