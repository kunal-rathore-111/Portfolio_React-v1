import React, { createContext, useContext, useState } from 'react';
import { cn } from '@/lib/utils';
import { X, Maximize2, Minimize2 } from 'lucide-react';

const ExpandableChatContext = createContext({
    isOpen: false,
    toggleOpen: () => { },
    isExpanded: false,
    toggleExpanded: () => { },
});

export function ExpandableChat({ children, className, position = 'bottom-right', size = 'lg', icon }) {
    const [isOpen, setIsOpen] = useState(false);
    const [isExpanded, setIsExpanded] = useState(false);

    const toggleOpen = () => setIsOpen(!isOpen);
    const toggleExpanded = () => setIsExpanded(!isExpanded);

    const positionClasses = {
        'bottom-right': 'bottom-4 right-4',
        'bottom-left': 'bottom-4 left-4',
        'top-right': 'top-4 right-4',
        'top-left': 'top-4 left-4',
    };

    const sizeClasses = {
        sm: 'w-80 h-96',
        md: 'w-96 h-[500px]',
        lg: 'w-[400px] h-[600px]',
    };

    return (
        <ExpandableChatContext.Provider value={{ isOpen, toggleOpen, isExpanded, toggleExpanded }}>
            <div className={cn('fixed z-50', positionClasses[position])}>
                {!isOpen && (
                    <button
                        onClick={toggleOpen}
                        className="flex items-center justify-center w-14 h-14 bg-primary text-primary-foreground rounded-full shadow-lg hover:scale-110 transition-transform"
                        aria-label="Open chat"
                    >
                        {icon}
                    </button>
                )}
                {isOpen && (
                    <div
                        className={cn(
                            'bg-background border border-border rounded-lg shadow-2xl flex flex-col overflow-hidden transition-all',
                            isExpanded ? 'w-full h-[90vh]' : sizeClasses[size],
                            className
                        )}
                    >
                        {children}
                    </div>
                )}
            </div>
        </ExpandableChatContext.Provider>
    );
}

export function ExpandableChatHeader({ children }) {
    const { toggleOpen, isExpanded, toggleExpanded } = useContext(ExpandableChatContext);

    return (
        <div className="flex items-center justify-between p-4 border-b border-border bg-muted/50">
            <div className="flex-1">{children}</div>
            <div className="flex items-center gap-2">
                <button
                    onClick={toggleExpanded}
                    className="text-muted-foreground hover:text-foreground transition-colors"
                    aria-label={isExpanded ? 'Minimize' : 'Maximize'}
                >
                    {isExpanded ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
                </button>
                <button
                    onClick={toggleOpen}
                    className="text-muted-foreground hover:text-foreground transition-colors"
                    aria-label="Close chat"
                >
                    <X className="h-5 w-5" />
                </button>
            </div>
        </div>
    );
}

export function ExpandableChatBody({ children }) {
    return <div className="flex-1 overflow-hidden">{children}</div>;
}

export function ExpandableChatFooter({ children }) {
    return <div className="p-4 border-t border-border bg-muted/50">{children}</div>;
}
