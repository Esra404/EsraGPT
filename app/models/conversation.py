from pydantic import BaseModel, Field


class ChatMessage(BaseModel):
    role: str
    content: str


class ConversationEntry(BaseModel):
    user_message: str
    assistant_message: str
    timestamp: str


class ChatRequest(BaseModel):
    message: str
    history: list[ChatMessage] = Field(default_factory=list)
