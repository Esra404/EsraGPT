import { motion } from 'framer-motion';
import { Bot, Sparkles, Code, FileText, Target } from 'lucide-react';
import { Card } from '../ui/Card';

interface WelcomeScreenProps {
  onSelectPrompt: (prompt: string) => void;
}

const examplePrompts = [
  {
    icon: Code,
    title: 'Python öğrenmeme yardım et',
    description: 'Python programlama dilini adım adım öğren',
  },
  {
    icon: FileText,
    title: 'CV hazırlayalım',
    description: 'Profesyonel bir CV oluşturmaya başla',
  },
  {
    icon: Sparkles,
    title: 'Kodumu incele',
    description: 'Kodunu analiz et ve iyileştirme önerileri sun',
  },
  {
    icon: Target,
    title: 'Bugünkü hedeflerimi planla',
    description: 'Günlük hedeflerini organize et',
  },
];

export function WelcomeScreen({ onSelectPrompt }: WelcomeScreenProps) {
  return (
    <div className="flex-1 flex items-center justify-center p-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-2xl w-full text-center"
      >
        {/* Logo */}
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
          className="w-24 h-24 mx-auto mb-8 rounded-3xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center shadow-2xl shadow-primary/30"
        >
          <Bot className="w-14 h-14 text-white" />
        </motion.div>

        {/* Title */}
        <motion.h1
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="text-4xl font-bold text-text mb-3"
        >
          EsraGPT
        </motion.h1>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="text-xl text-text-secondary mb-12"
        >
          Bugün sana nasıl yardımcı olabilirim?
        </motion.p>

        {/* Example Prompts */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="grid grid-cols-1 sm:grid-cols-2 gap-4"
        >
          {examplePrompts.map((prompt, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 + index * 0.1 }}
            >
              <Card
                hover
                onClick={() => onSelectPrompt(prompt.title)}
                className="text-left h-full"
              >
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl bg-card-hover flex items-center justify-center flex-shrink-0">
                    <prompt.icon className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-text mb-1">
                      {prompt.title}
                    </h3>
                    <p className="text-sm text-text-secondary">
                      {prompt.description}
                    </p>
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      </motion.div>
    </div>
  );
}
