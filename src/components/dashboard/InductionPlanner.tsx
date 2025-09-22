import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { 
  Calendar, 
  Clock, 
  Train, 
  MapPin, 
  Zap, 
  AlertTriangle,
  CheckCircle,
  RefreshCw,
  Settings,
  Download
} from "lucide-react";

const InductionPlanner = () => {
  const [selectedScenario, setSelectedScenario] = useState("recommended");
  
  const scenarios = [
    {
      id: "recommended",
      name: "AI Recommended",
      confidence: 96.3,
      efficiency: 94.2,
      conflicts: 0,
      description: "Optimized for maximum efficiency and minimal conflicts"
    },
    {
      id: "alternative1",
      name: "Alternative A",
      confidence: 92.1,
      efficiency: 91.8,
      conflicts: 1,
      description: "Prioritizes maintenance windows"
    },
    {
      id: "alternative2",
      name: "Alternative B",
      confidence: 89.7,
      efficiency: 88.5,
      conflicts: 2,
      description: "Balances operational and maintenance needs"
    }
  ];

  const tonightsPlan = [
    {
      time: "22:30",
      trainset: "KMRL-015",
      action: "Induction to Blue Line",
      depot: "Aluva Depot",
      confidence: 98.2,
      status: "confirmed"
    },
    {
      time: "23:15",
      trainset: "KMRL-008",
      action: "Return from Service",
      depot: "Pettah Depot",
      confidence: 95.7,
      status: "scheduled"
    },
    {
      time: "23:45",
      trainset: "KMRL-022",
      action: "Maintenance Completion",
      depot: "Kalamassery Depot",
      confidence: 94.1,
      status: "scheduled"
    },
    {
      time: "00:30",
      trainset: "KMRL-003",
      action: "Depot Positioning",
      depot: "Aluva Depot",
      confidence: 92.8,
      status: "tentative"
    },
    {
      time: "01:15",
      trainset: "KMRL-019",
      action: "Pre-service Check",
      depot: "Pettah Depot",
      confidence: 96.5,
      status: "scheduled"
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed': return 'bg-success text-success-foreground';
      case 'scheduled': return 'bg-info text-info-foreground';
      case 'tentative': return 'bg-warning text-warning-foreground';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 95) return 'text-success';
    if (confidence >= 90) return 'text-info';
    if (confidence >= 85) return 'text-warning';
    return 'text-destructive';
  };

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Scenario Selection */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
        {scenarios.map((scenario) => (
          <Card 
            key={scenario.id}
            className={`cursor-pointer transition-all hover:shadow-government-md ${
              selectedScenario === scenario.id ? 'ring-2 ring-primary border-primary' : ''
            }`}
            onClick={() => setSelectedScenario(scenario.id)}
          >
            <CardHeader className="pb-3 p-3 sm:p-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <CardTitle className="text-base sm:text-lg">{scenario.name}</CardTitle>
                {scenario.id === 'recommended' && (
                  <Badge className="bg-success text-success-foreground text-xs w-fit">
                    <Zap className="h-3 w-3 mr-1" />
                    AI Pick
                  </Badge>
                )}
              </div>
            </CardHeader>
            <CardContent className="space-y-3 p-3 sm:p-6 pt-0">
              <p className="text-xs sm:text-sm text-muted-foreground">{scenario.description}</p>
              
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-xs sm:text-sm">Confidence</span>
                  <span className={`text-xs sm:text-sm font-medium ${getConfidenceColor(scenario.confidence)}`}>
                    {scenario.confidence}%
                  </span>
                </div>
                <Progress value={scenario.confidence} className="h-2" />
              </div>
              
              <div className="grid grid-cols-2 gap-3 sm:gap-4 text-xs sm:text-sm">
                <div>
                  <p className="text-muted-foreground">Efficiency</p>
                  <p className="font-medium">{scenario.efficiency}%</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Conflicts</p>
                  <p className={`font-medium ${scenario.conflicts === 0 ? 'text-success' : 'text-warning'}`}>
                    {scenario.conflicts}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Tonight's Induction Plan */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center space-x-2">
              <Calendar className="h-5 w-5" />
              <span>Tonight's Induction Plan</span>
            </CardTitle>
            <div className="flex items-center space-x-2">
              <Button variant="outline" size="sm">
                <RefreshCw className="h-4 w-4 mr-2" />
                Refresh AI
              </Button>
              <Button variant="outline" size="sm">
                <Download className="h-4 w-4 mr-2" />
                Export
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {tonightsPlan.map((item, index) => (
              <div key={index}>
                <div className="flex items-center justify-between p-4 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors">
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center space-x-2">
                      <Clock className="h-4 w-4 text-muted-foreground" />
                      <span className="font-mono text-sm font-medium">{item.time}</span>
                    </div>
                    
                    <Separator orientation="vertical" className="h-6" />
                    
                    <div className="flex items-center space-x-2">
                      <Train className="h-4 w-4 text-primary" />
                      <span className="font-medium">{item.trainset}</span>
                    </div>
                    
                    <div className="hidden md:flex items-center space-x-2">
                      <MapPin className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm text-muted-foreground">{item.depot}</span>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-3">
                    <div className="text-right hidden sm:block">
                      <p className="text-sm font-medium">{item.action}</p>
                      <div className="flex items-center space-x-2 mt-1">
                        <span className={`text-xs ${getConfidenceColor(item.confidence)}`}>
                          {item.confidence}% confidence
                        </span>
                      </div>
                    </div>
                    
                    <Badge className={getStatusColor(item.status)} variant="secondary">
                      {item.status === 'confirmed' && <CheckCircle className="h-3 w-3 mr-1" />}
                      {item.status === 'tentative' && <AlertTriangle className="h-3 w-3 mr-1" />}
                      {item.status}
                    </Badge>
                  </div>
                </div>
                
                {index < tonightsPlan.length - 1 && (
                  <div className="flex justify-center my-2">
                    <div className="w-px h-4 bg-border"></div>
                  </div>
                )}
              </div>
            ))}
          </div>
          
          <div className="mt-6 p-4 bg-primary/5 rounded-lg border border-primary/20">
            <div className="flex items-start space-x-3">
              <Zap className="h-5 w-5 text-primary mt-0.5" />
              <div>
                <h4 className="font-medium text-primary">AI Optimization Insights</h4>
                <p className="text-sm text-muted-foreground mt-1">
                  This plan optimizes for minimal depot congestion during peak hours while ensuring all maintenance windows are respected. 
                  Predicted energy savings: 12.3kWh compared to manual scheduling.
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Depot Layout Preview */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <MapPin className="h-5 w-5" />
            <span>Depot Layout Preview</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-3 gap-6">
            {['Aluva Depot', 'Pettah Depot', 'Kalamassery Depot'].map((depot, index) => (
              <div key={depot} className="space-y-3">
                <h4 className="font-medium text-center">{depot}</h4>
                <div className="grid grid-cols-2 gap-2">
                  {[1, 2, 3, 4].map((bay) => (
                    <div key={bay} className="aspect-square bg-muted/30 rounded border-2 border-dashed border-muted-foreground/30 p-2 flex items-center justify-center">
                      <div className="text-center">
                        <p className="text-xs text-muted-foreground">Bay {bay}</p>
                        {Math.random() > 0.5 && (
                          <div className="mt-1">
                            <Train className="h-3 w-3 mx-auto text-primary" />
                            <p className="text-xs text-primary mt-1">
                              KMRL-{String(Math.floor(Math.random() * 25) + 1).padStart(3, '0')}
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default InductionPlanner;