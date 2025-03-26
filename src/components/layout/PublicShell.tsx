
import React from 'react';
import { Header } from './Header';

export function PublicShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-col h-screen">
      <Header 
        onToggleSidebar={() => {}} 
        user={null}
        onLogout={() => {}}
        isLoading={false}
        hideAdminElements={true}
      />
      <main className="flex-1 overflow-auto bg-gray-50">
        {children}
      </main>
    </div>
  );
}
