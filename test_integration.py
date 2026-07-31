#!/usr/bin/env python
"""Quick integration test"""
from app.services.gemini_service import GeminiService
from app.services.chat_service import ChatService
from app.models.conversation import ChatRequest, ChatMessage

print("=== Testing GeminiService ===")
gs = GeminiService()
print(f"API Key set: {bool(gs.api_key)}")
print(f"Model: {gs.model}")
print(f"Client: {gs.client}")

response = gs.generate_response("Test prompt")
print(f"Response: {response[:100]}")
print()

print("=== Testing ChatService ===")
try:
    cs = ChatService()
    print("ChatService initialized")
    
    req = ChatRequest(message="Merhaba", history=[])
    print(f"Processing message: {req.message}")
    result = cs.handle_message(req)
    print(f"Response: {result['response'][:100]}")
except Exception as e:
    print(f"Error: {type(e).__name__}: {e}")
