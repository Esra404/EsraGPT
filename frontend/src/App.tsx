import { useState, useEffect, useRef } from 'react';
import { AnimatePresence } from 'framer-motion';
import { Sidebar } from './components/layout/Sidebar';
import { Header } from './components/layout/Header';
import { MessageBubble } from './components/chat/MessageBubble';
import { ChatInput } from './components/chat/ChatInput';
import { TypingAnimation } from './components/chat/TypingAnimation';
import { WelcomeScreen } from './components/chat/WelcomeScreen';
import { ProfileDrawer } from './components/drawer/ProfileDrawer';
import { MemoryDrawer } from './components/drawer/MemoryDrawer';
import { Toast } from './components/ui/Toast';
import { useChatStore } from './store/useStore';
import { useDrawerStore } from './store/useStore';
import { useToastStore } from './store/useStore';
import { chatAPI } from './services/api';
import { Message } from './types';

function App() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const {
    messages,
    isLoading,
    currentConversationId,
    addMessage,
    setLoading,
    setConversationId,
    clearMessages,
  } = useChatStore();

  const { drawer, openDrawer, closeDrawer } = useDrawerStore();
  const { addToast } = useToastStore();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  const handleSendMessage = async (content: string) => {
    if (!content.trim()) return;

    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content,
      timestamp: new Date(),
    };
    addMessage(userMessage);
    setLoading(true);

    try {
      const response = await chatAPI.sendMessage(content, currentConversationId || undefined);
      
      // Add AI response
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: response.response || 'Bir hata oluştu',
        timestamp: new Date(),
      };
      addMessage(aiMessage);

      // Update conversation ID if provided
      if (response.conversation_id) {
        setConversationId(response.conversation_id);
      }

      addToast({
        type: 'success',
        message: 'Mesaj gönderildi',
      });
    // } catch (error) {
    //   console.error('Failed to send message:', error);
    //   addToast({
    //     type: 'error',
    //     message: 'Mesaj gönderilemedi',
    //   });
    // } 
    } catch (error: any) {
  console.error("HATA:", error);

  if (error.response) {
    console.log("Status:", error.response.status);
    console.log("Data:", error.response.data);
  }

  addToast({
    type: 'error',
    message: 'Mesaj gönderilemedi',
  });
}finally {
      setLoading(false);
    }
  };

  const handleNewChat = () => {
    clearMessages();
    addToast({
      type: 'info',
      message: 'Yeni sohbet başlatıldı',
    });
  };

  const handleSelectPrompt = (prompt: string) => {
    handleSendMessage(prompt);
  };

  const isChatEmpty = messages.length === 0;

  return (
    <div className="h-screen w-screen bg-background flex overflow-hidden">
      {/* Sidebar */}
      <Sidebar
        isOpen={isSidebarOpen}
        onToggle={() => setIsSidebarOpen(!isSidebarOpen)}
        onNewChat={handleNewChat}
        onOpenProfile={() => openDrawer('profile')}
      />

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Header */}
        <Header onMenuClick={() => setIsSidebarOpen(!isSidebarOpen)} />

        {/* Chat Area */}
        <div className="flex-1 overflow-y-auto">
          {isChatEmpty ? (
            <WelcomeScreen onSelectPrompt={handleSelectPrompt} />
          ) : (
            <div className="max-w-4xl mx-auto py-6 px-4">
              <AnimatePresence mode="popLayout">
                {messages.map((message) => (
                  <MessageBubble key={message.id} message={message} />
                ))}
                {isLoading && <TypingAnimation />}
              </AnimatePresence>
              <div ref={messagesEndRef} />
            </div>
          )}
        </div>

        {/* Chat Input */}
        <ChatInput
          onSend={handleSendMessage}
          onClear={handleNewChat}
          isLoading={isLoading}
          disabled={false}
        />
      </div>

      {/* Drawers */}
      <ProfileDrawer
        isOpen={drawer.isOpen && drawer.type === 'profile'}
        onClose={closeDrawer}
      />
      <MemoryDrawer
        isOpen={drawer.isOpen && drawer.type === 'memory'}
        onClose={closeDrawer}
      />

      {/* Toast Notifications */}
      <Toast />
    </div>
  );
}

export default App;
