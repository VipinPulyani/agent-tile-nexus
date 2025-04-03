
# Agent Hub Backend

This directory contains the FastAPI backend for the Agent Hub application.

## Features

- User authentication using JWT
- Chat functionality with multiple agent types (LangChain, LangGraph, etc.)
- User activity tracking with MongoDB
- Docker and Kubernetes deployment configurations

## Local Development

### Prerequisites

- Python 3.9+
- MongoDB
- Docker and Docker Compose (optional)

### Setup

1. Create a virtual environment:
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```

2. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```

3. Set up environment variables by creating a `.env` file:
   ```
   MONGODB_URL=mongodb://localhost:27017
   SECRET_KEY=your-secret-key
   ```

4. Run the FastAPI server:
   ```bash
   uvicorn app:app --reload
   ```

5. Access the API documentation at `http://localhost:8000/docs`

## Docker Deployment

To run the entire application using Docker Compose:

```bash
docker-compose up -d
```

This will start:
- Frontend on http://localhost:3000
- Backend API on http://localhost:8000
- MongoDB on port 27017

## Kubernetes Deployment

The application can be deployed to Kubernetes using the provided Helm chart:

```bash
# Add secret for JWT
kubectl create secret generic agent-hub-secrets --from-literal=secret-key=your-secret-key

# Install the Helm chart
helm install agent-hub ./helm/agent-hub
```

## API Endpoints

### Authentication
- `POST /token` - Get JWT token

### User
- `GET /users/me` - Get current user info
- `GET /api/user/activity` - Get user activity history

### Chat
- `POST /api/chat` - Send message to agent
- `GET /api/chat/history` - Get chat history

### Agents
- `GET /api/agents` - Get available agents

## Integrating New Agents

To add a new agent type:

1. Add the agent to the list in the `/api/agents` endpoint
2. Create a handler in the `/api/chat` endpoint for the new agent type
3. Implement the agent-specific logic

## Testing

Run tests with pytest:

```bash
pytest
```

## Monitoring and Logging

The application uses structured logging that can be integrated with monitoring solutions like Prometheus, Grafana, or ELK stack.
