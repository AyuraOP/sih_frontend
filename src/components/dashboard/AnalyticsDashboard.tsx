import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  BarChart3, 
  TrendingUp, 
  Clock, 
  Users,
  Download,
  Calendar,
  Target,
  Zap,
  AlertTriangle
} from "lucide-react";
import { 
  LineChart, 
  Line, 
  AreaChart, 
  Area, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from 'recharts';

const AnalyticsDashboard = () => {
  // Sample data for charts
  const performanceData = [
    { month: 'Jan', availability: 85, punctuality: 92, efficiency: 88 },
    { month: 'Feb', availability: 87, punctuality: 94, efficiency: 90 },
    { month: 'Mar', availability: 89, punctuality: 91, efficiency: 87 },
    { month: 'Apr', availability: 91, punctuality: 96, efficiency: 93 },
    { month: 'May', availability: 88, punctuality: 95, efficiency: 91 },
    { month: 'Jun', availability: 90, punctuality: 97, efficiency: 94 }
  ];

  const maintenanceData = [
    { week: 'W1', planned: 12, unplanned: 3, completed: 14 },
    { week: 'W2', planned: 15, unplanned: 2, completed: 16 },
    { week: 'W3', planned: 10, unplanned: 5, completed: 13 },
    { week: 'W4', planned: 18, unplanned: 1, completed: 19 }
  ];

  const fleetUtilization = [
    { name: 'In Service', value: 68, color: '#3b82f6' },
    { name: 'Ready', value: 20, color: '#10b981' },
    { name: 'Maintenance', value: 8, color: '#ef4444' },
    { name: 'Standby', value: 4, color: '#f59e0b' }
  ];

  const energyConsumption = [
    { day: 'Mon', consumption: 2150 },
    { day: 'Tue', consumption: 2280 },
    { day: 'Wed', consumption: 2190 },
    { day: 'Thu', consumption: 2340 },
    { day: 'Fri', consumption: 2420 },
    { day: 'Sat', consumption: 2100 },
    { day: 'Sun', consumption: 1950 }
  ];

  const kpiMetrics = [
    {
      title: "Average Fleet Availability",
      value: "89.2%",
      change: "+2.1%",
      trend: "up",
      icon: Target,
      color: "text-success"
    },
    {
      title: "On-Time Performance",
      value: "94.8%",
      change: "+0.9%",
      trend: "up",
      icon: Clock,
      color: "text-info"
    },
    {
      title: "Maintenance Efficiency",
      value: "91.5%",
      change: "-1.2%",
      trend: "down",
      icon: TrendingUp,
      color: "text-warning"
    },
    {
      title: "Energy Efficiency",
      value: "87.3%",
      change: "+3.4%",
      trend: "up",
      icon: Zap,
      color: "text-success"
    }
  ];

  const predictiveInsights = [
    {
      insight: "Peak demand prediction for next week shows 15% increase on Friday",
      confidence: 94.2,
      impact: "High",
      action: "Prepare additional trainsets"
    },
    {
      insight: "KMRL-007 requires maintenance in 12-15 days based on usage patterns",
      confidence: 87.6,
      impact: "Medium",
      action: "Schedule preventive maintenance"
    },
    {
      insight: "Energy optimization can save 8.3% on Blue Line during off-peak hours",
      confidence: 91.8,
      impact: "Medium",
      action: "Adjust speed profiles"
    }
  ];

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* KPI Overview */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-6">
        {kpiMetrics.map((metric, index) => (
          <Card key={index} className="hover:shadow-government-md transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 p-3 sm:p-6">
              <CardTitle className="text-xs sm:text-sm font-medium text-muted-foreground truncate">
                {metric.title}
              </CardTitle>
              <metric.icon className={`h-3 w-3 sm:h-4 sm:w-4 ${metric.color} flex-shrink-0`} />
            </CardHeader>
            <CardContent className="p-3 sm:p-6 pt-0">
              <div className="text-lg sm:text-2xl font-bold">{metric.value}</div>
              <div className="flex items-center space-x-1 sm:space-x-2 mt-2">
                <TrendingUp className={`h-2.5 w-2.5 sm:h-3 sm:w-3 ${metric.trend === 'up' ? 'text-success' : 'text-destructive'} ${metric.trend === 'down' ? 'rotate-180' : ''}`} />
                <span className={`text-xs ${metric.trend === 'up' ? 'text-success' : 'text-destructive'}`}>
                  {metric.change}
                </span>
                <span className="text-xs text-muted-foreground hidden sm:inline">vs last month</span>
                <span className="text-xs text-muted-foreground sm:hidden">vs last mo</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Tabs defaultValue="performance" className="w-full">
        <TabsList className="grid w-full grid-cols-2 sm:grid-cols-4 h-auto">
          <TabsTrigger value="performance" className="text-xs sm:text-sm py-2">Performance</TabsTrigger>
          <TabsTrigger value="maintenance" className="text-xs sm:text-sm py-2">Maintenance</TabsTrigger>
          <TabsTrigger value="utilization" className="text-xs sm:text-sm py-2">Utilization</TabsTrigger>
          <TabsTrigger value="insights" className="text-xs sm:text-sm py-2">AI Insights</TabsTrigger>
        </TabsList>

        <TabsContent value="performance" className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center space-x-2">
                  <BarChart3 className="h-5 w-5" />
                  <span>Fleet Performance Trends</span>
                </CardTitle>
                <Button variant="outline" size="sm">
                  <Download className="h-4 w-4 mr-2" />
                  Export
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={400}>
                <LineChart data={performanceData}>
                  <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Line type="monotone" dataKey="availability" stroke="#3b82f6" strokeWidth={2} name="Availability %" />
                  <Line type="monotone" dataKey="punctuality" stroke="#10b981" strokeWidth={2} name="Punctuality %" />
                  <Line type="monotone" dataKey="efficiency" stroke="#f59e0b" strokeWidth={2} name="Efficiency %" />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Energy Consumption (kWh)</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={energyConsumption}>
                  <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                  <XAxis dataKey="day" />
                  <YAxis />
                  <Tooltip />
                  <Area type="monotone" dataKey="consumption" stroke="#8b5cf6" fill="#8b5cf6" fillOpacity={0.3} />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="maintenance" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Calendar className="h-5 w-5" />
                <span>Maintenance Analytics</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={400}>
                <BarChart data={maintenanceData}>
                  <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                  <XAxis dataKey="week" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="planned" fill="#3b82f6" name="Planned" />
                  <Bar dataKey="unplanned" fill="#ef4444" name="Unplanned" />
                  <Bar dataKey="completed" fill="#10b981" name="Completed" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="utilization" className="space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Fleet Status Distribution</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={fleetUtilization}
                      cx="50%"
                      cy="50%"
                      outerRadius={100}
                      fill="#8884d8"
                      dataKey="value"
                      label={({ name, value }) => `${name}: ${value}%`}
                    >
                      {fleetUtilization.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Utilization Insights</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Peak Utilization</span>
                    <span className="font-medium">92% (7-9 AM)</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Off-Peak Utilization</span>
                    <span className="font-medium">45% (2-4 PM)</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Average Daily Miles</span>
                    <span className="font-medium">1,247 km</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Revenue Hours</span>
                    <span className="font-medium">18.5 hrs/day</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="insights" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Zap className="h-5 w-5" />
                <span>AI-Powered Insights</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {predictiveInsights.map((insight, index) => (
                  <Card key={index} className="hover:shadow-government-md transition-shadow">
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex-1">
                          <p className="text-sm mb-2">{insight.insight}</p>
                          <div className="flex items-center space-x-4 text-xs text-muted-foreground">
                            <span>Confidence: {insight.confidence}%</span>
                            <Badge variant={insight.impact === 'High' ? 'destructive' : insight.impact === 'Medium' ? 'default' : 'secondary'}>
                              {insight.impact} Impact
                            </Badge>
                          </div>
                        </div>
                        <AlertTriangle className="h-4 w-4 text-warning mt-1" />
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-primary">
                          Recommended: {insight.action}
                        </span>
                        <Button size="sm" variant="outline">
                          Take Action
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AnalyticsDashboard;