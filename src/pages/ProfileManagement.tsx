import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { useAuth } from "@/contexts/AuthContext";
import { authService, UserProfile, UserPreferences, ChangePasswordRequest } from "@/services/auth";
import { toast } from "@/hooks/use-toast";
import { 
  User, 
  Mail, 
  Phone, 
  Shield, 
  Settings, 
  Bell, 
  Lock,
  Save,
  RefreshCw,
  Eye,
  EyeOff,
  Calendar,
  MapPin,
  Badge as BadgeIcon
} from "lucide-react";

const ProfileManagement = () => {
  const { user, token } = useAuth();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [preferences, setPreferences] = useState<UserPreferences | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showPasswordForm, setShowPasswordForm] = useState(false);
  const [passwordData, setPasswordData] = useState<ChangePasswordRequest>({
    old_password: '',
    new_password: '',
    new_password_confirm: ''
  });
  const [showPasswords, setShowPasswords] = useState({
    old: false,
    new: false,
    confirm: false
  });

  useEffect(() => {
    if (token) {
      loadProfileData();
    }
  }, [token]);

  const loadProfileData = async () => {
    try {
      setLoading(true);
      const [profileData, preferencesData] = await Promise.all([
        authService.getProfile(token!),
        authService.getPreferences(token!)
      ]);
      
      setProfile(profileData);
      setPreferences(preferencesData);
    } catch (error: any) {
      toast({
        title: "Error Loading Profile",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateProfile = async () => {
    if (!profile) return;
    
    try {
      setSaving(true);
      const updatedProfile = await authService.updateProfile(token!, profile);
      setProfile(updatedProfile);
      toast({
        title: "Success",
        description: "Profile updated successfully",
      });
    } catch (error: any) {
      toast({
        title: "Error Updating Profile",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  const handleUpdatePreferences = async () => {
    if (!preferences) return;
    
    try {
      setSaving(true);
      const updatedPreferences = await authService.updatePreferences(token!, preferences);
      setPreferences(updatedPreferences);
      toast({
        title: "Success",
        description: "Preferences updated successfully",
      });
    } catch (error: any) {
      toast({
        title: "Error Updating Preferences",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  const handleChangePassword = async () => {
    try {
      if (!passwordData.old_password || !passwordData.new_password || !passwordData.new_password_confirm) {
        toast({
          title: "Validation Error",
          description: "Please fill in all password fields",
          variant: "destructive",
        });
        return;
      }

      if (passwordData.new_password !== passwordData.new_password_confirm) {
        toast({
          title: "Validation Error",
          description: "New passwords do not match",
          variant: "destructive",
        });
        return;
      }

      setSaving(true);
      await authService.changePassword(token!, passwordData);
      toast({
        title: "Success",
        description: "Password changed successfully",
      });
      setShowPasswordForm(false);
      setPasswordData({
        old_password: '',
        new_password: '',
        new_password_confirm: ''
      });
    } catch (error: any) {
      toast({
        title: "Error Changing Password",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <RefreshCw className="h-8 w-8 animate-spin mx-auto mb-4" />
          <p>Loading profile data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Profile Management</h1>
          <p className="text-muted-foreground">Manage your account settings and preferences</p>
        </div>
        <Button variant="outline" size="sm" onClick={loadProfileData}>
          <RefreshCw className="h-4 w-4 mr-2" />
          Refresh
        </Button>
      </div>

      <Tabs defaultValue="profile" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="profile">Profile</TabsTrigger>
          <TabsTrigger value="preferences">Preferences</TabsTrigger>
          <TabsTrigger value="security">Security</TabsTrigger>
        </TabsList>

        <TabsContent value="profile" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <User className="h-5 w-5" />
                <span>Personal Information</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {profile && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="first_name">First Name</Label>
                    <Input
                      id="first_name"
                      value={profile.first_name}
                      onChange={(e) => setProfile({...profile, first_name: e.target.value})}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="last_name">Last Name</Label>
                    <Input
                      id="last_name"
                      value={profile.last_name}
                      onChange={(e) => setProfile({...profile, last_name: e.target.value})}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="middle_name">Middle Name</Label>
                    <Input
                      id="middle_name"
                      value={profile.middle_name || ''}
                      onChange={(e) => setProfile({...profile, middle_name: e.target.value})}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      value={profile.email}
                      disabled
                      className="bg-muted"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone_number">Phone Number</Label>
                    <Input
                      id="phone_number"
                      value={profile.phone_number || ''}
                      onChange={(e) => setProfile({...profile, phone_number: e.target.value})}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="alternate_phone">Alternate Phone</Label>
                    <Input
                      id="alternate_phone"
                      value={profile.alternate_phone || ''}
                      onChange={(e) => setProfile({...profile, alternate_phone: e.target.value})}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="designation">Designation</Label>
                    <Input
                      id="designation"
                      value={profile.designation || ''}
                      onChange={(e) => setProfile({...profile, designation: e.target.value})}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="grade">Grade</Label>
                    <Input
                      id="grade"
                      value={profile.grade || ''}
                      onChange={(e) => setProfile({...profile, grade: e.target.value})}
                    />
                  </div>
                </div>
              )}
              
              <Separator />
              
              <div className="space-y-4">
                <h4 className="font-semibold">Notification Settings</h4>
                {profile && (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <Label htmlFor="email_notifications">Email Notifications</Label>
                        <p className="text-sm text-muted-foreground">Receive notifications via email</p>
                      </div>
                      <Switch
                        id="email_notifications"
                        checked={profile.receive_email_notifications || false}
                        onCheckedChange={(checked) => setProfile({...profile, receive_email_notifications: checked})}
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <Label htmlFor="sms_notifications">SMS Notifications</Label>
                        <p className="text-sm text-muted-foreground">Receive notifications via SMS</p>
                      </div>
                      <Switch
                        id="sms_notifications"
                        checked={profile.receive_sms_notifications || false}
                        onCheckedChange={(checked) => setProfile({...profile, receive_sms_notifications: checked})}
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <Label htmlFor="whatsapp_notifications">WhatsApp Notifications</Label>
                        <p className="text-sm text-muted-foreground">Receive notifications via WhatsApp</p>
                      </div>
                      <Switch
                        id="whatsapp_notifications"
                        checked={profile.receive_whatsapp_notifications || false}
                        onCheckedChange={(checked) => setProfile({...profile, receive_whatsapp_notifications: checked})}
                      />
                    </div>
                  </div>
                )}
              </div>
              
              <div className="flex justify-end">
                <Button onClick={handleUpdateProfile} disabled={saving}>
                  <Save className="h-4 w-4 mr-2" />
                  {saving ? 'Saving...' : 'Save Profile'}
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="preferences" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Settings className="h-5 w-5" />
                <span>System Preferences</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {preferences && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="theme">Theme</Label>
                    <Select value={preferences.theme} onValueChange={(value) => setPreferences({...preferences, theme: value})}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="light">Light</SelectItem>
                        <SelectItem value="dark">Dark</SelectItem>
                        <SelectItem value="system">System</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="language">Language</Label>
                    <Select value={preferences.language} onValueChange={(value) => setPreferences({...preferences, language: value})}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="en">English</SelectItem>
                        <SelectItem value="hi">Hindi</SelectItem>
                        <SelectItem value="ml">Malayalam</SelectItem>
                        <SelectItem value="ta">Tamil</SelectItem>
                        <SelectItem value="kn">Kannada</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="dashboard_refresh_interval">Dashboard Refresh (seconds)</Label>
                    <Input
                      id="dashboard_refresh_interval"
                      type="number"
                      value={preferences.dashboard_refresh_interval || 60}
                      onChange={(e) => setPreferences({...preferences, dashboard_refresh_interval: parseInt(e.target.value)})}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="timezone">Timezone</Label>
                    <Select value={preferences.timezone} onValueChange={(value) => setPreferences({...preferences, timezone: value})}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Asia/Kolkata">Asia/Kolkata</SelectItem>
                        <SelectItem value="UTC">UTC</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              )}
              
              <div className="flex justify-end">
                <Button onClick={handleUpdatePreferences} disabled={saving}>
                  <Save className="h-4 w-4 mr-2" />
                  {saving ? 'Saving...' : 'Save Preferences'}
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="security" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Shield className="h-5 w-5" />
                <span>Security Settings</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium">Change Password</h4>
                    <p className="text-sm text-muted-foreground">Update your account password</p>
                  </div>
                  <Button 
                    variant="outline" 
                    onClick={() => setShowPasswordForm(!showPasswordForm)}
                  >
                    <Lock className="h-4 w-4 mr-2" />
                    {showPasswordForm ? 'Cancel' : 'Change Password'}
                  </Button>
                </div>
                
                {showPasswordForm && (
                  <div className="space-y-4 p-4 border rounded-lg">
                    <div className="space-y-2">
                      <Label htmlFor="old_password">Current Password</Label>
                      <div className="relative">
                        <Input
                          id="old_password"
                          type={showPasswords.old ? "text" : "password"}
                          value={passwordData.old_password}
                          onChange={(e) => setPasswordData({...passwordData, old_password: e.target.value})}
                          placeholder="Enter current password"
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="absolute right-2 top-1/2 transform -translate-y-1/2 h-6 w-6 p-0"
                          onClick={() => setShowPasswords({...showPasswords, old: !showPasswords.old})}
                        >
                          {showPasswords.old ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </Button>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="new_password">New Password</Label>
                      <div className="relative">
                        <Input
                          id="new_password"
                          type={showPasswords.new ? "text" : "password"}
                          value={passwordData.new_password}
                          onChange={(e) => setPasswordData({...passwordData, new_password: e.target.value})}
                          placeholder="Enter new password"
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="absolute right-2 top-1/2 transform -translate-y-1/2 h-6 w-6 p-0"
                          onClick={() => setShowPasswords({...showPasswords, new: !showPasswords.new})}
                        >
                          {showPasswords.new ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </Button>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="new_password_confirm">Confirm New Password</Label>
                      <div className="relative">
                        <Input
                          id="new_password_confirm"
                          type={showPasswords.confirm ? "text" : "password"}
                          value={passwordData.new_password_confirm}
                          onChange={(e) => setPasswordData({...passwordData, new_password_confirm: e.target.value})}
                          placeholder="Confirm new password"
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="absolute right-2 top-1/2 transform -translate-y-1/2 h-6 w-6 p-0"
                          onClick={() => setShowPasswords({...showPasswords, confirm: !showPasswords.confirm})}
                        >
                          {showPasswords.confirm ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </Button>
                      </div>
                    </div>
                    <div className="flex justify-end space-x-2">
                      <Button variant="outline" onClick={() => setShowPasswordForm(false)}>
                        Cancel
                      </Button>
                      <Button onClick={handleChangePassword} disabled={saving}>
                        {saving ? 'Changing...' : 'Change Password'}
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ProfileManagement;