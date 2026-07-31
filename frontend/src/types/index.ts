export interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

export interface ChatRequest {
  message: string;
  conversation_id?: string;
}

export interface ChatResponse {
  response: string;
  conversation_id?: string;
}

export interface UserProfile {
  name: string;
  city: string;
  university: string;
  department: string;
  interests: string[];
  technical_skills: string[];
  projects: string[];
  goals: string[];
}

export interface Memory {
  id: string;
  content: string;
  category: string;
  created_at: string;
}

export interface Conversation {
  id: string;
  title: string;
  created_at: string;
  updated_at: string;
}

export interface Toast {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  message: string;
  duration?: number;
}

export interface DrawerState {
  isOpen: boolean;
  type: 'profile' | 'memory' | null;
}
