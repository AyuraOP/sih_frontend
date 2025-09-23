// Authentication API Service for KMRL Fleet Management System - JWT Implementation
const BASE_URL = 'http://localhost:8000/api/v1/accounts';

export interface LoginRequest {
  email: string;
  password: string;
}

export interface TokenRequest {
  username: string;
  password: string;
}

export interface LoginResponse {
  access: string;
  refresh: string;
  access_expires_at: string;
  refresh_expires_at: string;
  user: UserProfile;
  max_sessions: number;
  active_sessions_count: number;
  session_id: string;
  message?: string;
}

export interface RefreshTokenRequest {
  refresh: string;
}

export interface RefreshTokenResponse {
  access: string;
  access_expires_at: string;
  message: string;
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
  last_login?: string;
  must_change_password?: boolean;
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

export interface SessionInfo {
  session_id: string;
  jwt_id: string;
  expires_at: string;
  time_remaining_seconds: number;
  login_time: string;
  last_activity: string;
  ip_address: string;
  is_expiring_soon: boolean;
  active_sessions_count: number;
  max_sessions: number;
  session_valid: boolean;
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
      headers['Authorization'] = `Bearer ${token}`;
    }
    
    return headers;
  }

  private async handleResponse<T>(response: Response): Promise<T> {
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || errorData.message || errorData.detail || `HTTP error! status: ${response.status}`);
    }
    
    return response.json();
  }

  // // Mock login for development
  // private async mockLogin(credentials: LoginRequest): Promise<LoginResponse> {
  //   await new Promise(resolve => setTimeout(resolve, 1000));
    
  //   const mockUser: UserProfile = {
  //     id: '1',
  //     email: credentials.email,
  //     employee_id: 'EMP001',
  //     first_name: 'System',
  //     last_name: 'Administrator',
  //     designation: 'System Administrator',
  //     grade: 'SA',
  //     shift_type: 'DAY',
  //     is_active: true,
  //     must_change_password: false
  //   };

  //   if (credentials.email === 'admin@gmail.com' && credentials.password === '1234') {
  //     return {
  //       access: 'mock-jwt-access-token-' + Date.now(),
  //       refresh: 'mock-jwt-refresh-token-' + Date.now(),
  //       access_expires_at: new Date(Date.now() + 60 * 60 * 1000).toISOString(), // 1 hour
  //       refresh_expires_at: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(), // 24 hours
  //       user: mockUser,
  //       max_sessions: 3,
  //       active_sessions_count: 1,
  //       session_id: 'mock-session-' + Date.now(),
  //       message: 'Mock login successful'
  //     };
  //   } else if (credentials.password === '1234') {
  //     return {
  //       access: 'mock-jwt-access-token-' + Date.now(),
  //       refresh: 'mock-jwt-refresh-token-' + Date.now(),
  //       access_expires_at: new Date(Date.now() + 60 * 60 * 1000).toISOString(),
  //       refresh_expires_at: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
  //       user: {
  //         ...mockUser,
  //         id: '2',
  //         email: credentials.email,
  //         employee_id: 'EMP002',
  //         first_name: 'Fleet',
  //         last_name: 'Operator',
  //         designation: 'Operations Manager',
  //         grade: 'OM'
  //       },
  //       max_sessions: 1,
  //       active_sessions_count: 1,
  //       session_id: 'mock-session-' + Date.now(),
  //       message: 'Mock login successful'
  //     };
  //   } else {
  //     throw new Error('Invalid credentials. Use password "1234" for any email address');
  //   }
  // }

  // 1. User Login with JWT
  async login(credentials: LoginRequest): Promise<LoginResponse> {
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
        // return this.mockLogin(credentials);
      }
      throw error;
    }
  }

  // 2. Get Auth Token (Alternative login method) - Updated for JWT
  async getToken(credentials: TokenRequest): Promise<LoginResponse> {
    if (import.meta.env.DEV && !import.meta.env.VITE_API_URL) {
      // return this.mockLogin({ email: credentials.username, password: credentials.password });
    }

    try {
      // Use the same login endpoint but with username/password format
      const response = await fetch(`${BASE_URL}/auth/login/`, {
        method: 'POST',
        headers: this.getAuthHeaders(),
        body: JSON.stringify({
          email: credentials.username,
          password: credentials.password
        }),
      });

      return this.handleResponse<LoginResponse>(response);
    } catch (error) {
      if (import.meta.env.DEV) {
        // return this.mockLogin({ email: credentials.username, password: credentials.password });
      }
      throw error;
    }
  }

  // 3. Refresh JWT Token
  async refreshToken(refreshToken: string): Promise<RefreshTokenResponse> {
    const response = await fetch(`${BASE_URL}/auth/token/refresh/`, {
      method: 'POST',
      headers: this.getAuthHeaders(),
      body: JSON.stringify({ refresh: refreshToken }),
    });

    return this.handleResponse<RefreshTokenResponse>(response);
  }

  // 4. User Logout with JWT
  async logout(accessToken: string, refreshToken?: string): Promise<ApiResponse> {
    const response = await fetch(`${BASE_URL}/auth/logout/`, {
      method: 'POST',
      headers: this.getAuthHeaders(accessToken),
      body: JSON.stringify({ refresh: refreshToken }),
    });

    return this.handleResponse<ApiResponse>(response);
  }

  // 5. Change Password
  async changePassword(token: string, passwordData: ChangePasswordRequest): Promise<ApiResponse> {
    const response = await fetch(`${BASE_URL}/auth/change-password/`, {
      method: 'POST',
      headers: this.getAuthHeaders(token),
      body: JSON.stringify(passwordData),
    });

    return this.handleResponse<ApiResponse>(response);
  }

  // 6. Request Password Reset
  async requestPasswordReset(resetData: ResetPasswordRequest): Promise<ApiResponse> {
    const response = await fetch(`${BASE_URL}/auth/reset-password-request/`, {
      method: 'POST',
      headers: this.getAuthHeaders(),
      body: JSON.stringify(resetData),
    });

    return this.handleResponse<ApiResponse>(response);
  }

  // 7. Get User Profile
  async getProfile(token: string): Promise<UserProfile> {
    const response = await fetch(`${BASE_URL}/profile/`, {
      method: 'GET',
      headers: this.getAuthHeaders(token),
    });

    return this.handleResponse<UserProfile>(response);
  }

  // 8. Update User Profile
  async updateProfile(token: string, profileData: Partial<UserProfile>): Promise<UserProfile> {
    const response = await fetch(`${BASE_URL}/profile/`, {
      method: 'PUT',
      headers: this.getAuthHeaders(token),
      body: JSON.stringify(profileData),
    });

    return this.handleResponse<UserProfile>(response);
  }

  // 9. Partial Update User Profile
  async patchProfile(token: string, profileData: Partial<UserProfile>): Promise<UserProfile> {
    const response = await fetch(`${BASE_URL}/profile/`, {
      method: 'PATCH',
      headers: this.getAuthHeaders(token),
      body: JSON.stringify(profileData),
    });

    return this.handleResponse<UserProfile>(response);
  }

  // 10. Get User Preferences
  async getPreferences(token: string): Promise<UserPreferences> {
    const response = await fetch(`${BASE_URL}/preferences/`, {
      method: 'GET',
      headers: this.getAuthHeaders(token),
    });

    return this.handleResponse<UserPreferences>(response);
  }

  // 11. Update User Preferences
  async updatePreferences(token: string, preferences: UserPreferences): Promise<UserPreferences> {
    const response = await fetch(`${BASE_URL}/preferences/`, {
      method: 'PUT',
      headers: this.getAuthHeaders(token),
      body: JSON.stringify(preferences),
    });

    return this.handleResponse<UserPreferences>(response);
  }

  // 12. Get Session Status
  async getSessionStatus(token: string): Promise<SessionInfo> {
    const response = await fetch(`${BASE_URL}/auth/session/status/`, {
      method: 'GET',
      headers: this.getAuthHeaders(token),
    });

    return this.handleResponse<SessionInfo>(response);
  }

  // 13. Get User Sessions
  async getUserSessions(token: string): Promise<any> {
    const response = await fetch(`${BASE_URL}/auth/sessions/`, {
      method: 'GET',
      headers: this.getAuthHeaders(token),
    });

    return this.handleResponse<any>(response);
  }

  // 14. Terminate Session
  async terminateSession(token: string, sessionId?: string, terminateAllOthers?: boolean): Promise<ApiResponse> {
    const response = await fetch(`${BASE_URL}/auth/session/terminate/`, {
      method: 'POST',
      headers: this.getAuthHeaders(token),
      body: JSON.stringify({
        session_id: sessionId,
        terminate_all_others: terminateAllOthers
      }),
    });

    return this.handleResponse<ApiResponse>(response);
  }

  // 15. Get Dashboard Statistics
  async getDashboardStats(token: string): Promise<DashboardStats> {
    const response = await fetch(`${BASE_URL}/dashboard/stats/`, {
      method: 'GET',
      headers: this.getAuthHeaders(token),
    });

    return this.handleResponse<DashboardStats>(response);
  }

  // JWT Token Management Utilities
  getStoredAccessToken(): string | null {
    return localStorage.getItem('kmrl-access-token');
  }

  getStoredRefreshToken(): string | null {
    return localStorage.getItem('kmrl-refresh-token');
  }

  storeTokens(accessToken: string, refreshToken: string, accessExpiresAt: string, refreshExpiresAt: string): void {
    localStorage.setItem('kmrl-access-token', accessToken);
    localStorage.setItem('kmrl-refresh-token', refreshToken);
    localStorage.setItem('kmrl-access-expires-at', accessExpiresAt);
    localStorage.setItem('kmrl-refresh-expires-at', refreshExpiresAt);
  }

  removeTokens(): void {
    localStorage.removeItem('kmrl-access-token');
    localStorage.removeItem('kmrl-refresh-token');
    localStorage.removeItem('kmrl-access-expires-at');
    localStorage.removeItem('kmrl-refresh-expires-at');
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

  isTokenExpired(expiresAt: string): boolean {
    return new Date() >= new Date(expiresAt);
  }

  isAccessTokenExpired(): boolean {
    const expiresAt = localStorage.getItem('kmrl-access-expires-at');
    return !expiresAt || this.isTokenExpired(expiresAt);
  }

  isRefreshTokenExpired(): boolean {
    const expiresAt = localStorage.getItem('kmrl-refresh-expires-at');
    return !expiresAt || this.isTokenExpired(expiresAt);
  }

  async getValidAccessToken(): Promise<string | null> {
    const accessToken = this.getStoredAccessToken();
    const refreshToken = this.getStoredRefreshToken();

    if (!accessToken || !refreshToken) {
      return null;
    }

    // If access token is not expired, return it
    if (!this.isAccessTokenExpired()) {
      return accessToken;
    }

    // If refresh token is expired, user needs to login again
    if (this.isRefreshTokenExpired()) {
      this.removeTokens();
      this.removeUser();
      return null;
    }

    // Try to refresh the access token
    try {
      const refreshResponse = await this.refreshToken(refreshToken);
      this.storeTokens(
        refreshResponse.access,
        refreshToken, // Keep the same refresh token
        refreshResponse.access_expires_at,
        localStorage.getItem('kmrl-refresh-expires-at')! // Keep the same refresh expiry
      );
      return refreshResponse.access;
    } catch (error) {
      console.error('Token refresh failed:', error);
      this.removeTokens();
      this.removeUser();
      return null;
    }
  }

  isAuthenticated(): boolean {
    const accessToken = this.getStoredAccessToken();
    const refreshToken = this.getStoredRefreshToken();
    return !!(accessToken && refreshToken && !this.isRefreshTokenExpired());
  }

  // Legacy compatibility methods
  getStoredToken(): string | null {
    return this.getStoredAccessToken();
  }

  storeToken(token: string): void {
    // For backward compatibility, treat as access token
    localStorage.setItem('kmrl-access-token', token);
  }

  removeToken(): void {
    this.removeTokens();
  }
}

export const authService = new AuthService();
export default authService;