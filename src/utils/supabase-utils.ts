import { supabase } from '@/integrations/supabase/client';

/**
 * Utility functions for interacting with the Supabase database
 */

/**
 * Fetches all jobs from the database
 */
export const fetchJobs = async () => {
  const { data, error } = await supabase
    .from('jobs')
    .select('*')
    .order('posteddate', { ascending: false });

  if (error) {
    console.error('Error fetching jobs:', error);
    throw error;
  }

  // Map database column names to camelCase for frontend consistency
  return data.map(job => ({
    id: job.id,
    title: job.title,
    company: job.company,
    location: job.location,
    type: job.type,
    salary: job.salary,
    description: job.description,
    requirements: job.requirements,
    skills: job.skills,
    minQualification: job.minqualification,
    yearsOfExperience: job.yearsofexperience,
    postedDate: job.posteddate,
    closingDate: job.closingdate,
    featured: job.featured,
    logo: job.logo,
    createdAt: job.createdat,
    updatedAt: job.updatedat,
    createdBy: job.createdby
  }));
};

/**
 * Fetches a single job by ID
 */
export const fetchJobById = async (id: string) => {
  const { data, error } = await supabase
    .from('jobs')
    .select('*')
    .eq('id', id)
    .single();

  if (error) {
    console.error(`Error fetching job with ID ${id}:`, error);
    throw error;
  }

  // Map database column names to camelCase for frontend consistency
  return {
    id: data.id,
    title: data.title,
    company: data.company,
    location: data.location,
    type: data.type,
    salary: data.salary,
    description: data.description,
    requirements: data.requirements,
    skills: data.skills,
    minQualification: data.minqualification,
    yearsOfExperience: data.yearsofexperience,
    postedDate: data.posteddate,
    closingDate: data.closingdate,
    featured: data.featured,
    logo: data.logo,
    createdAt: data.createdat,
    updatedAt: data.updatedat,
    createdBy: data.createdby
  };
};

/**
 * Creates a new job
 */
export const createJob = async (jobData: any) => {
  // Map frontend camelCase to database column names
  const dbJobData = {
    title: jobData.title,
    company: jobData.company,
    location: jobData.location,
    type: jobData.type,
    salary: jobData.salary,
    description: jobData.description,
    requirements: jobData.requirements,
    skills: jobData.skills,
    minqualification: jobData.minQualification,
    yearsofexperience: jobData.yearsOfExperience,
    posteddate: jobData.postedDate,
    closingdate: jobData.closingDate,
    featured: jobData.featured,
    logo: jobData.logo
  };

  const { data, error } = await supabase
    .from('jobs')
    .insert(dbJobData)
    .select();

  if (error) {
    console.error('Error creating job:', error);
    throw error;
  }

  // Map back to camelCase for frontend consistency
  return {
    id: data[0].id,
    title: data[0].title,
    company: data[0].company,
    location: data[0].location,
    type: data[0].type,
    salary: data[0].salary,
    description: data[0].description,
    requirements: data[0].requirements,
    skills: data[0].skills,
    minQualification: data[0].minqualification,
    yearsOfExperience: data[0].yearsofexperience,
    postedDate: data[0].posteddate,
    closingDate: data[0].closingdate,
    featured: data[0].featured,
    logo: data[0].logo,
    createdAt: data[0].createdat,
    updatedAt: data[0].updatedat,
    createdBy: data[0].createdby
  };
};

/**
 * Updates an existing job
 */
export const updateJob = async (id: string, jobData: any) => {
  // Map frontend camelCase to database column names
  const dbJobData = {
    title: jobData.title,
    company: jobData.company,
    location: jobData.location,
    type: jobData.type,
    salary: jobData.salary,
    description: jobData.description,
    requirements: jobData.requirements,
    skills: jobData.skills,
    minqualification: jobData.minQualification,
    yearsofexperience: jobData.yearsOfExperience,
    closingdate: jobData.closingDate,
    featured: jobData.featured,
    logo: jobData.logo,
    updatedat: new Date().toISOString()
  };

  const { data, error } = await supabase
    .from('jobs')
    .update(dbJobData)
    .eq('id', id)
    .select();

  if (error) {
    console.error(`Error updating job with ID ${id}:`, error);
    throw error;
  }

  // Map back to camelCase for frontend consistency
  return {
    id: data[0].id,
    title: data[0].title,
    company: data[0].company,
    location: data[0].location,
    type: data[0].type,
    salary: data[0].salary,
    description: data[0].description,
    requirements: data[0].requirements,
    skills: data[0].skills,
    minQualification: data[0].minqualification,
    yearsOfExperience: data[0].yearsofexperience,
    postedDate: data[0].posteddate,
    closingDate: data[0].closingdate,
    featured: data[0].featured,
    logo: data[0].logo,
    createdAt: data[0].createdat,
    updatedAt: data[0].updatedat,
    createdBy: data[0].createdby
  };
};

/**
 * Deletes a job by ID
 */
export const deleteJob = async (id: string) => {
  const { error } = await supabase
    .from('jobs')
    .delete()
    .eq('id', id);

  if (error) {
    console.error(`Error deleting job with ID ${id}:`, error);
    throw error;
  }

  return true;
};

/**
 * Fetches all candidates from the database
 */
export const fetchCandidates = async () => {
  const { data, error } = await supabase
    .from('candidates')
    .select('*')
    .order('createdat', { ascending: false });

  if (error) {
    console.error('Error fetching candidates:', error);
    throw error;
  }

  // Map database column names to camelCase for frontend consistency
  return data.map(candidate => ({
    id: candidate.id,
    firstName: candidate.firstname,
    lastName: candidate.lastname,
    email: candidate.email,
    phone: candidate.phone,
    address: candidate.address,
    resume: candidate.resume,
    coverLetter: candidate.coverletter,
    skills: candidate.skills,
    createdAt: candidate.createdat,
    updatedAt: candidate.updatedat
  }));
};

/**
 * Creates a new application
 */
export const createApplication = async (applicationData: any) => {
  // Map frontend camelCase to database column names
  const dbApplicationData = {
    jobid: applicationData.jobId,
    candidateid: applicationData.candidateId,
    status: applicationData.status,
    notes: applicationData.notes,
    applicationdate: applicationData.applicationDate || new Date().toISOString()
  };

  const { data, error } = await supabase
    .from('applications')
    .insert(dbApplicationData)
    .select();

  if (error) {
    console.error('Error creating application:', error);
    throw error;
  }

  // Map back to camelCase for frontend consistency
  return {
    id: data[0].id,
    jobId: data[0].jobid,
    candidateId: data[0].candidateid,
    status: data[0].status,
    notes: data[0].notes,
    applicationDate: data[0].applicationdate,
    updatedAt: data[0].updatedat
  };
};

/**
 * Fetches applications for a candidate
 */
export const fetchCandidateApplications = async (candidateId: string) => {
  const { data, error } = await supabase
    .from('applications')
    .select(`
      *,
      jobs:jobid (*)
    `)
    .eq('candidateid', candidateId);

  if (error) {
    console.error('Error fetching candidate applications:', error);
    throw error;
  }

  // Map database column names to camelCase for frontend consistency
  return data.map(app => ({
    id: app.id,
    jobId: app.jobid,
    candidateId: app.candidateid,
    status: app.status,
    notes: app.notes,
    applicationDate: app.applicationdate,
    updatedAt: app.updatedat,
    job: app.jobs ? {
      id: app.jobs.id,
      title: app.jobs.title,
      company: app.jobs.company,
      location: app.jobs.location,
      type: app.jobs.type,
      // ... other job fields mapped from app.jobs
    } : null
  }));
};

/**
 * Fetches applications for a job
 */
export const fetchJobApplications = async (jobId: string) => {
  const { data, error } = await supabase
    .from('applications')
    .select(`
      *,
      candidates:candidateid (*)
    `)
    .eq('jobid', jobId);

  if (error) {
    console.error('Error fetching job applications:', error);
    throw error;
  }

  // Map database column names to camelCase for frontend consistency
  return data.map(app => ({
    id: app.id,
    jobId: app.jobid,
    candidateId: app.candidateid,
    status: app.status,
    notes: app.notes,
    applicationDate: app.applicationdate,
    updatedAt: app.updatedat,
    candidate: app.candidates ? {
      id: app.candidates.id,
      firstName: app.candidates.firstname,
      lastName: app.candidates.lastname,
      email: app.candidates.email,
      // ... other candidate fields mapped from app.candidates
    } : null
  }));
};

/**
 * Updates an application status
 */
export const updateApplicationStatus = async (applicationId: string, status: string) => {
  const { data, error } = await supabase
    .from('applications')
    .update({ 
      status, 
      updatedat: new Date().toISOString() 
    })
    .eq('id', applicationId)
    .select();

  if (error) {
    console.error(`Error updating application status for ID ${applicationId}:`, error);
    throw error;
  }

  // Map back to camelCase for frontend consistency
  return {
    id: data[0].id,
    jobId: data[0].jobid,
    candidateId: data[0].candidateid,
    status: data[0].status,
    notes: data[0].notes,
    applicationDate: data[0].applicationdate,
    updatedAt: data[0].updatedat
  };
};

