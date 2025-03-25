
import React, { useState, useEffect } from 'react';
import { AppShell } from '@/components/layout/AppShell';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger 
} from "@/components/ui/dialog";
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from '@/components/ui/use-toast';
import { Plus, Trash, Edit } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

// Local storage key for fallback job data
const JOBS_STORAGE_KEY = 'talent_ats_jobs';

export default function Jobs() {
  // Initialize state
  const [jobs, setJobs] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [currentJob, setCurrentJob] = useState({
    id: null,
    title: '',
    company: '',
    location: '',
    type: 'Full-time',
    salary: '',
    postedDate: new Date().toISOString().split('T')[0],
    closingDate: '',
    description: '',
    requirements: [],
    skills: [],
    featured: false,
    yearsOfExperience: 0,
    minQualification: 'Bachelor\'s Degree'
  });

  // Fetch jobs from Supabase
  useEffect(() => {
    const fetchJobs = async () => {
      setIsLoading(true);
      try {
        const { data, error } = await supabase
          .from('jobs')
          .select('*')
          .order('postedDate', { ascending: false });
          
        if (error) {
          console.error('Error fetching jobs:', error);
          toast({
            variant: "destructive",
            title: "Failed to fetch jobs",
            description: error.message
          });
          
          // Fall back to localStorage if there's an error
          const savedJobs = localStorage.getItem(JOBS_STORAGE_KEY);
          if (savedJobs) {
            setJobs(JSON.parse(savedJobs));
          }
        } else {
          console.log('Jobs fetched successfully:', data);
          
          if (data && data.length > 0) {
            setJobs(data);
          } else {
            // If no jobs in database, fall back to localStorage
            const savedJobs = localStorage.getItem(JOBS_STORAGE_KEY);
            if (savedJobs) {
              setJobs(JSON.parse(savedJobs));
            }
          }
        }
      } catch (error) {
        console.error('Unexpected error:', error);
        toast({
          variant: "destructive",
          title: "An unexpected error occurred",
          description: "Could not fetch jobs"
        });
        
        // Fall back to localStorage on unexpected errors
        const savedJobs = localStorage.getItem(JOBS_STORAGE_KEY);
        if (savedJobs) {
          setJobs(JSON.parse(savedJobs));
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchJobs();
  }, []);

  // Save jobs to localStorage whenever they change (as a backup)
  useEffect(() => {
    if (jobs.length > 0) {
      localStorage.setItem(JOBS_STORAGE_KEY, JSON.stringify(jobs));
    }
  }, [jobs]);

  const handleDialogClose = () => {
    setIsDialogOpen(false);
    setIsEditMode(false);
    setCurrentJob({
      id: null,
      title: '',
      company: '',
      location: '',
      type: 'Full-time',
      salary: '',
      postedDate: new Date().toISOString().split('T')[0],
      closingDate: '',
      description: '',
      requirements: [],
      skills: [],
      featured: false,
      yearsOfExperience: 0,
      minQualification: 'Bachelor\'s Degree'
    });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCurrentJob(prev => ({ ...prev, [name]: value }));
  };

  const handleSkillsChange = (e) => {
    const skillsArray = e.target.value.split(',').map(skill => skill.trim()).filter(Boolean);
    setCurrentJob(prev => ({ ...prev, skills: skillsArray }));
  };

  const handleRequirementsChange = (e) => {
    const reqArray = e.target.value.split(',').map(req => req.trim()).filter(Boolean);
    setCurrentJob(prev => ({ ...prev, requirements: reqArray }));
  };

  const handleFeaturedChange = (value) => {
    setCurrentJob(prev => ({ ...prev, featured: value === 'true' }));
  };

  const handleTypeChange = (value) => {
    setCurrentJob(prev => ({ ...prev, type: value }));
  };

  const handleYearsOfExpChange = (e) => {
    const years = parseInt(e.target.value) || 0;
    setCurrentJob(prev => ({ ...prev, yearsOfExperience: years }));
  };

  const handleMinQualificationChange = (value) => {
    setCurrentJob(prev => ({ ...prev, minQualification: value }));
  };

  const handleEditJob = (job) => {
    // Ensure dates are formatted correctly for the input fields
    const formattedJob = {
      ...job,
      postedDate: job.postedDate ? new Date(job.postedDate).toISOString().split('T')[0] : '',
      closingDate: job.closingDate ? new Date(job.closingDate).toISOString().split('T')[0] : '',
      requirements: job.requirements || [],
      skills: job.skills || [],
      yearsOfExperience: job.yearsOfExperience || 0,
      minQualification: job.minQualification || 'Bachelor\'s Degree'
    };
    
    setCurrentJob(formattedJob);
    setIsEditMode(true);
    setIsDialogOpen(true);
  };

  const handleDeleteJob = async (jobId) => {
    if (window.confirm('Are you sure you want to delete this job?')) {
      try {
        const { error } = await supabase
          .from('jobs')
          .delete()
          .eq('id', jobId);
          
        if (error) {
          console.error('Error deleting job:', error);
          toast({
            variant: "destructive",
            title: "Failed to delete job",
            description: error.message
          });
          return;
        }
        
        // Update local state after successful deletion
        setJobs(jobs.filter(job => job.id !== jobId));
        
        toast({
          title: "Job deleted",
          description: "The job posting has been successfully deleted."
        });
      } catch (error) {
        console.error('Unexpected error deleting job:', error);
        toast({
          variant: "destructive",
          title: "An unexpected error occurred",
          description: "Could not delete the job"
        });
      }
    }
  };

  const handleSaveJob = async () => {
    if (!currentJob.title || !currentJob.company || !currentJob.description) {
      toast({
        variant: "destructive",
        title: "Required fields missing",
        description: "Please fill out all required fields."
      });
      return;
    }

    try {
      if (isEditMode) {
        // Update existing job
        const { error } = await supabase
          .from('jobs')
          .update({
            title: currentJob.title,
            company: currentJob.company,
            location: currentJob.location,
            type: currentJob.type,
            salary: currentJob.salary,
            description: currentJob.description,
            requirements: currentJob.requirements,
            skills: currentJob.skills,
            minQualification: currentJob.minQualification,
            yearsOfExperience: currentJob.yearsOfExperience,
            closingDate: currentJob.closingDate,
            featured: currentJob.featured,
            updatedAt: new Date().toISOString()
          })
          .eq('id', currentJob.id);
          
        if (error) {
          console.error('Error updating job:', error);
          toast({
            variant: "destructive",
            title: "Failed to update job",
            description: error.message
          });
          return;
        }
        
        // Update local state
        setJobs(jobs.map(job => 
          job.id === currentJob.id ? { ...job, ...currentJob } : job
        ));
        
        toast({
          title: "Job updated",
          description: "The job posting has been successfully updated."
        });
      } else {
        // Add new job
        const newJob = {
          title: currentJob.title,
          company: currentJob.company,
          location: currentJob.location,
          type: currentJob.type,
          salary: currentJob.salary,
          description: currentJob.description,
          requirements: currentJob.requirements,
          skills: currentJob.skills,
          minQualification: currentJob.minQualification,
          yearsOfExperience: currentJob.yearsOfExperience,
          postedDate: new Date().toISOString(),
          closingDate: currentJob.closingDate ? new Date(currentJob.closingDate).toISOString() : null,
          featured: currentJob.featured
        };
        
        const { data, error } = await supabase
          .from('jobs')
          .insert(newJob)
          .select();
          
        if (error) {
          console.error('Error adding job:', error);
          toast({
            variant: "destructive",
            title: "Failed to add job",
            description: error.message
          });
          return;
        }
        
        // Update local state with the newly created job
        setJobs([data[0], ...jobs]);
        
        toast({
          title: "Job added",
          description: "New job posting has been successfully added."
        });
      }
      
      // Close the dialog
      handleDialogClose();
    } catch (error) {
      console.error('Unexpected error saving job:', error);
      toast({
        variant: "destructive",
        title: "An unexpected error occurred",
        description: "Could not save the job"
      });
    }
  };

  return (
    <AppShell>
      <div className="container mx-auto py-6">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="text-2xl font-bold">Job Listings</h2>
            <p className="text-gray-600">Manage job postings and vacancies</p>
          </div>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button className="flex items-center gap-2" onClick={() => {
                setIsEditMode(false);
                setCurrentJob({
                  id: 0,
                  title: '',
                  company: '',
                  location: '',
                  type: 'Full-time',
                  salary: '',
                  postedDate: new Date().toISOString().split('T')[0],
                  closingDate: '',
                  description: '',
                  requirements: [],
                  skills: [],
                  featured: false,
                  yearsOfExperience: 0,
                  minQualification: 'Bachelor\'s Degree'
                });
              }}>
                <Plus className="h-4 w-4" />
                Add New Job
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[600px]">
              <DialogHeader>
                <DialogTitle>
                  {isEditMode ? "Edit Job Posting" : "Add New Job Posting"}
                </DialogTitle>
                <DialogDescription>
                  {isEditMode 
                    ? "Update the job details below and save your changes." 
                    : "Fill out the form below to create a new job posting."}
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4 max-h-[70vh] overflow-y-auto">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="title">Job Title*</Label>
                    <Input 
                      id="title" 
                      name="title" 
                      value={currentJob.title} 
                      onChange={handleInputChange}
                      placeholder="e.g. Senior Software Engineer"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="company">Company Name*</Label>
                    <Input 
                      id="company" 
                      name="company" 
                      value={currentJob.company} 
                      onChange={handleInputChange}
                      placeholder="e.g. Acme Inc."
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="location">Location</Label>
                    <Input 
                      id="location" 
                      name="location" 
                      value={currentJob.location} 
                      onChange={handleInputChange}
                      placeholder="e.g. New York, NY"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="type">Job Type</Label>
                    <Select 
                      onValueChange={handleTypeChange} 
                      defaultValue={currentJob.type}
                    >
                      <SelectTrigger id="type">
                        <SelectValue placeholder="Select job type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Full-time">Full-time</SelectItem>
                        <SelectItem value="Part-time">Part-time</SelectItem>
                        <SelectItem value="Contract">Contract</SelectItem>
                        <SelectItem value="Freelance">Freelance</SelectItem>
                        <SelectItem value="Internship">Internship</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="yearsOfExperience">Years of Experience*</Label>
                    <Input 
                      id="yearsOfExperience" 
                      name="yearsOfExperience" 
                      type="number" 
                      min="0"
                      value={currentJob.yearsOfExperience} 
                      onChange={handleYearsOfExpChange}
                      placeholder="e.g. 3"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="minQualification">Minimum Qualification*</Label>
                    <Select 
                      onValueChange={handleMinQualificationChange} 
                      defaultValue={currentJob.minQualification}
                    >
                      <SelectTrigger id="minQualification">
                        <SelectValue placeholder="Select minimum qualification" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="High School">High School</SelectItem>
                        <SelectItem value="Associate's Degree">Associate's Degree</SelectItem>
                        <SelectItem value="Bachelor's Degree">Bachelor's Degree</SelectItem>
                        <SelectItem value="Master's Degree">Master's Degree</SelectItem>
                        <SelectItem value="PhD">PhD</SelectItem>
                        <SelectItem value="None">None</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="salary">Salary Range</Label>
                    <Input 
                      id="salary" 
                      name="salary" 
                      value={currentJob.salary} 
                      onChange={handleInputChange}
                      placeholder="e.g. $80,000 - $100,000"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="closingDate">Closing Date</Label>
                    <Input 
                      id="closingDate" 
                      name="closingDate" 
                      type="date" 
                      value={currentJob.closingDate} 
                      onChange={handleInputChange}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="description">Job Description*</Label>
                  <Textarea 
                    id="description" 
                    name="description" 
                    value={currentJob.description} 
                    onChange={handleInputChange}
                    placeholder="Describe the job role and responsibilities"
                    rows={3}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="requirements">Requirements (comma separated)</Label>
                  <Textarea 
                    id="requirements" 
                    name="requirements" 
                    value={currentJob.requirements.join(', ')} 
                    onChange={handleRequirementsChange}
                    placeholder="e.g. 3+ years experience, Bachelor's degree, etc."
                    rows={2}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="skills">Required Skills (comma separated)</Label>
                  <Textarea 
                    id="skills" 
                    name="skills" 
                    value={currentJob.skills.join(', ')} 
                    onChange={handleSkillsChange}
                    placeholder="e.g. JavaScript, React, Node.js"
                    rows={2}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="featured">Featured Job</Label>
                  <Select 
                    onValueChange={handleFeaturedChange} 
                    defaultValue={currentJob.featured.toString()}
                  >
                    <SelectTrigger id="featured">
                      <SelectValue placeholder="Is this a featured job?" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="true">Yes</SelectItem>
                      <SelectItem value="false">No</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={handleDialogClose}>
                  Cancel
                </Button>
                <Button onClick={handleSaveJob}>
                  {isEditMode ? "Save Changes" : "Add Job"}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
        
        <Card>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Job Title</TableHead>
                  <TableHead>Company</TableHead>
                  <TableHead>Location</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Min. Exp</TableHead>
                  <TableHead>Min. Qual</TableHead>
                  <TableHead>Posted Date</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {jobs.map((job) => (
                  <TableRow key={job.id}>
                    <TableCell className="font-medium">{job.title}</TableCell>
                    <TableCell>{job.company}</TableCell>
                    <TableCell>{job.location}</TableCell>
                    <TableCell>{job.type}</TableCell>
                    <TableCell>{job.yearsOfExperience}+ years</TableCell>
                    <TableCell>{job.minQualification}</TableCell>
                    <TableCell>{new Date(job.postedDate).toLocaleDateString()}</TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          onClick={() => handleEditJob(job)}
                          className="flex items-center gap-1"
                        >
                          <Edit className="h-4 w-4" />
                          Edit
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="text-red-500 hover:text-red-700 hover:bg-red-50 flex items-center gap-1"
                          onClick={() => handleDeleteJob(job.id)}
                        >
                          <Trash className="h-4 w-4" />
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
      </div>
    </AppShell>
  );
}
