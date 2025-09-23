import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useAuth } from "@/contexts/AuthContext";
import { userService, User, Department, Role, CreateUserRequest } from "@/services/users";
import { toast } from "@/hooks/use-toast";
import { 
  Users, 
  UserPlus, 
  Search, 
  Filter, 
  MoreVertical,
  Edit,
  Trash2,
  Shield,
  Clock,
  CheckCircle,
  AlertTriangle,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Activity,
  Settings,
  Eye,
  Download,
  RefreshCw
} from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";

const UserManagement = () => {
  const { token } = useAuth();
  const [users, setUsers] = useState<User[]>([]);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [roles, setRoles] = useState<Role[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedRole, setSelectedRole] = useState("all");
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [newUser, setNewUser] = useState<CreateUserRequest>({
    employee_id: '',
    email: '',
    password: '',
    password_confirm: '',
    first_name: '',
    last_name: '',
    phone_number: '',
    designation: '',
    shift_type: 'DAY'
  });

  useEffect(() => {
    if (token) {
      loadUserData();
    }
  }, [token]);

  const loadUserData = async () => {
    try {
      setLoading(true);
      const [usersResponse, departmentsResponse, rolesResponse] = await Promise.all([
        userService.getUsers(token!),
        userService.getDepartments(token!),
        userService.getRoles(token!)
      ]);
      
      setUsers(usersResponse.results);
      setDepartments(departmentsResponse.results);
      setRoles(rolesResponse.results);
    } catch (error: any) {
      toast({
        title: "Error Loading User Data",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCreateUser = async () => {
    try {
      if (!newUser.employee_id || !newUser.email || !newUser.password || !newUser.first_name || !newUser.last_name) {
        toast({
          title: "Validation Error",
          description: "Please fill in all required fields",
          variant: "destructive",
        });
        return;
      }

      if (newUser.password !== newUser.password_confirm) {
        toast({
          title: "Validation Error",
          description: "Passwords do not match",
          variant: "destructive",
        });
        return;
      }

      await userService.createUser(token!, newUser);
      toast({
        title: "Success",
        description: "User created successfully",
      });
      setShowCreateDialog(false);
      setNewUser({
        employee_id: '',
        email: '',
        password: '',
        password_confirm: '',
        first_name: '',
        last_name: '',
        phone_number: '',
        designation: '',
        shift_type: 'DAY'
      });
      loadUserData();
    } catch (error: any) {
      toast({
        title: "Error Creating User",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const getStatusColor = (status: string | boolean) => {
    switch (status) {
      case true:
      case 'true':
      case 'Active':
        return 'bg-success text-success-foreground';
      case false:
      case 'false':
      case 'Inactive':
        return 'bg-muted text-muted-foreground';
      default:
        return 'bg-muted text-muted-foreground';
    }
  };

  const getRoleIcon = (roleType: string) => {
    switch (roleType) {
      case 'ADMIN': return <Shield className="h-4 w-4" />;
      case 'SUPERVISOR': return <Users className="h-4 w-4" />;
      case 'TECHNICIAN': return <Settings className="h-4 w-4" />;
      case 'OPERATOR': return <Activity className="h-4 w-4" />;
      case 'VIEWER': return <Eye className="h-4 w-4" />;
      case 'Operations Manager': return <Shield className="h-4 w-4" />;
      case 'Fleet Supervisor': return <Users className="h-4 w-4" />;
      case 'Maintenance Engineer': return <Settings className="h-4 w-4" />;
      case 'System Administrator': return <Activity className="h-4 w-4" />;
      case 'Operations Analyst': return <Eye className="h-4 w-4" />;
      case 'Fleet Coordinator': return <Users className="h-4 w-4" />;
      default: return <Users className="h-4 w-4" />;
    }
  };

  const filteredUsers = users.filter(user => {
    const fullName = `${user.first_name} ${user.last_name}`.trim();
    const matchesSearch = fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.employee_id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = selectedRole === "all" || (user.role && (typeof user.role === 'object' ? user.role.name : user.role) === selectedRole);
    const matchesStatus = selectedStatus === "all" || (user.is_active ? 'Active' : 'Inactive') === selectedStatus;
    
    return matchesSearch && matchesRole && matchesStatus;
  });

  const userStats = {
    total: users.length,
    active: users.filter(u => u.is_active).length,
    inactive: users.filter(u => !u.is_active).length,
    online: users.filter(u => u.last_login && new Date(u.last_login) > new Date(Date.now() - 24 * 60 * 60 * 1000)).length
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <RefreshCw className="h-8 w-8 animate-spin mx-auto mb-4" />
          <p>Loading user data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-foreground">User Management</h1>
          <p className="text-sm sm:text-base text-muted-foreground">Manage KMRL staff access and permissions for fleet operations</p>
        </div>
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
          <Button variant="outline" size="sm" className="w-full sm:w-auto" onClick={loadUserData}>
            <RefreshCw className="h-4 w-4 mr-2" />
            <span className="hidden sm:inline">Refresh</span>
            <span className="sm:hidden">Refresh</span>
          </Button>
          <Button variant="outline" size="sm" className="w-full sm:w-auto">
            <Download className="h-4 w-4 mr-2" />
            <span className="hidden sm:inline">Export Users</span>
            <span className="sm:hidden">Export</span>
          </Button>
          <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
            <DialogTrigger asChild>
              <Button className="btn-government w-full sm:w-auto">
                <UserPlus className="h-4 w-4 mr-2" />
                <span className="hidden sm:inline">Add User</span>
                <span className="sm:hidden">Add</span>
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle className="text-lg sm:text-xl">Add New User</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="employee_id" className="text-sm">Employee ID *</Label>
                    <Input 
                      id="employee_id" 
                      placeholder="EMP001" 
                      value={newUser.employee_id}
                      onChange={(e) => setNewUser({...newUser, employee_id: e.target.value})}
                      className="h-10" 
                    />
                  </div>
                  <div>
                    <Label htmlFor="email" className="text-sm">Email Address *</Label>
                    <Input 
                      id="email" 
                      type="email" 
                      placeholder="user@kmrl.gov.in" 
                      value={newUser.email}
                      onChange={(e) => setNewUser({...newUser, email: e.target.value})}
                      className="h-10" 
                    />
                  </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="first_name" className="text-sm">First Name *</Label>
                    <Input 
                      id="first_name" 
                      placeholder="John" 
                      value={newUser.first_name}
                      onChange={(e) => setNewUser({...newUser, first_name: e.target.value})}
                      className="h-10" 
                    />
                  </div>
                  <div>
                    <Label htmlFor="last_name" className="text-sm">Last Name *</Label>
                    <Input 
                      id="last_name" 
                      placeholder="Doe" 
                      value={newUser.last_name}
                      onChange={(e) => setNewUser({...newUser, last_name: e.target.value})}
                      className="h-10" 
                    />
                  </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="password" className="text-sm">Password *</Label>
                    <Input 
                      id="password" 
                      type="password" 
                      placeholder="Enter password" 
                      value={newUser.password}
                      onChange={(e) => setNewUser({...newUser, password: e.target.value})}
                      className="h-10" 
                    />
                  </div>
                  <div>
                    <Label htmlFor="password_confirm" className="text-sm">Confirm Password *</Label>
                    <Input 
                      id="password_confirm" 
                      type="password" 
                      placeholder="Confirm password" 
                      value={newUser.password_confirm}
                      onChange={(e) => setNewUser({...newUser, password_confirm: e.target.value})}
                      className="h-10" 
                    />
                  </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="phone_number" className="text-sm">Phone Number</Label>
                    <Input 
                      id="phone_number" 
                      placeholder="+91 98765 43210" 
                      value={newUser.phone_number}
                      onChange={(e) => setNewUser({...newUser, phone_number: e.target.value})}
                      className="h-10" 
                    />
                  </div>
                  <div>
                    <Label htmlFor="designation" className="text-sm">Designation</Label>
                    <Input 
                      id="designation" 
                      placeholder="Operations Manager" 
                      value={newUser.designation}
                      onChange={(e) => setNewUser({...newUser, designation: e.target.value})}
                      className="h-10" 
                    />
                  </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="department" className="text-sm">Department</Label>
                    <Select value={newUser.department} onValueChange={(value) => setNewUser({...newUser, department: value})}>
                      <SelectTrigger className="h-10">
                        <SelectValue placeholder="Select department" />
                      </SelectTrigger>
                      <SelectContent>
                        {roles.map(role => (
                          <SelectItem key={role.id} value={role.name}>{role.name}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="shift_type" className="text-sm">Shift Type</Label>
                    <Select value={newUser.shift_type} onValueChange={(value) => setNewUser({...newUser, shift_type: value as any})}>
                      <SelectTrigger className="h-10">
                        <SelectValue placeholder="Select shift" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="DAY">Day Shift</SelectItem>
                        <SelectItem value="NIGHT">Night Shift</SelectItem>
                        <SelectItem value="ROTATING">Rotating Shift</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="flex flex-col sm:flex-row justify-end gap-2 pt-4">
                  <Button variant="outline" className="w-full sm:w-auto" onClick={() => setShowCreateDialog(false)}>
                    Cancel
                  </Button>
                  <Button className="btn-government w-full sm:w-auto" onClick={handleCreateUser}>
                    Add User
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <Card>
          <CardContent className="p-3 sm:p-4 lg:p-6">
            <div className="flex items-center space-x-2">
              <div className="bg-primary/10 p-1.5 sm:p-2 rounded-lg">
                <Users className="h-3 w-3 sm:h-4 sm:w-4 text-primary" />
              </div>
              <div className="min-w-0">
                <p className="text-xs sm:text-sm text-muted-foreground truncate">Total Users</p>
                <p className="text-lg sm:text-xl lg:text-2xl font-bold">{userStats.total}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-3 sm:p-4 lg:p-6">
            <div className="flex items-center space-x-2">
              <div className="bg-success/10 p-1.5 sm:p-2 rounded-lg">
                <CheckCircle className="h-3 w-3 sm:h-4 sm:w-4 text-success" />
              </div>
              <div className="min-w-0">
                <p className="text-xs sm:text-sm text-muted-foreground truncate">Active Users</p>
                <p className="text-lg sm:text-xl lg:text-2xl font-bold">{userStats.active}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-3 sm:p-4 lg:p-6">
            <div className="flex items-center space-x-2">
              <div className="bg-warning/10 p-1.5 sm:p-2 rounded-lg">
                <Clock className="h-3 w-3 sm:h-4 sm:w-4 text-warning" />
              </div>
              <div className="min-w-0">
                <p className="text-xs sm:text-sm text-muted-foreground truncate">Online Now</p>
                <p className="text-lg sm:text-xl lg:text-2xl font-bold">{userStats.online}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-3 sm:p-4 lg:p-6">
            <div className="flex items-center space-x-2">
              <div className="bg-muted/10 p-1.5 sm:p-2 rounded-lg">
                <AlertTriangle className="h-3 w-3 sm:h-4 sm:w-4 text-muted-foreground" />
              </div>
              <div className="min-w-0">
                <p className="text-xs sm:text-sm text-muted-foreground truncate">Inactive Users</p>
                <p className="text-lg sm:text-xl lg:text-2xl font-bold">{userStats.inactive}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters and Search */}
      <Card>
        <CardContent className="p-3 sm:p-4 lg:p-6">
          <div className="flex flex-col gap-3 sm:gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-2 sm:left-3 top-1/2 transform -translate-y-1/2 h-3 w-3 sm:h-4 sm:w-4 text-muted-foreground" />
                <Input
                  placeholder="Search users by name, email, or employee ID..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-7 sm:pl-10 h-9 sm:h-10 text-sm"
                />
              </div>
            </div>
            <div className="flex flex-col sm:flex-row gap-2">
              <Select value={selectedRole} onValueChange={setSelectedRole}>
                <SelectTrigger className="w-full sm:w-48 h-9 sm:h-10">
                  <SelectValue placeholder="Filter by role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Roles</SelectItem>
                  {roles.map(role => (
                    <SelectItem key={role.id} value={role.name}>{role.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                <SelectTrigger className="w-full sm:w-32 h-9 sm:h-10">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="Active">Active</SelectItem>
                  <SelectItem value="Inactive">Inactive</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Users Table */}
      <Card>
        <CardHeader className="p-3 sm:p-6">
          <CardTitle className="flex items-center space-x-2 text-sm sm:text-base">
            <Users className="h-4 w-4 sm:h-5 sm:w-5" />
            <span>KMRL Staff Directory ({filteredUsers.length} users)</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="space-y-0">
            {filteredUsers.map((user, index) => (
              <div key={user.id} className={`p-3 sm:p-4 lg:p-6 border-b border-border hover:bg-muted/30 transition-colors ${index === filteredUsers.length - 1 ? 'border-b-0' : ''}`}>
                {/* Mobile Layout */}
                <div className="block sm:hidden">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center space-x-3">
                      <Avatar className="h-10 w-10">
                        <AvatarImage src="" />
                        <AvatarFallback className="bg-primary/10 text-primary font-semibold text-sm">
                          {user.first_name[0]}{user.last_name[0]}
                        </AvatarFallback>
                      </Avatar>
                      <div className="min-w-0 flex-1">
                        <h3 className="font-semibold text-foreground text-sm truncate">
                          {user.first_name} {user.last_name}
                        </h3>
                        <p className="text-xs text-muted-foreground truncate">
                          {user.role ? (typeof user.role === 'object' ? user.role.name : user.role) : user.designation}
                        </p>
                        <div className="flex items-center gap-1 mt-1">
                          <Badge className={`${getStatusColor(user.is_active)} text-xs px-1.5 py-0.5`} variant="secondary">
                            {user.is_active ? 'Active' : 'Inactive'}
                          </Badge>
                          {user.grade && (
                            <Badge variant="outline" className="text-xs px-1.5 py-0.5">
                              {user.grade}
                            </Badge>
                          )}
                        </div>
                      </div>
                    </div>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem>
                          <Eye className="h-4 w-4 mr-2" />
                          View Details
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Edit className="h-4 w-4 mr-2" />
                          Edit User
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Settings className="h-4 w-4 mr-2" />
                          Manage Permissions
                        </DropdownMenuItem>
                        <DropdownMenuItem className="text-destructive">
                          <Trash2 className="h-4 w-4 mr-2" />
                          Deactivate User
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                  
                  <div className="space-y-2 text-xs text-muted-foreground">
                    <div className="flex items-center space-x-1">
                      <Mail className="h-3 w-3" />
                      <span className="truncate">{user.email}</span>
                    </div>
                    {user.phone_number && (
                    <div className="flex items-center space-x-1">
                      <Phone className="h-3 w-3" />
                      <span>{user.phone_number}</span>
                    </div>
                    )}
                    {user.department && (
                      <div className="flex items-center space-x-1">
                        <MapPin className="h-3 w-3" />
                        <span>{typeof user.department === 'object' ? user.department.name : user.department}</span>
                      </div>
                    )}
                    {user.last_login && (
                    <div className="flex items-center space-x-1">
                      <Clock className="h-3 w-3" />
                      <span>Last login: {new Date(user.last_login).toLocaleString()}</span>
                    </div>
                    )}
                  </div>
                  
                  <div className="mt-3 pt-3 border-t border-border">
                    <div className="space-y-2">
                      <div>
                        <p className="text-xs text-muted-foreground mb-1">Employee Details</p>
                        <p className="text-xs">ID: {user.employee_id}</p>
                        {user.designation && <p className="text-xs">Designation: {user.designation}</p>}
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">
                          Shift: {user.shift_type ? user.shift_type.replace('_', ' ') : 'Not specified'}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Desktop Layout */}
                <div className="hidden sm:block">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <Avatar className="h-12 w-12">
                        <AvatarImage src="" />
                        <AvatarFallback className="bg-primary/10 text-primary font-semibold">
                          {user.first_name[0]}{user.last_name[0]}
                        </AvatarFallback>
                      </Avatar>
                      
                      <div className="space-y-1">
                        <div className="flex items-center space-x-2">
                          <h3 className="font-semibold text-foreground">{user.first_name} {user.last_name}</h3>
                          <Badge className={getStatusColor(user.is_active)} variant="secondary">
                            {user.is_active ? 'Active' : 'Inactive'}
                          </Badge>
                          {user.grade && (
                            <Badge variant="outline">
                              {user.grade}
                            </Badge>
                          )}
                        </div>
                        
                        <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                          <div className="flex items-center space-x-1">
                            <Mail className="h-3 w-3" />
                            <span>{user.email}</span>
                          </div>
                          {user.phone_number && (
                          <div className="flex items-center space-x-1">
                            <Phone className="h-3 w-3" />
                            <span>{user.phone_number}</span>
                          </div>
                          )}
                          {user.department && (
                            <div className="flex items-center space-x-1">
                              <MapPin className="h-3 w-3" />
                              <span>{typeof user.department === 'object' ? user.department.name : user.department}</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-4">
                      <div className="text-right space-y-1">
                        <div className="flex items-center space-x-2">
                          {getRoleIcon(user.role ? (typeof user.role === 'object' ? user.role.role_type : user.role) : 'VIEWER')}
                          <span className="text-sm font-medium">
                            {user.role ? (typeof user.role === 'object' ? user.role.name : user.role) : user.designation}
                          </span>
                        </div>
                        <p className="text-xs text-muted-foreground">
                          {user.department ? (typeof user.department === 'object' ? user.department.name : user.department) : 'No Department'}
                        </p>
                        <p className="text-xs text-muted-foreground">ID: {user.employee_id}</p>
                        {user.last_login && (
                        <div className="flex items-center space-x-2 text-xs text-muted-foreground">
                          <Clock className="h-3 w-3" />
                          <span>Last login: {new Date(user.last_login).toLocaleString()}</span>
                        </div>
                        )}
                      </div>
                      
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm">
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem>
                            <Eye className="h-4 w-4 mr-2" />
                            View Details
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Edit className="h-4 w-4 mr-2" />
                            Edit User
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Settings className="h-4 w-4 mr-2" />
                            Manage Permissions
                          </DropdownMenuItem>
                          <DropdownMenuItem className="text-destructive">
                            <Trash2 className="h-4 w-4 mr-2" />
                            Deactivate User
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </div>
                  
                  {/* Permissions and Shift Info */}
                  <div className="mt-4 flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div>
                        <p className="text-xs text-muted-foreground mb-1">Employee Information</p>
                        <p className="text-xs">ID: {user.employee_id}</p>
                        {user.designation && <p className="text-xs">Designation: {user.designation}</p>}
                        {user.joining_date && <p className="text-xs">Joined: {new Date(user.joining_date).toLocaleDateString()}</p>}
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-muted-foreground mb-1">Shift Schedule</p>
                      <p className="text-sm font-medium">
                        {user.shift_type ? user.shift_type.replace('_', ' ') + ' Shift' : 'Not specified'}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default UserManagement;

