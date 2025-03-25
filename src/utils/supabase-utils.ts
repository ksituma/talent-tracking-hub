
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
    .order('postedDate', { ascending: false });

  if (error) {
    console.error('Error fetching jobs:', error);
    throw error;
  }

  return data;
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

  return data;
};

/**
 * Creates a new job
 */
export const createJob = async (jobData) => {
  const { data, error } = await supabase
    .from('jobs')
    .insert(jobData)
    .select();

  if (error) {
    console.error('Error creating job:', error);
    throw error;
  }

  return data[0];
};

/**
 * Updates an existing job
 */
export const updateJob = async (id, jobData) => {
  const { data, error } = await supabase
    .from('jobs')
    .update(jobData)
    .eq('id', id)
    .select();

  if (error) {
    console.error(`Error updating job with ID ${id}:`, error);
    throw error;
  }

  return data[0];
};

/**
 * Deletes a job by ID
 */
export const deleteJob = async (id) => {
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
    .order('createdAt', { ascending: false });

  if (error) {
    console.error('Error fetching candidates:', error);
    throw error;
  }

  return data;
};

/**
 * Creates a new application
 */
export const createApplication = async (applicationData) => {
  const { data, error } = await supabase
    .from('applications')
    .insert(applicationData)
    .select();

  if (error) {
    console.error('Error creating application:', error);
    throw error;
  }

  return data[0];
};

/**
 * Fetches applications for a candidate
 */
export const fetchCandidateApplications = async (candidateId) => {
  const { data, error } = await supabase
    .from('applications')
    .select(`
      *,
      jobs:jobId (*)
    `)
    .eq('candidateId', candidateId);

  if (error) {
    console.error('Error fetching candidate applications:', error);
    throw error;
  }

  return data;
};

/**
 * Fetches applications for a job
 */
export const fetchJobApplications = async (jobId) => {
  const { data, error } = await supabase
    .from('applications')
    .select(`
      *,
      candidates:candidateId (*)
    `)
    .eq('jobId', jobId);

  if (error) {
    console.error('Error fetching job applications:', error);
    throw error;
  }

  return data;
};

/**
 * Updates an application status
 */
export const updateApplicationStatus = async (applicationId, status) => {
  const { data, error } = await supabase
    .from('applications')
    .update({ 
      status, 
      updatedAt: new Date().toISOString() 
    })
    .eq('id', applicationId)
    .select();

  if (error) {
    console.error(`Error updating application status for ID ${applicationId}:`, error);
    throw error;
  }

  return data[0];
};
