import { NextRequest, NextResponse } from 'next/server';
import { readData } from '@/lib/data';
import type { User } from '@/types';

// POST /api/auth/login
export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json();
    const data = readData();
    const user = data.users.find((u: User) => u.email === email && u.password === password);
    
    if (!user) {
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
    }
    
    const { password: _, ...userWithoutPassword } = user;
    return NextResponse.json(userWithoutPassword);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}






