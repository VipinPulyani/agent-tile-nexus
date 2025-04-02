
import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogFooter, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

interface OnboardingStep {
  title: string;
  description: string;
  component: React.ReactNode;
}

const AgentOnboarding = ({ agentId, open, onOpenChange }: { agentId: string; open: boolean; onOpenChange: (open: boolean) => void }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const navigate = useNavigate();
  
  const steps: OnboardingStep[] = [
    {
      title: "Welcome to your new Agent",
      description: "Let's set up your agent for optimal performance",
      component: (
        <div className="flex flex-col items-center text-center py-6">
          <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mb-4">
            <div className="w-12 h-12 text-primary">
              {/* Icon for the agent */}
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 4L12 20"></path>
                <path d="M18 10L12 4 6 10"></path>
              </svg>
            </div>
          </div>
          <h3 className="text-xl font-medium">Agent Setup</h3>
          <p className="text-muted-foreground mt-2 max-w-md">
            This wizard will guide you through the process of setting up your new agent.
            Follow the steps to configure and connect your agent.
          </p>
        </div>
      )
    },
    {
      title: "Configure Connection",
      description: "Set up the connection details for your agent",
      component: (
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="host">Host URL</Label>
            <Input id="host" placeholder="https://your-airflow-host.com" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="apiKey">API Key</Label>
            <Input id="apiKey" type="password" placeholder="Enter your API key" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="dagId">Default DAG ID (Optional)</Label>
            <Input id="dagId" placeholder="example_dag" />
          </div>
        </div>
      )
    },
    {
      title: "Verify Connection",
      description: "Test the connection to your agent",
      component: (
        <div className="py-4 flex flex-col items-center">
          <div className="w-full max-w-md space-y-6">
            <div className="bg-green-100 text-green-800 p-4 rounded-md">
              <div className="flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                  <polyline points="22 4 12 14.01 9 11.01"></polyline>
                </svg>
                <span>Connection successful!</span>
              </div>
            </div>
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">
                Your agent is now ready to use. You can start interacting with it immediately.
              </p>
            </div>
          </div>
        </div>
      )
    }
  ];

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      // Complete onboarding
      onOpenChange(false);
      toast.success("Agent setup completed successfully!");
      navigate(`/chat?agent=${agentId}`);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSkip = () => {
    // Skip to demo mode
    onOpenChange(false);
    toast.success("Demo mode activated! Explore without setting up.");
    navigate(`/chat?agent=${agentId}&demo=true`);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>{steps[currentStep].title}</DialogTitle>
          <DialogDescription>{steps[currentStep].description}</DialogDescription>
        </DialogHeader>

        {/* Step Indicators */}
        <div className="flex justify-center mb-4">
          {steps.map((_, index) => (
            <div 
              key={index}
              className={cn(
                "w-2.5 h-2.5 rounded-full mx-1",
                index === currentStep ? "bg-primary" : "bg-muted"
              )}
            />
          ))}
        </div>

        {/* Current Step Content */}
        {steps[currentStep].component}

        <DialogFooter className="flex flex-col-reverse sm:flex-row sm:justify-between sm:space-x-2">
          <div className="flex space-x-2">
            {currentStep > 0 && (
              <Button variant="outline" onClick={handlePrevious}>
                Previous
              </Button>
            )}
            {currentStep === 0 && (
              <Button variant="outline" onClick={handleSkip}>
                Try Demo Mode
              </Button>
            )}
          </div>
          <Button onClick={handleNext}>
            {currentStep < steps.length - 1 ? "Next" : "Complete Setup"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default AgentOnboarding;
