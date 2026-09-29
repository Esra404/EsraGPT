import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Search, Plus, Trash2 } from 'lucide-react';
import { useMemoryStore } from '../../store/useStore';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { cn } from '../../utils/cn';

interface MemoryDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export function MemoryDrawer({ isOpen, onClose }: MemoryDrawerProps) {
  const { memories, isLoading, fetchMemories, addMemory, deleteMemory } = useMemoryStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [isAdding, setIsAdding] = useState(false);
  const [newMemory, setNewMemory] = useState('');

  useEffect(() => {
    if (isOpen) {
      fetchMemories();
    }
  }, [isOpen, fetchMemories]);

  const filteredMemories = memories.filter((memory) =>
    memory.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
    memory.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleAddMemory = async () => {
    if (newMemory.trim()) {
      await addMemory(newMemory.trim(), 'general');
      setNewMemory('');
      setIsAdding(false);
    }
  };

  const handleDeleteMemory = async (id: string) => {
    await deleteMemory(id);
  };

  const getCategoryColor = (category: string) => {
    const colors: Record<string, string> = {
      general: 'bg-primary/20 text-primary',
      work: 'bg-secondary/20 text-secondary',
      personal: 'bg-success/20 text-success',
      learning: 'bg-warning/20 text-warning',
    };
    return colors[category] || colors.general;
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/50 z-40 backdrop-blur-sm"
          />
          
          {/* Drawer */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed right-0 top-0 h-full w-full max-w-md bg-background border-l border-card-hover/50 z-50 shadow-2xl overflow-y-auto"
          >
            <div className="p-6">
              {/* Header */}
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-text">Hafıza</h2>
                <button
                  onClick={onClose}
                  className="p-2 hover:bg-card-hover rounded-lg transition-colors"
                >
                  <X className="w-6 h-6 text-text-secondary" />
                </button>
              </div>

              {/* Search */}
              <div className="relative mb-4">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-text-secondary" />
                <input
                  type="text"
                  placeholder="Hafızada ara..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-card rounded-xl border border-card-hover/50 text-text placeholder:text-text-secondary focus:outline-none focus:border-primary"
                />
              </div>

              {/* Add Memory Button */}
              {!isAdding && (
                <Button
                  variant="primary"
                  onClick={() => setIsAdding(true)}
                  className="w-full mb-4"
                >
                  <Plus className="w-5 h-5" />
                  Yeni Hafıza Ekle
                </Button>
              )}

              {/* Add Memory Form */}
              {isAdding && (
                <Card className="mb-4">
                  <textarea
                    value={newMemory}
                    onChange={(e) => setNewMemory(e.target.value)}
                    placeholder="Hafıza notunu yazın..."
                    className="w-full bg-transparent resize-none outline-none text-text placeholder:text-text-secondary min-h-[100px]"
                    rows={4}
                  />
                  <div className="flex gap-2 mt-3">
                    <Button variant="primary" onClick={handleAddMemory} size="sm">
                      Kaydet
                    </Button>
                    <Button
                      variant="ghost"
                      onClick={() => {
                        setIsAdding(false);
                        setNewMemory('');
                      }}
                      size="sm"
                    >
                      İptal
                    </Button>
                  </div>
                </Card>
              )}

              {/* Memories List */}
              {isLoading ? (
                <div className="flex items-center justify-center h-64">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
                </div>
              ) : filteredMemories.length > 0 ? (
                <div className="space-y-3">
                  {filteredMemories.map((memory) => (
                    <Card key={memory.id} hover className="relative group">
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex-1">
                          <span
                            className={cn(
                              'inline-block px-2 py-1 rounded-md text-xs font-medium mb-2',
                              getCategoryColor(memory.category)
                            )}
                          >
                            {memory.category}
                          </span>
                          <p className="text-text text-sm leading-relaxed">
                            {memory.content}
                          </p>
                          <p className="text-text-secondary text-xs mt-2">
                            {new Date(memory.created_at).toLocaleDateString('tr-TR')}
                          </p>
                        </div>
                        <button
                          onClick={() => handleDeleteMemory(memory.id)}
                          className="opacity-0 group-hover:opacity-100 transition-opacity p-1 hover:bg-card-hover rounded"
                        >
                          <Trash2 className="w-4 h-4 text-danger" />
                        </button>
                      </div>
                    </Card>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <p className="text-text-secondary">
                    {searchQuery ? 'Sonuç bulunamadı' : 'Henüz hafıza notu yok'}
                  </p>
                </div>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
