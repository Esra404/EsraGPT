import { create } from 'zustand';
import { Message, UserProfile, Memory, Conversation, Toast, DrawerState } from '../types';

interface ChatStore {
  messages: Message[];
  isLoading: boolean;
  currentConversationId: string | null;
  addMessage: (message: Message) => void;
  setLoading: (loading: boolean) => void;
  setConversationId: (id: string | null) => void;
  clearMessages: () => void;
}

interface ProfileStore {
  profile: UserProfile | null;
  isLoading: boolean;
  fetchProfile: () => Promise<void>;
  updateProfile: (data: Partial<UserProfile>) => Promise<void>;
}

interface MemoryStore {
  memories: Memory[];
  isLoading: boolean;
  fetchMemories: () => Promise<void>;
  addMemory: (content: string, category?: string) => Promise<void>;
  updateMemory: (id: string, data: Partial<Memory>) => Promise<void>;
  deleteMemory: (id: string) => Promise<void>;
  searchMemories: (query: string) => Promise<Memory[]>;
}

interface ConversationStore {
  conversations: Conversation[];
  isLoading: boolean;
  fetchConversations: () => Promise<void>;
}

interface DrawerStore {
  drawer: DrawerState;
  openDrawer: (type: 'profile' | 'memory') => void;
  closeDrawer: () => void;
}

interface ToastStore {
  toasts: Toast[];
  addToast: (toast: Omit<Toast, 'id'>) => void;
  removeToast: (id: string) => void;
}

export const useChatStore = create<ChatStore>((set) => ({
  messages: [],
  isLoading: false,
  currentConversationId: null,
  addMessage: (message) => set((state) => ({ messages: [...state.messages, message] })),
  setLoading: (loading) => set({ isLoading: loading }),
  setConversationId: (id) => set({ currentConversationId: id }),
  clearMessages: () => set({ messages: [], currentConversationId: null }),
}));

export const useProfileStore = create<ProfileStore>((set) => ({
  profile: null,
  isLoading: false,
  fetchProfile: async () => {
    set({ isLoading: true });
    try {
      const { profileAPI } = await import('../services/api');
      const profile = await profileAPI.getProfile();
      set({ profile, isLoading: false });
    } catch (error) {
      console.error('Failed to fetch profile:', error);
      set({ isLoading: false });
    }
  },
  updateProfile: async (data) => {
    set({ isLoading: true });
    try {
      const { profileAPI } = await import('../services/api');
      const updatedProfile = await profileAPI.updateProfile(data);
      set({ profile: updatedProfile, isLoading: false });
    } catch (error) {
      console.error('Failed to update profile:', error);
      set({ isLoading: false });
    }
  },
}));

export const useMemoryStore = create<MemoryStore>((set) => ({
  memories: [],
  isLoading: false,
  fetchMemories: async () => {
    set({ isLoading: true });
    try {
      const { memoryAPI } = await import('../services/api');
      const memories = await memoryAPI.getMemories();
      set({ memories, isLoading: false });
    } catch (error) {
      console.error('Failed to fetch memories:', error);
      set({ isLoading: false });
    }
  },
  addMemory: async (content, category = 'general') => {
    try {
      const { memoryAPI } = await import('../services/api');
      const newMemory = await memoryAPI.addMemory(content, category);
      set((state) => ({ memories: [...state.memories, newMemory] }));
    } catch (error) {
      console.error('Failed to add memory:', error);
    }
  },
  updateMemory: async (id, data) => {
    try {
      const { memoryAPI } = await import('../services/api');
      await memoryAPI.updateMemory(id, data);
      set((state) => ({
        memories: state.memories.map((mem) =>
          mem.id === id ? { ...mem, ...data } : mem
        ),
      }));
    } catch (error) {
      console.error('Failed to update memory:', error);
    }
  },
  deleteMemory: async (id) => {
    try {
      const { memoryAPI } = await import('../services/api');
      await memoryAPI.deleteMemory(id);
      set((state) => ({
        memories: state.memories.filter((mem) => mem.id !== id),
      }));
    } catch (error) {
      console.error('Failed to delete memory:', error);
    }
  },
  searchMemories: async (query) => {
    try {
      const { memoryAPI } = await import('../services/api');
      const results = await memoryAPI.searchMemories(query);
      return results;
    } catch (error) {
      console.error('Failed to search memories:', error);
      return [];
    }
  },
}));

export const useConversationStore = create<ConversationStore>((set) => ({
  conversations: [],
  isLoading: false,
  fetchConversations: async () => {
    set({ isLoading: true });
    try {
      const { conversationsAPI } = await import('../services/api');
      const conversations = await conversationsAPI.getConversations();
      set({ conversations, isLoading: false });
    } catch (error) {
      console.error('Failed to fetch conversations:', error);
      set({ isLoading: false });
    }
  },
}));

export const useDrawerStore = create<DrawerStore>((set) => ({
  drawer: { isOpen: false, type: null },
  openDrawer: (type) => set({ drawer: { isOpen: true, type } }),
  closeDrawer: () => set({ drawer: { isOpen: false, type: null } }),
}));

export const useToastStore = create<ToastStore>((set) => ({
  toasts: [],
  addToast: (toast) => {
    const id = Date.now().toString();
    set((state) => ({
      toasts: [...state.toasts, { ...toast, id }],
    }));
    setTimeout(() => {
      set((state) => ({
        toasts: state.toasts.filter((t) => t.id !== id),
      }));
    }, toast.duration || 3000);
  },
  removeToast: (id) =>
    set((state) => ({
      toasts: state.toasts.filter((t) => t.id !== id),
    })),
}));
