
import React, { useState } from 'react';
import { AppShell } from '@/components/layout/AppShell';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { StatCard } from '@/components/dashboard/StatCard';
import { VacancyChart } from '@/components/dashboard/VacancyChart';
import { SkillsChart } from '@/components/dashboard/SkillsChart';
import { FileText, Users, Calendar, MessageSquare, Plus, Search, Filter, Download } from 'lucide-react';

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState('overview');
  const [selectedSkills, setSelectedSkills] = useState<string[]>([]);
  const [experienceFilter, setExperienceFilter] = useState('');
  const [educationFilter, setEducationFilter] = useState('');

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

  // Sample job listings for admin management
  const jobListings = [
    {
      id: 1,
      title: 'Senior Software Engineer',
      department: 'Engineering',
      locations: 'New York, NY',
      status: 'Active',
      applicants: 45,
      datePosted: '2023-06-15',
      closingDate: '2023-07-15',
    },
    {
      id: 2,
      title: 'UI/UX Designer',
      department: 'Design',
      locations: 'Remote',
      status: 'Active',
      applicants: 32,
      datePosted: '2023-06-20',
      closingDate: '2023-07-20',
    },
    {
      id: 3,
      title: 'Data Scientist',
      department: 'Data',
      locations: 'San Francisco, CA',
      status: 'Active',
      applicants: 28,
      datePosted: '2023-06-18',
      closingDate: '2023-07-18',
    },
    {
      id: 4,
      title: 'Product Manager',
      department: 'Product',
      locations: 'Chicago, IL',
      status: 'Active',
      applicants: 36,
      datePosted: '2023-06-22',
      closingDate: '2023-07-22',
    },
  ];

  // Sample applications for shortlisting
  const applications = [
    {
      id: 101,
      name: 'John Smith',
      jobApplied: 'Senior Software Engineer',
      dateApplied: '2023-06-18',
      experience: '7 years',
      education: "Master's Degree",
      skills: ['JavaScript', 'React', 'Node.js', 'AWS'],
      status: 'Under Review',
    },
    {
      id: 102,
      name: 'Maria Garcia',
      jobApplied: 'Senior Software Engineer',
      dateApplied: '2023-06-19',
      experience: '5 years',
      education: "Bachelor's Degree",
      skills: ['JavaScript', 'Angular', 'Java', 'Docker'],
      status: 'Shortlisted',
    },
    {
      id: 103,
      name: 'Robert Johnson',
      jobApplied: 'UI/UX Designer',
      dateApplied: '2023-06-22',
      experience: '3 years',
      education: "Bachelor's Degree",
      skills: ['Figma', 'Adobe XD', 'UI Design', 'Prototyping'],
      status: 'Under Review',
    },
    {
      id: 104,
      name: 'Sarah Williams',
      jobApplied: 'Data Scientist',
      dateApplied: '2023-06-20',
      experience: '6 years',
      education: 'PhD',
      skills: ['Python', 'TensorFlow', 'SQL', 'Data Visualization'],
      status: 'Shortlisted',
    },
    {
      id: 105,
      name: 'David Lee',
      jobApplied: 'Product Manager',
      dateApplied: '2023-06-25',
      experience: '4 years',
      education: "Master's Degree",
      skills: ['Product Strategy', 'Agile', 'Market Research'],
      status: 'Under Review',
    },
  ];

  // Filter applications based on selected criteria
  const filteredApplications = applications.filter(app => {
    if (selectedSkills.length > 0 && !selectedSkills.some(skill => app.skills.includes(skill))) {
      return false;
    }
    if (experienceFilter && !app.experience.toLowerCase().includes(experienceFilter.toLowerCase())) {
      return false;
    }
    if (educationFilter && !app.education.toLowerCase().includes(educationFilter.toLowerCase())) {
      return false;
    }
    return true;
  });

  const allSkills = Array.from(new Set(applications.flatMap(app => app.skills)));

  return (
    <AppShell>
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="mb-6">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="jobs">Jobs</TabsTrigger>
          <TabsTrigger value="candidates">Candidates</TabsTrigger>
          <TabsTrigger value="reports">Reports</TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <StatCard
              title="Total Jobs"
              value="12"
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
              <CardHeader>
                <CardTitle>Application Statistics</CardTitle>
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
        </TabsContent>
        
        <TabsContent value="jobs" className="space-y-6">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h2 className="text-2xl font-bold">Job Listings</h2>
              <p className="text-gray-600">Manage job postings and vacancies</p>
            </div>
            <Button className="flex items-center gap-2">
              <Plus className="h-4 w-4" />
              Add New Job
            </Button>
          </div>
          
          <Card>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Job Title</TableHead>
                    <TableHead>Department</TableHead>
                    <TableHead>Location</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Applicants</TableHead>
                    <TableHead>Posted Date</TableHead>
                    <TableHead>Closing Date</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {jobListings.map((job) => (
                    <TableRow key={job.id}>
                      <TableCell className="font-medium">{job.title}</TableCell>
                      <TableCell>{job.department}</TableCell>
                      <TableCell>{job.locations}</TableCell>
                      <TableCell>
                        <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                          {job.status}
                        </Badge>
                      </TableCell>
                      <TableCell>{job.applicants}</TableCell>
                      <TableCell>{new Date(job.datePosted).toLocaleDateString()}</TableCell>
                      <TableCell>{new Date(job.closingDate).toLocaleDateString()}</TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button variant="ghost" size="sm">Edit</Button>
                          <Button variant="ghost" size="sm" className="text-red-500 hover:text-red-700 hover:bg-red-50">
                            Delete
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="candidates" className="space-y-6">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h2 className="text-2xl font-bold">Candidate Management</h2>
              <p className="text-gray-600">Review and shortlist candidates</p>
            </div>
            <div className="flex gap-4">
              <Button variant="outline" className="flex items-center gap-2">
                <Filter className="h-4 w-4" />
                Filters
              </Button>
              <Button variant="outline" className="flex items-center gap-2">
                <Download className="h-4 w-4" />
                Export
              </Button>
            </div>
          </div>
          
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Filter Candidates</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-1 block">Skills</label>
                  <Select onValueChange={(value) => setSelectedSkills([...selectedSkills, value])}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select skills" />
                    </SelectTrigger>
                    <SelectContent>
                      {allSkills.map((skill, index) => (
                        <SelectItem key={index} value={skill}>{skill}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {selectedSkills.map((skill, index) => (
                      <Badge key={index} variant="secondary" className="bg-gray-100 flex items-center gap-1">
                        {skill}
                        <button 
                          onClick={() => setSelectedSkills(selectedSkills.filter(s => s !== skill))}
                          className="text-gray-500 hover:text-gray-700"
                        >
                          ×
                        </button>
                      </Badge>
                    ))}
                  </div>
                </div>
                
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-1 block">Experience</label>
                  <Select onValueChange={setExperienceFilter}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select experience" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1">1+ years</SelectItem>
                      <SelectItem value="3">3+ years</SelectItem>
                      <SelectItem value="5">5+ years</SelectItem>
                      <SelectItem value="7">7+ years</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-1 block">Education Level</label>
                  <Select onValueChange={setEducationFilter}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select education" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="bachelor">Bachelor's Degree</SelectItem>
                      <SelectItem value="master">Master's Degree</SelectItem>
                      <SelectItem value="phd">PhD</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Job</TableHead>
                    <TableHead>Applied Date</TableHead>
                    <TableHead>Experience</TableHead>
                    <TableHead>Education</TableHead>
                    <TableHead>Skills</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredApplications.map((candidate) => (
                    <TableRow key={candidate.id}>
                      <TableCell className="font-medium">{candidate.name}</TableCell>
                      <TableCell>{candidate.jobApplied}</TableCell>
                      <TableCell>{new Date(candidate.dateApplied).toLocaleDateString()}</TableCell>
                      <TableCell>{candidate.experience}</TableCell>
                      <TableCell>{candidate.education}</TableCell>
                      <TableCell>
                        <div className="flex flex-wrap gap-1">
                          {candidate.skills.slice(0, 2).map((skill, index) => (
                            <Badge key={index} variant="outline" className="text-xs">
                              {skill}
                            </Badge>
                          ))}
                          {candidate.skills.length > 2 && (
                            <Badge variant="outline" className="text-xs">
                              +{candidate.skills.length - 2}
                            </Badge>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge 
                          variant="outline" 
                          className={candidate.status === 'Shortlisted' 
                            ? 'bg-green-50 text-green-700 border-green-200' 
                            : 'bg-yellow-50 text-yellow-700 border-yellow-200'
                          }
                        >
                          {candidate.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button variant="outline" size="sm">View</Button>
                          <Button 
                            variant="outline" 
                            size="sm"
                            className={candidate.status !== 'Shortlisted' 
                              ? 'text-green-600 hover:text-green-800 hover:bg-green-50' 
                              : 'text-yellow-600 hover:text-yellow-800 hover:bg-yellow-50'
                            }
                          >
                            {candidate.status !== 'Shortlisted' ? 'Shortlist' : 'Review'}
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="reports" className="space-y-6">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h2 className="text-2xl font-bold">Reports</h2>
              <p className="text-gray-600">Generate and view recruitment reports</p>
            </div>
            <Button variant="outline" className="flex items-center gap-2">
              <Download className="h-4 w-4" />
              Export Reports
            </Button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Job Performance</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Senior Software Engineer</span>
                    <span>45 applicants</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-blue-600 h-2 rounded-full" style={{ width: '75%' }}></div>
                  </div>
                  
                  <div className="flex justify-between text-sm">
                    <span>UI/UX Designer</span>
                    <span>32 applicants</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-blue-600 h-2 rounded-full" style={{ width: '60%' }}></div>
                  </div>
                  
                  <div className="flex justify-between text-sm">
                    <span>Data Scientist</span>
                    <span>28 applicants</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-blue-600 h-2 rounded-full" style={{ width: '50%' }}></div>
                  </div>
                  
                  <div className="flex justify-between text-sm">
                    <span>Product Manager</span>
                    <span>36 applicants</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-blue-600 h-2 rounded-full" style={{ width: '65%' }}></div>
                  </div>
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
