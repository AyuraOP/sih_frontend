import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Calendar,
  Clock,
  MapPin,
  Zap,
  CheckCircle,
  AlertTriangle,
  Eye,
  ArrowRight
} from "lucide-react";

interface InductionPlanProps {}

const TonightsInductionPlan: React.FC<InductionPlanProps> = () => {
  const inductionPlans = [
    {
      id: "KMR-015",
      status: "confirmed",
      scheduledTime: "22:30",
      route: "Depot A → Blue Line",
      confidence: 92,
      reasoning: [
        "Optimal maintenance window available",
        "No conflicting schedules detected",
        "Weather conditions favorable"
      ]
    },
    {
      id: "KMR-008",
      status: "pending",
      scheduledTime: "23:15",
      route: "Depot B → Green Line",
      confidence: 76,
      reasoning: [
        "Minor scheduling conflict resolved",
        "Backup crew arranged",
        "Alternative route planned"
      ]
    },
    {
      id: "KMR-021",
      status: "risk",
      scheduledTime: "00:45",
      route: "Depot A → Blue Line",
      confidence: 58,
      reasoning: [
        "Weather alert in effect",
        "Crew overtime required",
        "Equipment availability uncertain"
      ]
    },
    {
      id: "KMR-012",
      status: "confirmed",
      scheduledTime: "01:20",
      route: "Depot B → Green Line",
      confidence: 88,
      reasoning: [
        "Clear maintenance window",
        "All systems operational",
        "Crew availability confirmed"
      ]
    },
    {
      id: "KMR-003",
      status: "pending",
      scheduledTime: "02:10",
      route: "Depot A → Blue Line",
      confidence: 71,
      reasoning: [
        "Equipment check required",
        "Backup plan in place",
        "Weather monitoring active"
      ]
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "confirmed": return "bg-green-100 text-green-800 border-green-200";
      case "pending": return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "risk": return "bg-red-100 text-red-800 border-red-200";
      default: return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "confirmed": return <CheckCircle className="h-4 w-4" />;
      case "pending": return <Eye className="h-4 w-4" />;
      case "risk": return <AlertTriangle className="h-4 w-4" />;
      default: return <Clock className="h-4 w-4" />;
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "confirmed": return "Confirmed";
      case "pending": return "Pending Review";
      case "risk": return "Risk Detected";
      default: return "Unknown";
    }
  };

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 85) return "text-green-600";
    if (confidence >= 70) return "text-yellow-600";
    return "text-red-600";
  };

  return (
    <Card>
      <CardHeader className="p-3 sm:p-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <CardTitle className="text-base sm:text-lg font-semibold">Tonight's AI Induction Plan</CardTitle>
          <Button variant="outline" size="sm" className="w-full sm:w-auto">
            <Calendar className="h-4 w-4 mr-2" />
            <span className="hidden sm:inline">View Full Schedule</span>
            <span className="sm:hidden">View Schedule</span>
          </Button>
        </div>
      </CardHeader>
      <CardContent className="p-3 sm:p-6">
        <div className="space-y-3 sm:space-y-4">
          {inductionPlans.slice(0, 2).map((plan) => (
            <div key={plan.id} className="bg-white border border-gray-200 rounded-lg p-3 sm:p-4 space-y-3">
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                <div className="flex flex-col sm:flex-row sm:items-center space-y-2 sm:space-y-0 sm:space-x-3">
                  <h4 className="font-semibold text-base sm:text-lg">{plan.id}</h4>
                  <Badge className={`${getStatusColor(plan.status)} flex items-center gap-1 text-xs font-medium w-fit`}>
                    {getStatusText(plan.status)}
                  </Badge>
                </div>
                <div className="text-left sm:text-right">
                  <div className="text-sm font-medium text-muted-foreground">{plan.scheduledTime}</div>
                  <div className="text-xs text-muted-foreground">Scheduled</div>
                </div>
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-xs sm:text-sm">
                  <MapPin className="h-3 w-3 text-gray-500 flex-shrink-0" />
                  <span className="text-gray-600 truncate">{plan.route}</span>
                </div>
                
                <div className="flex items-center gap-2 text-xs sm:text-sm">
                  <Zap className="h-3 w-3 text-gray-500 flex-shrink-0" />
                  <span className={`font-medium ${getConfidenceColor(plan.confidence)}`}>
                    {plan.confidence}% AI Confidence
                  </span>
                </div>
              </div>
              
              <div className="space-y-2">
                <h5 className="text-xs sm:text-sm font-medium text-muted-foreground">AI Reasoning:</h5>
                <ul className="space-y-1">
                  {plan.reasoning.map((reason, index) => (
                    <li key={index} className="flex items-start gap-2 text-xs sm:text-sm">
                      <div className="w-1.5 h-1.5 rounded-full bg-gray-400 mt-1.5 sm:mt-2 flex-shrink-0"></div>
                      <span className="text-gray-600">{reason}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default TonightsInductionPlan;
