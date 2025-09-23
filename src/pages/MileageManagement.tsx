import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useAuth } from "@/contexts/AuthContext";
import { fleetService, MileageLog, Trainset } from "@/services/fleet";
import { toast } from "@/hooks/use-toast";
import { 
  Activity, 
  Search, 
  Plus, 
  RefreshCw,
  Download,
  Edit,
  Eye,
  Calendar,
  Route,
  Clock,
  TrendingUp,
  BarChart3
} from "lucide-react";

const MileageManagement = () => {
  const { token } = useAuth();
  const [mileageLogs, setMileageLogs] = useState<MileageLog[]>([]);
  const [trainsets, setTrainsets] = useState<Trainset[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedTrainset, setSelectedTrainset] = useState("all");
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [newMileageLog, setNewMileageLog] = useState<Partial<MileageLog>>({
    route_assignments: []
  });

  useEffect(() => {
    if (token) {
      loadMileageData();
    }
  }, [token]);

  const loadMileageData = async () => {
    try {
      setLoading(true);
      const [logsResponse, trainsetsResponse] = await Promise.all([
        fleetService.getMileageLogs(token!),
        fleetService.getTrainsets(token!)
      ]);
      
      setMileageLogs(logsResponse.results);
      setTrainsets(trainsetsResponse.results);
    } catch (error: any) {
      toast({
        title: "Error Loading Mileage Data",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCreateMileageLog = async () => {
    try {
      if (!newMileageLog.trainset || !newMileageLog.date || !newMileageLog.starting_mileage || !newMileageLog.ending_mileage) {
        toast({
          title: "Validation Error",
          description: "Please fill in all required fields",
          variant: "destructive",
        });
        return;
      }

      // Calculate distance covered
      const distance = (parseFloat(newMileageLog.ending_mileage!) - parseFloat(newMileageLog.starting_mileage!)).toString();
      const logData = {
        ...newMileageLog,
        distance_covered: distance
      };

      await fleetService.createMileageLog(token!, logData);
      toast({
        title: "Success",
        description: "Mileage log created successfully",
      });
      setShowCreateDialog(false);
      setNewMileageLog({ route_assignments: [] });
      loadMileageData();
    } catch (error: any) {
      toast({
        title: "Error Creating Mileage Log",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const handleExportData = async () => {
    try {
      const data = await fleetService.getMileageLogs(token!, { format: 'json', page_size: 1000 });
      const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `mileage-logs-${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      
      toast({
        title: "Success",
        description: "Mileage data exported successfully",
      });
    } catch (error: any) {
      toast({
        title: "Error Exporting Data",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const filteredLogs = mileageLogs.filter(log => {
    const trainset = trainsets.find(t => t.id === log.trainset);
    const trainsetNumber = trainset?.trainset_number || '';
    const matchesSearch = trainsetNumber.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesTrainset = selectedTrainset === "all" || log.trainset === selectedTrainset;
    return matchesSearch && matchesTrainset;
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <RefreshCw className="h-8 w-8 animate-spin mx-auto mb-4" />
          <p>Loading mileage data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Mileage Management</h1>
          <p className="text-muted-foreground">Track and manage trainset mileage logs and service records</p>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="outline" size="sm" onClick={loadMileageData}>
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
          <Button variant="outline" size="sm" onClick={handleExportData}>
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
          <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
            <DialogTrigger asChild>
              <Button className="btn-government">
                <Plus className="h-4 w-4 mr-2" />
                Add Mileage Log
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Create New Mileage Log</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="trainset">Trainset *</Label>
                    <Select value={newMileageLog.trainset} onValueChange={(value) => setNewMileageLog({...newMileageLog, trainset: value})}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select trainset" />
                      </SelectTrigger>
                      <SelectContent>
                        {trainsets.map(trainset => (
                          <SelectItem key={trainset.id} value={trainset.id}>{trainset.trainset_number}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="date">Date *</Label>
                    <Input
                      id="date"
                      type="date"
                      value={newMileageLog.date || ''}
                      onChange={(e) => setNewMileageLog({...newMileageLog, date: e.target.value})}
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="starting_mileage">Starting Mileage (km) *</Label>
                    <Input
                      id="starting_mileage"
                      type="number"
                      step="0.01"
                      value={newMileageLog.starting_mileage || ''}
                      onChange={(e) => setNewMileageLog({...newMileageLog, starting_mileage: e.target.value})}
                      placeholder="15000.50"
                    />
                  </div>
                  <div>
                    <Label htmlFor="ending_mileage">Ending Mileage (km) *</Label>
                    <Input
                      id="ending_mileage"
                      type="number"
                      step="0.01"
                      value={newMileageLog.ending_mileage || ''}
                      onChange={(e) => setNewMileageLog({...newMileageLog, ending_mileage: e.target.value})}
                      placeholder="15125.75"
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="service_hours">Service Hours</Label>
                  <Input
                    id="service_hours"
                    type="number"
                    step="0.1"
                    value={newMileageLog.service_hours || ''}
                    onChange={(e) => setNewMileageLog({...newMileageLog, service_hours: e.target.value})}
                    placeholder="8.5"
                  />
                </div>
                <div className="flex justify-end space-x-2">
                  <Button variant="outline" onClick={() => setShowCreateDialog(false)}>
                    Cancel
                  </Button>
                  <Button onClick={handleCreateMileageLog}>
                    Create Log
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Mileage Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <div className="bg-primary/10 p-2 rounded-lg">
                <Activity className="h-4 w-4 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total Logs</p>
                <p className="text-2xl font-bold">{mileageLogs.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <div className="bg-info/10 p-2 rounded-lg">
                <Route className="h-4 w-4 text-info" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total Distance</p>
                <p className="text-2xl font-bold">
                  {mileageLogs.reduce((sum, log) => sum + parseFloat(log.distance_covered), 0).toLocaleString()} km
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <div className="bg-success/10 p-2 rounded-lg">
                <Clock className="h-4 w-4 text-success" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Service Hours</p>
                <p className="text-2xl font-bold">
                  {mileageLogs.reduce((sum, log) => sum + parseFloat(log.service_hours || '0'), 0).toFixed(1)}h
                </p>
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
                <p className="text-sm text-muted-foreground">Avg Daily Distance</p>
                <p className="text-2xl font-bold">
                  {mileageLogs.length > 0 ? 
                    (mileageLogs.reduce((sum, log) => sum + parseFloat(log.distance_covered), 0) / mileageLogs.length).toFixed(1) 
                    : '0'} km
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search by trainset number..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <Select value={selectedTrainset} onValueChange={setSelectedTrainset}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Filter by trainset" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Trainsets</SelectItem>
                {trainsets.map(trainset => (
                  <SelectItem key={trainset.id} value={trainset.id}>{trainset.trainset_number}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Mileage Logs */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Activity className="h-5 w-5" />
            <span>Mileage Logs ({filteredLogs.length})</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-96">
            <div className="space-y-4">
              {filteredLogs.map((log) => {
                const trainset = trainsets.find(t => t.id === log.trainset);
                return (
                  <Card key={log.id} className="hover:shadow-government-md transition-shadow">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center space-x-3">
                          <div className="bg-primary/10 p-2 rounded-lg">
                            <Activity className="h-4 w-4 text-primary" />
                          </div>
                          <div>
                            <h4 className="font-semibold">{trainset?.trainset_number || 'Unknown'}</h4>
                            <p className="text-sm text-muted-foreground">
                              {new Date(log.date).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                        <Badge variant="outline">
                          {log.distance_covered} km
                        </Badge>
                      </div>
                      
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                        <div>
                          <p className="text-muted-foreground">Starting Mileage</p>
                          <p className="font-medium">{parseFloat(log.starting_mileage).toLocaleString()} km</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">Ending Mileage</p>
                          <p className="font-medium">{parseFloat(log.ending_mileage).toLocaleString()} km</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">Service Hours</p>
                          <p className="font-medium">{log.service_hours || 'N/A'}</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">Distance Covered</p>
                          <p className="font-medium">{parseFloat(log.distance_covered).toFixed(2)} km</p>
                        </div>
                      </div>

                      {log.route_assignments && log.route_assignments.length > 0 && (
                        <div className="mt-3 pt-3 border-t border-border">
                          <p className="text-sm text-muted-foreground mb-2">Route Assignments:</p>
                          <div className="flex flex-wrap gap-1">
                            {log.route_assignments.map((route, index) => (
                              <Badge key={index} variant="secondary" className="text-xs">
                                {route}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      )}

                      <div className="flex items-center space-x-2 mt-4">
                        <Button size="sm" variant="outline">
                          <Eye className="h-4 w-4 mr-1" />
                          View Details
                        </Button>
                        <Button size="sm" variant="outline">
                          <Edit className="h-4 w-4 mr-1" />
                          Edit
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </ScrollArea>
        </CardContent>
      </Card>
    </div>
  );
};

export default MileageManagement;