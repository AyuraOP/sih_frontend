import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Clock,
  TrendingUp,
  AlertCircle
} from "lucide-react";

interface ScheduleAdjustmentProps {}

const ScheduleAdjustment: React.FC<ScheduleAdjustmentProps> = () => {
  const adjustments = [
    {
      id: "1",
      title: "Peak hour service frequency increased to 3 minutes",
      type: "service",
      timestamp: "2 hours ago",
      status: "active"
    },
    {
      id: "2", 
      title: "Maintenance window extended by 30 minutes",
      type: "maintenance",
      timestamp: "4 hours ago",
      status: "pending"
    },
    {
      id: "3",
      title: "Weather contingency plan activated",
      type: "weather",
      timestamp: "6 hours ago", 
      status: "active"
    }
  ];

  const getTypeColor = (type: string) => {
    switch (type) {
      case "service": return "bg-blue-100 text-blue-800 border-blue-200";
      case "maintenance": return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "weather": return "bg-orange-100 text-orange-800 border-orange-200";
      default: return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "service": return <TrendingUp className="h-4 w-4" />;
      case "maintenance": return <Clock className="h-4 w-4" />;
      case "weather": return <AlertCircle className="h-4 w-4" />;
      default: return <Clock className="h-4 w-4" />;
    }
  };

  return (
    <Card>
      <CardHeader className="p-3 sm:p-6">
        <CardTitle className="text-base sm:text-lg font-semibold">Schedule Adjustment</CardTitle>
      </CardHeader>
      <CardContent className="p-3 sm:p-6">
        <div className="space-y-2 sm:space-y-3">
          {adjustments.map((adjustment) => (
            <div key={adjustment.id} className="border rounded-lg p-2 sm:p-3 space-y-2">
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2">
                <div className="flex items-center space-x-2">
                  <div className="flex-shrink-0">
                    {getTypeIcon(adjustment.type)}
                  </div>
                  <Badge className={`${getTypeColor(adjustment.type)} text-xs px-2 py-1`}>
                    {adjustment.type}
                  </Badge>
                </div>
                <span className="text-xs text-muted-foreground">{adjustment.timestamp}</span>
              </div>
              <p className="text-xs sm:text-sm text-gray-700 leading-relaxed">{adjustment.title}</p>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default ScheduleAdjustment;
