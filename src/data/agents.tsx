
import { AgentType, Agent, ConfigField } from "@/types/agent";
import { Wind, Server, Wrench, Github, Shield, Puzzle } from "lucide-react";

export const agentIcons: Record<AgentType, string> = {
  airflow: "🔄",
  kubernetes: "🚢",
  jenkins: "🔧",
  github: "🐙",
  cmac: "🛡️",
  custom: "🧩"
};

export const agentColors: Record<AgentType, string> = {
  airflow: "bg-gradient-to-r from-orange-400 to-pink-500",
  kubernetes: "bg-gradient-to-r from-indigo-500 to-blue-500",
  jenkins: "bg-gradient-to-r from-red-500 to-pink-500",
  github: "bg-gradient-to-r from-gray-700 to-gray-900",
  cmac: "bg-gradient-to-r from-green-500 to-teal-500",
  custom: "bg-gradient-to-r from-purple-500 to-indigo-500"
};

export const agentDescriptions: Record<AgentType, string> = {
  airflow: "Manage and monitor data workflows",
  kubernetes: "Assist with Kubernetes operations",
  jenkins: "Automate build and deployment processes",
  github: "Manage code repositories and workflows",
  cmac: "Cybersecurity monitoring and access control",
  custom: "Create your own custom agent"
};

// Create agents array
export const agents: Agent[] = [
  {
    id: "airflow",
    name: "Airflow Agent",
    type: "airflow",
    description: "Manage and monitor data workflows",
    icon: Wind,
    configured: false,
    configFields: [
      {
        id: "url",
        label: "Airflow URL",
        type: "url",
        required: true,
        placeholder: "https://airflow.example.com"
      },
      {
        id: "username",
        label: "Username",
        type: "text",
        required: true,
        placeholder: "Enter your username"
      },
      {
        id: "password",
        label: "Password",
        type: "password",
        required: true,
        placeholder: "Enter your password"
      }
    ]
  },
  {
    id: "kubernetes",
    name: "Kubernetes Agent",
    type: "kubernetes",
    description: "Assist with Kubernetes operations",
    icon: Server,
    configured: false,
    configFields: [
      {
        id: "api_key",
        label: "API Key",
        type: "password",
        required: true,
        placeholder: "Enter your API key"
      },
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
    name: "Jenkins Agent",
    type: "jenkins",
    description: "Automate build and deployment processes",
    icon: Wrench,
    configured: false,
    configFields: [
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
    ]
  },
  {
    id: "github",
    name: "GitHub Agent",
    type: "github",
    description: "Manage code repositories and workflows",
    icon: Github,
    configured: false,
    configFields: [
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
    ]
  },
  {
    id: "cmac",
    name: "CMAC Agent",
    type: "cmac",
    description: "Cybersecurity monitoring and access control",
    icon: Shield,
    configured: false,
    configFields: [
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
        placeholder: "https://cmac-api.example.com"
      },
      {
        id: "organization_id",
        label: "Organization ID",
        type: "text",
        required: true,
        placeholder: "Enter your organization ID"
      }
    ]
  },
  {
    id: "custom",
    name: "Custom Agent",
    type: "custom",
    description: "Create your own custom agent",
    icon: Puzzle,
    configured: false,
    configFields: [
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
      },
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
