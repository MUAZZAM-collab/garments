import React from 'react';
import { cn } from '../../lib/utils';
import { Loader2 } from 'lucide-react';

export const Button = React.forwardRef(
  ({ className, variant = 'primary', size = 'default', isLoading = false, children, disabled, ...props }, ref) => {
    const baseStyles =
      'inline-flex items-center justify-center font-medium transition-all duration-300 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-charcoal-900 disabled:pointer-events-none disabled:opacity-40 uppercase tracking-widest active:scale-[0.99] select-none';

    const variants = {
      primary: 'bg-charcoal-900 text-ivory-50 hover:bg-charcoal-700 shadow-soft',
      secondary: 'bg-rose-accent text-white hover:bg-rose-hover shadow-soft',
      outline: 'border border-charcoal-900 text-charcoal-900 bg-transparent hover:bg-charcoal-900 hover:text-ivory-50',
      outlineIvory: 'border border-ivory-200 text-ivory-200 bg-transparent hover:bg-ivory-200 hover:text-charcoal-900',
      gold: 'bg-gold-vip text-charcoal-900 hover:bg-gold-dark hover:text-white shadow-vip font-semibold',
      ghost: 'text-charcoal-900 hover:text-rose-accent bg-transparent tracking-widest',
      subtle: 'bg-charcoal-100 text-charcoal-900 hover:bg-charcoal-200',
    };

    const sizes = {
      default: 'h-12 px-6 text-xs rounded-sm',
      sm: 'h-9 px-4 text-[11px] rounded-sm',
      lg: 'h-14 px-8 text-sm rounded-sm',
      icon: 'h-10 w-10 p-0 rounded-full',
    };

    return (
      <button
        ref={ref}
        disabled={disabled || isLoading}
        className={cn(baseStyles, variants[variant], sizes[size], className)}
        {...props}
      >
        {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
        {children}
      </button>
    );
  }
);

Button.displayName = 'Button';
