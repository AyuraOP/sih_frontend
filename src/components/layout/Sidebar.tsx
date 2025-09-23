import React from "react";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  BarChart3, 
  Train, 
  Calendar, 
  Wrench, 
  Settings, 
  Users, 
  AlertTriangle, 
  FileText,
  Grid3X3,
  Menu,
  X
} from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";

interface SidebarProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  isCollapsed: boolean;
  onToggle: () => void;
  alertCount?: number;
}

const Sidebar: React.FC<SidebarProps> = ({ activeTab, onTabChange, isCollapsed, onToggle, alertCount = 0 }) => {
  const { t } = useTranslation();
  const isMobile = useIsMobile();

  const navigationItems = [
    { id: "dashboard", icon: BarChart3, label: t('navigation.dashboard'), section: t('navigation.operations') },
    { id: "fleet", icon: Train, label: t('navigation.fleetManagement'), section: t('navigation.operations') },
    { id: "depotManagement", icon: Grid3X3, label: t('navigation.DepotManagement'), section: t('navigation.operations') },
    { id: "scheduling", icon: Calendar, label: t('navigation.scheduling'), section: t('navigation.operations') },
    { id: "maintenance", icon: Wrench, label: t('navigation.maintenance'), section: t('navigation.operations') },
    { id: "analytics", icon: BarChart3, label: t('navigation.analytics'), section: t('navigation.operations') },
    { id: "users", icon: Users, label: t('navigation.userManagement'), section: t('navigation.administration') },
    { id: "settings", icon: Settings, label: t('navigation.systemSettings'), section: t('navigation.administration') },
    { id: "alerts", icon: AlertTriangle, label: t('navigation.alertsLogs'), section: t('navigation.administration'), badge: alertCount > 0 ? alertCount.toString() : undefined }
  ];

  const operationsItems = navigationItems.filter(item => item.section === t('navigation.operations'));
  const administrationItems = navigationItems.filter(item => item.section === t('navigation.administration'));

  const renderNavItem = (item: any) => (
    <Button
      key={item.id}
      variant={activeTab === item.id ? "secondary" : "ghost"}
      className={`w-full justify-start text-left h-11 sm:h-10 px-3 text-white hover:bg-white/10 hover:text-white ${
        activeTab === item.id ? "bg-white/20 text-white" : ""
      }`}
      onClick={() => onTabChange(item.id)}
    >
      <item.icon className="h-4 w-4 mr-2 sm:mr-3 flex-shrink-0" />
      {!isCollapsed && (
        <>
          <span className="flex-1 text-sm">{item.label}</span>
          {item.badge && (
            <Badge variant="destructive" className="ml-2 h-5 px-1.5 text-xs">
              {item.badge}
            </Badge>
          )}
        </>
      )}
    </Button>
  );

  if (isMobile) {
    return (
      <>
        {/* Mobile Overlay */}
        {!isCollapsed && (
          <div 
            className="fixed inset-0 bg-black/50 z-40 lg:hidden"
            onClick={onToggle}
          />
        )}
        
        {/* Mobile Sidebar */}
        <div className={`
          fixed left-0 top-0 h-full w-72 sm:w-80 bg-gradient-to-b from-primary to-primary/90 
          transform transition-transform duration-300 z-50 lg:hidden
          ${isCollapsed ? '-translate-x-full' : 'translate-x-0'}
        `}>
          <div className="flex items-center justify-between p-3 sm:p-4 border-b border-white/20">
            <div className="flex items-center space-x-2 sm:space-x-3">
              <div className="bg-white/10 p-1.5 sm:p-2 rounded-lg">
                <Train className="h-4 w-4 sm:h-5 sm:w-5 text-white" />
              </div>
              <div className="text-white">
                <h1 className="text-sm font-semibold">KMRL</h1>
                <p className="text-xs text-white/80">Fleet Management</p>
              </div>
            </div>
            <Button
              variant="ghost"
              size="sm"
              className="text-white hover:bg-white/10 p-1 h-8 w-8"
              onClick={onToggle}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>

          <div className="p-3 sm:p-4 space-y-4 sm:space-y-6 overflow-y-auto">
            <div>
              <h3 className="text-xs font-medium text-white/60 uppercase tracking-wider mb-2">Operations</h3>
              <div className="space-y-1">
                {operationsItems.map(renderNavItem)}
              </div>
            </div>

            <div>
              <h3 className="text-xs font-medium text-white/60 uppercase tracking-wider mb-2">Administration</h3>
              <div className="space-y-1">
                {administrationItems.map(renderNavItem)}
              </div>
            </div>
          </div>
        </div>
      </>
    );
  }

  return (
    <div className={`
      hidden lg:flex flex-col h-full bg-gradient-to-b from-primary to-primary/90 
      transition-all duration-300 ${isCollapsed ? 'w-16' : 'w-64'}
    `}>
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-white/20">
        {!isCollapsed && (
          <div className="flex items-center space-x-3">
            <div className="bg-white/10 p-2 rounded-lg">
              <Train className="h-5 w-5 text-white" />
            </div>
            <div className="text-white">
              <h1 className="text-sm font-semibold">KMRL</h1>
              <p className="text-xs text-white/80">Fleet Management</p>
            </div>
          </div>
        )}
        
        <Button
          variant="ghost"
          size="sm"
          className="text-white hover:bg-white/10 p-1"
          onClick={onToggle}
        >
          <Menu className="h-4 w-4" />
        </Button>
      </div>

      {/* Navigation */}
      <div className="flex-1 p-4 space-y-6 overflow-y-auto">
        <div>
          {!isCollapsed && (
            <h3 className="text-xs font-medium text-white/60 uppercase tracking-wider mb-2">Operations</h3>
          )}
          <div className="space-y-1">
            {operationsItems.map(renderNavItem)}
          </div>
        </div>

        <div>
          {!isCollapsed && (
            <h3 className="text-xs font-medium text-white/60 uppercase tracking-wider mb-2">Administration</h3>
          )}
          <div className="space-y-1">
            {administrationItems.map(renderNavItem)}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;