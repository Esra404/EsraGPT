import { motion } from 'framer-motion';
import { User, Bot } from 'lucide-react';
import { cn } from '../../utils/cn';
import { Message } from '../../types';
import { Markdown } from '../ui/Markdown';

interface MessageBubbleProps {
  message: Message;
}

export function MessageBubble({ message }: MessageBubbleProps) {
  const isUser = message.role === 'user';

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={cn(
        'flex gap-4 p-4',
        isUser ? 'flex-row-reverse' : 'flex-row'
      )}
    >
      {/* Avatar */}
      <div
        className={cn(
          'w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 shadow-lg',
          isUser
            ? 'bg-gradient-to-br from-secondary to-primary'
            : 'bg-gradient-to-br from-primary to-secondary'
        )}
      >
        {isUser ? (
          <User className="w-5 h-5 text-white" />
        ) : (
          <Bot className="w-5 h-5 text-white" />
        )}
      </div>

      {/* Message Content */}
      <div
        className={cn(
          'flex-1 max-w-2xl',
          isUser ? 'text-right' : 'text-left'
        )}
      >
        <div
          className={cn(
            'inline-block px-5 py-4 rounded-2xl shadow-xl',
            isUser
              ? 'bg-gradient-to-br from-secondary to-primary text-white rounded-tr-sm'
              : 'bg-card text-text rounded-tl-sm'
          )}
        >
          {isUser ? (
            <p className="text-base leading-relaxed whitespace-pre-wrap">
              {message.content}
            </p>
          ) : (
            <Markdown content={message.content} />
          )}
        </div>
        <p className="mt-2 text-xs text-text-secondary">
          {new Date(message.timestamp).toLocaleTimeString('tr-TR', {
            hour: '2-digit',
            minute: '2-digit',
          })}
        </p>
      </div>
    </motion.div>
  );
}
