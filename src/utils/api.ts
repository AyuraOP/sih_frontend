import { authService } from '@/services/auth';

/**
 * Enhanced API utility with JWT authentication and automatic token refresh
 */
class ApiClient {
  private baseURL: string;

  constructor(baseURL: string) {
    this.baseURL = baseURL;
  }

  private async getAuthHeaders(): Promise<HeadersInit> {
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
    };

    const token = await authService.getValidAccessToken();
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    return headers;
  }

  private async handleResponse<T>(response: Response): Promise<T> {
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      
      // Handle authentication errors
      if (response.status === 401) {
        // Token is invalid, clear auth data
        authService.removeTokens();
        authService.removeUser();
        window.location.href = '/';
        throw new Error('Authentication required. Please login again.');
      }
      
      throw new Error(errorData.error || errorData.message || errorData.detail || `HTTP error! status: ${response.status}`);
    }
    
    return response.json();
  }

  async get<T>(endpoint: string, params?: Record<string, any>): Promise<T> {
    const queryParams = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          queryParams.append(key, value.toString());
        }
      });
    }

    const url = `${this.baseURL}${endpoint}${queryParams.toString() ? '?' + queryParams.toString() : ''}`;
    const headers = await this.getAuthHeaders();

    const response = await fetch(url, {
      method: 'GET',
      headers,
    });

    return this.handleResponse<T>(response);
  }

  async post<T>(endpoint: string, data?: any): Promise<T> {
    const headers = await this.getAuthHeaders();

    const response = await fetch(`${this.baseURL}${endpoint}`, {
      method: 'POST',
      headers,
      body: data ? JSON.stringify(data) : undefined,
    });

    return this.handleResponse<T>(response);
  }

  async put<T>(endpoint: string, data?: any): Promise<T> {
    const headers = await this.getAuthHeaders();

    const response = await fetch(`${this.baseURL}${endpoint}`, {
      method: 'PUT',
      headers,
      body: data ? JSON.stringify(data) : undefined,
    });

    return this.handleResponse<T>(response);
  }

  async patch<T>(endpoint: string, data?: any): Promise<T> {
    const headers = await this.getAuthHeaders();

    const response = await fetch(`${this.baseURL}${endpoint}`, {
      method: 'PATCH',
      headers,
      body: data ? JSON.stringify(data) : undefined,
    });

    return this.handleResponse<T>(response);
  }

  async delete<T>(endpoint: string): Promise<T> {
    const headers = await this.getAuthHeaders();

    const response = await fetch(`${this.baseURL}${endpoint}`, {
      method: 'DELETE',
      headers,
    });

    return this.handleResponse<T>(response);
  }
}

// Create API clients for different services
export const accountsApi = new ApiClient('https://kmrl-backend-qjvw.onrender.com/api/v1/accounts');
export const fleetApi = new ApiClient('https://kmrl-backend-qjvw.onrender.com/api/v1/fleet-management');
export const depotApi = new ApiClient('https://kmrl-backend-qjvw.onrender.com/api/v1/depot-management');

export default ApiClient;