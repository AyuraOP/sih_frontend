import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Progress } from "@/components/ui/progress";
import { useAuth } from "@/contexts/AuthContext";
import { fleetService, Trainset } from "@/services/fleet";
import { toast } from "@/hooks/use-toast";
import { 
  Train, 
  MapPin, 
  Clock, 
  Wrench, 
  CheckCircle, 
  AlertTriangle,
  Info,
  RefreshCw
} from "lucide-react";

const getStatusColor = (status: string) => {
  switch (status) {
    case 'STANDBY': return 'bg-green-100 text-green-800 border-green-200';
    case 'IN_SERVICE': return 'bg-blue-100 text-blue-800 border-blue-200'; 
    case 'MAINTENANCE': return 'bg-red-100 text-red-800 border-red-200';
    case 'OUT_OF_SERVICE': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
    case 'TESTING': return 'bg-purple-100 text-purple-800 border-purple-200';
    default: return 'bg-gray-100 text-gray-800 border-gray-200';
  }
};

const getStatusText = (status: string) => {
  switch (status) {
    case 'STANDBY': return { text: 'Standby', color: 'text-green-800' };
    case 'IN_SERVICE': return { text: 'In Service', color: 'text-blue-800' };
    case 'MAINTENANCE': return { text: 'Maintenance', color: 'text-red-800' };
    case 'OUT_OF_SERVICE': return { text: 'Out of Service', color: 'text-yellow-800' };
    case 'TESTING': return { text: 'Testing', color: 'text-purple-800' };
    default: return { text: status, color: 'text-gray-800' };
  }
};

const getStatusIcon = (status: string) => {
  switch (status) {
    case 'STANDBY': return <CheckCircle className="h-4 w-4" />;
    case 'IN_SERVICE': return <Train className="h-4 w-4" />;
    case 'MAINTENANCE': return <Wrench className="h-4 w-4" />;
    case 'OUT_OF_SERVICE': return <Clock className="h-4 w-4" />;
    case 'TESTING': return <AlertTriangle className="h-4 w-4" />;
    default: return <Info className="h-4 w-4" />;
  }
};

interface FleetGridProps {
  detailed?: boolean;
}

const FleetGrid = ({ detailed = false }: FleetGridProps) => {
  const { token } = useAuth();
  const [trainsets, setTrainsets] = useState<Trainset[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedTrain, setSelectedTrain] = useState<Trainset | null>(null);

  useEffect(() => {
    if (token) {
      loadTrainsets();
    }
  }, [token]);

  const loadTrainsets = async () => {
    try {
      setLoading(true);
      const response = await fleetService.getTrainsets(token!);
      setTrainsets(response.results);
    } catch (error: any) {
      toast({
        title: "Error Loading Fleet Data",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-32">
        <RefreshCw className="h-6 w-6 animate-spin" />
      </div>
    );
  }

  if (detailed) {
    return (
      <div className="space-y-3 sm:space-y-4">
        {trainsets.map((trainset) => (
          <Card key={trainset.id} className="hover:shadow-government-md transition-shadow">
            <CardContent className="p-3 sm:p-4 lg:p-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-3 sm:mb-4 gap-3">
                <div className="flex items-center space-x-2 sm:space-x-3">
                  <div className="bg-primary/10 p-1.5 sm:p-2 rounded-lg">
                    <Train className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
                  </div>
                  <div className="min-w-0">
                    <h3 className="font-semibold text-sm sm:text-base truncate">{trainset.trainset_number}</h3>
                    <p className="text-xs sm:text-sm text-muted-foreground truncate">
                      {typeof trainset.trainset_type === 'object' ? trainset.trainset_type.name : 'Trainset'}
                    </p>
                  </div>
                </div>
                <Badge className={`${getStatusColor(trainset.service_status)} text-xs sm:text-sm px-2 py-1`}>
                  {getStatusIcon(trainset.service_status)}
                  <span className="ml-1 sm:ml-2">{getStatusText(trainset.service_status).text}</span>
                </Badge>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 text-xs sm:text-sm">
                <div>
                  <p className="text-muted-foreground text-xs">Location</p>
                  <p className="font-medium truncate">{trainset.current_depot || 'Unknown'}</p>
                </div>
                <div>
                  <p className="text-muted-foreground text-xs">Mileage</p>
                  <p className="font-medium truncate">{parseFloat(trainset.total_mileage).toLocaleString()} km</p>
                </div>
                <div>
                  <p className="text-muted-foreground text-xs">Availability</p>
                  <p className="font-medium">{trainset.service_availability}%</p>
                </div>
                <div>
                  <p className="text-muted-foreground text-xs">Punctuality</p>
                  <div className="flex items-center space-x-2">
                    <Progress value={trainset.punctuality_score} className="flex-1 h-2" />
                    <span className="text-xs">{trainset.punctuality_score}%</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-2 sm:gap-3">
      {trainsets.map((trainset) => {
        const statusInfo = getStatusText(trainset.service_status);
        return (
          <Card key={trainset.id} className="hover:shadow-government-md transition-shadow">
            <CardContent className="p-2 sm:p-3">
              <div className="space-y-2 sm:space-y-3">
                {/* Train ID and Status */}
                <div className="flex items-start justify-between">
                  <div className="text-xs sm:text-sm font-medium text-foreground truncate min-w-0 flex-1">
                    {trainset.trainset_number}
                  </div>
                  <div className="w-2 h-2 rounded-full flex-shrink-0 ml-1" style={{ backgroundColor: getStatusColor(trainset.service_status).includes('green') ? '#22c55e' : getStatusColor(trainset.service_status).includes('blue') ? '#3b82f6' : getStatusColor(trainset.service_status).includes('red') ? '#ef4444' : '#eab308' }}></div>
                </div>

                {/* Status Badge */}
                <div className="flex justify-start">
                  <Badge className={`${getStatusColor(trainset.service_status)} ${statusInfo.color} text-xs px-1.5 sm:px-2 py-0.5 sm:py-1`}>
                    <span className="truncate">{statusInfo.text}</span>
                  </Badge>
                </div>

                {/* Location Info */}
                <div className="space-y-1">
                  <div className="flex items-center space-x-1 min-w-0">
                    <MapPin className="h-2.5 w-2.5 sm:h-3 sm:w-3 text-primary flex-shrink-0" />
                    <span className="text-xs text-muted-foreground truncate">{trainset.current_depot || 'Unknown'}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Clock className="h-2.5 w-2.5 sm:h-3 sm:w-3 text-muted-foreground flex-shrink-0" />
                    <span className="text-xs text-muted-foreground">
                      {new Date(trainset.updated_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                </div>

                {/* Availability Score */}
                <div className="flex items-center space-x-1">
                  <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-primary/60 flex-shrink-0"></div>
                  <span className="text-xs text-muted-foreground truncate">{trainset.service_availability}%</span>
                </div>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
};

export default FleetGrid;