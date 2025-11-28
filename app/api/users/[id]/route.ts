import { NextRequest, NextResponse } from 'next/server';
import { getUserById, updateUser, deleteUser } from '@/lib/db';
import { normalizePhone, isValidPhone } from '@/lib/phone';

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
    
    const { password, ...userWithoutPassword } = user;
    return NextResponse.json(userWithoutPassword);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// PUT /api/users/[id]
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    
    // Получаем текущего пользователя, чтобы проверить, что после обновления останется хотя бы email или телефон
    const currentUser = await getUserById(id);
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
    
    const updatedUser = await updateUser(id, body);
    
    const { password, ...userWithoutPassword } = updatedUser;
    return NextResponse.json(userWithoutPassword);
  } catch (error: any) {
    if (error.message === 'Пользователь не найден') {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }
    return NextResponse.json({ error: error.message }, { status: 500 });
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
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

