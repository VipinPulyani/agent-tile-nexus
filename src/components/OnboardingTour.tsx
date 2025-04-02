
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { X, ChevronRight, ChevronLeft, MessageSquare, Settings, Bell, User } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useNotifications } from "@/contexts/NotificationsContext";

interface TourStep {
  title: string;
  description: string;
  icon: React.ReactNode;
}

const OnboardingTour = () => {
  const [open, setOpen] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const { addNotification } = useNotifications();
  
  const steps: TourStep[] = [
    {
      title: "Welcome to AgentHub!",
      description: "This quick tour will help you navigate the main features of our platform. You can skip this tour and revisit it later from the profile settings.",
      icon: <Settings size={40} className="text-primary" />
    },
    {
      title: "Onboarding Dashboard",
      description: "The Onboarding Dashboard is your central hub where you can configure and activate your AI agents. Each agent serves different purposes, from workflow automation to infrastructure management.",
      icon: <Settings size={40} className="text-blue-500" />
    },
    {
      title: "Chat Interface",
      description: "Once an agent is configured, you can communicate with it through our intuitive chat interface. Ask questions, give commands, and receive insights in natural language.",
      icon: <MessageSquare size={40} className="text-green-500" />
    },
    {
      title: "Notifications",
      description: "Stay informed with our notification system. Get alerts when agents are updated, important events occur, or when you need to take action.",
      icon: <Bell size={40} className="text-orange-500" />
    },
    {
      title: "Profile Settings",
      description: "Customize your experience by updating your profile settings, toggling dark mode, and managing notification preferences.",
      icon: <User size={40} className="text-purple-500" />
    }
  ];
  
  useEffect(() => {
    // Check if first-time user
    const hasSeenTour = localStorage.getItem("hasSeenTour");
    if (!hasSeenTour) {
      setOpen(true);
      // Add a welcome notification
      addNotification({
        title: "Welcome to AgentHub!",
        message: "Thanks for joining us. Configure your first agent to get started.",
        category: "system_alert"
      });
    }
  }, [addNotification]);
  
  const handleComplete = () => {
    localStorage.setItem("hasSeenTour", "true");
    setOpen(false);
    
    // Add a notification after tour completion
    addNotification({
      title: "Tour Completed",
      message: "You've completed the tour! Check out your notification settings.",
      category: "system_alert"
    });
  };
  
  const nextStep = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(prev => prev + 1);
    } else {
      handleComplete();
    }
  };
  
  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <div className="flex items-center justify-center mb-4">
            {steps[currentStep].icon}
          </div>
          <DialogTitle className="text-center text-xl">
            {steps[currentStep].title}
          </DialogTitle>
        </DialogHeader>
        
        <DialogDescription className="text-center">
          {steps[currentStep].description}
        </DialogDescription>
        
        <div className="flex items-center justify-center my-4">
          {steps.map((_, index) => (
            <div 
              key={index} 
              className={`h-2 w-2 rounded-full mx-1 ${
                index === currentStep ? 'bg-primary' : 'bg-gray-300'
              }`}
            />
          ))}
        </div>
        
        <div className="flex justify-between items-center">
          <Button 
            variant="outline" 
            onClick={prevStep} 
            disabled={currentStep === 0}
          >
            <ChevronLeft className="mr-1" size={16} />
            Back
          </Button>
          
          <Button variant="ghost" onClick={handleComplete}>
            Skip Tour
          </Button>
          
          <Button onClick={nextStep}>
            {currentStep < steps.length - 1 ? (
              <>
                Next
                <ChevronRight className="ml-1" size={16} />
              </>
            ) : (
              'Get Started'
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default OnboardingTour;
