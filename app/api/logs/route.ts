import { NextRequest, NextResponse } from 'next/server';
import { getActivityLogs, getUserActivityStats, getErrorLogs } from '@/lib/logger';
import { prisma } from '@/lib/prisma';
import type { Prisma } from '@/lib/generated/prisma';

// POST /api/logs - Сохранить лог активности
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Получаем IP адрес и User-Agent из запроса
    const ipAddress = request.headers.get('x-forwarded-for') || 
                      request.headers.get('x-real-ip') || 
                      'unknown';
    const userAgent = request.headers.get('user-agent') || 'unknown';
    
    await prisma.activityLog.create({
      data: {
        userId: body.userId || null,
        userName: body.userName,
        userRole: body.userRole || null,
        action: body.action,
        entity: body.entity,
        entityId: body.entityId || null,
        details: body.details ? (body.details as Prisma.InputJsonValue) : undefined,
        status: body.status,
        errorMessage: body.errorMessage || null,
        ipAddress: ipAddress.split(',')[0].trim(), // Берем первый IP из цепочки
        userAgent,
        duration: body.duration || null,
      },
    });
    
    return NextResponse.json({ success: true });
  } catch (error: unknown) {
    console.error('[Logs API POST Error]', error);
    const errorMessage = error instanceof Error ? error.message : 'Неизвестная ошибка';
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}

// GET /api/logs - Получить логи с фильтрацией
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    
    const type = searchParams.get('type'); // 'all', 'errors', 'stats'
    
    if (type === 'stats') {
      // Статистика по пользователям
      const startDate = searchParams.get('startDate') ? new Date(searchParams.get('startDate')!) : undefined;
      const endDate = searchParams.get('endDate') ? new Date(searchParams.get('endDate')!) : undefined;
      
      const stats = await getUserActivityStats(startDate, endDate);
      return NextResponse.json({ stats });
    }
    
    if (type === 'errors') {
      // Только ошибки
      const limit = searchParams.get('limit') ? parseInt(searchParams.get('limit')!) : 50;
      const errors = await getErrorLogs(limit);
      return NextResponse.json({ logs: errors, total: errors.length });
    }
    
    // Все логи с фильтрацией
    const filters = {
      userId: searchParams.get('userId') || undefined,
      userName: searchParams.get('userName') || undefined,
      action: searchParams.get('action') || undefined,
      entity: searchParams.get('entity') || undefined,
      status: searchParams.get('status') as 'success' | 'error' | 'warning' | undefined,
      startDate: searchParams.get('startDate') ? new Date(searchParams.get('startDate')!) : undefined,
      endDate: searchParams.get('endDate') ? new Date(searchParams.get('endDate')!) : undefined,
      limit: searchParams.get('limit') ? parseInt(searchParams.get('limit')!) : 100,
      offset: searchParams.get('offset') ? parseInt(searchParams.get('offset')!) : 0,
    };
    
    const result = await getActivityLogs(filters);
    return NextResponse.json(result);
  } catch (error: unknown) {
    console.error('[Logs API Error]', error);
    const errorMessage = error instanceof Error ? error.message : 'Неизвестная ошибка';
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}

// DELETE /api/logs - Удалить лог(и)
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    const ids = searchParams.get('ids'); // Для массового удаления
    
    if (!id && !ids) {
      return NextResponse.json({ error: 'ID лога(ов) не указан(ы)' }, { status: 400 });
    }
    
    const { prisma } = await import('@/lib/prisma');
    
    // Массовое удаление
    if (ids) {
      const idsArray = ids.split(',').filter(Boolean);
      if (idsArray.length === 0) {
        return NextResponse.json({ error: 'Список ID пуст' }, { status: 400 });
      }
      
      await prisma.activityLog.deleteMany({
        where: {
          id: {
            in: idsArray,
          },
        },
      });
      
      return NextResponse.json({ success: true, deleted: idsArray.length });
    }
    
    // Удаление одного лога
    await prisma.activityLog.delete({
      where: { id: id || undefined },
    });
    
    return NextResponse.json({ success: true });
  } catch (error: unknown) {
    console.error('[Logs API DELETE Error]', error);
    const errorMessage = error instanceof Error ? error.message : 'Неизвестная ошибка';
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}




