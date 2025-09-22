import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { authService, LoginRequest, TokenRequest, ChangePasswordRequest, ResetPasswordRequest, UserProfile } from '@/services/auth';

interface User extends UserProfile {
  name?: string; // Computed from first_name + last_name
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (credentials: LoginRequest) => Promise<void>;
  loginWithToken: (credentials: TokenRequest) => Promise<void>;
  logout: () => Promise<void>;
  changePassword: (passwordData: ChangePasswordRequest) => Promise<void>;
  requestPasswordReset: (resetData: ResetPasswordRequest) => Promise<void>;
  refreshAccessToken: () => Promise<boolean>;
  error: string | null;
  clearError: () => void;
  sessionInfo: any;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [refreshToken, setRefreshToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [sessionInfo, setSessionInfo] = useState<any>(null);

  // Initialize auth state from localStorage
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const storedAccessToken = authService.getStoredAccessToken();
        const storedRefreshToken = authService.getStoredRefreshToken();
        const storedUser = authService.getStoredUser();
        
        if (storedAccessToken && storedRefreshToken && storedUser) {
          // Check if tokens are valid and refresh if needed
          const validAccessToken = await authService.getValidAccessToken();
          
          if (validAccessToken) {
            setToken(validAccessToken);
            setRefreshToken(authService.getStoredRefreshToken());
            
            // Compute name from first_name and last_name
            const userWithName = {
              ...storedUser,
              name: `${storedUser.first_name || ''} ${storedUser.last_name || ''}`.trim() || storedUser.email
            };
            setUser(userWithName);

            // Get session info
            try {
              const sessionData = await authService.getSessionStatus(validAccessToken);
              setSessionInfo(sessionData);
            } catch (error) {
              console.warn('Could not fetch session info:', error);
            }
          } else {
            // Tokens are invalid, clear everything
            authService.removeTokens();
            authService.removeUser();
          }
        }
      } catch (error) {
        console.error('Error initializing auth:', error);
        // Clear invalid data
        authService.removeTokens();
        authService.removeUser();
      } finally {
        setIsLoading(false);
      }
    };

    initializeAuth();
  }, []);

  // Auto-refresh token before expiry
  useEffect(() => {
    if (!token || !refreshToken) return;

    const checkTokenExpiry = async () => {
      try {
        const validToken = await authService.getValidAccessToken();
        if (validToken && validToken !== token) {
          setToken(validToken);
        } else if (!validToken) {
          // Tokens are invalid, logout
          await logout();
        }
      } catch (error) {
        console.error('Token refresh check failed:', error);
        await logout();
      }
    };

    // Check token expiry every 5 minutes
    const interval = setInterval(checkTokenExpiry, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, [token, refreshToken]);

  const login = async (credentials: LoginRequest) => {
    try {
      setIsLoading(true);
      setError(null);
      
      const response = await authService.login(credentials);
      
      // Store tokens and user data
      authService.storeTokens(
        response.access,
        response.refresh,
        response.access_expires_at,
        response.refresh_expires_at
      );
      authService.storeUser(response.user);
      
      // Compute name from first_name and last_name
      const userWithName = {
        ...response.user,
        name: `${response.user.first_name || ''} ${response.user.last_name || ''}`.trim() || response.user.email
      };
      
      setToken(response.access);
      setRefreshToken(response.refresh);
      setUser(userWithName);
      setSessionInfo({
        session_id: response.session_id,
        max_sessions: response.max_sessions,
        active_sessions_count: response.active_sessions_count
      });
      
      // Store legacy auth for backward compatibility
      localStorage.setItem('kmrl-auth', 'true');
      
    } catch (error: any) {
      setError(error.message || 'Login failed. Please check your credentials.');
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const loginWithToken = async (credentials: TokenRequest) => {
    try {
      setIsLoading(true);
      setError(null);
      
      const response = await authService.getToken(credentials);
      
      // Store tokens and user data
      authService.storeTokens(
        response.access,
        response.refresh,
        response.access_expires_at,
        response.refresh_expires_at
      );
      authService.storeUser(response.user);
      
      // Compute name from first_name and last_name
      const userWithName = {
        ...response.user,
        name: `${response.user.first_name || ''} ${response.user.last_name || ''}`.trim() || response.user.email
      };
      
      setToken(response.access);
      setRefreshToken(response.refresh);
      setUser(userWithName);
      setSessionInfo({
        session_id: response.session_id,
        max_sessions: response.max_sessions,
        active_sessions_count: response.active_sessions_count
      });
      
      // Store legacy auth for backward compatibility
      localStorage.setItem('kmrl-auth', 'true');
      
    } catch (error: any) {
      setError(error.message || 'Login failed. Please check your credentials.');
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      // Call logout API if tokens exist
      if (token && refreshToken) {
        try {
          await authService.logout(token, refreshToken);
        } catch (error) {
          // Even if API call fails, we should still clear local data
          console.warn('Logout API call failed:', error);
        }
      }
      
      // Clear all stored data
      authService.removeTokens();
      authService.removeUser();
      localStorage.removeItem('kmrl-auth'); // Legacy compatibility
      
      setToken(null);
      setRefreshToken(null);
      setUser(null);
      setSessionInfo(null);
      
    } catch (error: any) {
      setError(error.message || 'Logout failed.');
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const changePassword = async (passwordData: ChangePasswordRequest) => {
    try {
      setIsLoading(true);
      setError(null);
      
      if (!token) {
        throw new Error('No authentication token found');
      }
      
      await authService.changePassword(token, passwordData);
      
    } catch (error: any) {
      setError(error.message || 'Password change failed.');
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const requestPasswordReset = async (resetData: ResetPasswordRequest) => {
    try {
      setIsLoading(true);
      setError(null);
      
      await authService.requestPasswordReset(resetData);
      
    } catch (error: any) {
      setError(error.message || 'Password reset request failed.');
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const refreshAccessToken = async (): Promise<boolean> => {
    try {
      const validToken = await authService.getValidAccessToken();
      if (validToken) {
        setToken(validToken);
        return true;
      }
      return false;
    } catch (error) {
      console.error('Token refresh failed:', error);
      return false;
    }
  };

  const clearError = () => {
    setError(null);
  };

  const isAuthenticated = !!token && !!refreshToken && !!user;

  const value: AuthContextType = {
    user,
    token,
    refreshToken,
    isAuthenticated,
    isLoading,
    login,
    loginWithToken,
    logout,
    changePassword,
    requestPasswordReset,
    refreshAccessToken,
    error,
    clearError,
    sessionInfo,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default AuthContext;