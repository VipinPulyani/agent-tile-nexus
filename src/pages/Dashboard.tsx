import React, { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus, Search, Filter, X, Settings } from "lucide-react";
import { toast } from "sonner";
import { agents } from "@/data/agents";
import { cn } from "@/lib/utils";
import { useNavigate } from "react-router-dom";
import { Agent, AgentConfig, AgentType } from "@/types/agent";
import AgentOnboarding from "@/components/AgentOnboarding";
import { useAuth } from "@/contexts/AuthContext";

const AGENT_TYPE_LABELS: Record<AgentType, string> = {
  airflow: "Workflow",
  kubernetes: "Infrastructure",
  jenkins: "CI/CD",
  github: "Version Control",
  custom: "Custom",
  langchain: "LLM Chain",
  langgraph: "LLM Graph"
};

const Dashboard = () => {
  const [selectedAgent, setSelectedAgent] = useState<Agent | null>(null);
  const [configOpen, setConfigOpen] = useState(false);
  const [onboardingOpen, setOnboardingOpen] = useState(false);
  const [configValues, setConfigValues] = useState<Record<string, string>>({});
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedType, setSelectedType] = useState<AgentType | "all">("all");
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const activeAgentIds = useMemo(() => [], []);
  
  const filteredAgents = useMemo(() => {
    return agents.filter(agent => {
      const matchesSearch = 
        searchQuery === "" || 
        agent.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        agent.description.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesType = selectedType === "all" || agent.type === selectedType;
      
      return matchesSearch && matchesType;
    });
  }, [searchQuery, selectedType]);
  
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
    
    activeAgentIds.push(selectedAgent.id);
    navigate(`/chat?agent=${selectedAgent.id}`);
  };
  
  const openAgentConfig = (agent: Agent) => {
    setSelectedAgent(agent);
    
    if (activeAgentIds.includes(agent.id)) {
      navigate(`/chat?agent=${agent.id}`);
    } else {
      setConfigOpen(true);
    }
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
      case "langchain":
        return "bg-green-100 text-green-600";
      case "langgraph":
        return "bg-yellow-100 text-yellow-600";
      default:
        return "bg-slate-100 text-slate-600";
    }
  };
  
  const clearFilters = () => {
    setSearchQuery("");
    setSelectedType("all");
  };
  
  return (
    <div className="container py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Agent Hub</h1>
        <p className="text-muted-foreground mt-1">
          Configure and chat with your agents
        </p>
        {user?.isDemo && (
          <div className="mt-2 bg-amber-100 text-amber-800 px-4 py-2 rounded-md text-sm">
            You're using a demo account. Some features may be limited.
          </div>
        )}
      </div>
      
      <div className="mb-8 space-y-4">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-grow">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search agents..."
              className="pl-10"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            {searchQuery && (
              <Button 
                variant="ghost" 
                size="icon" 
                className="absolute right-2 top-2 h-6 w-6"
                onClick={() => setSearchQuery("")}
              >
                <X className="h-4 w-4" />
              </Button>
            )}
          </div>
          <div className="flex gap-2">
            <div className="flex items-center gap-2 border rounded-md p-2">
              <Filter className="h-4 w-4 text-muted-foreground" />
              <select 
                className="bg-transparent text-sm outline-none"
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value as AgentType | "all")}
              >
                <option value="all">All Types</option>
                <option value="airflow">Workflow</option>
                <option value="kubernetes">Infrastructure</option>
                <option value="jenkins">CI/CD</option>
                <option value="github">Version Control</option>
                <option value="custom">Custom</option>
                <option value="langchain">LLM Chain</option>
                <option value="langgraph">LLM Graph</option>
              </select>
            </div>
            {(searchQuery || selectedType !== "all") && (
              <Button 
                variant="outline" 
                size="sm" 
                onClick={clearFilters}
                className="whitespace-nowrap"
              >
                Clear Filters
              </Button>
            )}
          </div>
        </div>
      </div>
      
      {filteredAgents.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredAgents.map((agent) => (
            <div 
              key={agent.id} 
              className="agent-tile group flex flex-col items-center justify-center p-6 rounded-lg border border-border hover:border-primary/50 transition-all cursor-pointer"
              onClick={() => openAgentConfig(agent)}
            >
              <div 
                className={cn("agent-icon p-4 rounded-full mb-4", 
                  getAgentBackgroundColor(agent.type)
                )}
              >
                <agent.icon size={28} />
              </div>
              <h3 className="font-semibold text-lg">{agent.name}</h3>
              <div className="text-xs text-muted-foreground mb-2">
                {AGENT_TYPE_LABELS[agent.type as AgentType]}
              </div>
              <p className="text-sm text-muted-foreground text-center mt-1">
                {agent.description}
              </p>
              
              {activeAgentIds.includes(agent.id) ? (
                <div className="mt-2 bg-green-100 text-green-800 px-3 py-1 rounded-full text-xs font-medium flex items-center">
                  <span className="h-2 w-2 rounded-full bg-green-500 mr-1"></span>
                  Active
                </div>
              ) : (
                <div className="mt-2 bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-xs font-medium">
                  Available
                </div>
              )}
              
              <Button 
                variant="ghost" 
                size="sm" 
                className="mt-4 opacity-0 group-hover:opacity-100 transition-opacity"
              >
                {activeAgentIds.includes(agent.id) ? "Open Chat" : "Configure"}
              </Button>
            </div>
          ))}
          
          <Card className="border-dashed border-2 border-border hover:border-primary/50 transition-all opacity-60 cursor-default">
            <CardContent className="flex flex-col items-center justify-center p-6 h-full">
              <Button 
                variant="outline" 
                size="icon" 
                className="h-16 w-16 rounded-full mb-4"
                disabled
              >
                <Plus size={24} />
              </Button>
              <h3 className="font-semibold text-lg">Add New Agent</h3>
              <p className="text-sm text-muted-foreground text-center mt-1">
                Connect a custom agent
              </p>
              <div className="mt-2 bg-amber-100 text-amber-800 px-3 py-1 rounded-full text-xs font-medium">
                Coming Soon
              </div>
            </CardContent>
          </Card>
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <div className="bg-slate-100 p-6 rounded-full mb-4">
            <Search size={32} className="text-slate-400" />
          </div>
          <h3 className="text-xl font-semibold mb-2">No agents found</h3>
          <p className="text-muted-foreground max-w-md">
            We couldn't find any agents matching your search criteria. Try adjusting your filters or search term.
          </p>
          <Button 
            variant="outline" 
            onClick={clearFilters} 
            className="mt-4"
          >
            Clear All Filters
          </Button>
        </div>
      )}
      
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
      
      {selectedAgent && (
        <AgentOnboarding 
          agentId={selectedAgent.id}
          open={onboardingOpen}
          onOpenChange={setOnboardingOpen}
        />
      )}
    </div>
  );
};

export default Dashboard;
