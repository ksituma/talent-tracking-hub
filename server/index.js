
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
const nodemailer = require('nodemailer');

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
    // First check if the settings table exists
    const tableExistsCheck = await pool.query(`
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_schema = 'public' 
        AND table_name = 'settings'
      );
    `);
    
    if (!tableExistsCheck.rows[0].exists) {
      // Create the settings table if it doesn't exist
      await pool.query(`
        CREATE TABLE IF NOT EXISTS settings (
          id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
          company_name VARCHAR(255) NOT NULL DEFAULT 'TalentATS Inc.',
          system_email VARCHAR(255) NOT NULL DEFAULT 'recruitment@talentats.com',
          timezone VARCHAR(50) NOT NULL DEFAULT 'UTC+0',
          date_format VARCHAR(50) NOT NULL DEFAULT 'MM/DD/YYYY',
          email_notifications BOOLEAN DEFAULT true,
          new_application_alerts BOOLEAN DEFAULT true,
          job_posting_expiry_alerts BOOLEAN DEFAULT true,
          min_years_experience INTEGER DEFAULT 2,
          min_qualification VARCHAR(100) DEFAULT 'bachelors',
          skill_match_threshold INTEGER DEFAULT 70,
          automatic_shortlisting BOOLEAN DEFAULT true,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );
      `);
    }
    
    const result = await pool.query('SELECT * FROM settings LIMIT 1');
    if (result.rows.length === 0) {
      // No settings found, create default settings
      const insertResult = await pool.query(`
        INSERT INTO settings (company_name, system_email, timezone, date_format) 
        VALUES ('TalentATS Inc.', 'recruitment@talentats.com', 'UTC+0', 'MM/DD/YYYY')
        RETURNING *
      `);
      return res.json(insertResult.rows[0]);
    }
    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error fetching settings:', error);
    res.status(500).json({ error: 'Server error', details: error.message });
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

    // Make sure the settings table exists
    await pool.query(`
      CREATE TABLE IF NOT EXISTS settings (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        company_name VARCHAR(255) NOT NULL DEFAULT 'TalentATS Inc.',
        system_email VARCHAR(255) NOT NULL DEFAULT 'recruitment@talentats.com',
        timezone VARCHAR(50) NOT NULL DEFAULT 'UTC+0',
        date_format VARCHAR(50) NOT NULL DEFAULT 'MM/DD/YYYY',
        email_notifications BOOLEAN DEFAULT true,
        new_application_alerts BOOLEAN DEFAULT true,
        job_posting_expiry_alerts BOOLEAN DEFAULT true,
        min_years_experience INTEGER DEFAULT 2,
        min_qualification VARCHAR(100) DEFAULT 'bachelors',
        skill_match_threshold INTEGER DEFAULT 70,
        automatic_shortlisting BOOLEAN DEFAULT true,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

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

// Configure nodemailer with Gmail SMTP
const createTransporter = () => {
  const gmailUser = process.env.GMAIL_USER;
  const gmailAppPassword = process.env.GMAIL_APP_PASSWORD;
  
  if (!gmailUser || !gmailAppPassword) {
    console.warn('Gmail credentials not configured. Email functionality will not work.');
    return null;
  }
  
  return nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: gmailUser,
      pass: gmailAppPassword
    }
  });
};

// API route for sending emails
app.post('/api/send-email', async (req, res) => {
  try {
    const { to, subject, html, text, from } = req.body;
    
    // Validate required fields
    if (!to || !subject || (!html && !text)) {
      return res.status(400).json({ 
        error: 'Missing required fields', 
        details: 'to, subject, and either html or text are required' 
      });
    }
    
    const transporter = createTransporter();
    
    if (!transporter) {
      return res.status(500).json({ 
        error: 'Email service not configured',
        details: 'The server is not configured with valid email credentials'
      });
    }
    
    // Get system email from settings
    const settingsResult = await pool.query('SELECT system_email FROM settings LIMIT 1');
    const systemEmail = settingsResult.rows.length > 0 ? 
      settingsResult.rows[0].system_email : 
      'no-reply@talentats.com';
    
    const mailOptions = {
      from: from || systemEmail,
      to: Array.isArray(to) ? to.join(',') : to,
      subject,
      text: text || undefined,
      html: html || undefined
    };
    
    console.log('Sending email to:', to);
    const info = await transporter.sendMail(mailOptions);
    
    res.json({ 
      success: true, 
      message: 'Email sent successfully', 
      messageId: info.messageId 
    });
  } catch (error) {
    console.error('Error sending email:', error);
    res.status(500).json({ 
      error: 'Failed to send email', 
      details: error.message 
    });
  }
});

// User management routes
app.get('/api/users/profile', async (req, res) => {
  try {
    // In a real implementation, this would validate the JWT token
    // For now, just return the first user (admin)
    const result = await pool.query('SELECT id, email, "firstName", "lastName", role FROM users LIMIT 1');
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error fetching user profile:', error);
    res.status(500).json({ error: 'Server error', details: error.message });
  }
});

app.post('/api/auth/logout', (req, res) => {
  // In a real implementation, this would invalidate the JWT token
  res.json({ success: true, message: 'Logged out successfully' });
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
