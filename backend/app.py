
from fastapi import FastAPI, HTTPException, Depends, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from pydantic import BaseModel
from typing import List, Optional, Dict, Any
import uuid
from datetime import datetime, timedelta
import os
import logging
import json
from motor.motor_asyncio import AsyncIOMotorClient
import jwt
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Setup logging
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s - %(name)s - %(levelname)s - %(message)s",
)
logger = logging.getLogger(__name__)

# Initialize FastAPI app
app = FastAPI(
    title="Agent Hub API",
    description="FastAPI backend for the Agent Hub application",
    version="1.0.0",
)

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, replace with specific origins
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# MongoDB connection
MONGODB_URL = os.getenv("MONGODB_URL", "mongodb://localhost:27017")
client = AsyncIOMotorClient(MONGODB_URL)
db = client.agent_hub

# JWT configuration
SECRET_KEY = os.getenv("SECRET_KEY", "your-secret-key")
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 30

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")

# Models
class Token(BaseModel):
    access_token: str
    token_type: str

class TokenData(BaseModel):
    username: Optional[str] = None

class User(BaseModel):
    id: str
    username: str
    email: str
    full_name: Optional[str] = None
    disabled: Optional[bool] = None

class UserInDB(User):
    hashed_password: str

class UserCreate(BaseModel):
    username: str
    email: str
    password: str
    full_name: Optional[str] = None

class UserActivity(BaseModel):
    id: str
    user_id: str
    activity_type: str
    timestamp: datetime
    details: Dict[str, Any] = {}

class ChatMessage(BaseModel):
    message: str
    agent_id: str

class ChatResponse(BaseModel):
    id: str
    response: str
    timestamp: datetime

# Authentication functions
def verify_password(plain_password, hashed_password):
    # In a real app, use proper password hashing (e.g., bcrypt)
    return plain_password == hashed_password  # Simplified for demo

def get_user(username: str):
    # In a real app, fetch from database
    # This is a simplified demo
    if username == "testuser":
        return UserInDB(
            id="user1",
            username="testuser",
            email="test@example.com",
            full_name="Test User",
            hashed_password="password"  # In a real app, use hashed passwords
        )

def authenticate_user(username: str, password: str):
    user = get_user(username)
    if not user:
        return False
    if not verify_password(password, user.hashed_password):
        return False
    return user

def create_access_token(data: dict, expires_delta: Optional[timedelta] = None):
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(minutes=15)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt

async def get_current_user(token: str = Depends(oauth2_scheme)):
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        username: str = payload.get("sub")
        if username is None:
            raise credentials_exception
        token_data = TokenData(username=username)
    except jwt.PyJWTError:
        raise credentials_exception
    user = get_user(token_data.username)
    if user is None:
        raise credentials_exception
    return user

async def get_current_active_user(current_user: User = Depends(get_current_user)):
    if current_user.disabled:
        raise HTTPException(status_code=400, detail="Inactive user")
    return current_user

# Routes
@app.post("/token", response_model=Token)
async def login_for_access_token(form_data: OAuth2PasswordRequestForm = Depends()):
    user = authenticate_user(form_data.username, form_data.password)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": user.username}, expires_delta=access_token_expires
    )
    
    # Log user login activity
    activity = {
        "id": str(uuid.uuid4()),
        "user_id": user.id,
        "activity_type": "login",
        "timestamp": datetime.utcnow(),
        "details": {
            "ip_address": "127.0.0.1",  # In a real app, get from request
            "user_agent": "demo"  # In a real app, get from request
        }
    }
    await db.user_activities.insert_one(activity)
    
    return {"access_token": access_token, "token_type": "bearer"}

@app.get("/users/me", response_model=User)
async def read_users_me(current_user: User = Depends(get_current_active_user)):
    return current_user

@app.post("/api/chat", response_model=ChatResponse)
async def chat_with_agent(
    chat_message: ChatMessage,
    current_user: User = Depends(get_current_active_user)
):
    logger.info(f"Received message: {chat_message.message} for agent: {chat_message.agent_id}")
    
    # Log user chat activity
    activity = {
        "id": str(uuid.uuid4()),
        "user_id": current_user.id,
        "activity_type": "chat_message",
        "timestamp": datetime.utcnow(),
        "details": {
            "agent_id": chat_message.agent_id,
            "message": chat_message.message
        }
    }
    await db.user_activities.insert_one(activity)
    
    # Route to specific agent handler based on agent_id
    response = "This is a placeholder response from the FastAPI backend."
    
    if chat_message.agent_id == "langchain":
        # Call LangChain agent handler
        response = "Response from LangChain agent: I'm here to help with your tasks."
    elif chat_message.agent_id == "langgraph":
        # Call LangGraph agent handler
        response = "Response from LangGraph agent: I can help you visualize and analyze data."
    elif chat_message.agent_id == "airflow":
        # Call Airflow agent handler
        response = "Response from Airflow agent: I can help manage your workflows."
    elif chat_message.agent_id == "kubernetes":
        # Call Kubernetes agent handler
        response = "Response from Kubernetes agent: I can help with container orchestration."
    
    # Log agent response
    chat_response = {
        "id": str(uuid.uuid4()),
        "user_id": current_user.id,
        "agent_id": chat_message.agent_id,
        "message": chat_message.message,
        "response": response,
        "timestamp": datetime.utcnow()
    }
    await db.chat_history.insert_one(chat_response)
    
    return {
        "id": chat_response["id"],
        "response": response,
        "timestamp": chat_response["timestamp"]
    }

@app.get("/api/user/activity", response_model=List[UserActivity])
async def get_user_activities(
    current_user: User = Depends(get_current_active_user),
    limit: int = 50
):
    activities = await db.user_activities.find(
        {"user_id": current_user.id}
    ).sort("timestamp", -1).limit(limit).to_list(length=limit)
    
    return activities

@app.get("/api/chat/history", response_model=List[Dict[str, Any]])
async def get_chat_history(
    current_user: User = Depends(get_current_active_user),
    agent_id: Optional[str] = None,
    limit: int = 50
):
    query = {"user_id": current_user.id}
    if agent_id:
        query["agent_id"] = agent_id
        
    history = await db.chat_history.find(query).sort(
        "timestamp", -1
    ).limit(limit).to_list(length=limit)
    
    return history

@app.get("/api/agents", response_model=List[Dict[str, Any]])
async def get_available_agents(
    current_user: User = Depends(get_current_active_user)
):
    # In a real app, fetch from database or dynamic service discovery
    agents = [
        {
            "id": "langchain",
            "name": "LangChain Assistant",
            "description": "Helps with document processing and chaining LLM tasks",
            "type": "langchain",
            "status": "active"
        },
        {
            "id": "langgraph",
            "name": "LangGraph Analyzer",
            "description": "Visualizes and analyzes language processing workflows",
            "type": "langgraph",
            "status": "active"
        },
        {
            "id": "airflow",
            "name": "Airflow Manager",
            "description": "Manages and monitors data workflows",
            "type": "airflow",
            "status": "active"
        },
        {
            "id": "kubernetes",
            "name": "Kubernetes Helper",
            "description": "Assists with Kubernetes operations",
            "type": "kubernetes",
            "status": "active"
        }
    ]
    
    return agents

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("app:app", host="0.0.0.0", port=8000, reload=True)
