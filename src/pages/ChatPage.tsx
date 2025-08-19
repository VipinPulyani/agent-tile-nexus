import React, { useState, useRef, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { agents } from "@/data/agents";
import { Send, Plus, Paperclip, Smile, MoreVertical, User, Bot, History, MessageCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { AgentType } from "@/types/agent";
import { toast } from "sonner";

interface Message {
  id: string;
  sender: 'user' | 'agent';
  content: string;
  timestamp: Date;
  status?: 'sending' | 'sent' | 'error';
}

interface ChatSession {
  id: string;
  agentId: string;
  title: string;
  messages: Message[];
  lastActivity: Date;
}

const ChatPage = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const agentId = searchParams.get('agent') || '';
  const agent = agents.find(a => a.id === agentId);
  
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [chatSessions, setChatSessions] = useState<ChatSession[]>([]);
  const [currentSessionId, setCurrentSessionId] = useState<string>('');
  const [showHistory, setShowHistory] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Redirect if no agent is selected
  useEffect(() => {
    if (!agentId || !agent) {
      toast.error("Please select an agent first");
      navigate('/');
      return;
    }
  }, [agentId, agent, navigate]);

  // Load chat sessions from localStorage
  useEffect(() => {
    const savedSessions = localStorage.getItem('chatSessions');
    if (savedSessions) {
      const sessions = JSON.parse(savedSessions);
      setChatSessions(sessions);
    }
  }, []);

  // Initialize or load session for the current agent
  useEffect(() => {
    if (!agent) return;
    
    let session = chatSessions.find(s => s.agentId === agentId && s.messages.length > 0);
    
    if (!session) {
      // Create new session
      const newSession: ChatSession = {
        id: Date.now().toString(),
        agentId: agentId,
        title: `New ${agent.name} Chat`,
        messages: [{
          id: Date.now().toString(),
          sender: 'agent',
          content: `Hello! I'm your ${agent.name} assistant. How can I help you today?`,
          timestamp: new Date()
        }],
        lastActivity: new Date()
      };
      
      setMessages(newSession.messages);
      setCurrentSessionId(newSession.id);
      setChatSessions(prev => [...prev, newSession]);
    } else {
      setMessages(session.messages);
      setCurrentSessionId(session.id);
    }
  }, [agent, agentId, chatSessions]);

  // Save sessions to localStorage whenever they change
  useEffect(() => {
    if (chatSessions.length > 0) {
      localStorage.setItem('chatSessions', JSON.stringify(chatSessions));
    }
  }, [chatSessions]);
  
  // Scroll to bottom whenever messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);
  
  const handleSendMessage = async () => {
    if (!input.trim()) return;
    
    // Add user message
    const newUserMessage: Message = {
      id: Date.now().toString(),
      sender: 'user',
      content: input,
      timestamp: new Date(),
      status: 'sending'
    };
    
    setMessages(prev => [...prev, newUserMessage]);
    setInput('');
    
    // Show typing indicator
    setIsTyping(true);
    
    try {
      // This is where we would call the FastAPI backend in a real implementation
      // const response = await fetch('http://localhost:8000/api/chat', {
      //   method: 'POST',
      //   headers: {
      //     'Content-Type': 'application/json',
      //   },
      //   body: JSON.stringify({
      //     message: input,
      //     agentId: agent?.id || 'default',
      //   }),
      // });
      
      // const data = await response.json();
      
      // For now, simulate response after a short delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Update user message status to 'sent'
      setMessages(prev => 
        prev.map(msg => 
          msg.id === newUserMessage.id ? { ...msg, status: 'sent' } : msg
        )
      );
      
      // Add agent response
      const responseMessage: Message = {
        id: (Date.now() + 1).toString(),
        sender: 'agent',
        content: `I'm your ${agent?.name || 'AI'} assistant. This is a simulated response to: "${input}"`,
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, responseMessage]);
      
      // Update current session with new messages
      setChatSessions(prev => 
        prev.map(session => 
          session.id === currentSessionId 
            ? { 
                ...session, 
                messages: [...session.messages, { ...newUserMessage, status: 'sent' }, responseMessage],
                lastActivity: new Date(),
                title: session.messages.length <= 1 ? input.slice(0, 30) + '...' : session.title
              }
            : session
        )
      );
    } catch (error) {
      console.error('Error sending message:', error);
      
      // Update user message status to 'error'
      setMessages(prev => 
        prev.map(msg => 
          msg.id === newUserMessage.id ? { ...msg, status: 'error' } : msg
        )
      );
    } finally {
      setIsTyping(false);
    }
  };

  const startNewChat = () => {
    if (!agent) return;
    
    const newSession: ChatSession = {
      id: Date.now().toString(),
      agentId: agentId,
      title: `New ${agent.name} Chat`,
      messages: [{
        id: Date.now().toString(),
        sender: 'agent',
        content: `Hello! I'm your ${agent.name} assistant. How can I help you today?`,
        timestamp: new Date()
      }],
      lastActivity: new Date()
    };
    
    setMessages(newSession.messages);
    setCurrentSessionId(newSession.id);
    setChatSessions(prev => [...prev, newSession]);
  };

  const loadChatSession = (sessionId: string) => {
    const session = chatSessions.find(s => s.id === sessionId);
    if (session) {
      setMessages(session.messages);
      setCurrentSessionId(sessionId);
    }
  };

  const agentSessions = chatSessions.filter(s => s.agentId === agentId);

  if (!agent) {
    return null; // Will redirect
  }
  
  return (
    <div className="container h-screen py-4 flex gap-4">
      {/* Chat History Sidebar */}
      <div className={cn(
        "transition-all duration-300 bg-card border rounded-lg p-4 flex flex-col",
        showHistory ? "w-80" : "w-0 p-0 overflow-hidden"
      )}>
        {showHistory && (
          <>
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-semibold flex items-center gap-2">
                <History size={18} />
                Chat History
              </h2>
              <Button 
                variant="outline" 
                size="sm"
                onClick={startNewChat}
              >
                <Plus size={16} className="mr-1" />
                New
              </Button>
            </div>
            <ScrollArea className="flex-1">
              <div className="space-y-2">
                {agentSessions.map((session) => (
                  <div
                    key={session.id}
                    onClick={() => loadChatSession(session.id)}
                    className={cn(
                      "p-3 rounded-lg cursor-pointer transition-colors hover:bg-accent",
                      currentSessionId === session.id && "bg-accent"
                    )}
                  >
                    <div className="flex items-start gap-2">
                      <MessageCircle size={16} className="mt-1 flex-shrink-0" />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">{session.title}</p>
                        <p className="text-xs text-muted-foreground">
                          {session.lastActivity.toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
                {agentSessions.length === 0 && (
                  <p className="text-sm text-muted-foreground text-center py-4">
                    No chat history yet
                  </p>
                )}
              </div>
            </ScrollArea>
          </>
        )}
      </div>

      <Card className="flex-1 flex flex-col overflow-hidden border-none shadow-lg glass-panel">
        {/* Chat header */}
        <div className="p-4 border-b bg-muted/30 flex items-center justify-between">
          <div className="flex items-center gap-2">
            {agent && (
              <div 
                className={cn("inline-flex p-2 rounded-full", 
                  agent.type === "airflow" && "bg-agent-airflow",
                  agent.type === "kubernetes" && "bg-agent-kubernetes",
                  agent.type === "cmac" && "bg-agent-cmac",
                  agent.type !== "airflow" && agent.type !== "kubernetes" && agent.type !== "cmac" && "bg-agent-default"
                )}
              >
                {agent.icon && <agent.icon className="text-white" size={18} />}
              </div>
            )}
            <h1 className="text-lg font-bold">
              {agent ? `${agent.name}` : 'Agent Chat'}
            </h1>
            <span className="inline-flex h-2 w-2 rounded-full bg-green-500 animate-pulse ml-2"></span>
          </div>
          <div className="flex gap-2">
            <Button 
              variant="ghost" 
              size="icon"
              onClick={() => setShowHistory(!showHistory)}
            >
              <History className="h-5 w-5" />
            </Button>
            <Button variant="ghost" size="icon">
              <MoreVertical className="h-5 w-5" />
            </Button>
          </div>
        </div>
        
        {/* Chat messages */}
        <ScrollArea className="flex-1 p-4">
          <div className="space-y-4">
            {messages.map((message) => (
              <div 
                key={message.id} 
                className={cn(
                  "flex items-start gap-2.5 group",
                  message.sender === 'user' ? "justify-end" : "justify-start"
                )}
              >
                {message.sender === 'agent' && (
                  <div className="flex-shrink-0 rounded-full p-1.5 bg-primary text-white">
                    <Bot size={16} />
                  </div>
                )}
                
                <div 
                  className={cn(
                    "max-w-[75%] rounded-lg p-3 break-words",
                    message.sender === 'user' 
                      ? "bg-primary text-primary-foreground rounded-tr-none" 
                      : "bg-muted text-foreground rounded-tl-none",
                    message.status === 'sending' && "opacity-70",
                    message.status === 'error' && "bg-destructive/20 border border-destructive"
                  )}
                >
                  <div className="mb-1 whitespace-pre-wrap">
                    {message.content}
                  </div>
                  <div className="text-xs opacity-70 flex justify-end">
                    {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </div>
                </div>
                
                {message.sender === 'user' && (
                  <div className="flex-shrink-0 rounded-full p-1.5 bg-secondary text-foreground">
                    <User size={16} />
                  </div>
                )}
              </div>
            ))}
            
            {isTyping && (
              <div className="flex items-start gap-2.5 justify-start">
                <div className="flex-shrink-0 rounded-full p-1.5 bg-primary text-white">
                  <Bot size={16} />
                </div>
                <div className="bg-muted text-foreground rounded-lg rounded-tl-none p-3 max-w-[75%]">
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 rounded-full bg-current animate-bounce"></div>
                    <div className="w-2 h-2 rounded-full bg-current animate-bounce [animation-delay:0.2s]"></div>
                    <div className="w-2 h-2 rounded-full bg-current animate-bounce [animation-delay:0.4s]"></div>
                  </div>
                </div>
              </div>
            )}
            
            <div ref={messagesEndRef} />
          </div>
        </ScrollArea>
        
        {/* Chat input */}
        <div className="p-3 border-t bg-muted/30">
          <div className="flex gap-2 relative">
            <Button 
              variant="outline" 
              size="icon" 
              className="rounded-full flex-shrink-0"
            >
              <Plus size={18} />
            </Button>
            <div className="flex-1 flex rounded-full border bg-background overflow-hidden">
              <Input
                placeholder="Type your message..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleSendMessage();
                  }
                }}
                className="flex-1 border-0 focus-visible:ring-0 focus-visible:ring-offset-0"
              />
              <div className="flex items-center pr-2">
                <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full">
                  <Paperclip size={18} />
                </Button>
                <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full">
                  <Smile size={18} />
                </Button>
              </div>
            </div>
            <Button 
              onClick={handleSendMessage} 
              size="icon" 
              className="rounded-full flex-shrink-0"
            >
              <Send size={18} />
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default ChatPage;