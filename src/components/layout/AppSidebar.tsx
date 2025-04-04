
import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { 
  MessageSquare, 
  Home, 
  Settings, 
  User, 
  Bell, 
  ChevronLeft, 
  ChevronRight 
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/contexts/AuthContext";

const AppSidebar = () => {
  const [collapsed, setCollapsed] = React.useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();

  const menuItems = [
    { name: "Chat", icon: MessageSquare, path: "/chat" },
    { name: "Dashboard", icon: Home, path: "/" },
    { name: "Settings", icon: Settings, path: "/configuration" },
    { name: "Profile", icon: User, path: "/profile" },
    { name: "Notifications", icon: Bell, path: "/notifications" },
  ];

  const toggleSidebar = () => {
    setCollapsed(!collapsed);
  };

  return (
    <div className={cn(
      "flex flex-col h-screen bg-background border-r transition-all duration-300",
      collapsed ? "w-16" : "w-64"
    )}>
      <div className="p-4 flex justify-between items-center border-b">
        {!collapsed && (
          <h1 className="font-bold text-2xl bg-gradient-to-r from-indigo-500 to-purple-500 bg-clip-text text-transparent">
            AgentHub
          </h1>
        )}
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={toggleSidebar}
          className={cn("ml-auto", collapsed ? "mx-auto" : "")}
        >
          {collapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
        </Button>
      </div>
      
      <div className="flex-1 py-4">
        <ul className="space-y-2">
          {menuItems.map((item) => (
            <li key={item.name}>
              <Button
                variant={location.pathname === item.path ? "secondary" : "ghost"}
                className={cn(
                  "w-full justify-start",
                  collapsed ? "justify-center px-2" : ""
                )}
                onClick={() => navigate(item.path)}
              >
                <item.icon className={cn("h-5 w-5", collapsed ? "mr-0" : "mr-2")} />
                {!collapsed && <span>{item.name}</span>}
              </Button>
            </li>
          ))}
        </ul>
      </div>
      
      {!collapsed && (
        <div className="p-4 border-t">
          <div className="flex items-center">
            <div className="h-8 w-8 rounded-full bg-primary/20 flex items-center justify-center">
              <User className="h-4 w-4 text-primary" />
            </div>
            <div className="ml-2">
              <p className="text-sm font-medium">{user?.name || "User"}</p>
              <p className="text-xs text-muted-foreground">{user?.email || "user@example.com"}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AppSidebar;
