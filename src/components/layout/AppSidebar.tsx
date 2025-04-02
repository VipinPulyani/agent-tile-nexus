
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
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

const AppSidebar = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const navigate = useNavigate();
  const { state } = useSidebar();
  const { user, logout } = useAuth();
  const collapsed = state === "collapsed";

  return (
    <Sidebar className="border-r border-sidebar-border">
      <SidebarHeader className="p-4 flex justify-between items-center">
        <div className={cn("flex items-center gap-2", collapsed && "justify-center")}>
          {!collapsed && (
            <span className="font-bold text-xl bg-gradient-to-r from-indigo-500 to-purple-500 bg-clip-text text-transparent">
              AgentHub
            </span>
          )}
        </div>
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={() => setIsCollapsed(!isCollapsed)} 
          className="text-sidebar-foreground"
        >
          {collapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
        </Button>
      </SidebarHeader>
      
      <SidebarContent className="px-2">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              onClick={() => navigate("/")} 
              className="w-full justify-start gap-2"
            >
              <Settings size={20} />
              {!collapsed && <span>Dashboard</span>}
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton
              onClick={() => navigate("/chat")} 
              className="w-full justify-start gap-2"
            >
              <MessageSquare size={20} />
              {!collapsed && <span>Chat</span>}
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton
              onClick={() => navigate("/configuration")}
              className="w-full justify-start gap-2"
            >
              <Settings size={20} />
              {!collapsed && <span>Configuration</span>}
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton
              onClick={() => navigate("/profile")}
              className="w-full justify-start gap-2"
            >
              <User size={20} />
              {!collapsed && <span>Profile</span>}
            </SidebarMenuButton>
          </SidebarMenuItem>
          
          {/* Notifications */}
          <SidebarMenuItem>
            <SidebarMenuButton
              className="w-full justify-start gap-2 relative"
            >
              <Bell size={20} />
              {!collapsed && <span>Notifications</span>}
              <Badge className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs">2</Badge>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarContent>
      
      <SidebarFooter className="p-4 flex flex-col gap-2">
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
