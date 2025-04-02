
import React, { createContext, useContext, useState, useEffect } from 'react';
import { toast } from 'sonner';

export type NotificationCategory = 'agent_update' | 'system_alert' | 'reminder';

export interface Notification {
  id: string;
  title: string;
  message: string;
  timestamp: Date;
  category: NotificationCategory;
  read: boolean;
}

interface NotificationsContextType {
  notifications: Notification[];
  unreadCount: number;
  addNotification: (notification: Omit<Notification, 'id' | 'timestamp' | 'read'>) => void;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
  clearNotifications: () => void;
  clearNotification: (id: string) => void;
  enabledCategories: NotificationCategory[];
  toggleCategoryEnabled: (category: NotificationCategory) => void;
}

const NotificationsContext = createContext<NotificationsContextType | undefined>(undefined);

export const useNotifications = () => {
  const context = useContext(NotificationsContext);
  if (context === undefined) {
    throw new Error('useNotifications must be used within a NotificationsProvider');
  }
  return context;
};

export const NotificationsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [enabledCategories, setEnabledCategories] = useState<NotificationCategory[]>([
    'agent_update', 'system_alert', 'reminder'
  ]);
  
  const unreadCount = notifications.filter(n => !n.read).length;

  // Load notifications from localStorage on component mount
  useEffect(() => {
    const storedNotifications = localStorage.getItem('notifications');
    const storedCategories = localStorage.getItem('notification_categories');
    
    if (storedNotifications) {
      try {
        const parsedNotifications = JSON.parse(storedNotifications);
        // Convert stored timestamp strings back to Date objects
        setNotifications(parsedNotifications.map((n: any) => ({
          ...n,
          timestamp: new Date(n.timestamp)
        })));
      } catch (error) {
        console.error('Error parsing stored notifications:', error);
      }
    }
    
    if (storedCategories) {
      try {
        setEnabledCategories(JSON.parse(storedCategories));
      } catch (error) {
        console.error('Error parsing stored notification categories:', error);
      }
    }
  }, []);

  // Save notifications to localStorage when they change
  useEffect(() => {
    localStorage.setItem('notifications', JSON.stringify(notifications));
  }, [notifications]);
  
  // Save enabled categories to localStorage when they change
  useEffect(() => {
    localStorage.setItem('notification_categories', JSON.stringify(enabledCategories));
  }, [enabledCategories]);

  const addNotification = (notification: Omit<Notification, 'id' | 'timestamp' | 'read'>) => {
    // Only add the notification if its category is enabled
    if (enabledCategories.includes(notification.category)) {
      const newNotification: Notification = {
        ...notification,
        id: Date.now().toString(),
        timestamp: new Date(),
        read: false,
      };
      
      setNotifications(prev => [newNotification, ...prev]);
      
      // Show toast notification
      toast(notification.title, {
        description: notification.message,
      });
    }
  };

  const markAsRead = (id: string) => {
    setNotifications(prev => 
      prev.map(notification => 
        notification.id === id ? { ...notification, read: true } : notification
      )
    );
  };

  const markAllAsRead = () => {
    setNotifications(prev => 
      prev.map(notification => ({ ...notification, read: true }))
    );
  };

  const clearNotification = (id: string) => {
    setNotifications(prev => 
      prev.filter(notification => notification.id !== id)
    );
  };

  const clearNotifications = () => {
    setNotifications([]);
  };
  
  const toggleCategoryEnabled = (category: NotificationCategory) => {
    setEnabledCategories(prev => {
      if (prev.includes(category)) {
        return prev.filter(c => c !== category);
      } else {
        return [...prev, category];
      }
    });
  };

  return (
    <NotificationsContext.Provider
      value={{
        notifications,
        unreadCount,
        addNotification,
        markAsRead,
        markAllAsRead,
        clearNotification,
        clearNotifications,
        enabledCategories,
        toggleCategoryEnabled
      }}
    >
      {children}
    </NotificationsContext.Provider>
  );
};
