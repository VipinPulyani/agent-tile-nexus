
import React, { useEffect } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useNotifications } from "@/contexts/NotificationsContext";

const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, loading } = useAuth();
  const { addNotification } = useNotifications();
  
  useEffect(() => {
    if (user) {
      // Add a login notification
      addNotification({
        title: "Welcome Back",
        message: `Hello ${user.name}, you've successfully logged in.`,
        category: "system_alert"
      });
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
