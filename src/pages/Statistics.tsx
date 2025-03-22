
import React from 'react';
import { AppShell } from '@/components/layout/AppShell';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart, LineChart, PieChart, BarChart2 } from 'lucide-react';

export default function Statistics() {
  return (
    <AppShell>
      <div className="container mx-auto py-6">
        <div className="mb-6">
          <h2 className="text-2xl font-bold">Recruitment Analytics</h2>
          <p className="text-gray-600">Track and analyze your recruitment data</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <BarChart className="h-5 w-5 mr-2 text-blue-500" />
                Applications by Position
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col items-center justify-center py-12">
                <div className="bg-blue-100 p-4 rounded-full mb-4">
                  <BarChart className="h-12 w-12 text-blue-600" />
                </div>
                <p className="text-sm text-blue-600">Coming soon</p>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <LineChart className="h-5 w-5 mr-2 text-green-500" />
                Applications Over Time
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col items-center justify-center py-12">
                <div className="bg-green-100 p-4 rounded-full mb-4">
                  <LineChart className="h-12 w-12 text-green-600" />
                </div>
                <p className="text-sm text-green-600">Coming soon</p>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <PieChart className="h-5 w-5 mr-2 text-purple-500" />
                Candidate Sources
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col items-center justify-center py-12">
                <div className="bg-purple-100 p-4 rounded-full mb-4">
                  <PieChart className="h-12 w-12 text-purple-600" />
                </div>
                <p className="text-sm text-purple-600">Coming soon</p>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <BarChart2 className="h-5 w-5 mr-2 text-orange-500" />
                Hiring Funnel
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col items-center justify-center py-12">
                <div className="bg-orange-100 p-4 rounded-full mb-4">
                  <BarChart2 className="h-12 w-12 text-orange-600" />
                </div>
                <p className="text-sm text-orange-600">Coming soon</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </AppShell>
  );
}
