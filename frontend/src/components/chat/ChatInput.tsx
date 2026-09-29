import { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Send, Trash2, Loader2 } from 'lucide-react';
import { Button } from '../ui/Button';
import { cn } from '../../utils/cn';

interface ChatInputProps {
  onSend: (message: string) => void;
  onClear: () => void;
  isLoading: boolean;
  disabled: boolean;
}

export function ChatInput({ onSend, onClear, isLoading, disabled }: ChatInputProps) {
  const [message, setMessage] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 200)}px`;
    }
  }, [message]);

  const handleSend = () => {
    if (message.trim() && !isLoading && !disabled) {
      onSend(message.trim());
      setMessage('');
      if (textareaRef.current) {
        textareaRef.current.style.height = 'auto';
      }
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <motion.div
      initial={{ y: 20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="border-t border-card-hover/50 bg-background/80 backdrop-blur-lg p-4"
    >
      <div className="max-w-4xl mx-auto">
        <div className="flex items-end gap-3 bg-card rounded-2xl p-2 shadow-xl border border-card-hover/50">
          <Button
            variant="ghost"
            size="sm"
            onClick={onClear}
            disabled={isLoading}
            className="flex-shrink-0"
          >
            <Trash2 className="w-5 h-5" />
          </Button>
          <textarea
            ref={textareaRef}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Mesajınızı yazın... (Shift+Enter for new line)"
            disabled={disabled || isLoading}
            className={cn(
              'flex-1 bg-transparent resize-none outline-none text-text placeholder:text-text-secondary',
              'min-h-[44px] max-h-[200px] py-3 px-2',
              'disabled:opacity-50 disabled:cursor-not-allowed'
            )}
            rows={1}
          />
          <Button
            variant="primary"
            size="md"
            onClick={handleSend}
            disabled={!message.trim() || isLoading || disabled}
            className="flex-shrink-0"
          >
            {isLoading ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <Send className="w-5 h-5" />
            )}
          </Button>
        </div>
        <p className="text-center text-xs text-text-secondary mt-2">
          Enter ile gönder, Shift+Enter ile yeni satır
        </p>
      </div>
    </motion.div>
  );
}
