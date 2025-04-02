
import { LucideIcon } from "lucide-react";

export type AgentType = 'airflow' | 'kubernetes' | 'jenkins' | 'github' | 'custom';

export interface Agent {
  id: string;
  name: string;
  type: AgentType;
  description: string;
  icon: LucideIcon;
  configured: boolean;
  configFields: ConfigField[];
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
