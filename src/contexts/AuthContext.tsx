import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { authService, LoginRequest, TokenRequest, ChangePasswordRequest, ResetPasswordRequest, UserProfile } from '@/services/auth';

interface User extends UserProfile {
  name?: string; // Computed from first_name + last_name
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (credentials: LoginRequest) => Promise<void>;
  loginWithToken: (credentials: TokenRequest) => Promise<void>;
  logout: () => Promise<void>;
  changePassword: (passwordData: ChangePasswordRequest) => Promise<void>;
  requestPasswordReset: (resetData: ResetPasswordRequest) => Promise<void>;
  error: string | null;
  clearError: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Initialize auth state from localStorage
  useEffect(() => {
    const initializeAuth = () => {
      try {
        const storedToken = authService.getStoredToken();
        const storedUser = authService.getStoredUser();
        
        if (storedToken && storedUser) {
          setToken(storedToken);
          // Compute name from first_name and last_name
          const userWithName = {
            ...storedUser,
            name: `${storedUser.first_name || ''} ${storedUser.last_name || ''}`.trim() || storedUser.email
          };
          setUser(userWithName);
        }
      } catch (error) {
        console.error('Error initializing auth:', error);
        // Clear invalid data
        authService.removeToken();
        authService.removeUser();
      } finally {
        setIsLoading(false);
      }
    };

    initializeAuth();
  }, []);

  const login = async (credentials: LoginRequest) => {
    try {
      setIsLoading(true);
      setError(null);
      
      const response = await authService.login(credentials);
      
      // Store token and user data
      authService.storeToken(response.token);
      authService.storeUser(response.user);
      
      // Compute name from first_name and last_name
      const userWithName = {
        ...response.user,
        name: `${response.user.first_name || ''} ${response.user.last_name || ''}`.trim() || response.user.email
      };
      
      setToken(response.token);
      setUser(userWithName);
      
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
      
      // Store token and user data
      authService.storeToken(response.token);
      authService.storeUser(response.user);
      
      // Compute name from first_name and last_name
      const userWithName = {
        ...response.user,
        name: `${response.user.first_name || ''} ${response.user.last_name || ''}`.trim() || response.user.email
      };
      
      setToken(response.token);
      setUser(userWithName);
      
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
      
      // Call logout API if token exists
      if (token) {
        try {
          await authService.logout(token);
        } catch (error) {
          // Even if API call fails, we should still clear local data
          console.warn('Logout API call failed:', error);
        }
      }
      
      // Clear all stored data
      authService.removeToken();
      authService.removeUser();
      localStorage.removeItem('kmrl-auth'); // Legacy compatibility
      
      setToken(null);
      setUser(null);
      
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

  const clearError = () => {
    setError(null);
  };

  const isAuthenticated = !!token && !!user;

  const value: AuthContextType = {
    user,
    token,
    isAuthenticated,
    isLoading,
    login,
    loginWithToken,
    logout,
    changePassword,
    requestPasswordReset,
    error,
    clearError,
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

