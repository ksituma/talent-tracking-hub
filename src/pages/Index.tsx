import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { AppShell } from '@/components/layout/AppShell';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Briefcase, MapPin, Clock, Calendar, ChevronRight, Search, ArrowRight, GraduationCap, Clock1, Check, AlertCircle } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/components/ui/use-toast';

// Local storage key for fallback job data
const JOBS_STORAGE_KEY = 'talent_ats_jobs';

export default function Index() {
  const [searchTerm, setSearchTerm] = useState('');
  const [jobs, setJobs] = useState([]);
  const [connectionStatus, setConnectionStatus] = useState<'loading' | 'success' | 'error'>('loading');
  
  // Test Supabase connection and fetch jobs
  useEffect(() => {
    const fetchJobsAndTestConnection = async () => {
      try {
        // Test connection by checking if we can get the auth session
        const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
        
        if (sessionError) {
          console.error('Supabase connection error:', sessionError);
          setConnectionStatus('error');
          toast({
            title: 'Database Connection Error',
            description: 'Could not connect to Supabase. Check console for details.',
            variant: 'destructive'
          });
          
          // Fall back to localStorage data
          const savedJobs = localStorage.getItem(JOBS_STORAGE_KEY);
          if (savedJobs) {
            setJobs(JSON.parse(savedJobs));
          }
          return;
        }
        
        // Connection successful, now try to fetch jobs from the database
        const { data: jobsData, error: jobsError } = await supabase
          .from('jobs')
          .select('*')
          .order('postedDate', { ascending: false });
          
        if (jobsError) {
          console.error('Error fetching jobs:', jobsError);
          toast({
            title: 'Error Fetching Jobs',
            description: 'Could not fetch jobs from the database.',
            variant: 'destructive'
          });
          
          // Fall back to localStorage data
          const savedJobs = localStorage.getItem(JOBS_STORAGE_KEY);
          if (savedJobs) {
            setJobs(JSON.parse(savedJobs));
          }
        } else {
          console.log('Jobs fetched successfully:', jobsData);
          
          if (jobsData && jobsData.length > 0) {
            setJobs(jobsData);
          } else {
            // If no jobs in database, fall back to localStorage
            console.log('No jobs found in database, using localStorage data');
            const savedJobs = localStorage.getItem(JOBS_STORAGE_KEY);
            if (savedJobs) {
              const localJobs = JSON.parse(savedJobs);
              setJobs(localJobs);
              
              // Optionally: sync localStorage jobs to database
              // This commented section could be uncommented if you want to automatically
              // add the localStorage jobs to the database when none exist
              /*
              try {
                for (const job of localJobs) {
                  const { error } = await supabase.from('jobs').insert({
                    ...job,
                    postedDate: new Date(job.postedDate).toISOString(),
                    closingDate: new Date(job.closingDate).toISOString(),
                    requirements: job.requirements || [],
                    skills: job.skills || []
                  });
                  if (error) console.error('Error syncing job to database:', error);
                }
                console.log('Jobs synced to database');
              } catch (syncError) {
                console.error('Error syncing jobs to database:', syncError);
              }
              */
            }
          }
        }
        
        setConnectionStatus('success');
        toast({
          title: 'Database Connection Successful',
          description: 'Successfully connected to Supabase!',
          variant: 'default'
        });
      } catch (error) {
        console.error('Supabase connection test failed:', error);
        setConnectionStatus('error');
        toast({
          title: 'Database Connection Test Failed',
          description: 'An unexpected error occurred testing the connection.',
          variant: 'destructive'
        });
        
        // Fall back to localStorage data
        const savedJobs = localStorage.getItem(JOBS_STORAGE_KEY);
        if (savedJobs) {
          setJobs(JSON.parse(savedJobs));
        }
      }
    };

    fetchJobsAndTestConnection();
  }, []);
  
  const filteredJobs = jobs.filter(job => 
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
            
            {/* Supabase Connection Status */}
            <div className="mb-4 flex items-center justify-center gap-2">
              <span className="text-sm">Supabase Connection:</span>
              {connectionStatus === 'loading' && (
                <Badge variant="outline" className="bg-yellow-500/20 text-yellow-200">
                  <span className="animate-pulse mr-1">●</span> Testing...
                </Badge>
              )}
              {connectionStatus === 'success' && (
                <Badge variant="outline" className="bg-green-500/20 text-green-200">
                  <Check className="h-3 w-3 mr-1" /> Connected
                </Badge>
              )}
              {connectionStatus === 'error' && (
                <Badge variant="outline" className="bg-red-500/20 text-red-200">
                  <AlertCircle className="h-3 w-3 mr-1" /> Error
                </Badge>
              )}
            </div>
            
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
                    <div className="flex flex-wrap gap-x-4 gap-y-2">
                      <div className="flex items-center">
                        <Clock1 className="h-4 w-4 mr-2 text-gray-500" />
                        <span>{job.yearsOfExperience}+ years experience</span>
                      </div>
                      <div className="flex items-center">
                        <GraduationCap className="h-4 w-4 mr-2 text-gray-500" />
                        <span>{job.minQualification}</span>
                      </div>
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
                <CardFooter className="flex justify-between pt-2 border-t">
                  <Link to={`/jobs/${job.id}`}>
                    <Button variant="ghost" size="sm" className="text-blue-600 flex items-center gap-1">
                      View Details
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  </Link>
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
