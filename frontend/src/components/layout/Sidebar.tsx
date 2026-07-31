import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  MessageSquarePlus,
  History,
  User,
  Settings,
  Info,
  Moon,
  Sun,
  X,
  Bot,
} from 'lucide-react';
import { cn } from '../../utils/cn';

interface SidebarProps {
  isOpen: boolean;
  onToggle: () => void;
  onNewChat: () => void;
  onOpenProfile: () => void;
}

export function Sidebar({
  isOpen,
  onToggle,
  onNewChat,
  onOpenProfile,
}: SidebarProps) {
  const [isDark, setIsDark] = useState(true);

  const menuItems = [
    { icon: MessageSquarePlus, label: 'Yeni Sohbet', onClick: onNewChat },
    { icon: History, label: 'Geçmiş', onClick: () => {} },
    { icon: User, label: 'Profil', onClick: onOpenProfile },
    { icon: Settings, label: 'Ayarlar', onClick: () => {} },
    { icon: Info, label: 'Hakkında', onClick: () => {} },
  ];

  return (
    <>
      {/* Mobile Overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onToggle}
            className="fixed inset-0 bg-black/50 z-40 lg:hidden backdrop-blur-sm"
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <motion.aside
        initial={false}
        animate={{
          x: isOpen ? 0 : -320,
        }}
        transition={{ type: 'spring', damping: 25, stiffness: 200 }}
        className={cn(
          'fixed left-0 top-0 h-full w-80 bg-background border-r border-card-hover/50 z-50',
          'flex flex-col shadow-2xl',
          'lg:relative lg:translate-x-0 lg:shadow-none'
        )}
      >
        {/* Header */}
        <div className="p-6 border-b border-card-hover/50">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center shadow-lg shadow-primary/25">
                <Bot className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-text">EsraGPT</h1>
                <p className="text-xs text-text-secondary">AI Asistan</p>
              </div>
            </div>
            <button
              onClick={onToggle}
              className="lg:hidden p-2 hover:bg-card-hover rounded-lg transition-colors"
            >
              <X className="w-5 h-5 text-text-secondary" />
            </button>
          </div>
        </div>

        {/* New Chat Button */}
        <div className="p-4">
          <button
            onClick={() => {
              onNewChat();
              if (window.innerWidth < 1024) onToggle();
            }}
            className="w-full flex items-center gap-3 px-4 py-3 bg-gradient-to-r from-primary to-secondary rounded-xl text-white font-medium shadow-lg shadow-primary/25 hover:shadow-xl hover:shadow-primary/30 transition-all duration-200"
          >
            <MessageSquarePlus className="w-5 h-5" />
            Yeni Sohbet
          </button>
        </div>

        {/* Menu Items */}
        <nav className="flex-1 px-4 py-2 space-y-1 overflow-y-auto">
          {menuItems.map((item) => (
            <button
              key={item.label}
              onClick={() => {
                item.onClick();
                if (window.innerWidth < 1024) onToggle();
              }}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-text-secondary hover:bg-card-hover hover:text-text transition-all duration-200 group"
            >
              <item.icon className="w-5 h-5 group-hover:scale-110 transition-transform" />
              <span className="font-medium">{item.label}</span>
            </button>
          ))}
        </nav>

        {/* Theme Toggle */}
        <div className="p-4 border-t border-card-hover/50">
          <button
            onClick={() => setIsDark(!isDark)}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-text-secondary hover:bg-card-hover transition-all duration-200"
          >
            {isDark ? (
              <Moon className="w-5 h-5" />
            ) : (
              <Sun className="w-5 h-5" />
            )}
            <span className="font-medium">
              {isDark ? 'Koyu Tema' : 'Açık Tema'}
            </span>
          </button>
        </div>

        {/* User Card */}
        <div className="p-4 border-t border-card-hover/50">
          <div className="flex items-center gap-3 p-3 bg-card rounded-xl">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-secondary to-primary flex items-center justify-center">
              <User className="w-5 h-5 text-white" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-text truncate">Kullanıcı</p>
              <p className="text-xs text-text-secondary">Online</p>
            </div>
          </div>
        </div>
      </motion.aside>
    </>
  );
}
