
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

// Demo users for testing
const DEMO_USERS = {
  "demo@demo.com": {
    id: "demo1",
    email: "demo@demo.com",
    name: "Demo User",
    password: "demo",
    isDemo: true
  },
  "demo1@demo.com": {
    id: "demo2",
    email: "demo1@demo.com",
    name: "Demo User 1",
    password: "demo",
    isDemo: true
  },
  "demo2@demo.com": {
    id: "demo3",
    email: "demo2@demo.com",
    name: "Demo User 2",
    password: "demo",
    isDemo: true
  }
};

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
      // Skip validation for demo token
      if (token === "demo-token") return;
      
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
      
      // For demo purposes, handle the demo accounts
      const demoUser = DEMO_USERS[email];
      if (demoUser && demoUser.password === password) {
        // Create a user object without the password
        const { password, ...userData } = demoUser;
        
        setUser(userData);
        localStorage.setItem("user", JSON.stringify(userData));
        localStorage.setItem("token", "demo-token"); // Fake token
        toast.success("Login successful!");
        navigate("/");
        return;
      }

      // LDAP Authentication implementation
      // This is commented out by default and will be uncommented when deployed locally
      /*
      try {
        // Call LDAP authentication endpoint
        const response = await fetch(`${API_URL}/auth/ldap`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            username: email,
            password: password
          })
        });
        
        const data = await response.json();
        
        if (!response.ok) {
          throw new Error(data.message || "LDAP Authentication failed");
        }
        
        if (data.authorized) {
          // User is authorized via LDAP
          const userData = {
            id: data.userId || email,
            email: email,
            name: data.displayName || email.split('@')[0],
          };
          
          setUser(userData);
          localStorage.setItem("user", JSON.stringify(userData));
          localStorage.setItem("token", data.token || "ldap-token");
          
          toast.success("LDAP Authentication successful!");
          navigate("/");
          return;
        } else {
          throw new Error("LDAP Authentication failed: User not authorized");
        }
      } catch (ldapError) {
        console.error("LDAP Authentication error:", ldapError);
        throw new Error("LDAP Authentication failed. Please check your credentials.");
      }
      */
      
      // Call the FastAPI backend for regular users
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
