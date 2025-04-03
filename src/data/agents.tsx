
import { AgentType, Agent, ConfigField } from "@/types/agent";
import { Wind, Server, Wrench, Github, Puzzle, Zap, NetworkIcon } from "lucide-react";

export const agentIcons: Record<AgentType, string> = {
  langchain: "⚡",
  langgraph: "📊",
  airflow: "🔄",
  kubernetes: "🚢",
  jenkins: "🔧",
  github: "🐙",
  custom: "🧩"
};

export const agentColors: Record<AgentType, string> = {
  langchain: "bg-gradient-to-r from-blue-500 to-purple-500",
  langgraph: "bg-gradient-to-r from-green-400 to-teal-500",
  airflow: "bg-gradient-to-r from-orange-400 to-pink-500",
  kubernetes: "bg-gradient-to-r from-indigo-500 to-blue-500",
  jenkins: "bg-gradient-to-r from-red-500 to-pink-500",
  github: "bg-gradient-to-r from-gray-700 to-gray-900",
  custom: "bg-gradient-to-r from-purple-500 to-indigo-500"
};

export const agentDescriptions: Record<AgentType, string> = {
  langchain: "Process documents and chain LLM tasks",
  langgraph: "Visualize and analyze language workflows",
  airflow: "Manage and monitor data workflows",
  kubernetes: "Assist with Kubernetes operations",
  jenkins: "Automate build and deployment processes",
  github: "Manage code repositories and workflows",
  custom: "Create your own custom agent"
};

// Define the default configuration fields for each agent type
const defaultConfigFields: ConfigField[] = [
  {
    id: "api_key",
    label: "API Key",
    type: "password",
    required: true,
    placeholder: "Enter your API key"
  },
  {
    id: "endpoint",
    label: "Endpoint URL",
    type: "url",
    required: true,
    placeholder: "https://api.example.com"
  }
];

// Create agents array
export const agents: Agent[] = [
  {
    id: "airflow",
    name: "Airflow Assistant",
    type: "airflow",
    description: "Manage and monitor data workflows",
    icon: Wind,
    configured: false,
    configFields: [
      ...defaultConfigFields,
      {
        id: "dag_folder",
        label: "DAG Folder Path",
        type: "text",
        required: false,
        placeholder: "/opt/airflow/dags"
      }
    ]
  },
  {
    id: "kubernetes",
    name: "Kubernetes Assistant",
    type: "kubernetes",
    description: "Assist with Kubernetes operations",
    icon: Server,
    configured: false,
    configFields: [
      ...defaultConfigFields,
      {
        id: "cluster_name",
        label: "Cluster Name",
        type: "text",
        required: true,
        placeholder: "main-cluster"
      }
    ]
  },
  {
    id: "jenkins",
    name: "Jenkins Assistant",
    type: "jenkins",
    description: "Automate build and deployment processes",
    icon: Wrench,
    configured: false,
    configFields: defaultConfigFields
  },
  {
    id: "github",
    name: "GitHub Assistant",
    type: "github",
    description: "Manage code repositories and workflows",
    icon: Github,
    configured: false,
    configFields: defaultConfigFields
  },
  {
    id: "langchain",
    name: "LangChain Assistant",
    type: "langchain",
    description: "Process documents and chain LLM tasks",
    icon: Zap,
    configured: false,
    configFields: defaultConfigFields
  },
  {
    id: "langgraph",
    name: "LangGraph Assistant",
    type: "langgraph",
    description: "Visualize and analyze language workflows",
    icon: NetworkIcon,
    configured: false,
    configFields: defaultConfigFields
  },
  {
    id: "custom",
    name: "Custom Assistant",
    type: "custom",
    description: "Create your own custom agent",
    icon: Puzzle,
    configured: false,
    configFields: [
      ...defaultConfigFields,
      {
        id: "custom_params",
        label: "Custom Parameters",
        type: "text",
        required: false,
        placeholder: "param1=value1,param2=value2"
      }
    ]
  }
];
