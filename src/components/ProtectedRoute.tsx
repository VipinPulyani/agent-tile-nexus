
import React, { useEffect } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useNotifications } from "@/contexts/NotificationsContext";

const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, loading } = useAuth();
  const { addNotification } = useNotifications();
  
  useEffect(() => {
    if (user) {
      // Check sessionStorage (not localStorage) to ensure welcome message shows once per session
      const welcomeShown = sessionStorage.getItem(`welcome_shown_${user.id}`);
      
      if (!welcomeShown) {
        // Add a login notification only if not shown before in this session
        addNotification({
          title: "Welcome Back",
          message: `Hello ${user.name}, you've successfully logged in.`,
          category: "system_alert"
        });
        
        // Set flag in sessionStorage to prevent showing again in this session
        sessionStorage.setItem(`welcome_shown_${user.id}`, "true");
      }
    }
    // Only run this effect once when the component mounts and when user changes
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);
  
  if (loading) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
  }
  
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  
  return <>{children}</>;
};

export default ProtectedRoute;

