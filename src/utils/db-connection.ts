
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
      ssl: false // Set to true if your database requires SSL
    };
  } catch (error) {
    console.error('Failed to parse database connection string:', error);
    throw new Error('Invalid database connection string');
  }
};

// Get database configuration from environment variable or fallback to default
const getDatabaseConfig = (): DatabaseConfig => {
  const defaultConnectionString = 'postgres://ats_admin:situm@2014@ik08k80owwow04w4g80s0wss:5432/postgres';
  const connectionString = process.env.DATABASE_URL || defaultConnectionString;
  
  return parseDatabaseUrl(connectionString);
};

// Export the database configuration
export const dbConfig = getDatabaseConfig();

// Example connection check function
export const checkDatabaseConnection = async (): Promise<boolean> => {
  // This function should be implemented based on your database client
  // For example if using 'pg' package:
  
  try {
    // This is a placeholder - actual implementation would use your chosen database client
    console.log('Checking database connection to:', dbConfig.host);
    
    // Return true if connection succeeds
    return true;
  } catch (error) {
    console.error('Database connection failed:', error);
    return false;
  }
};
