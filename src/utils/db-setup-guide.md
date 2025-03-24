
# Comprehensive Deployment Guide: Talent ATS with PostgreSQL on Coolify

This guide provides step-by-step instructions for deploying your Talent ATS application to Coolify with a PostgreSQL database.

## Overview of the Deployment Architecture

When deployed, your application will consist of:

1. **Frontend**: The React application (Talent ATS) served by Nginx
2. **Backend**: Express.js API that connects to the PostgreSQL database
3. **Database**: PostgreSQL database managed by Coolify

## Step 1: Sign Up for Coolify

1. Go to [Coolify](https://coolify.io/) and create an account
2. Follow the instructions to install Coolify on your server or use their cloud offering
3. Once installed, access your Coolify dashboard

## Step 2: Create a PostgreSQL Database in Coolify

1. **From your Coolify dashboard**, navigate to "Resources" in the sidebar
2. **Click "New Resource"** and select "PostgreSQL"
3. **Configure your PostgreSQL database**:
   - Name: `talent_ats_db` (or your preferred name)
   - Username: Create a secure username
   - Password: Generate a strong password (store this safely!)
   - Version: 14 or newer recommended
   - Storage: Allocate at least 1GB for this application
4. **Click "Create"** and wait for database provisioning to complete
5. **Record these connection details** provided by Coolify:
   - Host
   - Port (usually 5432)
   - Database name
   - Username
   - Password

## Step 3: Push Your Code to a Git Repository

1. Create a repository on GitHub, GitLab, or another Git provider
2. Push your Talent ATS codebase to the repository
3. Ensure your repository includes:
   - All application code
   - The updated `nginx.conf` file
   - A `Dockerfile` for the frontend (if not already present)

## Step 4: Create a Backend API Service

Create a simple Express backend in a new directory (e.g., `backend`):

```js
// backend/index.js
const express = require('express');
const { Pool } = require('pg');
const cors = require('cors');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const app = express();
app.use(cors());
app.use(express.json());

// PostgreSQL connection pool
const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT || 5432,
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).send('OK');
});

// Authentication endpoint
app.post('/auth/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    
    const result = await pool.query(
      'SELECT * FROM users WHERE email = $1',
      [username]
    );
    
    if (result.rows.length === 0) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    
    const user = result.rows[0];
    const passwordValid = await bcrypt.compare(password, user.password);
    
    if (!passwordValid) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    
    // Create JWT token
    const token = jwt.sign(
      { userId: user.id, role: user.role },
      process.env.JWT_SECRET || 'your-temporary-secret-key',
      { expiresIn: '8h' }
    );
    
    res.json({
      token,
      user: {
        id: user.id,
        email: user.email,
        firstName: user.first_name,
        lastName: user.last_name,
        role: user.role
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Middleware to verify JWT token
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  
  if (!token) return res.status(401).json({ error: 'Authentication required' });
  
  jwt.verify(token, process.env.JWT_SECRET || 'your-temporary-secret-key', (err, user) => {
    if (err) return res.status(403).json({ error: 'Invalid token' });
    req.user = user;
    next();
  });
};

// Example protected route
app.get('/jobs', authenticateToken, async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM jobs ORDER BY created_at DESC');
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching jobs:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Add more endpoints for candidates, applications, etc.

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
```

Create a Dockerfile for the backend:

```dockerfile
# backend/Dockerfile
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

EXPOSE 3000

CMD ["node", "index.js"]
```

## Step 5: Deploy Your Backend to Coolify

1. **From the Coolify dashboard**, click "Create Service"
2. **Select your Git repository** and switch to the `backend` directory
3. **Configure the deployment**:
   - Select Node.js as the runtime
   - Specify build and start commands based on your backend
   - Add environment variables for PostgreSQL connection:
     ```
     DB_USER=your_db_username
     DB_HOST=your_db_host
     DB_NAME=your_db_name
     DB_PASSWORD=your_db_password
     DB_PORT=5432
     JWT_SECRET=generate_a_strong_random_secret
     ```
4. **Deploy the backend**

## Step 6: Deploy Your Frontend to Coolify

1. **From the Coolify dashboard**, click "Create Service" again
2. **Select your Git repository** and use the main directory
3. **Configure the deployment**:
   - Use a static site template or Docker template
   - Set the Docker build context to your repository root
   - Ensure your Dockerfile includes all the necessary build steps:
     ```dockerfile
     FROM node:18-alpine as build
     WORKDIR /app
     COPY package*.json ./
     RUN npm install
     COPY . .
     RUN npm run build

     # Serving stage
     FROM nginx:alpine
     COPY --from=build /app/dist /usr/share/nginx/html
     COPY nginx.conf /etc/nginx/conf.d/default.conf
     EXPOSE 80
     CMD ["nginx", "-g", "daemon off;"]
     ```
4. **Add environment variables** if needed for your frontend
5. **Deploy the frontend**

## Step 7: Initialize Your Database

After deploying your backend, you need to create the database schema and seed initial data.

### Option 1: Using Prisma (Recommended)

1. **Create a Prisma schema** in your backend project:

```prisma
// prisma/schema.prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

model User {
  id        String   @id @default(uuid())
  email     String   @unique
  password  String
  firstName String   @map("first_name")
  lastName  String   @map("last_name")
  role      Role     @default(admin)
  createdAt DateTime @default(now()) @map("created_at")
  updatedAt DateTime @updatedAt @map("updated_at")
  
  jobs               Job[]
  shortlistingCriteria ShortlistingCriteria[]
  
  @@map("users")
}

model Job {
  id                String   @id @default(uuid())
  title             String
  company           String
  location          String
  type              String
  salary            String
  description       String
  requirements      String[]
  skills            String[]
  minQualification  String   @map("min_qualification")
  yearsOfExperience Int      @map("years_of_experience")
  postedDate        DateTime @map("posted_date")
  closingDate       DateTime @map("closing_date")
  featured          Boolean  @default(false)
  logo              String?
  createdAt         DateTime @default(now()) @map("created_at")
  updatedAt         DateTime @updatedAt @map("updated_at")
  createdBy         String   @map("created_by")
  
  user              User     @relation(fields: [createdBy], references: [id])
  applications      Application[]
  shortlistingCriteria ShortlistingCriteria?
  
  @@map("jobs")
}

model Candidate {
  id               String   @id @default(uuid())
  firstName        String   @map("first_name")
  lastName         String   @map("last_name")
  email            String   @unique
  phone            String
  address          String
  city             String
  country          String
  nationalId       String?  @map("national_id")
  dateOfBirth      DateTime @map("date_of_birth")
  gender           String
  highestEducation String   @map("highest_education")
  yearsOfExperience Int      @map("years_of_experience")
  currentPosition  String?  @map("current_position")
  currentEmployer  String?  @map("current_employer")
  skills           String[]
  resumeUrl        String?  @map("resume_url")
  photoUrl         String?  @map("photo_url")
  createdAt        DateTime @default(now()) @map("created_at")
  updatedAt        DateTime @updatedAt @map("updated_at")
  
  education      Education[]
  experience     Experience[]
  applications   Application[]
  shortCourses   ShortCourse[]
  publications   Publication[]
  referees       Referee[]
  
  @@map("candidates")
}

model Application {
  id          String   @id @default(uuid())
  jobId       String   @map("job_id")
  candidateId String   @map("candidate_id")
  status      String   @default("applied")
  appliedDate DateTime @default(now()) @map("applied_date")
  lastUpdated DateTime @updatedAt @map("last_updated")
  coverLetter String?  @map("cover_letter")
  
  job       Job       @relation(fields: [jobId], references: [id])
  candidate Candidate @relation(fields: [candidateId], references: [id])
  
  @@map("applications")
}

model Education {
  id          String   @id @default(uuid())
  candidateId String   @map("candidate_id")
  institution String
  degree      String
  fieldOfStudy String   @map("field_of_study")
  startDate   DateTime @map("start_date")
  endDate     DateTime? @map("end_date")
  
  candidate   Candidate @relation(fields: [candidateId], references: [id])
  
  @@map("education")
}

model Experience {
  id          String   @id @default(uuid())
  candidateId String   @map("candidate_id")
  company     String
  position    String
  startDate   DateTime @map("start_date")
  endDate     DateTime? @map("end_date")
  description String?
  
  candidate   Candidate @relation(fields: [candidateId], references: [id])
  
  @@map("experience")
}

model ShortCourse {
  id          String   @id @default(uuid())
  candidateId String   @map("candidate_id")
  title       String
  institution String
  completionDate DateTime @map("completion_date")
  
  candidate   Candidate @relation(fields: [candidateId], references: [id])
  
  @@map("short_courses")
}

model Publication {
  id          String   @id @default(uuid())
  candidateId String   @map("candidate_id")
  title       String
  journal     String
  publishDate DateTime @map("publish_date")
  url         String?
  
  candidate   Candidate @relation(fields: [candidateId], references: [id])
  
  @@map("publications")
}

model Referee {
  id          String   @id @default(uuid())
  candidateId String   @map("candidate_id")
  name        String
  position    String
  company     String
  email       String
  phone       String
  
  candidate   Candidate @relation(fields: [candidateId], references: [id])
  
  @@map("referees")
}

model ShortlistingCriteria {
  id                String   @id @default(uuid())
  jobId             String   @unique @map("job_id")
  userId            String   @map("user_id")
  minYearsExperience Int     @map("min_years_experience")
  requiredSkills    String[] @map("required_skills")
  education         String
  createdAt         DateTime @default(now()) @map("created_at")
  updatedAt         DateTime @updatedAt @map("updated_at")
  
  job               Job     @relation(fields: [jobId], references: [id])
  user              User    @relation(fields: [userId], references: [id])
  
  @@map("shortlisting_criteria")
}

enum Role {
  admin
  recruiter
  manager
}
```

2. **Update your backend to use Prisma**:

```js
// Add to your backend:
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Then replace direct pg queries with prisma
```

3. **Create a migration**:

```bash
npx prisma migrate dev --name init
```

4. **Create a seed script** (prisma/seed.js):

```js
const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt');

const prisma = new PrismaClient();

async function main() {
  // Create admin user
  const hashedPassword = await bcrypt.hash('kenyaDLC00', 10);
  
  await prisma.user.upsert({
    where: { email: 'admin@example.com' },
    update: {},
    create: {
      email: 'admin',
      password: hashedPassword,
      firstName: 'Admin',
      lastName: 'User',
      role: 'admin',
    },
  });
  
  console.log('Database has been seeded.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
```

5. **Run the seed script**:

```bash
npx prisma db seed
```

### Option 2: Using Direct SQL

If you prefer to use raw SQL:

1. **Connect to your PostgreSQL database** using Coolify's database console or a tool like psql, DBeaver, or pgAdmin.

2. **Execute SQL commands** to create your schema:

```sql
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  first_name VARCHAR(100) NOT NULL,
  last_name VARCHAR(100) NOT NULL,
  role VARCHAR(20) NOT NULL DEFAULT 'admin',
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE TABLE jobs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title VARCHAR(255) NOT NULL,
  company VARCHAR(255) NOT NULL,
  location VARCHAR(255) NOT NULL,
  type VARCHAR(50) NOT NULL,
  salary VARCHAR(100) NOT NULL,
  description TEXT NOT NULL,
  requirements TEXT[] NOT NULL,
  skills TEXT[] NOT NULL,
  min_qualification VARCHAR(100) NOT NULL,
  years_of_experience INTEGER NOT NULL,
  posted_date TIMESTAMP NOT NULL,
  closing_date TIMESTAMP NOT NULL,
  featured BOOLEAN DEFAULT false,
  logo VARCHAR(255),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  created_by UUID REFERENCES users(id)
);

-- Continue with all other tables...
```

3. **Insert initial admin user**:

```sql
-- Using bcrypt hash for password 'kenyaDLC00'
INSERT INTO users (id, email, password, first_name, last_name, role, created_at, updated_at)
VALUES (
  gen_random_uuid(),
  'admin',
  '$2a$10$gH7VuUP/gGqZEe5kJFLRROv4KGjgAkRwE23hHXgQVQoCiVEJvOveu',
  'Admin',
  'User',
  'admin',
  NOW(),
  NOW()
);
```

## Step 8: Update Your Frontend to Connect to the API

Once your backend is deployed and connected to the database, modify your frontend to use the API:

1. **Create an API service**:

```typescript
// src/services/api.ts
const API_URL = import.meta.env.VITE_API_URL || '/api';

export const login = async (username: string, password: string) => {
  const response = await fetch(`${API_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Login failed');
  }

  return response.json();
};

export const getJobs = async () => {
  const token = localStorage.getItem('token');
  
  const response = await fetch(`${API_URL}/jobs`, {
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error('Failed to fetch jobs');
  }

  return response.json();
};

// Add more API methods for other endpoints
```

2. **Update the login component**:

```typescript
// In AdminLogin.tsx
import { login } from '../services/api';

// Replace the handleLogin function:
const handleLogin = async (e: React.FormEvent) => {
  e.preventDefault();
  setIsLoading(true);
  
  try {
    const data = await login(username, password);
    
    // Store token and user info
    localStorage.setItem('token', data.token);
    localStorage.setItem('adminLoggedIn', 'true');
    
    toast({
      title: "Login Successful",
      description: "Welcome to the admin dashboard.",
    });
    navigate('/dashboard');
  } catch (error) {
    toast({
      title: "Login Failed",
      description: error instanceof Error ? error.message : "Invalid username or password.",
      variant: "destructive",
    });
  } finally {
    setIsLoading(false);
  }
};
```

## Step 9: Configure Networking and Security

1. **Link the Frontend and Backend Services**:
   - In Coolify, you can link services so they can communicate with each other
   - Make sure the frontend can access the backend via the `/api` proxy route

2. **Set Up SSL**:
   - Coolify provides Let's Encrypt integration
   - Configure SSL certificates for your domains

3. **Security Headers**:
   - Ensure proper security headers are in place (Coolify helps with this)

## Step 10: Monitoring and Maintenance

1. **Set Up Logging**:
   - Configure logging for both frontend and backend
   - Consider using a logging service for production

2. **Database Backups**:
   - Set up regular PostgreSQL backups in Coolify
   - Test backup restoration process

3. **Performance Monitoring**:
   - Use Coolify's monitoring tools
   - Consider additional APM tools if needed

## Troubleshooting Common Issues

1. **Database Connection Failures**:
   - Verify the database connection string
   - Check network connectivity between services
   - Ensure the database service is running

2. **Authentication Issues**:
   - Verify JWT secret is consistent
   - Check token expiration settings
   - Confirm user credentials in database

3. **API Communication Problems**:
   - Verify nginx configuration
   - Check CORS settings
   - Validate API endpoints and routes

## Scaling Your Application

As your Talent ATS grows, consider:

1. **Horizontal Scaling**:
   - Add more instances of your frontend and backend
   - Configure load balancing

2. **Database Optimization**:
   - Add indexes for frequently accessed columns
   - Optimize queries
   - Consider read replicas for heavy workloads

3. **Caching**:
   - Implement Redis for caching
   - Use browser caching for assets

## Conclusion

By following this guide, you'll have a fully functional Talent ATS application deployed on Coolify, connected to a PostgreSQL database. The system will be production-ready with authentication, API endpoints, and a proper database schema.

Remember to keep your database credentials secure and regularly back up your data.
