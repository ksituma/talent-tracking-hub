
/**
 * Database Schema for Talent ATS
 * 
 * This file defines the schema for the application database.
 * It can be used as a reference for implementing the backend with technologies
 * like Prisma, TypeORM, Sequelize, or other ORM tools.
 */

/**
 * User - Represents admin users who can access the system
 */
export interface User {
  id: string;            // Primary key, UUID
  email: string;         // Email address (unique)
  password: string;      // Hashed password
  firstName: string;     // First name
  lastName: string;      // Last name
  role: 'admin' | 'recruiter' | 'manager'; // User role
  createdAt: Date;       // When the user was created
  updatedAt: Date;       // When the user was last updated
}

/**
 * Job - Represents a job posting
 */
export interface Job {
  id: string;            // Primary key, UUID
  title: string;         // Job title
  company: string;       // Company name
  location: string;      // Job location
  type: string;          // Job type (full-time, part-time, contract)
  salary: string;        // Salary range
  description: string;   // Job description
  requirements: string[];// Job requirements
  skills: string[];      // Required skills
  minQualification: string; // Minimum qualification
  yearsOfExperience: number; // Required years of experience
  postedDate: Date;      // When the job was posted
  closingDate: Date;     // Application deadline
  featured: boolean;     // Whether the job is featured
  logo?: string;         // Company logo URL
  createdAt: Date;       // When the job was created
  updatedAt: Date;       // When the job was last updated
  createdBy: string;     // References User.id who created this job
}

/**
 * Candidate - Represents a job applicant
 */
export interface Candidate {
  id: string;            // Primary key, UUID
  firstName: string;     // First name
  lastName: string;      // Last name
  email: string;         // Email address (unique)
  phone: string;         // Phone number
  address: string;       // Address
  resume: string;        // Resume file URL
  coverLetter?: string;  // Cover letter file URL
  skills: string[];      // Candidate skills
  createdAt: Date;       // When the candidate was created
  updatedAt: Date;       // When the candidate was last updated
}

/**
 * Application - Represents a job application
 */
export interface Application {
  id: string;            // Primary key, UUID
  jobId: string;         // References Job.id
  candidateId: string;   // References Candidate.id
  status: 'applied' | 'screening' | 'interview' | 'shortlisted' | 'offered' | 'hired' | 'rejected'; // Application status
  notes?: string;        // Internal notes
  applicationDate: Date; // When the application was submitted
  updatedAt: Date;       // When the application was last updated
}

/**
 * Education - Represents candidate's education history
 */
export interface Education {
  id: string;            // Primary key, UUID
  candidateId: string;   // References Candidate.id
  institution: string;   // Institution name
  degree: string;        // Degree obtained
  fieldOfStudy: string;  // Field of study
  startDate: Date;       // Start date
  endDate?: Date;        // End date (can be null if still studying)
  grade?: string;        // Grade/GPA
  createdAt: Date;       // When the record was created
  updatedAt: Date;       // When the record was last updated
}

/**
 * Experience - Represents candidate's work experience
 */
export interface Experience {
  id: string;            // Primary key, UUID
  candidateId: string;   // References Candidate.id
  company: string;       // Company name
  position: string;      // Job position
  location?: string;     // Job location
  startDate: Date;       // Start date
  endDate?: Date;        // End date (can be null if current job)
  description?: string;  // Job description
  createdAt: Date;       // When the record was created
  updatedAt: Date;       // When the record was last updated
}

/**
 * ProfessionalBody - Represents candidate's professional affiliations
 */
export interface ProfessionalBody {
  id: string;            // Primary key, UUID
  candidateId: string;   // References Candidate.id
  name: string;          // Name of professional body
  membershipNumber?: string; // Membership number
  joinDate: Date;        // Date joined
  expiryDate?: Date;     // Expiry date (if applicable)
  createdAt: Date;       // When the record was created
  updatedAt: Date;       // When the record was last updated
}

/**
 * Publication - Represents candidate's publications
 */
export interface Publication {
  id: string;            // Primary key, UUID
  candidateId: string;   // References Candidate.id
  title: string;         // Publication title
  publisher: string;     // Publisher name
  publicationDate: Date; // Publication date
  description?: string;  // Description
  url?: string;          // URL to the publication
  createdAt: Date;       // When the record was created
  updatedAt: Date;       // When the record was last updated
}

/**
 * ShortCourse - Represents candidate's short courses/certifications
 */
export interface ShortCourse {
  id: string;            // Primary key, UUID
  candidateId: string;   // References Candidate.id
  name: string;          // Course name
  provider: string;      // Course provider
  completionDate: Date;  // Completion date
  expiryDate?: Date;     // Expiry date (if applicable)
  credentialURL?: string; // URL to verify credential
  createdAt: Date;       // When the record was created
  updatedAt: Date;       // When the record was last updated
}

/**
 * Referee - Represents candidate's referees
 */
export interface Referee {
  id: string;            // Primary key, UUID
  candidateId: string;   // References Candidate.id
  name: string;          // Referee name
  position: string;      // Referee position
  company: string;       // Referee company
  email: string;         // Referee email
  phone?: string;        // Referee phone number
  relationship: string;  // Relationship to candidate
  createdAt: Date;       // When the record was created
  updatedAt: Date;       // When the record was last updated
}

/**
 * ShortlistingCriteria - Represents criteria for shortlisting candidates
 */
export interface ShortlistingCriteria {
  id: string;            // Primary key, UUID
  jobId: string;         // References Job.id
  minYearsExperience: number; // Minimum years of experience
  minEducationLevel: string; // Minimum education level
  requiredSkills: string[]; // Required skills
  weightExperience: number; // Weight for experience score (0-100)
  weightEducation: number;  // Weight for education score (0-100)
  weightSkills: number;     // Weight for skills match score (0-100)
  createdAt: Date;       // When the record was created
  updatedAt: Date;       // When the record was last updated
  createdBy: string;     // References User.id who created this criteria
}

/**
 * Example SQL for creating the Job table (PostgreSQL syntax):
 * 
 * CREATE TABLE jobs (
 *   id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
 *   title VARCHAR(255) NOT NULL,
 *   company VARCHAR(255) NOT NULL,
 *   location VARCHAR(255) NOT NULL,
 *   type VARCHAR(50) NOT NULL,
 *   salary VARCHAR(100) NOT NULL,
 *   description TEXT NOT NULL,
 *   requirements TEXT[] NOT NULL,
 *   skills TEXT[] NOT NULL,
 *   min_qualification VARCHAR(100) NOT NULL,
 *   years_of_experience INTEGER NOT NULL,
 *   posted_date TIMESTAMP NOT NULL,
 *   closing_date TIMESTAMP NOT NULL,
 *   featured BOOLEAN DEFAULT false,
 *   logo VARCHAR(255),
 *   created_at TIMESTAMP DEFAULT NOW(),
 *   updated_at TIMESTAMP DEFAULT NOW(),
 *   created_by UUID REFERENCES users(id)
 * );
 */
