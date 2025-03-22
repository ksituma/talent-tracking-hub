
import React from 'react';
import { Button } from '@/components/ui/button';
import { MapPin } from 'lucide-react';

interface CandidateProfileProps {
  name: string;
  title: string;
  location: string;
  avatar: string;
  skills?: Array<{
    name: string;
    value: number;
    color: string;
  }>;
  className?: string;
}

export function CandidateProfile({ 
  name, 
  title, 
  location, 
  avatar, 
  skills, 
  className
}: CandidateProfileProps) {
  return (
    <div className={className}>
      <div className="flex flex-col items-center text-center p-6">
        <div className="relative mb-4">
          <div className="w-24 h-24 rounded-full overflow-hidden shadow-md">
            <img
              src={avatar}
              alt={name}
              className="w-full h-full object-cover"
            />
          </div>
        </div>

        <h2 className="text-xl font-semibold text-gray-900">{name}</h2>
        <p className="text-sm text-blue-600 mb-1">{title}</p>
        
        <div className="flex items-center text-sm text-gray-500 mb-4">
          <MapPin size={14} className="mr-1" />
          <span>{location}</span>
        </div>

        <Button className="w-full">Profile</Button>
      </div>
    </div>
  );
}
