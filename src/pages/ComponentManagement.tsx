import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useAuth } from "@/contexts/AuthContext";
import { fleetService, Component, ComponentType } from "@/services/fleet";
import { toast } from "@/hooks/use-toast";
import { 
  Settings, 
  Search, 
  Plus, 
  RefreshCw,
  Download,
  Edit,
  Eye,
  Trash2,
  AlertTriangle,
  CheckCircle,
  Clock,
  Wrench,
  Activity,
  TrendingUp,
  Filter
} from "lucide-react";

const ComponentManagement = () => {
  const { token } = useAuth();
  const [components, setComponents] = useState<Component[]>([]);
  const [componentTypes, setComponentTypes] = useState<ComponentType[]>([]);
  const [criticalComponents, setCriticalComponents] = useState<Component[]>([]);
  const [maintenanceDueComponents, setMaintenanceDueComponents] = useState<Component[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [healthFilter, setHealthFilter] = useState("all");
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [showHealthDialog, setShowHealthDialog] = useState(false);
  const [selectedComponent, setSelectedComponent] = useState<Component | null>(null);
  const [newComponent, setNewComponent] = useState<Partial<Component>>({});
  const [healthUpdate, setHealthUpdate] = useState({
    health_status: '',
    health_score: 0,
    next_inspection_due: '',
    inspection_notes: ''
  });

  useEffect(() => {
    if (token) {
      loadComponentData();
    }
  }, [token]);

  const loadComponentData = async () => {
    try {
      setLoading(true);
      const [
        componentsResponse,
        typesResponse,
        criticalResponse,
        maintenanceResponse
      ] = await Promise.all([
        fleetService.getComponents(token!),
        fleetService.getComponentTypes(token!),
        fleetService.getCriticalComponents(token!),
        fleetService.getMaintenanceDueComponents(token!)
      ]);
      
      setComponents(componentsResponse.results);
      setComponentTypes(typesResponse);
      setCriticalComponents(criticalResponse);
      setMaintenanceDueComponents(maintenanceResponse);
    } catch (error: any) {
      toast({
        title: "Error Loading Component Data",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCreateComponent = async () => {
    try {
      if (!newComponent.component_id || !newComponent.component_type || !newComponent.trainset) {
        toast({
          title: "Validation Error",
          description: "Please fill in all required fields",
          variant: "destructive",
        });
        return;
      }

      await fleetService.createComponent(token!, newComponent);
      toast({
        title: "Success",
        description: "Component created successfully",
      });
      setShowCreateDialog(false);
      setNewComponent({});
      loadComponentData();
    } catch (error: any) {
      toast({
        title: "Error Creating Component",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const handleUpdateHealth = async () => {
    if (!selectedComponent || !healthUpdate.health_status) return;
    
    try {
      await fleetService.updateComponentHealth(token!, selectedComponent.id, healthUpdate);
      toast({
        title: "Success",
        description: "Component health updated successfully",
      });
      setShowHealthDialog(false);
      setHealthUpdate({
        health_status: '',
        health_score: 0,
        next_inspection_due: '',
        inspection_notes: ''
      });
      loadComponentData();
    } catch (error: any) {
      toast({
        title: "Error Updating Component Health",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const getHealthStatusColor = (status: string) => {
    switch (status) {
      case 'EXCELLENT': return 'bg-green-100 text-green-800 border-green-200';
      case 'GOOD': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'FAIR': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'POOR': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'CRITICAL': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getHealthIcon = (status: string) => {
    switch (status) {
      case 'EXCELLENT': return <CheckCircle className="h-4 w-4" />;
      case 'GOOD': return <CheckCircle className="h-4 w-4" />;
      case 'FAIR': return <Clock className="h-4 w-4" />;
      case 'POOR': return <AlertTriangle className="h-4 w-4" />;
      case 'CRITICAL': return <AlertTriangle className="h-4 w-4" />;
      default: return <Settings className="h-4 w-4" />;
    }
  };

  const filteredComponents = components.filter(component => {
    const matchesSearch = component.component_id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (typeof component.component_type === 'object' ? component.component_type.name : component.component_type).toLowerCase().includes(searchTerm.toLowerCase());
    const matchesHealth = healthFilter === "all" || component.health_status === healthFilter;
    return matchesSearch && matchesHealth;
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <RefreshCw className="h-8 w-8 animate-spin mx-auto mb-4" />
          <p>Loading component data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Component Management</h1>
          <p className="text-muted-foreground">Monitor and manage trainset components and their health status</p>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="outline" size="sm" onClick={loadComponentData}>
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
          <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
            <DialogTrigger asChild>
              <Button className="btn-government">
                <Plus className="h-4 w-4 mr-2" />
                Add Component
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Create New Component</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="component_id">Component ID *</Label>
                    <Input
                      id="component_id"
                      value={newComponent.component_id || ''}
                      onChange={(e) => setNewComponent({...newComponent, component_id: e.target.value})}
                      placeholder="KMRL-001-HVAC-01"
                    />
                  </div>
                  <div>
                    <Label htmlFor="component_type">Component Type *</Label>
                    <Select value={newComponent.component_type as string} onValueChange={(value) => setNewComponent({...newComponent, component_type: value})}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select type" />
                      </SelectTrigger>
                      <SelectContent>
                        {componentTypes.map(type => (
                          <SelectItem key={type.id} value={type.id}>{type.name}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="serial_number">Serial Number</Label>
                    <Input
                      id="serial_number"
                      value={newComponent.serial_number || ''}
                      onChange={(e) => setNewComponent({...newComponent, serial_number: e.target.value})}
                      placeholder="SN123456"
                    />
                  </div>
                  <div>
                    <Label htmlFor="part_number">Part Number</Label>
                    <Input
                      id="part_number"
                      value={newComponent.part_number || ''}
                      onChange={(e) => setNewComponent({...newComponent, part_number: e.target.value})}
                      placeholder="PN789012"
                    />
                  </div>
                </div>
                <div className="flex justify-end space-x-2">
                  <Button variant="outline" onClick={() => setShowCreateDialog(false)}>
                    Cancel
                  </Button>
                  <Button onClick={handleCreateComponent}>
                    Create Component
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Component Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <div className="bg-primary/10 p-2 rounded-lg">
                <Settings className="h-4 w-4 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total Components</p>
                <p className="text-2xl font-bold">{components.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <div className="bg-destructive/10 p-2 rounded-lg">
                <AlertTriangle className="h-4 w-4 text-destructive" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Critical Components</p>
                <p className="text-2xl font-bold text-destructive">{criticalComponents.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <div className="bg-warning/10 p-2 rounded-lg">
                <Wrench className="h-4 w-4 text-warning" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Maintenance Due</p>
                <p className="text-2xl font-bold text-warning">{maintenanceDueComponents.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <div className="bg-success/10 p-2 rounded-lg">
                <CheckCircle className="h-4 w-4 text-success" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Healthy Components</p>
                <p className="text-2xl font-bold text-success">
                  {components.filter(c => c.health_status === 'EXCELLENT' || c.health_status === 'GOOD').length}
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
                  placeholder="Search components..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <Select value={healthFilter} onValueChange={setHealthFilter}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Filter by health" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Health Status</SelectItem>
                <SelectItem value="EXCELLENT">Excellent</SelectItem>
                <SelectItem value="GOOD">Good</SelectItem>
                <SelectItem value="FAIR">Fair</SelectItem>
                <SelectItem value="POOR">Poor</SelectItem>
                <SelectItem value="CRITICAL">Critical</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="all" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="all">All Components</TabsTrigger>
          <TabsTrigger value="critical">Critical</TabsTrigger>
          <TabsTrigger value="maintenance">Maintenance Due</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredComponents.map((component) => (
              <Card key={component.id} className="hover:shadow-government-md transition-shadow">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">{component.component_id}</CardTitle>
                    <Badge className={getHealthStatusColor(component.health_status)}>
                      {getHealthIcon(component.health_status)}
                      {component.health_status}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Health Score</span>
                      <span className="font-medium">{component.health_score.toFixed(1)}%</span>
                    </div>
                    <Progress value={component.health_score} className="h-2" />
                  </div>

                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-muted-foreground">Type</p>
                      <p className="font-medium">
                        {typeof component.component_type === 'object' ? component.component_type.name : component.component_type}
                      </p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Serial Number</p>
                      <p className="font-medium">{component.serial_number || 'N/A'}</p>
                    </div>
                    {component.operating_hours && (
                      <div>
                        <p className="text-muted-foreground">Operating Hours</p>
                        <p className="font-medium">{component.operating_hours}</p>
                      </div>
                    )}
                    {component.cycles_completed && (
                      <div>
                        <p className="text-muted-foreground">Cycles</p>
                        <p className="font-medium">{component.cycles_completed}</p>
                      </div>
                    )}
                  </div>

                  <div className="flex items-center space-x-2 pt-2">
                    <Button size="sm" variant="outline" className="flex-1">
                      <Eye className="h-4 w-4 mr-1" />
                      View
                    </Button>
                    <Dialog open={showHealthDialog} onOpenChange={setShowHealthDialog}>
                      <DialogTrigger asChild>
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => {
                            setSelectedComponent(component);
                            setHealthUpdate({
                              health_status: component.health_status,
                              health_score: component.health_score,
                              next_inspection_due: component.next_inspection_due?.split('T')[0] || '',
                              inspection_notes: ''
                            });
                          }}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                      </DialogTrigger>
                    </Dialog>
                  </div>

                  {component.next_inspection_due && (
                    <div className="pt-2 border-t border-border">
                      <div className="flex items-center space-x-2 text-xs text-muted-foreground">
                        <Clock className="h-3 w-3" />
                        <span>Next inspection: {new Date(component.next_inspection_due).toLocaleDateString()}</span>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="critical" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <AlertTriangle className="h-5 w-5 text-destructive" />
                <span>Critical Components</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {criticalComponents.map((component) => (
                  <div key={component.id} className="flex items-center justify-between p-4 rounded-lg bg-destructive/5 border border-destructive/20">
                    <div className="flex items-center space-x-4">
                      <div className="bg-destructive/10 p-2 rounded-lg">
                        <AlertTriangle className="h-4 w-4 text-destructive" />
                      </div>
                      <div>
                        <h4 className="font-medium">{component.component_id}</h4>
                        <p className="text-sm text-muted-foreground">
                          {typeof component.component_type === 'object' ? component.component_type.name : component.component_type}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-4">
                      <div className="text-right">
                        <p className="text-sm font-medium">Health: {component.health_score.toFixed(1)}%</p>
                        <Badge className={getHealthStatusColor(component.health_status)}>
                          {component.health_status}
                        </Badge>
                      </div>
                      <Button size="sm" variant="outline">
                        <Wrench className="h-4 w-4 mr-1" />
                        Schedule Maintenance
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="maintenance" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Wrench className="h-5 w-5 text-warning" />
                <span>Maintenance Due Components</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {maintenanceDueComponents.map((component) => (
                  <div key={component.id} className="flex items-center justify-between p-4 rounded-lg bg-warning/5 border border-warning/20">
                    <div className="flex items-center space-x-4">
                      <div className="bg-warning/10 p-2 rounded-lg">
                        <Clock className="h-4 w-4 text-warning" />
                      </div>
                      <div>
                        <h4 className="font-medium">{component.component_id}</h4>
                        <p className="text-sm text-muted-foreground">
                          Due: {component.next_inspection_due ? new Date(component.next_inspection_due).toLocaleDateString() : 'Not scheduled'}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Button size="sm" variant="outline">
                        <Calendar className="h-4 w-4 mr-1" />
                        Schedule
                      </Button>
                      <Button size="sm" variant="outline">
                        <CheckCircle className="h-4 w-4 mr-1" />
                        Complete
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Health Update Dialog */}
      <Dialog open={showHealthDialog} onOpenChange={setShowHealthDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Update Component Health - {selectedComponent?.component_id}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="health_status">Health Status</Label>
              <Select value={healthUpdate.health_status} onValueChange={(value) => setHealthUpdate({...healthUpdate, health_status: value})}>
                <SelectTrigger>
                  <SelectValue placeholder="Select health status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="EXCELLENT">Excellent</SelectItem>
                  <SelectItem value="GOOD">Good</SelectItem>
                  <SelectItem value="FAIR">Fair</SelectItem>
                  <SelectItem value="POOR">Poor</SelectItem>
                  <SelectItem value="CRITICAL">Critical</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="health_score">Health Score (0-100)</Label>
              <Input
                id="health_score"
                type="number"
                min="0"
                max="100"
                value={healthUpdate.health_score}
                onChange={(e) => setHealthUpdate({...healthUpdate, health_score: parseFloat(e.target.value)})}
              />
            </div>
            <div>
              <Label htmlFor="next_inspection_due">Next Inspection Due</Label>
              <Input
                id="next_inspection_due"
                type="date"
                value={healthUpdate.next_inspection_due}
                onChange={(e) => setHealthUpdate({...healthUpdate, next_inspection_due: e.target.value})}
              />
            </div>
            <div>
              <Label htmlFor="inspection_notes">Inspection Notes</Label>
              <Textarea
                id="inspection_notes"
                value={healthUpdate.inspection_notes}
                onChange={(e) => setHealthUpdate({...healthUpdate, inspection_notes: e.target.value})}
                placeholder="Enter inspection notes"
              />
            </div>
            <div className="flex justify-end space-x-2">
              <Button variant="outline" onClick={() => setShowHealthDialog(false)}>
                Cancel
              </Button>
              <Button onClick={handleUpdateHealth}>
                Update Health
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ComponentManagement;