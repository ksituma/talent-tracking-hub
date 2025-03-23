
import React from 'react';
import { Header } from './Header';
import { Sidebar } from './Sidebar';

interface AppShellProps {
  children: React.ReactNode;
  showSidebar?: boolean;
  showAdminLogin?: boolean;
}

export function AppShell({ 
  children, 
  showSidebar = true,
  showAdminLogin = false 
}: AppShellProps) {
  return (
    <div className="min-h-screen flex flex-col">
      <Header showAdminLogin={showAdminLogin} />
      
      <div className="flex flex-1">
        {showSidebar && (
          <Sidebar />
        )}
        
        <main className="flex-1 bg-gray-50">
          {children}
        </main>
      </div>
    </div>
  );
}
