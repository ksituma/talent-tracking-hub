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
  ssl?: boolean;
}

// Parse connection string into config object
export const parseDatabaseUrl = (connectionString: string): DatabaseConfig => {
  try {
    // Expected format: postgres://username:password@host:port/database
    const url = new URL(connectionString);
    
    return {
      host: url.hostname,
      port: parseInt(url.port || '5432'),
      database: url.pathname.replace('/', ''),
      user: url.username,
      password: url.password,
      ssl: url.searchParams.get('sslmode') === 'require'
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
    ssl: process.env.DB_SSL === 'true'
  };
};

// Export the database configuration
export const dbConfig = getDatabaseConfig();

// Database connection check function
export const checkDatabaseConnection = async (): Promise<boolean> => {
  // This is a placeholder - the actual implementation will be done in server/index.js
  console.log('Checking database connection to:', dbConfig.host);
  return true;
};
