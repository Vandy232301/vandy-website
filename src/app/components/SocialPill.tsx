import React from 'react';
import { motion } from 'motion/react';
import { LucideIcon } from 'lucide-react';

interface SocialPillProps {
  icon: LucideIcon;
  label: string;
  href: string;
  color?: string; // Optional hover color
}

export function SocialPill({ icon: Icon, label, href }: SocialPillProps) {
  return (
    <motion.a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      // Updated to minimal grey/white theme
      className={`flex items-center gap-2 px-3 py-1.5 rounded-full bg-neutral-800/50 border border-neutral-700 text-xs font-medium text-neutral-300 transition-colors hover:bg-white hover:text-black hover:border-white`}
    >
      <Icon size={14} />
      <span>{label}</span>
    </motion.a>
  );
}
