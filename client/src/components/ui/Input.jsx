import React from 'react';
import { cn } from '../../lib/utils';

export const Input = React.forwardRef(
  ({ className, type = 'text', error, label, ...props }, ref) => {
    return (
      <div className="w-full space-y-1">
        {label && (
          <label className="block text-[11px] font-medium tracking-wider uppercase text-charcoal-600">
            {label}
          </label>
        )}
        <input
          type={type}
          ref={ref}
          className={cn(
            'flex h-11 w-full rounded-sm border border-charcoal-200 bg-white px-3.5 py-2 text-sm text-charcoal-900 transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-charcoal-400 focus-visible:outline-none focus-visible:border-charcoal-900 focus-visible:ring-1 focus-visible:ring-charcoal-900 disabled:cursor-not-allowed disabled:opacity-50',
            error && 'border-red-500 focus-visible:ring-red-500',
            className
          )}
          {...props}
        />
        {error && <p className="text-[11px] text-red-600 tracking-wide">{error}</p>}
      </div>
    );
  }
);

Input.displayName = 'Input';
