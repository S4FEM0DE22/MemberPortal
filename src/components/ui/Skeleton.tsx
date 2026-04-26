import React from 'react';
import { motion, HTMLMotionProps } from 'motion/react';
import { cn } from '../../lib/utils';

interface SkeletonProps extends HTMLMotionProps<"div"> {
  variant?: 'rectangular' | 'circular' | 'rounded';
  width?: string | number;
  height?: string | number;
}

export function Skeleton({ className, width, height, variant = 'rectangular', ...props }: SkeletonProps) {
  const styles: React.CSSProperties = {
    width,
    height,
  };

  return (
    <motion.div
      {...props}
      initial={{ opacity: 0.5 }}
      animate={{ opacity: [0.5, 0.8, 0.5] }}
      transition={{
        duration: 1.5,
        repeat: Infinity,
        ease: "easeInOut"
      }}
      style={{ ...styles, ...props.style }}
      className={cn(
        "bg-on-surface/10",
        variant === 'circular' ? 'rounded-full' : 
        variant === 'rounded' ? 'rounded-xl' : 'rounded-none',
        className
      )}
    />
  );
}
