
import React, { useState, useEffect, useRef } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { Send, Bot, User, Loader2 } from "lucide-react";
import { toast } from "sonner";

// Message type definition
interface Message {
  id: string;
  content: string;
  isUser: boolean;
  timestamp: Date;
  isLoading?: boolean;
}

// Get API URL from environment variable or default to localhost in development
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

const ChatBox = ({ agentId }: { agentId: string }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [agentConfig, setAgentConfig] = useState<any>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { user } = useAuth();
  
  // Load agent configuration
  useEffect(() => {
    const savedConfig = localStorage.getItem(`agent_config_${user?.id}_${agentId}`);
    if (savedConfig) {
      setAgentConfig(JSON.parse(savedConfig));
    } else {
      // No config found, show message
      toast.warning("This agent is not configured. Please configure it first.");
    }
  }, [agentId, user?.id]);
  
  // Initial welcome message
  useEffect(() => {
    const welcomeMessage = {
      id: "welcome",
      content: `Hello! I'm the ${agentId.charAt(0).toUpperCase() + agentId.slice(1)} agent. How can I assist you today?`,
      isUser: false,
      timestamp: new Date()
    };
    setMessages([welcomeMessage]);
  }, [agentId]);
  
  // Auto scroll to bottom of chat
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);
  
  // Fetch chat history on component mount
  useEffect(() => {
    const fetchChatHistory = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token || token === "demo-token") return; // Skip for demo mode
        
        const response = await fetch(`${API_URL}/api/chat/history?agent_id=${agentId}`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        
        if (!response.ok) throw new Error("Failed to fetch chat history");
        
        const data = await response.json();
        
        // Format the history data into messages
        const historyMessages = data.map((item: any) => ({
          id: item.id,
          content: item.message,
          isUser: true,
          timestamp: new Date(item.timestamp)
        })).concat(data.map((item: any) => ({
          id: `response-${item.id}`,
          content: item.response,
          isUser: false,
          timestamp: new Date(item.timestamp)
        }))).sort((a: Message, b: Message) => a.timestamp.getTime() - b.timestamp.getTime());
        
        if (historyMessages.length > 0) {
          setMessages([...historyMessages]);
        }
      } catch (error) {
        console.error("Error fetching chat history:", error);
      }
    };
    
    fetchChatHistory();
  }, [agentId]);
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;
    
    // Check if agent is configured
    if (!agentConfig && agentId !== "demo") {
      toast.error("Please configure the agent before chatting");
      return;
    }
    
    // Create a temporary message ID
    const messageId = Date.now().toString();
    
    // Add user message
    const userMessage: Message = {
      id: messageId,
      content: input,
      isUser: true,
      timestamp: new Date()
    };
    
    // Add loading message from assistant
    const loadingMessage: Message = {
      id: `loading-${messageId}`,
      content: "...",
      isUser: false,
      timestamp: new Date(),
      isLoading: true
    };
    
    setMessages(prev => [...prev, userMessage, loadingMessage]);
    setInput("");
    setIsTyping(true);
    
    try {
      // Use demo response for demo users or when using the fake token
      const token = localStorage.getItem("token");
      let response;
      
      if (!token || token === "demo-token") {
        // Simulate API call for demo mode
        await new Promise(resolve => setTimeout(resolve, 1500));
        
        // If using Airflow agent, include configuration in response
        let responseText = `Demo response for "${input}" from the ${agentId} agent.`;
        if (agentId === "airflow" && agentConfig) {
          responseText = `Using Airflow at ${agentConfig.values.url} with username ${agentConfig.values.username}. Processing your request: "${input}"`;
        }
        
        response = {
          id: `response-${messageId}`,
          response: responseText,
          timestamp: new Date()
        };
      } else {
        // Real API call
        const apiResponse = await fetch(`${API_URL}/api/chat`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({
            message: input,
            agent_id: agentId,
            config: agentConfig?.values // Send agent configuration to backend
          })
        });
        
        if (!apiResponse.ok) throw new Error("Failed to send message");
        
        response = await apiResponse.json();
      }
      
      // Remove loading message and add real response
      setMessages(prev => 
        prev.filter(msg => msg.id !== `loading-${messageId}`).concat({
          id: response.id,
          content: response.response,
          isUser: false,
          timestamp: new Date(response.timestamp)
        })
      );
    } catch (error) {
      console.error("Error sending message:", error);
      // Remove loading message and add error message
      setMessages(prev => 
        prev.filter(msg => msg.id !== `loading-${messageId}`).concat({
          id: `error-${messageId}`,
          content: "Sorry, I couldn't process your request. Please try again.",
          isUser: false,
          timestamp: new Date()
        })
      );
      toast.error("Failed to send message. Please try again.");
    } finally {
      setIsTyping(false);
    }
  };
  
  return (
    <div className="flex flex-col h-full overflow-hidden border rounded-lg shadow-lg bg-background">
      {/* Chat header */}
      <div className="p-4 border-b bg-muted/20">
        <div className="flex items-center space-x-2">
          <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
            <Bot className="w-6 h-6 text-primary" />
          </div>
          <div>
            <h3 className="font-semibold">{agentId.charAt(0).toUpperCase() + agentId.slice(1)} Agent</h3>
            {agentConfig ? (
              <p className="text-xs text-muted-foreground">
                Connected to {agentConfig.values.url}
              </p>
            ) : (
              <p className="text-xs text-muted-foreground">
                Not configured
              </p>
            )}
          </div>
        </div>
      </div>
      
      {/* Chat messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${message.isUser ? 'justify-end' : 'justify-start'}`}
          >
            <div className={`flex items-start max-w-[80%] gap-2 ${message.isUser ? 'flex-row-reverse' : 'flex-row'}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                message.isUser ? 'bg-primary' : 'bg-primary/20'
              }`}>
                {message.isUser ? (
                  <User className="w-5 h-5 text-primary-foreground" />
                ) : (
                  <Bot className="w-5 h-5 text-primary" />
                )}
              </div>
              <div className={`rounded-lg p-3 ${
                message.isUser 
                  ? 'bg-primary text-primary-foreground' 
                  : 'bg-muted'
              }`}>
                {message.isLoading ? (
                  <div className="flex items-center space-x-1">
                    <div className="w-2 h-2 bg-current rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                    <div className="w-2 h-2 bg-current rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                    <div className="w-2 h-2 bg-current rounded-full animate-bounce"></div>
                  </div>
                ) : (
                  <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                )}
                <p className="text-xs opacity-70 mt-1">
                  {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </p>
              </div>
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>
      
      {/* Input area */}
      <form onSubmit={handleSubmit} className="p-4 border-t">
        <div className="relative">
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type your message..."
            className="pr-16 py-6 bg-muted/30"
            disabled={!agentConfig && agentId !== "demo"} 
          />
          <Button 
            type="submit" 
            size="icon" 
            className="absolute right-2 top-1/2 transform -translate-y-1/2 h-8 w-8" 
            disabled={isTyping || !input.trim() || (!agentConfig && agentId !== "demo")}
          >
            {isTyping ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Send className="h-4 w-4" />
            )}
          </Button>
        </div>
        {isTyping && (
          <p className="text-xs text-muted-foreground mt-2">Agent is typing...</p>
        )}
        {!agentConfig && agentId !== "demo" && (
          <p className="text-xs text-amber-500 mt-2">
            Please configure this agent on the dashboard before using chat
          </p>
        )}
      </form>
    </div>
  );
};

export default ChatBox;
