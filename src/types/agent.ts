
import { LucideIcon } from "lucide-react";

export type AgentType = 'airflow' | 'kubernetes' | 'jenkins' | 'github' | 'custom' | 'langchain' | 'langgraph';

export interface Agent {
  id: string;
  name: string;
  type: AgentType;
  description: string;
  icon: LucideIcon;
  configured: boolean;
  configFields: ConfigField[];
  status?: 'active' | 'inactive' | 'configuring';
}

export interface ConfigField {
  id: string;
  label: string;
  type: 'text' | 'password' | 'number' | 'url';
  required: boolean;
  placeholder?: string;
}

export interface AgentConfig {
  agentId: string;
  values: Record<string, string>;
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'agent';
  content: string;
  timestamp: Date;
  status?: 'sending' | 'sent' | 'error';
}

export interface ChatResponse {
  id: string;
  response: string;
  timestamp: Date;
}

export interface UserActivity {
  id: string;
  activity_type: string;
  timestamp: Date;
  details: Record<string, any>;
}
