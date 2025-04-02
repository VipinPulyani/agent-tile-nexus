
import React, { useEffect } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useNotifications } from "@/contexts/NotificationsContext";

const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, loading } = useAuth();
  const { addNotification } = useNotifications();
  
  useEffect(() => {
    if (user) {
      // Check localStorage to see if welcome message was already shown
      const welcomeShown = localStorage.getItem(`welcome_shown_${user.id}`);
      
      if (!welcomeShown) {
        // Add a login notification only if not shown before
        addNotification({
          title: "Welcome Back",
          message: `Hello ${user.name}, you've successfully logged in.`,
          category: "system_alert"
        });
        
        // Set flag in localStorage to prevent showing again in this session
        localStorage.setItem(`welcome_shown_${user.id}`, "true");
      }
    }
  }, [user, addNotification]);
  
  if (loading) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
  }
  
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  
  return <>{children}</>;
};

export default ProtectedRoute;
