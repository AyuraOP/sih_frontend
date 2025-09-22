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
  Shield,
  Database,
  Wifi,
  Zap,
  Activity,
  Trash2,
  Archive
} from "lucide-react";

interface Alert {
  id: string;
  type: 'critical' | 'warning' | 'info' | 'success';
  title: string;
  message: string;
  timestamp: string;
  source: string;
  category: string;
  acknowledged: boolean;
  resolved: boolean;
  priority: 'high' | 'medium' | 'low';
}

interface LogEntry {
  id: string;
  timestamp: string;
  level: 'ERROR' | 'WARNING' | 'INFO' | 'DEBUG';
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
      id: "ALT001",
      type: "critical",
      title: "Fleet Communication Lost",
      message: "Trainset KMRL-015 has lost communication with control center for 5+ minutes",
      timestamp: "2 minutes ago",
      source: "Fleet Management",
      category: "Communication",
      acknowledged: false,
      resolved: false,
      priority: "high"
    },
    {
      id: "ALT002",
      type: "warning",
      title: "Maintenance Overdue",
      message: "Trainset KMRL-008 maintenance is overdue by 2 hours",
      timestamp: "15 minutes ago",
      source: "Maintenance Hub",
      category: "Maintenance",
      acknowledged: true,
      resolved: false,
      priority: "medium"
    },
    {
      id: "ALT003",
      type: "info",
      title: "Weather Alert",
      message: "Heavy rain forecast may affect tonight's induction schedule",
      timestamp: "1 hour ago",
      source: "Weather Service",
      category: "Weather",
      acknowledged: false,
      resolved: false,
      priority: "low"
    },
    {
      id: "ALT004",
      type: "success",
      title: "Backup Completed",
      message: "Daily system backup completed successfully",
      timestamp: "2 hours ago",
      source: "System",
      category: "Backup",
      acknowledged: true,
      resolved: true,
      priority: "low"
    },
    {
      id: "ALT005",
      type: "critical",
      title: "Power Supply Issue",
      message: "Depot A power supply fluctuating - backup generator activated",
      timestamp: "3 hours ago",
      source: "Infrastructure",
      category: "Power",
      acknowledged: true,
      resolved: true,
      priority: "high"
    },
    {
      id: "ALT006",
      type: "warning",
      title: "High Energy Consumption",
      message: "Blue Line energy consumption 15% above normal levels",
      timestamp: "4 hours ago",
      source: "Analytics",
      category: "Performance",
      acknowledged: false,
      resolved: false,
      priority: "medium"
    }
  ]);

  const [logs, setLogs] = useState<LogEntry[]>([
    {
      id: "LOG001",
      timestamp: "2025-01-14 14:25:30",
      level: "ERROR",
      message: "Failed to connect to external API endpoint",
      category: "Integration",
      source: "API Gateway",
      userId: "EMP001"
    },
    {
      id: "LOG002",
      timestamp: "2025-01-14 14:20:15",
      level: "WARNING",
      message: "High memory usage detected on server-02",
      category: "Performance",
      source: "System Monitor"
    },
    {
      id: "LOG003",
      timestamp: "2025-01-14 14:15:45",
      level: "INFO",
      message: "User authentication successful",
      category: "Security",
      source: "Auth Service",
      userId: "EMP002"
    },
    {
      id: "LOG004",
      timestamp: "2025-01-14 14:10:20",
      level: "INFO",
      message: "Fleet status update completed",
      category: "Operations",
      source: "Fleet Manager"
    },
    {
      id: "LOG005",
      timestamp: "2025-01-14 14:05:10",
      level: "DEBUG",
      message: "Cache refresh initiated",
      category: "System",
      source: "Cache Manager"
    },
    {
      id: "LOG006",
      timestamp: "2025-01-14 14:00:00",
      level: "INFO",
      message: "Scheduled maintenance check completed",
      category: "Maintenance",
      source: "Maintenance Scheduler"
    },
    {
      id: "LOG007",
      timestamp: "2025-01-14 13:55:30",
      level: "WARNING",
      message: "Database connection pool near capacity",
      category: "Database",
      source: "DB Manager"
    },
    {
      id: "LOG008",
      timestamp: "2025-01-14 13:50:15",
      level: "INFO",
      message: "AI optimization algorithm executed",
      category: "AI",
      source: "Induction Planner"
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
      default: return 'bg-muted text-muted-foreground';
    }
  };

  const getAlertTypeIcon = (type: string) => {
    switch (type) {
      case 'critical': return <AlertTriangle className="h-4 w-4" />;
      case 'warning': return <AlertTriangle className="h-4 w-4" />;
      case 'info': return <Info className="h-4 w-4" />;
      case 'success': return <CheckCircle className="h-4 w-4" />;
      default: return <Bell className="h-4 w-4" />;
    }
  };

  const getLogLevelColor = (level: string) => {
    switch (level) {
      case 'ERROR': return 'text-destructive';
      case 'WARNING': return 'text-warning';
      case 'INFO': return 'text-info';
      case 'DEBUG': return 'text-muted-foreground';
      default: return 'text-foreground';
    }
  };

  const getLogLevelIcon = (level: string) => {
    switch (level) {
      case 'ERROR': return <AlertTriangle className="h-4 w-4" />;
      case 'WARNING': return <AlertTriangle className="h-4 w-4" />;
      case 'INFO': return <Info className="h-4 w-4" />;
      case 'DEBUG': return <Activity className="h-4 w-4" />;
      default: return <Info className="h-4 w-4" />;
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'Communication': return <Wifi className="h-4 w-4" />;
      case 'Maintenance': return <Wrench className="h-4 w-4" />;
      case 'Weather': return <Zap className="h-4 w-4" />;
      case 'Backup': return <Database className="h-4 w-4" />;
      case 'Power': return <Zap className="h-4 w-4" />;
      case 'Performance': return <Activity className="h-4 w-4" />;
      case 'Security': return <Shield className="h-4 w-4" />;
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
    const matchesSearch = log.message.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         log.category.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = selectedType === "all" || log.level.toLowerCase() === selectedType;
    const matchesCategory = selectedCategory === "all" || log.category === selectedCategory;
    
    return matchesSearch && matchesType && matchesCategory;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Alerts & Logs</h1>
          <p className="text-muted-foreground">Monitor system alerts and operational logs for KMRL fleet management</p>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Export Logs
          </Button>
          <Button variant="outline" size="sm">
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
        </div>
      </div>

      {/* Alert Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <div className="bg-destructive/10 p-2 rounded-lg">
                <AlertTriangle className="h-4 w-4 text-destructive" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Critical Alerts</p>
                <p className="text-2xl font-bold text-destructive">{alertStats.critical}</p>
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
                <p className="text-sm text-muted-foreground">Warnings</p>
                <p className="text-2xl font-bold text-warning">{alertStats.warning}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <div className="bg-primary/10 p-2 rounded-lg">
                <Bell className="h-4 w-4 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Unacknowledged</p>
                <p className="text-2xl font-bold">{alertStats.unacknowledged}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <div className="bg-info/10 p-2 rounded-lg">
                <Activity className="h-4 w-4 text-info" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total Alerts</p>
                <p className="text-2xl font-bold">{alertStats.total}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row gap-4">
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
            <div className="flex gap-2">
              <Select value={selectedType} onValueChange={setSelectedType}>
                <SelectTrigger className="w-32">
                  <SelectValue placeholder="Type" />
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
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  <SelectItem value="Communication">Communication</SelectItem>
                  <SelectItem value="Maintenance">Maintenance</SelectItem>
                  <SelectItem value="Weather">Weather</SelectItem>
                  <SelectItem value="Power">Power</SelectItem>
                  <SelectItem value="Performance">Performance</SelectItem>
                  <SelectItem value="Security">Security</SelectItem>
                  <SelectItem value="Operations">Operations</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="alerts" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="alerts" className="flex items-center space-x-2">
            <Bell className="h-4 w-4" />
            <span>Alerts ({filteredAlerts.length})</span>
          </TabsTrigger>
          <TabsTrigger value="logs" className="flex items-center space-x-2">
            <Activity className="h-4 w-4" />
            <span>System Logs ({filteredLogs.length})</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="alerts" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Bell className="h-5 w-5" />
                <span>Active Alerts</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <ScrollArea className="h-[600px]">
                <div className="space-y-0">
                  {filteredAlerts.map((alert, index) => (
                    <div key={alert.id} className={`p-6 border-b border-border hover:bg-muted/30 transition-colors ${index === filteredAlerts.length - 1 ? 'border-b-0' : ''}`}>
                      <div className="flex items-start justify-between">
                        <div className="flex items-start space-x-4">
                          <div className={`p-2 rounded-lg ${getAlertTypeColor(alert.type)}`}>
                            {getAlertTypeIcon(alert.type)}
                          </div>
                          
                          <div className="space-y-2">
                            <div className="flex items-center space-x-2">
                              <h3 className="font-semibold text-foreground">{alert.title}</h3>
                              <Badge className={getAlertTypeColor(alert.type)} variant="secondary">
                                {alert.type.toUpperCase()}
                              </Badge>
                              <Badge variant="outline" className="text-xs">
                                {alert.priority}
                              </Badge>
                            </div>
                            
                            <p className="text-sm text-muted-foreground">{alert.message}</p>
                            
                            <div className="flex items-center space-x-4 text-xs text-muted-foreground">
                              <div className="flex items-center space-x-1">
                                {getCategoryIcon(alert.category)}
                                <span>{alert.category}</span>
                              </div>
                              <div className="flex items-center space-x-1">
                                <Clock className="h-3 w-3" />
                                <span>{alert.timestamp}</span>
                              </div>
                              <span>Source: {alert.source}</span>
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
                              className="btn-government"
                              onClick={() => resolveAlert(alert.id)}
                            >
                              <CheckCircle className="h-4 w-4 mr-1" />
                              Resolve
                            </Button>
                          )}
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => deleteAlert(alert.id)}
                          >
                            <Trash2 className="h-4 w-4" />
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
              <CardTitle className="flex items-center space-x-2">
                <Activity className="h-5 w-5" />
                <span>System Logs</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <ScrollArea className="h-[600px]">
                <div className="space-y-0">
                  {filteredLogs.map((log, index) => (
                    <div key={log.id} className={`p-4 border-b border-border hover:bg-muted/30 transition-colors ${index === filteredLogs.length - 1 ? 'border-b-0' : ''}`}>
                      <div className="flex items-start space-x-3">
                        <div className={`p-1 rounded ${getLogLevelColor(log.level)}`}>
                          {getLogLevelIcon(log.level)}
                        </div>
                        
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-2">
                              <Badge variant="outline" className="text-xs">
                                {log.category}
                              </Badge>
                              <span className={`text-xs font-medium ${getLogLevelColor(log.level)}`}>
                                {log.level}
                              </span>
                              {log.userId && (
                                <Badge variant="secondary" className="text-xs">
                                  {log.userId}
                                </Badge>
                              )}
                            </div>
                            <span className="text-xs text-muted-foreground">
                              {log.timestamp}
                            </span>
                          </div>
                          <p className="text-sm mt-1">{log.message}</p>
                          <div className="flex items-center space-x-2 mt-1 text-xs text-muted-foreground">
                            <span>Source: {log.source}</span>
                          </div>
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
