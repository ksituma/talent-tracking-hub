
# PostgreSQL Database Setup Guide for Talent ATS with Coolify

This guide explains how to set up a PostgreSQL database for the Talent ATS application when deploying with Coolify.

## Coolify Deployment Overview

Coolify is a self-hosted PaaS (Platform as a Service) that makes it easy to deploy applications and databases. Here's how to deploy your Talent ATS application with a PostgreSQL database on Coolify:

### Step 1: Create a PostgreSQL Database in Coolify

1. **Access your Coolify dashboard** and navigate to "Resources"
2. **Click "New Resource"** and select "PostgreSQL"
3. **Configure your PostgreSQL database**:
   - Name: `talent_ats_db` (or your preferred name)
   - Username: Create a secure username
   - Password: Generate a strong password
   - Version: Select the latest PostgreSQL version (14 or newer recommended)
4. **Create the database** and wait for it to be provisioned
5. **Save the connection details** provided by Coolify:
   - Host
   - Port (usually 5432)
   - Database name
   - Username
   - Password

### Step 2: Deploy Your Application in Coolify

1. **Create a new service** in Coolify
2. **Connect to your Git repository** containing the Talent ATS code
3. **Configure build settings**:
   - Build command: `npm run build`
   - Output directory: `dist`
   - Use the Dockerfile in your repository

4. **Add environment variables**:
   ```
   DATABASE_URL=postgresql://username:password@db-host:5432/dbname
   ```
   Replace with your actual PostgreSQL connection details from Step 1.

5. **Deploy your application**

### Step 3: Initialize Your Database

After deploying your application, you need to initialize your database with the schema defined in `db-schema.ts`.

#### Option 1: Using Prisma (Recommended)

1. **Install Prisma in your development environment**:
   ```bash
   npm install prisma @prisma/client
   npx prisma init
   ```

2. **Create a Prisma schema** based on the interfaces in `db-schema.ts`:
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
   
   // Define remaining models for Candidate, Application, Education, etc.
   // based on the interfaces in db-schema.ts
   
   enum Role {
     admin
     recruiter
     manager
   }
   ```

3. **Generate Prisma client**:
   ```bash
   npx prisma generate
   ```

4. **Run migrations**:
   ```bash
   npx prisma migrate dev --name init
   ```

5. **Seed initial admin user**:
   Create a seed script (`prisma/seed.ts`):
   ```typescript
   import { PrismaClient } from '@prisma/client';
   import * as bcrypt from 'bcrypt';
   
   const prisma = new PrismaClient();
   
   async function main() {
     // Create admin user
     const hashedPassword = await bcrypt.hash('kenyaDLC00', 10);
     
     await prisma.user.upsert({
       where: { email: 'admin@example.com' },
       update: {},
       create: {
         email: 'admin@example.com',
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

6. **Run the seed script**:
   ```bash
   npx prisma db seed
   ```

#### Option 2: Direct SQL (Alternative)

If you prefer to use raw SQL instead of an ORM, you can execute SQL statements directly:

1. **Connect to your PostgreSQL database** using a tool like psql, pgAdmin, or the Coolify database console.

2. **Create tables** based on the interfaces in `db-schema.ts`:
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
   
   -- Create remaining tables for candidates, applications, education, etc.
   -- based on the interfaces in db-schema.ts
   ```

3. **Insert initial admin user**:
   ```sql
   -- Using bcrypt hash for password 'kenyaDLC00'
   INSERT INTO users (id, email, password, first_name, last_name, role, created_at, updated_at)
   VALUES (
     gen_random_uuid(),
     'admin@example.com',
     '$2a$10$gH7VuUP/gGqZEe5kJFLRROv4KGjgAkRwE23hHXgQVQoCiVEJvOveu',
     'Admin',
     'User',
     'admin',
     NOW(),
     NOW()
   );
   ```

## Transitioning Your Application to Use the Database

Once your database is set up, you need to modify your application to use it instead of localStorage:

1. **Create API endpoints** for your entities (jobs, candidates, applications, etc.)
2. **Update frontend components** to fetch data from these endpoints
3. **Implement authentication** using the database

### Backend Implementation Considerations

When implementing your backend API:

1. **Use environment variables** for database connection:
   ```typescript
   // Example with Express and Prisma
   import express from 'express';
   import { PrismaClient } from '@prisma/client';
   import bcrypt from 'bcrypt';
   import jwt from 'jsonwebtoken';

   const app = express();
   const prisma = new PrismaClient();
   
   app.use(express.json());
   
   // Authentication endpoint
   app.post('/api/login', async (req, res) => {
     try {
       const { username, password } = req.body;
       
       const user = await prisma.user.findUnique({
         where: { email: username },
       });
       
       if (!user) {
         return res.status(401).json({ error: 'Invalid credentials' });
       }
       
       const validPassword = await bcrypt.compare(password, user.password);
       
       if (!validPassword) {
         return res.status(401).json({ error: 'Invalid credentials' });
       }
       
       const token = jwt.sign(
         { userId: user.id, role: user.role },
         process.env.JWT_SECRET || 'your-secret-key',
         { expiresIn: '8h' }
       );
       
       res.json({ 
         token, 
         user: { 
           id: user.id,
           email: user.email,
           firstName: user.firstName,
           lastName: user.lastName,
           role: user.role
         } 
       });
     } catch (error) {
       res.status(500).json({ error: 'Server error' });
     }
   });
   
   // Protected middleware
   const authenticate = (req, res, next) => {
     const token = req.headers.authorization?.split(' ')[1];
     
     if (!token) {
       return res.status(401).json({ error: 'Authentication required' });
     }
     
     try {
       const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');
       req.user = decoded;
       next();
     } catch (error) {
       res.status(401).json({ error: 'Invalid token' });
     }
   };
   
   // Example protected route
   app.get('/api/jobs', authenticate, async (req, res) => {
     try {
       const jobs = await prisma.job.findMany();
       res.json(jobs);
     } catch (error) {
       res.status(500).json({ error: 'Server error' });
     }
   });
   
   const PORT = process.env.PORT || 3000;
   app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
   ```

2. **Implement proper error handling** for database operations
3. **Use parameterized queries** to prevent SQL injection
4. **Implement data validation** using libraries like zod or yup

## Deployment Best Practices with Coolify

1. **Use Docker Compose** for multi-container deployments
2. **Set up proper database backups** in Coolify
3. **Configure health checks** for your application
4. **Set up monitoring** for your database and application
5. **Implement CI/CD** for automated deployments

## Security Considerations

1. **Enable PostgreSQL SSL connections** for secure communication
2. **Implement proper authentication** using JWT or sessions
3. **Use Row-Level Security (RLS)** in PostgreSQL for data access control
4. **Encrypt sensitive data** in the database
5. **Keep your database credentials secure** in Coolify environment variables

## Troubleshooting Common Issues

1. **Connection refused errors**: Check if database service is running and firewall settings
2. **Authentication failures**: Verify database credentials in environment variables
3. **Migration failures**: Check database schema compatibility
4. **Performance issues**: Add proper indexes to frequently queried columns

By following this guide, you should be able to successfully set up and deploy your Talent ATS application with a PostgreSQL database using Coolify.
