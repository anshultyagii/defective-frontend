import React, { ElementType } from 'react';
import { motion, HTMLMotionProps } from 'framer-motion';
import { cn } from '#/lib/utils';

export interface GlassCardProps extends Omit<HTMLMotionProps<"div">, "as"> {
  className?: string;
  glowColor?: string;
  hoverable?: boolean;
  as?: ElementType;
  children: React.ReactNode;
}

export const GlassCard: React.FC<GlassCardProps> = ({
  className,
  glowColor = 'rgba(34, 211, 238, 0.2)',
  hoverable = true,
  as = 'div',
  children,
  ...props
}) => {
  const Component = motion.create ? motion.create(as as any) : (motion as any)[as as string] || motion.div;

  return (
    <Component
      className={cn(
        "backdrop-blur-xl bg-white/5 border border-white/10 rounded-xl transition-colors duration-300 relative",
        className
      )}
      whileHover={hoverable ? { 
        scale: 1.01, 
        y: -2,
        boxShadow: `0 10px 40px -10px ${glowColor}`,
        borderColor: 'rgba(255,255,255,0.2)'
      } : {}}
      transition={{ type: "spring", stiffness: 400, damping: 25 }}
      {...props}
    >
      {children}
    </Component>
  );
};
