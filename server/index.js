
/**
 * Backend Server for Talent ATS
 * This server connects to the PostgreSQL database and provides APIs
 */

const express = require('express');
const { Pool } = require('pg');
const cors = require('cors');
const path = require('path');
const app = express();
const port = process.env.PORT || 3000;

// Enable CORS and JSON parsing
app.use(cors());
app.use(express.json());

// Import database configuration from environment or use defaults
const dbConfig = {
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '5432'),
  database: process.env.DB_NAME || 'ats_recruitment',
  user: process.env.DB_USER || 'ats_admin',
  password: process.env.DB_PASSWORD || 'situm@2014',
  ssl: process.env.DB_SSL === 'true' ? { rejectUnauthorized: false } : false
};

console.log('Connecting to database:', {
  host: dbConfig.host,
  port: dbConfig.port,
  database: dbConfig.database,
  user: dbConfig.user,
  ssl: dbConfig.ssl ? 'enabled' : 'disabled'
});

// Create PostgreSQL connection pool
const pool = new Pool(dbConfig);

// Test connection on startup
pool.query('SELECT NOW()', (err, res) => {
  if (err) {
    console.error('Database connection failed:', err);
  } else {
    console.log('Database connected successfully at:', res.rows[0].now);
  }
});

// Health check endpoint
app.get('/health', async (req, res) => {
  try {
    const result = await pool.query('SELECT NOW()');
    res.json({
      status: 'ok',
      database: 'connected',
      timestamp: result.rows[0].now,
      config: {
        host: dbConfig.host,
        database: dbConfig.database,
        ssl: dbConfig.ssl ? 'enabled' : 'disabled'
      }
    });
  } catch (error) {
    console.error('Health check failed:', error);
    res.status(500).json({
      status: 'error',
      database: 'disconnected',
      error: error.message
    });
  }
});

// Authentication endpoint
app.post('/auth/login', async (req, res) => {
  const { username, password } = req.body;

  try {
    const result = await pool.query(
      'SELECT id, email, "firstName", "lastName", role FROM users WHERE email = $1 AND password = $2',
      [username, password]
    );

    if (result.rows.length === 0) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const user = result.rows[0];
    
    // Success - send back user data
    res.json({
      token: 'sample-jwt-token',
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Server error', details: error.message });
  }
});

// API routes for jobs
app.get('/jobs', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM jobs ORDER BY "postedDate" DESC');
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching jobs:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// API routes for settings
app.get('/settings', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM settings LIMIT 1');
    if (result.rows.length === 0) {
      return res.json(null);
    }
    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error fetching settings:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

app.post('/settings', async (req, res) => {
  try {
    const {
      company_name,
      system_email,
      timezone,
      date_format,
      email_notifications,
      new_application_alerts,
      job_posting_expiry_alerts,
      min_years_experience,
      min_qualification,
      skill_match_threshold,
      automatic_shortlisting
    } = req.body;

    // Check if settings already exist
    const checkResult = await pool.query('SELECT id FROM settings LIMIT 1');
    
    let result;
    if (checkResult.rows.length > 0) {
      // Update existing settings
      result = await pool.query(
        `UPDATE settings 
         SET company_name = $1, system_email = $2, timezone = $3, date_format = $4,
             email_notifications = $5, new_application_alerts = $6, job_posting_expiry_alerts = $7,
             min_years_experience = $8, min_qualification = $9, skill_match_threshold = $10,
             automatic_shortlisting = $11, updated_at = NOW()
         WHERE id = $12
         RETURNING *`,
        [
          company_name, system_email, timezone, date_format,
          email_notifications, new_application_alerts, job_posting_expiry_alerts,
          min_years_experience, min_qualification, skill_match_threshold,
          automatic_shortlisting, checkResult.rows[0].id
        ]
      );
    } else {
      // Insert new settings
      result = await pool.query(
        `INSERT INTO settings 
         (company_name, system_email, timezone, date_format,
          email_notifications, new_application_alerts, job_posting_expiry_alerts,
          min_years_experience, min_qualification, skill_match_threshold, 
          automatic_shortlisting)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
         RETURNING *`,
        [
          company_name, system_email, timezone, date_format,
          email_notifications, new_application_alerts, job_posting_expiry_alerts,
          min_years_experience, min_qualification, skill_match_threshold,
          automatic_shortlisting
        ]
      );
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error saving settings:', error);
    res.status(500).json({ error: 'Server error', details: error.message });
  }
});

// API route for sending emails
app.post('/api/send-email', async (req, res) => {
  try {
    const { to, subject, html, text } = req.body;
    
    // In a real implementation, you would use a library like nodemailer to send emails
    // For now, we'll just log the email
    console.log('Email sent:', { to, subject });
    
    res.json({ success: true, message: 'Email sent (simulated)' });
  } catch (error) {
    console.error('Error sending email:', error);
    res.status(500).json({ error: 'Server error', details: error.message });
  }
});

// Serve static assets in production
if (process.env.NODE_ENV === 'production') {
  // Set static folder
  app.use(express.static(path.join(__dirname, '../build')));

  app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, '../build', 'index.html'));
  });
}

// Generic error handling
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!', details: err.message });
});

// Start the server
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
