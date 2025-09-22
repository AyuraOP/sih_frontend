import { useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

/**
 * Custom hook to handle automatic token refresh and authentication errors
 */
export const useAuthInterceptor = () => {
  const { token, refreshAccessToken, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    // Set up automatic token refresh
    if (!token || !isAuthenticated) return;

    const checkAndRefreshToken = async () => {
      try {
        const success = await refreshAccessToken();
        if (!success) {
          // Token refresh failed, logout user
          await logout();
          navigate('/');
        }
      } catch (error) {
        console.error('Token refresh failed:', error);
        await logout();
        navigate('/');
      }
    };

    // Check token every 5 minutes
    const interval = setInterval(checkAndRefreshToken, 5 * 60 * 1000);

    return () => clearInterval(interval);
  }, [token, isAuthenticated, refreshAccessToken, logout, navigate]);

  // Create a fetch wrapper that automatically handles authentication
  const authenticatedFetch = async (url: string, options: RequestInit = {}) => {
    const validToken = await authService.getValidAccessToken();
    
    if (!validToken) {
      await logout();
      navigate('/');
      throw new Error('Authentication required');
    }

    const headers = {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${validToken}`,
      ...options.headers,
    };

    const response = await fetch(url, {
      ...options,
      headers,
    });

    // Handle 401 responses
    if (response.status === 401) {
      await logout();
      navigate('/');
      throw new Error('Authentication failed');
    }

    return response;
  };

  return { authenticatedFetch };
};