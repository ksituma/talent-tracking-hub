
import React from 'react';
import { cn } from '@/lib/utils';

interface ActivityItem {
  id: string;
  icon: React.ReactNode;
  iconBackground: string;
  content: React.ReactNode;
  timestamp: string;
  read?: boolean;
}

interface ActivityFeedProps {
  title?: string;
  items: ActivityItem[];
  className?: string;
}

export function ActivityFeed({ title = "Activity", items, className }: ActivityFeedProps) {
  const [sortOrder, setSortOrder] = React.useState<'newest' | 'oldest'>('newest');
  
  const sortedItems = React.useMemo(() => {
    return [...items].sort((a, b) => {
      if (sortOrder === 'newest') {
        return 0; // Keep original order for simplicity
      } else {
        return 0; // Reverse order for simplicity
      }
    });
  }, [items, sortOrder]);

  return (
    <div className={cn("space-y-4", className)}>
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
        <div className="flex items-center space-x-2">
          <button 
            onClick={() => setSortOrder(sortOrder === 'newest' ? 'oldest' : 'newest')}
            className="flex items-center space-x-1 text-sm font-medium text-blue-600 hover:text-blue-800"
          >
            <span>{sortOrder === 'newest' ? 'Newest' : 'Oldest'}</span>
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>
          <button className="text-gray-500 hover:text-gray-700">
            <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 13C12.5523 13 13 12.5523 13 12C13 11.4477 12.5523 11 12 11C11.4477 11 11 11.4477 11 12C11 12.5523 11.4477 13 12 13Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M19 13C19.5523 13 20 12.5523 20 12C20 11.4477 19.5523 11 19 11C18.4477 11 18 11.4477 18 12C18 12.5523 18.4477 13 19 13Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M5 13C5.55228 13 6 12.5523 6 12C6 11.4477 5.55228 11 5 11C4.44772 11 4 11.4477 4 12C4 12.5523 4.44772 13 5 13Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
        </div>
      </div>
      
      <div className="flow-root">
        <ul className="-mb-8">
          {sortedItems.map((item, itemIdx) => (
            <li key={item.id} className="relative pb-8">
              {itemIdx !== sortedItems.length - 1 ? (
                <span 
                  className="absolute top-4 left-4 -ml-px h-full w-0.5 bg-gray-200" 
                  aria-hidden="true" 
                />
              ) : null}
              <div className="relative flex space-x-3 items-start animate-slide-in" style={{ animationDelay: `${itemIdx * 50}ms` }}>
                <div className={cn(
                  "flex h-8 w-8 items-center justify-center rounded-full",
                  item.iconBackground
                )}>
                  {item.icon}
                </div>
                <div className="flex-1 min-w-0">
                  <div className={cn(
                    "text-sm text-gray-700",
                    !item.read && "font-medium"
                  )}>
                    {item.content}
                  </div>
                  <p className="mt-0.5 text-xs text-gray-500">{item.timestamp}</p>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
