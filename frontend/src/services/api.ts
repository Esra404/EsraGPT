import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Chat API
export const chatAPI = {
  sendMessage: async (message: string, conversationId?: string) => {
    const response = await api.post('/api/chat', {
      message,
      conversation_id: conversationId,
    });
    return response.data;
  },
};

// Profile API
export const profileAPI = {
  getProfile: async () => {
    const response = await api.get('/api/profile');
    return response.data;
  },
  updateProfile: async (profileData: any) => {
    const response = await api.put('/api/profile', profileData);
    return response.data;
  },
};

// Memory API
export const memoryAPI = {
  getMemories: async () => {
    const response = await api.get('/api/memory');
    return response.data;
  },
  addMemory: async (content: string, category: string = 'general') => {
    const response = await api.post('/api/memory', { content, category });
    return response.data;
  },
  updateMemory: async (memoryId: string, payload: any) => {
    const response = await api.put(`/api/memory/${memoryId}`, payload);
    return response.data;
  },
  deleteMemory: async (memoryId: string) => {
    const response = await api.delete(`/api/memory/${memoryId}`);
    return response.data;
  },
  searchMemories: async (query: string) => {
    const response = await api.get('/api/memory/search', { params: { q: query } });
    return response.data;
  },
};

// Conversations API
export const conversationsAPI = {
  getConversations: async () => {
    const response = await api.get('/api/conversations');
    return response.data;
  },
};

// Health check
export const healthAPI = {
  check: async () => {
    const response = await api.get('/health');
    return response.data;
  },
};

export default api;
