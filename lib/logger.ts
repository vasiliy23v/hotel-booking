/**
 * Система логирования действий пользователей
 */

import { prisma } from './prisma';
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
  | 'user_login'
  | 'user_register'
  | 'api_error';

export type LogEntity = 'room' | 'booking' | 'hotel' | 'user' | 'system';
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
  try {
    // Пытаемся записать в БД (если таблица существует)
    try {
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
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (dbError) {
      // Если таблица не существует, логируем в консоль
      console.log('[Activity Log]', JSON.stringify(data, null, 2));
    }
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
  try {
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

    const [logs, total] = await Promise.all([
      prisma.activityLog.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        take: filters.limit || 100,
        skip: filters.offset || 0,
      }),
      prisma.activityLog.count({ where }),
    ]);

    return { logs, total };
  } catch (error) {
    console.error('[Get Logs Error]', error);
    return { logs: [], total: 0 };
  }
}

/**
 * Получить статистику по пользователям
 */
export async function getUserActivityStats(startDate?: Date, endDate?: Date) {
  try {
    const where: Prisma.ActivityLogWhereInput = {};
    
    if (startDate || endDate) {
      where.createdAt = {};
      if (startDate) where.createdAt.gte = startDate;
      if (endDate) where.createdAt.lte = endDate;
    }

    const stats = await prisma.activityLog.groupBy({
      by: ['userName', 'userId', 'userRole'],
      where,
      _count: {
        id: true,
      },
      orderBy: {
        _count: {
          id: 'desc',
        },
      },
    });

    return stats.map(stat => ({
      userName: stat.userName,
      userId: stat.userId,
      userRole: stat.userRole,
      totalActions: stat._count.id,
    }));
  } catch (error) {
    console.error('[Get Stats Error]', error);
    return [];
  }
}

/**
 * Получить логи ошибок
 */
export async function getErrorLogs(limit: number = 50) {
  try {
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




