import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Bot, Wifi, Clock } from 'lucide-react';

interface HeaderProps {
  onMenuClick: () => void;
}

export function Header({ onMenuClick }: HeaderProps) {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('tr-TR', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <motion.header
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="h-16 border-b border-card-hover/50 bg-background/80 backdrop-blur-lg sticky top-0 z-30"
    >
      <div className="h-full px-4 lg:px-6 flex items-center justify-between">
        {/* Left */}
        <div className="flex items-center gap-4">
          <button
            onClick={onMenuClick}
            className="lg:hidden p-2 hover:bg-card-hover rounded-lg transition-colors"
          >
            <svg
              className="w-6 h-6 text-text"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          </button>
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-secondary flex items-center justify-center shadow-lg shadow-primary/25">
              <Bot className="w-5 h-5 text-white" />
            </div>
            <div className="hidden sm:block">
              <h1 className="text-lg font-bold text-text">EsraGPT</h1>
            </div>
          </div>
        </div>

        {/* Center */}
        <div className="hidden md:flex items-center gap-2 px-4 py-2 bg-card rounded-xl">
          <span className="text-sm text-text-secondary">Model:</span>
          <span className="text-sm font-medium text-text">meta/llama</span>
        </div>

        {/* Right */}
        <div className="flex items-center gap-4">
          <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 bg-success/10 rounded-lg">
            <Wifi className="w-4 h-4 text-success" />
            <span className="text-sm font-medium text-success">Online</span>
          </div>
          <div className="hidden sm:flex items-center gap-2 text-text-secondary">
            <Clock className="w-4 h-4" />
            <span className="text-sm font-medium">{formatTime(time)}</span>
          </div>
        </div>
      </div>
    </motion.header>
  );
}
