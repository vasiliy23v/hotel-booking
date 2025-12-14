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
    // Декодируем URL параметры для корректной обработки кириллицы и спецсимволов
    const filters = {
      userId: searchParams.get('userId') ? decodeURIComponent(searchParams.get('userId')!) : undefined,
      userName: searchParams.get('userName') ? decodeURIComponent(searchParams.get('userName')!) : undefined,
      action: searchParams.get('action') ? decodeURIComponent(searchParams.get('action')!) : undefined,
      entity: searchParams.get('entity') ? decodeURIComponent(searchParams.get('entity')!) : undefined,
      status: searchParams.get('status') as 'success' | 'error' | 'warning' | undefined,
      startDate: searchParams.get('startDate') ? new Date(searchParams.get('startDate')!) : undefined,
      endDate: searchParams.get('endDate') ? new Date(searchParams.get('endDate')!) : undefined,
      limit: searchParams.get('limit') ? parseInt(searchParams.get('limit')!) : 100,
      offset: searchParams.get('offset') ? parseInt(searchParams.get('offset')!) : 0,
    };
    
    console.log('[Logs API] Filters:', JSON.stringify(filters, null, 2));
    console.log('[Logs API] DATABASE_URL exists:', !!process.env.DATABASE_URL);
    console.log('[Logs API] NODE_ENV:', process.env.NODE_ENV);
    
    const result = await getActivityLogs(filters);
    
    console.log('[Logs API] Result:', { logsCount: result.logs.length, total: result.total });
    
    // Если в результате есть ошибка, логируем её и возвращаем с информацией об ошибке
    if ('error' in result && result.error) {
      console.error('[Logs API] Error in getActivityLogs:', result.error);
      
      // Проверяем, является ли ошибка проблемой отсутствующей таблицы
      const isTableMissing = result.error.includes('does not exist') || 
                             result.error.includes('activity_logs');
      
      return NextResponse.json({ 
        logs: [],
        total: 0,
        error: result.error,
        message: isTableMissing 
          ? 'Таблица activity_logs не существует. Необходимо применить миграцию: prisma/migrations/add_activity_logs.sql'
          : undefined,
        debug: {
          hasDatabaseUrl: !!process.env.DATABASE_URL,
          nodeEnv: process.env.NODE_ENV,
          isTableMissing,
        }
      }, { status: 500 });
    }
    
    // Если результат пустой, но мы ожидаем данные, проверяем подключение к БД
    // На продакшене не возвращаем нефильтрованные данные автоматически - это может быть проблемой безопасности
    if (result.logs.length === 0 && result.total === 0) {
      try {
        // Пробуем простой запрос для проверки подключения
        const testCount = await prisma.activityLog.count();
        console.log('[Logs API] Test query - total logs in DB:', testCount);
        
        // Если в БД есть логи, но запрос вернул пустой результат, логируем предупреждение
        if (testCount > 0) {
          console.warn('[Logs API] WARNING: DB has logs but filtered query returned empty.');
          console.warn('[Logs API] Applied filters:', JSON.stringify(filters, null, 2));
          console.warn('[Logs API] This might indicate that filters are too restrictive or there is a mismatch in filter values.');
          
          // В режиме разработки можем вернуть нефильтрованные данные для отладки
          // На продакшене просто возвращаем пустой результат с предупреждением
          if (process.env.NODE_ENV === 'development') {
            console.warn('[Logs API] Development mode: Trying query without filters for debugging...');
            const unfilteredResult = await getActivityLogs({ limit: 10, offset: 0 });
            console.log('[Logs API] Unfiltered query result:', { logsCount: unfilteredResult.logs.length, total: unfilteredResult.total });
            
            if (unfilteredResult.logs.length > 0) {
              console.warn('[Logs API] Filters are too restrictive. In development mode, returning unfiltered result for debugging.');
              return NextResponse.json({
                ...unfilteredResult,
                warning: 'Filters returned no results. Showing unfiltered data for debugging purposes only.',
                appliedFilters: filters
              });
            }
          }
        } else {
          console.log('[Logs API] Database is empty - no logs found');
        }
      } catch (dbError) {
        console.error('[Logs API] Database connection test failed:', dbError);
        if (dbError instanceof Error) {
          console.error('[Logs API] DB Error message:', dbError.message);
          console.error('[Logs API] DB Error stack:', dbError.stack);
        }
        // Возвращаем ошибку вместо пустого результата
        return NextResponse.json({ 
          error: 'Database connection error', 
          message: dbError instanceof Error ? dbError.message : 'Unknown error',
          logs: [],
          total: 0,
          debug: {
            hasDatabaseUrl: !!process.env.DATABASE_URL,
            nodeEnv: process.env.NODE_ENV,
          }
        }, { status: 500 });
      }
    }
    
    return NextResponse.json(result);
  } catch (error: unknown) {
    console.error('[Logs API Error]', error);
    const errorMessage = error instanceof Error ? error.message : 'Неизвестная ошибка';
    // Детальное логирование для отладки
    if (error instanceof Error) {
      console.error('[Logs API Error] Stack:', error.stack);
    }
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




