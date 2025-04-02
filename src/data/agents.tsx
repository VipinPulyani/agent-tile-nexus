import { Wind, Cpu, GitBranch, Github, Server, CloudCog, Database } from "lucide-react";
import { Agent, AgentType } from "@/types/agent";

export const agents: Agent[] = [
  {
    id: "airflow",
    name: "Airflow",
    type: "airflow",
    description: "Apache Airflow workflow management",
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
        placeholder: "admin"
      },
      {
        id: "password",
        label: "Password",
        type: "password",
        required: true,
        placeholder: "••••••••"
      }
    ]
  },
  {
    id: "kubernetes",
    name: "Kubernetes",
    type: "kubernetes",
    description: "K8s cluster management",
    icon: CloudCog,
    configured: false,
    configFields: [
      {
        id: "clusterUrl",
        label: "Cluster URL",
        type: "url",
        required: true,
        placeholder: "https://k8s.example.com"
      },
      {
        id: "apiToken",
        label: "API Token",
        type: "password",
        required: true,
        placeholder: "••••••••"
      },
      {
        id: "namespace",
        label: "Namespace",
        type: "text",
        required: false,
        placeholder: "default"
      }
    ]
  },
  {
    id: "jenkins",
    name: "Jenkins",
    type: "jenkins",
    description: "CI/CD pipeline management",
    icon: GitBranch,
    configured: false,
    configFields: [
      {
        id: "jenkinsUrl",
        label: "Jenkins URL",
        type: "url",
        required: true,
        placeholder: "https://jenkins.example.com"
      },
      {
        id: "apiKey",
        label: "API Key",
        type: "password",
        required: true,
        placeholder: "••••••••"
      }
    ]
  },
  {
    id: "github",
    name: "GitHub",
    type: "github",
    description: "GitHub repository management",
    icon: Github,
    configured: false,
    configFields: [
      {
        id: "accessToken",
        label: "Access Token",
        type: "password",
        required: true,
        placeholder: "••••••••"
      },
      {
        id: "owner",
        label: "Owner/Organization",
        type: "text",
        required: true,
        placeholder: "myorg"
      }
    ]
  },
  {
    id: "custom",
    name: "Custom Agent",
    type: "custom",
    description: "Connect to your custom service",
    icon: Database,
    configured: false,
    configFields: [
      {
        id: "name",
        label: "Agent Name",
        type: "text",
        required: true,
        placeholder: "My Custom Agent"
      },
      {
        id: "url",
        label: "Service URL",
        type: "url",
        required: true,
        placeholder: "https://api.example.com"
      },
      {
        id: "apiKey",
        label: "API Key",
        type: "password",
        required: true,
        placeholder: "••••••••"
      }
    ]
  }
];
