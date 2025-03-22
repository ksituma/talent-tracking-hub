
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { AppShell } from '@/components/layout/AppShell';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Briefcase, MapPin, Clock, Calendar, ChevronRight, Search, ArrowRight, Lock } from 'lucide-react';

// This would typically come from an API
const jobListings = [
  {
    id: 1,
    title: 'Senior Software Engineer',
    company: 'Tech Innovations Inc.',
    location: 'New York, NY',
    type: 'Full-time',
    salary: '$120,000 - $150,000',
    postedDate: '2023-06-15',
    closingDate: '2023-07-15',
    description: 'Looking for a senior software engineer with expertise in React, Node.js, and cloud technologies.',
    requirements: ['5+ years of experience', 'React', 'Node.js', 'AWS', 'CI/CD'],
    skills: ['JavaScript', 'TypeScript', 'React', 'Node.js', 'AWS'],
    featured: true,
    logo: '/lovable-uploads/c527b9f6-c10f-40f4-b84c-67261743d4c4.png'
  },
  {
    id: 2,
    title: 'UI/UX Designer',
    company: 'Creative Solutions',
    location: 'Remote',
    type: 'Contract',
    salary: '$80,000 - $100,000',
    postedDate: '2023-06-20',
    closingDate: '2023-07-20',
    description: 'Seeking a talented UI/UX designer to create beautiful, intuitive interfaces for our products.',
    requirements: ['3+ years of experience', 'Figma', 'Adobe XD', 'User Research'],
    skills: ['UI Design', 'UX Research', 'Figma', 'Adobe XD', 'Prototyping'],
    featured: false
  },
  {
    id: 3,
    title: 'Data Scientist',
    company: 'Analytics Pro',
    location: 'San Francisco, CA',
    type: 'Full-time',
    salary: '$130,000 - $160,000',
    postedDate: '2023-06-18',
    closingDate: '2023-07-18',
    description: 'Join our data science team to build machine learning models and analyze large datasets.',
    requirements: ['Masters/PhD in relevant field', 'Python', 'Machine Learning', 'SQL'],
    skills: ['Python', 'TensorFlow', 'SQL', 'Data Visualization', 'Machine Learning'],
    featured: false
  },
  {
    id: 4,
    title: 'Product Manager',
    company: 'Product Visionaries',
    location: 'Chicago, IL',
    type: 'Full-time',
    salary: '$110,000 - $140,000',
    postedDate: '2023-06-22',
    closingDate: '2023-07-22',
    description: 'Lead product development initiatives from conception to launch.',
    requirements: ['4+ years in product management', 'Agile methodologies', 'Technical background'],
    skills: ['Product Strategy', 'User Stories', 'Roadmapping', 'Agile', 'Market Research'],
    featured: true
  },
];

export default function Index() {
  const [searchTerm, setSearchTerm] = useState('');
  
  const filteredJobs = jobListings.filter(job => 
    job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    job.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
    job.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <AppShell>
      <div className="container mx-auto py-8">
        <div className="bg-gradient-to-r from-blue-600 to-blue-800 rounded-xl p-8 mb-8 text-white">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl font-bold mb-4">Find Your Dream Job</h1>
            <p className="text-lg text-blue-100 mb-6">Discover opportunities that match your skills and career goals</p>
            <div className="relative max-w-2xl mx-auto">
              <Search className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
              <Input
                type="text"
                placeholder="Search for jobs, companies, or keywords..."
                className="pl-10 h-12 bg-white text-gray-800"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
        </div>

        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-900">Latest Job Openings</h2>
          <Link to="/admin-login">
            <Button variant="outline" size="sm" className="flex items-center gap-2">
              <Lock className="h-4 w-4" />
              Admin Login
            </Button>
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredJobs.length > 0 ? (
            filteredJobs.map((job) => (
              <Card 
                key={job.id} 
                className={`hover:shadow-md transition-shadow ${job.featured ? 'border-blue-200 bg-blue-50' : ''}`}
              >
                <CardHeader className="pb-4">
                  <div className="flex justify-between items-start">
                    <div className="flex gap-4 items-center">
                      <div className="w-12 h-12 rounded-md bg-gray-100 flex items-center justify-center overflow-hidden">
                        {job.logo ? (
                          <img src={job.logo} alt={job.company} className="w-full h-full object-cover" />
                        ) : (
                          <Briefcase className="h-6 w-6 text-gray-400" />
                        )}
                      </div>
                      <div>
                        <CardTitle className="text-xl">{job.title}</CardTitle>
                        <CardDescription className="text-gray-600">{job.company}</CardDescription>
                      </div>
                    </div>
                    <Badge variant={job.featured ? "default" : "outline"} className={job.featured ? "bg-blue-500" : "bg-gray-100 text-gray-700"}>
                      {job.type}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4 pt-0">
                  <div className="flex flex-col gap-2 text-sm">
                    <div className="flex items-center">
                      <MapPin className="h-4 w-4 mr-2 text-gray-500" />
                      <span>{job.location}</span>
                    </div>
                    <div className="flex items-center">
                      <Briefcase className="h-4 w-4 mr-2 text-gray-500" />
                      <span>{job.salary}</span>
                    </div>
                    <div className="flex justify-between">
                      <div className="flex items-center">
                        <Calendar className="h-4 w-4 mr-2 text-gray-500" />
                        <span>Posted: {new Date(job.postedDate).toLocaleDateString()}</span>
                      </div>
                      <div className="flex items-center">
                        <Clock className="h-4 w-4 mr-2 text-gray-500" />
                        <span>Closing: {new Date(job.closingDate).toLocaleDateString()}</span>
                      </div>
                    </div>
                  </div>
                  
                  <p className="text-sm text-gray-600 line-clamp-2">{job.description}</p>
                  
                  <div className="flex flex-wrap gap-2 mt-3">
                    {job.skills.slice(0, 4).map((skill, index) => (
                      <Badge key={index} variant="secondary" className="bg-gray-100 text-gray-800 hover:bg-gray-200">
                        {skill}
                      </Badge>
                    ))}
                    {job.skills.length > 4 && (
                      <Badge variant="secondary" className="bg-gray-100 text-gray-800">
                        +{job.skills.length - 4} more
                      </Badge>
                    )}
                  </div>
                </CardContent>
                <CardFooter className="flex justify-between pt-4 border-t">
                  <Button variant="ghost" size="sm" className="text-blue-600">
                    View Details
                  </Button>
                  <Link to={`/application/new?jobId=${job.id}`}>
                    <Button size="sm" className="flex items-center gap-2">
                      Apply Now
                      <ArrowRight className="h-4 w-4" />
                    </Button>
                  </Link>
                </CardFooter>
              </Card>
            ))
          ) : (
            <div className="col-span-2 text-center py-12">
              <h3 className="text-xl font-medium text-gray-700">No jobs found</h3>
              <p className="text-gray-500 mt-2">Try adjusting your search terms</p>
            </div>
          )}
        </div>
      </div>
    </AppShell>
  );
}
