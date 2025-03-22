
import React from 'react';
import { Bell, Search, Plus, Settings, Moon, Sun } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function Header() {
  const [theme, setTheme] = React.useState<'light' | 'dark'>('light');

  const toggleTheme = () => {
    setTheme(theme === 'light' ? 'dark' : 'light');
    // Add actual theme toggling logic here
  };

  return (
    <header className="bg-white border-b border-gray-200 py-3 px-4 sm:px-6 flex items-center justify-between">
      <h1 className="text-xl font-semibold text-gray-800">Dashboard</h1>

      <div className="flex items-center space-x-2 sm:space-x-4">
        <div className="relative hidden sm:block">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-4 w-4 text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Search..."
            className="py-2 pl-10 pr-4 block w-full sm:w-64 rounded-md border-0 bg-gray-50 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-blue-500 sm:text-sm"
          />
        </div>

        <Button variant="ghost" size="icon" className="text-gray-500 hover:text-gray-700 hidden sm:flex">
          <span className="sr-only">Toggle theme</span>
          {theme === 'light' ? <Moon className="h-5 w-5" /> : <Sun className="h-5 w-5" />}
        </Button>

        <Button variant="ghost" size="icon" className="text-gray-500 hover:text-gray-700 relative">
          <span className="sr-only">Notifications</span>
          <Bell className="h-5 w-5" />
          <span className="absolute top-0 right-0 block h-2 w-2 rounded-full bg-red-500 ring-2 ring-white" />
        </Button>

        <Button variant="default" size="sm" className="hidden sm:flex items-center gap-1">
          <Plus className="h-4 w-4" />
          <span>Add New</span>
        </Button>

        <Button variant="ghost" size="icon" className="sm:hidden text-gray-500 hover:text-gray-700">
          <Plus className="h-5 w-5" />
        </Button>
      </div>
    </header>
  );
}
