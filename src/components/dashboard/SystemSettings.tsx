import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { 
  Settings, 
  Shield, 
  Bell, 
  Database, 
  Wifi, 
  Monitor,
  Clock,
  Save,
  RefreshCw,
  Download,
  Upload,
  AlertTriangle,
  CheckCircle,
  Info,
  Server,
  HardDrive,
  Cpu,
  MemoryStick,
  Network
} from "lucide-react";

const SystemSettings = () => {
  const [settings, setSettings] = useState({
    // System Configuration
    systemName: "KMRL Fleet Management System",
    version: "v2.1.4",
    environment: "Production",
    maintenanceMode: false,
    
    // Notification Settings
    emailNotifications: true,
    smsNotifications: false,
    pushNotifications: true,
    alertThreshold: "medium",
    
    // Data Management
    dataRetention: "365",
    backupFrequency: "daily",
    autoBackup: true,
    compressionEnabled: true,
    
    // Performance Settings
    cacheTimeout: "30",
    maxConnections: "1000",
    logLevel: "info",
    debugMode: false,
    
    // Security Settings
    sessionTimeout: "480",
    passwordPolicy: "strict",
    twoFactorAuth: true,
    ipWhitelist: true,
    
    // Integration Settings
    apiRateLimit: "1000",
    webhookEnabled: true,
    realTimeUpdates: true,
    aiOptimization: true
  });

  const systemInfo = {
    uptime: "15 days, 8 hours, 23 minutes",
    lastBackup: "2025-01-14 02:30:00",
    nextBackup: "2025-01-15 02:30:00",
    diskUsage: "68%",
    memoryUsage: "45%",
    cpuUsage: "23%",
    networkStatus: "Connected",
    databaseStatus: "Healthy"
  };

  const recentLogs = [
    {
      timestamp: "2025-01-14 14:25:30",
      level: "INFO",
      message: "System backup completed successfully",
      category: "Backup"
    },
    {
      timestamp: "2025-01-14 14:20:15",
      level: "WARNING",
      message: "High memory usage detected on server-02",
      category: "Performance"
    },
    {
      timestamp: "2025-01-14 14:15:45",
      level: "INFO",
      message: "User authentication successful for EMP001",
      category: "Security"
    },
    {
      timestamp: "2025-01-14 14:10:20",
      level: "ERROR",
      message: "Failed to connect to external API endpoint",
      category: "Integration"
    },
    {
      timestamp: "2025-01-14 14:05:10",
      level: "INFO",
      message: "Fleet status update completed",
      category: "Operations"
    }
  ];

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
      case 'DEBUG': return <Settings className="h-4 w-4" />;
      default: return <Info className="h-4 w-4" />;
    }
  };

  const handleSettingChange = (key: string, value: any) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  const handleSaveSettings = () => {
    // In real app, this would save to backend
    console.log("Settings saved:", settings);
  };

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-foreground">System Settings</h1>
          <p className="text-sm sm:text-base text-muted-foreground">Configure KMRL Fleet Management System preferences and security</p>
        </div>
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
          <Button variant="outline" size="sm" className="w-full sm:w-auto">
            <RefreshCw className="h-4 w-4 mr-2" />
            <span className="hidden sm:inline">Refresh Status</span>
            <span className="sm:hidden">Refresh</span>
          </Button>
          <Button className="btn-government w-full sm:w-auto" onClick={handleSaveSettings}>
            <Save className="h-4 w-4 mr-2" />
            <span className="hidden sm:inline">Save Settings</span>
            <span className="sm:hidden">Save</span>
          </Button>
        </div>
      </div>

      {/* System Status Overview */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <Card>
          <CardContent className="p-3 sm:p-4 lg:p-6">
            <div className="flex items-center space-x-2">
              <div className="bg-success/10 p-1.5 sm:p-2 rounded-lg">
                <Server className="h-3 w-3 sm:h-4 sm:w-4 text-success" />
              </div>
              <div className="min-w-0">
                <p className="text-xs sm:text-sm text-muted-foreground truncate">System Status</p>
                <p className="text-sm sm:text-lg font-bold text-success">Operational</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-3 sm:p-4 lg:p-6">
            <div className="flex items-center space-x-2">
              <div className="bg-info/10 p-1.5 sm:p-2 rounded-lg">
                <Clock className="h-3 w-3 sm:h-4 sm:w-4 text-info" />
              </div>
              <div className="min-w-0">
                <p className="text-xs sm:text-sm text-muted-foreground truncate">Uptime</p>
                <p className="text-xs sm:text-sm font-bold truncate">{systemInfo.uptime}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-3 sm:p-4 lg:p-6">
            <div className="flex items-center space-x-2">
              <div className="bg-warning/10 p-1.5 sm:p-2 rounded-lg">
                <HardDrive className="h-3 w-3 sm:h-4 sm:w-4 text-warning" />
              </div>
              <div className="min-w-0">
                <p className="text-xs sm:text-sm text-muted-foreground truncate">Disk Usage</p>
                <p className="text-sm sm:text-lg font-bold">{systemInfo.diskUsage}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-3 sm:p-4 lg:p-6">
            <div className="flex items-center space-x-2">
              <div className="bg-primary/10 p-1.5 sm:p-2 rounded-lg">
                <Database className="h-3 w-3 sm:h-4 sm:w-4 text-primary" />
              </div>
              <div className="min-w-0">
                <p className="text-xs sm:text-sm text-muted-foreground truncate">Database</p>
                <p className="text-sm sm:text-lg font-bold text-success">Healthy</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="general" className="w-full">
        <TabsList className="grid w-full grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 h-auto">
          <TabsTrigger value="general" className="text-xs sm:text-sm py-2">General</TabsTrigger>
          <TabsTrigger value="notifications" className="text-xs sm:text-sm py-2">Notifications</TabsTrigger>
          <TabsTrigger value="security" className="text-xs sm:text-sm py-2">Security</TabsTrigger>
          <TabsTrigger value="performance" className="text-xs sm:text-sm py-2">Performance</TabsTrigger>
          <TabsTrigger value="data" className="text-xs sm:text-sm py-2">Data</TabsTrigger>
          <TabsTrigger value="logs" className="text-xs sm:text-sm py-2">Logs</TabsTrigger>
        </TabsList>

        <TabsContent value="general" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Settings className="h-5 w-5" />
                <span>General Configuration</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="systemName">System Name</Label>
                  <Input
                    id="systemName"
                    value={settings.systemName}
                    onChange={(e) => handleSettingChange('systemName', e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="version">Version</Label>
                  <Input
                    id="version"
                    value={settings.version}
                    disabled
                    className="bg-muted"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="environment">Environment</Label>
                  <Select value={settings.environment} onValueChange={(value) => handleSettingChange('environment', value)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Production">Production</SelectItem>
                      <SelectItem value="Staging">Staging</SelectItem>
                      <SelectItem value="Development">Development</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="maintenanceMode">Maintenance Mode</Label>
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="maintenanceMode"
                      checked={settings.maintenanceMode}
                      onCheckedChange={(checked) => handleSettingChange('maintenanceMode', checked)}
                    />
                    <Label htmlFor="maintenanceMode" className="text-sm">
                      {settings.maintenanceMode ? 'Enabled' : 'Disabled'}
                    </Label>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notifications" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Bell className="h-5 w-5" />
                <span>Notification Settings</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="emailNotifications">Email Notifications</Label>
                    <p className="text-sm text-muted-foreground">Receive system alerts via email</p>
                  </div>
                  <Switch
                    id="emailNotifications"
                    checked={settings.emailNotifications}
                    onCheckedChange={(checked) => handleSettingChange('emailNotifications', checked)}
                  />
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="smsNotifications">SMS Notifications</Label>
                    <p className="text-sm text-muted-foreground">Receive critical alerts via SMS</p>
                  </div>
                  <Switch
                    id="smsNotifications"
                    checked={settings.smsNotifications}
                    onCheckedChange={(checked) => handleSettingChange('smsNotifications', checked)}
                  />
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="pushNotifications">Push Notifications</Label>
                    <p className="text-sm text-muted-foreground">Receive real-time browser notifications</p>
                  </div>
                  <Switch
                    id="pushNotifications"
                    checked={settings.pushNotifications}
                    onCheckedChange={(checked) => handleSettingChange('pushNotifications', checked)}
                  />
                </div>
                <Separator />
                <div className="space-y-2">
                  <Label htmlFor="alertThreshold">Alert Threshold</Label>
                  <Select value={settings.alertThreshold} onValueChange={(value) => handleSettingChange('alertThreshold', value)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="low">Low - All notifications</SelectItem>
                      <SelectItem value="medium">Medium - Important notifications</SelectItem>
                      <SelectItem value="high">High - Critical notifications only</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="security" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Shield className="h-5 w-5" />
                <span>Security Settings</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="sessionTimeout">Session Timeout (minutes)</Label>
                  <Input
                    id="sessionTimeout"
                    type="number"
                    value={settings.sessionTimeout}
                    onChange={(e) => handleSettingChange('sessionTimeout', e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="passwordPolicy">Password Policy</Label>
                  <Select value={settings.passwordPolicy} onValueChange={(value) => handleSettingChange('passwordPolicy', value)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="basic">Basic - 8 characters minimum</SelectItem>
                      <SelectItem value="standard">Standard - 12 characters, mixed case</SelectItem>
                      <SelectItem value="strict">Strict - 16 characters, special chars</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="twoFactorAuth">Two-Factor Authentication</Label>
                    <p className="text-sm text-muted-foreground">Require 2FA for all users</p>
                  </div>
                  <Switch
                    id="twoFactorAuth"
                    checked={settings.twoFactorAuth}
                    onCheckedChange={(checked) => handleSettingChange('twoFactorAuth', checked)}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="ipWhitelist">IP Whitelist</Label>
                    <p className="text-sm text-muted-foreground">Restrict access to specific IP addresses</p>
                  </div>
                  <Switch
                    id="ipWhitelist"
                    checked={settings.ipWhitelist}
                    onCheckedChange={(checked) => handleSettingChange('ipWhitelist', checked)}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="performance" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Monitor className="h-5 w-5" />
                <span>Performance Settings</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="cacheTimeout">Cache Timeout (minutes)</Label>
                  <Input
                    id="cacheTimeout"
                    type="number"
                    value={settings.cacheTimeout}
                    onChange={(e) => handleSettingChange('cacheTimeout', e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="maxConnections">Max Connections</Label>
                  <Input
                    id="maxConnections"
                    type="number"
                    value={settings.maxConnections}
                    onChange={(e) => handleSettingChange('maxConnections', e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="logLevel">Log Level</Label>
                  <Select value={settings.logLevel} onValueChange={(value) => handleSettingChange('logLevel', value)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="debug">Debug</SelectItem>
                      <SelectItem value="info">Info</SelectItem>
                      <SelectItem value="warning">Warning</SelectItem>
                      <SelectItem value="error">Error</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="debugMode">Debug Mode</Label>
                    <p className="text-sm text-muted-foreground">Enable detailed logging</p>
                  </div>
                  <Switch
                    id="debugMode"
                    checked={settings.debugMode}
                    onCheckedChange={(checked) => handleSettingChange('debugMode', checked)}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="data" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Database className="h-5 w-5" />
                <span>Data Management</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="dataRetention">Data Retention (days)</Label>
                  <Input
                    id="dataRetention"
                    type="number"
                    value={settings.dataRetention}
                    onChange={(e) => handleSettingChange('dataRetention', e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="backupFrequency">Backup Frequency</Label>
                  <Select value={settings.backupFrequency} onValueChange={(value) => handleSettingChange('backupFrequency', value)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="hourly">Hourly</SelectItem>
                      <SelectItem value="daily">Daily</SelectItem>
                      <SelectItem value="weekly">Weekly</SelectItem>
                      <SelectItem value="monthly">Monthly</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="autoBackup">Automatic Backup</Label>
                    <p className="text-sm text-muted-foreground">Enable scheduled backups</p>
                  </div>
                  <Switch
                    id="autoBackup"
                    checked={settings.autoBackup}
                    onCheckedChange={(checked) => handleSettingChange('autoBackup', checked)}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="compressionEnabled">Compression</Label>
                    <p className="text-sm text-muted-foreground">Compress backup files</p>
                  </div>
                  <Switch
                    id="compressionEnabled"
                    checked={settings.compressionEnabled}
                    onCheckedChange={(checked) => handleSettingChange('compressionEnabled', checked)}
                  />
                </div>
              </div>
              
              <Separator />
              
              <div className="space-y-4">
                <h4 className="font-semibold">Backup Information</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-muted-foreground">Last Backup</p>
                    <p className="font-medium">{systemInfo.lastBackup}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Next Backup</p>
                    <p className="font-medium">{systemInfo.nextBackup}</p>
                  </div>
                </div>
                <div className="flex space-x-2">
                  <Button variant="outline" size="sm">
                    <Download className="h-4 w-4 mr-2" />
                    Download Backup
                  </Button>
                  <Button variant="outline" size="sm">
                    <Upload className="h-4 w-4 mr-2" />
                    Restore Backup
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="logs" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Settings className="h-5 w-5" />
                <span>System Logs</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentLogs.map((log, index) => (
                  <div key={index} className="flex items-start space-x-3 p-3 rounded-lg bg-muted/30">
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
                        </div>
                        <span className="text-xs text-muted-foreground">
                          {log.timestamp}
                        </span>
                      </div>
                      <p className="text-sm mt-1">{log.message}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default SystemSettings;
