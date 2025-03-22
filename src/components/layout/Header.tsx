
import React from 'react';
import { Link } from 'react-router-dom';
import { Search, Bell, User, Lock } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface HeaderProps {
  showAdminLogin?: boolean;
}

export function Header({ showAdminLogin = false }: HeaderProps) {
  return (
    <header className="bg-white border-b border-gray-200 shadow-sm">
      <div className="px-4 sm:px-6 py-3 flex items-center justify-between">
        <div className="flex items-center">
          <Link to="/" className="text-xl font-bold text-blue-600 flex items-center">
            <div className="bg-blue-600 rounded-full p-1 mr-2">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2ZM12 5C13.66 5 15 6.34 15 8C15 9.66 13.66 11 12 11C10.34 11 9 9.66 9 8C9 6.34 10.34 5 12 5ZM12 19.2C9.5 19.2 7.29 17.92 6 15.98C6.03 13.99 10 12.9 12 12.9C13.99 12.9 17.97 13.99 18 15.98C16.71 17.92 14.5 19.2 12 19.2Z" fill="white"/>
              </svg>
            </div>
            TalentATS
          </Link>
        </div>
        
        <div className="flex items-center space-x-4">
          {showAdminLogin ? (
            <Link to="/admin-login">
              <Button variant="outline" size="sm" className="flex items-center gap-2">
                <Lock className="h-4 w-4" />
                Admin Login
              </Button>
            </Link>
          ) : (
            <>
              <button className="text-gray-500 hover:text-gray-700">
                <Search className="h-5 w-5" />
              </button>
              <button className="text-gray-500 hover:text-gray-700 relative">
                <Bell className="h-5 w-5" />
                <span className="absolute top-0 right-0 h-2 w-2 bg-red-500 rounded-full"></span>
              </button>
              <button className="text-gray-500 hover:text-gray-700">
                <User className="h-5 w-5" />
              </button>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
