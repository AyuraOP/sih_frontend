import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "@/hooks/use-toast";
import { Train, Shield, Users, BarChart3, AlertCircle, Eye, EyeOff } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import LanguageSelector from "@/components/LanguageSelector";

const Login = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { login, loginWithToken, isLoading, error, clearError } = useAuth();
  const [credentials, setCredentials] = useState({
    email: "",
    password: "",
  });
  const [loginMethod, setLoginMethod] = useState<'email' | 'token'>('email');
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    clearError();

    if (!credentials.email || !credentials.password) {
      toast({
        title: t('login.validationError'),
        description: t('login.enterBothCredentials'),
        variant: "destructive",
      });
      return;
    }

    try {
      if (loginMethod === 'email') {
        await login({ email: credentials.email, password: credentials.password });
      } else {
        await loginWithToken({ username: credentials.email, password: credentials.password });
      }
      
      toast({
        title: t('login.loginSuccessful'),
        description: t('login.welcomeMessage'),
      });
      navigate("/dashboard");
    } catch (error: any) {
      console.error("Login error:", error);
      toast({
        title: t('login.loginFailed'),
        description: error.message || "Failed to connect to server. Please check your connection and try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary via-primary-hover to-primary-light flex items-center justify-center p-2 sm:p-4">
      {/* Language Selector - Top Right */}
      <div className="absolute top-4 right-4 z-10">
        <LanguageSelector />
      </div>
      
      <div className="w-full max-w-6xl grid lg:grid-cols-2 gap-4 lg:gap-8 items-center">
        
        {/* Left Side - Branding */}
        <div className="hidden lg:block text-white space-y-8">
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <div className="bg-white/10 p-3 rounded-lg">
                <Train className="h-8 w-8" />
              </div>
              <div>
                <h1 className="text-3xl font-bold">{t('login.title')}</h1>
                <p className="text-white/80">{t('login.subtitle')}</p>
              </div>
            </div>
            
            <p className="text-lg text-white/90 leading-relaxed">
              {t('login.description')}
            </p>
          </div>

          <div className="grid grid-cols-1 gap-6">
            <div className="flex items-start space-x-4">
              <div className="bg-white/10 p-2 rounded-lg">
                <BarChart3 className="h-5 w-5" />
              </div>
              <div>
                <h3 className="font-semibold mb-1">{t('login.features.realTimeMonitoring.title')}</h3>
                <p className="text-white/80 text-sm">{t('login.features.realTimeMonitoring.description')}</p>
              </div>
            </div>
            
            <div className="flex items-start space-x-4">
              <div className="bg-white/10 p-2 rounded-lg">
                <Shield className="h-5 w-5" />
              </div>
              <div>
                <h3 className="font-semibold mb-1">{t('login.features.aiPoweredPlanning.title')}</h3>
                <p className="text-white/80 text-sm">{t('login.features.aiPoweredPlanning.description')}</p>
              </div>
            </div>
            
            <div className="flex items-start space-x-4">
              <div className="bg-white/10 p-2 rounded-lg">
                <Users className="h-5 w-5" />
              </div>
              <div>
                <h3 className="font-semibold mb-1">{t('login.features.operationsCenter.title')}</h3>
                <p className="text-white/80 text-sm">{t('login.features.operationsCenter.description')}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Mobile Branding - Visible on small screens */}
        <div className="lg:hidden text-white text-center mb-6">
          <div className="flex items-center justify-center space-x-3 mb-4">
            <div className="bg-white/10 p-3 rounded-lg">
              <Train className="h-8 w-8" />
            </div>
            <div>
              <h1 className="text-2xl font-bold">{t('login.title')}</h1>
              <p className="text-white/80 text-sm">{t('login.subtitle')}</p>
            </div>
          </div>
          <p className="text-sm text-white/90 leading-relaxed max-w-md mx-auto">
            {t('login.description')}
          </p>
        </div>

        {/* Right Side - Login Form */}
        <div className="w-full max-w-md mx-auto">
          <Card className="shadow-government-xl border-white/20">
            <CardHeader className="space-y-1 text-center">
              <CardTitle className="text-xl sm:text-2xl font-bold">{t('login.systemAccess')}</CardTitle>
              <CardDescription className="text-sm">
                {t('login.enterCredentials')}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {error && (
                <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2">
                  <AlertCircle className="h-4 w-4 text-red-600" />
                  <p className="text-sm text-red-600">{error}</p>
                </div>
              )}
              
              <form onSubmit={handleLogin} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-sm font-medium">{t('login.emailAddress')}</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder={t('login.enterEmail')}
                    value={credentials.email}
                    onChange={(e) => setCredentials({ ...credentials, email: e.target.value })}
                    className="form-input h-11 text-base"
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="password" className="text-sm font-medium">{t('common.password')}</Label>
                  <div className="relative">
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      placeholder={t('login.enterPassword')}
                      value={credentials.password}
                      onChange={(e) => setCredentials({ ...credentials, password: e.target.value })}
                      className="form-input pr-10 h-11 text-base"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 focus:outline-none p-1"
                    >
                      {showPassword ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </button>
                  </div>
                </div>

                <Button 
                  type="submit" 
                  className="w-full btn-government text-base sm:text-lg py-3 h-12"
                  disabled={isLoading}
                >
                  {isLoading ? t('login.authenticating') : t('login.accessDashboard')}
                </Button>
              </form>

              <div className="mt-4 sm:mt-6 p-3 sm:p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <p className="text-xs sm:text-sm text-blue-800 text-center leading-relaxed">
                  <strong>{t('login.demoMode')}</strong><br className="sm:hidden" />
                  <span className="hidden sm:inline"> Use </span>
                  <span className="sm:hidden">Use </span>
                  admin@gmail.com / 1234<br className="sm:hidden" />
                  <span className="sm:hidden">or </span>
                  <span className="hidden sm:inline"> or </span>
                  any valid email / 1234
                </p>
              </div>

              <div className="mt-4 text-center">
                <p className="text-xs text-muted-foreground">
                  {t('login.governmentKerala')}
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Login;