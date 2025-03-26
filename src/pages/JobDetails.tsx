import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { AppShell } from '@/components/layout/AppShell';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { ArrowLeft, Briefcase, MapPin, Calendar, Clock, GraduationCap, Clock1, ArrowRight } from 'lucide-react';
import { fetchJobById } from '@/utils/supabase-utils';
import { PublicShell } from '@/components/layout/PublicShell';

const JOBS_STORAGE_KEY = 'talent_ats_jobs';

export default function JobDetails() {
  const { id } = useParams();
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadJob = async () => {
      setLoading(true);
      
      try {
        const jobData = await fetchJobById(id);
        
        if (jobData) {
          console.log('Job fetched from Supabase:', jobData);
          setJob(jobData);
        } else {
          const savedJobs = JSON.parse(localStorage.getItem(JOBS_STORAGE_KEY) || '[]');
          const foundJob = savedJobs.find(job => job.id === id);
          
          if (foundJob) {
            setJob(foundJob);
          }
        }
      } catch (error) {
        console.error('Error fetching job:', error);
        
        const savedJobs = JSON.parse(localStorage.getItem(JOBS_STORAGE_KEY) || '[]');
        const foundJob = savedJobs.find(job => job.id === id);
        
        if (foundJob) {
          setJob(foundJob);
        }
      } finally {
        setLoading(false);
      }
    };

    loadJob();
  }, [id]);

  if (loading) {
    return (
      <AppShell>
        <div className="container mx-auto py-12 px-4">
          <div className="flex justify-center">
            <div className="animate-pulse w-full max-w-4xl">
              <div className="h-8 bg-gray-200 rounded w-1/3 mb-4"></div>
              <div className="h-4 bg-gray-200 rounded w-1/4 mb-8"></div>
              <div className="h-64 bg-gray-200 rounded mb-6"></div>
              <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
              <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
              <div className="h-4 bg-gray-200 rounded w-5/6 mb-8"></div>
            </div>
          </div>
        </div>
      </AppShell>
    );
  }

  if (!job) {
    return (
      <AppShell>
        <div className="container mx-auto py-12 px-4">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-4">Job Not Found</h1>
            <p className="mb-6">The job listing you're looking for doesn't exist or has been removed.</p>
            <Link to="/">
              <Button>
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Jobs
              </Button>
            </Link>
          </div>
        </div>
      </AppShell>
    );
  }

  return (
    <PublicShell>
      <div className="container mx-auto py-8">
        <div className="max-w-4xl mx-auto">
          <div className="mb-6">
            <Link to="/">
              <Button variant="ghost" className="pl-0">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Jobs
              </Button>
            </Link>
          </div>

          <Card className="mb-8">
            <CardHeader className="pb-4">
              <div className="flex items-start justify-between">
                <div className="flex gap-4 items-center">
                  <div className="w-16 h-16 rounded-md bg-gray-100 flex items-center justify-center overflow-hidden">
                    {job.logo ? (
                      <img src={job.logo} alt={job.company} className="w-full h-full object-cover" />
                    ) : (
                      <Briefcase className="h-8 w-8 text-gray-400" />
                    )}
                  </div>
                  <div>
                    <CardTitle className="text-2xl mb-1">{job.title}</CardTitle>
                    <div className="text-lg text-gray-600">{job.company}</div>
                    <div className="flex flex-wrap gap-2 mt-2">
                      <Badge variant="outline" className="bg-gray-100">
                        <MapPin className="h-3 w-3 mr-1" /> {job.location}
                      </Badge>
                      <Badge variant="outline" className="bg-gray-100">
                        <Briefcase className="h-3 w-3 mr-1" /> {job.type}
                      </Badge>
                    </div>
                  </div>
                </div>
                <Link to={`/application/new?jobId=${job.id}`}>
                  <Button className="flex items-center gap-2">
                    Apply Now
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </Link>
              </div>
            </CardHeader>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="md:col-span-2">
              <Card>
                <CardContent className="pt-6">
                  <h2 className="text-xl font-semibold mb-4">Job Description</h2>
                  <p className="text-gray-700 whitespace-pre-line mb-6">{job.description}</p>

                  <h2 className="text-xl font-semibold mb-4">Requirements</h2>
                  <ul className="list-disc pl-5 space-y-2 mb-6">
                    {job.requirements.map((requirement, index) => (
                      <li key={index} className="text-gray-700">{requirement}</li>
                    ))}
                  </ul>

                  <h2 className="text-xl font-semibold mb-4">Required Skills</h2>
                  <div className="flex flex-wrap gap-2 mb-6">
                    {job.skills.map((skill, index) => (
                      <Badge key={index} variant="secondary" className="bg-gray-100 text-gray-800">
                        {skill}
                      </Badge>
                    ))}
                  </div>

                  <div className="mt-8">
                    <Link to={`/application/new?jobId=${job.id}`}>
                      <Button className="w-full md:w-auto flex items-center justify-center gap-2">
                        Apply for this position
                        <ArrowRight className="h-4 w-4" />
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="md:col-span-1">
              <Card>
                <CardContent className="pt-6">
                  <h2 className="text-lg font-semibold mb-4">Job Details</h2>
                  
                  <div className="space-y-4">
                    <div>
                      <h3 className="text-sm font-medium text-gray-500">Salary Range</h3>
                      <p className="text-gray-700">{job.salary}</p>
                    </div>
                    <Separator />
                    
                    <div>
                      <h3 className="text-sm font-medium text-gray-500">Experience Required</h3>
                      <div className="flex items-center">
                        <Clock1 className="h-4 w-4 mr-2 text-gray-500" />
                        <span>{job.yearsOfExperience}+ years</span>
                      </div>
                    </div>
                    <Separator />
                    
                    <div>
                      <h3 className="text-sm font-medium text-gray-500">Minimum Qualification</h3>
                      <div className="flex items-center">
                        <GraduationCap className="h-4 w-4 mr-2 text-gray-500" />
                        <span>{job.minQualification}</span>
                      </div>
                    </div>
                    <Separator />
                    
                    <div>
                      <h3 className="text-sm font-medium text-gray-500">Job Posted</h3>
                      <div className="flex items-center">
                        <Calendar className="h-4 w-4 mr-2 text-gray-500" />
                        <span>{new Date(job.postedDate).toLocaleDateString()}</span>
                      </div>
                    </div>
                    <Separator />
                    
                    <div>
                      <h3 className="text-sm font-medium text-gray-500">Closing Date</h3>
                      <div className="flex items-center">
                        <Clock className="h-4 w-4 mr-2 text-gray-500" />
                        <span>{new Date(job.closingDate).toLocaleDateString()}</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </PublicShell>
  );
}
