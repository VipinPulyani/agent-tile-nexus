import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus } from "lucide-react";
import { toast } from "sonner";
import { agents } from "@/data/agents";
import { cn } from "@/lib/utils";
import { useNavigate } from "react-router-dom";
import { Agent, AgentConfig } from "@/types/agent";

const Dashboard = () => {
  const [selectedAgent, setSelectedAgent] = useState<Agent | null>(null);
  const [configOpen, setConfigOpen] = useState(false);
  const [configValues, setConfigValues] = useState<Record<string, string>>({});
  const navigate = useNavigate();
  
  const handleConfigSave = () => {
    if (!selectedAgent) return;
    
    const missingFields = selectedAgent.configFields
      .filter(field => field.required && !configValues[field.id])
      .map(field => field.label);
    
    if (missingFields.length > 0) {
      toast.error(`Please fill out all required fields: ${missingFields.join(', ')}`);
      return;
    }
    
    const config: AgentConfig = {
      agentId: selectedAgent.id,
      values: configValues
    };
    
    console.log("Saving agent configuration:", config);
    
    toast.success(`${selectedAgent.name} configured successfully!`);
    setConfigOpen(false);
    setConfigValues({});
    
    navigate(`/chat?agent=${selectedAgent.id}`);
  };
  
  const openAgentConfig = (agent: Agent) => {
    setSelectedAgent(agent);
    setConfigValues({});
    setConfigOpen(true);
  };
  
  const getAgentBackgroundColor = (type: string) => {
    switch (type) {
      case "airflow":
        return "bg-blue-100 text-blue-600";
      case "kubernetes":
        return "bg-indigo-100 text-indigo-600";
      case "jenkins":
        return "bg-orange-100 text-orange-600";
      case "github":
        return "bg-gray-100 text-gray-600";
      case "custom":
        return "bg-purple-100 text-purple-600";
      default:
        return "bg-slate-100 text-slate-600";
    }
  };
  
  return (
    <div className="container py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Agent Hub</h1>
        <p className="text-muted-foreground mt-1">
          Configure and chat with your agents
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {agents.map((agent) => (
          <div key={agent.id} className="agent-tile group flex flex-col items-center justify-center p-6 rounded-lg border border-border hover:border-primary/50 transition-all cursor-pointer" onClick={() => openAgentConfig(agent)}>
            <div 
              className={cn("agent-icon p-4 rounded-full mb-4", 
                getAgentBackgroundColor(agent.type)
              )}
            >
              <agent.icon size={28} />
            </div>
            <h3 className="font-semibold text-lg">{agent.name}</h3>
            <p className="text-sm text-muted-foreground text-center mt-1">
              {agent.description}
            </p>
            <Button 
              variant="ghost" 
              size="sm" 
              className="mt-4 opacity-0 group-hover:opacity-100 transition-opacity"
            >
              Configure
            </Button>
          </div>
        ))}
        
        <Card className="border-dashed border-2 border-border hover:border-primary/50 transition-all cursor-pointer">
          <CardContent className="flex flex-col items-center justify-center p-6 h-full">
            <Button 
              variant="outline" 
              size="icon" 
              className="h-16 w-16 rounded-full mb-4"
            >
              <Plus size={24} />
            </Button>
            <h3 className="font-semibold text-lg">Add New Agent</h3>
            <p className="text-sm text-muted-foreground text-center mt-1">
              Connect a custom agent
            </p>
          </CardContent>
        </Card>
      </div>
      
      <Dialog open={configOpen} onOpenChange={setConfigOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              {selectedAgent && (
                <>
                  <span 
                    className={cn("inline-flex p-2 rounded-full", 
                      getAgentBackgroundColor(selectedAgent.type)
                    )}
                  >
                    {selectedAgent.icon && <selectedAgent.icon className="h-5 w-5" />}
                  </span>
                  {selectedAgent.name} Configuration
                </>
              )}
            </DialogTitle>
            <DialogDescription>
              Configure your agent settings to connect
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            {selectedAgent && selectedAgent.configFields.map((field) => (
              <div key={field.id} className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor={field.id} className="text-right">{field.label}</Label>
                <Input
                  id={field.id}
                  type={field.type}
                  className="col-span-3"
                  placeholder={field.placeholder}
                  value={configValues[field.id] || ''}
                  onChange={(e) => setConfigValues({
                    ...configValues,
                    [field.id]: e.target.value
                  })}
                  required={field.required}
                />
              </div>
            ))}
          </div>
          
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setConfigOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleConfigSave}>
              Save & Connect
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Dashboard;
