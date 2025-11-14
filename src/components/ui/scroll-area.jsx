import React, { forwardRef } from 'react';
import { cn } from '@/lib/utils';

export const ScrollArea = forwardRef(({ className, children, ...props }, ref) => {
    return (
        <div
            ref={ref}
            className={cn('relative overflow-hidden', className)}
            {...props}
        >
            <div
                data-radix-scroll-area-viewport
                className="h-full w-full overflow-y-auto scrollbar-thin scrollbar-thumb-muted-foreground/30 scrollbar-track-transparent"
            >
                {children}
            </div>
        </div>
    );
});

ScrollArea.displayName = 'ScrollArea';
