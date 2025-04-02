
import React, { useState, useRef, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { agents } from "@/data/agents";
import { Send } from "lucide-react";
import { cn } from "@/lib/utils";

interface Message {
  id: string;
  sender: 'user' | 'agent';
  content: string;
  timestamp: Date;
}

const ChatPage = () => {
  const [searchParams] = useSearchParams();
  const agentId = searchParams.get('agent') || '';
  const agent = agents.find(a => a.id === agentId);
  
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  // Add initial greeting from the agent
  useEffect(() => {
    if (agent && messages.length === 0) {
      setMessages([
        {
          id: Date.now().toString(),
          sender: 'agent',
          content: `Hello! I'm your ${agent.name} assistant. How can I help you today?`,
          timestamp: new Date()
        }
      ]);
    }
  }, [agent]);
  
  // Scroll to bottom whenever messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);
  
  const handleSendMessage = () => {
    if (!input.trim()) return;
    
    // Add user message
    const newMessage: Message = {
      id: Date.now().toString(),
      sender: 'user',
      content: input,
      timestamp: new Date()
    };
    
    setMessages(prev => [...prev, newMessage]);
    setInput('');
    
    // Simulate agent response after a short delay
    setTimeout(() => {
      const responseMessage: Message = {
        id: (Date.now() + 1).toString(),
        sender: 'agent',
        content: `I'm your ${agent?.name || 'AI'} assistant. This is a simulated response to: "${input}"`,
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, responseMessage]);
    }, 1000);
  };
  
  return (
    <div className="container h-screen py-4 flex flex-col">
      <div className="mb-4 flex items-center gap-2">
        {agent && (
          <div 
            className={cn("inline-flex p-2 rounded-full", 
              agent.type === "airflow" && "bg-agent-airflow",
              agent.type === "kubernetes" && "bg-agent-kubernetes",
              agent.type !== "airflow" && agent.type !== "kubernetes" && "bg-agent-default"
            )}
          >
            {agent.icon && <agent.icon className="text-white" size={18} />}
          </div>
        )}
        <h1 className="text-2xl font-bold">
          {agent ? `Chat with ${agent.name}` : 'Agent Chat'}
        </h1>
      </div>
      
      <ScrollArea className="flex-1 bg-muted/30 rounded-lg p-4 mb-4">
        <div className="space-y-4">
          {messages.map((message) => (
            <div 
              key={message.id} 
              className={cn(
                "flex max-w-[80%] rounded-lg p-4",
                message.sender === 'user' 
                  ? "ml-auto bg-primary text-primary-foreground" 
                  : "bg-card border"
              )}
            >
              <div>
                <div className="mb-1">
                  {message.content}
                </div>
                <div className="text-xs opacity-70">
                  {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </div>
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>
      </ScrollArea>
      
      <div className="flex gap-2">
        <Input
          placeholder="Type your message..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              handleSendMessage();
            }
          }}
          className="flex-1"
        />
        <Button onClick={handleSendMessage} size="icon">
          <Send size={18} />
        </Button>
      </div>
    </div>
  );
};

export default ChatPage;
