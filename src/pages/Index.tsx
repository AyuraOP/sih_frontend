import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

// This page redirects to login or dashboard based on auth status
const Index = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const auth = localStorage.getItem("kmrl-auth");
    if (auth) {
      navigate("/dashboard");
    } else {
      navigate("/");
    }
  }, [navigate]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-background">
      <div className="text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
        <p className="mt-4 text-muted-foreground">Loading...</p>
      </div>
    </div>
  );
};

export default Index;
