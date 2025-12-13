import { NextRequest, NextResponse } from 'next/server';
import { getActivityLogs, getUserActivityStats, getErrorLogs } from '@/lib/logger';

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
      action: searchParams.get('action') as any || undefined,
      entity: searchParams.get('entity') as any || undefined,
      status: searchParams.get('status') as any || undefined,
      startDate: searchParams.get('startDate') ? new Date(searchParams.get('startDate')!) : undefined,
      endDate: searchParams.get('endDate') ? new Date(searchParams.get('endDate')!) : undefined,
      limit: searchParams.get('limit') ? parseInt(searchParams.get('limit')!) : 100,
      offset: searchParams.get('offset') ? parseInt(searchParams.get('offset')!) : 0,
    };
    
    const result = await getActivityLogs(filters);
    return NextResponse.json(result);
  } catch (error: any) {
    console.error('[Logs API Error]', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}



