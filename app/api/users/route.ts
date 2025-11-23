import { NextRequest, NextResponse } from 'next/server';
import { readData, writeData } from '@/lib/data';
import type { User } from '@/types';

// GET /api/users
export async function GET() {
  try {
    const data = readData();
    // Не возвращаем пароли
    const users = data.users.map(({ password, ...user }: User) => user);
    return NextResponse.json(users);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// POST /api/users
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const data = readData();
    
    // Валидация обязательных полей
    if (!body.email || !body.password || !body.name) {
      return NextResponse.json({ error: 'Заполните все обязательные поля' }, { status: 400 });
    }

    // Очистка телефона от пробелов (если указан)
    if (body.phone) {
      body.phone = body.phone.replace(/\s/g, '');
    }
    
    // Проверка на существующего пользователя
    if (data.users.find((u: User) => u.email === body.email)) {
      return NextResponse.json({ error: 'Пользователь с таким email уже существует' }, { status: 400 });
    }

    const newUser: User = {
      id: `user-${Date.now()}`,
      ...body,
      role: body.role || 'guest'
    };
    
    data.users.push(newUser);
    writeData(data);
    
    const { password, ...userWithoutPassword } = newUser;
    return NextResponse.json(userWithoutPassword);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

