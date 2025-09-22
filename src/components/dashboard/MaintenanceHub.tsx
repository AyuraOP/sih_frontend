import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Wrench, 
  Calendar, 
  Clock, 
  Users, 
  CheckCircle, 
  AlertTriangle,
  Filter,
  Plus,
  Download,
  RefreshCw,
  Sparkles
} from "lucide-react";

const MaintenanceHub = () => {
  const [activeFilter, setActiveFilter] = useState("all");

  const jobCards = [
    {
      id: "JC-2024-001",
      trainset: "KMRL-015",
      type: "A-Type Maintenance",
      priority: "High",
      status: "In Progress",
      assignedTo: "Team Alpha",
      estimatedHours: 8,
      completedHours: 5.5,
      dueDate: "2024-01-15",
      location: "Aluva Depot - Bay 3"
    },
    {
      id: "JC-2024-002",
      trainset: "KMRL-008",
      type: "Door System Check",
      priority: "Medium",
      status: "Scheduled",
      assignedTo: "Team Beta",
      estimatedHours: 4,
      completedHours: 0,
      dueDate: "2024-01-16",
      location: "Pettah Depot - Bay 1"
    },
    {
      id: "JC-2024-003",
      trainset: "KMRL-022",
      type: "HVAC Maintenance",
      priority: "Low",
      status: "Completed",
      assignedTo: "Team Gamma",
      estimatedHours: 6,
      completedHours: 6,
      dueDate: "2024-01-14",
      location: "Kalamassery Depot - Bay 2"
    },
    {
      id: "JC-2024-004",
      trainset: "KMRL-003",
      type: "Brake System Inspection",
      priority: "Critical",
      status: "Overdue",
      assignedTo: "Team Alpha",
      estimatedHours: 12,
      completedHours: 0,
      dueDate: "2024-01-13",
      location: "Aluva Depot - Bay 1"
    }
  ];

  const cleaningSchedule = [
    {
      trainset: "KMRL-011",
      type: "Deep Clean",
      status: "In Progress",
      team: "Cleaning Team A",
      startTime: "14:30",
      estimatedCompletion: "17:30",
      location: "Pettah Depot"
    },
    {
      trainset: "KMRL-017",
      type: "Exterior Wash",
      status: "Scheduled",
      team: "Cleaning Team B",
      startTime: "18:00",
      estimatedCompletion: "19:30",
      location: "Aluva Depot"
    },
    {
      trainset: "KMRL-025",
      type: "Interior Clean",
      status: "Completed",
      team: "Cleaning Team C",
      startTime: "10:00",
      estimatedCompletion: "12:00",
      location: "Kalamassery Depot"
    }
  ];

  const predictiveMaintenance = [
    {
      trainset: "KMRL-007",
      component: "Traction Motor",
      riskLevel: "Medium",
      predictedFailure: "15-20 days",
      confidence: 87.3,
      recommendedAction: "Schedule inspection"
    },
    {
      trainset: "KMRL-019",
      component: "Air Compressor",
      riskLevel: "High",
      predictedFailure: "5-8 days",
      confidence: 94.1,
      recommendedAction: "Immediate replacement"
    },
    {
      trainset: "KMRL-014",
      component: "Door Actuator",
      riskLevel: "Low",
      predictedFailure: "30+ days",
      confidence: 78.9,
      recommendedAction: "Monitor condition"
    }
  ];

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'Critical': return 'bg-destructive text-destructive-foreground';
      case 'High': return 'bg-warning text-warning-foreground';
      case 'Medium': return 'bg-info text-info-foreground';
      case 'Low': return 'bg-muted text-muted-foreground';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Completed': return 'bg-success text-success-foreground';
      case 'In Progress': return 'bg-info text-info-foreground';
      case 'Scheduled': return 'bg-secondary text-secondary-foreground';
      case 'Overdue': return 'bg-destructive text-destructive-foreground';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case 'High': return 'text-destructive';
      case 'Medium': return 'text-warning';
      case 'Low': return 'text-success';
      default: return 'text-muted-foreground';
    }
  };

  return (
    <div className="space-y-4 sm:space-y-6">
      <Tabs defaultValue="job-cards" className="w-full">
        <TabsList className="grid w-full grid-cols-3 h-auto">
          <TabsTrigger value="job-cards" className="flex items-center space-x-1 sm:space-x-2 text-xs sm:text-sm py-2">
            <Wrench className="h-3 w-3 sm:h-4 sm:w-4" />
            <span className="hidden sm:inline">Job Cards</span>
            <span className="sm:hidden">Jobs</span>
          </TabsTrigger>
          <TabsTrigger value="cleaning" className="flex items-center space-x-1 sm:space-x-2 text-xs sm:text-sm py-2">
            <Users className="h-3 w-3 sm:h-4 sm:w-4" />
            <span className="hidden sm:inline">Cleaning</span>
            <span className="sm:hidden">Clean</span>
          </TabsTrigger>
          <TabsTrigger value="predictive" className="flex items-center space-x-1 sm:space-x-2 text-xs sm:text-sm py-2">
            <Sparkles className="h-3 w-3 sm:h-4 sm:w-4" />
            <span className="hidden sm:inline">Predictive</span>
            <span className="sm:hidden">AI</span>
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="job-cards" className="space-y-4 sm:space-y-6">
          <Card>
            <CardHeader className="p-3 sm:p-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <CardTitle className="flex items-center space-x-2 text-sm sm:text-base">
                  <Wrench className="h-4 w-4 sm:h-5 sm:w-5" />
                  <span>Active Job Cards</span>
                </CardTitle>
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
                  <Button variant="outline" size="sm" className="w-full sm:w-auto">
                    <Filter className="h-4 w-4 mr-2" />
                    Filter
                  </Button>
                  <Button size="sm" className="btn-government w-full sm:w-auto">
                    <Plus className="h-4 w-4 mr-2" />
                    <span className="hidden sm:inline">New Job Card</span>
                    <span className="sm:hidden">New Job</span>
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-3 sm:p-6">
              <div className="space-y-3 sm:space-y-4">
                {jobCards.map((job) => (
                  <Card key={job.id} className="hover:shadow-government-md transition-shadow">
                    <CardContent className="p-3 sm:p-4 lg:p-6">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-3 sm:mb-4 gap-3">
                        <div className="flex flex-wrap items-center gap-2">
                          <Badge variant="outline" className="text-xs">{job.id}</Badge>
                          <Badge className={`${getPriorityColor(job.priority)} text-xs`}>
                            {job.priority}
                          </Badge>
                          <Badge className={`${getStatusColor(job.status)} text-xs`} variant="secondary">
                            {job.status}
                          </Badge>
                        </div>
                        <div className="text-left sm:text-right text-xs sm:text-sm text-muted-foreground">
                          Due: {job.dueDate}
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
                        <div className="space-y-2 sm:space-y-3">
                          <div>
                            <h4 className="font-semibold text-sm sm:text-base">{job.trainset} - {job.type}</h4>
                            <p className="text-xs sm:text-sm text-muted-foreground">{job.location}</p>
                          </div>
                          
                          <div className="text-xs sm:text-sm">
                            <span className="text-muted-foreground">Assigned to:</span>
                            <span className="ml-2 font-medium">{job.assignedTo}</span>
                          </div>
                        </div>
                        
                        <div className="space-y-2 sm:space-y-3">
                          <div>
                            <div className="flex justify-between items-center mb-2">
                              <span className="text-xs sm:text-sm text-muted-foreground">Progress</span>
                              <span className="text-xs sm:text-sm font-medium">
                                {job.completedHours}/{job.estimatedHours} hours
                              </span>
                            </div>
                            <Progress value={(job.completedHours / job.estimatedHours) * 100} className="h-2" />
                          </div>
                          
                          <div className="flex flex-col sm:flex-row gap-2">
                            <Button size="sm" variant="outline" className="w-full sm:w-auto text-xs">View Details</Button>
                            <Button size="sm" variant="outline" className="w-full sm:w-auto text-xs">Update Status</Button>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="cleaning" className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center space-x-2">
                  <Users className="h-5 w-5" />
                  <span>Cleaning Schedule</span>
                </CardTitle>
                <div className="flex items-center space-x-2">
                  <Button variant="outline" size="sm">
                    <RefreshCw className="h-4 w-4 mr-2" />
                    Refresh
                  </Button>
                  <Button size="sm" className="btn-government">
                    <Plus className="h-4 w-4 mr-2" />
                    Schedule Cleaning
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {cleaningSchedule.map((cleaning, index) => (
                  <div key={index} className="flex items-center justify-between p-4 rounded-lg bg-muted/30">
                    <div className="flex items-center space-x-4">
                      <div className="bg-primary/10 p-2 rounded-lg">
                        <Users className="h-4 w-4 text-primary" />
                      </div>
                      
                      <div>
                        <h4 className="font-medium">{cleaning.trainset}</h4>
                        <p className="text-sm text-muted-foreground">
                          {cleaning.type} • {cleaning.location}
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-4">
                      <div className="text-right">
                        <p className="text-sm font-medium">{cleaning.team}</p>
                        <p className="text-xs text-muted-foreground">
                          {cleaning.startTime} - {cleaning.estimatedCompletion}
                        </p>
                      </div>
                      
                      <Badge className={getStatusColor(cleaning.status)} variant="secondary">
                        {cleaning.status}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="predictive" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Sparkles className="h-5 w-5" />
                <span>Predictive Maintenance Insights</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {predictiveMaintenance.map((prediction, index) => (
                  <Card key={index} className="hover:shadow-government-md transition-shadow">
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center space-x-3">
                          <div className="bg-primary/10 p-2 rounded-lg">
                            <Sparkles className="h-4 w-4 text-primary" />
                          </div>
                          <div>
                            <h4 className="font-semibold">{prediction.trainset}</h4>
                            <p className="text-sm text-muted-foreground">{prediction.component}</p>
                          </div>
                        </div>
                        <Badge className={`${getRiskColor(prediction.riskLevel)} bg-background border-current`} variant="outline">
                          {prediction.riskLevel} Risk
                        </Badge>
                      </div>
                      
                      <div className="grid md:grid-cols-3 gap-4 text-sm">
                        <div>
                          <p className="text-muted-foreground">Predicted Failure</p>
                          <p className="font-medium">{prediction.predictedFailure}</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">AI Confidence</p>
                          <div className="flex items-center space-x-2">
                            <Progress value={prediction.confidence} className="flex-1 h-2" />
                            <span className="font-medium">{prediction.confidence}%</span>
                          </div>
                        </div>
                        <div>
                          <p className="text-muted-foreground">Recommended Action</p>
                          <p className="font-medium">{prediction.recommendedAction}</p>
                        </div>
                      </div>
                      
                      <div className="flex space-x-2 mt-4">
                        <Button size="sm" variant="outline">Schedule Maintenance</Button>
                        <Button size="sm" variant="outline">View Analytics</Button>
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

export default MaintenanceHub;