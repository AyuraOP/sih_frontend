import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { 
  Monitor, 
  Clock, 
  Smartphone, 
  Laptop, 
  MapPin,
  AlertTriangle,
  CheckCircle,
  X,
  RefreshCw,
  LogOut,
  Shield,
  Activity
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { authService } from "@/services/auth";
import { toast } from "@/hooks/use-toast";

interface SessionManagerProps {
  onSessionTerminated?: () => void;
}

const SessionManager: React.FC<SessionManagerProps> = ({ onSessionTerminated }) => {
  const { token, sessionInfo } = useAuth();
  const [sessions, setSessions] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [showSessionDialog, setShowSessionDialog] = useState(false);

  useEffect(() => {
    if (token && showSessionDialog) {
      loadSessions();
    }
  }, [token, showSessionDialog]);

  const loadSessions = async () => {
    try {
      setLoading(true);
      const response = await authService.getUserSessions(token!);
      setSessions(response.sessions || []);
    } catch (error: any) {
      toast({
        title: "Error Loading Sessions",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const terminateSession = async (sessionId: string) => {
    try {
      await authService.terminateSession(token!, sessionId);
      toast({
        title: "Session Terminated",
        description: "Session has been terminated successfully",
      });
      loadSessions();
      if (onSessionTerminated) {
        onSessionTerminated();
      }
    } catch (error: any) {
      toast({
        title: "Error Terminating Session",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const terminateAllOtherSessions = async () => {
    try {
      await authService.terminateSession(token!, '', true);
      toast({
        title: "Sessions Terminated",
        description: "All other sessions have been terminated",
      });
      loadSessions();
      if (onSessionTerminated) {
        onSessionTerminated();
      }
    } catch (error: any) {
      toast({
        title: "Error Terminating Sessions",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const getDeviceIcon = (userAgent: string) => {
    if (userAgent.toLowerCase().includes('mobile')) {
      return <Smartphone className="h-4 w-4" />;
    }
    return <Laptop className="h-4 w-4" />;
  };

  const formatTimeRemaining = (seconds: number) => {
    if (seconds <= 0) return 'Expired';
    
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    
    if (hours > 0) {
      return `${hours}h ${minutes}m`;
    }
    return `${minutes}m`;
  };

  return (
    <Dialog open={showSessionDialog} onOpenChange={setShowSessionDialog}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="flex items-center space-x-2">
          <Monitor className="h-4 w-4" />
          <span className="hidden sm:inline">Sessions</span>
          {sessionInfo && (
            <Badge variant="secondary" className="ml-1">
              {sessionInfo.active_sessions_count}
            </Badge>
          )}
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[90vh]">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <Shield className="h-5 w-5" />
            <span>Active Sessions</span>
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          {/* Session Overview */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center space-x-2">
                  <div className="bg-primary/10 p-2 rounded-lg">
                    <Activity className="h-4 w-4 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Active Sessions</p>
                    <p className="text-xl font-bold">
                      {sessionInfo?.active_sessions_count || 0} / {sessionInfo?.max_sessions || 1}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center space-x-2">
                  <div className="bg-warning/10 p-2 rounded-lg">
                    <Clock className="h-4 w-4 text-warning" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Expiring Soon</p>
                    <p className="text-xl font-bold">
                      {sessions.filter(s => s.is_expiring_soon).length}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center space-x-2">
                  <div className="bg-success/10 p-2 rounded-lg">
                    <CheckCircle className="h-4 w-4 text-success" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Current Session</p>
                    <p className="text-sm font-medium">
                      {sessions.find(s => s.is_current) ? 'Active' : 'Unknown'}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Session Actions */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Button variant="outline" size="sm" onClick={loadSessions} disabled={loading}>
                <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
                Refresh
              </Button>
            </div>
            <Button 
              variant="destructive" 
              size="sm" 
              onClick={terminateAllOtherSessions}
              disabled={sessions.filter(s => !s.is_current).length === 0}
            >
              <LogOut className="h-4 w-4 mr-2" />
              Terminate All Others
            </Button>
          </div>

          {/* Sessions List */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Session Details</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <ScrollArea className="h-96">
                <div className="space-y-0">
                  {loading ? (
                    <div className="flex items-center justify-center p-8">
                      <RefreshCw className="h-6 w-6 animate-spin" />
                    </div>
                  ) : sessions.length === 0 ? (
                    <div className="text-center p-8 text-muted-foreground">
                      No active sessions found
                    </div>
                  ) : (
                    sessions.map((session, index) => (
                      <div key={session.id} className={`p-4 border-b border-border hover:bg-muted/30 transition-colors ${index === sessions.length - 1 ? 'border-b-0' : ''}`}>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-4">
                            <div className="bg-primary/10 p-2 rounded-lg">
                              {getDeviceIcon(session.user_agent)}
                            </div>
                            
                            <div className="space-y-1">
                              <div className="flex items-center space-x-2">
                                <span className="font-medium">
                                  {session.is_current ? 'Current Session' : 'Remote Session'}
                                </span>
                                {session.is_current && (
                                  <Badge className="bg-success text-success-foreground">
                                    <CheckCircle className="h-3 w-3 mr-1" />
                                    Current
                                  </Badge>
                                )}
                                {session.is_expiring_soon && (
                                  <Badge variant="destructive">
                                    <AlertTriangle className="h-3 w-3 mr-1" />
                                    Expiring Soon
                                  </Badge>
                                )}
                              </div>
                              
                              <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                                <div className="flex items-center space-x-1">
                                  <MapPin className="h-3 w-3" />
                                  <span>{session.ip_address}</span>
                                </div>
                                <div className="flex items-center space-x-1">
                                  <Clock className="h-3 w-3" />
                                  <span>
                                    Login: {new Date(session.login_time).toLocaleString()}
                                  </span>
                                </div>
                              </div>
                              
                              <div className="space-y-1">
                                <div className="flex items-center justify-between text-sm">
                                  <span>Time Remaining</span>
                                  <span className={`font-medium ${session.is_expiring_soon ? 'text-destructive' : ''}`}>
                                    {formatTimeRemaining(session.time_remaining_seconds)}
                                  </span>
                                </div>
                                <Progress 
                                  value={Math.max(0, Math.min(100, (session.time_remaining_seconds / (60 * 60)) * 100))} 
                                  className="h-2" 
                                />
                              </div>
                            </div>
                          </div>
                          
                          <div className="flex items-center space-x-2">
                            {!session.is_current && (
                              <Button
                                size="sm"
                                variant="destructive"
                                onClick={() => terminateSession(session.id)}
                              >
                                <X className="h-4 w-4 mr-1" />
                                Terminate
                              </Button>
                            )}
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default SessionManager;