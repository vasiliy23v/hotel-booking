// API клиент для работы с бэкендом
import { apiRequest, type ApiClientOptions } from './api-client';
import type {
  User,
  Hotel,
  Room,
  Booking,
  Stairs,
  Invite,
  Feedback,
  RegistrationToken,
  BookingDateRange,
  CreateUserInput,
  UpdateUserInput,
  CreateHotelInput,
  UpdateHotelInput,
  CreateRoomInput,
  UpdateRoomInput,
  CreateBookingInput,
  UpdateBookingInput,
  CreateStairsInput,
  UpdateStairsInput,
  CreateInviteInput,
  CreateInviteResponse,
  CreateBookingDateRangeInput,
  UpdateBookingDateRangeInput,
  BookingStats,
  RoomsAvailabilityResponse,
  StatisticsResponse,
  CashMonitoringResponse,
} from '../types/api';

const API_URL = '/api';

// Получить текущего пользователя из localStorage
function getCurrentUser(): User | null {
  if (typeof window === 'undefined') return null;
  try {
    const user = localStorage.getItem('currentUser');
    return user ? (JSON.parse(user) as User) : null;
  } catch {
    return null;
  }
}

export class ApiClient {
  private async request<T>(endpoint: string, options?: RequestInit & Partial<ApiClientOptions>, withRetry: boolean = true): Promise<T> {
    try {
      // Для FormData не устанавливаем Content-Type, браузер сам установит
      const isFormData = options?.body instanceof FormData;
      const headers: HeadersInit = isFormData
        ? { ...options?.headers }
        : {
            'Content-Type': 'application/json',
            ...options?.headers,
          };

      // Если withRetry = true, используем новый клиент с retry и тостерами
      if (withRetry && !isFormData) {
        const user = getCurrentUser();
        const url = `${API_URL}${endpoint}`;
        const method = options?.method || 'GET';
        const isAdmin = user?.role === 'developer' || user?.role === 'manager';
        const isModifyingOperation = method === 'POST' || method === 'PUT' || method === 'DELETE' || method === 'PATCH';
        
        // Для администраторов автоматически показываем тоастеры успеха при операциях изменения данных
        // Если showSuccessToast явно указан в options, используем его, иначе для админов включаем автоматически
        const showSuccessToast = options?.showSuccessToast !== undefined 
          ? options.showSuccessToast 
          : (isAdmin && isModifyingOperation);
        
        return await apiRequest<T>(url, {
          ...options,
          headers,
          userName: user?.name || 'Неизвестный',
          userId: user?.id,
          userRole: user?.role,
          showSuccessToast, // Устанавливаем после spread, чтобы гарантировать правильное значение
          successMessage: this.getSuccessMessage(method, endpoint),
          retries: 3,
          retryDelay: 1000,
        });
      }

      // Старый вариант для FormData и без retry
      const response = await fetch(`${API_URL}${endpoint}`, {
        ...options,
        headers,
      });

      if (!response.ok) {
        let errorMessage = `Ошибка: ${response.statusText}`;
        try {
          const error = await response.json();
          errorMessage = error.error || errorMessage;
        } catch {
          // Если не удалось распарсить JSON, используем статус текст
        }
        throw new Error(errorMessage);
      }

      return response.json();
    } catch (error) {
      // Если это уже наша ошибка, пробрасываем её дальше
      if (error instanceof Error) {
        throw error;
      }
      // Иначе создаём новую ошибку
      throw new Error('Ошибка сети. Проверьте подключение к интернету.');
    }
  }

  private getSuccessMessage(method: string, endpoint: string): string {
    if (endpoint.includes('/rooms')) {
      if (method === 'PUT') return '✅ Комната сохранена успешно';
      if (method === 'DELETE') return '✅ Комната удалена';
    }
    if (endpoint.includes('/bookings')) {
      if (method === 'POST') return '✅ Бронирование успешно!';
      if (method === 'PUT') return '✅ Бронирование обновлено';
      if (method === 'DELETE') return '✅ Бронирование отменено';
    }
    if (endpoint.includes('/hotels')) {
      if (method === 'POST') return '✅ Отель создан';
      if (method === 'PUT') return '✅ Отель обновлен';
      if (method === 'DELETE') return '✅ Отель удален';
    }
    return 'Операция выполнена успешно';
  }

  // Users
  async getUsers() {
    return this.request<User[]>('/users');
  }

  async getUser(id: string) {
    return this.request<User>(`/users/${id}`);
  }

  async createUser(user: CreateUserInput) {
    return this.request<User>('/users', {
      method: 'POST',
      body: JSON.stringify(user),
    });
  }

  // Invites
  async getInvites() {
    return this.request<Invite[]>('/invites');
  }

  async createInvite(name?: string, expiresInDays?: number, createdBy?: string) {
    const input: CreateInviteInput = { name: name || '', expiresInDays, createdBy };
    return this.request<CreateInviteResponse>('/invites', {
      method: 'POST',
      body: JSON.stringify(input),
    });
  }

  async verifyInviteToken(token: string) {
    return this.request<Invite>(`/invites/verify?token=${encodeURIComponent(token)}`);
  }

  async deleteInvite(id: string) {
    return this.request<void>(`/invites?id=${encodeURIComponent(id)}`, { method: 'DELETE' });
  }

  async recreateInvite(name: string, expiresInDays?: number, createdBy?: string) {
    const input: CreateInviteInput = { name, expiresInDays, createdBy };
    return this.request<CreateInviteResponse>('/invites/recreate', {
      method: 'POST',
      body: JSON.stringify(input),
    });
  }

  async updateUser(id: string, user: UpdateUserInput) {
    return this.request<User>(`/users/${id}`, {
      method: 'PUT',
      body: JSON.stringify(user),
    });
  }

  async deleteUser(id: string) {
    return this.request(`/users/${id}`, { method: 'DELETE' });
  }

  async login(identifier: string, password: string) {
    // Определяем, является ли идентификатор email или телефоном
    const isEmail = identifier.includes('@');
    const body = isEmail 
      ? { email: identifier, password }
      : { phone: identifier, password };
    
    return this.request<User>('/auth/login', {
      method: 'POST',
      body: JSON.stringify(body),
    });
  }

  // Rooms
  async getRooms(hotelId?: string) {
    const query = hotelId ? `?hotelId=${hotelId}` : '';
    return this.request<Room[]>(`/rooms${query}`);
  }

  async getRoom(id: string) {
    return this.request<Room>(`/rooms/${id}`);
  }

  async createRoom(room: CreateRoomInput) {
    return this.request<Room>('/rooms', {
      method: 'POST',
      body: JSON.stringify(room),
    });
  }

  async updateRoom(id: string, room: UpdateRoomInput) {
    return this.request<Room>(`/rooms/${id}`, {
      method: 'PUT',
      body: JSON.stringify(room),
    });
  }

  async deleteRoom(id: string) {
    return this.request(`/rooms/${id}`, { method: 'DELETE' });
  }

  // Bookings
  async getBookings(roomId?: string, hotelId?: string) {
    const params = new URLSearchParams();
    if (roomId) params.append('roomId', roomId);
    if (hotelId) params.append('hotelId', hotelId);
    const query = params.toString() ? `?${params.toString()}` : '';
    return this.request<Booking[]>(`/bookings${query}`);
  }

  async createBooking(booking: CreateBookingInput) {
    return this.request<Booking>('/bookings', {
      method: 'POST',
      body: JSON.stringify(booking),
      logAction: true, // Обязательное логирование бронирований
    });
  }

  async updateBooking(id: string, booking: UpdateBookingInput) {
    return this.request<Booking>(`/bookings/${id}`, {
      method: 'PUT',
      body: JSON.stringify(booking),
      logAction: true, // Обязательное логирование бронирований
    });
  }

  async deleteBooking(id: string) {
    return this.request<void>(`/bookings/${id}`, { 
      method: 'DELETE',
      logAction: true, // Обязательное логирование удаления бронирований
    });
  }

  async getBookingStats() {
    return this.request<BookingStats>('/bookings/stats');
  }

  async checkRoomsAvailability(roomIds: string[], checkIn: string, checkOut: string, excludeBookingId?: string) {
    return this.request<RoomsAvailabilityResponse>('/rooms/availability', {
      method: 'POST',
      body: JSON.stringify({ roomIds, checkIn, checkOut, excludeBookingId }),
    });
  }


  async getCashMonitoring(hotelId?: string) {
    const query = hotelId ? `?hotelId=${hotelId}` : '';
    return this.request<CashMonitoringResponse>(`/cash-monitoring${query}`);
  }

  // Hotels
  async getHotels() {
    return this.request<Hotel[]>('/hotels');
  }

  async getHotel(id: string) {
    return this.request<Hotel>(`/hotels/${id}`);
  }

  async createHotel(hotel: CreateHotelInput) {
    return this.request<Hotel>('/hotels', {
      method: 'POST',
      body: JSON.stringify(hotel),
    });
  }

  async updateHotel(id: string, hotel: UpdateHotelInput) {
    return this.request<Hotel>(`/hotels/${id}`, {
      method: 'PUT',
      body: JSON.stringify(hotel),
    });
  }

  async deleteHotel(id: string) {
    return this.request<void>(`/hotels/${id}`, { method: 'DELETE' });
  }

  // Statistics
  async getStatistics(hotelId?: string) {
    const query = hotelId ? `?hotelId=${hotelId}` : '';
    return this.request<StatisticsResponse>(`/statistics${query}`);
  }

  // Stairs
  async getStairs(hotelId?: string) {
    const query = hotelId ? `?hotelId=${hotelId}` : '';
    return this.request<Stairs[]>(`/stairs${query}`);
  }

  async createStairs(stairs: CreateStairsInput) {
    return this.request<Stairs>('/stairs', {
      method: 'POST',
      body: JSON.stringify(stairs),
    });
  }

  async updateStairs(id: string, stairs: UpdateStairsInput) {
    return this.request<Stairs>(`/stairs/${id}`, {
      method: 'PUT',
      body: JSON.stringify(stairs),
    });
  }

  async deleteStairs(id: string) {
    return this.request<void>(`/stairs/${id}`, { method: 'DELETE' });
  }

  // Password Reset
  async resetPassword(inviteToken: string, password: string, confirmPassword: string, name?: string) {
    return this.request<User>('/users/reset-password', {
      method: 'POST',
      body: JSON.stringify({ inviteToken, password, confirmPassword, name }),
    });
  }

  // Feedback
  async getFeedbacks() {
    return this.request<Feedback[]>('/feedback');
  }

  async updateFeedbackStatus(id: string, isProcessed: boolean) {
    return this.request<Feedback>('/feedback', {
      method: 'PATCH',
      body: JSON.stringify({ id, isProcessed }),
    });
  }

  async deleteFeedback(id: string) {
    return this.request<void>(`/feedback?id=${id}`, {
      method: 'DELETE',
    });
  }

  async createFeedback(feedback: FormData) {
    // Для FormData используем прямой fetch, так как request устанавливает Content-Type
    try {
      const response = await fetch(`${API_URL}/feedback`, {
        method: 'POST',
        body: feedback,
      });

      if (!response.ok) {
        let errorMessage = `Ошибка: ${response.statusText}`;
        try {
          const error = await response.json() as { error?: string };
          errorMessage = error.error || errorMessage;
        } catch {
          // Если не удалось распарсить JSON, используем статус текст
        }
        throw new Error(errorMessage);
      }

      return response.json() as Promise<Feedback>;
    } catch (error) {
      // Если это уже наша ошибка, пробрасываем её дальше
      if (error instanceof Error) {
        throw error;
      }
      // Иначе создаём новую ошибку
      throw new Error('Ошибка сети. Проверьте подключение к интернету.');
    }
  }

  // Registration Token
  async getRegistrationToken(includeUrl = false) {
    const query = includeUrl ? '?includeUrl=true' : '';
    return this.request<RegistrationToken>(`/registration-token${query}`);
  }

  async createOrUpdateRegistrationToken() {
    return this.request<RegistrationToken>('/registration-token', {
      method: 'POST',
    });
  }

  // Booking Date Ranges
  async getBookingDateRanges(activeOnly = false) {
    const query = activeOnly ? '?activeOnly=true' : '';
    return this.request<BookingDateRange[]>(`/booking-date-ranges${query}`);
  }

  async createBookingDateRange(range: CreateBookingDateRangeInput) {
    return this.request<BookingDateRange>('/booking-date-ranges', {
      method: 'POST',
      body: JSON.stringify(range),
    });
  }

  async updateBookingDateRange(id: string, range: UpdateBookingDateRangeInput) {
    return this.request<BookingDateRange>(`/booking-date-ranges/${id}`, {
      method: 'PUT',
      body: JSON.stringify(range),
    });
  }

  async deleteBookingDateRange(id: string) {
    return this.request<void>(`/booking-date-ranges/${id}`, { method: 'DELETE' });
  }
}

export const api = new ApiClient();

