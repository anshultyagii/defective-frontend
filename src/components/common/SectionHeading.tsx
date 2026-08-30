import React from 'react';
import { cn } from '#/lib/utils';

export interface SectionHeadingProps {
  title: string;
  subtitle?: string;
  icon?: React.ReactNode;
  className?: string;
}

export const SectionHeading: React.FC<SectionHeadingProps> = ({
  title,
  subtitle,
  icon,
  className
}) => {
  return (
    <div className={cn("flex flex-col gap-1", className)}>
      <div className="flex items-center gap-3">
        {icon && (
          <div className="text-cyan-400">
            {icon}
          </div>
        )}
        <h2 className="text-lg md:text-xl font-bold uppercase tracking-widest text-transparent bg-clip-text bg-gradient-to-r from-white to-white/60 drop-shadow-[0_0_15px_rgba(255,255,255,0.3)]">
          {title}
        </h2>
      </div>
      {subtitle && (
        <p className="text-sm text-slate-400 ml-1 font-medium">
          {subtitle}
        </p>
      )}
    </div>
  );
};
