
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { AppShell } from '@/components/layout/AppShell';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { StatCard } from '@/components/dashboard/StatCard';
import { VacancyChart } from '@/components/dashboard/VacancyChart';
import { SkillsChart } from '@/components/dashboard/SkillsChart';
import { FileText, Users, Calendar, Briefcase, Plus } from 'lucide-react';

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState('overview');

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
    { name: 'JavaScript', value: 90, color: '#4ADE80' },
    { name: 'React', value: 85, color: '#3B82F6' },
    { name: 'Node.js', value: 68, color: '#EC4899' },
    { name: 'Python', value: 75, color: '#F59E0B' },
  ];

  // Get jobs from localStorage
  const jobs = JSON.parse(localStorage.getItem('talent_ats_jobs') || '[]');

  return (
    <AppShell>
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="mb-6">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="jobs">
            <Link to="/jobs" className="flex items-center">Jobs</Link>
          </TabsTrigger>
          <TabsTrigger value="candidates">
            <Link to="/applications" className="flex items-center">Candidates</Link>
          </TabsTrigger>
          <TabsTrigger value="reports">Reports</TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <StatCard
              title="Total Jobs"
              value={jobs.length.toString()}
              change="+2"
              trend="up"
              icon={<Briefcase className="h-4 w-4" />}
            />
            <StatCard
              title="Applications"
              value="342"
              change="+45"
              trend="up"
              icon={<FileText className="h-4 w-4" />}
            />
            <StatCard
              title="Interviews"
              value="68"
              change="+12"
              trend="up"
              icon={<Calendar className="h-4 w-4" />}
            />
            <StatCard
              title="Shortlisted"
              value="124"
              change="+18"
              trend="up"
              icon={<Users className="h-4 w-4" />}
            />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <Card className="lg:col-span-2">
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>Application Statistics</CardTitle>
                <Link to="/jobs">
                  <Button variant="outline" size="sm" className="flex items-center gap-2">
                    <Plus className="h-4 w-4" />
                    Add New Job
                  </Button>
                </Link>
              </CardHeader>
              <CardContent>
                <VacancyChart data={vacancyData} />
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Top Skills</CardTitle>
              </CardHeader>
              <CardContent>
                <SkillsChart skills={skillsData} />
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Recent Jobs</CardTitle>
              <Link to="/jobs">
                <Button variant="link" size="sm">
                  View All
                </Button>
              </Link>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {jobs.slice(0, 3).map((job) => (
                  <div key={job.id} className="flex justify-between items-center p-3 rounded-lg border">
                    <div>
                      <div className="font-medium">{job.title}</div>
                      <div className="text-sm text-gray-500">{job.company}</div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                        Active
                      </Badge>
                      <Link to="/jobs">
                        <Button variant="ghost" size="sm">
                          Edit
                        </Button>
                      </Link>
                    </div>
                  </div>
                ))}
                {jobs.length === 0 && (
                  <div className="text-center py-4 text-gray-500">
                    No jobs found. Add your first job posting!
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="jobs">
          <div className="py-10 text-center">
            <Link to="/jobs">
              <Button>Go to Jobs Management</Button>
            </Link>
          </div>
        </TabsContent>
        
        <TabsContent value="candidates">
          <div className="py-10 text-center">
            <Link to="/applications">
              <Button>Go to Candidates Management</Button>
            </Link>
          </div>
        </TabsContent>
        
        <TabsContent value="reports" className="space-y-6">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h2 className="text-2xl font-bold">Reports</h2>
              <p className="text-gray-600">Generate and view recruitment reports</p>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Job Performance</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {jobs.map((job) => (
                    <div key={job.id} className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>{job.title}</span>
                        <span>{Math.floor(Math.random() * 50) + 10} applicants</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-blue-600 h-2 rounded-full" 
                          style={{ width: `${Math.floor(Math.random() * 75) + 25}%` }}
                        ></div>
                      </div>
                    </div>
                  ))}
                  {jobs.length === 0 && (
                    <div className="text-center py-4 text-gray-500">
                      No jobs data available for reporting.
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Hiring Funnel</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <div>
                      <h3 className="font-medium">Applications</h3>
                      <p className="text-sm text-gray-600">Total applications received</p>
                    </div>
                    <span className="text-xl font-bold">342</span>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <div>
                      <h3 className="font-medium">Screened</h3>
                      <p className="text-sm text-gray-600">Applications reviewed</p>
                    </div>
                    <span className="text-xl font-bold">256</span>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <div>
                      <h3 className="font-medium">Interviews</h3>
                      <p className="text-sm text-gray-600">Candidates interviewed</p>
                    </div>
                    <span className="text-xl font-bold">124</span>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <div>
                      <h3 className="font-medium">Shortlisted</h3>
                      <p className="text-sm text-gray-600">Final candidates</p>
                    </div>
                    <span className="text-xl font-bold">56</span>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <div>
                      <h3 className="font-medium">Hired</h3>
                      <p className="text-sm text-gray-600">Successful hires</p>
                    </div>
                    <span className="text-xl font-bold">28</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </AppShell>
  );
}
