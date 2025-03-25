
-- Database Schema for Talent ATS
-- This script initializes the PostgreSQL database with the required tables

-- Create extension for UUID generation
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Users table
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email VARCHAR(255) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  firstName VARCHAR(100) NOT NULL,
  lastName VARCHAR(100) NOT NULL,
  role VARCHAR(20) CHECK (role IN ('admin', 'recruiter', 'manager')) NOT NULL,
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Jobs table
CREATE TABLE IF NOT EXISTS jobs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title VARCHAR(255) NOT NULL,
  company VARCHAR(255) NOT NULL,
  location VARCHAR(255) NOT NULL,
  type VARCHAR(50) NOT NULL,
  salary VARCHAR(100) NOT NULL,
  description TEXT NOT NULL,
  requirements TEXT[] NOT NULL,
  skills TEXT[] NOT NULL,
  minQualification VARCHAR(100) NOT NULL,
  yearsOfExperience INTEGER NOT NULL,
  postedDate TIMESTAMP NOT NULL,
  closingDate TIMESTAMP NOT NULL,
  featured BOOLEAN DEFAULT false,
  logo VARCHAR(255),
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  createdBy UUID REFERENCES users(id)
);

-- Candidates table
CREATE TABLE IF NOT EXISTS candidates (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  firstName VARCHAR(100) NOT NULL,
  lastName VARCHAR(100) NOT NULL,
  email VARCHAR(255) NOT NULL UNIQUE,
  phone VARCHAR(50) NOT NULL,
  address TEXT NOT NULL,
  resume VARCHAR(255) NOT NULL,
  coverLetter VARCHAR(255),
  skills TEXT[],
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Applications table
CREATE TABLE IF NOT EXISTS applications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  jobId UUID REFERENCES jobs(id) NOT NULL,
  candidateId UUID REFERENCES candidates(id) NOT NULL,
  status VARCHAR(20) CHECK (status IN ('applied', 'screening', 'interview', 'shortlisted', 'offered', 'hired', 'rejected')) NOT NULL,
  notes TEXT,
  applicationDate TIMESTAMP NOT NULL,
  updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Education table
CREATE TABLE IF NOT EXISTS education (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  candidateId UUID REFERENCES candidates(id) NOT NULL,
  institution VARCHAR(255) NOT NULL,
  degree VARCHAR(100) NOT NULL,
  fieldOfStudy VARCHAR(100) NOT NULL,
  startDate DATE NOT NULL,
  endDate DATE,
  grade VARCHAR(50),
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Experience table
CREATE TABLE IF NOT EXISTS experience (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  candidateId UUID REFERENCES candidates(id) NOT NULL,
  company VARCHAR(255) NOT NULL,
  position VARCHAR(100) NOT NULL,
  location VARCHAR(255),
  startDate DATE NOT NULL,
  endDate DATE,
  description TEXT,
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Professional bodies table
CREATE TABLE IF NOT EXISTS professional_bodies (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  candidateId UUID REFERENCES candidates(id) NOT NULL,
  name VARCHAR(255) NOT NULL,
  membershipNumber VARCHAR(100),
  joinDate DATE NOT NULL,
  expiryDate DATE,
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Publications table
CREATE TABLE IF NOT EXISTS publications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  candidateId UUID REFERENCES candidates(id) NOT NULL,
  title VARCHAR(255) NOT NULL,
  publisher VARCHAR(255) NOT NULL,
  publicationDate DATE NOT NULL,
  description TEXT,
  url VARCHAR(255),
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Short courses table
CREATE TABLE IF NOT EXISTS short_courses (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  candidateId UUID REFERENCES candidates(id) NOT NULL,
  name VARCHAR(255) NOT NULL,
  provider VARCHAR(255) NOT NULL,
  completionDate DATE NOT NULL,
  expiryDate DATE,
  credentialURL VARCHAR(255),
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Referees table
CREATE TABLE IF NOT EXISTS referees (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  candidateId UUID REFERENCES candidates(id) NOT NULL,
  name VARCHAR(255) NOT NULL,
  position VARCHAR(100) NOT NULL,
  company VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL,
  phone VARCHAR(50),
  relationship VARCHAR(100) NOT NULL,
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Shortlisting criteria table
CREATE TABLE IF NOT EXISTS shortlisting_criteria (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  jobId UUID REFERENCES jobs(id) NOT NULL,
  minYearsExperience INTEGER NOT NULL,
  minEducationLevel VARCHAR(100) NOT NULL,
  requiredSkills TEXT[] NOT NULL,
  weightExperience INTEGER NOT NULL,
  weightEducation INTEGER NOT NULL,
  weightSkills INTEGER NOT NULL,
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  createdBy UUID REFERENCES users(id) NOT NULL
);

-- Create a default admin user
INSERT INTO users (email, password, firstName, lastName, role)
VALUES ('admin@ats.com', 'situm@2014', 'System', 'Admin', 'admin')
ON CONFLICT (email) DO NOTHING;
