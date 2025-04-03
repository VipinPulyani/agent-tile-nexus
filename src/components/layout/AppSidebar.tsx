
import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { 
  Sidebar, 
  SidebarContent, 
  SidebarHeader, 
  SidebarMenu, 
  SidebarMenuButton, 
  SidebarMenuItem,
  SidebarFooter,
  useSidebar
} from "@/components/ui/sidebar";
import { MessageSquare, Settings, LogOut, ChevronLeft, ChevronRight, User, Bell } from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/contexts/AuthContext";
import { ThemeToggle } from "@/components/ThemeToggle";
import { Badge } from "@/components/ui/badge";
import { useNotifications } from "@/contexts/NotificationsContext";

const AppSidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { state, setOpen } = useSidebar();
  const { user, logout } = useAuth();
  const { unreadCount } = useNotifications();
  const collapsed = state === "collapsed";

  const isActivePath = (path: string) => {
    return location.pathname === path;
  };

  const toggleSidebar = () => {
    setOpen(prev => !prev);
  };

  return (
    <Sidebar className="border-r border-sidebar-border">
      <SidebarHeader className="p-4 flex justify-between items-center">
        <div className={cn("flex items-center gap-2", collapsed && "justify-center")}>
          {!collapsed && (
            <span className="font-bold text-xl bg-gradient-to-r from-indigo-500 via-purple-500 to-blue-500 bg-clip-text text-transparent animate-shimmer">
              AgentHub
            </span>
          )}
        </div>
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={toggleSidebar} 
          className="text-sidebar-foreground"
        >
          {collapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
        </Button>
      </SidebarHeader>
      
      <SidebarContent className="px-2">
        <SidebarMenu>
          {/* Chat now comes first */}
          <SidebarMenuItem>
            <SidebarMenuButton
              onClick={() => navigate("/chat")} 
              className={cn("w-full justify-start gap-2", isActivePath("/chat") && "bg-sidebar-accent text-sidebar-accent-foreground")}
              isActive={isActivePath("/chat")}
            >
              <MessageSquare size={20} />
              {!collapsed && <span>Chat</span>}
            </SidebarMenuButton>
          </SidebarMenuItem>
          
          {/* Onboarding renamed to Dashboard */}
          <SidebarMenuItem>
            <SidebarMenuButton
              onClick={() => navigate("/")} 
              className={cn("w-full justify-start gap-2", isActivePath("/") && "bg-sidebar-accent text-sidebar-accent-foreground")}
              isActive={isActivePath("/")}
            >
              <Settings size={20} />
              {!collapsed && <span>Dashboard</span>}
            </SidebarMenuButton>
          </SidebarMenuItem>
          
          {/* Configuration renamed to Settings */}
          <SidebarMenuItem>
            <SidebarMenuButton
              onClick={() => navigate("/configuration")}
              className={cn("w-full justify-start gap-2", isActivePath("/configuration") && "bg-sidebar-accent text-sidebar-accent-foreground")}
              isActive={isActivePath("/configuration")}
            >
              <Settings size={20} />
              {!collapsed && <span>Settings</span>}
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarContent>
      
      <SidebarFooter className="p-4 flex flex-col gap-2">
        {/* Bottom sidebar section with profile and notifications */}
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              onClick={() => navigate("/profile")}
              className={cn("w-full justify-start gap-2", isActivePath("/profile") && "bg-sidebar-accent text-sidebar-accent-foreground")}
              isActive={isActivePath("/profile")}
            >
              <User size={20} />
              {!collapsed && <span>Profile</span>}
            </SidebarMenuButton>
          </SidebarMenuItem>
          
          <SidebarMenuItem>
            <SidebarMenuButton
              onClick={() => navigate("/notifications")}
              className={cn("w-full justify-start gap-2 relative", isActivePath("/notifications") && "bg-sidebar-accent text-sidebar-accent-foreground")}
              isActive={isActivePath("/notifications")}
            >
              <Bell size={20} />
              {!collapsed && <span>Notifications</span>}
              {unreadCount > 0 && (
                <Badge className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs">
                  {unreadCount > 99 ? "99+" : unreadCount}
                </Badge>
              )}
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
        
        <ThemeToggle />
        
        <Button 
          variant="ghost" 
          className={cn(
            "w-full justify-start text-sidebar-foreground hover:text-sidebar-foreground hover:bg-sidebar-accent gap-2",
            collapsed && "justify-center"
          )}
          onClick={logout}
        >
          <LogOut size={20} />
          {!collapsed && <span>Logout</span>}
        </Button>
        
        {!collapsed && user && (
          <div className="flex items-center gap-2 px-2 py-1 mt-2 border-t border-sidebar-border pt-2">
            <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center text-primary">
              {user.name.charAt(0)}
            </div>
            <div className="flex-1 overflow-hidden">
              <p className="text-sm font-medium truncate">{user.name}</p>
              <p className="text-xs text-sidebar-foreground/70 truncate">{user.email}</p>
            </div>
          </div>
        )}
      </SidebarFooter>
    </Sidebar>
  );
};

export default AppSidebar;
