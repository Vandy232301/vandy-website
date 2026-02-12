import React, { ReactNode } from 'react';
import { motion } from 'motion/react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

// Utility for merging tailwind classes
function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface BentoCardProps {
  children: ReactNode;
  className?: string;
  delay?: number;
  colSpan?: string; // e.g. "col-span-1"
  rowSpan?: string; // e.g. "row-span-1"
  href?: string;
}

export function BentoCard({ 
  children, 
  className, 
  delay = 0,
  colSpan = "col-span-1",
  rowSpan = "row-span-1",
  href
}: BentoCardProps) {
  
  const commonClasses = cn(
    "group relative overflow-hidden rounded-2xl bg-neutral-900/40 border border-neutral-800 p-5 backdrop-blur-sm",
    "hover:bg-neutral-900/80 hover:border-neutral-700 transition-colors duration-300",
    colSpan,
    rowSpan,
    className,
    href ? "cursor-pointer block" : ""
  );

  const content = (
    <>
      {/* Subtle white glow effect on hover instead of violet */}
      <div className="absolute -inset-px opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none z-0">
        <div className="absolute inset-0 bg-gradient-to-br from-white/5 via-transparent to-transparent blur-xl" />
      </div>
      
      {/* Content */}
      <div className="relative z-10 h-full flex flex-col">
        {children}
      </div>
    </>
  );

  if (href) {
    return (
      <motion.a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: delay }}
        className={commonClasses}
      >
        {content}
      </motion.a>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: delay }}
      className={commonClasses}
    >
      {content}
    </motion.div>
  );
}
