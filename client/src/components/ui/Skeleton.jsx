import React from 'react';
import { cn } from '../../lib/utils';

export const Skeleton = ({ className, ...props }) => {
  return (
    <div
      className={cn('animate-pulse rounded-sm bg-charcoal-200/60', className)}
      {...props}
    />
  );
};
