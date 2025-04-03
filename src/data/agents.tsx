
import { AgentType } from "@/types/agent";

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
