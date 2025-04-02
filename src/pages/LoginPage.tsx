
import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Navigate, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";

const LoginPage = () => {
  const navigate = useNavigate();
  const { user, login, loginDemo } = useAuth();
  const [formData, setFormData] = useState({
    email: "",
    password: ""
  });
  const [isLoading, setIsLoading] = useState(false);

  // If user is already logged in, redirect to dashboard
  if (user) {
    return <Navigate to="/" replace />;
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      await login(formData.email, formData.password);
    } catch (error) {
      // Error is handled in the auth context
      console.error("Login failed:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDemoLogin = () => {
    loginDemo();
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-muted/30">
      <div className="w-full max-w-md p-4">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-indigo-500 to-purple-500 bg-clip-text text-transparent">
            AgentHub
          </h1>
          <p className="text-muted-foreground">
            Your centralized agent management platform
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Sign In</CardTitle>
            <CardDescription>
              Sign in to access your agent dashboard
            </CardDescription>
          </CardHeader>
          <form onSubmit={handleLogin}>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input 
                  id="email" 
                  name="email" 
                  type="email" 
                  placeholder="Enter your email" 
                  value={formData.email}
                  onChange={handleChange}
                  required 
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input 
                  id="password" 
                  name="password" 
                  type="password" 
                  placeholder="Enter your password" 
                  value={formData.password}
                  onChange={handleChange}
                  required 
                />
              </div>
              <div className="flex justify-between items-center text-sm">
                <a href="#" className="text-primary hover:underline">
                  Forgot password?
                </a>
                <Button variant="link" className="p-0 h-auto" type="button">
                  Sign up
                </Button>
              </div>
            </CardContent>
            <CardFooter className="flex-col space-y-2">
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? "Signing in..." : "Sign In"}
              </Button>
              <p className="text-center text-sm text-muted-foreground mt-2">
                For testing, use email: user@example.com / password: password
              </p>
            </CardFooter>
          </form>
        </Card>

        <div className="mt-6">
          <Button 
            variant="outline" 
            className="w-full"
            onClick={handleDemoLogin}
          >
            Continue with Demo Account
          </Button>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
