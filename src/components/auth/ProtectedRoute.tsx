import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { RefreshCw } from 'lucide-react';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: string;
  requiredPermission?: string;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ 
  children, 
  requiredRole, 
  requiredPermission 
}) => {
  const { isAuthenticated, isLoading, user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      navigate('/');
      return;
    }

    // Check role-based access
    if (requiredRole && user) {
      const userRole = user.role ? (typeof user.role === 'object' ? user.role.name : user.role) : null;
      if (userRole !== requiredRole) {
        navigate('/dashboard'); // Redirect to dashboard if insufficient permissions
        return;
      }
    }

    // Check permission-based access (if implemented)
    if (requiredPermission && user) {
      // Implement permission checking logic based on your backend structure
      console.log('Permission check not implemented:', requiredPermission);
    }
  }, [isAuthenticated, isLoading, user, requiredRole, requiredPermission, navigate]);

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="text-center">
          <RefreshCw className="h-8 w-8 animate-spin mx-auto mb-4 text-primary" />
          <p className="text-muted-foreground">Authenticating...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null; // Will redirect to login
  }

  return <>{children}</>;
};

export default ProtectedRoute;