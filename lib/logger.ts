/**
 * Система логирования действий пользователей
 */

import type { Prisma } from './generated/prisma';

export type LogAction = 
  | 'room_created' 
  | 'room_updated' 
  | 'room_deleted'
  | 'booking_created'
  | 'booking_updated'
  | 'booking_cancelled'
  | 'booking_confirmed'
  | 'booking_paid'
  | 'hotel_created'
  | 'hotel_updated'
  | 'hotel_upload'
  | 'user_login'
  | 'user_register'
  | 'user_updated'
  | 'user_password_reset'
  | 'stairs_created'
  | 'stairs_updated'
  | 'invite_created'
  | 'invite_recreated'
  | 'rooms_generated'
  | 'feedback_created'
  | 'email_sent'
  | 'booking_date_range_created'
  | 'booking_date_range_updated'
  | 'registration_token_created'
  | 'data_restored'
  | 'api_error';

export type LogEntity = 'room' | 'booking' | 'hotel' | 'user' | 'system' | 'stairs' | 'invite' | 'feedback' | 'email' | 'booking_date_range' | 'registration_token';
export type LogStatus = 'success' | 'error' | 'warning';

export interface LogData {
  userId?: string;
  userName: string;
  userRole?: string;
  action: LogAction | string;
  entity: LogEntity | string;
  entityId?: string;
  details?: Record<string, unknown>;
  status: LogStatus;
  errorMessage?: string;
  ipAddress?: string;
  userAgent?: string;
  duration?: number;
}

/**
 * Логирование действия пользователя
 */
export async function logActivity(data: LogData): Promise<void> {
  // На клиенте отправляем логи на сервер через API
  if (typeof window !== 'undefined') {
    try {
      // Отправляем асинхронно, не ждем ответа, чтобы не блокировать выполнение
      fetch('/api/logs', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      }).catch((error) => {
        // Тихо игнорируем ошибки отправки логов, чтобы не прерывать работу приложения
        console.warn('[Logger] Failed to send activity log:', error);
      });
    } catch (error) {
      // Тихо игнорируем ошибки, чтобы не прерывать работу приложения
      console.warn('[Logger] Failed to send activity log:', error);
    }
    return;
  }

  // На сервере записываем напрямую в БД
  try {
    // Динамический импорт prisma только на сервере
    const { prisma } = await import('./prisma');
    await prisma.activityLog.create({
      data: {
        userId: data.userId,
        userName: data.userName,
        userRole: data.userRole,
        action: data.action,
        entity: data.entity,
        entityId: data.entityId,
        details: data.details as Prisma.InputJsonValue,
        status: data.status,
        errorMessage: data.errorMessage,
        ipAddress: data.ipAddress,
        userAgent: data.userAgent,
        duration: data.duration,
      },
    });
  } catch (error) {
    // Не прерываем выполнение, если логирование не удалось
    console.error('[Logger Error]', error);
  }
}

/**
 * Получить логи с фильтрацией
 */

export async function getActivityLogs(filters: {
  userId?: string;
  userName?: string;
  action?: LogAction | string;
  entity?: LogEntity | string;
  status?: LogStatus;
  startDate?: Date;
  endDate?: Date;
  limit?: number;
  offset?: number;
}) {
  // Работает только на сервере
  if (typeof window !== 'undefined') {
    return { logs: [], total: 0 };
  }

  try {
    // Динамический импорт prisma только на сервере
    const { prisma } = await import('./prisma');
    
    // Проверяем подключение к БД перед запросом
    console.log('[Get Logs] Prisma client initialized');
    console.log('[Get Logs] DATABASE_URL exists:', !!process.env.DATABASE_URL);
    
    const where: Prisma.ActivityLogWhereInput = {};

    if (filters.userId) where.userId = filters.userId;
    if (filters.userName) where.userName = { contains: filters.userName, mode: 'insensitive' };
    if (filters.action) where.action = filters.action;
    if (filters.entity) where.entity = filters.entity;
    if (filters.status) where.status = filters.status;
    
    if (filters.startDate || filters.endDate) {
      where.createdAt = {};
      if (filters.startDate) where.createdAt.gte = filters.startDate;
      if (filters.endDate) where.createdAt.lte = filters.endDate;
    }

    console.log('[Get Logs] Where clause:', JSON.stringify(where, null, 2));
    console.log('[Get Logs] Limit:', filters.limit || 100, 'Offset:', filters.offset || 0);

    const [logs, total] = await Promise.all([
      prisma.activityLog.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        take: filters.limit || 100,
        skip: filters.offset || 0,
      }),
      prisma.activityLog.count({ where }),
    ]);

    console.log(`[Get Logs] Found ${logs.length} logs, total: ${total}`);
    return { logs, total };
  } catch (error) {
    console.error('[Get Logs Error]', error);
    // Детальное логирование ошибки
    if (error instanceof Error) {
      console.error('[Get Logs Error] Message:', error.message);
      console.error('[Get Logs Error] Stack:', error.stack);
      console.error('[Get Logs Error] Name:', error.name);
    }
    // Проверяем, есть ли DATABASE_URL
    if (!process.env.DATABASE_URL) {
      console.error('[Get Logs Error] DATABASE_URL is not set!');
    }
    // Возвращаем ошибку в специальном формате, чтобы API мог её обработать
    return { logs: [], total: 0, error: error instanceof Error ? error.message : 'Unknown error' };
  }
}

/**
 * Получить статистику по пользователям
 */
export async function getUserActivityStats(startDate?: Date, endDate?: Date) {
  // Работает только на сервере
  if (typeof window !== 'undefined') {
    return [];
  }

  try {
    // Динамический импорт prisma только на сервере
    const { prisma } = await import('./prisma');
    const where: Prisma.ActivityLogWhereInput = {};
    
    if (startDate || endDate) {
      where.createdAt = {};
      if (startDate) where.createdAt.gte = startDate;
      if (endDate) where.createdAt.lte = endDate;
    }

    // Получаем все логи для группировки
    // Используем более надежный подход через findMany и группировку в JavaScript
    const logs = await prisma.activityLog.findMany({
      where,
      select: {
        userName: true,
        userId: true,
        userRole: true,
      },
    });

    // Группируем логи по комбинации userName, userId, userRole
    const statsMap = new Map<string, {
      userName: string;
      userId: string | null;
      userRole: string | null;
      totalActions: number;
    }>();

    logs.forEach((log) => {
      // Создаем уникальный ключ для группировки
      const key = `${log.userName || 'unknown'}_${log.userId || 'null'}_${log.userRole || 'null'}`;
      
      if (statsMap.has(key)) {
        const existing = statsMap.get(key)!;
        existing.totalActions += 1;
      } else {
        statsMap.set(key, {
          userName: log.userName,
          userId: log.userId,
          userRole: log.userRole,
          totalActions: 1,
        });
      }
    });

    // Преобразуем Map в массив и сортируем по количеству действий
    const stats = Array.from(statsMap.values()).sort((a, b) => b.totalActions - a.totalActions);

    return stats;
  } catch (error) {
    console.error('[Get Stats Error]', error);
    // Выводим более детальную информацию об ошибке
    if (error instanceof Error) {
      console.error('[Get Stats Error] Message:', error.message);
      console.error('[Get Stats Error] Stack:', error.stack);
    }
    return [];
  }
}

/**
 * Получить логи ошибок
 */
export async function getErrorLogs(limit: number = 50) {
  // Работает только на сервере
  if (typeof window !== 'undefined') {
    return [];
  }

  try {
    // Динамический импорт prisma только на сервере
    const { prisma } = await import('./prisma');
    return await prisma.activityLog.findMany({
      where: { status: 'error' },
      orderBy: { createdAt: 'desc' },
      take: limit,
    });
  } catch (error) {
    console.error('[Get Error Logs Error]', error);
    return [];
  }
}

/**
 * Wrapper для выполнения действия с автоматическим логированием
 */
export async function withLogging<T>(
  logData: Omit<LogData, 'status' | 'duration' | 'errorMessage'>,
  action: () => Promise<T>
): Promise<T> {
  const startTime = Date.now();
  
  try {
    const result = await action();
    const duration = Date.now() - startTime;
    
    await logActivity({
      ...logData,
      status: 'success',
      duration,
    });
    
    return result;
  } catch (error: unknown) {
    const duration = Date.now() - startTime;
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    
    await logActivity({
      ...logData,
      status: 'error',
      errorMessage,
      duration,
    });
    
    throw error;
  }
}




