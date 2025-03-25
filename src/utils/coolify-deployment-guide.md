# Comprehensive Guide: Deploying Talent ATS on Coolify

This guide provides detailed steps for deploying the Talent ATS application on Coolify with a PostgreSQL database connection.

## Prerequisites

- A Coolify account and server setup
- Access to your code repository (GitHub, GitLab, etc.)
- Basic knowledge of Docker and PostgreSQL

## Step 1: Prepare Your Coolify Environment

1. **Log in to your Coolify dashboard** at [https://coolify.io](https://coolify.io) or your self-hosted instance
2. **Add a new server** if you haven't already:
   - Go to Settings → Servers → Add a new server
   - Follow the instructions to connect your Ubuntu 22.04 server to Coolify

## Step 2: Set Up PostgreSQL Database in Coolify

1. **Create a new PostgreSQL resource**:
   - Go to Resources → New Resource → Database → PostgreSQL
   - Fill in the following details:
     - Name: `ats_recruitment` (or your preferred name)
     - Username: `ats_admin`
     - Password: Generate a secure password (or use `situm@2014` if this is for development only)
     - Version: 14 (or latest stable)
     - Click "Create"

2. **Note the connection details** provided by Coolify:
   - Host (likely your server's IP or a container name)
   - Port (default: 5432)
   - Database name
   - Username
   - Password

## Step 3: Prepare Your Application for Deployment

Ensure your repository includes these key files:

- **docker-compose.yml**: For container configuration
- **nginx.conf**: For web server configuration
- **scripts/db-init.sql**: For database initialization
- **server/index.js**: Your backend server
- **src/utils/db-connection.ts**: Database connection configuration

## Step 4: Create/Update Deployment Configuration

Coolify uses a configuration file to manage deployments. Ensure your `.coolify/deployment.json` file is properly configured:

```json
{
  "name": "talent-ats",
  "type": "application",
  "services": {
    "frontend": {
      "dockerCompose": {
        "service": "frontend"
      },
      "healthCheck": {
        "path": "/health",
        "port": 80
      },
      "environment": []
    },
    "backend": {
      "dockerCompose": {
        "service": "backend"
      },
      "healthCheck": {
        "path": "/health",
        "port": 3000
      },
      "environment": [
        {
          "name": "DB_HOST",
          "value": "YOUR_DB_HOST_FROM_COOLIFY"
        },
        {
          "name": "DB_PORT",
          "value": "5432"
        },
        {
          "name": "DB_NAME",
          "value": "ats_recruitment"
        },
        {
          "name": "DB_USER",
          "value": "ats_admin"
        },
        {
          "name": "DB_PASSWORD",
          "value": "YOUR_PASSWORD_FROM_COOLIFY"
        },
        {
          "name": "DB_SSL",
          "value": "false"
        }
      ]
    }
  },
  "database": {
    "type": "postgresql",
    "connection": {
      "url": "postgres://ats_admin:YOUR_PASSWORD@YOUR_DB_HOST:5432/ats_recruitment",
      "host": "YOUR_DB_HOST",
      "port": 5432,
      "name": "ats_recruitment",
      "user": "ats_admin",
      "password": "YOUR_PASSWORD"
    }
  }
}
```

Replace placeholder values with your actual database connection details.

## Step 5: Deploy Your Application in Coolify

1. **Create a new application**:
   - Go to Applications → New Application
   - Select your Git provider (GitHub, GitLab, etc.)
   - Select your repository
   - Choose Docker Compose as the deployment method
   - Click "Create"

2. **Configure deployment settings**:
   - Environment variables:
     - Set all database connection variables (they should be loaded from your `.coolify/deployment.json`)
     - Add any other environment variables your application needs
   - Domains:
     - Add your domain(s) if you have custom domains
     - Configure SSL if needed
   - Advanced Options:
     - Configure build and deploy options as needed

3. **Deploy the application**:
   - Click "Save and Deploy"
   - Wait for the build and deployment process to complete

## Step 6: Initialize Your Database

After the first deployment, you need to initialize your database with the schema:

1. **Connect to your PostgreSQL database** using the Coolify dashboard or terminal:
   ```bash
   # If using terminal on your server:
   psql postgres://ats_admin:YOUR_PASSWORD@YOUR_DB_HOST:5432/ats_recruitment
   ```

2. **Run the database initialization script**:
   ```sql
   \i /path/to/scripts/db-init.sql
   -- OR
   -- Import the script directly from your application files
   ```

   Alternatively, you can modify your deployment to automatically run the initialization script on first deploy.

## Step 7: Post-Deployment Verification

1. **Check the application status** in the Coolify dashboard
2. **Verify database connectivity** by accessing the health endpoint:
   ```
   https://your-domain.com/health
   ```
3. **Test the application functionality** by logging in with the default admin account

## Step 8: Troubleshooting Common Issues

### Database Connection Issues

If you encounter database connection issues:

1. **Verify connection parameters** in your environment variables
2. **Check PostgreSQL logs** in the Coolify dashboard
3. **Ensure the database service is running** correctly
4. **Verify network connectivity** between your application and database

### Application Startup Failures

If your application fails to start:

1. **Check application logs** in the Coolify dashboard
2. **Verify Docker Compose configuration**
3. **Check for Node.js errors** in the backend service logs

## Step 9: Setting Up Continuous Deployment

To enable automatic deployments when you push to your repository:

1. **Configure webhooks** in your Git provider
2. **Set up deployment triggers** in Coolify settings

## Step 10: Production Hardening

Before going to production, consider these security measures:

1. **Update environment variables**:
   - Change database credentials to strong, unique passwords
   - Set NODE_ENV to "production"
   
2. **Configure backups** for your PostgreSQL database
   
3. **Set up monitoring** for your application and database
   
4. **Configure proper logging** for both frontend and backend

## Step 11: Regular Maintenance

Establish a maintenance routine:

1. **Regular backups** of your database
2. **Updates to dependencies** through routine deployments
3. **Performance monitoring** to identify bottlenecks
4. **Security updates** for all components

## Technical Reference: Key Files

### docker-compose.yml

This file defines the services that make up your application:

```yaml
version: '3'

services:
  frontend:
    image: ${FRONTEND_IMAGE:-nginx:alpine}
    restart: unless-stopped
    ports:
      - "${FRONTEND_PORT:-80}:80"
    volumes:
      - ./nginx.conf:/etc/nginx/conf.d/default.conf
      - ./build:/usr/share/nginx/html
    depends_on:
      - backend
    networks:
      - ats-network

  backend:
    image: ${BACKEND_IMAGE:-node:18-alpine}
    restart: unless-stopped
    working_dir: /app
    command: node server/index.js
    environment:
      - PORT=3000
      - NODE_ENV=production
      - DB_HOST=${DB_HOST:-localhost}
      - DB_PORT=${DB_PORT:-5432}
      - DB_NAME=${DB_NAME:-ats_recruitment}
      - DB_USER=${DB_USER:-ats_admin}
      - DB_PASSWORD=${DB_PASSWORD:-situm@2014}
      - DB_SSL=${DB_SSL:-false}
    volumes:
      - ./:/app
    networks:
      - ats-network

networks:
  ats-network:
    driver: bridge
```

### Database Connection Configuration

In `src/utils/db-connection.ts`, ensure the database configuration reads from environment variables set in Coolify:

```typescript
/**
 * Database Connection Configuration
 * This file manages the connection to the PostgreSQL database.
 */

// Define interface for database configuration
interface DatabaseConfig {
  host: string;
  port: number;
  database: string;
  user: string;
  password: string;
  ssl?: boolean | object;
}

// Parse connection string into config object
export const parseDatabaseUrl = (connectionString: string): DatabaseConfig => {
  try {
    // Expected format: postgres://username:password@host:port/database
    const url = new URL(connectionString);
    
    const sslMode = url.searchParams.get('sslmode');
    const ssl = sslMode === 'require' ? 
      { rejectUnauthorized: false } : 
      (sslMode === 'true' ? true : false);
    
    return {
      host: url.hostname,
      port: parseInt(url.port || '5432'),
      database: url.pathname.replace(/^\//, ''),
      user: url.username,
      password: url.password,
      ssl
    };
  } catch (error) {
    console.error('Failed to parse database connection string:', error);
    throw new Error('Invalid database connection string');
  }
};

// Get database configuration from environment variable or fallback to local PostgreSQL
const getDatabaseConfig = (): DatabaseConfig => {
  // If DATABASE_URL environment variable is set, use it
  if (process.env.DATABASE_URL) {
    return parseDatabaseUrl(process.env.DATABASE_URL);
  }
  
  // Otherwise use individual environment variables or fallback to defaults
  return {
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT || '5432'),
    database: process.env.DB_NAME || 'ats_recruitment',
    user: process.env.DB_USER || 'ats_admin',
    password: process.env.DB_PASSWORD || 'situm@2014',
    ssl: process.env.DB_SSL === 'true' ? { rejectUnauthorized: false } : false
  };
};
```

## Conclusion

By following this guide, you should have successfully deployed your Talent ATS application on Coolify with PostgreSQL database integration. If you encounter issues during the deployment process, refer to Coolify's documentation or reach out to their support team for assistance.
