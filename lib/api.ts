// API клиент для работы с бэкендом
const API_URL = '/api';

export class ApiClient {
  private async request<T>(endpoint: string, options?: RequestInit): Promise<T> {
    try {
      // Для FormData не устанавливаем Content-Type, браузер сам установит
      const isFormData = options?.body instanceof FormData;
      const headers: HeadersInit = isFormData
        ? { ...options?.headers }
        : {
            'Content-Type': 'application/json',
            ...options?.headers,
          };

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

  // Users
  async getUsers() {
    return this.request<any[]>('/users');
  }

  async createUser(user: any) {
    return this.request<any>('/users', {
      method: 'POST',
      body: JSON.stringify(user),
    });
  }

  // Invites
  async getInvites() {
    return this.request<any[]>('/invites');
  }

  async createInvite(name?: string, expiresInDays?: number, createdBy?: string) {
    return this.request<any>('/invites', {
      method: 'POST',
      body: JSON.stringify({ name, expiresInDays, createdBy }),
    });
  }

  async verifyInviteToken(token: string) {
    return this.request<any>(`/invites/verify?token=${encodeURIComponent(token)}`);
  }

  async deleteInvite(id: string) {
    return this.request(`/invites?id=${encodeURIComponent(id)}`, { method: 'DELETE' });
  }

  async recreateInvite(name: string, expiresInDays?: number, createdBy?: string) {
    return this.request<any>('/invites/recreate', {
      method: 'POST',
      body: JSON.stringify({ name, expiresInDays, createdBy }),
    });
  }

  async updateUser(id: string, user: any) {
    return this.request<any>(`/users/${id}`, {
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
    
    return this.request<any>('/auth/login', {
      method: 'POST',
      body: JSON.stringify(body),
    });
  }

  // Rooms
  async getRooms(hotelId?: string) {
    const query = hotelId ? `?hotelId=${hotelId}` : '';
    return this.request<any[]>(`/rooms${query}`);
  }

  async getRoom(id: string) {
    return this.request<any>(`/rooms/${id}`);
  }

  async createRoom(room: any) {
    return this.request<any>('/rooms', {
      method: 'POST',
      body: JSON.stringify(room),
    });
  }

  async updateRoom(id: string, room: any) {
    return this.request<any>(`/rooms/${id}`, {
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
    return this.request<any[]>(`/bookings${query}`);
  }

  async createBooking(booking: any) {
    return this.request<any>('/bookings', {
      method: 'POST',
      body: JSON.stringify(booking),
    });
  }

  async updateBooking(id: string, booking: any) {
    return this.request<any>(`/bookings/${id}`, {
      method: 'PUT',
      body: JSON.stringify(booking),
    });
  }

  async deleteBooking(id: string) {
    return this.request(`/bookings/${id}`, { method: 'DELETE' });
  }

  async getBookingStats() {
    return this.request<{ unconfirmed: number; unpaid: number }>('/bookings/stats');
  }

  async checkRoomsAvailability(roomIds: string[], checkIn: string, checkOut: string) {
    return this.request<Record<string, boolean>>('/rooms/availability', {
      method: 'POST',
      body: JSON.stringify({ roomIds, checkIn, checkOut }),
    });
  }


  async getCashMonitoring(hotelId?: string) {
    const query = hotelId ? `?hotelId=${hotelId}` : '';
    return this.request<any>(`/cash-monitoring${query}`);
  }

  // Hotels
  async getHotels() {
    return this.request<any[]>('/hotels');
  }

  async getHotel(id: string) {
    return this.request<any>(`/hotels/${id}`);
  }

  async createHotel(hotel: any) {
    return this.request<any>('/hotels', {
      method: 'POST',
      body: JSON.stringify(hotel),
    });
  }

  async updateHotel(id: string, hotel: any) {
    return this.request<any>(`/hotels/${id}`, {
      method: 'PUT',
      body: JSON.stringify(hotel),
    });
  }

  async deleteHotel(id: string) {
    return this.request(`/hotels/${id}`, { method: 'DELETE' });
  }

  // Statistics
  async getStatistics(hotelId?: string) {
    const query = hotelId ? `?hotelId=${hotelId}` : '';
    return this.request<any>(`/statistics${query}`);
  }

  // Stairs
  async getStairs(hotelId?: string) {
    const query = hotelId ? `?hotelId=${hotelId}` : '';
    return this.request<any[]>(`/stairs${query}`);
  }

  async createStairs(stairs: any) {
    return this.request<any>('/stairs', {
      method: 'POST',
      body: JSON.stringify(stairs),
    });
  }

  async updateStairs(id: string, stairs: any) {
    return this.request<any>(`/stairs/${id}`, {
      method: 'PUT',
      body: JSON.stringify(stairs),
    });
  }

  async deleteStairs(id: string) {
    return this.request(`/stairs/${id}`, { method: 'DELETE' });
  }

  // Password Reset
  async resetPassword(inviteToken: string, password: string, confirmPassword: string, name?: string) {
    return this.request<any>('/users/reset-password', {
      method: 'POST',
      body: JSON.stringify({ inviteToken, password, confirmPassword, name }),
    });
  }

  // Feedback
  async getFeedbacks() {
    return this.request<any[]>('/feedback');
  }

  async deleteFeedback(id: string) {
    return this.request(`/feedback?id=${id}`, {
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

  // Registration Token
  async getRegistrationToken(includeUrl = false) {
    const query = includeUrl ? '?includeUrl=true' : '';
    return this.request<any>(`/registration-token${query}`);
  }

  async createOrUpdateRegistrationToken() {
    return this.request<any>('/registration-token', {
      method: 'POST',
    });
  }
}

export const api = new ApiClient();

