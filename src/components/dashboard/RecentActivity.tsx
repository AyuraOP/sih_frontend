import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { 
  Train, 
  Wrench, 
  CheckCircle, 
  AlertTriangle,
  Clock,
  Users,
  Calendar
} from "lucide-react";

const RecentActivity = () => {
  const activities = [
    {
      id: 1,
      type: "maintenance_completed",
      title: "Maintenance Completed",
      description: "Brake system inspection completed successfully",
      trainId: "KMR-012",
      time: "5 minutes ago",
      icon: CheckCircle,
      color: "text-success",
      bgColor: "bg-success/10"
    },
    {
      id: 2,
      type: "weather_alert", 
      title: "Weather Alert",
      description: "Heavy rain forecast may affect tonight's induction schedule",
      time: "12 minutes ago",
      icon: AlertTriangle,
      color: "text-warning",
      bgColor: "bg-warning/10"
    },
    {
      id: 3,
      type: "schedule_updated",
      title: "AI Schedule Updated", 
      description: "Induction plan optimized for 3 trainsets with 94% confidence",
      time: "18 minutes ago",
      icon: Calendar,
      color: "text-info",
      bgColor: "bg-info/10"
    }
  ];

  return (
    <Card className="h-fit">
      <CardHeader className="p-3 sm:p-6">
        <CardTitle className="flex items-center space-x-2 text-sm sm:text-base">
          <Clock className="h-4 w-4 sm:h-5 sm:w-5" />
          <span>Recent Activity</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <ScrollArea className="h-[300px] sm:h-[400px] lg:h-[500px] px-3 sm:px-6">
          <div className="space-y-3 sm:space-y-4 pb-4 sm:pb-6">
            {activities.map((activity) => (
              <div key={activity.id} className="flex items-start space-x-2 sm:space-x-3 group">
                <div className={`p-1.5 sm:p-2 rounded-lg ${activity.bgColor} group-hover:scale-110 transition-transform flex-shrink-0`}>
                  <activity.icon className={`h-3 w-3 sm:h-4 sm:w-4 ${activity.color}`} />
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-start sm:items-center justify-between">
                    <h4 className="text-xs sm:text-sm font-medium text-foreground truncate">
                      {activity.title}
                    </h4>
                    <span className="text-xs text-muted-foreground whitespace-nowrap ml-2 flex-shrink-0">
                      {activity.time}
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
                    {activity.description}
                  </p>
                  {activity.trainId && (
                    <div className="mt-1">
                      <Badge variant="outline" className="text-xs">
                        {activity.trainId}
                      </Badge>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>
        
        <div className="p-3 sm:p-4 border-t border-border">
          <button className="w-full text-xs sm:text-sm text-primary hover:text-primary-hover transition-colors">
            View All Activities
          </button>
        </div>
      </CardContent>
    </Card>
  );
};

export default RecentActivity;