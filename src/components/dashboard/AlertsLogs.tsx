import { useState, useEffect, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ScrollArea } from "@/components/ui/scroll-area";
import { 
  AlertTriangle, 
  Bell, 
  CheckCircle, 
  Info, 
  X,
  Filter,
  Search,
  RefreshCw,
  Download,
  Eye,
  Clock,
  Train,
  Wrench,
  Zap
} from "lucide-react";

interface Alert {
  id: string;
  title: string;
  message: string;
  type: 'critical' | 'warning' | 'info' | 'success';
  category: string;
  timestamp: string;
  acknowledged: boolean;
  resolved: boolean;
  source: string;
}

interface Log {
  id: string;
  timestamp: string;
  level: 'info' | 'warning' | 'error' | 'success';
  message: string;
  category: string;
  source: string;
  userId?: string;
  details?: string;
}

interface AlertsLogsProps {
  onAlertCountChange?: (count: number) => void;
}

const AlertsLogs: React.FC<AlertsLogsProps> = ({ onAlertCountChange }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedType, setSelectedType] = useState("all");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [alerts, setAlerts] = useState<Alert[]>([
    {
      id: "1",
      title: "Critical System Alert",
      message: "Train KMR-015 experiencing brake system anomaly",
      type: "critical",
      category: "Safety",
      timestamp: "2025-01-14 14:30:00",
      acknowledged: false,
      resolved: false,
      source: "Brake Monitoring System"
    },
    {
      id: "2",
      title: "Maintenance Due",
      message: "KMR-008 requires scheduled maintenance",
      type: "warning",
      category: "Maintenance",
      timestamp: "2025-01-14 13:45:00",
      acknowledged: false,
      resolved: false,
      source: "Maintenance Scheduler"
    },
    {
      id: "3",
      title: "Performance Degradation",
      message: "KMR-012 showing reduced efficiency",
      type: "warning",
      category: "Performance",
      timestamp: "2025-01-14 12:20:00",
      acknowledged: false,
      resolved: false,
      source: "Performance Monitor"
    },
    {
      id: "4",
      title: "System Update Complete",
      message: "Fleet management system updated successfully",
      type: "success",
      category: "System",
      timestamp: "2025-01-14 11:15:00",
      acknowledged: true,
      resolved: true,
      source: "System Admin"
    },
    {
      id: "5",
      title: "Network Connectivity Issue",
      message: "Temporary network interruption resolved",
      type: "info",
      category: "Network",
      timestamp: "2025-01-14 10:30:00",
      acknowledged: true,
      resolved: true,
      source: "Network Monitor"
    },
    {
      id: "6",
      title: "AI Model Update",
      message: "Induction planning AI model updated",
      type: "info",
      category: "AI",
      timestamp: "2025-01-14 09:45:00",
      acknowledged: false,
      resolved: false,
      source: "AI System"
    }
  ]);

  const [logs, setLogs] = useState<Log[]>([
    {
      id: "1",
      timestamp: "2025-01-14 14:35:00",
      level: "info",
      message: "User login: admin@kmrl.gov.in",
      category: "Authentication",
      source: "Auth System",
      userId: "admin"
    },
    {
      id: "2",
      timestamp: "2025-01-14 14:30:00",
      level: "error",
      message: "Brake system anomaly detected on KMR-015",
      category: "Safety",
      source: "Brake Monitoring",
      details: "Pressure reading: 85% of normal"
    },
    {
      id: "3",
      timestamp: "2025-01-14 14:25:00",
      level: "warning",
      message: "Maintenance due for KMR-008",
      category: "Maintenance",
      source: "Scheduler"
    },
    {
      id: "4",
      timestamp: "2025-01-14 14:20:00",
      level: "info",
      message: "Fleet status updated",
      category: "Operations",
      source: "Fleet Manager"
    },
    {
      id: "5",
      timestamp: "2025-01-14 14:15:00",
      level: "success",
      message: "System backup completed",
      category: "System",
      source: "Backup Service"
    }
  ]);

  const alertStats = useMemo(() => ({
    total: alerts.length,
    critical: alerts.filter(a => a.type === 'critical').length,
    warning: alerts.filter(a => a.type === 'warning').length,
    unacknowledged: alerts.filter(a => !a.acknowledged).length
  }), [alerts]);

  // Notify parent component of alert count changes
  useEffect(() => {
    if (onAlertCountChange) {
      const unreadCount = alerts.filter(a => !a.acknowledged).length;
      onAlertCountChange(unreadCount);
    }
  }, [alerts, onAlertCountChange]);

  const getAlertTypeColor = (type: string) => {
    switch (type) {
      case 'critical': return 'bg-destructive text-destructive-foreground';
      case 'warning': return 'bg-warning text-warning-foreground';
      case 'info': return 'bg-info text-info-foreground';
      case 'success': return 'bg-success text-success-foreground';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getLogLevelColor = (level: string) => {
    switch (level) {
      case 'error': return 'text-red-600';
      case 'warning': return 'text-yellow-600';
      case 'info': return 'text-blue-600';
      case 'success': return 'text-green-600';
      default: return 'text-gray-600';
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'Safety': return <AlertTriangle className="h-4 w-4" />;
      case 'Maintenance': return <Wrench className="h-4 w-4" />;
      case 'Performance': return <Zap className="h-4 w-4" />;
      case 'System': return <Info className="h-4 w-4" />;
      case 'Network': return <Bell className="h-4 w-4" />;
      case 'Operations': return <Train className="h-4 w-4" />;
      default: return <Info className="h-4 w-4" />;
    }
  };

  const acknowledgeAlert = (alertId: string) => {
    setAlerts(prev => prev.map(alert => 
      alert.id === alertId ? { ...alert, acknowledged: true } : alert
    ));
  };

  const resolveAlert = (alertId: string) => {
    setAlerts(prev => prev.map(alert => 
      alert.id === alertId ? { ...alert, resolved: true, acknowledged: true } : alert
    ));
  };

  const deleteAlert = (alertId: string) => {
    setAlerts(prev => prev.filter(alert => alert.id !== alertId));
  };

  const filteredAlerts = alerts.filter(alert => {
    const matchesSearch = alert.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         alert.message.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = selectedType === "all" || alert.type === selectedType;
    const matchesCategory = selectedCategory === "all" || alert.category === selectedCategory;
    return matchesSearch && matchesType && matchesCategory;
  });

  const filteredLogs = logs.filter(log => {
    const matchesSearch = log.message.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesLevel = selectedType === "all" || log.level === selectedType;
    const matchesCategory = selectedCategory === "all" || log.category === selectedCategory;
    return matchesSearch && matchesLevel && matchesCategory;
  });

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-foreground">Alerts & Logs</h1>
          <p className="text-sm sm:text-base text-muted-foreground">Monitor system alerts and operational logs for KMRL fleet management</p>
        </div>
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
          <Button variant="outline" size="sm" className="w-full sm:w-auto">
            <Download className="h-4 w-4 mr-2" />
            <span className="hidden sm:inline">Export Logs</span>
            <span className="sm:hidden">Export</span>
          </Button>
          <Button variant="outline" size="sm" className="w-full sm:w-auto">
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
        </div>
      </div>

      {/* Alert Statistics */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <Card>
          <CardContent className="p-3 sm:p-4 lg:p-6">
            <div className="flex items-center space-x-2">
              <div className="bg-destructive/10 p-1.5 sm:p-2 rounded-lg">
                <AlertTriangle className="h-3 w-3 sm:h-4 sm:w-4 text-destructive" />
              </div>
              <div className="min-w-0">
                <p className="text-xs sm:text-sm font-medium text-muted-foreground truncate">Total Alerts</p>
                <p className="text-lg sm:text-xl lg:text-2xl font-bold">{alertStats.total}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-3 sm:p-4 lg:p-6">
            <div className="flex items-center space-x-2">
              <div className="bg-destructive/10 p-1.5 sm:p-2 rounded-lg">
                <AlertTriangle className="h-3 w-3 sm:h-4 sm:w-4 text-destructive" />
              </div>
              <div className="min-w-0">
                <p className="text-xs sm:text-sm font-medium text-muted-foreground truncate">Critical</p>
                <p className="text-lg sm:text-xl lg:text-2xl font-bold text-destructive">{alertStats.critical}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <div className="bg-warning/10 p-2 rounded-lg">
                <AlertTriangle className="h-4 w-4 text-warning" />
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Warnings</p>
                <p className="text-2xl font-bold text-warning">{alertStats.warning}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <div className="bg-blue-500/10 p-2 rounded-lg">
                <Bell className="h-4 w-4 text-blue-500" />
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Unacknowledged</p>
                <p className="text-2xl font-bold text-blue-500">{alertStats.unacknowledged}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search alerts and logs..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>
        <Select value={selectedType} onValueChange={setSelectedType}>
          <SelectTrigger className="w-full sm:w-48">
            <SelectValue placeholder="Filter by type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Types</SelectItem>
            <SelectItem value="critical">Critical</SelectItem>
            <SelectItem value="warning">Warning</SelectItem>
            <SelectItem value="info">Info</SelectItem>
            <SelectItem value="success">Success</SelectItem>
          </SelectContent>
        </Select>
        <Select value={selectedCategory} onValueChange={setSelectedCategory}>
          <SelectTrigger className="w-full sm:w-48">
            <SelectValue placeholder="Filter by category" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Categories</SelectItem>
            <SelectItem value="Safety">Safety</SelectItem>
            <SelectItem value="Maintenance">Maintenance</SelectItem>
            <SelectItem value="Performance">Performance</SelectItem>
            <SelectItem value="System">System</SelectItem>
            <SelectItem value="Network">Network</SelectItem>
            <SelectItem value="AI">AI</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="alerts" className="space-y-4">
        <TabsList>
          <TabsTrigger value="alerts">Alerts</TabsTrigger>
          <TabsTrigger value="logs">System Logs</TabsTrigger>
        </TabsList>

        <TabsContent value="alerts" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Active Alerts</CardTitle>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-96">
                <div className="space-y-4">
                  {filteredAlerts.map((alert) => (
                    <div key={alert.id} className="border rounded-lg p-4 space-y-3">
                      <div className="flex items-start justify-between">
                        <div className="flex items-start space-x-3">
                          <div className="flex-shrink-0">
                            {getCategoryIcon(alert.category)}
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center space-x-2 mb-1">
                              <h4 className="font-semibold">{alert.title}</h4>
                              <Badge className={getAlertTypeColor(alert.type)}>
                                {alert.type}
                              </Badge>
                              <Badge variant="outline">{alert.category}</Badge>
                            </div>
                            <p className="text-muted-foreground text-sm mb-2">{alert.message}</p>
                            <div className="flex items-center space-x-4 text-xs text-muted-foreground">
                              <span>Source: {alert.source}</span>
                              <span>•</span>
                              <span>{alert.timestamp}</span>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          {!alert.acknowledged && (
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => acknowledgeAlert(alert.id)}
                            >
                              <CheckCircle className="h-4 w-4 mr-1" />
                              Acknowledge
                            </Button>
                          )}
                          {!alert.resolved && (
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => resolveAlert(alert.id)}
                            >
                              <Eye className="h-4 w-4 mr-1" />
                              Resolve
                            </Button>
                          )}
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => deleteAlert(alert.id)}
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="logs" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>System Logs</CardTitle>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-96">
                <div className="space-y-3">
                  {filteredLogs.map((log) => (
                    <div key={log.id} className="flex items-start space-x-3 p-3 border rounded-lg">
                      <div className="flex-shrink-0">
                        <Clock className="h-4 w-4 text-muted-foreground" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-1">
                          <span className={`font-medium ${getLogLevelColor(log.level)}`}>
                            {log.level.toUpperCase()}
                          </span>
                          <Badge variant="outline">{log.category}</Badge>
                          <span className="text-xs text-muted-foreground">{log.timestamp}</span>
                        </div>
                        <p className="text-sm">{log.message}</p>
                        {log.details && (
                          <p className="text-xs text-muted-foreground mt-1">{log.details}</p>
                        )}
                        <div className="flex items-center space-x-2 mt-1 text-xs text-muted-foreground">
                          <span>Source: {log.source}</span>
                          {log.userId && (
                            <>
                              <span>•</span>
                              <span>User: {log.userId}</span>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AlertsLogs;