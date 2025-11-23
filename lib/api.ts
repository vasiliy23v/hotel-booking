// API клиент для работы с бэкендом
const API_URL = '/api';

export class ApiClient {
  private async request<T>(endpoint: string, options?: RequestInit): Promise<T> {
    const response = await fetch(`${API_URL}${endpoint}`, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options?.headers,
      },
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ error: response.statusText }));
      throw new Error(error.error || `API Error: ${response.statusText}`);
    }

    return response.json();
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

  async updateUser(id: string, user: any) {
    return this.request<any>(`/users/${id}`, {
      method: 'PUT',
      body: JSON.stringify(user),
    });
  }

  async deleteUser(id: string) {
    return this.request(`/users/${id}`, { method: 'DELETE' });
  }

  async login(email: string, password: string) {
    return this.request<any>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
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

  async confirmBooking(id: string, confirmedBy: string) {
    return this.request<any>(`/bookings/${id}/confirm`, {
      method: 'PUT',
      body: JSON.stringify({ confirmedBy }),
    });
  }

  async confirmPayment(id: string, paymentMethod: 'cash' | 'transfer', amount?: number, paidBy?: string) {
    return this.request<any>(`/bookings/${id}/payment`, {
      method: 'PUT',
      body: JSON.stringify({ paymentMethod, amount, paidBy }),
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
}

export const api = new ApiClient();

