import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { 
  Train, 
  Search, 
  Filter, 
  Plus, 
  Edit, 
  Trash2, 
  RefreshCw,
  Download,
  MapPin,
  Clock,
  Wrench,
  CheckCircle,
  AlertTriangle,
  Info,
  TrendingUp,
  Activity,
  Settings,
  Eye,
  Calendar,
  Zap
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { fleetService, Trainset, TrainsetType, Component, PerformanceMetrics, FleetOverview } from "@/services/fleet";
import { toast } from "@/hooks/use-toast";

const FleetManagement = () => {
  const { token } = useAuth();
  const [trainsets, setTrainsets] = useState<Trainset[]>([]);
  const [trainsetTypes, setTrainsetTypes] = useState<TrainsetType[]>([]);
  const [components, setComponents] = useState<Component[]>([]);
  const [fleetOverview, setFleetOverview] = useState<FleetOverview | null>(null);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedTrainset, setSelectedTrainset] = useState<Trainset | null>(null);
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [newTrainset, setNewTrainset] = useState<Partial<Trainset>>({});

  useEffect(() => {
    if (token) {
      loadFleetData();
    }
  }, [token]);

  const loadFleetData = async () => {
    try {
      setLoading(true);
      const [trainsetsResponse, typesResponse, overviewData] = await Promise.all([
        fleetService.getTrainsets(token!),
        fleetService.getTrainsetTypes(token!),
        fleetService.getFleetOverview(token!)
      ]);
      
      setTrainsets(trainsetsResponse.results);
      setTrainsetTypes(typesResponse);
      setFleetOverview(overviewData);
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

  const handleCreateTrainset = async () => {
    try {
      if (!newTrainset.trainset_number || !newTrainset.trainset_type) {
        toast({
          title: "Validation Error",
          description: "Please fill in all required fields",
          variant: "destructive",
        });
        return;
      }

      await fleetService.createTrainset(token!, newTrainset);
      toast({
        title: "Success",
        description: "Trainset created successfully",
      });
      setShowCreateDialog(false);
      setNewTrainset({});
      loadFleetData();
    } catch (error: any) {
      toast({
        title: "Error Creating Trainset",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const handleUpdateServiceStatus = async (trainsetId: string, status: string, reason?: string) => {
    try {
      await fleetService.updateServiceStatus(token!, trainsetId, status, reason);
      toast({
        title: "Success",
        description: "Service status updated successfully",
      });
      loadFleetData();
    } catch (error: any) {
      toast({
        title: "Error Updating Status",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'IN_SERVICE': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'STANDBY': return 'bg-green-100 text-green-800 border-green-200';
      case 'MAINTENANCE': return 'bg-red-100 text-red-800 border-red-200';
      case 'OUT_OF_SERVICE': return 'bg-gray-100 text-gray-800 border-gray-200';
      case 'TESTING': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'IN_SERVICE': return <Train className="h-4 w-4" />;
      case 'STANDBY': return <CheckCircle className="h-4 w-4" />;
      case 'MAINTENANCE': return <Wrench className="h-4 w-4" />;
      case 'OUT_OF_SERVICE': return <AlertTriangle className="h-4 w-4" />;
      case 'TESTING': return <Settings className="h-4 w-4" />;
      default: return <Info className="h-4 w-4" />;
    }
  };

  const filteredTrainsets = trainsets.filter(trainset => {
    const matchesSearch = trainset.trainset_number.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" || trainset.service_status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <RefreshCw className="h-8 w-8 animate-spin mx-auto mb-4" />
          <p>Loading fleet data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Fleet Management</h1>
          <p className="text-muted-foreground">Real-time fleet status and performance monitoring for KMRL trainsets</p>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="outline" size="sm" onClick={loadFleetData}>
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
          <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
            <DialogTrigger asChild>
              <Button className="btn-government">
                <Plus className="h-4 w-4 mr-2" />
                Add Trainset
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Create New Trainset</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="trainset_number">Trainset Number *</Label>
                    <Input
                      id="trainset_number"
                      value={newTrainset.trainset_number || ''}
                      onChange={(e) => setNewTrainset({...newTrainset, trainset_number: e.target.value})}
                      placeholder="KMRL-001"
                    />
                  </div>
                  <div>
                    <Label htmlFor="trainset_type">Trainset Type *</Label>
                    <Select value={newTrainset.trainset_type as string} onValueChange={(value) => setNewTrainset({...newTrainset, trainset_type: value})}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select type" />
                      </SelectTrigger>
                      <SelectContent>
                        {trainsetTypes.map(type => (
                          <SelectItem key={type.id} value={type.id}>{type.name}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="manufacturer">Manufacturer</Label>
                    <Input
                      id="manufacturer"
                      value={newTrainset.manufacturer || ''}
                      onChange={(e) => setNewTrainset({...newTrainset, manufacturer: e.target.value})}
                      placeholder="Alstom"
                    />
                  </div>
                  <div>
                    <Label htmlFor="manufacturing_year">Manufacturing Year</Label>
                    <Input
                      id="manufacturing_year"
                      type="number"
                      value={newTrainset.manufacturing_year || ''}
                      onChange={(e) => setNewTrainset({...newTrainset, manufacturing_year: parseInt(e.target.value)})}
                      placeholder="2023"
                    />
                  </div>
                </div>
                <div className="flex justify-end space-x-2">
                  <Button variant="outline" onClick={() => setShowCreateDialog(false)}>
                    Cancel
                  </Button>
                  <Button onClick={handleCreateTrainset}>
                    Create Trainset
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Fleet Overview Stats */}
      {fleetOverview && (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center space-x-2">
                <div className="bg-primary/10 p-2 rounded-lg">
                  <Train className="h-4 w-4 text-primary" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Total Fleet</p>
                  <p className="text-2xl font-bold">{fleetOverview.total_trainsets}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center space-x-2">
                <div className="bg-blue-500/10 p-2 rounded-lg">
                  <Train className="h-4 w-4 text-blue-500" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">In Service</p>
                  <p className="text-2xl font-bold text-blue-500">{fleetOverview.in_service}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center space-x-2">
                <div className="bg-green-500/10 p-2 rounded-lg">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Standby</p>
                  <p className="text-2xl font-bold text-green-500">{fleetOverview.standby}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center space-x-2">
                <div className="bg-red-500/10 p-2 rounded-lg">
                  <Wrench className="h-4 w-4 text-red-500" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Maintenance</p>
                  <p className="text-2xl font-bold text-red-500">{fleetOverview.maintenance}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center space-x-2">
                <div className="bg-warning/10 p-2 rounded-lg">
                  <TrendingUp className="h-4 w-4 text-warning" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Availability</p>
                  <p className="text-2xl font-bold">{fleetOverview.average_availability.toFixed(1)}%</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center space-x-2">
                <div className="bg-info/10 p-2 rounded-lg">
                  <Clock className="h-4 w-4 text-info" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Punctuality</p>
                  <p className="text-2xl font-bold">{fleetOverview.average_punctuality.toFixed(1)}%</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Filters */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search trainsets by number..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="IN_SERVICE">In Service</SelectItem>
                <SelectItem value="STANDBY">Standby</SelectItem>
                <SelectItem value="MAINTENANCE">Maintenance</SelectItem>
                <SelectItem value="OUT_OF_SERVICE">Out of Service</SelectItem>
                <SelectItem value="TESTING">Testing</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline">
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Trainsets Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredTrainsets.map((trainset) => (
          <Card key={trainset.id} className="hover:shadow-government-md transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">{trainset.trainset_number}</CardTitle>
                <Badge className={`${getStatusColor(trainset.service_status)} flex items-center gap-1`}>
                  {getStatusIcon(trainset.service_status)}
                  {trainset.service_status.replace('_', ' ')}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-muted-foreground">Manufacturer</p>
                  <p className="font-medium">{trainset.manufacturer || 'N/A'}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Year</p>
                  <p className="font-medium">{trainset.manufacturing_year || 'N/A'}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Total Mileage</p>
                  <p className="font-medium">{parseFloat(trainset.total_mileage).toLocaleString()} km</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Monthly Mileage</p>
                  <p className="font-medium">{parseFloat(trainset.monthly_mileage).toLocaleString()} km</p>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Service Availability</span>
                  <span className="font-medium">{trainset.service_availability.toFixed(1)}%</span>
                </div>
                <Progress value={trainset.service_availability} className="h-2" />
              </div>

              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Punctuality Score</span>
                  <span className="font-medium">{trainset.punctuality_score.toFixed(1)}%</span>
                </div>
                <Progress value={trainset.punctuality_score} className="h-2" />
              </div>

              <div className="flex items-center justify-between pt-2">
                <div className="flex items-center space-x-2">
                  {trainset.is_revenue_service_ready && (
                    <Badge variant="outline" className="text-xs">
                      <CheckCircle className="h-3 w-3 mr-1" />
                      Service Ready
                    </Badge>
                  )}
                  {trainset.has_active_branding && (
                    <Badge variant="outline" className="text-xs">
                      <Zap className="h-3 w-3 mr-1" />
                      Branded
                    </Badge>
                  )}
                </div>
                <div className="flex items-center space-x-1">
                  <Button size="sm" variant="outline" onClick={() => setSelectedTrainset(trainset)}>
                    <Eye className="h-4 w-4" />
                  </Button>
                  <Button size="sm" variant="outline">
                    <Edit className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              {trainset.next_scheduled_maintenance && (
                <div className="pt-2 border-t border-border">
                  <div className="flex items-center space-x-2 text-xs text-muted-foreground">
                    <Calendar className="h-3 w-3" />
                    <span>Next maintenance: {new Date(trainset.next_scheduled_maintenance).toLocaleDateString()}</span>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Trainset Details Dialog */}
      {selectedTrainset && (
        <Dialog open={!!selectedTrainset} onOpenChange={() => setSelectedTrainset(null)}>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="flex items-center space-x-2">
                <Train className="h-5 w-5" />
                <span>{selectedTrainset.trainset_number} Details</span>
              </DialogTitle>
            </DialogHeader>
            
            <Tabs defaultValue="overview" className="w-full">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="performance">Performance</TabsTrigger>
                <TabsTrigger value="maintenance">Maintenance</TabsTrigger>
                <TabsTrigger value="actions">Actions</TabsTrigger>
              </TabsList>
              
              <TabsContent value="overview" className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Service Status</Label>
                    <div className="flex items-center space-x-2 mt-1">
                      <Badge className={getStatusColor(selectedTrainset.service_status)}>
                        {getStatusIcon(selectedTrainset.service_status)}
                        {selectedTrainset.service_status.replace('_', ' ')}
                      </Badge>
                    </div>
                  </div>
                  <div>
                    <Label>Priority Level</Label>
                    <p className="mt-1 font-medium">{selectedTrainset.priority_level}</p>
                  </div>
                  <div>
                    <Label>Manufacturer</Label>
                    <p className="mt-1 font-medium">{selectedTrainset.manufacturer || 'N/A'}</p>
                  </div>
                  <div>
                    <Label>Manufacturing Year</Label>
                    <p className="mt-1 font-medium">{selectedTrainset.manufacturing_year || 'N/A'}</p>
                  </div>
                  <div>
                    <Label>Commissioning Date</Label>
                    <p className="mt-1 font-medium">
                      {selectedTrainset.commissioning_date ? new Date(selectedTrainset.commissioning_date).toLocaleDateString() : 'N/A'}
                    </p>
                  </div>
                  <div>
                    <Label>Revenue Service Ready</Label>
                    <div className="flex items-center space-x-2 mt-1">
                      {selectedTrainset.is_revenue_service_ready ? (
                        <Badge className="bg-success text-success-foreground">
                          <CheckCircle className="h-3 w-3 mr-1" />
                          Ready
                        </Badge>
                      ) : (
                        <Badge variant="outline">
                          <AlertTriangle className="h-3 w-3 mr-1" />
                          Not Ready
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="performance" className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div>
                      <Label>Service Availability</Label>
                      <div className="flex items-center space-x-2 mt-2">
                        <Progress value={selectedTrainset.service_availability} className="flex-1" />
                        <span className="text-sm font-medium">{selectedTrainset.service_availability.toFixed(1)}%</span>
                      </div>
                    </div>
                    <div>
                      <Label>Punctuality Score</Label>
                      <div className="flex items-center space-x-2 mt-2">
                        <Progress value={selectedTrainset.punctuality_score} className="flex-1" />
                        <span className="text-sm font-medium">{selectedTrainset.punctuality_score.toFixed(1)}%</span>
                      </div>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div>
                      <Label>Total Mileage</Label>
                      <p className="mt-1 text-2xl font-bold">{parseFloat(selectedTrainset.total_mileage).toLocaleString()} km</p>
                    </div>
                    <div>
                      <Label>Monthly Mileage</Label>
                      <p className="mt-1 text-xl font-semibold">{parseFloat(selectedTrainset.monthly_mileage).toLocaleString()} km</p>
                    </div>
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="maintenance" className="space-y-4">
                <div className="space-y-4">
                  {selectedTrainset.next_scheduled_maintenance && (
                    <div className="p-4 bg-warning/10 border border-warning/20 rounded-lg">
                      <div className="flex items-center space-x-2">
                        <Calendar className="h-4 w-4 text-warning" />
                        <span className="font-medium">Next Scheduled Maintenance</span>
                      </div>
                      <p className="mt-1 text-sm">
                        {new Date(selectedTrainset.next_scheduled_maintenance).toLocaleDateString()}
                      </p>
                    </div>
                  )}
                  <div>
                    <Label>Maintenance History</Label>
                    <p className="mt-1 text-sm text-muted-foreground">
                      Load maintenance records from backend...
                    </p>
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="actions" className="space-y-4">
                <div className="space-y-4">
                  <div>
                    <Label>Service Status Actions</Label>
                    <div className="flex flex-wrap gap-2 mt-2">
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => handleUpdateServiceStatus(selectedTrainset.id, 'IN_SERVICE', 'Manual status update')}
                      >
                        Set In Service
                      </Button>
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => handleUpdateServiceStatus(selectedTrainset.id, 'STANDBY', 'Manual status update')}
                      >
                        Set Standby
                      </Button>
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => handleUpdateServiceStatus(selectedTrainset.id, 'MAINTENANCE', 'Manual status update')}
                      >
                        Set Maintenance
                      </Button>
                    </div>
                  </div>
                  
                  <div>
                    <Label>Maintenance Actions</Label>
                    <div className="flex flex-wrap gap-2 mt-2">
                      <Button size="sm" variant="outline">
                        <Wrench className="h-4 w-4 mr-2" />
                        Schedule Maintenance
                      </Button>
                      <Button size="sm" variant="outline">
                        <CheckCircle className="h-4 w-4 mr-2" />
                        Complete Maintenance
                      </Button>
                    </div>
                  </div>
                  
                  <div>
                    <Label>Data Actions</Label>
                    <div className="flex flex-wrap gap-2 mt-2">
                      <Button size="sm" variant="outline">
                        <Activity className="h-4 w-4 mr-2" />
                        Update Mileage
                      </Button>
                      <Button size="sm" variant="outline">
                        <Download className="h-4 w-4 mr-2" />
                        Export Data
                      </Button>
                    </div>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};

export default FleetManagement;