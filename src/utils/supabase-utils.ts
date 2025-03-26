
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

/**
 * Saves settings to the database
 */
export const saveSettings = async (settings: any) => {
  try {
    // Convert from camelCase to snake_case for database
    const dbSettings = {
      company_name: settings.companyName,
      system_email: settings.systemEmail,
      timezone: settings.timezone,
      date_format: settings.dateFormat,
      email_notifications: settings.emailNotifications,
      new_application_alerts: settings.newApplicationAlerts,
      job_posting_expiry_alerts: settings.jobPostingExpiryAlerts,
      min_years_experience: settings.minYearsExperience,
      min_qualification: settings.minQualification,
      skill_match_threshold: settings.skillMatchThreshold,
      automatic_shortlisting: settings.automaticShortlisting,
      updated_at: new Date().toISOString()
    };

    // Execute raw SQL query instead of using the typed API
    // This is a workaround since the settings table isn't in the Supabase types yet
    const { data: existingSettings, error: queryError } = await supabase.rpc(
      'check_settings_exist'
    );

    if (queryError) {
      console.error('Error checking settings:', queryError);
      throw queryError;
    }

    let result;
    
    if (existingSettings) {
      // Update existing settings with raw query
      const { data, error } = await supabase.rpc(
        'update_settings',
        dbSettings
      );
      
      if (error) throw error;
      result = data;
    } else {
      // Insert new settings with raw query
      const { data, error } = await supabase.rpc(
        'create_settings',
        dbSettings
      );
      
      if (error) throw error;
      result = data;
    }

    // Transform the result back to camelCase
    return {
      id: result.id,
      companyName: result.company_name,
      systemEmail: result.system_email,
      timezone: result.timezone,
      dateFormat: result.date_format,
      emailNotifications: result.email_notifications,
      newApplicationAlerts: result.new_application_alerts,
      jobPostingExpiryAlerts: result.job_posting_expiry_alerts,
      minYearsExperience: result.min_years_experience,
      minQualification: result.min_qualification,
      skillMatchThreshold: result.skill_match_threshold,
      automaticShortlisting: result.automatic_shortlisting,
      updatedAt: result.updated_at
    };
  } catch (error) {
    console.error('Error saving settings:', error);
    throw error;
  }
};

/**
 * Fetches settings from the database
 */
export const fetchSettings = async () => {
  try {
    // Execute raw SQL query instead of using the typed API
    const { data, error } = await supabase.rpc('get_settings');

    if (error) throw error;

    if (!data) {
      return null;
    }

    // Transform the result to camelCase
    return {
      id: data.id,
      companyName: data.company_name,
      systemEmail: data.system_email,
      timezone: data.timezone,
      dateFormat: data.date_format,
      emailNotifications: data.email_notifications,
      newApplicationAlerts: data.new_application_alerts,
      jobPostingExpiryAlerts: data.job_posting_expiry_alerts,
      minYearsExperience: data.min_years_experience,
      minQualification: data.min_qualification,
      skillMatchThreshold: data.skill_match_threshold,
      automaticShortlisting: data.automatic_shortlisting,
      updatedAt: data.updated_at
    };
  } catch (error) {
    console.error('Error fetching settings:', error);
    throw error;
  }
};

/**
 * Logs out the user
 */
export const logoutUser = async () => {
  localStorage.removeItem('adminLoggedIn');
  localStorage.removeItem('token');
  localStorage.removeItem('user');
  return true;
};

/**
 * Fetches the user profile
 */
export const getUserProfile = async () => {
  try {
    // Try to get from localStorage first
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      return JSON.parse(storedUser);
    }
    
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .limit(1);

    if (error) throw error;

    if (!data || data.length === 0) {
      return null;
    }

    const user = {
      id: data[0].id,
      email: data[0].email,
      firstName: data[0].firstname,
      lastName: data[0].lastname,
      role: data[0].role
    };
    
    // Store in localStorage for future use
    localStorage.setItem('user', JSON.stringify(user));
    
    return user;
  } catch (error) {
    console.error('Error fetching user profile:', error);
    throw error;
  }
};

/**
 * Login user with credentials
 */
export const loginUser = async (email: string, password: string) => {
  try {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('email', email)
      .eq('password', password)
      .single();

    if (error) {
      console.error('Login error:', error);
      throw new Error('Invalid credentials');
    }

    const user = {
      id: data.id,
      email: data.email,
      firstName: data.firstname,
      lastName: data.lastname,
      role: data.role
    };

    // Store auth data
    localStorage.setItem('adminLoggedIn', 'true');
    localStorage.setItem('token', 'sample-jwt-token');
    localStorage.setItem('user', JSON.stringify(user));

    return {
      token: 'sample-jwt-token',
      user
    };
  } catch (error) {
    console.error('Login error:', error);
    throw error;
  }
};

/**
 * Sends an email
 */
export const sendEmail = async (emailData: {
  to: string | string[],
  subject: string,
  html?: string,
  text?: string,
  from?: string
}) => {
  try {
    const { data, error } = await supabase.functions.invoke('send-email', {
      body: emailData
    });

    if (error) {
      console.error('Error sending email:', error);
      throw error;
    }

    return data;
  } catch (error) {
    console.error('Error sending email:', error);
    throw error;
  }
};
