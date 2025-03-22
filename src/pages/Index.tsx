
import React from 'react';
import { Link } from 'react-router-dom';
import { AppShell } from '@/components/layout/AppShell';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Briefcase, MapPin, Clock, Calendar, ChevronRight } from 'lucide-react';

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
    skills: ['JavaScript', 'TypeScript', 'React', 'Node.js', 'AWS']
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
    skills: ['UI Design', 'UX Research', 'Figma', 'Adobe XD', 'Prototyping']
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
    skills: ['Python', 'TensorFlow', 'SQL', 'Data Visualization', 'Machine Learning']
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
    skills: ['Product Strategy', 'User Stories', 'Roadmapping', 'Agile', 'Market Research']
  },
];

export default function Index() {
  return (
    <AppShell>
      <div className="container mx-auto py-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Job Listings</h1>
            <p className="text-gray-600 mt-2">Find your next career opportunity</p>
          </div>
          <Link to="/application/new">
            <Button>Apply Now</Button>
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {jobListings.map((job) => (
            <Card key={job.id} className="hover:shadow-md transition-shadow">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-xl">{job.title}</CardTitle>
                    <CardDescription className="text-gray-600">{job.company}</CardDescription>
                  </div>
                  <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                    {job.type}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex flex-col gap-2 text-sm">
                  <div className="flex items-center">
                    <MapPin className="h-4 w-4 mr-2 text-gray-500" />
                    <span>{job.location}</span>
                  </div>
                  <div className="flex items-center">
                    <Briefcase className="h-4 w-4 mr-2 text-gray-500" />
                    <span>{job.salary}</span>
                  </div>
                  <div className="flex items-center">
                    <Calendar className="h-4 w-4 mr-2 text-gray-500" />
                    <span>Posted: {new Date(job.postedDate).toLocaleDateString()}</span>
                  </div>
                  <div className="flex items-center">
                    <Clock className="h-4 w-4 mr-2 text-gray-500" />
                    <span>Closing: {new Date(job.closingDate).toLocaleDateString()}</span>
                  </div>
                </div>
                
                <p className="text-sm text-gray-600">{job.description}</p>
                
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
              <CardFooter>
                <Link to={`/application/new?jobId=${job.id}`} className="w-full">
                  <Button variant="outline" className="w-full flex justify-between items-center">
                    Apply for this position
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </Link>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </AppShell>
  );
}
