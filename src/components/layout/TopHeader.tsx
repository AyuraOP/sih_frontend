import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { 
  Search, 
  Bell, 
  User, 
  LogOut,
  Menu,
  Wifi,
  AlertTriangle,
  CheckCircle,
  Info,
  Clock,
  Eye,
  X,
  Mail,
  Badge as BadgeIcon,
  Shield
} from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";
import { useAuth } from "@/contexts/AuthContext";

interface TopHeaderProps {
  currentTime: Date;
  onLogout: () => void;
  onToggleSidebar: () => void;
}

const TopHeader: React.FC<TopHeaderProps> = ({ currentTime, onLogout, onToggleSidebar }) => {
  const isMobile = useIsMobile();
  const { user } = useAuth();
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [logoutDialogOpen, setLogoutDialogOpen] = useState(false);
  const [notifications, setNotifications] = useState([
    {
      id: "NOTIF001",
      type: "critical",
      title: "Fleet Communication Lost",
      message: "Trainset KMRL-015 has lost communication with control center for 5+ minutes",
      timestamp: "2 minutes ago",
      read: false
    },
    {
      id: "NOTIF002", 
      type: "warning",
      title: "Maintenance Overdue",
      message: "Trainset KMRL-008 maintenance is overdue by 2 hours",
      timestamp: "15 minutes ago",
      read: false
    },
    {
      id: "NOTIF003",
      type: "info",
      title: "Weather Alert",
      message: "Heavy rain forecast may affect tonight's induction schedule",
      timestamp: "1 hour ago",
      read: false
    },
    {
      id: "NOTIF004",
      type: "success",
      title: "Backup Completed",
      message: "Daily system backup completed successfully",
      timestamp: "2 hours ago",
      read: true
    },
    {
      id: "NOTIF005",
      type: "critical",
      title: "Power Supply Issue",
      message: "Depot A power supply fluctuating - backup generator activated",
      timestamp: "3 hours ago",
      read: false
    },
    {
      id: "NOTIF006",
      type: "warning",
      title: "High Energy Consumption",
      message: "Blue Line energy consumption 15% above normal levels",
      timestamp: "4 hours ago",
      read: false
    }
  ]);

  const unreadCount = notifications.filter(n => !n.read).length;

  const markAsRead = (notificationId: string) => {
    setNotifications(prev => 
      prev.map(notification => 
        notification.id === notificationId 
          ? { ...notification, read: true }
          : notification
      )
    );
  };

  const markAllAsRead = () => {
    setNotifications(prev => 
      prev.map(notification => ({ ...notification, read: true }))
    );
  };

  const removeNotification = (notificationId: string) => {
    setNotifications(prev => 
      prev.filter(notification => notification.id !== notificationId)
    );
  };

  const handleLogoutClick = () => {
    setLogoutDialogOpen(true);
  };

  const handleLogoutConfirm = async () => {
    setLogoutDialogOpen(false);
    await onLogout();
  };

  const handleLogoutCancel = () => {
    setLogoutDialogOpen(false);
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'critical': return <AlertTriangle className="h-4 w-4 text-red-600" />;
      case 'warning': return <AlertTriangle className="h-4 w-4 text-yellow-600" />;
      case 'info': return <Info className="h-4 w-4 text-blue-600" />;
      case 'success': return <CheckCircle className="h-4 w-4 text-green-600" />;
      default: return <Bell className="h-4 w-4 text-gray-600" />;
    }
  };

  const getNotificationColor = (type: string) => {
    switch (type) {
      case 'critical': return 'bg-red-50 border-red-200 hover:bg-red-100';
      case 'warning': return 'bg-yellow-50 border-yellow-200 hover:bg-yellow-100';
      case 'info': return 'bg-blue-50 border-blue-200 hover:bg-blue-100';
      case 'success': return 'bg-green-50 border-green-200 hover:bg-green-100';
      default: return 'bg-gray-50 border-gray-200 hover:bg-gray-100';
    }
  };

  return (
    <header className="bg-white border-b border-border shadow-sm h-14 sm:h-16 flex items-center px-2 sm:px-4 lg:px-6">
      <div className="flex items-center flex-1 space-x-2 sm:space-x-4">
        {/* Mobile Menu Toggle */}
        <Button
          variant="ghost"
          size="sm"
          className="lg:hidden h-9 w-9 p-0"
          onClick={onToggleSidebar}
        >
          <Menu className="h-4 w-4" />
        </Button>

        {/* Search Bar */}
        <div className="flex-1 max-w-md">
          <div className="relative">
            <Search className="absolute left-2 sm:left-3 top-1/2 transform -translate-y-1/2 h-3 w-3 sm:h-4 sm:w-4 text-muted-foreground" />
            <Input
              placeholder="Search trains, schedules..."
              className="pl-7 sm:pl-10 h-8 sm:h-9 text-sm"
            />
          </div>
        </div>
      </div>

      <div className="flex items-center space-x-1 sm:space-x-2 lg:space-x-4">
        {/* Operations Center Info - Mobile */}
        <div className="hidden sm:flex md:hidden items-center space-x-2">
          <div className="text-right">
            <div className="flex items-center space-x-1">
              <Wifi className="h-3 w-3 text-success" />
              <span className="text-xs text-success font-medium">Live</span>
            </div>
            <div className="text-xs text-muted-foreground">
              {currentTime.toLocaleDateString('en-IN', { 
                day: 'numeric', 
                month: 'short'
              })}
            </div>
          </div>
        </div>

        {/* Operations Center Info - Desktop */}
        <div className="hidden md:flex items-center space-x-3">
          <div className="text-right">
            <div className="flex items-center space-x-2">
              <span className="text-sm font-medium">Operations Center</span>
              <div className="flex items-center space-x-1">
                <Wifi className="h-3 w-3 text-success" />
                <span className="text-xs text-success font-medium">Live Updates Active</span>
              </div>
            </div>
            <div className="text-xs text-muted-foreground">
              {currentTime.toLocaleDateString('en-IN', { 
                weekday: 'long', 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              })}
            </div>
          </div>
        </div>

        {/* Notifications */}
        <Popover open={notificationsOpen} onOpenChange={setNotificationsOpen}>
          <PopoverTrigger asChild>
            <Button variant="ghost" size="sm" className="relative h-8 w-8 sm:h-9 sm:w-9 p-0">
              <Bell className="h-3 w-3 sm:h-4 sm:w-4" />
              {unreadCount > 0 && (
                <Badge className="absolute -top-1 -right-1 h-3 w-3 sm:h-4 sm:w-4 p-0 flex items-center justify-center text-xs bg-destructive">
                  {unreadCount > 9 ? '9+' : unreadCount}
                </Badge>
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-80 p-0 bg-white border border-border shadow-lg" align="end">
            <div className="p-4 border-b border-border bg-white">
              <div className="flex items-center justify-between">
                <h4 className="font-semibold text-foreground">Notifications ({unreadCount} unread)</h4>
                <div className="flex items-center space-x-1">
                  {unreadCount > 0 && (
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="h-6 px-2 text-xs hover:bg-muted"
                      onClick={markAllAsRead}
                    >
                      Mark all read
                    </Button>
                  )}
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="h-6 w-6 p-0 hover:bg-muted"
                    onClick={() => setNotificationsOpen(false)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
            <ScrollArea className="h-80 bg-white">
              <div className="p-2 bg-white">
                {notifications.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground bg-white">
                    <Bell className="h-8 w-8 mx-auto mb-2 opacity-50" />
                    <p>No notifications</p>
                  </div>
                ) : (
                  <div className="space-y-2 bg-white">
                    {notifications.map((notification) => (
                      <div
                        key={notification.id}
                        className={`group p-3 rounded-lg border transition-colors cursor-pointer ${getNotificationColor(notification.type)} ${!notification.read ? 'ring-1 ring-primary/20' : ''}`}
                        onClick={() => markAsRead(notification.id)}
                      >
                        <div className="flex items-start space-x-3">
                          <div className="flex-shrink-0 mt-0.5">
                            {getNotificationIcon(notification.type)}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between">
                              <h5 className="text-sm font-medium truncate">
                                {notification.title}
                              </h5>
                              <div className="flex items-center space-x-1">
                                {!notification.read && (
                                  <div className="w-2 h-2 bg-primary rounded-full flex-shrink-0" />
                                )}
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="h-4 w-4 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    removeNotification(notification.id);
                                  }}
                                >
                                  <X className="h-3 w-3" />
                                </Button>
                              </div>
                            </div>
                            <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                              {notification.message}
                            </p>
                            <div className="flex items-center space-x-2 mt-2">
                              <Clock className="h-3 w-3 text-muted-foreground" />
                              <span className="text-xs text-muted-foreground">
                                {notification.timestamp}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </ScrollArea>
            <div className="p-3 border-t border-border bg-white">
              <Button variant="outline" size="sm" className="w-full hover:bg-muted">
                <Eye className="h-4 w-4 mr-2" />
                View All Notifications
              </Button>
            </div>
          </PopoverContent>
        </Popover>

        {/* User Menu */}
        <Popover open={userMenuOpen} onOpenChange={setUserMenuOpen}>
          <PopoverTrigger asChild>
            <Button variant="ghost" size="sm" className="flex items-center space-x-1 sm:space-x-2 h-8 w-8 sm:h-9 sm:w-auto sm:px-2">
              <div className="w-6 h-6 sm:w-8 sm:h-8 bg-primary/10 rounded-full flex items-center justify-center">
                <User className="h-3 w-3 sm:h-4 sm:w-4 text-primary" />
              </div>
              <div className="hidden sm:block text-left">
                <div className="text-xs sm:text-sm font-medium truncate max-w-20 lg:max-w-none">{user?.name || 'User'}</div>
                <div className="text-xs text-muted-foreground hidden lg:block">{user?.role || 'Role'}</div>
              </div>
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-72 sm:w-80 p-0 bg-white border border-border shadow-lg" align="end">
            <div className="p-3 sm:p-4 border-b border-border bg-white">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-primary/10 rounded-full flex items-center justify-center">
                  <User className="h-5 w-5 sm:h-6 sm:w-6 text-primary" />
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="font-semibold text-foreground truncate text-sm sm:text-base">{user?.name || 'User Name'}</h4>
                  <p className="text-xs sm:text-sm text-muted-foreground truncate">{user?.email || 'user@example.com'}</p>
                </div>
              </div>
            </div>
            
            <div className="p-3 sm:p-4 space-y-3 sm:space-y-4 bg-white">
              {/* User Details */}
              <div className="space-y-2 sm:space-y-3">
                <div className="flex items-center space-x-2 sm:space-x-3">
                  <Mail className="h-3 w-3 sm:h-4 sm:w-4 text-muted-foreground flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-xs text-muted-foreground">Email</p>
                    <p className="text-xs sm:text-sm font-medium truncate">{user?.email || 'user@example.com'}</p>
                  </div>
                </div>
                
                {user?.employee_id && (
                  <div className="flex items-center space-x-2 sm:space-x-3">
                    <BadgeIcon className="h-3 w-3 sm:h-4 sm:w-4 text-muted-foreground flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="text-xs text-muted-foreground">Employee ID</p>
                      <p className="text-xs sm:text-sm font-medium">{user.employee_id}</p>
                    </div>
                  </div>
                )}
                
                <div className="flex items-center space-x-2 sm:space-x-3">
                  <Shield className="h-3 w-3 sm:h-4 sm:w-4 text-muted-foreground flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-xs text-muted-foreground">Role</p>
                    <div className="flex items-center space-x-2">
                      <Badge variant="secondary" className="text-xs">
                        {user?.role || 'User'}
                      </Badge>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Action Buttons */}
              <div className="pt-2 border-t border-border">
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="w-full justify-start"
                  onClick={() => setUserMenuOpen(false)}
                >
                  <User className="h-4 w-4 mr-2" />
                  View Profile
                </Button>
              </div>
            </div>
          </PopoverContent>
        </Popover>

        {/* Logout */}
        <Button variant="ghost" size="sm" onClick={handleLogoutClick} className="h-8 w-8 sm:h-9 sm:w-9 p-0">
          <LogOut className="h-3 w-3 sm:h-4 sm:w-4" />
        </Button>
      </div>

      {/* Logout Confirmation Dialog */}
      <Dialog open={logoutDialogOpen} onOpenChange={setLogoutDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <LogOut className="h-5 w-5 text-primary" />
              Confirm Logout
            </DialogTitle>
            <DialogDescription className="text-muted-foreground">
              Are you sure you want to log out of the KMRL Fleet Management System? 
              You will need to log in again to access the dashboard.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex gap-2 sm:gap-0">
            <Button 
              variant="outline" 
              onClick={handleLogoutCancel}
              className="flex-1 sm:flex-none"
            >
              Cancel
            </Button>
            <Button 
              variant="destructive" 
              onClick={handleLogoutConfirm}
              className="flex-1 sm:flex-none bg-primary hover:bg-primary/90"
            >
              <LogOut className="h-4 w-4 mr-2" />
              Logout
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </header>
  );
};

export default TopHeader;