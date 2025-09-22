import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import FleetGrid from "@/components/dashboard/FleetGrid";
import KPICards from "@/components/dashboard/KPICards";
import InductionPlanner from "@/components/dashboard/InductionPlanner";
import MaintenanceHub from "@/components/dashboard/MaintenanceHub";
import AnalyticsDashboard from "@/components/dashboard/AnalyticsDashboard";
import RecentActivity from "@/components/dashboard/RecentActivity";
import UserManagement from "@/components/dashboard/UserManagement";
import SystemSettings from "@/components/dashboard/SystemSettings";
import AlertsLogs from "@/components/dashboard/AlertsLogs";
import TonightsInductionPlan from "@/components/dashboard/TonightsInductionPlan";
import ScheduleAdjustment from "@/components/dashboard/ScheduleAdjustment";
import Sidebar from "@/components/layout/Sidebar";
import TopHeader from "@/components/layout/TopHeader";
import { useIsMobile } from "@/hooks/use-mobile";
import DepotManagement from "./DepotManagement";

const Dashboard = () => {
  const navigate = useNavigate();
  const { user, logout, isAuthenticated, isLoading } = useAuth();
  const [currentTime, setCurrentTime] = useState(new Date());
  const [activeTab, setActiveTab] = useState("dashboard");
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [alertCount, setAlertCount] = useState(5); // Initial count of unacknowledged alerts
  const isMobile = useIsMobile();

  useEffect(() => {
    // Check authentication
    if (!isLoading && !isAuthenticated) {
      navigate("/");
      return;
    }

    // Update time every second
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, [navigate, isAuthenticated, isLoading]);

  const handleLogout = async () => {
    try {
      await logout();
      navigate("/");
    } catch (error) {
      console.error('Logout error:', error);
      // Even if logout fails, redirect to login
      navigate("/");
    }
  };

  const toggleSidebar = () => {
    setSidebarCollapsed(!sidebarCollapsed);
  };

  // Auto-close sidebar on mobile when navigating
  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
    if (isMobile) {
      setSidebarCollapsed(true);
    }
  };

  const renderMainContent = () => {
    switch (activeTab) {
      case "dashboard":
        return (
          <div className="space-y-4 sm:space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-xl sm:text-2xl font-bold text-foreground">Fleet Management Dashboard</h1>
                <p className="text-sm sm:text-base text-muted-foreground">Real-time monitoring and AI-powered operations for Kochi Metro Rail</p>
              </div>
            </div>
            
            <KPICards />
            
            <div className="grid lg:grid-cols-4 gap-4 sm:gap-6">
              <div className="lg:col-span-3">
                <div className="mb-4">
                  <h2 className="text-base sm:text-lg font-semibold text-foreground mb-2">Fleet Status Overview</h2>
                  <div className="grid grid-cols-2 sm:flex sm:items-center sm:space-x-4 text-xs sm:text-sm text-muted-foreground mb-4 gap-2">
                    <div className="flex items-center space-x-1">
                      <div className="w-2 h-2 sm:w-3 sm:h-3 rounded-full bg-yellow-500"></div>
                      <span>Standby: 2</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <div className="w-2 h-2 sm:w-3 sm:h-3 rounded-full bg-green-500"></div>
                      <span>Ready: 18</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <div className="w-2 h-2 sm:w-3 sm:h-3 rounded-full bg-red-500"></div>
                      <span>Maintenance: 4</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <div className="w-2 h-2 sm:w-3 sm:h-3 rounded-full bg-blue-500"></div>
                      <span>In Service: 1</span>
                    </div>
                  </div>
                </div>
                <FleetGrid />
                
                <TonightsInductionPlan />
              </div>
              <div className="space-y-4 sm:space-y-6">
                <ScheduleAdjustment />
                <RecentActivity />
              </div>
            </div>
          </div>
        );
      case "fleet":
        return (
          <div className="space-y-4 sm:space-y-6">
            <div>
              <h1 className="text-xl sm:text-2xl font-bold text-foreground mb-2">Fleet Management</h1>
              <p className="text-sm sm:text-base text-muted-foreground">Real-time fleet status and performance monitoring for 25 KMRL trainsets</p>
            </div>
            <FleetGrid detailed />
          </div>
        );
      case "scheduling":
        return (
          <div className="space-y-4 sm:space-y-6">
            <div>
              <h1 className="text-xl sm:text-2xl font-bold text-foreground mb-2">AI Induction Planner</h1>
              <p className="text-sm sm:text-base text-muted-foreground">Intelligent scheduling and conflict resolution</p>
            </div>
            <InductionPlanner />
          </div>
        );
      case "depot":
        return (
          <div className="space-y-4 sm:space-y-6">
            <div>
              {/* <h1 className="text-xl sm:text-2xl font-bold text-foreground mb-2">Depot Management</h1>
              <p className="text-sm sm:text-base text-muted-foreground">Manage depot operations, stabling bays, and facility utilization</p> */}
            </div>
            <DepotManagement />
          </div>
        );
      case "maintenance":
        return (
          <div className="space-y-4 sm:space-y-6">
            <div>
              <h1 className="text-xl sm:text-2xl font-bold text-foreground mb-2">Maintenance Hub</h1>
              <p className="text-sm sm:text-base text-muted-foreground">Job cards, cleaning schedules, and predictive maintenance</p>
            </div>
            <MaintenanceHub />
          </div>
        );
      case "analytics":
        return (
          <div className="space-y-4 sm:space-y-6">
            <div>
              <h1 className="text-xl sm:text-2xl font-bold text-foreground mb-2">Analytics & Reports</h1>
              <p className="text-sm sm:text-base text-muted-foreground">Performance insights and predictive analytics</p>
            </div>
            <AnalyticsDashboard />
          </div>
        );
      case "users":
        return (
          <div className="space-y-4 sm:space-y-6">
            <UserManagement />
          </div>
        );
      case "settings":
        return (
          <div className="space-y-4 sm:space-y-6">
            <SystemSettings />
          </div>
        );
      case "alerts":
        return (
          <div className="space-y-4 sm:space-y-6">
            <AlertsLogs onAlertCountChange={setAlertCount} />
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="h-screen flex bg-background">
      {/* Sidebar */}
      <Sidebar 
        activeTab={activeTab}
        onTabChange={handleTabChange}
        isCollapsed={isMobile ? sidebarCollapsed : sidebarCollapsed}
        onToggle={toggleSidebar}
        alertCount={alertCount}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <TopHeader 
          currentTime={currentTime}
          onLogout={handleLogout}
          onToggleSidebar={toggleSidebar}
        />
        
        <main className="flex-1 overflow-y-auto p-2 sm:p-4 lg:p-6">
          {renderMainContent()}
        </main>
      </div>
    </div>
  );
};

export default Dashboard;