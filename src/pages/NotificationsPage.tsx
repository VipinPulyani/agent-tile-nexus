
import React, { useState } from "react";
import { useNotifications, NotificationCategory } from "@/contexts/NotificationsContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { format } from "date-fns";
import { Bell, CheckCheck, Trash2, Filter } from "lucide-react";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";

const NotificationsPage = () => {
  const { 
    notifications, 
    markAsRead, 
    markAllAsRead, 
    clearNotifications,
    clearNotification,
    enabledCategories,
    toggleCategoryEnabled
  } = useNotifications();
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState<"all" | NotificationCategory>("all");

  const filteredNotifications = notifications.filter(notification => {
    // Filter by search query
    const matchesSearch = searchQuery === "" || 
      notification.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      notification.message.toLowerCase().includes(searchQuery.toLowerCase());
    
    // Filter by category tab
    const matchesCategory = activeTab === "all" || notification.category === activeTab;
    
    return matchesSearch && matchesCategory;
  });

  const handleMarkAllRead = () => {
    markAllAsRead();
    toast.success("All notifications marked as read");
  };

  const handleClearAll = () => {
    clearNotifications();
    toast.success("All notifications cleared");
  };

  const getCategoryLabel = (category: NotificationCategory): string => {
    switch(category) {
      case "agent_update": return "Agent Updates";
      case "system_alert": return "System Alerts";
      case "reminder": return "Reminders";
      default: return category;
    }
  };

  const getCategoryIcon = (category: NotificationCategory) => {
    switch(category) {
      case "agent_update": return <div className="w-2 h-2 rounded-full bg-blue-500 mr-2" />;
      case "system_alert": return <div className="w-2 h-2 rounded-full bg-orange-500 mr-2" />;
      case "reminder": return <div className="w-2 h-2 rounded-full bg-purple-500 mr-2" />;
      default: return <div className="w-2 h-2 rounded-full bg-gray-500 mr-2" />;
    }
  };

  return (
    <div className="container py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Notifications</h1>
        <p className="text-muted-foreground mt-1">
          Stay updated on your agents and system activity
        </p>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <Card>
            <CardHeader className="flex flex-col sm:flex-row justify-between space-y-2 sm:space-y-0 sm:items-center pb-2">
              <div>
                <CardTitle>Your Notifications</CardTitle>
                <CardDescription>
                  {filteredNotifications.length} notifications
                </CardDescription>
              </div>
              <div className="flex gap-2">
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={handleMarkAllRead}
                  disabled={!notifications.some(n => !n.read)}
                >
                  <CheckCheck size={16} className="mr-1" />
                  Mark All Read
                </Button>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={handleClearAll}
                  disabled={notifications.length === 0}
                >
                  <Trash2 size={16} className="mr-1" />
                  Clear All
                </Button>
              </div>
            </CardHeader>

            <div className="px-6 pb-2">
              <div className="relative">
                <Input
                  placeholder="Search notifications..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
                <Filter className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                {searchQuery && (
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="absolute right-2 top-2 h-6 w-6"
                    onClick={() => setSearchQuery("")}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                )}
              </div>
            </div>

            <Tabs defaultValue="all" onValueChange={(value) => setActiveTab(value as any)} className="px-6">
              <TabsList className="mb-4">
                <TabsTrigger value="all">All</TabsTrigger>
                <TabsTrigger value="agent_update">Agent Updates</TabsTrigger>
                <TabsTrigger value="system_alert">System Alerts</TabsTrigger>
                <TabsTrigger value="reminder">Reminders</TabsTrigger>
              </TabsList>
              
              <TabsContent value="all" className="mt-0">
                {renderNotificationList(filteredNotifications)}
              </TabsContent>
              <TabsContent value="agent_update" className="mt-0">
                {renderNotificationList(filteredNotifications)}
              </TabsContent>
              <TabsContent value="system_alert" className="mt-0">
                {renderNotificationList(filteredNotifications)}
              </TabsContent>
              <TabsContent value="reminder" className="mt-0">
                {renderNotificationList(filteredNotifications)}
              </TabsContent>
            </Tabs>
          </Card>
        </div>

        <div>
          <Card>
            <CardHeader>
              <CardTitle>Notification Settings</CardTitle>
              <CardDescription>
                Configure which notifications you receive
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <h3 className="font-medium">Categories</h3>
                
                <div className="space-y-4">
                  {(["agent_update", "system_alert", "reminder"] as NotificationCategory[]).map(category => (
                    <div key={category} className="flex items-center justify-between">
                      <div className="flex items-center">
                        {getCategoryIcon(category)}
                        <Label htmlFor={`notify-${category}`} className="cursor-pointer">
                          {getCategoryLabel(category)}
                        </Label>
                      </div>
                      <Switch 
                        id={`notify-${category}`}
                        checked={enabledCategories.includes(category)}
                        onCheckedChange={() => toggleCategoryEnabled(category)}
                      />
                    </div>
                  ))}
                </div>
              </div>
              
              <Separator />
              
              <div className="space-y-4">
                <h3 className="font-medium">Notification Preferences</h3>
                
                <div className="flex items-center justify-between">
                  <Label htmlFor="toast-notifications" className="cursor-pointer">
                    Toast Notifications
                  </Label>
                  <Switch id="toast-notifications" defaultChecked />
                </div>
                
                <div className="flex items-center justify-between">
                  <Label htmlFor="email-notifications" className="cursor-pointer">
                    Email Notifications
                  </Label>
                  <Switch id="email-notifications" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );

  function renderNotificationList(notifications: typeof filteredNotifications) {
    if (notifications.length === 0) {
      return (
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <Bell size={48} className="text-muted-foreground mb-4 opacity-20" />
          <h3 className="text-lg font-medium mb-1">No notifications</h3>
          <p className="text-muted-foreground">
            You don't have any notifications yet.
          </p>
        </div>
      );
    }

    return (
      <div className="space-y-1 pb-4">
        {notifications.map((notification) => (
          <div 
            key={notification.id} 
            className={`p-3 rounded-lg transition-colors ${
              notification.read ? 'bg-background' : 'bg-muted/40'
            } hover:bg-muted`}
            onClick={() => !notification.read && markAsRead(notification.id)}
          >
            <div className="flex justify-between items-start mb-1">
              <div className="flex items-center">
                {getCategoryIcon(notification.category)}
                <h4 className={`font-medium ${!notification.read ? 'text-primary' : ''}`}>
                  {notification.title}
                </h4>
                {!notification.read && (
                  <span className="ml-2 bg-primary text-white text-xs px-1.5 py-0.5 rounded-full">
                    New
                  </span>
                )}
              </div>
              <div className="flex items-center">
                <span className="text-xs text-muted-foreground">
                  {format(notification.timestamp, 'MMM d, h:mm a')}
                </span>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="h-6 w-6 ml-1 opacity-50 hover:opacity-100"
                  onClick={(e) => {
                    e.stopPropagation();
                    clearNotification(notification.id);
                  }}
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </Button>
              </div>
            </div>
            <p className="text-sm text-muted-foreground">
              {notification.message}
            </p>
          </div>
        ))}
      </div>
    );
  }
};

export default NotificationsPage;
