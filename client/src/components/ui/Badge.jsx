import React from 'react';
import { cn } from '../../lib/utils';

export const Badge = ({ className, variant = 'default', children, ...props }) => {
  const variants = {
    default: 'bg-charcoal-900 text-ivory-50',
    rose: 'bg-rose-light text-rose-deep border border-rose-accent/20',
    gold: 'bg-gold-light text-gold-dark border border-gold-vip/30 font-semibold',
    outline: 'border border-charcoal-200 text-charcoal-700 bg-white/70',
    alert: 'bg-red-50 text-red-700 border border-red-200',
    success: 'bg-emerald-50 text-emerald-800 border border-emerald-200',
  };

  return (
    <span
      className={cn(
        'inline-flex items-center px-2.5 py-0.5 rounded-sm text-[10px] font-medium uppercase tracking-widest select-none',
        variants[variant],
        className
      )}
      {...props}
    >
      {children}
    </span>
  );
};
