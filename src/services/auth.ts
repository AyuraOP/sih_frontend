// Authentication API Service for KMRL Fleet Management System
const BASE_URL = 'https://kmrl-backend-qjvw.onrender.com/api/v1/accounts';

export interface LoginRequest {
  email: string;
  password: string;
}

export interface TokenRequest {
  username: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  user: {
    id: string;
    email: string;
    employee_id?: string;
    first_name?: string;
    last_name?: string;
    middle_name?: string;
    phone_number?: string;
    designation?: string;
    grade?: string;
    shift_type?: string;
    department?: any;
    role?: any;
  };
  message?: string;
}

export interface ChangePasswordRequest {
  old_password: string;
  new_password: string;
  new_password_confirm: string;
}

export interface ResetPasswordRequest {
  employee_id: string;
  email: string;
}

export interface UserProfile {
  id: string;
  email: string;
  employee_id: string;
  first_name: string;
  last_name: string;
  middle_name?: string;
  phone_number?: string;
  alternate_phone?: string;
  designation?: string;
  grade?: string;
  shift_type?: string;
  joining_date?: string;
  department?: any;
  role?: any;
  receive_email_notifications?: boolean;
  receive_sms_notifications?: boolean;
  receive_whatsapp_notifications?: boolean;
  notification_categories?: string[];
  is_active?: boolean;
}

export interface UserPreferences {
  default_dashboard?: string;
  dashboard_refresh_interval?: number;
  show_quick_stats?: boolean;
  theme?: string;
  language?: string;
  timezone?: string;
  date_format?: string;
  time_format?: string;
  default_depot_id?: string;
  favorite_trainsets?: string[];
  quick_filters?: Record<string, any>;
}

export interface DashboardStats {
  total_users: number;
  active_users: number;
  total_trainsets: number;
  operational_trainsets: number;
  maintenance_due: number;
  critical_alerts: number;
  recent_activities: any[];
}

export interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data?: T;
  results?: T[];
  count?: number;
  next?: string;
  previous?: string;
}

class AuthService {
  private getAuthHeaders(token?: string) {
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
    };
    
    if (token) {
      headers['Authorization'] = `Token ${token}`;
    }
    
    return headers;
  }

  private async handleResponse<T>(response: Response): Promise<T> {
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || errorData.detail || `HTTP error! status: ${response.status}`);
    }
    
    return response.json();
  }

  // Mock login for development
  private async mockLogin(credentials: LoginRequest): Promise<LoginResponse> {
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    if (credentials.email === 'admin@gmail.com' && credentials.password === '1234') {
      return {
        token: 'mock-jwt-token-' + Date.now(),
        user: {
          id: '1',
          email: credentials.email,
          employee_id: 'EMP001',
          first_name: 'System',
          last_name: 'Administrator',
          designation: 'System Administrator',
          grade: 'SA',
          shift_type: 'DAY'
        },
        message: 'Mock login successful'
      };
    } else if (credentials.password === '1234') {
      return {
        token: 'mock-jwt-token-' + Date.now(),
        user: {
          id: '2',
          email: credentials.email,
          employee_id: 'EMP002',
          first_name: 'Fleet',
          last_name: 'Operator',
          designation: 'Operations Manager',
          grade: 'OM',
          shift_type: 'DAY'
        },
        message: 'Mock login successful'
      };
    } else {
      throw new Error('Invalid credentials. Use password "1234" for any email address');
    }
  }

  // 1. User Login
  async login(credentials: LoginRequest): Promise<LoginResponse> {
    // if (import.meta.env.DEV && !import.meta.env.VITE_API_URL) {
    //   console.warn('Development mode: Using mock login. Set VITE_API_URL to connect to backend.');
    //   return this.mockLogin(credentials);
    // }

    try {
      const response = await fetch(`${BASE_URL}/auth/login/`, {
        method: 'POST',
        headers: this.getAuthHeaders(),
        body: JSON.stringify(credentials),
      });

      return this.handleResponse<LoginResponse>(response);
    } catch (error) {
      if (import.meta.env.DEV) {
        console.warn('Backend unavailable, using mock login:', error);
        return this.mockLogin(credentials);
      }
      throw error;
    }
  }

  // 2. Get Auth Token (Alternative login method)
  async getToken(credentials: TokenRequest): Promise<LoginResponse> {
    if (import.meta.env.DEV && !import.meta.env.VITE_API_URL) {
      return this.mockLogin({ email: credentials.username, password: credentials.password });
    }

    try {
      const response = await fetch(`${BASE_URL}/auth/token/`, {
        method: 'POST',
        headers: this.getAuthHeaders(),
        body: JSON.stringify(credentials),
      });

      return this.handleResponse<LoginResponse>(response);
    } catch (error) {
      if (import.meta.env.DEV) {
        return this.mockLogin({ email: credentials.username, password: credentials.password });
      }
      throw error;
    }
  }

  // 3. User Logout
  async logout(token: string): Promise<ApiResponse> {
    const response = await fetch(`${BASE_URL}/auth/logout/`, {
      method: 'POST',
      headers: this.getAuthHeaders(token),
    });

    return this.handleResponse<ApiResponse>(response);
  }

  // 4. Change Password
  async changePassword(token: string, passwordData: ChangePasswordRequest): Promise<ApiResponse> {
    const response = await fetch(`${BASE_URL}/auth/change-password/`, {
      method: 'POST',
      headers: this.getAuthHeaders(token),
      body: JSON.stringify(passwordData),
    });

    return this.handleResponse<ApiResponse>(response);
  }

  // 5. Request Password Reset
  async requestPasswordReset(resetData: ResetPasswordRequest): Promise<ApiResponse> {
    const response = await fetch(`${BASE_URL}/auth/reset-password-request/`, {
      method: 'POST',
      headers: this.getAuthHeaders(),
      body: JSON.stringify(resetData),
    });

    return this.handleResponse<ApiResponse>(response);
  }

  // 6. Get User Profile
  async getProfile(token: string): Promise<UserProfile> {
    const response = await fetch(`${BASE_URL}/profile/`, {
      method: 'GET',
      headers: this.getAuthHeaders(token),
    });

    return this.handleResponse<UserProfile>(response);
  }

  // 7. Update User Profile
  async updateProfile(token: string, profileData: Partial<UserProfile>): Promise<UserProfile> {
    const response = await fetch(`${BASE_URL}/profile/`, {
      method: 'PUT',
      headers: this.getAuthHeaders(token),
      body: JSON.stringify(profileData),
    });

    return this.handleResponse<UserProfile>(response);
  }

  // 8. Partial Update User Profile
  async patchProfile(token: string, profileData: Partial<UserProfile>): Promise<UserProfile> {
    const response = await fetch(`${BASE_URL}/profile/`, {
      method: 'PATCH',
      headers: this.getAuthHeaders(token),
      body: JSON.stringify(profileData),
    });

    return this.handleResponse<UserProfile>(response);
  }

  // 9. Get User Preferences
  async getPreferences(token: string): Promise<UserPreferences> {
    const response = await fetch(`${BASE_URL}/preferences/`, {
      method: 'GET',
      headers: this.getAuthHeaders(token),
    });

    return this.handleResponse<UserPreferences>(response);
  }

  // 10. Update User Preferences
  async updatePreferences(token: string, preferences: UserPreferences): Promise<UserPreferences> {
    const response = await fetch(`${BASE_URL}/preferences/`, {
      method: 'PUT',
      headers: this.getAuthHeaders(token),
      body: JSON.stringify(preferences),
    });

    return this.handleResponse<UserPreferences>(response);
  }

  // 11. Get Dashboard Statistics
  async getDashboardStats(token: string): Promise<DashboardStats> {
    const response = await fetch(`${BASE_URL}/dashboard/stats/`, {
      method: 'GET',
      headers: this.getAuthHeaders(token),
    });

    return this.handleResponse<DashboardStats>(response);
  }

  // Utility methods
  getStoredToken(): string | null {
    return localStorage.getItem('kmrl-auth-token');
  }

  storeToken(token: string): void {
    localStorage.setItem('kmrl-auth-token', token);
  }

  removeToken(): void {
    localStorage.removeItem('kmrl-auth-token');
  }

  getStoredUser(): UserProfile | null {
    const userData = localStorage.getItem('kmrl-user-data');
    return userData ? JSON.parse(userData) : null;
  }

  storeUser(user: UserProfile): void {
    localStorage.setItem('kmrl-user-data', JSON.stringify(user));
  }

  removeUser(): void {
    localStorage.removeItem('kmrl-user-data');
  }

  isAuthenticated(): boolean {
    const token = this.getStoredToken();
    return !!token;
  }
}

export const authService = new AuthService();
export default authService;