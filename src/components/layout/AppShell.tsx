
import React from 'react';
import { Sidebar } from './Sidebar';
import { Header } from './Header';

interface AppShellProps {
  children: React.ReactNode;
  showSidebar?: boolean;
}

export function AppShell({ children, showSidebar = true }: AppShellProps) {
  return (
    <div className="flex h-screen bg-gray-50">
      {showSidebar && <Sidebar />}
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header showAdminLogin={!showSidebar} />
        <main className="flex-1 overflow-y-auto p-4 sm:p-6">
          <div className="animate-fade-in">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
