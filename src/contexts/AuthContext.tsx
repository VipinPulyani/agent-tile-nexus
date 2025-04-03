
import React, { createContext, useState, useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

interface User {
  id: string;
  email: string;
  name: string;
  isDemo?: boolean;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  updateUserProfile: (data: Partial<User>) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Get API URL from environment variable or default to localhost in development
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Check if user is already logged in from localStorage
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    const token = localStorage.getItem("token");
    
    if (storedUser && token) {
      setUser(JSON.parse(storedUser));
      // Validate token with the backend
      validateToken(token);
    }
    setLoading(false);
  }, []);

  const validateToken = async (token: string) => {
    try {
      const response = await fetch(`${API_URL}/users/me`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (!response.ok) {
        // Token is invalid or expired
        logout();
      }
    } catch (error) {
      console.error("Error validating token:", error);
      // Don't logout on network errors to allow offline usage
    }
  };

  const login = async (email: string, password: string) => {
    try {
      setLoading(true);
      
      // For demo purposes we'll handle the hardcoded accounts
      if ((email === "user@example.com" && password === "password") || 
          (email === "demo@demo.com" && password === "demo")) {
        
        const demoUser = {
          id: email === "demo@demo.com" ? "demo1" : "1",
          email: email,
          name: email === "demo@demo.com" ? "Demo User" : "Regular User",
        };
        
        setUser(demoUser);
        localStorage.setItem("user", JSON.stringify(demoUser));
        localStorage.setItem("token", "demo-token"); // Fake token
        toast.success("Login successful!");
        navigate("/");
        return;
      }
      
      // Call the FastAPI backend
      const response = await fetch(`${API_URL}/token`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: new URLSearchParams({
          'username': email, // FastAPI OAuth2 expects 'username'
          'password': password
        })
      });
      
      if (!response.ok) {
        throw new Error("Invalid credentials");
      }
      
      const data = await response.json();
      
      // Get user details with the token
      const userResponse = await fetch(`${API_URL}/users/me`, {
        headers: {
          'Authorization': `Bearer ${data.access_token}`
        }
      });
      
      if (!userResponse.ok) {
        throw new Error("Failed to get user details");
      }
      
      const userData = await userResponse.json();
      
      const loggedInUser = {
        id: userData.id,
        email: userData.email,
        name: userData.full_name || userData.username,
      };
      
      setUser(loggedInUser);
      localStorage.setItem("user", JSON.stringify(loggedInUser));
      localStorage.setItem("token", data.access_token);
      
      toast.success("Login successful!");
      navigate("/");
    } catch (error) {
      toast.error("Login failed. Please check your credentials.");
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    toast.info("You have been logged out");
    navigate("/login");
  };

  const updateUserProfile = (data: Partial<User>) => {
    if (user) {
      const updatedUser = { ...user, ...data };
      setUser(updatedUser);
      localStorage.setItem("user", JSON.stringify(updatedUser));
      toast.success("Profile updated successfully");
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        logout,
        updateUserProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
