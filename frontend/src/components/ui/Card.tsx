import { motion } from 'framer-motion';
import { cn } from '../../utils/cn';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
  onClick?: () => void;
}

export function Card({ children, className, hover = false, onClick }: CardProps) {
  const Component = onClick ? motion.button : motion.div;
  const motionProps = onClick
    ? {
        whileHover: { scale: 1.02 },
        whileTap: { scale: 0.98 },
        onClick,
      }
    : {};

  return (
    <Component
      {...motionProps}
      className={cn(
        'bg-card backdrop-blur-sm border border-card-hover/50 rounded-2xl p-6 shadow-xl',
        hover && 'hover:bg-card-hover transition-colors duration-200 cursor-pointer',
        className
      )}
    >
      {children}
    </Component>
  );
}
