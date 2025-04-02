
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";

const ConfigurationPage = () => {
  return (
    <div className="container py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Configuration</h1>
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
              <CardHeader>
                <CardTitle>System Settings</CardTitle>
                <CardDescription>
                  Configure general system settings
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="system-name">System Name</Label>
                  <Input id="system-name" defaultValue="AgentHub" />
                </div>
                
                <div className="flex items-center justify-between space-y-1">
                  <div className="space-y-0.5">
                    <Label htmlFor="notifications">Notifications</Label>
                    <p className="text-sm text-muted-foreground">
                      Enable or disable system notifications
                    </p>
                  </div>
                  <Switch id="notifications" defaultChecked />
                </div>
                
                <div className="flex items-center justify-between space-y-1">
                  <div className="space-y-0.5">
                    <Label htmlFor="analytics">Usage Analytics</Label>
                    <p className="text-sm text-muted-foreground">
                      Allow system to collect usage data
                    </p>
                  </div>
                  <Switch id="analytics" defaultChecked />
                </div>
              </CardContent>
            </Card>
            
            <Card>
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
                      defaultValue="100" 
                    />
                    <Button variant="outline">Apply</Button>
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
                  <Switch id="timestamps" defaultChecked />
                </div>
                
                <div className="flex items-center justify-between space-y-1">
                  <div className="space-y-0.5">
                    <Label htmlFor="sound">Sound Effects</Label>
                    <p className="text-sm text-muted-foreground">
                      Play sound on new messages
                    </p>
                  </div>
                  <Switch id="sound" />
                </div>
              </CardContent>
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
            <CardHeader>
              <CardTitle>SSO Configuration</CardTitle>
              <CardDescription>
                Configure single sign-on integration
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="sso-provider">SSO Provider</Label>
                <Input id="sso-provider" placeholder="e.g., Okta, Auth0, Azure AD" />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="sso-domain">SSO Domain</Label>
                <Input id="sso-domain" placeholder="e.g., your-company.okta.com" />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="client-id">Client ID</Label>
                <Input id="client-id" placeholder="Enter client ID from your SSO provider" />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="client-secret">Client Secret</Label>
                <Input 
                  id="client-secret" 
                  type="password" 
                  placeholder="Enter client secret from your SSO provider" 
                />
              </div>
              
              <div className="flex items-center justify-between space-y-1">
                <div className="space-y-0.5">
                  <Label htmlFor="sso-enabled">Enable SSO</Label>
                  <p className="text-sm text-muted-foreground">
                    Allow users to sign in with SSO
                  </p>
                </div>
                <Switch id="sso-enabled" />
              </div>
              
              <Button className="mt-4">Save SSO Configuration</Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ConfigurationPage;
