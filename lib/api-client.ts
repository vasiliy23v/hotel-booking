/**
 * Клиент для API запросов с retry логикой, логированием и тостерами
 */

import { toast } from 'sonner';
import { logActivity } from './logger';

export interface ApiClientOptions {
  retries?: number;
  retryDelay?: number;
  timeout?: number;
  showSuccessToast?: boolean;
  showErrorToast?: boolean;
  successMessage?: string;
  errorMessage?: string;
  logAction?: boolean;
  userId?: string;
  userName?: string;
  userRole?: string;
  headers?: HeadersInit;
}

const DEFAULT_OPTIONS: ApiClientOptions = {
  retries: 3,
  retryDelay: 1000,
  timeout: 30000,
  showSuccessToast: false,
  showErrorToast: true,
  logAction: true,
};

/**
 * Задержка
 */
function delay(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * Определение типа действия и сущности по URL
 */
function parseAction(method: string, url: string): { action: string; entity: string } {
  const path = url.split('?')[0];
  
  // Комнаты
  if (path.includes('/api/rooms')) {
    if (method === 'POST') return { action: 'room_created', entity: 'room' };
    if (method === 'PUT') return { action: 'room_updated', entity: 'room' };
    if (method === 'DELETE') return { action: 'room_deleted', entity: 'room' };
    return { action: 'room_fetched', entity: 'room' };
  }
  
  // Бронирования
  if (path.includes('/api/bookings')) {
    if (method === 'POST') return { action: 'booking_created', entity: 'booking' };
    if (method === 'PUT') return { action: 'booking_updated', entity: 'booking' };
    if (method === 'DELETE') return { action: 'booking_cancelled', entity: 'booking' };
    return { action: 'booking_fetched', entity: 'booking' };
  }
  
  // Отели
  if (path.includes('/api/hotels')) {
    if (method === 'POST') return { action: 'hotel_created', entity: 'hotel' };
    if (method === 'PUT') return { action: 'hotel_updated', entity: 'hotel' };
    return { action: 'hotel_fetched', entity: 'hotel' };
  }
  
  return { action: 'api_request', entity: 'system' };
}

/**
 * API запрос с retry логикой
 */
export async function apiRequest<T = unknown>(
  url: string,
  options: RequestInit & ApiClientOptions = {}
): Promise<T> {
  const {
    retries = DEFAULT_OPTIONS.retries!,
    retryDelay = DEFAULT_OPTIONS.retryDelay!,
    timeout = DEFAULT_OPTIONS.timeout!,
    showSuccessToast = DEFAULT_OPTIONS.showSuccessToast!,
    showErrorToast = DEFAULT_OPTIONS.showErrorToast!,
    successMessage,
    errorMessage,
    logAction = DEFAULT_OPTIONS.logAction!,
    userId,
    userName = 'Неизвестный',
    userRole,
    ...fetchOptions
  } = options;

  const method = fetchOptions.method || 'GET';
  const startTime = Date.now();
  let lastError: Error | null = null;
  
  const toastId = toast.loading(`Выполняется запрос...`);

  for (let attempt = 0; attempt <= retries; attempt++) {
    try {
      // Создаем контроллер для таймаута
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), timeout);

      const response = await fetch(url, {
        ...fetchOptions,
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `HTTP ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      const duration = Date.now() - startTime;

      // Успешный запрос
      if (showSuccessToast) {
        toast.success(successMessage || 'Операция выполнена успешно', { id: toastId });
      } else {
        toast.dismiss(toastId);
      }

      // Логирование успешного запроса
      if (logAction) {
        const { action, entity } = parseAction(method, url);
        const dataWithId = data as { id?: string } | null;
        await logActivity({
          userId,
          userName,
          userRole,
          action,
          entity,
          entityId: dataWithId?.id,
          details: {
            url,
            method,
            attempt: attempt + 1,
          },
          status: 'success',
          duration,
        });
      }

      return data;
    } catch (error: unknown) {
      const errorObj = error instanceof Error ? error : new Error(String(error));
      lastError = errorObj;
      const isLastAttempt = attempt === retries;
      
      // Если это не последняя попытка и ошибка не связана с отменой
      if (!isLastAttempt && errorObj.name !== 'AbortError') {
        console.warn(`Попытка ${attempt + 1}/${retries + 1} не удалась. Повтор через ${retryDelay}мс...`, errorObj.message);
        await delay(retryDelay * (attempt + 1)); // Увеличиваем задержку с каждой попыткой
        continue;
      }

      // Последняя попытка - показываем ошибку
      const duration = Date.now() - startTime;
      const errorMsg = errorObj.message || 'Неизвестная ошибка';
      
      if (showErrorToast) {
        toast.error(errorMessage || `Ошибка: ${errorMsg}`, { id: toastId });
      } else {
        toast.dismiss(toastId);
      }

      // Логирование ошибки
      if (logAction) {
        const { action, entity } = parseAction(method, url);
        await logActivity({
          userId,
          userName,
          userRole,
          action,
          entity,
          details: {
            url,
            method,
            attempts: attempt + 1,
          },
          status: 'error',
          errorMessage: errorMsg,
          duration,
        });
      }

      throw errorObj;
    }
  }

  throw lastError || new Error('Запрос не удался');
}

/**
 * Утилиты для конкретных методов
 */
export const api = {
  get: <T = unknown>(url: string, options?: ApiClientOptions) =>
    apiRequest<T>(url, { ...options, method: 'GET' }),

  post: <T = unknown>(url: string, data?: unknown, options?: ApiClientOptions) => {
    const { headers, ...restOptions } = options || {};
    return apiRequest<T>(url, {
      ...restOptions,
      method: 'POST',
      headers: { 'Content-Type': 'application/json', ...headers },
      body: JSON.stringify(data),
    });
  },

  put: <T = unknown>(url: string, data?: unknown, options?: ApiClientOptions) => {
    const { headers, ...restOptions } = options || {};
    return apiRequest<T>(url, {
      ...restOptions,
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', ...headers },
      body: JSON.stringify(data),
    });
  },

  delete: <T = unknown>(url: string, options?: ApiClientOptions) =>
    apiRequest<T>(url, { ...options, method: 'DELETE' }),
};




