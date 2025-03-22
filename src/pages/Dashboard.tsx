
import React from 'react';
import { AppShell } from '@/components/layout/AppShell';
import { StatCard } from '@/components/dashboard/StatCard';
import { ActivityFeed } from '@/components/dashboard/ActivityFeed';
import { VacancyChart } from '@/components/dashboard/VacancyChart';
import { SkillsChart } from '@/components/dashboard/SkillsChart';
import { CandidateProfile } from '@/components/dashboard/CandidateProfile';
import { FileText, Users, Calendar, MessageSquare } from 'lucide-react';

export default function Dashboard() {
  // Dummy data for the charts
  const vacancyData = [
    { month: 'Mar', applications: 40, interviews: 30, rejected: 20 },
    { month: 'Apr', applications: 58, interviews: 35, rejected: 25 },
    { month: 'May', applications: 50, interviews: 38, rejected: 28 },
    { month: 'Jun', applications: 65, interviews: 32, rejected: 20 },
    { month: 'Jul', applications: 40, interviews: 30, rejected: 25 },
    { month: 'Aug', applications: 65, interviews: 35, rejected: 30 },
    { month: 'Sep', applications: 55, interviews: 25, rejected: 35 },
    { month: 'Oct', applications: 45, interviews: 32, rejected: 25 },
    { month: 'Nov', applications: 55, interviews: 35, rejected: 22 },
    { month: 'Dec', applications: 60, interviews: 40, rejected: 30 },
  ];

  const skillsData = [
    { name: 'Figma', value: 90, color: '#4ADE80' },
    { name: 'Adobe XD', value: 68, color: '#EC4899' },
    { name: 'Photoshop', value: 85, color: '#3B82F6' },
    { name: 'Sketch', value: 75, color: '#F59E0B' },
  ];

  const activityItems = [
    {
      id: '1',
      icon: <div className="text-white">B</div>,
      iconBackground: 'bg-blue-500',
      content: 
        <div>
          <span className="font-medium">Bubles Studios</span> have 5 available positions for you
        </div>,
      timestamp: '8min ago',
    },
    {
      id: '2',
      icon: <div className="text-white">E</div>,
      iconBackground: 'bg-amber-500',
      content: 
        <div>
          <span className="font-medium">Elextra Studios</span> has invited you to interview meeting tomorrow
        </div>,
      timestamp: '8min ago',
    },
    {
      id: '3',
      icon: <div className="text-white">H</div>,
      iconBackground: 'bg-green-500',
      content: 
        <div>
          <span className="font-medium">Highspeed Design Team</span> have 2 available positions for you
        </div>,
      timestamp: '8min ago',
    },
  ];

  return (
    <AppShell>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <StatCard
              title="Interview Schedules"
              value="342"
              change="+0.5%"
              trend="up"
              chart={
                <svg
                  className="w-full h-full"
                  viewBox="0 0 100 30"
                  preserveAspectRatio="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M0 20 Q 10 10, 20 15 T 40 10 T 60 20 T 80 10 T 100 20"
                    fill="none"
                    strokeWidth="2"
                    stroke="#3B82F6"
                  />
                  <path
                    d="M0 20 Q 10 10, 20 15 T 40 10 T 60 20 T 80 10 T 100 20 V 30 H 0 Z"
                    fill="#DBEAFE"
                    fillOpacity="0.5"
                  />
                </svg>
              }
            />

            <StatCard
              title="Application"
              value="984"
              chart={
                <svg
                  className="w-full h-full"
                  viewBox="0 0 100 30"
                  preserveAspectRatio="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M0 15 Q 20 5, 30 15 T 60 5 T 100 15"
                    fill="none"
                    strokeWidth="2"
                    stroke="#10B981"
                  />
                  <path
                    d="M0 15 Q 20 5, 30 15 T 60 5 T 100 15 V 30 H 0 Z"
                    fill="#D1FAE5"
                    fillOpacity="0.5"
                  />
                </svg>
              }
            />

            <StatCard
              title="Profile"
              value="1,567k"
              change="-2.0%"
              trend="down"
              chart={
                <svg
                  className="w-full h-full"
                  viewBox="0 0 100 30"
                  preserveAspectRatio="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M0 20 Q 25 10, 50 25 T 100 10"
                    fill="none"
                    strokeWidth="2"
                    stroke="#3B82F6"
                  />
                  <path
                    d="M0 20 Q 25 10, 50 25 T 100 10 V 30 H 0 Z"
                    fill="#DBEAFE"
                    fillOpacity="0.5"
                  />
                </svg>
              }
            />

            <StatCard
              title="Unread Messages"
              value="437"
              chart={
                <svg
                  className="w-full h-full"
                  viewBox="0 0 100 30"
                  preserveAspectRatio="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M0 20 Q 10 15, 20 20 T 40 10 T 60 20 T 80 5 T 100 20"
                    fill="none"
                    strokeWidth="2"
                    stroke="#EC4899"
                  />
                  <path
                    d="M0 20 Q 10 15, 20 20 T 40 10 T 60 20 T 80 5 T 100 20 V 30 H 0 Z"
                    fill="#FCE7F3"
                    fillOpacity="0.5"
                  />
                </svg>
              }
            />
          </div>

          <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-100">
            <VacancyChart data={vacancyData} />
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
            <CandidateProfile
              name="Franklin Jr"
              title="UI / UX Designer"
              location="Medan, Sumatera Utara - ID"
              avatar="/lovable-uploads/ef393a9e-3b69-4cac-8255-5350f9bce562.png"
            />
          </div>

          <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-100">
            <SkillsChart skills={skillsData} />
          </div>

          <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-100">
            <ActivityFeed items={activityItems} />
          </div>
        </div>
      </div>
    </AppShell>
  );
}
