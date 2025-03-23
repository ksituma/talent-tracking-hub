
# Database Setup Guide for Talent ATS

This guide explains how to set up a database for the Talent ATS application when deploying with Coolify.

## Database Schema

The application uses the schema defined in `db-schema.ts`. This schema includes tables for:

- Users (admin users)
- Jobs (job listings)
- Candidates (job applicants)
- Applications (job applications)
- Education (candidate education history)
- Experience (candidate work experience)
- Professional Bodies (professional affiliations)
- Publications
- Short Courses/Certifications
- Referees
- Shortlisting Criteria

## Setting Up PostgreSQL with Coolify

1. **Create a PostgreSQL Database Resource in Coolify**:
   - In your Coolify dashboard, go to "Resources"
   - Click "New Resource" and select "PostgreSQL"
   - Configure the database (name, username, password)
   - Take note of the connection details provided by Coolify

2. **Link the Database to Your Application**:
   - In your application's service configuration in Coolify, add environment variables for the database connection:
     - `DATABASE_URL=postgresql://username:password@db-host:5432/dbname`
   - Make sure to replace with your actual database credentials

3. **Configure the Backend to Use the Database**:
   - Use an ORM like Prisma, TypeORM, or Sequelize to connect to the database
   - Define models based on the schema in `db-schema.ts`

## Authentication Setup

The current application uses a simple authentication system with hardcoded credentials:
- Username: `admin`
- Password: `kenyaDLC00`

When implementing the database-backed authentication:

1. **Create Admin Users Table**:
   - Define schema as per `User` interface in `db-schema.ts`
   - Ensure passwords are properly hashed using bcrypt or similar
   
2. **Seed Initial Admin User**:
   ```sql
   INSERT INTO users (id, email, password, first_name, last_name, role, created_at, updated_at)
   VALUES (
     gen_random_uuid(),
     'admin@example.com',
     -- Store hashed password for 'kenyaDLC00', not plaintext
     '$2a$12$xxxxxx', -- Replace with actual bcrypt hash
     'Admin',
     'User',
     'admin',
     NOW(),
     NOW()
   );
   ```

3. **Update Authentication Logic**:
   - Modify the login endpoint to query the database
   - Verify password with bcrypt compare
   - Issue JWT tokens for session management (recommended over localStorage)

## Example: Setting Up Prisma ORM

1. **Add Prisma to your project**:
   ```bash
   npm install prisma @prisma/client
   npx prisma init
   ```

2. **Define your schema in `prisma/schema.prisma`** based on the interfaces in `db-schema.ts`.

3. **Generate Prisma Client**:
   ```bash
   npx prisma generate
   ```

4. **Run database migrations**:
   ```bash
   npx prisma migrate dev --name init
   ```

## Deployment with Coolify

When deploying with Coolify:

1. Create a `Dockerfile` in your project root:
   ```dockerfile
   FROM node:18-alpine AS builder
   WORKDIR /app
   COPY package*.json ./
   RUN npm ci
   COPY . .
   RUN npm run build

   FROM nginx:alpine
   COPY --from=builder /app/dist /usr/share/nginx/html
   COPY nginx.conf /etc/nginx/conf.d/default.conf
   EXPOSE 80
   CMD ["nginx", "-g", "daemon off;"]
   ```

2. Create an `nginx.conf` file:
   ```nginx
   server {
     listen 80;
     root /usr/share/nginx/html;
     index index.html;
     
     location / {
       try_files $uri $uri/ /index.html;
     }
   }
   ```

3. In Coolify:
   - Connect your Git repository
   - Set the build configuration to use your Dockerfile
   - Link your PostgreSQL database as a resource
   - Set the necessary environment variables
   - Deploy your application

4. Once deployed, run database migrations using Coolify's terminal access feature or set up a migration script in your build process.

## Transitioning from LocalStorage to Database

To transition from using LocalStorage to a real database:

1. Create API endpoints for each entity (jobs, applications, candidates, etc.)
2. Update the frontend code to use these API endpoints instead of LocalStorage
3. Implement proper authentication and authorization for secure access to the API
4. Migrate existing data from LocalStorage to the database (if needed)

## Security Considerations

1. **Password Storage**: 
   - Never store passwords in plaintext
   - Use bcrypt or Argon2 for password hashing
   - Set appropriate work factors for password hashing

2. **Authentication**:
   - Consider implementing JWT-based authentication instead of localStorage
   - Set appropriate token expiration times
   - Implement refresh token rotation for enhanced security

3. **Authorization**:
   - Implement role-based access control (RBAC)
   - Use PostgreSQL Row-Level Security (RLS) policies
   - Validate permissions on both client and server sides

## Testing the Database Connection

You can add a simple API endpoint to test your database connection:

```javascript
app.get('/api/health', async (req, res) => {
  try {
    await prisma.$queryRaw`SELECT 1`;
    res.status(200).json({ status: 'Database connection successful' });
  } catch (error) {
    res.status(500).json({ status: 'Database connection failed', error: error.message });
  }
});
```

This endpoint will respond with a success message if the database connection is working correctly.
