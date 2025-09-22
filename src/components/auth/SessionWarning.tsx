import { useState, useEffect } from 'react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { AlertTriangle, Clock, RefreshCw } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

const SessionWarning: React.FC = () => {
  const { sessionInfo, refreshAccessToken, logout } = useAuth();
  const [showWarning, setShowWarning] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState(0);

  useEffect(() => {
    if (sessionInfo?.is_expiring_soon && sessionInfo?.time_remaining_seconds) {
      setShowWarning(true);
      setTimeRemaining(sessionInfo.time_remaining_seconds);
    } else {
      setShowWarning(false);
    }
  }, [sessionInfo]);

  useEffect(() => {
    if (!showWarning || timeRemaining <= 0) return;

    const timer = setInterval(() => {
      setTimeRemaining(prev => {
        const newTime = prev - 1;
        if (newTime <= 0) {
          setShowWarning(false);
          logout(); // Auto logout when session expires
        }
        return newTime;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [showWarning, timeRemaining, logout]);

  const handleExtendSession = async () => {
    try {
      const success = await refreshAccessToken();
      if (success) {
        setShowWarning(false);
      }
    } catch (error) {
      console.error('Failed to extend session:', error);
    }
  };

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  if (!showWarning) return null;

  return (
    <div className="fixed top-4 right-4 z-50 w-96">
      <Alert className="border-warning bg-warning/10">
        <AlertTriangle className="h-4 w-4 text-warning" />
        <AlertDescription className="flex items-center justify-between">
          <div>
            <p className="font-medium text-warning">Session Expiring Soon</p>
            <p className="text-sm text-muted-foreground">
              Your session will expire in {formatTime(timeRemaining)}
            </p>
          </div>
          <div className="flex items-center space-x-2">
            <Button size="sm" variant="outline" onClick={handleExtendSession}>
              <RefreshCw className="h-4 w-4 mr-1" />
              Extend
            </Button>
          </div>
        </AlertDescription>
      </Alert>
    </div>
  );
};

export default SessionWarning;