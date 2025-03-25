
#!/bin/bash
# Deployment script for Talent ATS on Ubuntu 22.04
# This script automates the deployment process on a fresh Ubuntu 22.04 server

set -e  # Exit on error

# Function to display progress messages
log() {
  echo -e "\n\033[1;32m>>> $1\033[0m\n"
}

# Check if running as root
if [ "$(id -u)" -ne 0 ]; then
    echo "This script must be run as root or with sudo"
    exit 1
fi

log "Updating system packages"
apt-get update
apt-get upgrade -y

log "Installing dependencies"
apt-get install -y curl wget git nginx ufw postgresql postgresql-contrib

log "Setting up Node.js v18"
curl -fsSL https://deb.nodesource.com/setup_18.x | bash -
apt-get install -y nodejs
npm install -g pm2

log "Setting up PostgreSQL"
# Start and enable PostgreSQL service
systemctl start postgresql
systemctl enable postgresql

# Creating PostgreSQL user and database
su - postgres -c "psql -c \"CREATE USER ats_admin WITH PASSWORD 'situm@2014';\""
su - postgres -c "psql -c \"CREATE DATABASE ats_recruitment;\""
su - postgres -c "psql -c \"ALTER USER ats_admin WITH SUPERUSER;\""
su - postgres -c "psql -c \"GRANT ALL PRIVILEGES ON DATABASE ats_recruitment TO ats_admin;\""

# Create application directory
APP_DIR="/var/www/talent-ats"
log "Creating application directory at $APP_DIR"
mkdir -p $APP_DIR
cd $APP_DIR

# Clone application repository (uncomment and modify this line with your actual repo)
log "Cloning application repository"
# git clone https://github.com/your-username/talent-ats.git .

# If the repository has already been cloned or files are deployed by other means
# Copy db-init.sql to a temporary location to ensure it exists for the next step
if [ -f "$APP_DIR/scripts/db-init.sql" ]; then
  cp "$APP_DIR/scripts/db-init.sql" /tmp/db-init.sql
  log "Copied database initialization script to /tmp/db-init.sql"
else
  log "Warning: Database initialization script not found. Database schema will not be initialized automatically."
fi

# Create tables from SQL file if it exists
log "Initializing database schema"
if [ -f "/tmp/db-init.sql" ]; then
  su - postgres -c "psql -d ats_recruitment -f /tmp/db-init.sql"
  log "Database schema initialized successfully"
else
  log "Skipping schema initialization. You'll need to manually import the schema later."
fi

log "Configuring firewall"
ufw allow 22/tcp      # SSH
ufw allow 80/tcp      # HTTP
ufw allow 443/tcp     # HTTPS
ufw --force enable

log "Installing application dependencies"
if [ -f "$APP_DIR/package.json" ]; then
  cd $APP_DIR
  npm install
  npm run build
  log "Application built successfully"
else
  log "Warning: package.json not found. Skipping npm install and build."
fi

log "Setting up Nginx"
cat > /etc/nginx/sites-available/talent-ats << 'EOF'
server {
  listen 80;
  server_name _;

  # Application files
  root /var/www/talent-ats/build;
  index index.html;
  
  # Handle API requests - proxy to backend service
  location /api/ {
    proxy_pass http://localhost:3000/;
    proxy_http_version 1.1;
    proxy_set_header Upgrade $http_upgrade;
    proxy_set_header Connection 'upgrade';
    proxy_set_header Host $host;
    proxy_cache_bypass $http_upgrade;
  }
  
  # Health check endpoint for database connectivity testing
  location /health {
    proxy_pass http://localhost:3000/health;
    proxy_http_version 1.1;
    proxy_set_header Host $host;
    proxy_cache_bypass $http_upgrade;
  }
  
  # All other routes go to index.html for client-side routing
  location / {
    try_files $uri $uri/ /index.html;
  }
}
EOF

# Enable the site
ln -sf /etc/nginx/sites-available/talent-ats /etc/nginx/sites-enabled/
rm -f /etc/nginx/sites-enabled/default
nginx -t  # Test configuration
systemctl restart nginx
systemctl enable nginx

log "Setting up PM2 for the Node.js backend"
cat > $APP_DIR/ecosystem.config.js << EOF
module.exports = {
  apps: [{
    name: 'talent-ats-backend',
    script: 'server/index.js',
    instances: 1,
    autorestart: true,
    watch: false,
    max_memory_restart: '1G',
    env: {
      NODE_ENV: 'production',
      PORT: 3000,
      DB_HOST: 'localhost',
      DB_PORT: 5432,
      DB_NAME: 'ats_recruitment',
      DB_USER: 'ats_admin',
      DB_PASSWORD: 'situm@2014',
      DB_SSL: 'false'
    }
  }]
};
EOF

cd $APP_DIR
if [ -f "$APP_DIR/server/index.js" ]; then
  pm2 start ecosystem.config.js
  pm2 save
  pm2 startup systemd
  log "PM2 started and configured to start on boot"
else
  log "Warning: server/index.js not found. PM2 service not started."
fi

log "Setup complete! Your Talent ATS application should now be running."
log "Access your application at http://your_server_ip"
log "For detailed information on deploying with Coolify, see: /var/www/talent-ats/src/utils/coolify-deployment-guide.md"
