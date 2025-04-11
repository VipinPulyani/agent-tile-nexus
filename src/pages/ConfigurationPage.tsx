
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

// Define interfaces for the configuration data
interface AgentConfig {
  systemName?: string;
  notifications?: boolean;
  analytics?: boolean;
  messageHistory?: number;
  timestamps?: boolean;
  sound?: boolean;
  ssoProvider?: string;
  ssoDomain?: string;
  clientId?: string;
  clientSecret?: string;
  ssoEnabled?: boolean;
}

const ConfigurationPage = () => {
  const { user } = useAuth();
  const [configs, setConfigs] = useState<AgentConfig>({});
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

  // Fetch configurations from the vault when the component mounts or user changes
  useEffect(() => {
    if (user) {
      fetchConfigurations();
    }
  }, [user]);

  // Function to fetch user configurations from the vault
  const fetchConfigurations = async () => {
    // This is commented out by default and will be uncommented when deployed locally
    /*
    setLoading(true);
    try {
      const response = await fetch(`${API_URL}/vault/configs/${user?.id}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      
      if (!response.ok) {
        throw new Error('Failed to fetch configurations');
      }
      
      const data = await response.json();
      setConfigs(data.configurations || {});
    } catch (error) {
      console.error('Error fetching configurations:', error);
      toast.error('Failed to load your configurations');
    } finally {
      setLoading(false);
    }
    */
    
    // For demonstration, use default values
    setLoading(true);
    setTimeout(() => {
      setConfigs({
        systemName: "AgentHub",
        notifications: true,
        analytics: true,
        messageHistory: 100,
        timestamps: true,
        sound: false,
        ssoProvider: "",
        ssoDomain: "",
        clientId: "",
        clientSecret: "",
        ssoEnabled: false
      });
      setLoading(false);
    }, 500);
  };

  // Function to update configurations in the vault
  const saveConfigurations = async (section: string, updatedConfig: Partial<AgentConfig>) => {
    // This is commented out by default and will be uncommented when deployed locally
    /*
    setSaving(true);
    try {
      const response = await fetch(`${API_URL}/vault/configs/${user?.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          section: section,
          configurations: updatedConfig
        })
      });
      
      if (!response.ok) {
        throw new Error('Failed to update configurations');
      }
      
      // Update local state with new configurations
      setConfigs(prev => ({ ...prev, ...updatedConfig }));
      toast.success('Configuration updated successfully');
    } catch (error) {
      console.error('Error updating configurations:', error);
      toast.error('Failed to update configurations');
    } finally {
      setSaving(false);
    }
    */
    
    // For demonstration, just update the state
    setSaving(true);
    setTimeout(() => {
      setConfigs(prev => ({ ...prev, ...updatedConfig }));
      toast.success('Configuration updated successfully');
      setSaving(false);
    }, 500);
  };

  // Handler for system settings form submission
  const handleSystemSettingsSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    saveConfigurations('system', {
      systemName: configs.systemName,
      notifications: configs.notifications,
      analytics: configs.analytics
    });
  };

  // Handler for chat settings form submission
  const handleChatSettingsSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    saveConfigurations('chat', {
      messageHistory: configs.messageHistory,
      timestamps: configs.timestamps,
      sound: configs.sound
    });
  };

  // Handler for SSO configuration form submission
  const handleSsoConfigSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    saveConfigurations('sso', {
      ssoProvider: configs.ssoProvider,
      ssoDomain: configs.ssoDomain,
      clientId: configs.clientId,
      clientSecret: configs.clientSecret,
      ssoEnabled: configs.ssoEnabled
    });
  };

  // Handler for form field changes
  const handleChange = (field: string, value: string | number | boolean) => {
    setConfigs(prev => ({ ...prev, [field]: value }));
  };

  if (loading) {
    return (
      <div className="container py-8 flex flex-col items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <p className="mt-4 text-muted-foreground">Loading your configurations...</p>
      </div>
    );
  }

  return (
    <div className="container py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Settings</h1>
        <p className="text-muted-foreground mt-1">
          Manage system and agent settings
        </p>
      </div>
      
      <Tabs defaultValue="general">
        <TabsList className="mb-6">
          <TabsTrigger value="general">General</TabsTrigger>
          <TabsTrigger value="agents">Agents</TabsTrigger>
          <TabsTrigger value="auth">Authentication</TabsTrigger>
        </TabsList>
        
        <TabsContent value="general">
          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <form onSubmit={handleSystemSettingsSubmit}>
                <CardHeader>
                  <CardTitle>System Settings</CardTitle>
                  <CardDescription>
                    Configure general system settings
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="system-name">System Name</Label>
                    <Input 
                      id="system-name" 
                      value={configs.systemName || ''} 
                      onChange={(e) => handleChange('systemName', e.target.value)}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between space-y-1">
                    <div className="space-y-0.5">
                      <Label htmlFor="notifications">Notifications</Label>
                      <p className="text-sm text-muted-foreground">
                        Enable or disable system notifications
                      </p>
                    </div>
                    <Switch 
                      id="notifications" 
                      checked={configs.notifications} 
                      onCheckedChange={(checked) => handleChange('notifications', checked)}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between space-y-1">
                    <div className="space-y-0.5">
                      <Label htmlFor="analytics">Usage Analytics</Label>
                      <p className="text-sm text-muted-foreground">
                        Allow system to collect usage data
                      </p>
                    </div>
                    <Switch 
                      id="analytics" 
                      checked={configs.analytics} 
                      onCheckedChange={(checked) => handleChange('analytics', checked)}
                    />
                  </div>
                  
                  <Button type="submit" disabled={saving}>
                    {saving ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Saving...
                      </>
                    ) : 'Save Settings'}
                  </Button>
                </CardContent>
              </form>
            </Card>
            
            <Card>
              <form onSubmit={handleChatSettingsSubmit}>
                <CardHeader>
                  <CardTitle>Chat Settings</CardTitle>
                  <CardDescription>
                    Configure chat behavior and appearance
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="message-history">Message History</Label>
                    <div className="flex gap-2">
                      <Input 
                        id="message-history" 
                        type="number" 
                        value={configs.messageHistory || 100}
                        onChange={(e) => handleChange('messageHistory', parseInt(e.target.value))}
                      />
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Number of messages to keep in history
                    </p>
                  </div>
                  
                  <div className="flex items-center justify-between space-y-1">
                    <div className="space-y-0.5">
                      <Label htmlFor="timestamps">Show Timestamps</Label>
                      <p className="text-sm text-muted-foreground">
                        Display message timestamps in chat
                      </p>
                    </div>
                    <Switch 
                      id="timestamps" 
                      checked={configs.timestamps}
                      onCheckedChange={(checked) => handleChange('timestamps', checked)}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between space-y-1">
                    <div className="space-y-0.5">
                      <Label htmlFor="sound">Sound Effects</Label>
                      <p className="text-sm text-muted-foreground">
                        Play sound on new messages
                      </p>
                    </div>
                    <Switch 
                      id="sound" 
                      checked={configs.sound}
                      onCheckedChange={(checked) => handleChange('sound', checked)}
                    />
                  </div>
                  
                  <Button type="submit" disabled={saving}>
                    {saving ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Saving...
                      </>
                    ) : 'Save Settings'}
                  </Button>
                </CardContent>
              </form>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="agents">
          <Card>
            <CardHeader>
              <CardTitle>Agent Management</CardTitle>
              <CardDescription>
                Configure existing agents or create new ones
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-center py-8 text-muted-foreground">
                Agent management settings will be available in a future update
              </p>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="auth">
          <Card>
            <form onSubmit={handleSsoConfigSubmit}>
              <CardHeader>
                <CardTitle>SSO Configuration</CardTitle>
                <CardDescription>
                  Configure single sign-on integration
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="sso-provider">SSO Provider</Label>
                  <Input 
                    id="sso-provider" 
                    placeholder="e.g., Okta, Auth0, Azure AD"
                    value={configs.ssoProvider || ''}
                    onChange={(e) => handleChange('ssoProvider', e.target.value)}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="sso-domain">SSO Domain</Label>
                  <Input 
                    id="sso-domain" 
                    placeholder="e.g., your-company.okta.com"
                    value={configs.ssoDomain || ''}
                    onChange={(e) => handleChange('ssoDomain', e.target.value)}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="client-id">Client ID</Label>
                  <Input 
                    id="client-id" 
                    placeholder="Enter client ID from your SSO provider"
                    value={configs.clientId || ''}
                    onChange={(e) => handleChange('clientId', e.target.value)}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="client-secret">Client Secret</Label>
                  <Input 
                    id="client-secret" 
                    type="password" 
                    placeholder="Enter client secret from your SSO provider"
                    value={configs.clientSecret || ''}
                    onChange={(e) => handleChange('clientSecret', e.target.value)}
                  />
                </div>
                
                <div className="flex items-center justify-between space-y-1">
                  <div className="space-y-0.5">
                    <Label htmlFor="sso-enabled">Enable SSO</Label>
                    <p className="text-sm text-muted-foreground">
                      Allow users to sign in with SSO
                    </p>
                  </div>
                  <Switch 
                    id="sso-enabled"
                    checked={configs.ssoEnabled || false}
                    onCheckedChange={(checked) => handleChange('ssoEnabled', checked)}
                  />
                </div>
                
                <Button type="submit" className="mt-4" disabled={saving}>
                  {saving ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Saving...
                    </>
                  ) : 'Save SSO Configuration'}
                </Button>
              </CardContent>
            </form>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ConfigurationPage;
